# Phase 7 Frontend 1: Host, BFF and Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `sportiv.<domain>` serves its own site with its own session cookies, a BFF that forwards only the sportiv routes, the shared login, reset and invite pages in the ice look, and the app shell (light header, floating menu, account menu, picker).

**Architecture:** Phase 6 BFF modules become site-aware through `PortalSite` (`antrenor` | `sportiv`); the coach app keeps its behaviour. Shared React parts move to `src/app/_portal/`. The sportiv route group mirrors the coach group's layout of handlers.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, Tailwind 4, Node `--test`, Playwright.

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/specs/2026-11-07-sportiv-app-design.md` 5.1, 5.3, 6.1, 6.2, 6.10, 6.11, 10.3, 12. Index: `2026-11-07-phase7-frontend-index.md` (constraints, contracts, rulings binding).

## Global Constraints

See the index "Global Constraints"; every task here inherits them.

## Review Focus

See the index "Review Focus"; lines 1 to 3 are owned by Tasks 1, 4 and 6 of this file.

---

### Task 1: Host routing and middleware (high, Sonnet)

**Files:**
- Modify: `src/lib/portal/host.ts`, `src/middleware.ts`
- Test: `scripts/portal/host.test.mjs` (extend)

**Interfaces:**
- Produces: `type Site = "site" | "antrenor" | "sportiv"`; `siteForHost(host: string | null, hosts: { antrenor?: string; sportiv?: string }): Site`; `routeRequest(site, rawPathname)` handles `sportiv` with the same asset, robots and traversal rules as `antrenor`, rewriting to `/sportiv...`.

- [ ] **Step 1: Failing tests.** `siteForHost("sportiv.codrin.space", { sportiv: "sportiv.codrin.space" })` = `"sportiv"`; `"sportiv.localhost:3218"` = `"sportiv"` outside production and `"site"` with `NODE_ENV=production`; an unknown `sportiv.other.ro` = `"site"` (the old `reserved` is gone). `routeRequest("sportiv", "/")` rewrites `/sportiv`; `"/abc/istoric"` -> `/sportiv/abc/istoric`; `"/antrenor"` -> notFound; `"/robots.txt"` -> `/sportiv/robots.txt`; `"/%2e%2e/noutati"` -> notFound. `routeRequest("site", "/sportiv")` -> notFound; `routeRequest("antrenor", "/sportiv")` -> rewrites `/antrenor/sportiv` (the coach 404 page).
- [ ] **Step 2: Run** `node --test scripts/portal/host.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement**; middleware reads `PORTAL_HOST_SPORTIV` and sets the noindex and referrer headers for both portal sites.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal/host.ts src/middleware.ts scripts/portal/host.test.mjs && git commit -m "feat(portal): sportiv host routing"`

### Task 2: Shared portal folder and copy split (low, Sonnet)

**Files:**
- Move: `src/app/(antrenor)/antrenor/_ui/{PasswordField,AuthFrame,AuthBits,Sheet,Toast,Spinner,SquareLabel,Row,ListCard,LoadError,BackHeader}.tsx` and the forms `intrare/LoginForm.tsx`, `am-uitat-parola/ResetForm.tsx`, `invitatie/InviteForm.tsx` to `src/app/_portal/`
- Create: `src/app/_portal/theme.ts`, `src/lib/portal/copy-shared.ts`
- Modify: every coach import of the moved files; `src/lib/portal/copy.ts` (auth and shared strings move to `copy-shared.ts`, re-exported so coach code compiles unchanged)
- Test: existing coach e2e and visual suites

**Interfaces:**
- Produces: `type PortalTheme = "antrenor" | "sportiv"`; each moved form takes `{ theme: PortalTheme; copy: AuthCopy; homePath: string }`; `AuthCopy` in `copy-shared.ts`.

- [ ] **Step 1: Baseline.** `npm run test:e2e -- tests/e2e/portal-*.spec.ts` and `npm run test:visual -- --grep portal` on the untouched branch. Expected: PASS (record counts in the ledger).
- [ ] **Step 2: Move and rewire** with `git mv`; coach pages pass `theme="antrenor"` and the coach copy.
- [ ] **Step 3: Run** the same two commands plus `npx tsc --noEmit`. Expected: PASS with the same counts and no visual diff.
- [ ] **Step 4: Commit** `git add -A src/app src/lib/portal && git commit -m "refactor(portal): shared auth and shell parts for both portal apps"`

### Task 3: Types, copy, tokens, format helpers (low, Haiku)

**Files:**
- Create: `src/lib/portal/sportiv-types.ts` (backend block verbatim), `src/lib/portal/copy-sportiv.ts`, `src/lib/portal/sportiv-format.ts`, `src/app/(sportiv)/sportiv/tokens.css`
- Test: `scripts/portal/sportiv-format.test.mjs`, `scripts/portal/copy-sportiv.test.mjs`

**Interfaces:**
- Produces:

```ts
export function weekdayShort(date: string): string;      // "Lun" "Mar" "Mie" "Joi" "Vin" "Sâm" "Dum"
export function dayMonth(date: string): string;          // "12 noi"
export function dayMonthYear(date: string): string;      // "26 oct 2026"
export function longDay(date: string): string;           // "Joi, 12 noiembrie"
export function historyWhen(date: string, time: string | null): string; // "Joi 5 noi, 17:30"
export function monthTitle(month: string): string;       // "Noiembrie 2026"
export function monthWord(month: string): string;        // "sep"
export function ron(n: number): string;                  // "150 RON", "1.250,50 RON"
export function points(n: number | null): string;        // "98,42", "" for null
export function range(a: number, b: number, n: number): string; // "1 - 10 din 26"
export function sinceText(iso: string | null, now: Date): string; // "acum 3 luni", "acum 5 zile", "nesetată"
```

- [ ] **Step 1: Failing tests** for each example above, plus `ron(0)` "0 RON"; `copy-sportiv.test.mjs`: every string has no `—`, `–`, `·`, `Email`, and contains each of these design strings ("Următoarele ședințe", "prezențe în sezon", "Istoric prezență", "Adaugă în calendarul telefonului", "Nivelul tău acum", "Antrenorul decide când treci mai departe.", "Realizări", "Categoria de concurs", "Nume concurs sau oraș", "Clasamentul complet (pagina oficială) ›", "Rămas de plată", "Plata se face la club.", "Vezi zilele ›", "Fișa de înscriere", "îl schimbă clubul", "E-mail la schimbări de program", "Sportivi în cont", "Felicitări", "Mai departe", "Rezultatele nu sunt disponibile acum.").
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-format.test.mjs scripts/portal/copy-sportiv.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement**; tokens of the index as CSS variables scoped to `[data-site="sportiv"]`, registered for `check:tokens`.
- [ ] **Step 4: Run** the same command and `npm run check:tokens`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal src/app/\(sportiv\) scripts/portal && git commit -m "feat(portal): sportiv types, copy, tokens and format helpers"`

