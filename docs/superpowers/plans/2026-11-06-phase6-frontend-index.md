# Phase 6 Frontend: BFF and Coach App Implementation Plan (index)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The website serves a second site on `antrenor.<domain>`: a Next.js BFF that holds the coach session in httpOnly cookies and calls the phase 6 Strapi routes, and the phone-first coach app (login, invite, reset, Azi, Grupe, group page, presence, lessons, athletes, Program, Istoric, Profil, Setări cont, Securitate).

**Architecture:** `src/middleware.ts` picks the site by `Host`. The public site moves into the route group `src/app/(site)/` with its current root layout; the coach app lives in `src/app/(antrenor)/antrenor/` with its own root layout (no Umami, `noindex`), reached only through a rewrite from the `antrenor` host. The browser only ever talks to BFF route handlers under `/api/portal/*` on the coach host; they read and rotate the cookies, add the BFF headers and call Strapi server to server. Pages are client components that load data through the BFF, so a refresh (which rotates the refresh cookie) only ever happens in a route handler that can write cookies.

**Tech Stack:** Next.js 15.5 (App Router, middleware on the Node runtime), React 19, TypeScript, Tailwind 4 tokens, Node `--test` with type stripping for pure modules (`scripts/portal/*.test.mjs`), Playwright e2e against a mock Strapi (`tests/e2e/mock-portal.mjs`).

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/specs/2026-11-04-coach-portal-design.md` (5.1 to 5.3, 6.5, 9, 14.3 to 14.5 bind this plan). HTTP contracts: `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/plans/2026-11-04-phase6-index.md` ("HTTP contracts", binding). Carried notes: `p3be/docs/HANDOFF.md` (Phase 6-2 note) and `p3be/.superpowers/sdd/2026-11-04-phase6-*/progress.md`. Decisions: `docs/portal/DECISIONS.md` (phase 6 entries 2026-11-04 and 2026-11-06). Mockups: `docs/portal/mockups/coach-mobile.html`, `coach-desktop.html` (layout; strings only where the spec agrees). Agent rules: `/Users/codrin/Documents/Programming/edusport_backend/.superpowers/phase3-shared/agent-rules.md`.

## Files of this plan

| File | Tasks | Content |
|---|---|---|
| `2026-11-06-phase6-frontend-index.md` | | this index: constraints, review focus, file map, order, review batches, contract gaps, rulings, deploy |
| `2026-11-06-phase6-frontend-1-bff.md` | T1 to T9 | site split, host routing, types and copy, mock Strapi, cookie and header rules, refresh serializer, auth handlers, Google, coach proxy |
| `2026-11-06-phase6-frontend-2-app.md` | T10 to T20 | app shell, auth screens, Azi and Grupe, presence, lessons, athletes, Program, Istoric, Profil, click-through renders |

20 tasks. Base: branch `feat/portal`, to be cut from the frontend `feat/athletes` (f2c4e0d or later) by the controller before Task 1. This plan does not create the branch. Each task runs in its own worktree branched from `feat/portal` and is merged back by the controller.

## Global Constraints

- Repo `/Users/codrin/Documents/Programming/edusport_frontend`, integration branch `feat/portal` (cut from `feat/athletes`). Commit only in the worktree the dispatch names; check `git rev-parse --show-toplevel` and `git branch --show-current` before every commit.
- Checks per task (memory rule, no long runs): `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, the task's own `node --test scripts/portal/<file>.test.mjs` and, when the task names one, its own e2e file `npm run test:e2e -- tests/e2e/<file>.spec.ts`. Full `npm run test:scripts`, `npm run test:e2e`, `npm run test:visual`, `npm run test:a11y` run once in Task 20 in a background worktree. Never `test:visual:update`.
- Code: TypeScript, no `any`, functions under 30 lines, complexity under 10, double quotes. Modules under `src/lib/portal/` that a `scripts/portal/*.test.mjs` file loads have type-only imports (Node type stripping); `node:crypto` is allowed. React: client components only where state is needed; every coach page is a client component that loads through the BFF.
- Copy (spec 9, approved as listed by the user 2026-11-06, q28 A): Romanian, terse, exact strings from `src/lib/portal/copy.ts` (Task 3) only; no em dash, no en dash, no middle dot (join facts with commas), straight quotes, "E-mail" not "Email", no emoji. Server messages (`error.message`, `toast`, `savedLine`) are shown as sent, never rewritten. Count words through `roCount` (`src/lib/ro-plural.ts`): "1 copil", "12 copii", "20 de copii".
- Visual (spec header, DECISIONS "Copy and visual rules"): no pills and no circles (only the spinner ring is round; initials tile is square), no dashed or dotted lines, selected state = solid primary fill, lists "white, no boxes" in one Card, the whole row is the link, links through `src/components/ui/link.tsx`. Tokens only (`npm run check:tokens`). Phone first: designed at 390 px wide, desktop adds a top menu and a list-left, detail-right split from `lg`.
- Hosts (spec 6.5): `antrenor.<domain>` and `antrenor.localhost[:port]` serve only the coach app; the main domain serves only the site; `sportiv.*` answers 404 (phase 7). Portal hosts: `robots.txt` "Disallow: /", header `X-Robots-Tag: noindex, nofollow`, metadata `robots: { index: false, follow: false }`, no sitemap, no Umami script, `Referrer-Policy: no-referrer`.
- Cookies (spec 5.2, S10): set only by BFF route handlers; all `HttpOnly`, `SameSite=Lax`, `Path=/`, no `Domain`. Over https: `Secure` and the `__Host-` prefix (`__Host-es_at`, `__Host-es_rt`, `__Host-es_dev`); over http (local): same names without the prefix and without `Secure`. Access max-age 10 minutes, refresh 30 days (rotated), device 400 days.
- BFF to Strapi (contracts "Headers"): every call sends `x-portal-secret: PORTAL_BFF_SECRET` and `x-portal-client-ip` from the request's `x-real-ip` (never `x-forwarded-for`; missing sends `unknown`); login-like calls add `x-portal-user-agent`; `GET /me/devices` adds `x-portal-device`; coach calls add `authorization: Bearer <access>`. No Strapi token, refresh token or device key is ever in a response body, a URL or a log.
- Error branching (contracts "Coach routes"): read status and `error.name`, never the policy message. 401: refresh once, retry once, then login. 403 with `error.name !== "ClubAdminError"`: clear cookies, login. 403 `ClubAdminError`: show `error.message`; "Nu mai ai acces la această grupă." returns to Grupe (spec 9.11).
- Carried notes (binding): refresh is serialized per session (parallel refresh with one token = reuse = logout); nonce and code verifier live in the BFF's own short httpOnly cookie; invite secrets are masked in BFF logs and Sentry, and invite read is `POST /api/portal/auth/invite/read` with the secret in the body; `/program/:eventId` routes take the event `documentId` (`Occurrence.documentId` or `ProgramRow.eventId`), never the numeric `Occurrence.eventId`; the date body flag is `notifyParents`.
- Synthetic data only (`antrenor1@example.invalid`, invented names). Never production, never the TEST environment (1340 / 3010 / `edusport-test-pg`), never `strapi_app` / 1337. e2e ports 3200 / 18890 (existing) and 18891 (mock portal); click-through ports in Task 20.
- Commits: Conventional Commits, exactly the message in the task, no `Co-Authored-By`, no AI attribution. Never push.
- Progress board: `printf '%s | p6fe T<n> | implementer | <status>\n' "$(date -u +%H:%M)" >> /Users/codrin/Documents/Programming/edusport_backend/.superpowers/phase3-shared/progress-board.md`. Ledger: `/Users/codrin/Documents/Programming/edusport_frontend/.superpowers/sdd/2026-11-06-phase6-frontend/progress.md`.

