# Portal Theme and Kit (Plan A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One token theme file that makes both portals look like the Design canvas while the public site stays pixel-identical, the shared portal folder `src/app/_portal/` (moved ahead of phase 7), and the portal UI kit every coach and sportiv screen is built from.

**Architecture:** Shared components read component tokens whose public values in `globals.css` equal today's literals; `src/styles/portal-theme.css` overrides them under `[data-theme="portal"]`, set on `<body>` by the portal root layouts. Portal-only parts live in `src/app/_portal/ui/` and style themselves only with tokens. Guards: public screenshots (zero diff), public computed styles, portal computed styles on a kit preview page, and a token-check pattern against scattered canvas values.

**Tech Stack:** Next.js 15.5 (App Router), React 19, TypeScript, Tailwind 4 (`@theme`, `@utility`, `(--var)` value syntax), Playwright (visual and e2e), Node `--test`.

**Spec (binding):** `docs/superpowers/specs/2026-11-09-portal-canvas-design.md` (token tables 4.1 and 4.2, inventory 5, folder 6). Audit: `docs/portal/mockups/screens/coach-canvas-v1/component-audit.md`. Canvas values: `docs/portal/mockups/screens/coach-canvas-v1/gen_coach.py`, `gen_login.py` (read these; grep board files, never read a whole board, they inline a base64 font). Index: `2026-11-09-portal-redesign-index.md`. Decisions: `docs/portal/DECISIONS.md` (2026-11-09).

**Base:** `feat/portal` (8644274 or later). The controller cuts `feat/portal-theme` and one worktree per task. Ledger `/Users/codrin/Documents/Programming/edusport_frontend/.superpowers/sdd/2026-11-09-portal-redesign/plan-a.md`.

| Task | Risk | Model | Review |
|---|---|---|---|
| 1 Public baseline and guards | high (public site) | Sonnet | batch A |
| 2 Component tokens with public values | high (public site) | Sonnet | batch A |
| 3 Portal theme file, root layout, AuthFrame tokens, scatter guard | low | Sonnet | |
| 4 Shared portal folder and copy split | low | Sonnet | |
| 5 Portal icons and icon sizes | low | Haiku | |
| 6 Kit primitives | low | Sonnet | |
| 7 Kit composites and the sheet | low | Sonnet | |
| 8 Kit shell | low | Sonnet | |
| 9 Kit preview page and portal computed-style e2e | low | Sonnet | |
| 10 Final checks | low | Haiku | final review |

Batch A (Tasks 1 and 2) gets its own review before Task 3 starts, because a mistake there changes the public site. All other tasks share the one final review.

## Global Constraints

- Repo `/Users/codrin/Documents/Programming/edusport_frontend`. Commit only in the worktree the dispatch names; run `git rev-parse --show-toplevel` and `git branch --show-current` before each commit. Never push. Commit messages exactly as given, no attribution lines.
- Per task: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, plus the task's own test files only. Full suites run once in Task 10, in a background worktree, never blocking another task.
- Public site untouched: every public computed style stays identical. After Task 1, any task that edits `src/app/globals.css` or `src/components/ui/*` runs `npx playwright test tests/visual/pages.spec.ts --project=chromium` against the Task 1 baseline (expected: 0 failed) and `npm run test:e2e -- tests/e2e/public-style-guard.spec.ts` (expected: PASS). Never run `test:visual:update` after Task 1. A diff is a bug to fix, never a new baseline.
- No component branches on the site: no `site`, `portal`, `theme` prop, no `data-theme` read in any component, no host check. Only `src/app/(antrenor)/layout.tsx` and `src/app/(sportiv)/layout.tsx` write `data-theme="portal"`.
- Every portal difference is a line in `src/styles/portal-theme.css` with a comment naming the audit row (`/* 14 input */`). Portal-only components use tokens through `(--token)` values (`min-h-(--portal-row-min-h)`), never `[14px]`, never a hex. Spacing utilities stay on the 4px grid the token check enforces; off-grid canvas sizes are tokens.
- Copy: Romanian, straight quotes, no em or en dash, no middle dot, no emoji. Strings come from `src/lib/portal/copy.ts` and `src/lib/portal/copy-shared.ts`.
- Shapes: square everywhere. Named exceptions (user 2026-11-09): the bottom menu and its active item (`--portal-nav-radius` 18px, `--portal-nav-item-radius` 13px), the date and place blocks (`--portal-dateblock-radius` 6px, attribute `data-date-block`) and the spinner. No dashed or dotted lines. No red text except the date-block top word (`[data-date-word]`, `text-accent`).
- `prefers-reduced-motion: reduce` turns off every portal animation.
- Synthetic data only (`@example.invalid`). e2e ports as `playwright.e2e.config.ts` (3200, 18890, 18891); only one e2e run at a time on this machine.

## Review Focus

- **A public page changes by one pixel.** Pinned by Task 1 (baseline) and every later run of `tests/visual/pages.spec.ts`; Task 2 is where it can happen.
- **A token defined as `var(--other)` in `@theme` does not follow a scoped override** (it resolves on `:root`). Pinned by Task 9: the portal input background is `rgb(255, 255, 255)` because `portal-theme.css` sets `--color-input-bg: #ffffff` as a literal.
- **A portal override leaks into a shared role it was not meant for** (overriding `text-label` would restyle every caps label). Pinned by Task 2 (field label reads `text-field-label`, not `text-label`) and Task 9 (a `text-label` element on the preview page keeps `text-transform: uppercase`).
- **Scattered canvas values** (`#dde6f3` typed in a component). Pinned by Task 3 (`canvas-hex` and `theme-branch` patterns).
- **Coach e2e regressions from the move.** Pinned by Task 4 (all `tests/e2e/portal-*.spec.ts` green before and after, same counts).

---

### Task 1: Public baseline and guards (high, Sonnet)

**Files:**
- Create: `tests/e2e/public-style-guard.spec.ts`
- Record (not committed, gitignored): `tests/visual/__snapshots__/` in the plan A worktree

**Interfaces:**
- Produces: the baseline every later task compares against; the committed public computed-style guard.