### Task 4: BFF per site and the sportiv allowlist (high, Sonnet)

**Files:**
- Create: `src/lib/portal/site.ts`, `src/lib/portal/sportiv-routes.ts`, `src/app/(sportiv)/sportiv/api/portal/sportiv/[...path]/route.ts`
- Modify: `src/lib/portal/{bff,server-ctx,upstream,auth-route}.ts` (site parameter; `host` in auth bodies from the site), `src/lib/portal/coach-routes.ts` (unchanged list, test that it refuses `/portal/sportiv` shapes)
- Test: `scripts/portal/sportiv-routes.test.mjs`, `scripts/portal/upstream.test.mjs` (extend), `tests/e2e/sportiv-bff.spec.ts`

**Interfaces:**
- Produces: `type PortalSite = "antrenor" | "sportiv"`; `siteOf(host: string | null): PortalSite | null`; `allowedSportivRoute(method: string, path: string): boolean`; `sportivQuery(path: string, q: URLSearchParams): string`; `classifySportiv(status: number, body: unknown): "refresh" | "cut" | "lost-athlete" | "show"`.

- [ ] **Step 1: Failing tests.** Allowlist: every backend route of the index table allowed with its method; `GET /athletes/abc/home` true; `PUT /athletes/abc/home` false; `/athletes/../me` false; id longer than 64 false; `GET /coach/me` false. `sportivQuery("/athletes/a/competitions", "q=x&sort=points&evil=1")` keeps `q`, `sort`; drops `evil`. `classifySportiv(403, { error: { name: "ClubAdminError", message: "Nu mai ai acces la acest sportiv." } })` = `"lost-athlete"`; 403 other name = `"cut"`; 401 = `"refresh"`. Auth handler on the sportiv site sends `host: "sportiv"` whatever the body says (body `host: "antrenor"` ignored). e2e (mock): a coach cookie set on `antrenor.localhost` is not sent to `sportiv.localhost`; `POST /api/portal/sportiv/me` with a foreign `Origin` -> 403 and the mock saw no call; `GET /api/portal/sportiv/athletes/a/calendar.ics` streams `text/calendar`.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-routes.test.mjs scripts/portal/upstream.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-bff.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same commands plus `npm run test:e2e -- tests/e2e/portal-bff.spec.ts` (coach unchanged). Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal src/app/\(sportiv\) scripts/portal tests/e2e && git commit -m "feat(portal): BFF per site and the sportiv allowlist"`

### Task 5: Auth pages and Google on `sportiv.` (high, Sonnet)

**Files:**
- Create: `src/app/(sportiv)/layout.tsx` (root layout, no Umami, `robots: { index: false, follow: false }`, fonts League Spartan and Inter, `data-site="sportiv"`), `src/app/(sportiv)/sportiv/{intrare,am-uitat-parola,invitatie}/page.tsx`, `invitatie/[secret]/route.ts`, `robots.txt/route.ts`, `not-found.tsx`, `[...missing]/page.tsx`, `api/portal/auth/*` and `api/portal/google/{start,callback}/route.ts` (thin wrappers over the shared handlers with `site: "sportiv"`)
- Modify: `src/lib/portal/google-config.ts` (redirect URI per site from `PORTAL_HOST_SPORTIV`)
- Test: `tests/e2e/sportiv-auth.spec.ts`

**Interfaces:**
- Consumes: shared forms (T2) with `theme="sportiv"`, copy (T3), BFF (T4).

- [ ] **Step 1: Failing e2e** (mock): `/intrare` shows "Intră în cont", "Continuă cu Google", e-mail and password; wrong password shows "E-mailul sau parola nu sunt corecte."; good login of the two-athlete fixture lands on `/` (picker), of the one-athlete fixture on `/<id>`; reset shows "Dacă adresa are cont, am trimis un cod."; `/invitatie/<valid>` -> 303 `/invitatie`, heading "Bine ai venit", e-mail read only; accept answered `{ session: null }` shows the login form; `/robots.txt` "Disallow: /"; response header `X-Robots-Tag: noindex, nofollow`; Google start redirects with `redirect_uri=http%3A%2F%2Fsportiv.localhost%3A3218%2Fapi%2Fportal%2Fgoogle%2Fcallback`; no element has a computed `border-radius` other than `0px` except the spinner.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-auth.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/lib/portal tests/e2e && git commit -m "feat(portal): sportiv login, reset, invite and Google"`

### Task 6: Shell, account menu, picker, mock (high, Sonnet)

**Files:**
- Create: `src/app/(sportiv)/sportiv/(app)/layout.tsx`, `(app)/page.tsx` (picker or redirect), `(app)/_ui/{IceHeader,FloatingNav,AccountSheet,DateBlock,KeyCard,Pager,SquareSwitch}.tsx`, `(app)/_lib/{api,use-athlete}.ts`
- Modify: `tests/e2e/mock-portal.mjs` (sportiv fixtures matching the backend `phase7-shape.js`: Ana, Matei, Ioana, every contract route, switches `cutAccount`, `lostAthlete`, `skateDown`, `promotion`)
- Test: `tests/e2e/sportiv-shell.spec.ts`

**Interfaces:**
- Produces: `useSportiv<T>(path: string): { data: T | null; error: string | null; reload(): void }` (handles the four `classifySportiv` outcomes); `FloatingNav({ athleteId, performance, active })` items "Acasă", "Istoric", "Concursuri" (performance only), "Parcurs", "Plăți"; `AccountSheet` title "Alege sportivul", list "Sportivi în cont", rows "<name>" with "<group>, <age> ani", "Setări", "Ieșire"; `DateBlock({ date, word: "weekday" | "month" })`; `Pager({ from, to, total, onPrev, onNext })` text via `range`.

- [ ] **Step 1: Failing e2e.** Header shows "EDUSPORT" and a button "Ana" (44 px high) opening the sheet with two athletes, Ana marked; choosing Matei goes to `/<mateiId>`; picker `/` shows "Sportivi" and "Alege sportivul." for the two-athlete account; tab 1 on Ana and tab 2 on Matei both keep their own athlete after a reload; Ioana's account shows five menu items, Ana's four; the active item has background `rgb(143, 184, 245)`; `lostAthlete` -> lands on `/` with the toast "Nu mai ai acces la acest sportiv."; `cutAccount` -> `/intrare`; no text node has computed color `rgb(190, 51, 48)` outside `[data-date-word]`; an inactive athlete's Acasă shows "Sportiv inactiv.".
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-shell.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** from the design boards `Main.dc.html` (header, menu) and `Cont.dc.html` (sheet).
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) tests/e2e && git commit -m "feat(portal): sportiv shell, account menu and picker"`
