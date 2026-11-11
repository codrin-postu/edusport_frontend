# Portal Login and Entry Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The coach portal's login, reset and invite screens get the approved admin-style look (navy panel, four-colour ribbon, real brand block, form card), and a successful sign-in plays the approved entry transition into the app. The student portal (phase 7 frontend) inherits both through the shared `src/app/_portal/` move its plan already makes.

**Architecture:** `AuthFrame` becomes the branded frame and takes a `portal` label. A small client module `entry-transition.ts` runs the outgoing half on the login page (ribbon slides out along its paths, navy fades in, centred logo), stores a one-shot `sessionStorage` flag and navigates. `EntryReveal` in the app shell plays the incoming half (logo then navy fade out) when the flag is present. CSS keyframes only, no animation library.

**Tech Stack:** Next.js (App Router), Tailwind 4, Playwright e2e (mock portal).

**Design (approved 2026-11-08):** `docs/portal/mockups/screens/login-transition/` holds the canvas boards: `AntrenorIntrare.dc.html` (phone 390 px), `AntrenorDesktopIntrare.dc.html` (1280 px), `AntrenorTranzitie.dc.html` and `AntrenorDesktopTranzitie.dc.html` (a 6 s loop of the transition), plus `s_*.png` screenshots. The `.dc.html` CSS and SVG are the source of truth for geometry and colours. `s_Intrare` / `s_DesktopIntrare` show the student variant: the same frame with the label "Portal sportiv".

## Global Constraints

