# Phase 6b Frontend: Coach 2FA and Passkeys Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On the coach host: the 2FA second step after a password login or a reset, "Folosește cheia de acces" and passkey autofill on the login form, the one-time passkey offer, and the 2FA and "Chei de acces" sections of Securitate, all through the BFF.

**Architecture:** The BFF keeps the pending login secret in its own `HttpOnly` cookie `__Host-es_2fa` and never hands it to page script; new route handlers forward the second step, the passkey ceremony and the Securitate calls to the Strapi routes of the backend index, with the phase 6 headers, Origin check and refresh serializer. Pages stay client components that load through the BFF. WebAuthn runs in the browser with `@simplewebauthn/browser` 14.0.0; the server side verifies.

**Tech Stack:** Next.js 15.5 App Router, React 19, TypeScript, Tailwind 4 tokens, `@simplewebauthn/browser` exactly 14.0.0, Node `--test` for pure modules (`scripts/portal/*.test.mjs`), Playwright e2e against the mock Strapi (`tests/e2e/mock-portal.mjs`) with the CDP virtual authenticator.

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/specs/2026-11-07-admin-auth-roles-design.md` 6, 7.2, 8.3, 8.4, 11 bind this plan. HTTP contracts and rulings: `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/plans/2026-11-07-phase6b-index.md` ("HTTP contracts", "Rulings", binding). Phase 6 frontend plans `docs/superpowers/plans/2026-11-06-phase6-frontend-*.md` (patterns this plan extends). Decisions: `docs/portal/DECISIONS.md`.

**Base:** frontend `feat/athletes` at bb24aeb or later (phase 6 website merged), after backend 6b-2 T21 is merged. The controller cuts `feat/p6b-portal` from it; each task runs in its own worktree from that branch. This plan file lives on `docs/portal-design`.

## Global Constraints

- Repo `/Users/codrin/Documents/Programming/edusport_frontend`, integration branch `feat/p6b-portal`. Check `git rev-parse --show-toplevel` and `git branch --show-current` before every commit.
- Every line of the phase 6 frontend index "Global Constraints" holds (checks per task, code style, copy, visual, hosts, cookies, BFF to Strapi headers, error branching, synthetic data, commits, progress board), plus:
- Checks per task: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, the task's own `node --test scripts/portal/<file>.test.mjs` and its own e2e file. Full `npm run test:scripts`, `npm run test:e2e`, `npm run test:visual`, `npm run test:a11y` run once in F7 in a background worktree. Never `test:visual:update`.
- Pending cookie (spec 7.2, S27): `__Host-es_2fa` over https, `es_2fa` over http; `HttpOnly`, `Secure` over https, `SameSite=Lax`, `Path=/`, max-age 600 s; set only from a Strapi `SecondStep & { pending }` answer, cleared on success, on 401 `"Intrarea a expirat. Intră din nou."`, and on logout. The page gets `SecondStep` without `pending`.
- Passkeys: `@simplewebauthn/browser` exactly 14.0.0 (no caret). Button and autofill only when `browserSupportsWebAuthn()`; autofill only when `browserSupportsWebAuthnAutofill()`; the offer only when `platformAuthenticatorIsAvailable()` and the session answer has `offerPasskey: true`. The WebAuthn JSON passes through the BFF unchanged.
- Copy: "2FA" in every visible string, never "verificare în doi pași"; every new string in `src/lib/portal/copy.ts`, exactly as spec 8.3, 8.4, 11.2, 11.3 and the backend index rulings 1 to 4 and 12; server messages shown as sent.
- Visual: no pills or circles, no dashed or dotted lines, selected state solid primary fill, "white, no boxes" lists in one Card, phone first at 390 px.
- Synthetic data only. e2e ports as phase 6 (3200, 18890, 18891); click-through `es6b4-pg` 55472, Strapi 1394, Next 3294. Never 55442, 1337, 1340, 3010, 5432.
- Commits: Conventional Commits, the message in the task, no `Co-Authored-By`, no AI attribution. Never push.
- Progress board `printf '%s | p6b-fe F<n> | implementer | <status>\n' "$(date -u +%H:%M)" >> /Users/codrin/Documents/Programming/edusport_backend/.superpowers/phase3-shared/progress-board.md`; ledger `/Users/codrin/Documents/Programming/edusport_frontend/.superpowers/sdd/2026-11-07-phase6b-frontend/progress.md`.

**Risk, model, batches:**

| Task | Risk | Model | Batch |
|---|---|---|---|
| F0 Companion round (backend Task 0) | | controller | |
| F1 Types, copy, mock | low | Haiku | final |
| F2 BFF second step | high | Sonnet | FB1 |
| F3 BFF passkeys and Securitate proxy | high | Sonnet | FB1 |
| F4 Second step page | high | Sonnet | FB1 |
| F5 Login passkey, offer | high | Sonnet | FB2 |
| F6 Securitate 2FA and passkeys | high | Sonnet | FB2 |
| F7 e2e, click-through, full suite | low | Sonnet | final |

One Opus review per batch, never blocking; one final Opus review after F7. F4 to F6 wait for F0.

## Review Focus

- **The pending secret reaching page script** (a JSON answer, a redirect URL, a Sentry breadcrumb): never; `document.cookie` cannot read it and no response body to the browser carries `pending`. Pinned by F2 (`pending stays in the cookie`) and F7 e2e.
- **Two taps on "Verifică"** with the same backup code: one opens, the other shows "Codul nu este corect sau a expirat." and the coach is still logged in by the first. Pinned by F4 (`double submit sends once`) and F2.
- **The pending login expires while the coach looks for the phone** (10 minutes): "Verifică" shows "Intrarea a expirat. Intră din nou." and returns to `/intrare` with the e-mail kept. Pinned by F4.
- **A browser without WebAuthn** (old Android WebView): no passkey button, no autofill attribute side effect, no offer, Securitate shows no "Creează o cheie de acces". Pinned by F5 and F6.
- **A cross-site POST to the new BFF routes** (`/api/portal/auth/2fa`, `/api/portal/me/*`): 403 before Strapi. Pinned by F2 and F3 (`origin refused`).

---

## File Structure

```
src/lib/portal/security-types.ts          backend src/club/security/api-types.ts copied verbatim (F1)
src/lib/portal/copy.ts                    + 2FA, passkey, offer, Securitate strings (F1)
tests/e2e/mock-portal.mjs, portal-fixtures.mjs   + 2FA, passkey and Securitate routes (F1)
src/lib/portal/cookies.ts                 + twoFactor cookie name, pendingCookie, clearPending (F2)
src/lib/portal/second-step.ts             splitPending (pure) (F2)
src/lib/portal/security-routes.ts         allowedSecurityRoute (pure) (F3)
src/lib/portal/sentry-scrub.ts            + 2FA and passkey bodies (F2)
src/app/(antrenor)/antrenor/api/portal/auth/login/route.ts, reset/confirm/route.ts   pending split (F2)
src/app/(antrenor)/antrenor/api/portal/auth/2fa/route.ts, 2fa/email/route.ts         (F2)
src/app/(antrenor)/antrenor/api/portal/auth/passkey/options/route.ts, verify/route.ts (F3)
src/app/(antrenor)/antrenor/api/portal/me/[...path]/route.ts                         (F3)
src/app/(antrenor)/antrenor/intrare/2fa/page.tsx, SecondStepForm.tsx                 (F4)
src/app/(antrenor)/antrenor/intrare/LoginForm.tsx, _lib/passkey.ts, intrare/cheie/page.tsx, OfferView.tsx   (F5)
src/app/(antrenor)/antrenor/(app)/profil/securitate/{SecurityView,TwoFactorSection,BackupCodesSheet,PasskeysSection}.tsx   (F6)
tests/e2e/portal-2fa.spec.ts, portal-passkeys.spec.ts, portal-security.spec.ts       (F4 to F7)
```

---

### F1: Types, copy and mock Strapi (low, Haiku)

**Files:**
- Create: `src/lib/portal/security-types.ts`
- Modify: `src/lib/portal/api-types.ts` (`CoachDevice.twoFactorUntil: string | null`), `src/lib/portal/copy.ts`, `tests/e2e/mock-portal.mjs`, `tests/e2e/portal-fixtures.mjs`, `scripts/portal/copy.test.mjs`
- Test: `scripts/portal/copy.test.mjs`

**Interfaces:**
- Produces: the backend `api-types.ts` verbatim (`TwoFactorMethod`, `SecondStep`, `PasskeyRow`, `SecurityView`, `TotpStart`, `MethodOn`, `BackupBatch`, `CodeSent`, `PasskeyRegisterOptions`, `PasskeyLoginOptions`) plus `PortalPending = SecondStep & { pending: string }` and `SessionAnswer = PortalSession & { offerPasskey: boolean }`; copy keys `SECOND_STEP` (11.2), `PASSKEY` (8.3, 8.4, ruling 3, 4), `SECURITY_2FA` (11.3), `SECURITY_KEYS` (11.3, 8.6 step 3), `REMEMBERED(date)` ("2FA ținut minte până la <dată>."), `BACKUP_LEFT(n)` ("Mai ai <n> coduri de rezervă."), `PENDING_EXPIRED` (ruling 1); the mock answers every index route of the portal tables with the fixture coach `antrenor1@example.invalid` (2FA app on, TOTP accepts `"123456"` once, backup code `"ABCDE FGHJK"` once, e-mail code `"654321"`), and a passkey verify that accepts any assertion whose credential id is in the mock's list (the real check is backend T20).
- [ ] **Step 1: Failing test**: every spec 11.2 and 11.3 string exactly; no value contains "verificare", `—`, `–`, `·`, curly quotes or `Email`; `security-types.ts` equals the backend file byte for byte (`readFileSync` of `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/src/club/security/api-types.ts` when present, skipped otherwise).
- [ ] **Step 2: Run** `node --test scripts/portal/copy.test.mjs`. FAIL. **Step 3: Implement.** **Step 4: Run** PASS, tsc, lint.
- [ ] **Step 5: Commit** `feat(portal): 2FA and passkey types, copy and mock routes`.

---

### F2: BFF second step (high, Sonnet)

**Files:**
- Create: `src/lib/portal/second-step.ts`, `src/app/(antrenor)/antrenor/api/portal/auth/2fa/route.ts`, `src/app/(antrenor)/antrenor/api/portal/auth/2fa/email/route.ts`
- Modify: `src/lib/portal/cookies.ts`, `src/lib/portal/auth-route.ts` (`sessionAnswer` handles both answer kinds), `src/app/(antrenor)/antrenor/api/portal/auth/login/route.ts`, `reset/confirm/route.ts`, `logout/route.ts` (clears the pending cookie), `src/lib/portal/sentry-scrub.ts`
- Test: `scripts/portal/second-step.test.mjs`, `scripts/portal/cookies.test.mjs`, `scripts/portal/sentry-scrub.test.mjs`

**Interfaces:**

```ts
// second-step.ts (pure, type-only imports)
export type Split = { kind: "session"; session: SessionAnswer } | { kind: "pending"; pending: string; step: SecondStep } | { kind: "other" };
export function splitPending(body: unknown): Split;
// cookies.ts
export type CookieNames = { /* phase 6 names */ twoFactor: string };
export function pendingCookie(value: string, secure: boolean): CookieSpec; // max-age 600
export function clearPending(secure: boolean): CookieSpec;
```
`sessionAnswer`: `session` -> session cookies as phase 6, clear the pending cookie, answer `{ data: { ok: true, offerPasskey } }`; `pending` -> `pendingCookie`, answer `{ data: SecondStep }`. `/api/portal/auth/2fa` body `{ method, code, remember }`: the pending from the cookie (missing -> 401 `PENDING_EXPIRED` without calling Strapi), `deviceKey` from the device cookie, `callStrapi("auth/2fa", ...)`; 401 from Strapi -> clear the pending cookie and pass the message. `/2fa/email`: body `{}`, pending from the cookie. Both use `guardPost({ limited: true, readBody: true })` (Origin check first).
- [ ] **Step 1: Failing tests**: `splitPending` on a session, a pending and an error body; `pending stays in the cookie`: the login handler given a mock `PortalPending` answers JSON with no `pending` key and sets `es_2fa` `HttpOnly`; the 2fa handler without the cookie answers 401 and makes no upstream call; success clears `es_2fa` and sets the session cookies; `origin refused` for both new routes; Sentry scrub drops `code` and `pending` from `/api/portal/auth/2fa` events and breadcrumbs.
- [ ] **Step 2: Run** the three test files. FAIL. **Step 3: Implement.** **Step 4: Run** PASS, tsc, lint, tokens.
- [ ] **Step 5: Commit** `feat(portal): BFF keeps the 2FA pending login in an httpOnly cookie`.

---

### F3: BFF passkeys and the Securitate proxy (high, Sonnet)

**Files:**
- Create: `src/lib/portal/security-routes.ts`, `src/app/(antrenor)/antrenor/api/portal/auth/passkey/options/route.ts`, `.../passkey/verify/route.ts`, `src/app/(antrenor)/antrenor/api/portal/me/[...path]/route.ts`
- Test: `scripts/portal/security-routes.test.mjs`, `tests/e2e/portal-proxy.spec.ts` (extend)

**Interfaces:**
- Produces: `allowedSecurityRoute(method, path): boolean` (exactly the 13 rows of the backend "Portal Securitate" table, `:id` a 1 to 64 character `[A-Za-z0-9_-]` segment); the `me` proxy works as the phase 6 coach proxy (`coachCall`, access cookie, serialized refresh, `classifyCoach`), forwarding to `me/<path>`; passkey options `{ host: "antrenor" }`, verify `{ host, response, deviceKey }` -> `sessionAnswer`.
- [ ] **Step 1: Failing tests**: the allow-list accepts the 13 rows and refuses `GET me/2fa/totp`, `DELETE me/backup-codes`, `me/../coach/today`, an 80-character id; the proxy with an expired access cookie refreshes once and retries; a policy 403 clears cookies; `origin refused` on POST, PUT, DELETE; verify success sets session cookies and answers no token in the body.
- [ ] **Step 2: Run** FAIL. **Step 3: Implement.** **Step 4: Run** PASS, tsc, lint, the proxy e2e.
- [ ] **Step 5: Commit** `feat(portal): BFF passkey ceremony and Securitate proxy`.

---

### F4: Second step page (high, Sonnet). After F0

**Files:**
- Create: `src/app/(antrenor)/antrenor/intrare/2fa/page.tsx`, `SecondStepForm.tsx`, `tests/e2e/portal-2fa.spec.ts`
- Modify: `src/app/(antrenor)/antrenor/intrare/LoginForm.tsx` and `am-uitat-parola/ResetForm.tsx` (a `SecondStep` answer routes to `/intrare/2fa`, the step kept in `sessionStorage` key `es_2fa_step` without any secret)

**Interfaces:**
- Produces: spec 11.2: title "2FA"; per method the line and field ("Scrie codul din aplicația de autentificare." + "Cod"; "Am trimis un cod pe <e-mail>." + "Cod din e-mail" + "Trimite din nou"; "Scrie unul dintre codurile de rezervă." + "Cod de rezervă"); tick "Ține minte dispozitivul 30 de zile" on by default; "Verifică"; "Altă metodă" listing the other methods of `methods`; "Înapoi la intrare". Inputs: `inputmode="numeric"` and `autocomplete="one-time-code"` for app and e-mail, text for backup. Errors shown as sent; 401 -> back to `/intrare` with the `PENDING_EXPIRED` text and the e-mail kept; success -> the offer check (F5) or `/antrenor`.
- [ ] **Step 1: Failing e2e** (mock): login with 2FA -> `/intrare/2fa` with "Aplicație de autentificare" preselected when `last` is `totp`; wrong code shows "Codul nu este corect sau a expirat."; `double submit sends once` (two clicks, one request, button disabled while pending); "Altă metodă" -> "Cod pe e-mail" sends one mail request and shows the e-mail; "Trimite din nou"; backup code "abcde-fghjk" accepted; mock pending expiry -> back to `/intrare` with the text; no visible text contains "verificare"; 390 px and `lg` layouts.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-2fa.spec.ts`. FAIL. **Step 3: Implement.** **Step 4: Run** PASS, tsc, lint, tokens.
- [ ] **Step 5: Commit** `feat(portal): 2FA step after login and reset`.

