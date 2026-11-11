# Phase 7 Frontend: the Sportiv App Implementation Plan (index)

> **Refreshed 2026-11-11** against frontend `feat/athletes` at 4932686 (portal theme kit, coach canvas screens, training flow, layout v2, motion, behaviour-only tests) and backend `feat/athletes` at e3bc966 (6b sign-in, Securitate, coach additions). The 2026-11-09 amendment (both portals exactly like the Design canvas, differences only as tokens) stands; the kit and shell it waited for now exist. What changed is listed in "Refresh 2026-11-11"; open points in "Open questions for the user".

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The website serves a third site on `sportiv.<domain>`: the BFF for holder sessions (including the 6b second step, passkeys and Securitate) and the phone-first sportiv app with its desktop layout from the 900 px portal breakpoint (login, 2FA step, invite, reset, account menu and picker, Acasă with the promotion moment, Istoric, Calendar, Parcurs with badges, Concursuri and one competition, Abonament și plăți, Setări with Securitate), in the canvas look of `sportiv-canvas-current`, built only from the portal theme and kit that already exist.

**Architecture:** `src/lib/portal/host.ts` replaces its `reserved` site with `sportiv`; `src/middleware.ts` rewrites it into `src/app/(sportiv)/sportiv/`. The BFF modules take the site as a parameter (cookie names stay host-only, `host` sent to Strapi comes from the site). Auth parts are already shared in `src/app/_portal/auth/` (`LoginForm`, `ResetForm`, `InviteForm`, taking `{ copy: AuthCopy; homePath }`), the kit in `src/app/_portal/ui/` and helpers in `src/app/_portal/lib/`; the sportiv root layout sets `data-theme="portal"` on `<body>` as the coach root layout does, so every kit part looks as the canvas with no sportiv-specific style. Coach-only helpers that the sportiv app also needs move into `_portal` (renames listed in the tasks). Sportiv pages are client components that load through `/api/portal/sportiv/*` with the athlete id in the URL (`/<athleteId>/...`). The shell is the kit `PortalShell` (phone: page and floating bottom nav; desktop: 240 px sidebar, sticky 112 px page header band with the now tile, content in the 1040 px container), switched by CSS only.