- [ ] **Step 1: Record the baseline on the untouched base commit.** In the plan A worktree, before any change: `npm run test:visual:update` (Chromium and WebKit, 390, 768, 1440). Write the snapshot count and the base commit SHA in the ledger.
- [ ] **Step 2: Write the guard** `tests/e2e/public-style-guard.spec.ts`, viewport 1280 x 900, against the mock Strapi (it serves `/inscrieri` and `/contact`). Read the page markup first and pick the first text input of the `/inscrieri` form with its `<label>`, its submit `Button` (the `[data-button]` element), one checkbox, and one `.link` element on `/contact`; name each locator in a comment. Assertions (exact strings):
  - `body` `background-color` = `rgb(251, 248, 241)`.
  - input: `border-top-width` = `1.5px`, `border-top-color` = `rgb(14, 26, 60)`, `padding-left` = `16px`, `font-size` = `14px`, `height` = `48px`.
  - its label: `font-size` = `12px`, `font-weight` = `600`, `text-transform` = `uppercase`, `letter-spacing` = `1.68px`, `color` = `rgb(73, 82, 105)`.
  - primary button: `.lcta-face` `background-color` = `rgb(0, 0, 0)`, `border-top-width` = `1.5px`, `box-shadow` = `none`, `font-size` = `13px`, `text-transform` = `uppercase`; each `.lcta-layer` `display` = `block`.
  - checkbox visible box: width and height `20px`, `border-top-width` = `1.5px`.
  - `.link`: `font-weight` = `600`, `background-size` = `100% 2px`.
  - keyboard focus on the input (press Tab until it is focused): `outline-color` = `rgb(14, 26, 60)`, `outline-offset` = `3px`.
  - no element on either page has the attribute `data-theme`.
- [ ] **Step 3: Run** `npm run test:e2e -- tests/e2e/public-style-guard.spec.ts`. Expected: PASS on the untouched code (this guard pins today, it is not a failing test first).
- [ ] **Step 4: Run** `npx playwright test tests/visual/pages.spec.ts --project=chromium`. Expected: 0 failed (baseline sanity).
- [ ] **Step 5: Commit** `git add tests/e2e/public-style-guard.spec.ts && git commit -m "test(site): public computed-style guard before the portal theme"`

### Task 2: Component tokens with public values (high, Sonnet)

**Files:**
- Modify: `src/app/globals.css` (`@theme` colours, a new `:root` block "Component tokens, public values", `@utility text-button`, `@utility link`, `.lcta-layer`, `.lcta-face`, `.lcta:active .lcta-face`; new utilities `text-field-label`, `text-field-hint`, `text-input`, `text-dialog-title`, `border-control`, `border-input`, `border-card`)
- Modify: `src/components/ui/{button,form-field,select,checkbox,card,dialog}.tsx`, and every file in `src/components/ui/` whose light focus string contains `outline-primary` (not `outline-primary-on-dark`)
- Test: Task 1 guards

**Interfaces:**
- Produces (in `@theme`, public values): `--color-card-line: #0e1a3c; --color-input-line: #0e1a3c; --color-input-bg: var(--color-surface); --color-label-ink: #495269; --color-hint-ink: #495269; --color-button-face: #000000; --color-button-face-text: #fbf8f1; --color-button-secondary-bg: transparent; --color-checkbox-line: #0e1a3c; --color-checkbox-on: #be3330; --color-checkbox-mark: #fbf8f1; --color-focus: #0e1a3c; --color-link-bar: #be3330; --color-link-hover: #be3330; --color-dialog-bg: var(--color-surface);`
- Produces (in `:root`, public values): `--card-border-width: 1.5px; --input-border-width: 1.5px; --input-pad-x: 1rem; --text-input-size: 0.875rem; --text-input-leading: 1.55; --field-label-weight: 600; --field-label-size: 0.75rem; --field-label-tracking: 0.14em; --field-label-case: uppercase; --field-label-leading: 1.1; --field-hint-size: 0.75rem; --field-hint-leading: 1.4; --field-gap: 0.5rem; --text-button-weight: 600; --text-button-size: 0.8125rem; --text-button-tracking: 0.06em; --text-button-case: uppercase; --button-pad-x: 1.5rem; --control-border-width: 1.5px; --button-layers: block; --button-face-shadow: none; --button-press-shift: 4px; --checkbox-size: 1.25rem; --checkbox-border-width: 1.5px; --checkbox-mark-size: 14px; --focus-offset: 3px; --link-weight: 600; --link-bar-size: 2px; --link-hover-decoration: none; --link-hover-animation: link-slide; --dialog-title-size: 1.25rem; --dialog-title-leading: 1.2; --dialog-title-tracking: -0.01em; --dialog-pad: 1.5rem; --dialog-max-w: 28rem;`
- Produces utilities:

```css
@utility text-button { font-weight: var(--text-button-weight); font-size: var(--text-button-size); line-height: 1; letter-spacing: var(--text-button-tracking); text-transform: var(--text-button-case); }
@utility text-field-label { font-weight: var(--field-label-weight); font-size: var(--field-label-size); line-height: var(--field-label-leading); letter-spacing: var(--field-label-tracking); text-transform: var(--field-label-case); }
@utility text-field-hint { font-weight: 400; font-size: var(--field-hint-size); line-height: var(--field-hint-leading); letter-spacing: 0; }
@utility text-input { font-weight: 400; font-size: var(--text-input-size); line-height: var(--text-input-leading); letter-spacing: 0; }
@utility text-dialog-title { font-family: var(--font-display); font-weight: 800; font-size: var(--dialog-title-size); line-height: var(--dialog-title-leading); letter-spacing: var(--dialog-title-tracking); }
@utility border-control { border-width: var(--control-border-width); }
@utility border-input { border-width: var(--input-border-width); }
@utility border-card { border-width: var(--card-border-width); }
```

  `text-dialog-title` keeps the `md:` size step that `text-title` has today (read lines 457 to 460 of `globals.css` and copy its media rule, with the variable for the base size only).
  `@utility link`: `font-weight: var(--link-weight)`, `background-image: linear-gradient(var(--color-link-bar), var(--color-link-bar))`, `background-size: 100% var(--link-bar-size)`, hover `color: var(--color-link-hover); text-decoration-line: var(--link-hover-decoration); animation: var(--link-hover-animation) var(--duration-long) var(--ease-in-out)`; the `link-slide` keyframes animate `background-size` from `100% var(--link-bar-size)`.
  `.lcta-layer { display: var(--button-layers); }`, `.lcta-face { border: var(--control-border-width) solid var(--color-navy); box-shadow: var(--button-face-shadow); }`, `.lcta:active .lcta-face { transform: translate(var(--button-press-shift), var(--button-press-shift)); }`.