## Review Focus

- **Two tabs refresh at once** after 10 idle minutes: both requests carry the same refresh cookie; exactly one Strapi refresh runs, both requests succeed with the new cookies, and the coach stays logged in. A third request arriving 5 s later with the old cookie (the browser had not stored the new one yet) also succeeds. Pinned by Task 6 (`createRefresher` tests) and Task 9 (e2e "parallel requests after expiry").
- **Access cut while a tab is open** (account disabled, group link removed, BFF secret rotated): the policy 403 is not shown as a group message; cookies are cleared and the app lands on `/intrare` without a message; a `ClubAdminError` 403 keeps the coach logged in. Pinned by Task 5 (`classifyCoach`) and Task 9 (e2e).
- **The invite link** `/invitatie/<secret>`: the secret leaves the address bar on the first response (303 to `/invitatie`), never appears in a referrer, a fetch URL, a Sentry event or a log line, and the accept and the Google path both still work. Pinned by Task 7 (bridge and mask tests) and Task 8 (Google with invite).
- **Cross-site requests**: a POST to `/api/portal/*` with a foreign or missing `Origin` answers 403 and never reaches Strapi; the main domain answers 404 to `/antrenor/*` and `/api/portal/*`; the coach host answers 404 to site pages, `/sitemap.xml` and site API routes. Pinned by Task 2 and Task 9.
- **A phone with a stale page after the 7-day window or a lost link**: saving presence answers 403 "Arhivată. Nu mai poate fi modificată." or "Nu mai ai acces la această grupă."; the first shows read only in place, the second toasts and returns to Grupe; nothing is lost silently. Pinned by Task 13.

