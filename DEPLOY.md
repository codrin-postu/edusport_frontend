# Deploy

## Overview

Production runs on a single VM with Docker Compose. The frontend, backend
(Strapi 5), PostgreSQL, and an nginx reverse proxy all run as containers on a
shared external Docker network (`edusport_net`). Only nginx publishes ports
on the host. This document covers the frontend; the reverse proxy and TLS
setup live in the backend repo's `DEPLOY.md` because the proxy fronts both
services.

## Prerequisites

- Ubuntu 24.04 LTS VM with Docker Engine and the compose plugin installed
- A non-root user in the `docker` group (used to run deploys)
- SSH access to the VM
- A read-only deploy key added to the GitHub repo (Settings -> Deploy keys)
- DNS A-records for `scoaladepatinaj.com` and `cms.scoaladepatinaj.com`
  pointing at the VM
- The shared Docker network exists: `docker network create edusport_net`
- The backend stack is already deployed (the proxy and Strapi must be
  reachable when the frontend first builds, since some pages fetch at build
  time)

## Step-by-step: first deploy

1. SSH into the VM and clone the repo:

   ```bash
   sudo mkdir -p /opt/edusport
   sudo chown $USER:$USER /opt/edusport
   cd /opt/edusport
   git clone git@github.com:<org>/edusport_frontend.git
   cd edusport_frontend
   ```

2. Create the production env file:

   ```bash
   cp .env.example .env.production
   ${EDITOR:-nano} .env.production
   ```

   Required values:

   - `NEXT_PUBLIC_SITE_URL` -> `https://scoaladepatinaj.com`
   - `NEXT_PUBLIC_STRAPI_URL` -> `https://cms.scoaladepatinaj.com`
   - `NEXT_PUBLIC_STRAPI_IMAGE_HOST` -> `cms.scoaladepatinaj.com`
   - `STRAPI_API_TOKEN` -> read-only token created in the Strapi admin
   - `REVALIDATE_SECRET` -> shared secret with the Strapi webhook

   `NEXT_PUBLIC_COMMIT_SHA` is overwritten by `scripts/deploy.sh` on every
   deploy and can be left blank.

3. Run the deploy script:

   ```bash
   ./scripts/deploy.sh
   ```

   The script fetches `origin/main`, builds the image, brings the container
   up, waits 10 seconds, then hits `/api/health` to verify. On failure it
   prints the last 80 log lines and exits non-zero.

4. Confirm the container is on the shared network:

   ```bash
   docker network inspect edusport_net | grep edusport-frontend
   ```

   The reverse proxy (in the backend stack) forwards `scoaladepatinaj.com`
   to `http://frontend:3000`.

## Updating

```bash
ssh deploy@<vm-host>
cd /opt/edusport/edusport_frontend
./scripts/deploy.sh
```

`deploy.sh` is idempotent. Re-running it is the supported update path.

## Rollback

```bash
cd /opt/edusport/edusport_frontend
git fetch --prune
git reset --hard <previous-sha>
./scripts/deploy.sh
```

`scripts/deploy.sh` itself runs `git reset --hard origin/main`, so after a
rollback push your fix to `main` rather than relying on a detached checkout.

## Reverse proxy and TLS

See `edusport_backend/DEPLOY.md` for the nginx + Let's Encrypt steps that
front both services. The frontend container exposes port 3000 only on the
internal `edusport_net` network; nginx proxies `scoaladepatinaj.com` to it.

## CMS webhook

After the first deploy, configure Strapi to call the on-demand revalidation
endpoint:

- URL: `https://scoaladepatinaj.com/api/revalidate`
- Method: `POST`
- Header: `x-revalidate-secret: <value of REVALIDATE_SECRET>`

See `ARCHITECTURE.md` for the cache strategy.

## GitHub Actions (optional, disabled by default)

`.github/workflows/deploy.yml` ships disabled (`if: false`). To enable:

1. Create an SSH keypair dedicated to deploys. Add the public key to the
   VM user's `~/.ssh/authorized_keys`.
2. In the GitHub repo, add four secrets:
   - `VM_HOST`
   - `VM_USER`
   - `VM_SSH_KEY` (the private key)
   - `VM_FRONTEND_PATH` (e.g. `/opt/edusport/edusport_frontend`)
3. Flip the guard from `if: false` to
   `if: github.ref == 'refs/heads/main'`.

## Troubleshooting

- **`.env.production missing`** — copy `.env.example` and fill it in.
- **Healthcheck fails after deploy** — `docker compose -f
  docker-compose.production.yml logs --tail=200 frontend`. The script
  already prints the tail on failure.
- **`next/image` 400s on CMS uploads** — `NEXT_PUBLIC_STRAPI_IMAGE_HOST`
  must be the hostname only, no protocol, no port.
- **Network not found** — `docker network create edusport_net` must run
  once on the VM before any compose `up`.
- **Old revalidations not firing** — confirm the Strapi webhook secret
  matches `REVALIDATE_SECRET` exactly.

## Reference

| Variable                         | Required | Example                                |
| -------------------------------- | -------- | -------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | yes      | `https://scoaladepatinaj.com`          |
| `NEXT_PUBLIC_STRAPI_URL`         | yes      | `https://cms.scoaladepatinaj.com`      |
| `NEXT_PUBLIC_STRAPI_IMAGE_HOST`  | yes      | `cms.scoaladepatinaj.com`              |
| `STRAPI_API_TOKEN`               | yes      | (Strapi-issued, server-side only)      |
| `REVALIDATE_SECRET`              | yes      | random 32-byte base64 string           |
| `NEXT_PUBLIC_COMMIT_SHA`         | auto     | injected by `scripts/deploy.sh`        |

Ports inside `edusport_net`: frontend 3000, backend 1337, postgres 5432.
None are published on the host. nginx (in the backend stack) publishes 80
and 443.
