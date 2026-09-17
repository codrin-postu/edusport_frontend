# Security incident, September 2026

Unauthenticated remote code execution in the production frontend, used to run a
cryptominer for roughly 43 hours. Contained and remediated on 16 to 17 September
2026. This document exists so the next person, or the next Claude session, does
not have to re-derive any of it.

All times UTC.

## What happened

| When | What |
|---|---|
| 15 Sep 17:58 | First exploit payload in the frontend container logs |
| 15 Sep 19:09 | Miner starts, roughly 192 percent CPU across both cores |
| 16 Sep 02:41 | Outbound contact to 216.218.185.162, later reported by Spamhaus |
| 16 Sep 11:42 | Miner re-dropped after the first one was killed |
| 16 Sep 12:51 | Evidence captured, miner talking to pool 202.189.8.79:17235 |
| 16 Sep 19:22 | Frontend container stopped, compromise ends |
| 17 Sep 09:22 | Patched build deployed, secrets rotated, unused tokens deleted |

## Root cause

Next.js **15.5.0** was vulnerable to **GHSA-9qr9-h5gf-34mp**, an unauthenticated
RCE in the React flight protocol's Server Action deserialisation. No
authentication, no user interaction, no application bug of ours: our own code
contains no `eval` and no `child_process`.

The tell in the logs was `Failed to find Server Action "x"` immediately before
shell commands appeared. The attacker's toolkit tried `apt-get`, tried to read
`~/.claude/.credentials.json`, and fetched from
`raw.githubusercontent.com/pcgimang/multivitamins`. It failed repeatedly with
`bash: not found` and `curl: not found`, because the image is Alpine-based, and
fell back to `wget`. The miner landed at `/tmp/XXBNPamc`, sha256
`9cb61bfa87fe06d6ebb8dd702db72076d3c21a24ff7de5a1972a16afb2f6fed7`.

## What was exposed

Everything in the frontend container's environment must be assumed leaked:
`STRAPI_API_TOKEN` and `REVALIDATE_SECRET`.

The important and non-obvious part: **the token was of type read-only, and that
was not a mitigation.** Strapi's default auth on a generated `find`/`findOne`
accepts any valid API token regardless of type. Tested against production with
the leaked token at the time: `GET /api/contact-submissions` returned real
submissions including names, email addresses and phone numbers.
`registration-submissions` happened to return zero rows.

**No Claude credentials were on the server.** Claude Code was never installed
there, so the `~/.claude/.credentials.json` read failed against a file that does
not exist. If you use OAuth rather than API keys, nothing of that kind was at
risk here.

## What was NOT compromised

Checked directly, not assumed:

- No host persistence: no rogue cron entries, no new systemd units, and
  `authorized_keys` unchanged since 24 August, which predates the intrusion.
- No other container affected. The frontend container mounts no volumes, so a
  rebuild wipes everything the attacker wrote.
- Postgres, Umami, GlitchTip and skate-results were untouched.
- 7,491 failed SSH password attempts versus 50 successful logins, all of them
  publickey.

## Remediation, all verified in production

1. **Next.js 15.5.0 to 15.5.25**, which closes the advisory.
2. **Submission read routes removed.** `registration-submission` generates no
   content-API routes at all; `contact-submission` exposes `create` only. The
   site posts submissions and never reads them, so the capability was removed
   rather than merely re-secured. Rotating the token alone would have left the
   same hole open for the next leak. Verified: all four endpoints now return 404
   to a valid token.
3. **Container hardening** in every `docker-compose.production.yml`:
   `read_only`, a noexec tmpfs for `/tmp`, `cap_drop: ALL`,
   `no-new-privileges`. Verified: copying a binary into `/tmp` and running it
   fails with `Permission denied`. That is precisely the attacker's second step,
   so this stops a repeat even if another framework bug lands.
4. **SSH password authentication disabled.**
5. **Container egress filtering** (17 Sep, after a Spamhaus listing). See the
   gotchas below: it lives on the VM, not in any repo.
6. **Secrets rotated** (17 Sep) and the two never-used API tokens deleted.

## Spamhaus listing

The IP was listed on the Spamhaus XBL for the 16 Sep 02:41 contact. The report
labels it "tinba", an e-banking trojan; that is the sinkhole's signature
classification of the traffic, not a diagnosis of this server. What actually ran
was a miner plus a credential-grabbing toolkit, and such toolkits reuse
infrastructure across malware families.

**Delisting was deliberately not requested.** XBL listings expire automatically
once detections stop, and the last detection was during the compromise. If it
has not cleared and you need it gone, request removal at
<https://check.spamhaus.org/results/?query=178.105.192.111>, stating the cause,
the patch and the hardening.

## Gotchas a future session will otherwise rediscover the hard way

**The deploy wipes VM-local edits.** Both deploy workflows run
`git reset --hard origin/<ref>` on the VM. Anything fixed in place there is
temporary. During the incident the Next bump and the compose hardening were
applied by hand on the VM, and only survived because they were committed before
the next deploy. If you hot-fix production, commit the same change immediately.

**Egress rules are not in git.** `/usr/local/sbin/edusport-egress.sh` plus the
`edusport-egress.service` unit hold the `DOCKER-USER` rules: containers may
reach other containers, DNS, NTP, 80 and 443, and nothing else, with drops
logged as `egress-drop:`. Reading the repos will never reveal this.
`iptables-persistent` was deliberately removed because its full dump restores
stale Docker rules at boot. Note the limit: a payload fetched over 443 still
passes. It removes the odd-port channel miners rely on, nothing more.

**SSH config drop-ins take the FIRST value, not the last.** The hardening file
had to be named `00-hardening.conf`, because cloud-init's
`50-cloud-init.conf` sets `PasswordAuthentication yes` and a `99-` prefix loses.

**Strapi API tokens are `HMAC-SHA512(token, API_TOKEN_SALT)`.** Confirmed
empirically by reproducing the stored hash from the live token. That is how the
token was rotated without the admin UI, since a hand-minted admin JWT satisfies
the `global::is-admin` policy but not Strapi's own `/admin/*` API.

**`REVALIDATE_SECRET` lives in two places.** The frontend env file *and* the
`x-revalidate-secret` header of the `Revalidate frontend` webhook stored in the
Strapi database. Changing only the env file leaves every CMS publish silently
failing to refresh the site.

**Seeding production is awkward.** The production image does not ship
`scripts/`, and `docker cp` into the container is refused by the read-only
rootfs. Pipe the script in instead:
`docker exec -i -w /opt/app edusport_backend node - < scripts/seed-x.js`.
The `npm run seed:*` entries hardcode `docker exec strapi_app`, the local dev
container name, so they cannot work in production.

## Evidence

Kept on the VM, root-readable only:

- `/root/incident-2026-09-16/`: the miner binary, container diff, process list,
  frontend logs, captured connections, and the pre-rotation env file.
- `/root/rotation-2026-09-17/`: pre-rotation token hash, webhook headers, env
  file, and a dump of the API token rows before the unused ones were deleted.

## Still open

- Production CMS content still contains the em dashes that were cleaned up
  locally.
- The frontend deploy's informational `Dependency audit` job fails and nobody
  has looked at what it reports.
- `API_TOKEN_SALT` was not rotated. It was never exposed, and rotating it
  invalidates every API token at once.