## File Structure

```
src/middleware.ts                                   host routing, noindex and referrer headers (T2)
src/lib/portal/host.ts                              siteForHost, routeRequest (pure, T2)
src/lib/portal/api-types.ts                         backend coach types copied verbatim plus their imports (T3)
src/lib/portal/copy.ts                              every coach-app string (T3)
src/lib/portal/format.ts                            dayTile, durationText, relative day, counts (pure, T3)
src/lib/portal/cookies.ts                           cookieNames, sessionCookies, clearSessionCookies, isSecureRequest (pure, T5)
src/lib/portal/origin.ts                            originAllowed (pure, T5)
src/lib/portal/upstream.ts                          bffHeaders, classifyCoach, readSession, maskSecrets (pure, T5)
src/lib/portal/coach-routes.ts                      allowedCoachRoute (pure, T5)
src/lib/portal/refresh.ts                           createRefresher (pure, T6)
src/lib/portal/bff.ts                               bffContext, callStrapi, coachCall, respond (server only, T6)
src/lib/portal/google.ts                            pkcePair, authUrl, encode/decodeGoogleCookie (pure, T8)
src/app/(site)/**                                   today's site pages and root layout, moved (T1)
src/app/(antrenor)/layout.tsx                       portal root layout (T2)
src/app/(antrenor)/antrenor/robots.txt/route.ts     "Disallow: /" (T2)
src/app/(antrenor)/antrenor/api/portal/auth/**      login, logout, reset, invite read state, accept, flash (T7)
src/app/(antrenor)/antrenor/invitatie/[secret]/route.ts   secret to cookie, 303 (T7)
src/app/(antrenor)/antrenor/api/portal/google/{start,callback}/route.ts (T8)
src/app/(antrenor)/antrenor/api/portal/coach/[...path]/route.ts   coach proxy (T9)
src/app/(antrenor)/antrenor/_lib/{api.ts,use-portal.ts}           client fetch and hooks (T10)
src/app/(antrenor)/antrenor/_ui/*                   shell, header, nav, Spinner, LoadError, Toast, Row, Segmented (T10)
src/app/(antrenor)/antrenor/{intrare,am-uitat-parola,invitatie}/page.tsx (T11)
src/app/(antrenor)/antrenor/(app)/**                Azi, Grupe, group, presence, lessons, athletes, Program, Istoric, Profil (T12 to T19)
src/instrumentation-client.ts, src/sentry.server.config.ts       URL scrubbing (T7)
tests/e2e/mock-portal.mjs                           mock Strapi portal routes (T4)
tests/e2e/portal-*.spec.ts                          e2e per area (T2, T7 to T9, T11 to T19)
scripts/portal/*.test.mjs                           node tests for the pure modules
```

URLs on the coach host (rewritten to `/antrenor/...` internally): `/intrare`, `/am-uitat-parola`, `/invitatie/<secret>` (bridge), `/invitatie`, `/` (Azi), `/grupe`, `/grupe/<id>` (`?tab=program`), `/grupe/<id>/adauga`, `/grupe/<id>/sportiv-nou`, `/prezenta` (`?occurrence=` | `?id=` | `?group=&date=`), `/lectie/noua`, `/lectie/<id>`, `/sportiv/<id>`, `/istoric` (`?luna=YYYY-MM`), `/profil`, `/profil/setari`, `/profil/securitate`; BFF `/api/portal/auth/*`, `/api/portal/google/*`, `/api/portal/coach/*`.

## Order, models and parallel groups

| Group | Tasks | Runs after | Why they do not collide |
|---|---|---|---|
| A | T1 site split, T3 types and copy, T4 mock, T5 pure rules | nothing | T1 moves `src/app/*`; T3, T5 new files under `src/lib/portal/`; T4 `tests/e2e/mock-portal.mjs` and the e2e config |
| B | T2 host routing, T6 refresher and BFF core | T1 (T2), T5 (T6) | `src/middleware.ts`, portal layout vs `src/lib/portal/{refresh,bff}.ts` |
| C | T7 auth handlers, T8 Google, T9 coach proxy | B, T4 | separate route folders; Sentry configs only in T7 |
| D | T10 app shell | C, T3 | `_lib/`, `_ui/` |
| E | T11, T12, T13, T15, T18, T19 | D | one route folder each; nobody edits `copy.ts` or `mock-portal.mjs` (complete from T3, T4; a missing string or mock answer is reported, not added) |
| F | T14 lessons; T16 then T17 Program | T13 (T14 uses its `CoachPicker`); T12 (T16 fills its `ProgramTab` stub) | lesson folder vs `grupe/[id]/_program/` |
| G | T20 checks and click-through | all | no repo code; renders and companion screen |

