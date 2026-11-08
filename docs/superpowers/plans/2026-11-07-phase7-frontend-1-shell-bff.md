# Phase 7 Frontend 1: Host, BFF and Shell Implementation Plan

> **Amended 2026-11-09:** the look, the shared folder and the UI kit come from plan A `2026-11-09-portal-theme-kit.md` (spec `docs/superpowers/specs/2026-11-09-portal-canvas-design.md`); design source `docs/portal/mockups/screens/sportiv-canvas-current/`. Nothing in this plan defines its own colours, sizes or component look.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `sportiv.<domain>` serves its own site with its own session cookies, a BFF that forwards only the sportiv routes, the shared login, reset and invite pages (plan A `_portal/auth`) in the shared branded frame (`AuthFrame portal="sportiv"`, label "Portal sportiv") and the shared entry transition (`EntryReveal` in the sportiv shell), and the app shell: phone layout (light header, floating menu) and desktop layout from 900 px (sidebar, light top area), account menu, picker and the shared session row.

**Architecture:** Phase 6 BFF modules become site-aware through `PortalSite` (`antrenor` | `sportiv`); the coach app keeps its behaviour. Shared React parts and the kit are already in `src/app/_portal/` (plan A); the sportiv shell is the kit `PortalShell`. The sportiv route group mirrors the coach group's layout of handlers.

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

### Task 2: Shared folder check (low, Haiku)

Plan A Task 4 already moved the auth parts, `Sheet`, `Toast`, `Spinner`, `LoadError`, `EntryReveal`, `entry-transition.ts` and the three forms to `src/app/_portal/`, split `copy-shared.ts` (`AuthCopy`, `PORTAL_LABEL`) and made the forms take `{ copy: AuthCopy; homePath: string }`; plan B replaced `Row`, `ListCard`, `SquareLabel`, `BackHeader` with kit parts. There is no `PortalTheme` prop and no `theme.ts`: the look comes from `data-theme="portal"` on the root body.

**Files:**
- Test: none new

- [ ] **Step 1: Check** that `src/app/_portal/auth/{LoginForm,ResetForm,InviteForm}.tsx`, `src/app/_portal/ui/{AuthFrame,AuthRibbon,AuthBits,EntryReveal,PasswordField,Sheet,Toast,Spinner,LoadError}.tsx` and `src/lib/portal/copy-shared.ts` exist on the base, and that `grep -rn "data-theme" src --include=*.tsx` lists only `src/app/(antrenor)/layout.tsx`. Expected: both true; otherwise stop and report to the controller (plan A or B is not merged).
- [ ] **Step 2: Record** the result in the ledger. No commit.

### Task 3: Types, copy, tokens, format helpers (low, Haiku)

