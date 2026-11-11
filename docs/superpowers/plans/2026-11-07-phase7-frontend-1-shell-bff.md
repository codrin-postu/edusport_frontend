# Phase 7 Frontend 1: Host, BFF and Shell Implementation Plan

> **Refreshed 2026-11-11** (see the index "Refresh 2026-11-11"). The look, the shared folder and the UI kit exist (`src/app/_portal/`, `src/styles/portal-theme.css`); nothing in this plan defines its own colours, sizes or component look. Tasks renumbered: old T1 stays T1, old T2 (shared folder check) removed, old T3 to T6 are T2 to T5.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `sportiv.<domain>` serves its own site with its own session cookies, a BFF that forwards only the sportiv routes and the Securitate routes, the shared login, 2FA step, reset and invite pages in the shared branded frame (`AuthFrame`, label "Portal sportiv") with the shared entry transition, and the app shell: the kit `PortalShell` with the sportiv nav, the account menu, the picker and the sportiv session row.

**Architecture:** Phase 6 and 6b BFF modules become site-aware through `PortalSite` (`antrenor` | `sportiv`); the coach app keeps its behaviour. Shared React parts and the kit are already in `src/app/_portal/`; the sportiv route group mirrors the coach group's handlers (`src/app/(antrenor)/antrenor/api/portal/*`) as thin wrappers with `site: "sportiv"`.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, Tailwind 4, Node `--test`, Playwright.

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/specs/2026-11-07-sportiv-app-design.md` 5.1, 5.3, 6.1, 6.2, 6.10, 6.11, 10.3, 12. Index: `2026-11-07-phase7-frontend-index.md` (constraints, contracts, rulings binding). 6b: backend `2026-11-07-phase6b-index.md` contracts; frontend `2026-11-07-phase6b-frontend.md` (its BFF second step, passkey and Securitate handlers are what Task 3 makes site-aware).

## Global Constraints

See the index "Global Constraints"; every task here inherits them (behaviour-only tests, machine load, copy, look through the kit).

## Review Focus

See the index "Review Focus"; lines 1 to 4 are owned by Tasks 1, 3, 4 and 5 of this file.

---

### Task 1: Host routing and middleware (high, Sonnet)

**Files:**
- Modify: `src/lib/portal/host.ts` (`reserved` replaced by `sportiv`), `src/middleware.ts`, `playwright.e2e.config.ts` (env `PORTAL_HOST_SPORTIV: "sportiv.localhost:3200"`)
- Test: `scripts/portal/host.test.mjs` (extend), `tests/e2e/portal-hosts.spec.ts` (extend)

**Interfaces:**
- Produces: `type Site = "site" | "antrenor" | "sportiv"`; `siteForHost(host: string | null, hosts: { antrenor?: string; sportiv?: string }): Site` (callers of the old `siteForHost(host, antrenorHost)` updated); `routeRequest(site, rawPathname)` handles `sportiv` with the same asset, robots and traversal rules as `antrenor`, rewriting to `/sportiv...`.

- [ ] **Step 1: Failing tests.** `siteForHost("sportiv.codrin.space", { sportiv: "sportiv.codrin.space" })` = `"sportiv"`; `"sportiv.localhost:3200"` = `"sportiv"` outside production and `"site"` with `NODE_ENV=production` unless configured; an unknown `sportiv.other.ro` = `"site"`. `routeRequest("sportiv", "/")` rewrites `/sportiv`; `"/abc/istoric"` -> `/sportiv/abc/istoric`; `"/login/2fa"` -> `/sportiv/login/2fa`; `"/antrenor"` -> notFound; `"/robots.txt"` -> `/sportiv/robots.txt`; `"/%2e%2e/noutati"` -> notFound. `routeRequest("site", "/sportiv")` -> notFound; `routeRequest("antrenor", "/sportiv")` -> rewrites `/antrenor/sportiv` (the coach 404 page). e2e: `sportiv.localhost:3200/robots.txt` says "Disallow: /" and the response has `X-Robots-Tag: noindex, nofollow` and `Referrer-Policy: no-referrer`; the coach host answers as before.
- [ ] **Step 2: Run** `node --test scripts/portal/host.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement**; the middleware reads `PORTAL_HOST_SPORTIV` and sets the noindex and referrer headers for both portal sites.
- [ ] **Step 4: Run** the same command and `npm run test:e2e -- tests/e2e/portal-hosts.spec.ts --workers=1` (after Task 4 adds the robots route, this e2e line is re-run there). Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal/host.ts src/middleware.ts playwright.e2e.config.ts scripts/portal/host.test.mjs tests/e2e && git commit -m "feat(portal): sportiv host routing"`

### Task 2: Types, copy, format helpers (low, Haiku)

**Files:**
- Create: `src/lib/portal/sportiv-types.ts` (backend `src/club/portal/sportiv/api-types.ts` verbatim), `src/lib/portal/copy-sportiv.ts` (with `SPORTIV_AUTH: AuthCopy` and the screen strings of the boards and spec), `src/lib/portal/sportiv-format.ts`
- Modify: `scripts/portal/copy.test.mjs` (the character guard also walks `copy-sportiv.ts`)
- Test: `scripts/portal/sportiv-format.test.mjs`

**Interfaces:**
- Consumes (reuse, never redefine): `weekdayShort`, `monthShort`, `longDay`, `dayMonth`, `dayMonthYear`, `monthName`, `addMonths`, `pointsText` of `src/lib/portal/format.ts`.
- Produces:

```ts
export function historyWhen(date: string, time: string | null): string; // "Joi 5 noi, 17:30"
export function monthTitle(month: string): string;       // "Noiembrie 2026"
export function ron(n: number): string;                  // "150 RON", "1.250,50 RON"
export function sinceText(iso: string | null, now: Date): string; // "acum 3 luni", "acum 5 zile", "nesetată"
```

- [ ] **Step 1: Failing tests** for each example above plus `ron(0)` "0 RON" and the Romanian count agreement of the sportiv count helpers (1, 2, 20); the character guard covers `copy-sportiv.ts` (no `—`, `–`, `·`, curly quotes, `Email`, emoji). No table of design strings (user rule).
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-format.test.mjs scripts/portal/copy.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement.** No token file.
- [ ] **Step 4: Run** the same command and `npm run check:tokens`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal scripts/portal && git commit -m "feat(portal): sportiv types, copy and format helpers"`