- Component edits (light variants only; every `onDark` / dark string stays as it is):
  - `button.tsx`: `FACE.black` = `"bg-button-face text-button-face-text"`; secondary light `bg-transparent` -> `bg-button-secondary-bg`; `border-retro` -> `border-control`; `px-6` -> `px-(--button-pad-x)` (secondary and face); `FOCUS_LIGHT` = `"outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus"`.
  - `form-field.tsx`: `SURFACE.page` = `"bg-input-bg border-input-line text-primary placeholder:text-muted"`, `SURFACE.card` = `"bg-surface-raised border-input-line text-primary placeholder:text-muted"`; `border-retro` -> `border-input`; `px-4` -> `px-(--input-pad-x)`; `text-body-sm` -> `text-input`; label light `text-label ... text-secondary` -> `text-field-label ... text-label-ink`; `mb-2` -> `mb-(--field-gap)`; hint light `text-caption text-secondary` -> `text-field-hint text-hint-ink`, `mt-2` -> `mt-(--field-gap)`; `FieldLabel` the same as the label; `FOCUS_LIGHT` uses `focus:outline-offset-(--focus-offset) focus:outline-focus`.
  - `select.tsx`: default size trigger gets the input tokens (`border-input`, `border-input-line`, `bg-input-bg`, `px-(--input-pad-x)`, `text-input`); new prop `chevron?: IconName` (default `"chevron-down"`) passed to the trigger icon; `sm` and `compact` sizes unchanged.
  - `checkbox.tsx`: box `size-5` -> `size-(--checkbox-size)`; light border -> `border-(length:--checkbox-border-width) border-checkbox-line`; checked light -> `peer-checked:bg-checkbox-on peer-checked:border-checkbox-on`; mark light -> `text-checkbox-mark size-(--checkbox-mark-size)`.
  - `card.tsx`: the light bordered variants `border-retro border-line` -> `border-card border-card-line`.
  - `dialog.tsx`: content `bg-surface border-retro border-line p-6` -> `bg-dialog-bg border-card border-card-line p-(--dialog-pad)`; `WIDTH.md` -> `"max-w-(--dialog-max-w)"`; title `text-title` -> `text-dialog-title`.

- [ ] **Step 1: Implement** the tokens, utilities and edits above. Read each file before editing; keep every class order otherwise.
- [ ] **Step 2: Run** `npx tsc --noEmit && npm run lint && npm run check:tokens`. Expected: PASS.
- [ ] **Step 3: Run** `npx playwright test tests/visual/pages.spec.ts` (both projects). Expected: 0 failed against the Task 1 baseline. Any diff: find the token whose public value differs from the old literal, fix it, rerun.
- [ ] **Step 4: Run** `npm run test:e2e -- tests/e2e/public-style-guard.spec.ts tests/e2e/inscriere.spec.ts`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/globals.css src/components/ui && git commit -m "refactor(ui): component tokens with the public values"`

### Task 3: Portal theme file, root layout, AuthFrame tokens, scatter guard (low, Sonnet)

**Files:**
- Create: `src/styles/portal-theme.css`, `scripts/tokens/portal-theme.test.mjs`
- Modify: `src/app/globals.css` (one line: `@import "../styles/portal-theme.css";` after the last `@theme` block), `src/app/(antrenor)/layout.tsx` (`<body data-theme="portal" className="bg-surface">`), `src/app/(antrenor)/antrenor/_ui/{AuthFrame,AuthRibbon}.tsx` and any other file under `src/` that holds a canvas hex, `scripts/tokens/patterns.mjs` (two patterns)
- Test: `scripts/tokens/portal-theme.test.mjs`, `tests/e2e/portal-login.spec.ts` (existing, must stay green)

**Interfaces:**
- Produces `src/styles/portal-theme.css` with exactly this structure (values from the spec tables 4.1 and 4.2; every line carries its audit row comment):

```css
/* Portal theme: the complete list of differences between the portals (antrenor., sportiv.) and the public site.
   Public values live in globals.css. Set by <body data-theme="portal"> in the portal root layouts only. */