---

### F5: Passkey on the login form and the offer (high, Sonnet). After F0

**Files:**
- Create: `src/app/(antrenor)/antrenor/_lib/passkey.ts`, `src/app/(antrenor)/antrenor/intrare/cheie/page.tsx`, `OfferView.tsx`, `tests/e2e/portal-passkeys.spec.ts`
- Modify: `package.json` (`"@simplewebauthn/browser": "14.0.0"`), `src/app/(antrenor)/antrenor/intrare/LoginForm.tsx`, `SecondStepForm.tsx` (offer check after success)

**Interfaces:**
- Produces: `signInWithPasskey(mode: "button" | "autofill", signal?: AbortSignal): Promise<{ ok: true; offerPasskey: false } | { ok: false; message: string | null }>` (options then `startAuthentication({ optionsJSON, useBrowserAutofill })` then verify; a cancel answers `message: null` for autofill and the 8.3 text for the button); `afterSession(a: { offerPasskey: boolean }): Promise<string>` (route: `/intrare/cheie` when the flag is set and `platformAuthenticatorIsAvailable()`, else `/antrenor`). Login form: "Folosește cheia de acces" under "Intră"; the "E-mail" input gets `autocomplete="username webauthn"` and a conditional request on mount only with autofill support; the button aborts the conditional request first. Offer page: "Creează o cheie de acces", "Intri cu amprenta, fața sau codul telefonului, fără parolă.", "Creează" (options, `startRegistration`, `POST me/passkeys`) and "Nu acum" (`POST me/passkey-offer/dismiss`), both to `/antrenor`; a registration failure shows "Nu am putut folosi cheia de acces." and keeps both buttons.
- [ ] **Step 1: Failing e2e** with the CDP virtual authenticator (`WebAuthn.enable`, `addVirtualAuthenticator` `ctap2`/`internal`, resident key, user verification): password login of a coach with `offerPasskey` -> offer -> "Creează" -> `/antrenor`; logout; "Folosește cheia de acces" -> `/antrenor`; logout; autofill (focus "E-mail", pick the credential) -> `/antrenor`; "Nu acum" on a second coach never shows the offer again; with WebAuthn removed (`page.addInitScript` deleting `PublicKeyCredential`) no button, no offer; the mock's "other kind" answer shows "Cheia nu este pentru această pagină.".
- [ ] **Step 2: Run** FAIL. **Step 3: Implement.** **Step 4: Run** PASS, tsc, lint, tokens.
- [ ] **Step 5: Commit** `feat(portal): passkey sign-in, autofill and the one-time offer`.