### Task 3: BFF per site, sportiv allowlist, second step and Securitate proxies (high, Sonnet)

**Files:**
- Create: `src/lib/portal/site.ts`, `src/lib/portal/sportiv-routes.ts`, `src/app/(sportiv)/sportiv/api/portal/sportiv/[...path]/route.ts`, `src/app/(sportiv)/sportiv/api/portal/me/[...path]/route.ts`, `src/app/(sportiv)/sportiv/api/portal/auth/{login,logout,2fa,2fa/email,passkey/options,passkey/verify,reset/request,reset/confirm,invite/accept,flash}/route.ts` (thin wrappers over the shared handlers with `site: "sportiv"`)
- Modify: `src/lib/portal/{bff,server-ctx,upstream,auth-route,cookies}.ts` and the 6b `second-step.ts` (site parameter; `host` in auth bodies from the site, never from the request body), the coach handlers under `src/app/(antrenor)/antrenor/api/portal/` (pass `site: "antrenor"`), `src/lib/portal/coach-routes.ts` (unchanged list)
- Test: `scripts/portal/sportiv-routes.test.mjs`, `scripts/portal/upstream.test.mjs` (extend), `tests/e2e/sportiv-bff.spec.ts`

**Interfaces:**
- Produces: `type PortalSite = "antrenor" | "sportiv"`; `siteOf(host: string | null): PortalSite | null`; `allowedSportivRoute(method: string, path: string): boolean`; `sportivQuery(path: string, q: URLSearchParams): string`; `classifySportiv(status: number, body: unknown): "refresh" | "cut" | "lost-athlete" | "show"`.

