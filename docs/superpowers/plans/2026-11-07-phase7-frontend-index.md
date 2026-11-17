# Phase 7 Frontend: the Sportiv App Implementation Plan (index)

> **Refreshed 2026-11-12.** What changed:
> - Plans A (`2026-11-09-portal-theme-kit.md`) and B (`2026-11-09-portal-redesign-index.md`) are done on `feat/portal` (merge `d9cacb3`); the old Task 2 "shared folder check" is removed and the tasks are renumbered 1 to 13. Every task reuses the built kit (`src/app/_portal/ui`, `src/app/_portal/lib`, `src/styles/portal-theme.css`, `src/lib/portal/{copy,copy-shared,format,month-grid}.ts`) and mirrors the coach app (`src/app/(antrenor)/antrenor/`).
> - HTTP contracts and fixtures follow backend `main` `716b4cc` (`src/club/portal/sportiv/api-types.ts`, `src/api/portal/routes/04-sportiv.ts`, `src/api/portal/controllers/sportiv.ts`): page size 20, `lastCompetition` null hides the card, `{ available: false }` only when skate-results is down, calendar month clamped by the backend, `.ics` file name `edusport-<prenume-slug>.ics`, the Acord PDF a binary route, money shown as sent.
> - Removed: portal 2FA, passkeys, "chei de acces" and `NEXT_PUBLIC_PORTAL_2FA` (user: e-mail/password or Google only); every assertion on colours, radii, sizes, positions, fonts, computed CSS and screenshots, the look sweep, `test:visual`, `test:a11y` and `portal-theme.test.mjs` (user: behaviour tests only, DECISIONS 2026-11-11).
> - Desktop shell is the coach one: kit container `--portal-container` (1040px), 112px header band, `Columns`/`half`, Sidebar account menu (DECISIONS "Desktop account menu").
> - One worktree (this one, `feat/sportiv`), tasks sequential; Playwright `--workers=2`; e2e on the shared config (mock 18891, Next 3200).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The website serves a third site on `sportiv.<domain>`: a BFF for holder sessions and the phone-first sportiv app with a desktop layout (login, invite, reset, account menu and picker, Acasă with the promotion moment, Istoric, Calendar, Parcurs with badges, Concursuri and one competition, Abonament și plăți, Setări), built from the kit the coach portal uses.

**Architecture:** `src/lib/portal/host.ts` gains the `sportiv` site; `src/middleware.ts` rewrites it into `src/app/(sportiv)/sportiv/`. The BFF modules take the site as a parameter (cookies stay host-only; the `host` sent to Strapi comes from the site). Sportiv pages are client components that load `/api/portal/sportiv/*` with the athlete id in the URL (`/<athleteId>/...`), through the kit `portalApi`. The shell is the kit `PortalShell` (phone bottom nav, desktop sidebar with account menu), switched by CSS only.

**Tech Stack:** Next.js 15.5 (App Router), React 19, TypeScript, Tailwind 4 with the portal theme, Node `--test` for pure modules (`scripts/portal/*.test.mjs`), Playwright e2e on `playwright.e2e.config.ts` against `tests/e2e/mock-portal.mjs` (extended).

**Spec:** backend `main`: `docs/superpowers/specs/2026-11-07-sportiv-app-design.md` (5.3, 6, 7, 8.4 to 8.6, 9, 10.3, 12). Contracts: backend `main` files named above (binding; where the spec or the backend phase 7 index differ, the code wins). Design: `docs/portal/mockups/screens/sportiv-canvas-current/` boards listed in its `canvas.json` (phone: Main, MainPerf, Promovare, Cont, Istoric, Calendar, Progres, Concursuri, ConcursDetaliu, Plati, Setari; desktop: the `Desktop*.dc.html` of the same screens; `*Ice`, `Acasa*`, `ContIce` are old variants, not built), plus the current coach portal for every shared part. Decisions: `docs/portal/DECISIONS.md` (entries 2026-11-09 to 2026-11-11 bind).

## Files of this plan