**Tech Stack:** Next.js 15.5 (App Router), React 19, TypeScript, Tailwind 4 tokens, Node `--test` for pure modules (`scripts/portal/*.test.mjs`), Playwright e2e against the mock Strapi (`tests/e2e/mock-portal.mjs`, `portal-fixtures.mjs`, extended) in the existing `playwright.e2e.config.ts`.

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/specs/2026-11-07-sportiv-app-design.md` (sections 5.3, 6, 7, 8.4 to 8.6, 9, 10.3, 12 bind this plan). HTTP contracts: `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/plans/2026-11-07-phase7-index.md` ("HTTP contracts", binding, refreshed 2026-11-11) and the 6b index `.../2026-11-07-phase6b-index.md` (second step, passkeys, Securitate contracts). Design (layout, copy): `docs/portal/mockups/screens/sportiv-canvas-current/*.dc.html` (the 11 phone boards and the 9 `Desktop*.dc.html` boards listed in its `canvas.json`; the `*Ice`, `Acasa*` and `ContIce` files are older variants and are not built). Theme and kit: `docs/superpowers/specs/2026-11-09-portal-canvas-design.md`, `src/styles/portal-theme.css`, `src/app/_portal/ui/`. Decisions: `docs/portal/DECISIONS.md` (every entry from 2026-11-09 on that names the portal or the kit applies to the sportiv screens: date squares option B, rows always with a date block, sheets with pinned footer and draft until confirm, popups for forms, list limits, no red text in interactive states, motion tokens, standard header height, behaviour-only tests). Coach screens as the reference implementation of each kit pattern: `src/app/(antrenor)/antrenor/`.

## Files of this plan

| File | Tasks | Content |
|---|---|---|
| `2026-11-07-phase7-frontend-index.md` | | this index |
| `2026-11-07-phase7-frontend-1-shell-bff.md` | T1 to T5 | host and middleware, sportiv types and copy, BFF per site with the sportiv allowlist and the second step and Securitate proxies, auth pages and Google on `sportiv.`, shell (account menu, picker, session row) and mock |
| `2026-11-07-phase7-frontend-2-screens.md` | T6 to T13 | Acasă and promotion, Istoric, Calendar, Parcurs and badges, Concursuri and detail, Abonament și plăți, Setări with Date sportiv and Securitate, full checks, boot check and click-through |

13 tasks (the old Task 2 "shared folder check" is gone: the shared folder exists, verified 2026-11-11). Base: frontend `feat/athletes` (4932686 or later) **with the frontend 6b plan merged** (coach 2FA step, passkeys, Securitate UI; `2026-11-07-phase6b-frontend.md`, see open question 2). The controller cuts the integration branch `feat/sportiv` from `feat/athletes` before Task 1; this plan does not create it. Each task runs in its own worktree from `feat/sportiv`.

| Task | Risk | Model | Batch |
|---|---|---|---|
| 1 Host routing and middleware | high (exposure across hosts) | Sonnet | A |
| 2 Types, copy, format helpers | low | Haiku | |
| 3 BFF per site, sportiv allowlist, second step and Securitate proxies, refusals | high (auth) | Sonnet | A |
| 4 Auth pages and Google on `sportiv.` | high (auth) | Sonnet | A |
| 5 Shell, account menu, picker, session row, mock | high (cross-athlete access) | Sonnet | B |
| 6 Acasă and promotion | low | Sonnet | |
| 7 Istoric | low | Haiku | |
| 8 Calendar and `.ics` link | low | Sonnet | |
| 9 Parcurs and badges | low | Sonnet | |
| 10 Concursuri and one competition | high (data exposure in links) | Sonnet | B |
| 11 Abonament și plăți | high (money, document download) | Sonnet | B |
| 12 Setări, Date sportiv, Securitate | high (auth) | Sonnet | B |
| 13 Full checks, boot check, click-through | low | Sonnet | |

Review batches: A = T1, T3, T4; B = T5, T10, T11, T12. One Opus review per batch, never blocking the next batch; one final Opus review after T13.

## Global Constraints

- Repo `/Users/codrin/Documents/Programming/edusport_frontend`, integration branch `feat/sportiv`. Commit only in the worktree the dispatch names; check `git rev-parse --show-toplevel` and `git branch --show-current` before every commit. Never push. Commit messages exactly as given, no attribution.
- **Tests cover behaviour only** (user, 2026-11-11, DECISIONS "Frontend tests cover behaviour only"): login and 2FA, BFF proxy and allowlist, refusals shown, navigation flows, form submits, requests sent, data shown from the answer, downloads. Never positions, sizes, bounding boxes, colours, computed CSS, fonts, radii, screenshots, `built-*.png`, look sweeps, or tables of copy strings. Show and hide states are read from attributes (`aria-hidden`, `open`, `aria-expanded`); text that exists in the phone header and the desktop body is located with `.locator("visible=true")`. Visual placement is checked by the user on localhost.
- **Machine load** (user, 2026-11-10): Playwright never above `--workers=2` (the config runs 1), one `next build` at a time, no two full suites at once, at most two heavy agents; check `uptime` first.
- Checks per task: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens` (a lint), the task's own `node --test scripts/portal/<file>.test.mjs` and its own e2e file (`npm run test:e2e -- tests/e2e/<file> --workers=1`). Full suites (`npm run test:scripts`, `npm run test:e2e`) once in Task 13 in a background worktree.
- Copy: exact strings from `src/lib/portal/copy-sportiv.ts` and `copy-shared.ts` only (spec quotes and the board text); Romanian, terse, no em or en dash, no middle dot, straight quotes, "E-mail", no emoji; server messages shown as sent. Counts through the `roCount` pattern the coach copy uses. The copy test is the character guard of `scripts/portal/copy.test.mjs` extended to the sportiv module, plus count agreement; no list of design strings.
- Look: exactly the `sportiv-canvas-current` boards, through the portal theme and the kit. No sportiv token file, no hex and no arbitrary pixel value in a sportiv file; a value the theme lacks goes into `src/styles/portal-theme.css` with a comment naming the board, in the same task. Kit rules apply as built: date squares option B (weekday, day, hour in one square; rows without an hour show weekday and day), every list row has a date block, square shapes (only the floating menu, its active item, the date block and the spinner are rounded, as the kit draws them), no dashed or dotted lines, no tabs, no red text except the date block's top word, no red text in hover, focus or selected states, motion only through the `--motion-*` tokens (all off under `prefers-reduced-motion`).
- Desktop: from the `portal:` breakpoint (900 px) the kit sidebar (240 px, wordmark, nav with Concursuri for performance athletes, the account button at its foot) and the sticky page header band (`--portal-band-h`, the live now tile on the right, see open question 5); content in the `--portal-container` (1040 px); two-part pages use the kit `Columns`/`Column` 3:2 grid with the main part left and short side columns sticky; sub lines are `PageSub` in the body on desktop. Below 900 px the phone layout with the compact sticky top bar (`PhoneBar`). Every screen builds its desktop layout from the matching `Desktop*.dc.html` board, read from the board's markup (never from a screenshot).
- Lists (user, 2026-11-10): dashboards show at most 5 rows ("Vezi toate" when more); pages show 20 rows then the secondary button "Arată mai multe", which loads the next 20 and moves focus to the first new row (Istoric, Plăți, Concursuri; see open question 3).
- Forms: every edit is a kit `Sheet` with `popup`, the shared footer (Renunță and the confirm side by side, the refusal line above them) and draft until confirm; popups are URL driven over their opener (as `/?nou=1` on the coach site), closing removes the flag.
- Session rows (user 2026-11-07, adapted to the kit): wherever upcoming or calendar sessions are listed (Acasă, performance Acasă, the Calendar day list) a row shows the kit `DateBlock` (weekday, day, hour), the place, and on the right a kit `EndBlock` band with the group name, "Individual" or "Concurs"; kinds group, lesson, competition and cancelled map to `EndBlock` kinds (competition and cancelled added to the kit in Task 5, tokens only). Trainer and full details show only when the row is opened, through a native `<details>`/`<summary>` (keyboard: Tab, Enter and Space). One `SportivSessionRow` serves all three lists.
- Hosts: `sportiv.<domain>` and `sportiv.localhost` (outside production only) serve only the sportiv app; `noindex`, `robots.txt` "Disallow: /", no Umami, `Referrer-Policy: no-referrer`. Cookies host-only as phase 6; the two portal hosts never share a cookie. Sign-in URLs (6b, English): `/login`, `/login/2fa`, `/forgot-password`, `/invite`, `/invite/<secret>`; Google refusals land on `/login?error=google`.
- Error branching (contracts): 401 refresh once then `/login`; 403 non-`ClubAdminError` clear cookies and `/login`; 403 `ClubAdminError` "Nu mai ai acces la acest sportiv." go to `/` with that toast; a load failure shows "Nu am putut încărca datele." with the secondary "Încearcă din nou".
- Synthetic data only (`@example.invalid`). Ports: e2e inside the existing config (Next 3200, mock Strapi 18890, mock portal 18891; Task 1 adds `PORTAL_HOST_SPORTIV: "sportiv.localhost:3200"` to its env); boot check Postgres 55484, Strapi 1414, Next 3231, fake skate-results 18895. Never 3010, 1337, 1340, 5432, 3218, 18892 or the ports of other plans (backend index "Boot checks").
- Ledger `/Users/codrin/Documents/Programming/edusport_frontend/.superpowers/sdd/2026-11-07-phase7-frontend/progress.md`.

## Review Focus

- **Two athletes in one account, two tabs**: tab 1 on Ana, tab 2 switches to Matei; tab 1 still shows and loads Ana (the id is in the URL, never in a cookie). Pinned by Task 5 e2e.
- **Access removed while the app is open**: the next load answers the `ClubAdminError` 403; the app lands on `/` with "Nu mai ai acces la acest sportiv." and the athlete is gone from the menu; a policy 403 lands on `/login`. Pinned by Task 3 (`classifySportiv`) and Task 5 e2e.
- **A coach cookie on the sportiv host** (same browser, coach logged in on `antrenor.localhost`): `sportiv.localhost` shows its login page; no request carries the coach cookie. Pinned by Task 3 and Task 1.
- **A holder with 2FA**: the password step answers a pending login; the pending secret never reaches page script, the device key from the answer is stored at once and sent back with the code, and the code completes the login on `sportiv` only. Pinned by Task 3 and Task 4.
- **Promotion with reduced motion**: the dialog shows the new level at once, focus is inside, Escape and "Mai departe" both post `promotion/seen` once. Pinned by Task 6.
- **Competitions unavailable**: Concursuri, its detail and the Acasă card show "Rezultatele nu sunt disponibile acum."; the rest of Acasă renders. Pinned by Task 10 and Task 6.

## File Structure

```
src/lib/portal/host.ts                    Site "sportiv" replaces "reserved" (T1)
src/middleware.ts                         PORTAL_HOST_SPORTIV (T1)
src/lib/portal/copy-sportiv.ts            SPORTIV_AUTH: AuthCopy and the screen copy (T2)
src/lib/portal/sportiv-types.ts           backend api-types copied verbatim (T2)
src/lib/portal/sportiv-format.ts          dates, money, counts (reuses format.ts) (T2)
src/lib/portal/site.ts                    PortalSite, siteOf(host) (T3)
src/lib/portal/sportiv-routes.ts          allowedSportivRoute, sportivQuery, classifySportiv (T3)
src/app/(sportiv)/layout.tsx, sportiv/{login,login/2fa,forgot-password,invite,invite/[secret],robots.txt,not-found,[...missing]} (T4)
src/app/(sportiv)/sportiv/api/portal/{auth,google,me/[...path],sportiv/[...path]} (T3, T4)
src/app/_portal/lib/{use-portal,show-more}.ts(x), src/app/_portal/ui/SheetFooter.tsx (moved from the coach folder, T5)
src/app/(sportiv)/sportiv/(app)/layout.tsx (kit PortalShell), page.tsx (picker), _ui/{AccountSheet,SportivSessionRow}.tsx, _lib/{use-sportiv,nav}.ts (T5)
src/app/(sportiv)/sportiv/(app)/[athleteId]/{page,istoric,calendar,parcurs,concursuri,concursuri/[resultId],plati}/ (T6 to T11)
src/app/(sportiv)/sportiv/(app)/setari/, setari/sportiv/[athleteId]/, setari/securitate/ (T12)
tests/e2e/mock-portal.mjs, portal-fixtures.mjs (+ sportiv fixtures), tests/e2e/sportiv-*.spec.ts
scripts/portal/clickthrough-sportiv.mjs (T13)
```

## HTTP contracts

Backend contracts (Strapi, binding): the backend index named above, sections "Auth routes (phase 6 and 6b, changed)", "Securitate" and "Sportiv routes"; its `api-types.ts` block is copied verbatim into `src/lib/portal/sportiv-types.ts` (T2). The 6b security types are already copied by the frontend 6b plan (`src/lib/portal/security-types.ts`) and reused.

Browser to BFF on `sportiv.<domain>` (this plan, same body and `data` shapes as the backend unless stated):

| Browser calls | BFF does | Notes |
|---|---|---|
| `POST /api/portal/auth/login` `{ email, password }` | Strapi `auth/login` with `host: 'sportiv'` and the device cookie's key | a session answer sets `es_at`, `es_rt`, `es_dev` (host-only); a pending answer stores `deviceKey` as `es_dev` at once and `pending` in the pending cookie, and gives the page only the `SecondStep` |
| `POST /api/portal/auth/2fa`, `2fa/email` | as the 6b coach handlers, `deviceKey` from the device cookie | clears the pending cookie on success and on 401 "Intrarea a expirat. Intră din nou." |
| `POST /api/portal/auth/passkey/options`, `passkey/verify` | as 6b with `host: 'sportiv'` | |
| `POST /api/portal/auth/reset/request`, `reset/confirm` | as phase 6 and 6b with `host: 'sportiv'` | `reset/confirm` may answer a pending login |
| `GET /invite/<secret>` -> 303 `/invite`; `POST /api/portal/auth/invite/read`, `invite/accept` | as phase 6; `{ session: null, host }` -> 200 `{ data: { login: true } }`, page shows the login form | |
| `GET /api/portal/google/start?invite=`, `GET /api/portal/google/callback` | redirect URI `https://<PORTAL_HOST_SPORTIV>/api/portal/google/callback`; a pending answer goes to `/login/2fa`; a refusal to `/login?error=google` | |
| `POST /api/portal/auth/logout` | as phase 6, also clears the pending cookie | |
| `GET\|POST\|PUT\|DELETE /api/portal/me/<path>` | forwards only the 6b Securitate routes (`security-routes.ts` of the frontend 6b plan) | same handler as the coach host, site-aware |
| `GET\|PUT\|POST\|DELETE /api/portal/sportiv/<path>` | forwards only paths of `sportiv-routes.ts` (the backend table) with only the listed query keys | `calendar.ics` and `documents/acord` stream the body with the backend's `Content-Type` and `Content-Disposition` |

Allowed query keys: `history`, `payments`: `page`; `calendar`: `month`; `competitions`: `q`, `season`, `sort`, `page`. Any other path or method: 404 without calling Strapi. The coach host's handler never forwards `/portal/sportiv/*`, this one never forwards `/portal/coach/*`.

## Rulings made while planning (low impact, decided by Claude)

Log each in DECISIONS.md as "plan 7 frontend, decided by Claude (low impact, 2026-11-07)" (1 to 7) or "(2026-11-11 refresh)" (8 to 12).
1. URL shape `/<athleteId>/<page>` with Romanian page names `istoric`, `calendar`, `parcurs`, `concursuri`, `plati`; Setări at `/setari` (no athlete) (T5).
2. Picker at `/` when the account holds two or more athletes and none was opened in this tab; one athlete redirects `/` to `/<id>` (T5).
3. The `.ics` and PDF downloads are plain links to BFF handlers that stream the backend body; no client-side blob (T8, T11).
4. Superseded 2026-11-11: the 2FA row of Setări is no longer behind a flag; Setări links to a Securitate page with 2FA, chei de acces and devices, as the coach Securitate (open question 1) (T12).
5. Superseded 2026-11-09: the shared parts take the canvas look through the portal theme.
6. One 900 px breakpoint (the kit `portal:` variant) switches phone and desktop layouts, in CSS, not in JS (T5).
7. The desktop sidebar and page header are the kit `Sidebar` and `PageHeader` as built (T5).
8. Coach-only helpers the sportiv app needs move to `_portal` instead of being copied: `src/app/(antrenor)/antrenor/_ui/SheetFooter.tsx` -> `src/app/_portal/ui/SheetFooter.tsx`, `src/app/(antrenor)/antrenor/_lib/show-more.tsx` -> `src/app/_portal/lib/show-more.tsx`, `src/app/(antrenor)/antrenor/_lib/use-portal.ts` -> `src/app/_portal/lib/use-portal.ts` (coach imports updated, behaviour unchanged) (T5).
9. The account button opens the athlete menu as a URL-driven popup `?cont=1` over the current page (open question 7) (T5).
10. "Arată mai multe" on server-paged lists loads the next page of 20 and appends it (T7, T10, T11).
11. `SportivSessionRow` lives in the sportiv `_ui` folder (it differs from the coach `SessionRow`, which links to presence); `EndBlock` gains the kinds `competition` and `cancelled` (tokens only) (T5).
12. The Securitate page is the coach `SecurityView` of the frontend 6b plan moved to `src/app/_portal/security/` and given the API prefix of its site (T12).

## Brand (user, 2026-11-07, binding for both portals)

Both portals use the real EduSport brand as the public site does; the brand block is the kit `BrandBlock`, already used by the coach shell and the kit `AuthFrame` ("Portal sportiv" through `PORTAL_LABEL.sportiv`). Nothing new.

## Refresh 2026-11-11 (what changed in these plans)

- The kit, theme, shell, shared auth forms and helpers exist: tasks reuse them by their real names (`PortalShell`, `Sidebar`, `BottomNav`, `PageHeader`, `PageSub`, `PhoneBar`, `NowTile`, `PageBody`/`Columns`/`Column`, `DateBlock`, `EndBlock`, `ListRow`, `KeyValueCard`, `StatCard`, `SectionHeading`, `PortalCard`, `Sheet`, `Segmented`, `MonthGrid`, `MonthPicker`, `CalendarLegend`, `CompetitionCard`, `PlaceBlock`, `PointsCell`, `StatusBlock`, `Toast`, `Spinner`, `LoadError`, `AuthFrame`, `EntryReveal`); the old check-only Task 2 is removed and tasks renumbered (old T3 -> T2 and so on).
- Values fixed against the code: container 1040 px (was 1200), header band 112 px with the now tile, date squares option B (was a 52 px block with the time beside it), the e2e config ports (3200, 18890, 18891; was a separate 18892 and 3218), `host.ts` has a `reserved` site to replace.
- 6b: the sportiv BFF handles pending logins, the device key round trip, passkeys and the Securitate proxy; English sign-in URLs including `/login/2fa`; `?error=google`.
- Tests: every visual assertion (colours, px, radius, computed CSS, look sweep, screenshots, widths) and every copy table removed; e2e keeps behaviour.
- List limits (20 and "Arată mai multe") replace the drawn pager; dashboards cap at 5.

## Open questions for the user

The backend index lists all seven with their defaults; these plans follow the defaults. The ones that change frontend work:
1. Securitate on sportiv (default: yes, as the coach).
2. Order: the frontend 6b plan (coach 2FA, passkeys, Securitate; still written for `/intrare` and the old auth layout) is refreshed and merged before this plan starts (default: yes).
3. List limits replace the drawn pager (default: yes).
4. Promotion and badge zoom motion follow the motion tokens (default: yes).
5. Now tile on sportiv desktop pages (default: keep).
7. Account button opens the athlete menu as a `?cont=1` popup (default: yes).
