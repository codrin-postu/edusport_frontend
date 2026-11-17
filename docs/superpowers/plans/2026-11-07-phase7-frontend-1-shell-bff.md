# Phase 7 Frontend 1: Host, BFF and Shell Implementation Plan

> Refreshed 2026-11-12: see the index note. Tasks renumbered (old T2 removed).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `sportiv.<domain>` serves its own site with its own session cookies, a BFF that forwards only the sportiv routes, the shared login, reset and invite forms in `AuthFrame portal="sportiv"`, and the app shell (kit `PortalShell`, account menu and sheet, picker, `SessionRow`).

**Architecture:** BFF modules become site-aware through `PortalSite` (`antrenor` | `sportiv`); the coach app keeps its behaviour. The sportiv route group mirrors `src/app/(antrenor)/antrenor/` handler by handler.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, Tailwind 4, Node `--test`, Playwright.

**Spec:** backend `main:docs/superpowers/specs/2026-11-07-sportiv-app-design.md` 5.1, 5.3, 6.1, 6.2, 6.10, 6.11, 10.3, 12. Index `2026-11-07-phase7-frontend-index.md` (constraints, contracts, decisions bind).

## Global Constraints

See the index.

## Review Focus

See the index; lines 1 to 3 are owned by Tasks 1, 3 and 5.

---

### Task 1: Host routing and middleware (high, Sonnet)

**Files:**
- Modify: `src/lib/portal/host.ts`, `src/middleware.ts`, `playwright.e2e.config.ts` (env `PORTAL_HOST_SPORTIV: "sportiv.localhost:3200"`)
- Test: `scripts/portal/host.test.mjs` (extend)

**Interfaces:**
- Produces: `type Site = "site" | "antrenor" | "sportiv"`; `siteForHost(host: string | null, hosts: { antrenor?: string; sportiv?: string }): Site` (callers updated; `"reserved"` removed); `routeRequest(site, rawPathname)` treats `sportiv` with the asset, robots and traversal rules of `antrenor`, rewriting to `/sportiv...`.

- [ ] **Step 1: Failing tests.** `siteForHost("sportiv.codrin.space", { sportiv: "sportiv.codrin.space" })` = `"sportiv"`; `"sportiv.localhost:3218"` = `"sportiv"` outside production, `"site"` with `NODE_ENV=production` and no setting; `"sportiv.other.ro"` = `"site"`; the antrenor cases unchanged. `routeRequest("sportiv", "/")` rewrites `/sportiv`; `"/abc/istoric"` -> `/sportiv/abc/istoric`; `"/antrenor"` and `"/sportiv"` -> notFound; `"/robots.txt"` -> `/sportiv/robots.txt`; `"/%2e%2e/noutati"` -> notFound. `routeRequest("site", "/sportiv")` -> notFound; `routeRequest("antrenor", "/sportiv")` -> rewrite `/antrenor/sportiv` (coach 404).
- [ ] **Step 2: Run** `node --test scripts/portal/host.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement**; middleware reads `PORTAL_HOST_SPORTIV` and sets `X-Robots-Tag: noindex, nofollow` and `Referrer-Policy: no-referrer` on both portal sites.
- [ ] **Step 4: Run** the same command and `npm run test:e2e -- tests/e2e/portal-hosts.spec.ts --workers=2`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal/host.ts src/middleware.ts playwright.e2e.config.ts scripts/portal/host.test.mjs && git commit -m "feat(portal): sportiv host routing"`

### Task 2: Types, copy, format helpers (low, Haiku)

**Files:**
- Create: `src/lib/portal/sportiv-types.ts` (backend `main:src/club/portal/sportiv/api-types.ts` verbatim), `src/lib/portal/copy-sportiv.ts` (with `SPORTIV_AUTH: AuthCopy`), `src/lib/portal/sportiv-format.ts`
- Test: `scripts/portal/sportiv-format.test.mjs`

**Interfaces:**
- Reuses (do not redefine): `weekdayShort`, `monthShort`, `dayMonth`, `longDay`, `dayMonthYear`, `pointsText` of `src/lib/portal/format.ts`; `monthTitle`, `monthCells`, `shiftMonth` of `src/lib/portal/month-grid.ts`; `roCount`.
- Produces:

```ts
export function historyWhen(date: string, time: string | null): string; // "Joi 5 noi, 17:30"; no time: "Joi 5 noi"
export function ron(n: number): string;                                 // "150 RON", "1.250,50 RON", "0 RON"
export function range(from: number, to: number, total: number): string; // "1 - 20 din 26"
export function sinceText(iso: string | null, now: Date): string;      // "acum 3 luni", "acum 5 zile", "azi", "nesetată"
```

- [ ] **Step 1: Failing tests** for each example above. Copy constants are not tested by string tables; the e2e of each screen checks the text it shows.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-format.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement.** `copy-sportiv.ts` holds every sportiv string quoted in these plans, grouped per screen (`NAV_SPORTIV`, `HOME`, `HISTORY`, `CAL`, `PATH`, `COMP`, `MONEY`, `SETARI`, `ACCOUNT`), plus `COMP_DOWN` "Rezultatele nu sunt disponibile acum." and `LOST_ATHLETE` "Nu mai ai acces la acest sportiv."; `SPORTIV_AUTH` reuses the coach `AuthCopy` strings with `PORTAL_LABEL.sportiv`.
- [ ] **Step 4: Run** the same command and `npm run check:tokens`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal scripts/portal && git commit -m "feat(portal): sportiv types, copy and format helpers"`

### Task 3: BFF per site and the sportiv allowlist (high, Sonnet)

**Files:**
- Create: `src/lib/portal/site.ts`, `src/lib/portal/sportiv-routes.ts`, `src/app/(sportiv)/sportiv/api/portal/sportiv/[...path]/route.ts`
- Modify: `src/lib/portal/{bff,server-ctx,auth-route,upstream,google-config}.ts` (site parameter, `host` from the site), `src/lib/portal/coach-routes.ts` (list unchanged)
- Test: `scripts/portal/sportiv-routes.test.mjs`, `scripts/portal/upstream.test.mjs` (extend), `scripts/portal/coach-routes.test.mjs` (extend), `tests/e2e/sportiv-bff.spec.ts`; e2e mock: `tests/e2e/sportiv-fixtures.mjs`, `tests/e2e/mock-sportiv.mjs` (registered from `mock-portal.mjs`; this task adds `calendar.ics` and `me`, T5 the rest), `tests/e2e/sportiv-helpers.ts` (`SPORTIV_BASE = "http://sportiv.localhost:3200"`, `PARENT_EMAIL = "parinte1@example.invalid"`, `ADULT_EMAIL = "sportiv18@example.invalid"`, `loginSportiv(page, email)`)

**Interfaces:**
- Produces: `type PortalSite = "antrenor" | "sportiv"`; `siteOf(host: string | null): PortalSite | null`; `allowedSportivRoute(method: string, path: string): boolean`; `sportivQuery(path: string, q: URLSearchParams): string`; `classifySportiv(status: number, body: unknown): "refresh" | "cut" | "lost-athlete" | "show"`.

- [ ] **Step 1: Failing tests.** Node: every row of the index backend table allowed with its method; `PUT /athletes/abc/home` false; `/athletes/../me` false; an id over 64 characters false; `GET /coach/me` false; `POST /auth/2fa` false. `sportivQuery("/athletes/a/competitions", "q=x&sort=points&evil=1")` keeps `q`, `sort`, drops `evil`; `sportivQuery("/athletes/a/home", "page=2")` drops `page`. `classifySportiv(403, { error: { name: "ClubAdminError", message: "Nu mai ai acces la acest sportiv." } })` = `"lost-athlete"`; 403 other name `"cut"`; 401 `"refresh"`; 404 `"show"`. Coach list refuses `/sportiv/me`. e2e (mock): a login on the sportiv host sends `host: "sportiv"` to the mock even with body `host: "antrenor"`; a coach cookie set on `antrenor.localhost` is absent from every sportiv request in the mock log; `POST /api/portal/sportiv/me/password` with a foreign `Origin` -> 403 and no mock call; `GET /api/portal/sportiv/athletes/<anaId>/calendar.ics` answers `text/calendar` with `Content-Disposition` `attachment; filename="edusport-ana.ics"`; `GET /api/portal/sportiv/coach/me` -> 404 and no mock call.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-routes.test.mjs scripts/portal/upstream.test.mjs scripts/portal/coach-routes.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-bff.spec.ts --workers=2`. Expected: FAIL.
- [ ] **Step 3: Implement.** Cookie names stay the coach ones (host-only cookies cannot collide); the two file routes copy `Content-Type`, `Content-Disposition`, `Cache-Control` from Strapi.
- [ ] **Step 4: Run** the same commands plus `npm run test:e2e -- tests/e2e/portal-proxy.spec.ts tests/e2e/portal-auth.spec.ts --workers=2` (coach unchanged). Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal src/app/\(sportiv\) scripts/portal tests/e2e && git commit -m "feat(portal): BFF per site and the sportiv allowlist"`

### Task 4: Auth pages and Google on `sportiv.` (high, Sonnet)

**Files:**
- Create: `src/app/(sportiv)/layout.tsx` (copy of `src/app/(antrenor)/layout.tsx`: fonts, `robots: { index: false, follow: false }`, no Umami, `<body data-theme="portal" className="bg-surface">`), `src/app/(sportiv)/sportiv/{login,forgot-password,invite}/page.tsx`, `invite/[secret]/route.ts`, `robots.txt/route.ts`, `not-found.tsx`, `[...missing]/page.tsx`, `api/portal/auth/{login,logout,flash,reset/request,reset/confirm,invite/read,invite/accept}/route.ts`, `api/portal/google/{start,callback}/route.ts` (thin wrappers with `site: "sportiv"`)
- Test: `tests/e2e/sportiv-auth.spec.ts`

**Interfaces:**
- Consumes: `LoginForm`, `ResetForm`, `InviteForm` of `src/app/_portal/auth/` with `copy={SPORTIV_AUTH}` and `homePath="/"`; `AuthFrame portal="sportiv"`.

- [ ] **Step 1: Failing e2e** (mock): `/login` shows "Portal sportiv", "Continuă cu Google", the e-mail and password fields; a wrong password shows "E-mailul sau parola nu sunt corecte."; good login of `parinte1` lands on `/` (picker), of `sportiv18` on `/<ioanaId>`; reset request shows "Dacă adresa are cont, am trimis un cod."; `/invite/<valid>` -> 303 `/invite`, heading "Bine ai venit", e-mail read only; accept answered `{ session: null }` shows the login form; `/robots.txt` contains "Disallow: /"; every page answers `X-Robots-Tag: noindex, nofollow`; Google start redirects with `redirect_uri=http%3A%2F%2Fsportiv.localhost%3A3200%2Fapi%2Fportal%2Fgoogle%2Fcallback`; no page offers a 2FA or passkey step; the entry transition: a good login sets `sessionStorage` `es-entry`, which is empty again on the landing page; with reduced motion `[data-entry-overlay]` is never attached.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-auth.spec.ts --workers=2`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/lib/portal tests/e2e && git commit -m "feat(portal): sportiv login, reset, invite and Google"`

### Task 5: Shell, account menu, picker, session row, mock (high, Sonnet)

**Files:**
- Create: `src/app/(sportiv)/sportiv/(app)/layout.tsx` (`AthletesProvider` + `SportivShell`), `(app)/page.tsx` (picker or redirect), `(app)/_ui/SportivShell.tsx` (mirrors `CoachShell`), `(app)/_ui/AccountSheet.tsx` (kit `Sheet`), `(app)/_lib/{use-sportiv.ts,nav.ts,athletes-context.tsx}`, `src/app/_portal/ui/{SessionRow,Pager}.tsx`, `public/icons/portal-parcurs.svg`, `public/icons/portal-plati.svg` (stroke 2, round, as `portal-istoric`; names added to `src/components/ui/icon-names.ts` and the `ICONS` table of `scripts/portal/icons.test.mjs`)
- Modify: `src/app/_portal/ui/EndBlock.tsx` (kinds `competition` `bg-ice text-primary`, `cancelled` `bg-line-subtle text-muted`), `tests/e2e/mock-sportiv.mjs` and `sportiv-fixtures.mjs` (every contract route; fixtures after backend `scripts/fixtures/phase7-shape.js`: `parinte1` holding Ana Ionescu (Școala, Intermediari Bronze, abonament A-0124 5/8, 26 presences) and Matei Ionescu (Școala, Începători); `sportiv18` holding Ioana Marin (Club Performanță, performance); switches on `/__mock/state`: `cutAccount`, `lostAthlete`, `skateDown`, `noCompetitions`, `promotion`, `inactive`, `emptyHistory`, `nothingOwed`, `noDocument`)
- Test: `tests/e2e/sportiv-shell.spec.ts`

**Interfaces:**
- Produces:
  - `useSportiv<T>(path: string): { state: "loading" | "ready" | "error"; data: T | null; reload(): void }` over `portalApi` (path relative to `sportiv/`); on `lost-athlete` it reloads the athletes, then `router.replace("/")` and shows the toast `LOST_ATHLETE`; on `cut` it goes to `/login`.
  - `useAthletes(): { athletes: SportivAthleteRow[]; current: SportivAthleteRow | null; reload(): void }` (current from the `[athleteId]` segment).
  - `sportivNav(athleteId: string, performance: boolean): NavItem[]`: "Acasă", "Istoric", "Concursuri" (performance only), "Parcurs", "Plăți".
  - `AccountSheet({ open, onOpenChange })`: title "Alege sportivul", list "Sportivi în cont" with rows "<name>" / "<group>, <age> ani" (current marked `aria-current="true"`), then "Setări" (`/setari`) and "Ieșire" (kit `logout`).
  - `SessionRow({ item: CalendarItem, now?: string })`: `<details>`; summary: `DateBlock` (`weekdayShort`, day, `startTime`), place, `EndBlock` (`group` with `title` for `grupa`, `lesson` "Individual", `competition` "Concurs", `cancelled` when `cancelled`); panel: "Antrenor: <coaches joined by ', '>", "Ora: <start> - <end>", "Loc: <location>", "anulată" when cancelled, `note` when set.
  - `Pager({ from, to, total, onPrev, onNext, prevDisabled, nextDisabled })`: text via `range`, buttons "Înapoi" / "Înainte".

- [ ] **Step 1: Failing e2e.** As `parinte1`: `/` shows "Sportivi", "Alege sportivul." and both athletes; choosing Matei goes to `/<mateiId>`. On Ana's Acasă the phone header button "Ana" opens the sheet with Ana `aria-current`; "Matei Ionescu" goes to `/<mateiId>`. Tab 1 on Ana, tab 2 on Matei: after reloading both, each shows its own name. Nav: Ana's has 4 items (no "Concursuri"), Ioana's 5; the current item has `aria-current="page"`. Desktop (1280 wide): hovering the sidebar account button "Ana" shows "Matei Ionescu", "Setări cont", "Ieși din cont"; Escape closes it; "Ieși din cont" posts `auth/logout` and lands on `/login`. `lostAthlete` -> lands on `/` with the toast "Nu mai ai acces la acest sportiv." and Ana gone from the list; `cutAccount` -> `/login`. `SessionRow`: the trainer text is hidden until the summary gets Enter, then "Antrenor: Alina Gheorghe" and "Ora: 17:30 - 18:30" show; Space closes it. `inactive` switch: Ana's Acasă shows "Sportiv inactiv.". An athlete with `inPicker: false` is absent from the picker and the menus and its `/<id>` still opens.
- [ ] **Step 2: Run** `node --test scripts/portal/icons.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-shell.spec.ts --workers=2`. Expected: FAIL.
- [ ] **Step 3: Implement** from boards `Main.dc.html` (phone header, nav, session row), `Cont.dc.html` (sheet), `DesktopMain.dc.html` (sidebar), reusing `PortalShell`, `PageHeader`, `BrandBlock`, `DateBlock`, `EndBlock`, `ListRow`, `Sheet`, `Toast`, `Spinner`, `LoadError`. Account menu per index decision 5.
- [ ] **Step 4: Run** the same command and `npm run test:e2e -- tests/e2e/portal-shell.spec.ts tests/e2e/portal-account-menu.spec.ts --workers=2` (coach unchanged). Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/app/_portal src/lib/portal public scripts/portal tests/e2e && git commit -m "feat(portal): sportiv shell, account menu and picker"`
</content>
</invoke>