| Task | Title | Model | Risk |
|---|---|---|---|
| 1 | Move the site into `(site)` | Haiku | normal |
| 2 | Host routing, portal layout, noindex | Sonnet | **high** |
| 3 | Types, copy, format helpers | Haiku | normal |
| 4 | Mock Strapi portal | Sonnet | normal |
| 5 | Cookie, origin, header and route rules | Sonnet | **high** |
| 6 | Refresh serializer and BFF core | Sonnet | **high** |
| 7 | Auth handlers, invite bridge, log masking | Sonnet | **high** |
| 8 | Google start and callback | Sonnet | **high** |
| 9 | Coach proxy | Sonnet | **high** |
| 10 | App shell and client API | Sonnet | normal |
| 11 | Login, reset, invite screens | Sonnet | **high** |
| 12 | Azi, Grupe, group page | Sonnet | normal |
| 13 | Presence | Sonnet | **high** |
| 14 | Individual lessons | Sonnet | normal |
| 15 | Adaugă sportiv, Sportiv nou, athlete card | Sonnet | normal |
| 16 | Program tab: read and Program public | Sonnet | normal |
| 17 | Program tab: writes | Sonnet | normal |
| 18 | Istoric | Haiku | normal |
| 19 | Profil, Setări cont, Securitate | Sonnet | **high** |
| 20 | Full checks and click-through renders | Sonnet | normal |

## Review batches (one Opus review each, nothing waits on a review)

| Batch | Tasks | Focus |
|---|---|---|
| RB1 | T2, T5, T6 | host isolation, cookie flags and names, Origin rule, header set, refresh serialization and grace cache, no token in bodies or logs |
| RB2 | T7, T8, T9 | auth handlers and enumeration (identical answers passed through), invite secret path and masking, OIDC state, nonce and PKCE cookie, coach proxy allow-list, cut vs refusal, `revokedCurrent` |
| RB3 | T11, T13, T19 | auth screens (no message leaks, eye icon, Google button only with a client id), presence write refusals and the 7-day state, password change, device revoke, logout |

Normal-risk tasks get the final review only. Final: one Opus whole-branch review of `feat/portal` after Task 20, with the click-through renders, before the user's companion review. Fix waves after each review by the task's implementer (Sonnet), logged in the ledger.

## Contract gaps found in the backend (report to the user; backend is read only here)

1. **G1, own coach id (blocks T13 "(tu)" and T14 new lesson).** `CoachMe` (`src/club/portal/coach/api-types.ts`) has no team member id and no route returns coach options before a lesson exists, yet `POST /portal/coach/lessons` requires `coachIds` containing the coach's own id (`lessons.ts:43`, 403 otherwise) and presence marks the coach "(tu)" (spec 9.7). Proposed backend addition: `CoachMe.coachId: string` and `CoachMe.coachOptions: { id: string; name: string }[]` (the same list `views.ts` builds as `options(x.team)`). T13 and T14 consume those two fields; until they exist both tasks stop at their "Needs G1" step and report BLOCKED.
2. **G2, saved days for the presence calendar.** No coach route lists the dates of a group month that have a saved session, so the legend "are prezență salvată" (spec 9.7, MOCK 5a, 5b) has no data. `POST /session/check` answers per chosen date. Until a route exists, T13 shows the calendar without marks and without the legend line, and the existing-session choice appears after a date is picked (decided by Claude, low impact; the user may ask for the backend route instead).
3. **G3, copy list incomplete.** `api-types.ts` and the contracts table also need `GroupProgram`, `ProgramRow`, `SeasonRef`, `RepeatFreq`, `DayKey`, `WeekOfMonth` (`src/club/groups/`), `AddedSession`, `SectionKind`, `SessionCheck`, `SavedOnDay`, `SessionSaveBody`, `Tick`, `SessionSaved`, `LessonBody`, `LessonPatch`, `LessonSaved` (`src/club/presence/attendance/api-types.ts`), `LessonState` (`src/club/presence/types.ts`), `JoinResult` (`src/club/groups/api-types.ts`), `DateAnswer` (`src/club/groups/program-dates.ts`). The phase 4 program add, change and end bodies have no exported type, only readers in `src/club/groups/program-plan.ts` (`readSeriesInput`, `readProgramInput`, end `{ from }`, date `{ mode, newDate?, newStartTime?, reason?, notifyParents? }`); T3 writes them as `ProgramAddBody`, `ProgramChangeBody`, `ProgramEndBody`, `DateBody` from those readers.
4. **G4, auth-route 403 shape.** A missing or wrong BFF secret on `/portal/auth/*` answers 403 `{ name: "ClubAdminError", message: "Forbidden" }` (`portal-auth.ts` `bffOnly` uses `refuseWith`), unlike the coach policy 403. The BFF treats any 403 from an auth route as a configuration fault: logs `portal-bff: secret refused` once and answers 503 "Nu am putut încărca datele." (T7). No backend change needed.
5. **G5, two Google 401 texts on the invite path.** `POST /portal/auth/google` answers 401 for both "Nu am găsit un cont pentru adresa asta." and "Contul Google nu are adresa <e-mail>."; the BFF shows the message as sent through the flash cookie (T8), so no status split is needed. Noted only.