| File | Tasks |
|---|---|
| `2026-11-07-phase7-frontend-1-shell-bff.md` | T1 to T5: host and middleware, types/copy/format, BFF per site and allowlist, auth pages and Google, shell with account menu, picker, session row and mock |
| `2026-11-07-phase7-frontend-2-screens.md` | T6 to T13: Acasă and promotion, Istoric, Calendar, Parcurs, Concursuri, Abonament și plăți, Setări, full checks and boot check |

| Task | Risk | Model | Review batch |
|---|---|---|---|
| 1 Host routing and middleware | high (exposure across hosts) | Sonnet | A |
| 2 Types, copy, format helpers | low | Haiku | |
| 3 BFF per site, sportiv allowlist | high (auth) | Sonnet | A |
| 4 Auth pages and Google on `sportiv.` | high (auth) | Sonnet | A |
| 5 Shell, account menu, picker, session row, mock | high (cross-athlete access) | Sonnet | B |
| 6 Acasă and promotion | low | Sonnet | |
| 7 Istoric | low | Haiku | |
| 8 Calendar and `.ics` link | low | Sonnet | |
| 9 Parcurs and badges | low | Sonnet | |
| 10 Concursuri and one competition | high (data exposure) | Sonnet | B |
| 11 Abonament și plăți | high (money, PDF) | Sonnet | B |
| 12 Setări and Date sportiv | low | Sonnet | |
| 13 Full checks, boot check, click-through | low | Sonnet | |

Reviews: one per batch (A after T4, B after T11), one final review after T13; no per-task review for low-risk tasks.

## Global Constraints

- Repo `/Users/codrin/Documents/Programming/edusport_frontend`, worktree `.claude/worktrees/sportiv`, branch `feat/sportiv`. All tasks run here in order. Check `git branch --show-current` is `feat/sportiv` before each commit. Never push. Commit messages exactly as given, no attribution.
- Checks per task: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, the task's own `node --test` files and its own e2e file with `npm run test:e2e -- <file> --workers=2`. Full suites once in Task 13.
- Tests check behaviour only: text shown, navigation, requests sent (mock log), focus, keyboard, downloads, refusals, and reduced motion as "element absent". No assertion on colours, radii, sizes, positions, fonts, computed CSS or screenshots. Text that exists twice (phone header and desktop `PageSub`) is located with `.locator("visible=true")`.
- Copy: exact strings in `src/lib/portal/copy-sportiv.ts` (sportiv) and `copy-shared.ts` / `copy.ts` (reused); Romanian, terse, no em or en dash, no middle dot, straight quotes, "E-mail", no emoji; server messages and toasts shown as sent. Counts through `roCount` (`src/lib/ro-plural.ts`). Sections named by their content.
- Look: the boards, through the portal theme and kit. No hex, no `--sp-*` token, no sportiv stylesheet; a value the theme lacks goes into `src/styles/portal-theme.css` (comment: board name). Shapes square except the bottom nav, the date block and the spinner; no pills, no circles, no dashed or dotted lines. No red text except the date block word.
- Desktop: the kit `PortalShell` (sidebar from the `portal:` breakpoint), `PageHeader` band, `PageBody` with `Columns` (3:2) or `Columns half`; each screen follows its `Desktop*` board for what goes in which column.
- Session rows (Acasă, Calendar day list): kit `SessionRow` (T5): `DateBlock` with weekday, day and hour; place; an `EndBlock` with the group name, "Individual" or "Concurs" (kinds `group`, `lesson`, `competition`, `cancelled`); trainer and full details inside a native `<details>`.
- Hosts: `sportiv.<domain>` and `sportiv.localhost` (non-production, or production through `PORTAL_HOST_SPORTIV`) serve only the sportiv app; `noindex`, `robots.txt` "Disallow: /", no Umami, `Referrer-Policy: no-referrer`. The two portal hosts never share a cookie.
- Error branching: 401 refresh once then `/login`; 403 not `ClubAdminError` clears cookies, `/login`; 403 `ClubAdminError` "Nu mai ai acces la acest sportiv." goes to `/` with that toast.
- `prefers-reduced-motion: reduce` turns every animation off (portal motion tokens already do; new keyframes use them).
- Synthetic data only (`@example.invalid`). Ports: e2e mock 18891 and Next 3200 (shared config); boot check Postgres 55468, Strapi 1388, Next 3218, fake skate-results 18894; never 3010, 1337, 1340, 5432.
- Ledger `/Users/codrin/Documents/Programming/edusport_frontend/.superpowers/sdd/2026-11-07-phase7-frontend/progress.md`.