**Files:**
- Create: `src/lib/portal/sportiv-types.ts` (backend block verbatim), `src/lib/portal/copy-sportiv.ts` (with `SPORTIV_AUTH: AuthCopy`), `src/lib/portal/sportiv-format.ts` (reuses `weekdayShort`, `monthShort`, `longDay`, `dayMonthYear` of `src/lib/portal/format.ts` from plan B Task 1 instead of redefining them)
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
- [ ] **Step 3: Implement.** No token file: the look is the portal theme. If a sportiv board needs a value `src/styles/portal-theme.css` lacks, add it there (comment: board name) and extend `scripts/tokens/portal-theme.test.mjs`.
- [ ] **Step 4: Run** the same command, `npm run check:tokens` and `node --test scripts/tokens/portal-theme.test.mjs`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal src/styles scripts && git commit -m "feat(portal): sportiv types, copy and format helpers"`

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
- Create: `src/app/(sportiv)/layout.tsx` (root layout, no Umami, `robots: { index: false, follow: false }`, fonts League Spartan and Inter, `<body data-theme="portal" className="bg-surface">` exactly as the coach root layout; the `theme-branch` token pattern already allows this file), `src/app/(sportiv)/sportiv/{intrare,am-uitat-parola,invitatie}/page.tsx`, `invitatie/[secret]/route.ts`, `robots.txt/route.ts`, `not-found.tsx`, `[...missing]/page.tsx`, `api/portal/auth/*` and `api/portal/google/{start,callback}/route.ts` (thin wrappers over the shared handlers with `site: "sportiv"`)
- Modify: `src/lib/portal/google-config.ts` (redirect URI per site from `PORTAL_HOST_SPORTIV`)
- Test: `tests/e2e/sportiv-auth.spec.ts`

**Interfaces:**
- Consumes: shared forms (plan A) with `copy={SPORTIV_AUTH}` and `homePath="/"`, copy (T3), BFF (T4).

- [ ] **Step 1: Failing e2e** (mock): `/intrare` shows "Intră în cont", "Continuă cu Google", e-mail and password; wrong password shows "E-mailul sau parola nu sunt corecte."; good login of the two-athlete fixture lands on `/` (picker), of the one-athlete fixture on `/<id>`; reset shows "Dacă adresa are cont, am trimis un cod."; `/invitatie/<valid>` -> 303 `/invitatie`, heading "Bine ai venit", e-mail read only; accept answered `{ session: null }` shows the login form; `/robots.txt` "Disallow: /"; response header `X-Robots-Tag: noindex, nofollow`; Google start redirects with `redirect_uri=http%3A%2F%2Fsportiv.localhost%3A3218%2Fapi%2Fportal%2Fgoogle%2Fcallback`; no element has a computed `border-radius` other than `0px` except the spinner; `body` `background-color` `rgb(246, 249, 253)`; the e-mail input `border-top-color` `rgb(185, 198, 218)` and the field label `text-transform` `none` (the portal theme applies on this host too). On `sportiv.localhost` `/intrare` also shows "CLUBUL SPORTIV", "EDUSPORT" (Climate Crisis, `62px` at 1280 px, `31px` at 390 px) and "Portal sportiv", with the four ribbon strokes `rgb(239, 178, 43)`, `rgb(234, 114, 51)`, `rgb(190, 51, 48)`, `rgb(110, 66, 86)`; a good login (no reduced motion) shows `[data-entry-overlay]`, lands on the picker with `[data-entry-reveal]` gone within 1.5 s and `sessionStorage` `es-entry` empty; a wrong password shows no overlay; with `reducedMotion: "reduce"` neither element ever appears.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-auth.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/lib/portal tests/e2e && git commit -m "feat(portal): sportiv login, reset, invite and Google"`

### Task 6: Shell, account menu, picker, mock (high, Sonnet)

**Files:**
- Create: `src/app/(sportiv)/sportiv/(app)/layout.tsx` (the kit `PortalShell` with the sportiv nav; it mounts `EntryReveal`), `(app)/page.tsx` (picker or redirect), `(app)/_ui/AccountSheet.tsx` (kit `Sheet`), `src/app/_portal/ui/{SessionRow,Pager}.tsx` (new kit parts, tokens only), `(app)/_lib/{api,use-athlete}.ts`. Reuse, do not recreate: `PageHeader` with `BrandBlock` (was IceHeader), `BottomNav` (was FloatingNav), `Sidebar` (was DesktopSidebar), `DateBlock`, `KeyValueCard` (was KeyCard), `SquareSwitch` (move the coach program one to `src/app/_portal/ui/` if Task 13 needs it). No shell stylesheet: the 900 px switch is the `portal:` variant of the theme.
- Modify: `tests/e2e/mock-portal.mjs` (sportiv fixtures matching the backend `phase7-shape.js`: Ana, Matei, Ioana, every contract route, switches `cutAccount`, `lostAthlete`, `skateDown`, `promotion`)
- Test: `tests/e2e/sportiv-shell.spec.ts`

**Interfaces:**
- Produces: `useSportiv<T>(path: string): { data: T | null; error: string | null; reload(): void }` (handles the four `classifySportiv` outcomes); `sportivNav(athleteId, performance): NavItem[]` for the kit `BottomNav` and `Sidebar`, items "Acasă", "Istoric", "Concursuri" (performance only), "Parcurs", "Plăți"; `AccountSheet` title "Alege sportivul", list "Sportivi în cont", rows "<name>" with "<group>, <age> ani", "Setări", "Ieșire"; the kit `Sidebar` gets the same items and the account button (label the athlete's first name) opening `AccountSheet`; `DateBlock` is the kit part (`word` = `weekdayShort` or `monthShort`); `SessionRow({ date, time, place, kind: "group" | "individual" | "competition" | "cancelled", label, trainer?, details })` (native `<details>`: summary holds the kit `DateBlock`, time, place and a band `--portal-endblock-w` wide with `label`, the panel holds trainer and full details; band colours per the index "Session rows", by token); `Pager({ from, to, total, onPrev, onNext })` text via `range`.

- [ ] **Step 1: Failing e2e.** Header shows "EDUSPORT" and a button "Ana" (44 px high) opening the sheet with two athletes, Ana marked; choosing Matei goes to `/<mateiId>`; picker `/` shows "Sportivi" and "Alege sportivul." for the two-athlete account; tab 1 on Ana and tab 2 on Matei both keep their own athlete after a reload; Ioana's account shows five menu items, Ana's four; the active item has background `rgb(143, 184, 245)`; `lostAthlete` -> lands on `/` with the toast "Nu mai ai acces la acest sportiv."; `cutAccount` -> `/intrare`; no text node has computed color `rgb(190, 51, 48)` outside `[data-date-word]`; at 1280 px wide: a 240 px sidebar with "EDUSPORT", the same menu items (Ioana five, Ana four), the active item `rgb(143, 184, 245)`, the account button "Ana" at the sidebar foot opening the account menu, no floating menu, content wrapper `max-width` 1200 px; at 899 px the sidebar is hidden and the floating menu shown; at 390 px the layout is the phone one; `SessionRow`: the band width equals `--portal-endblock-w` (96px until open question 2 is answered) with the four colour pairs (`rgb(14, 26, 60)`, `rgb(74, 123, 208)`, `rgb(143, 184, 245)`, `rgb(221, 230, 243)`), a closed row hides the trainer, Enter on the summary opens it, `aria-expanded`-equivalent `open` toggles, focus ring visible; an inactive athlete's Acasă shows "Sportiv inactiv.".
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-shell.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** from the boards `sportiv-canvas-current/Main.dc.html` (header, menu, session row), `Cont.dc.html` (sheet) and `DesktopMain.dc.html` (sidebar, top area, 1200 px container), composing kit parts; phone and desktop chrome are both rendered by `PortalShell`, switched by CSS only.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/app/_portal tests/e2e && git commit -m "feat(portal): sportiv shell, account menu and picker"`