## Rulings made while planning (low impact, decided by Claude; the user may overrule any line)

Log each in DECISIONS.md as "plan 6 frontend, decided by Claude (low impact, 2026-11-06)" in Task 20.

1. **Route files** live under `src/app/(antrenor)/antrenor/` (URLs unchanged for the coach); the spec's `src/app/(antrenor)/api/portal/...` would make `/api/portal/*` a route of the main domain too. Two root layouts need the site in `src/app/(site)/` (T1); `src/app/api/*` stays at the root.
2. **No Strapi call in a server component** except the invite read and the Google config read (no session, no cookie to rotate): every page that needs a session loads through the BFF from the browser, so a refresh always happens where cookies can be written. The portal layout only checks that the refresh cookie exists and otherwise redirects to `/intrare`.
3. **Invite bridge**: `GET /invitatie/<secret>` stores the secret in the httpOnly cookie `es_inv` (30 minutes) and answers 303 to `/invitatie`, so the secret leaves the address bar, history and referrers at once; accept and Google read it from the cookie.
4. **Messages across a redirect** (Google callback refusals) travel in an httpOnly flash cookie `es_flash` (60 s) that `GET /api/portal/auth/flash` returns and clears; no message or e-mail in a URL.
5. **Refresh grace cache**: the refresher keeps each finished refresh for 30 s keyed by the SHA-256 of the old refresh token (the backend refuses a previous token for 30 s without revoking), in process memory: one Next container, as `src/lib/rate-limit.ts` assumes.
6. **BFF login first layer**: `rateLimit("portal-auth:<ip>", { max: 30, windowMs: 900000 })` on login, reset and invite accept, answering 429 with the pause text (spec 6.5; same numbers as S14).
7. **"Continuă cu Google" is hidden** when `GET /portal/auth/google/config` answers `clientId: null` (local and test).
8. **Screen-reader labels** with no spec text: back arrow "Înapoi", month arrows "Luna anterioară" / "Luna următoare", initials tile "Profil". Companion round with the renders.
9. **Desktop**: top menu "Azi" / "Grupe" / "Istoric", the name menu holds "Profil" and "Ieși din cont"; split list and detail only on Grupe (spec 9 layout; Istoric rows navigate).
10. **Coach BFF allow-list**: the 27 coach routes of `02-coach.ts` exactly; anything else answers 404 without a Strapi call. Bodies over 64 KB answer 413 "Cerere invalidă.".

## Deploy notes (spec 14.4; only with the user's approval, after the backend deploy)

1. Next env: `PORTAL_BFF_SECRET` (the same value as Strapi), `PORTAL_HOST_ANTRENOR=antrenor.scoaladepatinaj.com`, `STRAPI_INTERNAL_URL` (existing).
2. nginx (backend stack, not this repo): server block `antrenor.scoaladepatinaj.com` proxying to the Next container with `proxy_set_header X-Real-IP $remote_addr;`, `X-Forwarded-Proto $scheme`, `Host $host`; mask invite secrets in the access log with
   `map $request_uri $portal_uri { ~^/invitatie/ /invitatie/***; default $request_uri; }` and a `log_format` using `$portal_uri` instead of `$request` on that server block.
3. TLS certificate for the new name; DNS A record (club item).
4. Google OAuth client redirect `https://antrenor.scoaladepatinaj.com/api/portal/google/callback` (club item).
5. `/protectia-datelor` paragraph about coaches' access: club copy, `COPY NEEDED`, before the first invite (spec 2.1, P6 q10). Not a task here.
