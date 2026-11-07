# Phase 7 Frontend: the Sportiv App Implementation Plan (index)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The website serves a third site on `sportiv.<domain>`: the BFF for holder sessions and the phone-first sportiv app (login, invite, reset, account menu and picker, Acasă with the promotion moment, Istoric, Calendar, Parcurs with badges, Concursuri and one competition, Abonament și plăți, Setări), in the approved ice look.

**Architecture:** `src/lib/portal/host.ts` gains the `sportiv` site; `src/middleware.ts` rewrites it into `src/app/(sportiv)/sportiv/`. The phase 6 BFF modules take the site as a parameter (cookie names stay host-only, `host` sent to Strapi comes from the site). Auth and shell parts shared by both apps move to `src/app/_portal/` and take a theme and a copy object. Sportiv pages are client components that load through `/api/portal/sportiv/*` with the athlete id in the URL (`/<athleteId>/...`).

**Tech Stack:** Next.js 15.5 (App Router), React 19, TypeScript, Tailwind 4 tokens, Node `--test` for pure modules (`scripts/portal/*.test.mjs`), Playwright e2e against the mock Strapi (`tests/e2e/mock-portal.mjs`, extended).

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/specs/2026-11-07-sportiv-app-design.md` (sections 5.3, 6, 7, 8.4 to 8.6, 9, 10.3, 12 bind this plan). HTTP contracts: `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/plans/2026-11-07-phase7-index.md` ("HTTP contracts", binding). Design (layout, copy, palette): `docs/portal/mockups/screens/phase7-sportiv-canvas/*.dc.html`. Phase 6 frontend plans `2026-11-06-phase6-frontend-*.md` (conventions carried). Decisions: `docs/portal/DECISIONS.md`.

## Files of this plan

| File | Tasks | Content |
|---|---|---|
| `2026-11-07-phase7-frontend-index.md` | | this index |
| `2026-11-07-phase7-frontend-1-shell-bff.md` | T1 to T6 | host and middleware, shared portal folder and copy split, sportiv types, copy and tokens, BFF per site and the sportiv allowlist, auth pages and Google on `sportiv.`, shell (header, floating menu, account menu, picker), mock Strapi |
| `2026-11-07-phase7-frontend-2-screens.md` | T7 to T14 | Acasă and promotion, Istoric, Calendar, Parcurs and badges, Concursuri and detail, Abonament și plăți, Setări and Date sportiv, full checks, boot check and click-through |

14 tasks. Base: branch `feat/sportiv`, cut by the controller from the frontend `feat/athletes` (bb24aeb or later) before Task 1; this plan does not create it. The plan files themselves live on `docs/portal-design`. Each task runs in its own worktree from `feat/sportiv`.

| Task | Risk | Model | Batch |
|---|---|---|---|
| 1 Host routing and middleware | high (exposure across hosts) | Sonnet | A |
| 2 Shared portal folder and copy split | low | Sonnet | |
| 3 Types, copy, tokens, format helpers | low | Haiku | |
| 4 BFF per site, sportiv allowlist, refusals | high (auth) | Sonnet | A |
| 5 Auth pages and Google on `sportiv.` | high (auth) | Sonnet | A |
| 6 Shell, account menu, picker, mock | high (cross-athlete access) | Sonnet | B |
| 7 Acasă and promotion | low | Sonnet | |
| 8 Istoric | low | Haiku | |
| 9 Calendar and `.ics` link | low | Sonnet | |
| 10 Parcurs and badges | low | Sonnet | |
| 11 Concursuri and one competition | high (data exposure in links) | Sonnet | B |
| 12 Abonament și plăți | high (money, document download) | Sonnet | B |
| 13 Setări and Date sportiv | low | Sonnet | |
| 14 Full checks, boot check, click-through | low | Sonnet | |

Review batches: A = T1, T4, T5; B = T6, T11, T12.

## Global Constraints

- Repo `/Users/codrin/Documents/Programming/edusport_frontend`, integration branch `feat/sportiv`. Commit only in the worktree the dispatch names; check `git rev-parse --show-toplevel` and `git branch --show-current` before every commit. Never push. Commit messages exactly as given, no attribution.
- Checks per task: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, the task's own `node --test scripts/portal/<file>.test.mjs` and its own e2e file. Full suites once in Task 14 in a background worktree. Never `test:visual:update` without reviewing each diff.
- Copy: exact strings from `src/lib/portal/copy-sportiv.ts` and `copy-shared.ts` only (spec quotes); Romanian, terse, no em or en dash, no middle dot, straight quotes, "E-mail", no emoji; server messages shown as sent. Counts through `roCount`.
- Look (spec 6.1): tokens `--sp-bg #f6f9fd`, `--sp-hi #e1ecfb`, `--sp-line #dde6f3`, `--sp-ice #8fb8f5`, `--sp-navy #0e1a3c`, `--sp-muted #5f657a`, `--sp-cream #fbf8f1`, `--sp-navy-muted #c0c0c4`, `--sp-red #be3330`, `--sp-concurs #4a7bd0`; card shadow `8px 8px 0 rgba(14,26,60,0.16)`; League Spartan and Inter; square cards. Rounded only: the floating menu (18 px), its active item (13 px), date blocks (6 px). No pills, no circles, no dashed or dotted lines, no tabs. Red text only on date-block words. Links navy, underline on hover.
- Hosts: `sportiv.<domain>` and `sportiv.localhost` (outside production only) serve only the sportiv app; `noindex`, `robots.txt` "Disallow: /", no Umami, `Referrer-Policy: no-referrer`. Cookies host-only as phase 6; the two portal hosts never share a cookie.
- Error branching (contracts): 401 refresh once then login; 403 non-`ClubAdminError` clear cookies and login; 403 `ClubAdminError` "Nu mai ai acces la acest sportiv." go to `/` with that toast.
- `prefers-reduced-motion: reduce` turns off every animation of this app.
- Synthetic data only (`@example.invalid`). Ports: e2e mock 18892, Next 3218, boot check Postgres 55468 and Strapi 1388; never 3010, 1337, 1340, 5432.
- Ledger `/Users/codrin/Documents/Programming/edusport_frontend/.superpowers/sdd/2026-11-07-phase7-frontend/progress.md`.

## Review Focus

- **Two athletes in one account, two tabs**: tab 1 on Ana, tab 2 switches to Matei; tab 1 still shows and loads Ana (the id is in the URL, never in a cookie). Pinned by Task 6 e2e.
- **Access removed while the app is open**: the next load answers the `ClubAdminError` 403; the app lands on `/` with "Nu mai ai acces la acest sportiv." and the athlete is gone from the menu; a policy 403 lands on `/intrare`. Pinned by Task 4 (`classifySportiv`) and Task 6 e2e.
- **A coach cookie on the sportiv host** (same browser, coach logged in on `antrenor.localhost`): `sportiv.localhost` shows its login page; no request carries the coach cookie. Pinned by Task 4 and Task 1.
- **Promotion on a slow phone with reduced motion**: the dialog shows the new level at once, focus is inside, Escape and "Mai departe" both post `promotion/seen` once. Pinned by Task 7.
- **Competitions unavailable**: Concursuri, its detail and the Acasă card show "Rezultatele nu sunt disponibile acum."; the rest of Acasă renders. Pinned by Task 11 and Task 7.

## File Structure

```
src/lib/portal/host.ts                    Site "sportiv", routeSportiv (T1)
src/middleware.ts                         PORTAL_HOST_SPORTIV (T1)
src/app/_portal/                          shared auth and shell parts (T2)
src/lib/portal/copy-shared.ts, copy.ts, copy-sportiv.ts (T2, T3)
src/lib/portal/sportiv-types.ts           backend api-types copied verbatim (T3)
src/lib/portal/sportiv-format.ts          dates, money, counts, bars (T3)
src/app/(sportiv)/sportiv/tokens.css      ice tokens (T3)
src/lib/portal/sportiv-routes.ts          allowedSportivRoute, sportivQuery (T4)
src/lib/portal/site.ts                    PortalSite, siteOf(host) (T4)
src/app/(sportiv)/layout.tsx, sportiv/{intrare,am-uitat-parola,invitatie,robots.txt,not-found,[...missing]} (T5)
src/app/(sportiv)/sportiv/api/portal/{auth,google,sportiv/[...path]} (T4, T5)
src/app/(sportiv)/sportiv/(app)/layout.tsx, page.tsx (picker), _ui/{IceHeader,FloatingNav,AccountSheet}.tsx, _lib/{api,use-athlete}.ts (T6)
src/app/(sportiv)/sportiv/(app)/[athleteId]/{page,istoric,calendar,parcurs,concursuri,concursuri/[resultId],plati}/ (T7 to T12)
src/app/(sportiv)/sportiv/(app)/setari/, setari/sportiv/[athleteId]/ (T13)
tests/e2e/mock-portal.mjs (+ sportiv fixtures), tests/e2e/sportiv-*.spec.ts
scripts/portal/clickthrough-sportiv.mjs (T14)
```

## HTTP contracts

Backend contracts (Strapi, binding): the backend index named above, sections "Auth routes (phase 6, changed)" and "Sportiv routes"; its `api-types.ts` block is copied verbatim into `src/lib/portal/sportiv-types.ts` (T3).

Browser to BFF on `sportiv.<domain>` (this plan, same body and `data` shapes as the backend unless stated):

| Browser calls | BFF does | Notes |
|---|---|---|
| `POST /api/portal/auth/login` `{ email, password }` | Strapi `auth/login` with `host: 'sportiv'`, device cookie | sets `es_at`, `es_rt`, `es_dev` (host-only) |
| `POST /api/portal/auth/reset/request`, `reset/confirm` | as phase 6 with `host: 'sportiv'` | |
| `GET /invitatie/<secret>` -> 303 `/invitatie`; `POST /api/portal/auth/invite/read`, `invite/accept` | as phase 6; `{ session: null, host }` -> 200 `{ data: { login: true } }`, page shows the login form | |
| `GET /api/portal/google/start?invite=`, `GET /api/portal/google/callback` | redirect URI `https://<PORTAL_HOST_SPORTIV>/api/portal/google/callback` | |
| `POST /api/portal/auth/logout` | as phase 6 | |
| `GET\|PUT\|POST\|DELETE /api/portal/sportiv/<path>` | forwards only paths of `sportiv-routes.ts` (the backend table) with only the listed query keys | `calendar.ics` and `documents/acord` stream the body with the backend's `Content-Type` and `Content-Disposition` |

Allowed query keys: `history`, `payments`: `page`; `calendar`: `month`; `competitions`: `q`, `season`, `sort`, `page`. Any other path or method: 404 without calling Strapi. The coach host's handler never forwards `/portal/sportiv/*`, this one never forwards `/portal/coach/*`.

## Rulings made while planning (low impact, decided by Claude)

Log each in DECISIONS.md as "plan 7 frontend, decided by Claude (low impact, 2026-11-07)".
1. URL shape `/<athleteId>/<page>` with Romanian page names `istoric`, `calendar`, `parcurs`, `concursuri`, `plati`; Setări at `/setari` (no athlete) (T6).
2. Picker at `/` when the account holds two or more athletes and none was opened in this tab; one athlete redirects `/` to `/<id>` (T6).
3. The `.ics` and PDF downloads are plain links to BFF handlers that stream the backend body; no client-side blob (T9, T12).
4. The 2FA row of Setări is behind `NEXT_PUBLIC_PORTAL_2FA` (unset in phase 7) (T13).
5. Shared parts keep phase 6 class names; the coach screens' visual snapshots must stay unchanged in Task 2 (T2).