- [ ] **Step 1: Failing tests.** Allowlist: every backend route of the index table allowed with its method; `GET /athletes/abc/home` true; `PUT /athletes/abc/home` false; `/athletes/../me` false; an id longer than 64 false; `GET /coach/me` false. `sportivQuery("/athletes/a/competitions", "q=x&sort=points&evil=1")` keeps `q`, `sort`; drops `evil`. `classifySportiv(403, { error: { name: "ClubAdminError", message: "Nu mai ai acces la acest sportiv." } })` = `"lost-athlete"`; 403 other name = `"cut"`; 401 = `"refresh"`. Auth handlers on the sportiv site send `host: "sportiv"` whatever the body says. e2e (mock): a coach cookie set on `antrenor.localhost` is not sent to `sportiv.localhost`; `POST /api/portal/sportiv/me` with a foreign `Origin` -> 403 and the mock saw no call; `GET /api/portal/sportiv/athletes/a/calendar.ics` streams `text/calendar`; `GET /api/portal/coach/today` on the sportiv host -> 404 and the mock saw no call. Second step on sportiv (mock fixture `parinte2fa`): the login answer body reaching the browser has no `pending` key, the device cookie holds the answer's `deviceKey` right after the password step, and the mock received that key with `POST /portal/auth/2fa` and `host: "sportiv"` in the pending data; a Securitate `GET /api/portal/me/security` on the sportiv host is forwarded with the sportiv session's bearer.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-routes.test.mjs scripts/portal/upstream.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-bff.spec.ts --workers=1`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same commands plus `npm run test:e2e -- tests/e2e/portal-proxy.spec.ts tests/e2e/portal-login.spec.ts --workers=1` (coach unchanged). Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal src/app scripts/portal tests/e2e && git commit -m "feat(portal): BFF per site, sportiv allowlist, second step and Securitate on sportiv"`

### Task 4: Auth pages and Google on `sportiv.` (high, Sonnet)

**Files:**
- Create: `src/app/(sportiv)/layout.tsx` (root layout, no Umami, `robots: { index: false, follow: false }`, the fonts of the coach root layout, `<body data-theme="portal" className="bg-surface">` exactly as `src/app/(antrenor)/layout.tsx`), `src/app/(sportiv)/sportiv/{login,login/2fa,forgot-password,invite}/page.tsx` (shared forms with `copy={SPORTIV_AUTH}` and `homePath="/"`; the 2FA step page is the 6b second-step form made site-aware, not a copy), `invite/[secret]/route.ts`, `robots.txt/route.ts`, `not-found.tsx`, `[...missing]/page.tsx`, `api/portal/google/{start,callback}/route.ts`
- Modify: `src/lib/portal/google-config.ts` and `google.ts` (redirect URI per site from `PORTAL_HOST_SPORTIV`; a pending answer goes to `/login/2fa`, a refusal to `/login?error=google`)
- Test: `tests/e2e/sportiv-auth.spec.ts`

**Interfaces:**
- Consumes: shared forms (`src/app/_portal/auth/`), `AuthFrame` with "Portal sportiv", `EntryReveal`, copy (T2), BFF (T3).

- [ ] **Step 1: Failing e2e** (mock, behaviour only): `/login` offers Google, e-mail and password; a wrong password shows "E-mailul sau parola nu sunt corecte."; a good login of the two-athlete fixture lands on `/` (picker), of the one-athlete fixture on `/<id>`; `parinte2fa` lands on `/login/2fa`, a right code lands on `/<id>`, an expired pending shows "Intrarea a expirat. Intră din nou." and returns to `/login`; reset shows "Dacă adresa are cont, am trimis un cod."; `/invite/<valid>` -> 303 `/invite`, the e-mail field is read only; an accept answered `{ session: null }` shows the login form; Google start redirects with `redirect_uri=http%3A%2F%2Fsportiv.localhost%3A3200%2Fapi%2Fportal%2Fgoogle%2Fcallback`; a refused callback lands on `/login?error=google` and the page shows the Google refusal text; with motion on, a good login shows `[data-entry-overlay]` and `sessionStorage` `es-entry` is empty after landing; a wrong password shows no overlay; with `reducedMotion: "reduce"` neither element appears.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-auth.spec.ts --workers=1`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command and `tests/e2e/portal-hosts.spec.ts`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app src/lib/portal tests/e2e && git commit -m "feat(portal): sportiv login, 2FA step, reset, invite and Google"`