---

### F6: Securitate 2FA and passkey sections (high, Sonnet). After F0

**Files:**
- Create: `src/app/(antrenor)/antrenor/(app)/profil/securitate/TwoFactorSection.tsx`, `BackupCodesSheet.tsx`, `PasskeysSection.tsx`, `tests/e2e/portal-security.spec.ts`
- Modify: `SecurityView.tsx` (sections "2FA", "Chei de acces", then the phase 6 password and "Dispozitive" with `REMEMBERED(date)` under each device that has `twoFactorUntil`)

**Interfaces:**
- Consumes: the `me` proxy (F3), `SecurityView`, `TotpStart`, `MethodOn`, `BackupBatch`, `PasskeyRow`.
- Produces: spec 11.3 exactly: rows "Aplicație de autentificare" and "Cod pe e-mail" with "Activ" / "Oprit" and "Activează" / "Oprește"; "Coduri de rezervă", "<n> rămase", "Generează coduri noi" (confirm "Codurile vechi nu vor mai merge."); app setup in a `Sheet` (QR SVG rendered from the server string as an `img` with a `data:image/svg+xml` URL, never `dangerouslySetInnerHTML`; "Sau scrie cheia: <cheie>"; "Cod din aplicație"; "Activează"); e-mail setup; the backup codes sheet ("Coduri de rezervă", the line, "Descarcă" as `edusport-coduri-de-rezerva.txt` ruling 12, "Copiază", "Gata"; codes dropped from state on "Gata" and on unmount); turn off confirms of 11.3; `BACKUP_LEFT(n)` once when `backupNotice` is set; "Chei de acces" rows "<nume>", "Creată <dată>, folosită <dată>", "Redenumește" (field "Nume", 1 to 60), "Șterge"; old rows with "Cheie veche, nu mai merge. Creează una nouă." and "Șterge" only; "Creează o cheie de acces" on supporting devices; toasts of 11.3.
- [ ] **Step 1: Failing e2e** (mock): enrol app, see 10 codes once, "Gata", reload: codes gone, "Activ"; turn off the last method shows "Oprești 2FA? Codurile de rezervă vor fi șterse."; regenerate asks first; e-mail enrol; the 409 text for an app already on; passkey create (virtual authenticator), rename to 61 characters refused by the field, delete with its toast; an old key row; the device line "2FA ținut minte până la <dată>."; no pills, no circles (a style check of `border-radius` on the new rows and buttons as the phase 6 e2e does).
- [ ] **Step 2: Run** FAIL. **Step 3: Implement.** **Step 4: Run** PASS, tsc, lint, tokens.
- [ ] **Step 5: Commit** `feat(portal): Securitate 2FA, backup codes and passkeys`.