@theme {
  --color-ice: #8fb8f5;            /* 24 33 nav active, stat number */
  --color-ice-light: #e1ecfb;      /* 10 11 25 date block, done block, top band */
  --color-ice-blue: #4a7bd0;       /* 11 individual band, completed status */
  --color-nav-on-dark: #c9d6ee;    /* 23 25 sidebar links, kicker on navy */
  --color-tag-ink: #111111;        /* 12 Individual tag */
  --color-cancelled: #c0c0c4;      /* calendar cancelled bar */
  --breakpoint-portal: 56.25rem;   /* 900 px phone / desktop switch */
}
[data-theme="portal"] {
  --color-surface: #f6f9fd;        /* 1 page background */
  --color-surface-subtle: #e1ecfb; /* 8 info card */
  --color-line-subtle: #dde6f3;    /* 9 30 dividers */
  --color-overlay: rgb(14 26 60 / 0.45); /* 26 */
  --color-card-line: #dde6f3;      /* 7 28 */
  --card-border-width: 1px;        /* 7 */
  /* ... every remaining row of spec table 4.1, portal column ... */
  /* ... every row of spec table 4.2 layout sizes, phone column ... */
}
@media (width >= 56.25rem) {
  [data-theme="portal"] {
    /* desktop column of spec table 4.2 only: --portal-h1-size: 40px; --portal-sub-size: 14px; --portal-page-x: 32px;
       --portal-section-gap: 32px; --portal-cols-gap: 32px; --portal-container: 1200px; */
  }
}
```

  The `/* ... */` lines above stand for the full lists of the spec tables; the file must spell out every token, nothing elided.
- Produces two token-check patterns in `scripts/tokens/patterns.mjs`:
  `{ id: "canvas-hex", why: "canvas colours live in src/styles/portal-theme.css", regex: /#(?:f6f9fd|dde6f3|b9c6da|8fb8f5|e1ecfb|4a7bd0|c9d6ee|111111)\b/gi }` with an `ALLOWLIST` entry for `src/styles/portal-theme.css` (reason: "the portal theme file is the single list of differences"), and
  `{ id: "theme-branch", why: "components never branch on the site", regex: /data-theme/g }` with `ALLOWLIST` entries for `src/app/(antrenor)/layout.tsx` and `src/app/(sportiv)/layout.tsx` (reason: "the portal root layouts set the theme").
  If `check:tokens` does not scan `.css` files, the `canvas-hex` check for CSS goes into `scripts/tokens/portal-theme.test.mjs` instead.
- `AuthFrame.tsx`: `bg-[#0e1a3c]` -> `bg-surface-dark`; `text-[#495269]` -> `text-secondary`; `min-[900px]:text-[#8fb8f5]` -> `portal:text-ice`; `text-[#0e1a3c]` -> `text-primary`; `min-[900px]:text-white` -> `portal:text-surface-raised`; `text-[#c9d6ee]` -> `portal:text-nav-on-dark`; card `border border-[#dde6f3] bg-white p-5 shadow-[8px_8px_0_rgba(14,26,60,0.16)] min-[900px]:p-6` -> `border-card border-card-line bg-surface-raised p-(--portal-login-pad) shadow-retro`; card h1 `text-title` -> `font-display font-extrabold leading-tight text-(length:--portal-login-title)`; other `min-[900px]:` prefixes -> `portal:`. `AuthRibbon.tsx`: ribbon hexes -> `var(--color-mustard)`, `var(--color-orange)`, `var(--color-rust)`, `var(--color-burgundy)`.

- [ ] **Step 1: Failing test** `scripts/tokens/portal-theme.test.mjs` (Node `--test`): reads `src/styles/portal-theme.css`; asserts it contains exactly one `[data-theme="portal"] {` block outside the media query and one inside `@media (width >= 56.25rem)`; asserts every token name of spec table 4.1 (portal column) and 4.2 appears with the spec value (a table of `[name, value]` pairs in the test, copied from the spec); asserts every declaration line inside the scoped blocks has a `/* <number>` comment or a `/* layout` comment; walks `src/` (`.ts`, `.tsx`, `.css`, except `src/styles/portal-theme.css`) and asserts none contains a canvas hex (the list above, case-insensitive) and no `.tsx` other than the two portal root layouts contains `data-theme`.
- [ ] **Step 2: Run** `node --test scripts/tokens/portal-theme.test.mjs`. Expected: FAIL (file missing).
- [ ] **Step 3: Implement** the file, the import, the layout attribute, the AuthFrame and AuthRibbon edits, the patterns.
- [ ] **Step 4: Run** `node --test scripts/tokens/portal-theme.test.mjs && npm run check:tokens && npx tsc --noEmit && npm run lint`. Expected: PASS. Then `npx playwright test tests/visual/pages.spec.ts --project=chromium` (0 failed) and `npm run test:e2e -- tests/e2e/public-style-guard.spec.ts tests/e2e/portal-login.spec.ts`. Expected: PASS; if `portal-login.spec.ts` pins an old colour that the canvas changes (for example the card h1 size), update that one assertion to the canvas value and list it in the ledger.
- [ ] **Step 5: Commit** `git add src/styles src/app scripts/tokens tests/e2e && git commit -m "feat(portal): portal theme file, set by the coach root layout"`

### Task 4: Shared portal folder and copy split (low, Sonnet)

**Files:**
- Move with `git mv`: `src/app/(antrenor)/antrenor/_ui/{AuthFrame,AuthRibbon,AuthBits,EntryReveal,PasswordField,Sheet,Toast,Spinner,LoadError}.tsx` -> `src/app/_portal/ui/`; `src/app/(antrenor)/antrenor/_lib/entry-transition.ts` -> `src/app/_portal/lib/entry-transition.ts`; `intrare/LoginForm.tsx`, `am-uitat-parola/ResetForm.tsx`, `invitatie/InviteForm.tsx` -> `src/app/_portal/auth/`
- Create: `src/lib/portal/copy-shared.ts`, `src/app/_portal/lib/nav.ts`
- Modify: every import of the moved files; `src/lib/portal/copy.ts` (auth strings, `PORTAL_LABEL`, `STATES`, `A11Y` move to `copy-shared.ts` and are re-exported from `copy.ts` so coach code compiles unchanged)
- Test: existing `tests/e2e/portal-*.spec.ts`

**Interfaces:**
- Produces: `export type AuthCopy = { login: {...}; reset: {...}; invite: {...} }` (the exact keys the three forms read today), `export const COACH_AUTH: AuthCopy` in `copy.ts`; each form takes `{ copy: AuthCopy; homePath: string }`; `AuthFrame({ title, portal, children })` unchanged; `nav.ts`: `export type NavItem = { href: string; label: string; icon: IconName; match?: string[] }; export function isActive(pathname: string, item: NavItem): boolean` (true when `pathname === item.href`, or starts with `item.href + "/"` for `href !== "/"`, or starts with any `match` prefix).
- Coach-only parts stay in the coach folder for plan B: `_ui/{ListCard,Row,SquareLabel,BackHeader,PortalHeader,TopNav,BottomNav,Segmented,PortalShell,AthleteSearch}.tsx`.

- [ ] **Step 1: Baseline.** `npm run test:e2e -- tests/e2e/portal-*.spec.ts` (one run, may take long: run it in the background and wait). Record pass count in the ledger.
- [ ] **Step 2: Move and rewire.** Coach pages pass `copy={COACH_AUTH}` and `homePath="/"`.
- [ ] **Step 3: Run** `npx tsc --noEmit && npm run lint && npm run check:tokens`, then the Step 1 command. Expected: PASS with the same count.
- [ ] **Step 4: Commit** `git add -A src/app src/lib/portal && git commit -m "refactor(portal): shared portal folder for auth parts, sheet, toast and copy"`

### Task 5: Portal icons and icon sizes (low, Haiku)

**Files:**
- Create: `public/icons/portal-{azi,grupe,concursuri,istoric,profil,chevron-right,chevron-down,check,status-done,status-todo,phone,whatsapp,copy}.svg`
- Modify: `src/components/ui/icon.tsx` (size variant), `src/components/ui/icon-names.ts` (regenerated by `node scripts/icons/build.mjs`)
- Test: `scripts/portal/icons.test.mjs`

**Interfaces:**
- Each file has the exact shape of `public/icons/chevron-right.svg`: `<svg xmlns="http://www.w3.org/2000/svg"><symbol id="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ...><path .../></symbol></svg>`. Paths and strokes copied from `gen_coach.py`:
  - `portal-azi`, `-grupe`, `-istoric`, `-concursuri`, `-profil`: the `ICONS` dict, `stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`.
  - `portal-chevron-right`: `CHEV` path `M9 6l6 6-6 6`, `stroke-width="2.5" stroke-linecap="square"`; `portal-chevron-down`: path `M6 9l6 6 6-6`, same stroke.
  - `portal-check`: `CHECK` path `M5 12l5 5 9-10`, `stroke-width="3" stroke-linecap="square"`.
  - `portal-status-done`: path `M5 12l5 5 9-10`; `portal-status-todo`: paths `M4 4h16v16H4z` and `M12 7.5v5h4`; both `stroke-width="2.4" stroke-linecap="square" stroke-linejoin="miter"`.
  - `portal-phone`, `portal-whatsapp`, `portal-copy`: the `call`, `wa`, `cp` paths of `athlete_parts()`, `stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`.
- `Icon` `size` gains `"18" | "20" | "26"` mapped to `size-(--icon-18)`, `size-(--icon-20)`, `size-(--icon-26)`; add `--icon-18: 18px; --icon-20: 20px; --icon-26: 26px;` to the `:root` component-token block of `globals.css` (same on both sides, not a difference). `sm`, `md`, `lg` unchanged.

- [ ] **Step 1: Failing test** `scripts/portal/icons.test.mjs`: each of the 13 files exists, parses as `<symbol id="icon" viewBox="0 0 24 24"`, has `stroke="currentColor"` and the stroke width listed above; `icon-names.ts` contains each name.
- [ ] **Step 2: Run** `node --test scripts/portal/icons.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement**, then `node scripts/icons/build.mjs`.
- [ ] **Step 4: Run** the same test, `npx tsc --noEmit`, `npx playwright test tests/visual/pages.spec.ts --project=chromium` (0 failed). Expected: PASS.
- [ ] **Step 5: Commit** `git add public/icons src/components/ui scripts/portal src/app/globals.css && git commit -m "feat(portal): canvas icons and icon sizes 18, 20, 26"`

### Task 6: Kit primitives (low, Sonnet)

**Files:**
- Create in `src/app/_portal/ui/`: `PageHeader.tsx`, `PageBody.tsx`, `SectionHeading.tsx`, `PortalCard.tsx`, `ListRow.tsx`, `DateBlock.tsx`, `EndBlock.tsx`, `StatusBlock.tsx`, `IndividualTag.tsx`, `KeyValueCard.tsx`, `StatCard.tsx`, `Segmented.tsx`, `SaveBar.tsx`, `PortalLink.tsx`, `ContactButton.tsx`, `CopyButton.tsx`
- Modify: `src/lib/portal/copy-shared.ts` (`KIT` strings)
- Test: covered by Task 9 (computed styles); `npx tsc --noEmit` here

**Interfaces (exact):**

```tsx
export function PageHeader(p: { title: string; back?: { href: string; label: string }; kicker?: string; sub?: string; brand?: boolean; aside?: React.ReactNode; actions?: React.ReactNode }): JSX.Element;
// One header for both layouts. Phone: brand row (BrandBlock, when `brand` and no `back`) or the back link "‹ <label>" (15px 700, min-h --portal-tap),
// then kicker (--portal-kicker-size, muted), h1 (League Spartan 800, --portal-h1-size, line-height 1.05), sub (--portal-sub-size, muted); `aside` right-aligned beside the title block.
// From `portal:` it is the top band: bg-ice-light, border-b 1px line-subtle, inner container max-w (--portal-container), pad 28px block via --portal-band-pad-y (add to the theme, 28px),
// brand row hidden (the sidebar carries the brand), `aside` and `actions` on the right. Exactly one h1 in the DOM.
export function PageBody(p: { children: React.ReactNode; narrow?: 520 | 560 | 640 | 860 }): JSX.Element; // container: max-w (--portal-container), px (--portal-page-x), flex column gap (--portal-section-gap); `narrow` caps inner width through --portal-narrow-<n> tokens
export function Columns(p: { children: React.ReactNode }): JSX.Element; // phone: one column; portal: flex wrap, gap (--portal-cols-gap), align start
export function Column(p: { children: React.ReactNode; grow: 1 | 2; basis: 280 | 300 | 380 | 420 | 480 }): JSX.Element; // flex `${grow} 1 var(--portal-basis-<n>)`, flex column gap (--portal-section-gap)
export function SectionHeading(p: { title: string; link?: { href: string; label: string } }): JSX.Element; // h2 League Spartan 800 --portal-h2-size; link "<label> ›" 14px 700 min-h --portal-tap; baseline aligned, space-between
export function Section(p: { title: string; link?: { href: string; label: string }; children: React.ReactNode }): JSX.Element; // SectionHeading + children, gap 12px
export function PortalCard(p: { children: React.ReactNode; pad?: "none" | "card" | "sheet" | "login"; tone?: "raised" | "subtle" | "navy"; as?: "div" | "section" }): JSX.Element;
// shared Card with shadow md (8px); raised white, subtle = surface-subtle, navy = surface-dark with text-primary-on-dark; pad tokens --portal-card-pad / --portal-sheet-pad / --portal-login-pad
export function ListCard(p: { children: React.ReactNode }): JSX.Element; // PortalCard pad none, children separated by 1px line-subtle (divide-y divide-line-subtle)
export function ListRow(p: { href?: string; onClick?: () => void; lead?: React.ReactNode; title: React.ReactNode; sub?: React.ReactNode; extra?: React.ReactNode; end?: React.ReactNode; dim?: boolean; label?: string }): JSX.Element;
// whole row one link (Next Link) or button; min-h --portal-row-min-h; inner flex gap --portal-row-gap, pad --portal-row-pad-y/--portal-row-pad-x; title --portal-row-title 700 (muted-on-dark colour #979ba5 = text-muted-on-dark when `dim`);
// sub --portal-row-sub muted; `end` stretches full height on the right; without `end`, a --portal-trail-w column with Icon portal-chevron-right size sm, text-secondary; focus ring inset (-outline-offset-2) colour focus
export function DateBlock(p: { word?: string; big: string; dim?: boolean }): JSX.Element;
// data-date-block; w --portal-dateblock-w (52px), h --portal-dateblock-h (52px), bg-ice-light, radius --portal-dateblock-radius (6px); `word` 11px 700 uppercase text-accent with data-date-word; big League Spartan 800 line-height 1,
// --portal-dateblock-num with a word, --portal-dateblock-num-solo without; `dim` big text text-muted-on-dark
export function EndBlock(p: { kind: "todo" | "done" | "lesson" | "group" | "soft"; children: string }): JSX.Element;
// w --portal-endblock-w, full row height, pad 6px (--portal-endblock-pad), centred, 11px 800 line-height 1.25;
// todo, group: bg-surface-dark text-surface-raised; done, soft: bg-ice-light text-primary; lesson: bg-ice-blue text-surface-raised
export function StatusBlock(p: { kind: "Grup" | "Individual"; done: boolean }): JSX.Element;
// role="img", aria-label `${kind}, ${done ? "completat" : "necompletat"}`; w --portal-typeblock-w full height; done: bg-ice-blue + Icon portal-status-done; else bg-surface-dark + Icon portal-status-todo; icon size "26", white
export function IndividualTag(): JSX.Element; // "Individual", bg-tag-ink, text white, 11px 700, pad 2px 6px (tokens --portal-tag-pad-y 2px, --portal-tag-pad-x 6px), margin-right 6px, normal case
export function KeyValueCard(p: { rows: { key: string; value: React.ReactNode }[] }): JSX.Element; // PortalCard rows min-h --portal-kv-min-h, pad 8px/--portal-card-pad, divider line-subtle; key 14px muted; value 15px 700 right
export function StatCard(p: { big: string; label: string; side?: { value: string; label: string }[] }): JSX.Element;
// PortalCard tone navy pad 20px; big League Spartan 800 --portal-stat-num line-height 0.85 text-ice; label 14px text-secondary-on-dark; side lines right aligned: value 18px 700 white, label 14px text-nav-on-dark
export function Segmented<T extends string>(p: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }): JSX.Element;
// role="group" aria-label; border-control border-line (2px navy), no dividers, align-self start; buttons min-h --portal-tap, px 16px, 14px 700, aria-pressed; active bg-surface-dark text-surface-raised, else bg-surface-raised text-primary
export function SaveBar(p: { count: string; action: React.ReactNode }): JSX.Element; // bg-surface-raised, border-t 1px line-subtle, pad 14px/20px (tokens), count League Spartan 800 20px; space-between
export function PortalLink(p: { href: string; children: React.ReactNode; center?: boolean }): JSX.Element; // shared Link, 14px 700, min-h --portal-tap, inline-flex items-center (font weight from --link-weight)
export function ContactButton(p: { href: string; icon: "portal-phone" | "portal-whatsapp"; label: string; primary?: boolean; external?: boolean }): JSX.Element;
// min-h 48px, pad-x 10px, gap 8px, 14px 700, border-control navy; primary navy fill white text, else white fill navy text; icon size "18"
export function CopyButton(p: { text: string; label: string; copied: string }): JSX.Element; // 44px square, transparent, text-secondary, Icon portal-copy size "18"; click: navigator.clipboard.writeText(text) then the shared toast `copied`
```

- `KIT` copy in `copy-shared.ts`: `{ completat: "completat", necompletat: "necompletat", individual: "Individual", copied: "Numărul a fost copiat." }` ("Numărul a fost copiat." decided by Claude, low impact; logged in DECISIONS.md by Task 10).
- Every off-grid size named above that is not yet in `portal-theme.css` is added there (with a `/* layout */` comment) in this task: `--portal-band-pad-y: 28px`, `--portal-endblock-pad: 6px`, `--portal-tag-pad-y: 2px`, `--portal-tag-pad-x: 6px`, `--portal-savebar-pad-y: 14px`, `--portal-savebar-pad-x: 20px`, `--portal-narrow-520: 520px`, `--portal-narrow-560: 560px`, `--portal-narrow-640: 640px`, `--portal-narrow-860: 860px`, `--portal-basis-280: 280px`, `--portal-basis-300: 300px`, `--portal-basis-380: 380px`, `--portal-basis-420: 420px`, `--portal-basis-480: 480px`, and the token test of Task 3 is extended with them.

- [ ] **Step 1: Implement** each component exactly as specified; read `gen_coach.py` functions `h2`, `card`, `tblock`, `endblock`, `row`, `type_block`, `kv`, `stat_card`, `side_lines`, `seg`, `save_bar`, `IND` beside each one.
- [ ] **Step 2: Run** `npx tsc --noEmit && npm run lint && npm run check:tokens && node --test scripts/tokens/portal-theme.test.mjs`. Expected: PASS.
- [ ] **Step 3: Commit** `git add src/app/_portal src/lib/portal src/styles scripts/tokens && git commit -m "feat(portal): kit primitives from the canvas"`

### Task 7: Kit composites and the sheet (low, Sonnet)

**Files:**
- Create in `src/app/_portal/ui/`: `NowTile.tsx`, `MonthPicker.tsx`, `MonthGrid.tsx`, `CalendarLegend.tsx`, `CompetitionCard.tsx`, `PlaceBlock.tsx`, `PointsCell.tsx`
- Modify: `src/app/_portal/ui/Sheet.tsx` (restyle), `src/app/_portal/ui/AuthBits.tsx` (`GoogleButton`, `OrLine`)
- Create: `src/lib/portal/month-grid.ts`; Test: `scripts/portal/month-grid.test.mjs`

**Interfaces (exact):**

```tsx
export function NowTile(p: { month: string; day: string; time: string; weekday: string; label: string }): JSX.Element;
// aria-label `label` ("Marți, 10 noiembrie, ora 17:05" shape, built by the caller); shadow-retro; left 64px (--portal-typeblock-w) navy: month 11px 700 uppercase tracking 0.08em text-ice, day League Spartan 800 32px white;
// right white, 1px card line, no left border, pad 8px/14px: time League Spartan 800 26px, weekday 13px muted
export function MonthPicker(p: { title: string; onPrev: () => void; onNext: () => void; prevLabel: string; nextLabel: string }): JSX.Element;
// two 44px square buttons "‹" "›" 18px 700, border-control navy, white; title League Spartan 800 20px, min-w 150px (--portal-monthtitle-w), centred
export type DayMarks = ("grup" | "individual" | "anulata")[];
export function MonthGrid(p: { month: string; marks: Record<string, DayMarks>; selected: string | null; today: string; onSelect: (date: string) => void; label: string }): JSX.Element;
// PortalCard pad 12px; head row "L Ma Mi J V S D" 11px 700 muted; cells: buttons h 48px, gap 2px, 14px, weight 800 when marked else 500; under the number one 8 x 3 bar per mark
// (grup bg-surface-dark, individual bg-ice-blue, anulata bg-cancelled; on the selected cell grup bars are bg-ice); selected cell bg-surface-dark text white; today bg-ice-light; aria-pressed on selected; aria-label "<d> <luna>"
export function CalendarLegend(): JSX.Element; // three items 12 x 3 bar + 12px muted text: "grup", "individual", "anulată"
export function CompetitionCard(p: { month: string; day: string; name: string; place: string; count: number; countLabel: string; members: { href: string; name: string; category: string; placement: number | null; points: string }[]; defaultOpen?: boolean }): JSX.Element;
// native <details> (open = defaultOpen) with 1px card line and shadow-retro, white; <summary> min-h 76px: DateBlock(word=month, big=day), name 15px 700, place 13px muted;
// right block --portal-endblock-w navy: count League Spartan 22px, countLabel 11px 700; members: rows min-h 60px pad 8px/14px border-t line-subtle: PlaceBlock, name 15px 700, category 13px muted, points League Spartan 16px
export function PlaceBlock(p: { placement: number | null }): JSX.Element; // data-date-block; DateBlock size and radius, bg-ice-light; word "Loc" 10px 700 uppercase tracking 0.06em text-muted (not accent); number League Spartan 22px; null shows only "Loc"
export function PointsCell(p: { points: string }): JSX.Element; // w 84px (--portal-points-w), right aligned, pad-right 14px; value League Spartan 18px; "puncte" 11px muted
export function GoogleButton(p: { href: string; label: string }): JSX.Element; // min-h 48px, border-control navy, white, 15px 700, gap 10px, 18px multicolour G (the four-path SVG of gen_coach.py `login_body`, inline, it is a brand mark not an icon)
export function OrLine(p: { text: string }): JSX.Element; // centred text 13px muted, no rules
```

- `Sheet`: overlay `bg-overlay`; content `bg-surface-raised border-card border-card-line shadow-retro p-(--portal-sheet-pad)`; no grab handle; phone: bottom, full width; from `portal:`: centred, `w-(--portal-sheet-w)` (460px); title `h2` League Spartan 800 `--portal-h2-size`; optional `description?: string` 14px muted under the title; gap 14px between children (`--portal-sheet-gap`).
- `month-grid.ts`: `export function monthCells(month: string): (string | null)[]` (Monday first, leading nulls, length a multiple of 7); `export function shiftMonth(month: string, by: number): string`; `export function monthTitle(month: string): string` ("Noiembrie 2026").
- New tokens in `portal-theme.css` (`/* layout */`): `--portal-monthtitle-w: 150px`, `--portal-points-w: 84px`, `--portal-sheet-w: 460px`, `--portal-sheet-gap: 14px`, `--portal-nowtile-day: 32px`, `--portal-nowtile-time: 26px`.

- [ ] **Step 1: Failing test** `scripts/portal/month-grid.test.mjs`: `monthCells("2026-11")` has 6 leading nulls (1 Nov 2026 is a Sunday), then "2026-11-01" to "2026-11-30", length 42; `monthCells("2026-09")` starts with 1 null; `shiftMonth("2026-12", 1)` = "2027-01"; `shiftMonth("2026-01", -1)` = "2025-12"; `monthTitle("2026-11")` = "Noiembrie 2026".
- [ ] **Step 2: Run** `node --test scripts/portal/month-grid.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** the module and components (read `gen_coach.py` `now_tile`, `month_picker`, `coach_calendar`, `comp_card`, `place_block`, `pts`, `login_body` beside each).
- [ ] **Step 4: Run** the test, `npx tsc --noEmit && npm run lint && npm run check:tokens && node --test scripts/tokens/portal-theme.test.mjs`, and `npm run test:e2e -- tests/e2e/portal-presence.spec.ts tests/e2e/portal-login.spec.ts` (Sheet and AuthBits users). Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/_portal src/lib/portal src/styles scripts && git commit -m "feat(portal): kit calendar, competition card, now tile, sheet and Google button"`

### Task 8: Kit shell (low, Sonnet)

**Files:**
- Create in `src/app/_portal/ui/`: `BrandBlock.tsx`, `BottomNav.tsx`, `Sidebar.tsx`, `PortalShell.tsx`
- Test: covered by Task 9

**Interfaces (exact):**

```tsx
export function BrandBlock(p: { dark?: boolean; href: string }): JSX.Element;
// aria-label "Clubul Sportiv EduSport"; "CLUBUL SPORTIV" Inter 400 --portal-brand-kicker tracking 0.18em text-secondary (dark: text-nav-on-dark) over "EDUSPORT" Climate Crisis (text-branding-font)
// --portal-brand-word tracking 0.05em line-height 1 text-primary (dark: white); gap 1px; exactly the public header brand (read src/components Header for the font class)
export function BottomNav(p: { items: NavItem[]; label: string }): JSX.Element;
// phone only (hidden from portal:); fixed bottom; margin --portal-nav-margin; bg-surface-dark; radius --portal-nav-radius; pad --portal-nav-pad; grid of N equal columns;
// item min-h --portal-nav-item-h, icon size "20" above label 11px; inactive text-secondary-on-dark 600; active bg-ice text-primary 700 radius --portal-nav-item-radius, aria-current="page"
export function Sidebar(p: { items: NavItem[]; account: { label: string; href: string }; label: string; brandHref: string }): JSX.Element;
// from portal: only; w --portal-sidebar-w, bg-surface-dark, pad 28px 16px 24px, gap 32px, full height sticky; BrandBlock dark (padding-x 14px);
// links min-h --portal-sidebar-link-h, pad-x 14px, gap 12px, icon "20", --portal-sidebar-link-size 600 text-nav-on-dark; hover bg-surface-subtle-on-dark; active bg-ice text-primary 700 aria-current;
// account link at the foot: same height, 15px 700 white, border 1px --portal-band-on-dark-line, label left, Icon portal-chevron-down size sm right
export function PortalShell(p: { nav: NavItem[]; account: { label: string; href: string }; brandHref: string; phoneNav?: boolean; children: React.ReactNode }): JSX.Element;
// root: bg-surface min-h-svh text-primary; portal: flex row (Sidebar + main column flex-1 min-w-0); phone: column with children then BottomNav (unless phoneNav === false) and bottom padding equal to the nav height plus margin;
// mounts ToastProvider and EntryReveal (moved in Task 4)
```

- Nav switching is CSS only (`portal:` variant): both navs render, one hidden. No JS width check.
- New tokens if needed (`/* layout */`): `--portal-sidebar-pad-top: 28px`, `--portal-nav-safe: 84px` (52 + 2 x 6 + 16 + 4).

- [ ] **Step 1: Implement** (read `gen_coach.py` `brand`, `BRAND_CSS`, `phone` (nav part), `DT_CSS`, `desktop`).
- [ ] **Step 2: Run** `npx tsc --noEmit && npm run lint && npm run check:tokens && node --test scripts/tokens/portal-theme.test.mjs`. Expected: PASS.
- [ ] **Step 3: Commit** `git add src/app/_portal src/styles scripts/tokens && git commit -m "feat(portal): kit shell with brand block, bottom nav and sidebar"`

### Task 9: Kit preview page and portal computed-style e2e (low, Sonnet)

**Files:**
- Create: `src/app/(antrenor)/antrenor/kit-preview/page.tsx` (server component, `export const dynamic = "force-dynamic"`; `notFound()` unless `process.env.PORTAL_KIT_PREVIEW === "1"`), `src/app/(antrenor)/antrenor/kit-preview/KitPreview.tsx` (client)
- Modify: `playwright.e2e.config.ts` (Next env `PORTAL_KIT_PREVIEW: "1"`)
- Test: `tests/e2e/portal-kit.spec.ts`

**Interfaces:**
- The preview renders every kit part and every token-carried shared component with synthetic Romanian sample data, each wrapped in `<section data-kit="<Name>">`: `Input` with `Field` label "E-mail" and hint "Folosește adresa de cont.", `Select` "Durată", `Checkbox` checked and unchecked, `Button` primary "Salvează" and secondary "Renunță", a shared `Link` "Am uitat parola", `Card`, `Dialog` (open on a button "Deschide dialogul"), a `text-label` span "ETICHETĂ" (must stay caps), `PageHeader` (kicker "Bună, Alina", title "Azi", aside `NowTile`), `SectionHeading` with link "Calendar", `ListCard` with three `ListRow`s (one with `DateBlock word="Mar" big="10"`, one with `EndBlock kind="todo"` "Fă prezența", one with `StatusBlock kind="Individual" done`, one dim), `IndividualTag`, `KeyValueCard`, `StatCard` ("4", "antrenamente azi", side "1 completat"), `Segmented` ("Toți sportivii", "Grupele mele"), `SaveBar` ("6 prezenți", primary "Salvează"), `MonthPicker`, `MonthGrid` for "2026-11", `CalendarLegend`, `CompetitionCard` open with two members, `Sheet` (open on a button "Deschide foaia"), `GoogleButton`, `OrLine`, `ContactButton` both kinds, `CopyButton`, inside a `PortalShell` with the five coach nav items (labels "Azi", "Grupe", "Concursuri", "Istoric", "Profil") and account "Alina".

- [ ] **Step 1: Failing e2e** `tests/e2e/portal-kit.spec.ts` (coach host `http://antrenor.localhost:3200/kit-preview`, no login needed; `test.describe` at 390 x 844 and 1280 x 900). Exact assertions (computed style strings):
  - `body`: `background-color` `rgb(246, 249, 253)`; attribute `data-theme` = `portal`.
  - input: `border-top-width` `1px`, `border-top-color` `rgb(185, 198, 218)`, `background-color` `rgb(255, 255, 255)`, `height` `48px`, `padding-left` `14px`, `font-size` `15px`.
  - field label: `font-size` `14px`, `font-weight` `700`, `text-transform` `none`, `letter-spacing` `normal` or `0px`, `color` `rgb(14, 26, 60)`; hint `font-size` `13px`, `color` `rgb(95, 101, 122)`.
  - select trigger: same box values as the input; its icon `use` href contains `portal-chevron-down`.
  - primary `.lcta-face`: `background-color` `rgb(14, 26, 60)`, `color` `rgb(255, 255, 255)`, `border-top-width` `2px`, `box-shadow` `rgba(14, 26, 60, 0.16) 8px 8px 0px 0px`, `font-size` `15px`, `font-weight` `700`, `text-transform` `none`, `padding-left` `20px`, `height` `48px`; both `.lcta-layer` `display` `none`.
  - secondary button: `background-color` `rgb(255, 255, 255)`, `border-top-width` `2px`, `border-top-color` `rgb(14, 26, 60)`.
  - checkbox box: `width` and `height` `44px`, `border-top-width` `2px`; unchecked `border-top-color` `rgb(185, 198, 218)`; checked `background-color` `rgb(14, 26, 60)`; its mark `width` `20px`.
  - Tab to the input: `outline-color` `rgb(74, 123, 208)`, `outline-offset` `2px`.
  - shared link: `font-weight` `700`, `background-size` `100% 0px`; on hover `text-decoration-line` `underline` and `color` `rgb(14, 26, 60)`.
  - the `text-label` span: `text-transform` `uppercase` (no leak).
  - card: `border-top-width` `1px`, `border-top-color` `rgb(221, 230, 243)`.
  - dialog open: content `background-color` `rgb(255, 255, 255)`, `padding-left` `20px`; title `font-size` `22px`; overlay `background-color` `rgba(14, 26, 60, 0.45)`.
  - `ListRow`: `min-height` `76px`; title `font-size` `15px`, `font-weight` `700`; sub `font-size` `13px`, `color` `rgb(95, 101, 122)`; the row divider `border-top-color` `rgb(221, 230, 243)`; the chevron column `width` `44px`.
  - `DateBlock`: `width` `52px`, `height` `52px`, `border-radius` `6px`, `background-color` `rgb(225, 236, 251)`; `[data-date-word]` `color` `rgb(190, 51, 48)`, `font-size` `11px`, `text-transform` `uppercase`; number `font-size` `22px`, `font-family` contains `League Spartan`.
  - `EndBlock` todo: `width` `96px`, `background-color` `rgb(14, 26, 60)`, `font-size` `11px`, `font-weight` `800`.
  - `StatusBlock`: `width` `64px`, `background-color` `rgb(74, 123, 208)`, `aria-label` `Individual, completat`.
  - `IndividualTag`: `background-color` `rgb(17, 17, 17)`, `font-size` `11px`, `text-transform` `none`.
  - `StatCard` number: `font-size` `88px`, `color` `rgb(143, 184, 245)`.
  - `Segmented`: `border-top-width` `2px`; a button `height` `44px`, `font-size` `14px`, `font-weight` `700`; the active one `background-color` `rgb(14, 26, 60)`.
  - `SaveBar`: `border-top-color` `rgb(221, 230, 243)`; count `font-size` `20px`.
  - `MonthGrid`: 30 day buttons; a cell `height` `48px`.
  - `CompetitionCard`: `summary` visible; two member rows; count block `width` `96px`.
  - `Sheet` open: content `background-color` `rgb(255, 255, 255)`, `padding-left` `20px`, `border-top-width` `1px`; no element `[aria-hidden] .h-1.w-12` handle; at 1280 the content `width` `460px`.
  - at 390: `BottomNav` visible, `background-color` `rgb(14, 26, 60)`, `border-radius` `18px`, five links; the active one `background-color` `rgb(143, 184, 245)`, `border-radius` `13px`; `Sidebar` hidden; `h1` `font-size` `30px`; header band `background-color` `rgba(0, 0, 0, 0)`.
  - at 1280: `Sidebar` visible, `width` `240px`, `background-color` `rgb(14, 26, 60)`, inactive link `color` `rgb(201, 214, 238)`, active link `background-color` `rgb(143, 184, 245)`; `BottomNav` hidden; `h1` `font-size` `40px`; header band `background-color` `rgb(225, 236, 251)`; page body `max-width` `1200px`.
  - shapes: every element except the bottom nav, its active item, `[data-date-block]` (date and place blocks, 6px) and `[data-spinner]` has computed `border-radius` `0px`; the exceptions have exactly 18px, 13px, 6px.
  - red text: no element with a direct text node has `color` `rgb(190, 51, 48)` outside `[data-date-word]`.
  - `http://localhost:3200/kit-preview` (public host) answers 404. The guard is one exported function `kitPreviewEnabled(env: Record<string, string | undefined>): boolean` (true only when `env.PORTAL_KIT_PREVIEW === "1"`), unit-tested in `scripts/portal/kit-preview.test.mjs`: `{}` -> false, `{ PORTAL_KIT_PREVIEW: "0" }` -> false, `{ PORTAL_KIT_PREVIEW: "1" }` -> true. Deploys never set the flag.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-kit.spec.ts` and `node --test scripts/portal/kit-preview.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** the page and fix any kit value the test exposes (fix the kit or the theme file, never the test value, unless the test contradicts the spec table; then the spec wins and the ledger notes it).
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) playwright.e2e.config.ts tests/e2e scripts/portal && git commit -m "test(portal): kit preview and computed styles of every portal component"`

### Task 10: Final checks (low, Haiku)

**Files:**
- Modify: `docs/portal/DECISIONS.md` (append "2026-11-09 portal theme kit (decided by Claude, low impact)": the copy "Numărul a fost copiat.", the kit preview page behind `PORTAL_KIT_PREVIEW`, the stat card text staying `--color-primary-on-dark`)

- [ ] **Step 1: Run in a background worktree of the merged `feat/portal-theme`:** `npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:scripts && node --test scripts/portal/*.test.mjs scripts/tokens/*.test.mjs`, then `npx playwright test tests/visual/pages.spec.ts` (both projects, against the Task 1 baseline, expected 0 failed), then `npm run test:e2e` (all). Expected: PASS; record counts in the ledger.
- [ ] **Step 2: Screenshots** of `/kit-preview` at 390 and 1280 into `docs/portal/mockups/screens/coach-canvas-v1/kit-390.png`, `kit-1280.png`; compare by eye against the canvas boards `s_AntrenorAzi.dc.html.png` and `s_AntrenorDesktopAzi.dc.html.png`; list visible differences in the ledger for the final review.
- [ ] **Step 3: Commit** `git add docs/portal && git commit -m "docs(portal): theme kit decisions and kit screenshots"`