### Task 5: Shell, account menu, picker, session row, mock (high, Sonnet)

**Files:**
- Create: `src/app/(sportiv)/sportiv/(app)/layout.tsx` (the kit `PortalShell` with `sportivNav` and the account button; `PortalShell` already mounts `EntryReveal` and `ToastProvider`), `(app)/page.tsx` (picker or redirect), `(app)/_ui/AccountSheet.tsx` (kit `Sheet` with `popup`, opened by `?cont=1`), `(app)/_ui/SportivSessionRow.tsx`, `(app)/_lib/{use-sportiv,nav}.ts`
- Move (renames, coach imports updated, coach behaviour unchanged): `src/app/(antrenor)/antrenor/_ui/SheetFooter.tsx` -> `src/app/_portal/ui/SheetFooter.tsx`; `src/app/(antrenor)/antrenor/_lib/show-more.tsx` -> `src/app/_portal/lib/show-more.tsx`; `src/app/(antrenor)/antrenor/_lib/use-portal.ts` -> `src/app/_portal/lib/use-portal.ts`
- Modify: `src/app/_portal/ui/EndBlock.tsx` (kinds `competition` and `cancelled`, tokens only), `tests/e2e/mock-portal.mjs` and `portal-fixtures.mjs` (sportiv fixtures matching the backend `phase7-shape.js`: Ana, Matei, Ioana, Sara with 2FA; every contract route; switches `cutAccount`, `lostAthlete`, `skateDown`, `promotion`, `stale`)
- Test: `tests/e2e/sportiv-shell.spec.ts`

**Interfaces:**
- Produces: `useSportiv<T>(path: string | null): { state: "loading" | "error" | "ready"; data: T | null; reload(): void }` (built on `usePortal`, handles the four `classifySportiv` outcomes); `sportivNav(athleteId, performance): NavItem[]` with "Acasă", "Istoric", "Concursuri" (performance only), "Parcurs", "Plăți"; the account entry `{ label: <first name>, href: "?cont=1", ariaLabel }`; `AccountSheet` title "Alege sportivul", list "Sportivi în cont", rows "<name>" with "<group>, <age> ani", "Setări", "Ieșire"; `SportivSessionRow({ date, time, place, kind: "group" | "individual" | "competition" | "cancelled", label, trainer?, details })` (native `<details>`: the summary holds the kit `DateBlock` with weekday, day and hour, the place and an `EndBlock` with `label`; the panel holds trainer and details).

- [ ] **Step 1: Failing e2e** (behaviour only). The account button opens the menu with two athletes, the current one marked (`aria-current`); choosing Matei goes to `/<mateiId>`; the picker `/` lists the athletes of a two-athlete account; tab 1 on Ana and tab 2 on Matei both keep their own athlete after a reload; Ioana's nav has a "Concursuri" link, Ana's has none; the current nav item has `aria-current="page"`; `lostAthlete` -> lands on `/` with the toast "Nu mai ai acces la acest sportiv."; `cutAccount` -> `/login`; closing the menu removes `?cont=1`; at a 390 px viewport the bottom nav links work and at 1280 px the sidebar links work (navigation only, no layout assertion); `SportivSessionRow`: the trainer is not visible until the row is opened, Enter on the summary opens it (`open` attribute set); an inactive athlete's Acasă shows "Sportiv inactiv.". Coach e2e that use the moved helpers stay green.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-shell.spec.ts --workers=1`. Expected: FAIL.
- [ ] **Step 3: Implement** from the boards `sportiv-canvas-current/Main.dc.html` (header, menu, session row), `Cont.dc.html` (sheet) and `DesktopMain.dc.html` (sidebar), composing kit parts.
- [ ] **Step 4: Run** the same command plus `tests/e2e/portal-shell.spec.ts tests/e2e/portal-list-limits.spec.ts tests/e2e/portal-training-add.spec.ts` (moved helpers). Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app tests/e2e && git commit -m "feat(portal): sportiv shell, account menu and picker"`