- Romanian copy, straight quotes, no em dash, no middle dot, no emoji.
- No pills or circles (computed `border-radius` 0 everywhere except the spinner), no dashed or dotted lines, no red text.
- Colours: navy `#0e1a3c`; ribbon outer to inner gold `#efb22b`, orange `#ea7233`, rust `#be3330`, burgundy `#6e4256` (the admin's `src/admin/dashboard/loginBranding.ts`); panel kicker `#8fb8f5`; portal label `#c9d6ee`.
- Brand block: "CLUBUL SPORTIV" Inter 12px 700, letter-spacing .28em, uppercase, `#8fb8f5`, 12px gap; "EDUSPORT" Climate Crisis with `font-variation-settings: "YEAR" 1979`, line-height .9, white, 62px at 900 px and up, 31px on phone; label 14px 600 `#c9d6ee`, 16px above.
- The coach root layout must load Climate Crisis the way `src/app/(site)/layout.tsx` does (`localFont`, `public/fonts/ClimateCrisis-1979.woff2`, variable `--font-climate-crisis`); today it loads Inter only.
- `prefers-reduced-motion: reduce`: no transition at all, plain navigation.
- No new dependencies.

## Review Focus

- **Failed login**: no animation starts, the form stays usable, the error line shows. Pinned by Task 2 e2e.
- **Flag left behind**: a reload of the app after the reveal shows no overlay; the flag is removed on first read. Pinned by Task 2 e2e.
- **Narrow and short phones** (320 x 568) and tablets (899 px): the ribbon arcs stay circular, the form is fully visible and scrollable, the brand never overlaps the form. Pinned by Task 1 e2e at 320 x 568.
- **Overlay blocking input**: overlays use `pointer-events: none` once fading and are removed from the DOM when done. Pinned by Task 2 e2e (click a nav item right after the reveal).
- **Keyboard and screen reader**: overlays are `aria-hidden`, focus is not trapped, the form keeps its labels. Pinned by Task 1 e2e (existing label queries still pass).

---

### Task 1: Branded auth frame and brand font

**Files:**
- Modify: `src/app/(antrenor)/layout.tsx` (load Climate Crisis), `src/app/(antrenor)/antrenor/_ui/AuthFrame.tsx`, `src/lib/portal/copy.ts` (`PORTAL_LABEL = { antrenor: "Portal antrenor", sportiv: "Portal sportiv" }`)
- Create: `src/app/(antrenor)/antrenor/_ui/AuthRibbon.tsx` (the SVG, phone and desktop variants), styles in a co-located CSS module or `globals.css` utilities, whichever the portal already uses
- Test: `tests/e2e/portal-login.spec.ts` (extend)

**Interfaces:**
- Produces: `AuthFrame({ title, portal = "antrenor", children })`; `AuthRibbon` paths carry `pathLength="100"` and a class Task 2 targets; the frame root has `data-auth-frame`.

- [ ] **Step 1: Failing e2e.** At 1280 x 800 `/login` shows "CLUBUL SPORTIV", "EDUSPORT" and "Portal antrenor"; the "EDUSPORT" node's computed `font-family` contains "Climate Crisis" and `font-size` is `62px`; the ribbon has four paths with strokes `rgb(239, 178, 43)`, `rgb(234, 114, 51)`, `rgb(190, 51, 48)`, `rgb(110, 66, 86)`; the form card sits right of the panel. At 390 x 844 the wordmark is `31px` and the form starts below the navy block. At 320 x 568 the submit button is reachable by scroll and does not overlap the brand. Every element's `border-radius` is `0px` except the spinner. Existing login, reset and invite tests still pass.
- [ ] **Step 2: Run** `npx playwright test -c playwright.e2e.config.ts tests/e2e/portal-login.spec.ts`. Expected: the new assertions FAIL.
- [ ] **Step 3: Implement.** Desktop (900 px and up): navy panel clipped `inset(0 47.5% 9.2% 0 round 0 0 122px 0)` over the full viewport, ribbon SVG `viewBox="0 0 1000 600" preserveAspectRatio="none"`, stroke width 33, paths exactly as in `AntrenorDesktopIntrare.dc.html`; brand top 56px left 56px; form card 400px wide, vertically centred, right 7%. Phone (below 900 px): navy block from the top, its right edge 80px from the viewport edge, 280px high, bottom right corner radius 70px; four 12px stripes (radii 88, 76, 64, 52 round the corner centre, colours as above) run from the left edge, round the corner and up off the top. They must stay circular at any width, so build them in px relative to the block edge, not by stretching a viewBox. Brand top 44px left 24px; form from 330px with 20px side gutters, the page scrolls when taller than the viewport. Reset and invite pages get the same frame through `AuthFrame`. Panel and ribbon are `aria-hidden`.
- [ ] **Step 4: Run** the same command plus `npx tsc --noEmit` and `npx eslint src/app/\(antrenor\) src/lib/portal`. Expected: PASS, no errors.
- [ ] **Step 5: Screenshot check.** Save `/login` at 1280 x 800, 390 x 844 and 320 x 568 to `docs/portal/mockups/screens/login-transition/built-*.png` and compare with `s_AntrenorDesktopIntrare` / `s_AntrenorIntrare`.
- [ ] **Step 6: Commit** `feat(portal): branded login frame with ribbon and brand font`.

### Task 2: Entry transition

**Files:**
- Create: `src/app/(antrenor)/antrenor/_lib/entry-transition.ts`, `src/app/(antrenor)/antrenor/_ui/EntryReveal.tsx`
- Modify: `login/LoginForm.tsx`, `invite/InviteForm.tsx` (both places that call `window.location.assign("/")` after a session starts), `_ui/PortalShell.tsx` (mount `EntryReveal`)
- Test: `tests/e2e/portal-login.spec.ts` (extend)

**Interfaces:**
- Consumes: Task 1's ribbon path class and `data-auth-frame`.
- Produces: `playEntryAndGo(href: string): void` and `ENTRY_FLAG = "es-entry"`.

- [ ] **Step 1: Failing e2e.** After a good login an element `[data-entry-overlay]` appears on `/login` with the centred "CLUBUL SPORTIV" / "EDUSPORT"; the app lands on `/`; `[data-entry-reveal]` is present right after load and gone within 1.5 s; `sessionStorage.getItem("es-entry")` is null after landing; reloading `/` shows no `[data-entry-reveal]`; a bottom-nav click right after the reveal ends works. A wrong password shows no overlay. With `page.emulateMedia({ reducedMotion: "reduce" })` a good login lands on `/` with neither element ever present.
- [ ] **Step 2: Run** the spec. Expected: FAIL.
- [ ] **Step 3: Implement `playEntryAndGo`.** Reduced motion: `window.location.assign(href)` at once. Otherwise: add a class to the frame that runs, on the ribbon paths, `stroke-dasharray: 100 100` with `stroke-dashoffset` 0 to -100 over 780ms, `cubic-bezier(.55,0,.75,.35)`, burgundy first then rust, orange, gold, 50ms apart; mount the navy overlay (fixed, full viewport, z above everything) fading 0 to 1 from 400ms to 880ms; the centred mark ("CLUBUL SPORTIV" kicker as Task 1, "EDUSPORT" 44px phone / 84px desktop) fades in from 650ms to 1000ms; at 1700ms set the flag and navigate. `EntryReveal` (client): on mount, if the flag is set, remove it and render the same navy overlay and mark: the mark holds 200ms and fades out over 400ms, the navy fades out from 400ms to 1000ms, then the element unmounts. No flag: render nothing. The Google sign-in returns through a server redirect and gets no transition (decided by Claude: no flag can be set before the provider round trip without leaking state).
- [ ] **Step 4: Run** the spec, `npx tsc --noEmit`, eslint. Expected: PASS.
- [ ] **Step 5: Commit** `feat(portal): entry transition from login to the app`.

### Task 3: Student plan hand-over

**Files:**
- Modify: `docs/superpowers/plans/2026-11-07-phase7-frontend-1-shell-bff.md`

- [ ] **Step 1:** In the move list add `_ui/{AuthRibbon,EntryReveal}.tsx` and `_lib/entry-transition.ts`; in the sportiv login task replace "in the ice look" with "in the shared branded frame (`AuthFrame portal="sportiv"`, label "Portal sportiv") and the shared entry transition (`EntryReveal` in the sportiv shell)"; add the Task 1 and Task 2 e2e assertions for `sportiv.localhost` with "Portal sportiv".
- [ ] **Step 2: Commit** `docs(plan): sportiv login reuses the branded frame and entry transition`.