---

### F7: e2e against the real backend, click-through, full suite (low, Sonnet)

**Files:**
- Modify: `scripts/portal/clickthrough.mjs` (screens 2FA and passkeys), `scripts/portal/clickthrough-index.mjs`
- Output: `docs/portal/mockups/screens/phase6b-clickthrough-coach/` (commit on `docs/portal-design`)

- [ ] **Step 1: Real backend run**: `es6b4-pg` 55472, Strapi 1394 from backend `feat/athletes` with 6b merged and the backend T28 fixture, the backend index env (`WEBAUTHN_ORIGINS` includes `http://antrenor.localhost:3294`), Next on 3294 pointed at it. Run `portal-2fa.spec.ts`, `portal-passkeys.spec.ts`, `portal-security.spec.ts` with `PORTAL_REAL_BASE` set (the specs read TOTP codes from the fixture `IDS_FILE` with a test-only TOTP helper in `tests/e2e/totp.mjs`). Log each result in the ledger.
- [ ] **Step 2: Click-through** at 390 px and 1280 px, light mode: login with the passkey button, the 2FA step for each method, "Altă metodă", expired pending, the offer, Securitate with 2FA off, app setup, backup codes, passkeys with an old key, devices with the 2FA line. Check every crop by eye against the F0 approved screens; log mismatches.
- [ ] **Step 3: Full suite in a background worktree**: `npm run test:scripts`, `npm run test:e2e`, `npm run test:visual`, `npm run test:a11y`; report failures to the controller, never rebaseline.
- [ ] **Step 4:** Remove the container. **Step 5: Commit** `docs: phase 6b coach click-through screens` (screens) and `test(portal): phase 6b e2e against the real backend` (specs, on `feat/p6b-portal`).

## Self-review

- **Spec coverage.** 6.1 to 6.5 coach side (F2, F4, F6), 7.2 (F2 to F6), 8.3 (F5), 8.4 (F5), 8.6 step 3 label (F6), 11.1 to 11.3 (F4 to F6). Admin `/intrare` and admin Securitate are backend tasks (6b-1 T16, T17, 6b-2 T22).
- **Step scan.** No bodies; the cookie and answer splitting rules are the decisions this plan adds, both in F2.
- **Type consistency.** `SecondStep`, `PortalPending`, `SessionAnswer` (F1) are used by F2, F4, F5; `allowedSecurityRoute` (F3) matches the backend table row for row.
- **Review Focus.** Each line has its named test in F2 to F6.