## Review Focus

- **Two athletes, two tabs**: tab 1 on Ana, tab 2 switches to Matei; tab 1 still loads Ana (id in the URL, never in a cookie). Pinned by T5 e2e.
- **Access removed while open**: the next load answers the `ClubAdminError` 403; the app lands on `/` with "Nu mai ai acces la acest sportiv." and the athlete is gone from the menu; a policy 403 lands on `/login`. Pinned by T3 (`classifySportiv`) and T5 e2e.
- **Coach cookie on the sportiv host**: `sportiv.localhost` shows its login page; no request carries the coach cookie. Pinned by T1 and T3.
- **Promotion with reduced motion**: the dialog shows the new level at once, focus inside, Escape and "Mai departe" both post `promotion/seen` once. Pinned by T6.
- **Competitions down vs none**: `{ available: false }` shows "Rezultatele nu sunt disponibile acum." on Concursuri, the detail and the Acasă card, the rest of Acasă renders; `lastCompetition: null` hides the card. Pinned by T6 and T10.

## File Structure

```
src/lib/portal/host.ts                    Site "sportiv" (T1)
src/middleware.ts                         PORTAL_HOST_SPORTIV (T1)
src/lib/portal/sportiv-types.ts           backend api-types.ts verbatim (T2)
src/lib/portal/copy-sportiv.ts            sportiv copy, SPORTIV_AUTH (T2)
src/lib/portal/sportiv-format.ts          historyWhen, ron, range, sinceText (T2)
src/lib/portal/site.ts, sportiv-routes.ts PortalSite, allowlist, classifySportiv (T3)
src/app/(sportiv)/layout.tsx, sportiv/{login,forgot-password,invite,robots.txt,not-found,[...missing]} (T4)
src/app/(sportiv)/sportiv/api/portal/{auth,google,sportiv/[...path]} (T3, T4)
src/app/(sportiv)/sportiv/(app)/layout.tsx, page.tsx, _ui/{SportivShell,AccountSheet}.tsx, _lib/{use-sportiv,nav,athletes-context}.ts(x) (T5)
src/app/_portal/ui/{SessionRow,Pager}.tsx (T5), EndBlock.tsx (+ kinds, T5), MonthGrid.tsx and CalendarLegend.tsx (+ concurs, T8)
src/app/(sportiv)/sportiv/(app)/[athleteId]/{page,istoric,calendar,parcurs,concursuri,concursuri/[resultId],plati}/ (T6 to T11)
src/app/(sportiv)/sportiv/(app)/setari/{page,parola,dispozitive}, setari/sportiv/[athleteId]/ (T12)
src/app/_portal/ui/{DeviceList,PasswordForm}.tsx (moved out of the coach profile, T12)
tests/e2e/mock-sportiv.mjs, sportiv-fixtures.mjs, sportiv-helpers.ts, sportiv-*.spec.ts
scripts/portal/clickthrough-sportiv.mjs (T13)
```

## HTTP contracts

Backend (binding): `main:src/api/portal/routes/04-sportiv.ts`, all under `/portal/sportiv`:

| Method | Path | `data` |
|---|---|---|
| GET / PUT | `/me` | `SportivMe` / body `{ name?, phone? }` -> `{ toast }` |
| PUT | `/me/notifications` | body `{ schedule: boolean }` -> `{ toast }` |
| POST | `/me/password` | body `{ current, password }` -> `{ toast }` |
| GET / DELETE | `/me/devices`, `/me/devices/:id` | `PortalDevice[]` / `{ revokedCurrent }` |
| GET | `/athletes` | `SportivAthletes` |
| GET | `/athletes/:id/home` | `SportivHome` |
| POST | `/athletes/:id/promotion/seen` | |
| GET | `/athletes/:id/profile` | `SportivProfile` |
| GET | `/athletes/:id/history?page=` | `SportivHistory` (20 a page) |
| GET | `/athletes/:id/calendar?month=YYYY-MM` | `SportivCalendar`; no `month`: today's month clamped to the season; a month outside the season: 400 |
| GET | `/athletes/:id/calendar.ics` | file `text/calendar`, `attachment; filename="edusport-<slug>.ics"` |
| GET | `/athletes/:id/competitions?q=&season=&sort=&page=` | `SportivCompetitions` (20 a page; unusable filters fall back) |
| GET | `/athletes/:id/competitions/:resultId` | `SportivCompetition` |
| GET | `/athletes/:id/path` | `SportivPath` |
| GET | `/athletes/:id/money` | `SportivMoney` (same figures as the admin ledger; never recomputed in the browser) |
| GET | `/athletes/:id/payments?page=` | `SportivPayments` (20 a page) |
| GET | `/athletes/:id/subscriptions` | `SportivSubscriptions` |
| GET | `/athletes/:id/documents/acord` | file `application/pdf`; none: 404 |

An athlete id the holder does not hold: 403 `ClubAdminError` "Nu mai ai acces la acest sportiv.".

Browser to BFF on `sportiv.<domain>`:

| Browser calls | BFF does |
|---|---|
| `POST /api/portal/auth/{login,logout,reset/request,reset/confirm,invite/read,invite/accept}`, `GET /api/portal/auth/flash` | the coach handlers with `site: "sportiv"` (`host: "sportiv"` to Strapi, sportiv device cookie) |
| `GET /invite/<secret>` -> 303 `/invite` | as coach |
| `GET /api/portal/google/start?invite=`, `/callback` | redirect URI `https://<PORTAL_HOST_SPORTIV>/api/portal/google/callback` |
| `GET\|PUT\|POST\|DELETE /api/portal/sportiv/<path>` | forwards only the table above with only its query keys (`page`; `month`; `q`, `season`, `sort`, `page`); the two file routes stream body, `Content-Type` and `Content-Disposition` |

Any other path or method: 404 without calling Strapi. The coach handler never forwards `/portal/sportiv/*`; this one never forwards `/portal/coach/*` or `/portal/auth/2fa*`, `/portal/auth/passkey*`.

## Decided by Claude (low impact)

Log in DECISIONS.md (T13) as "phase 7 frontend, decided by Claude (low impact)".
1. URLs `/<athleteId>/{istoric,calendar,parcurs,concursuri,plati}`, Setări at `/setari` (no athlete), Date sportiv at `/setari/sportiv/<athleteId>`.
2. `/` is the picker with two or more `inPicker` athletes; with one it redirects to `/<id>`. Athletes with `inPicker: false` are not in the picker or the menus, stay reachable by URL and listed under Setări "Sportivi".
3. `.ics` and PDF are plain links to the BFF; no client-side blob.
4. Desktop container is the kit's 1040px (the boards draw 1200): one shell for both portals.
5. Desktop account button: label the athlete's first name, `href` `/setari`; its hover menu lists the other `inPicker` athletes (go to `/<id>` of the same page), then "Setări cont" and "Ieși din cont" (coach `PROFILE` copy). Phone: the header button opens `AccountSheet` (board Cont: "Setări", "Ieșire").
6. Nav icons: Acasă `portal-azi`, Istoric `portal-istoric`, Concursuri `portal-concursuri`, new `portal-parcurs` and `portal-plati` drawn from the boards' nav icons.
7. Calendar: no month in the URL; the first load sends none, the arrows use `prevMonth` / `nextMonth` and are disabled when null.
8. Istoric, Plăți list and Concursuri page on the server (20) with a `Pager` ("Înapoi" / "Înainte", "1 - 20 din 26").
9. No now tile in the sportiv header (no board draws one).
10. The board's 2FA row of Setări is not built (user: no portal 2FA).
11. Acasă competition card second line `<category>, <placement> din <field>` as the MainPerf board draws it; without `field` only the category.
</content>
</invoke>
