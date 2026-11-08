# Portal canvas look: one token theme for both portals (design spec)

Date: 2026-11-09. Status: binding for plans `2026-11-09-portal-theme-kit.md` (A), `2026-11-09-coach-canvas-screens.md` (B) and the amended phase 7 frontend plans.

## 1. Decision and scope

User decision 2026-11-09 (DECISIONS.md, "2026-11-09 open decisions answered", last two lines): both portals, the coach site `antrenor.` and the student and parent site `sportiv.`, are built to look exactly like the Design canvas, every component included (inputs, labels, buttons, links, rows, cards, nav, sheets, colours, fonts). The public website keeps its current look and must not change.

Sources of truth, in this order:

1. Coach boards `docs/portal/mockups/screens/coach-canvas-v1/Antrenor*.dc.html` and their generators `gen_coach.py`, `gen_login.py` (every style in readable Python).
2. Student boards `docs/portal/mockups/screens/sportiv-canvas-current/` (only the boards listed in its `canvas.json`: Main, Istoric, Calendar, Progres, Plati, Setari, MainPerf, Concursuri, ConcursDetaliu, Promovare, Cont and the nine `Desktop*` boards; the `*Ice`, `Acasa*`, `ContIce` files are older variants and are not built).
3. The audit `docs/portal/mockups/screens/coach-canvas-v1/component-audit.md` (34 differing components, 8 canvas-only, 9 code-only, 6 same).
4. Login: the version already built on `feat/portal` (phone: brand on white, landing wave band at the bottom; desktop: navy panel with ribbon) is the approved one. The canvas login boards are not rebuilt; only the components inside the login card follow the canvas (inputs, labels, buttons, Google button, "sau" line, link).

Board files inline a base64 font: grep or sed the CSS, never read a whole board file. Read the generator for values.

Out of scope: any change to how a public page looks. Any backend behaviour (that is the backend plan `edusport_backend/.../2026-11-09-coach-portal-additions.md`).

## 2. The rule

- A component never asks which site it is on. No `site`, `portal`, `theme` or `isPortal` prop, no `data-theme` selector inside a component, no host check in a component.
- Every visual difference between the public site and the portals is a token value. The public value is the default in `src/app/globals.css`. The portal value is in exactly one file, `src/styles/portal-theme.css`, under the single selector `[data-theme="portal"]`.
- A difference a token cannot express (different markup or shape) becomes either a documented variant prop on the shared component (same file, default = public behaviour) or a portal-only component in `src/app/_portal/ui/`.
- `src/styles/portal-theme.css` is the readable list of every difference. Reading it top to bottom tells a reviewer how the portals differ from the public site. Each line carries a comment with the audit row number.
- Portal-only components style themselves only with tokens from `portal-theme.css` and the shared tokens. No hex literal, no `[14px]` arbitrary value; sizes come in through the Tailwind 4 variable form, for example `min-h-(--portal-row-min-h)`, `px-(--portal-row-pad-x)`, `text-(length:--portal-row-title)`.

The architecture map draft `edusport_backend/.claude/worktrees/p3be/docs/architecture/diagrams/06d-component-theming.puml` (untracked at the time of writing) draws the same four layers: token values, root layouts choosing the theme, shared components written once, portal-only components. One correction to that draft: the portal does not override `--color-line` (buttons keep the navy border on the canvas); inputs get their own `--color-input-line`.

## 3. Mechanism

### 3.1 Files

| File | Holds | Who edits it |
|---|---|---|
| `src/app/globals.css` | Existing tokens plus the new component tokens with their public values (section 4.1). The type roles and the `.lcta`, `link` rules read those tokens instead of literals. | Plan A Task 2 only. After that, a public value never changes in a portal task. |
| `src/styles/portal-theme.css` | `@theme` block with the portal-only palette and the `portal` breakpoint; one `[data-theme="portal"]` block with every override and every portal layout size; one `@media (width >= 56.25rem)` block for the desktop values of the same selector. | Any portal task that needs a new difference adds one line with its audit row. |
| `src/app/(antrenor)/layout.tsx`, later `src/app/(sportiv)/layout.tsx` | `<body data-theme="portal" className="bg-surface">` | Plan A Task 3, phase 7 frontend Task 5. |
| `src/app/_portal/ui/*` | Portal-only components (section 5.3). | Plan A Tasks 5 to 8. |

`portal-theme.css` is imported once, from `globals.css`, right after the `@theme` blocks (`@import "../styles/portal-theme.css";`), so Tailwind sees its `@theme` block and the scoped block is inert on public pages (no element there has `data-theme="portal"`).

### 3.2 Why tokens work here

Tailwind 4 compiles a colour utility to a variable read (`bg-surface` is `background-color: var(--color-surface)`), so a scoped override changes every use under the portal root. Literal values are the problem: `border-retro` (1.5px), `text-label`, `text-button`, `text-title`, `.lcta-layer`, `.lcta-face` and `link` carry literal values today. Plan A Task 2 rewrites those to read variables whose public values are exactly today's literals, and points the shared components at component-specific roles (`text-field-label` for the field label instead of the general `text-label`) so a portal override touches only the component it means.

### 3.3 Guards

1. Public screenshots: `tests/visual/pages.spec.ts` (16 routes plus detail pages, 390, 768, 1440, Chromium and WebKit). Baseline recorded on the base commit before any change (plan A Task 1, snapshots stay in the plan A worktree, they are gitignored), compared after every task that touches `globals.css` or `src/components/ui/*`. Zero diffs allowed; a diff is a bug, never a rebaseline.
2. Public computed styles, committed and permanent: `tests/e2e/public-style-guard.spec.ts` (plan A Task 1) asserts the public values of each token-carried property on `/inscrieri` and `/contact` (section 4.1 "public" column).
3. Portal computed styles: `tests/e2e/portal-kit.spec.ts` on the coach host renders the kit preview page and asserts every value of the "portal" column (plan A Task 9).
4. Scatter guard: `scripts/tokens/patterns.mjs` gains two patterns (plan A Task 3): `canvas-hex` (any of `#f6f9fd #dde6f3 #b9c6da #8fb8f5 #e1ecfb #4a7bd0 #c9d6ee #111111`, case-insensitive) outside `src/styles/portal-theme.css`, and `theme-branch` (`data-theme` in any `src/**/*.tsx` other than the two portal root layouts). Both run in `npm run check:tokens`.

## 4. Token list

### 4.1 Component tokens that exist on both sides

Public value = today's literal (unchanged look). Portal value = canvas (generator constant in brackets).

| Token | Public value | Portal value | Carries (audit row) | Read by |
|---|---|---|---|---|
| `--color-surface` | #fbf8f1 | #f6f9fd (BG) | page background (1) | `bg-surface` everywhere |
| `--color-surface-subtle` | #ece8e0 | #e1ecfb (ICE_L) | info card, table head fill (8, 30) | Card `surface="subtle"` |
| `--color-line-subtle` | #dfdddb | #dde6f3 (LINE) | dividers (9, 30) | `divide-line-subtle`, `border-line-subtle` |
| `--color-overlay` | rgb(14 26 60 / 0.55) | rgb(14 26 60 / 0.45) | sheet and dialog overlay (26) | `bg-overlay` |
| `--color-card-line` (new) | #0e1a3c | #dde6f3 | card border colour (7, 28) | Card, Dialog |
| `--card-border-width` (new) | 1.5px | 1px | card border width (7) | Card, Dialog |
| `--color-input-line` (new) | #0e1a3c | #b9c6da | input, select, textarea border (14, 15) | form-field, select |
| `--input-border-width` (new) | 1.5px | 1px | (14, 15) | form-field, select |
| `--input-pad-x` (new) | 1rem | 14px | (14) | form-field, select |
| `--color-input-bg` (new) | var(--color-surface) | #ffffff | input fill on a page surface (14) | form-field `surface="page"`, select |
| `text-input` role (new): `--text-input-size`, `--text-input-leading` | 0.875rem, 1.55 | 15px, 1.3 | input text (14, 15) | form-field, select |
| `text-field-label` role (new): `--field-label-weight`, `--field-label-size`, `--field-label-tracking`, `--field-label-case`, `--field-label-leading` | 600, 0.75rem, 0.14em, uppercase, 1.1 | 700, 14px, 0, none, 1.3 | field label (13) | Field, FieldLabel |
| `--color-label-ink` (new) | #495269 | #0e1a3c | (13) | Field, FieldLabel |
| `text-field-hint` role (new): `--field-hint-size`, `--field-hint-leading` | 0.75rem, 1.4 | 13px, 1.4 | (16) | Field hint |
| `--color-hint-ink` (new) | #495269 | #5f657a | (16) | Field hint |
| `--field-gap` (new) | 0.5rem | 6px | label to control gap (13) | Field |
| `text-button` role: `--text-button-weight`, `--text-button-size`, `--text-button-tracking`, `--text-button-case` | 600, 0.8125rem, 0.06em, uppercase | 700, 15px, 0, none | (19, 20, 27) | Button, every `text-button` |
| `--color-button-secondary-bg` (new) | transparent | #ffffff | secondary fill on light surfaces (20) | Button `variant="secondary"` without `onDark` |
| `--button-pad-x` (new) | 1.5rem | 20px | (19, 20) | Button |
| `--control-border-width` (new) | 1.5px | 2px | secondary button, button face, segmented, Google button (19, 20, 18, 27) | Button, `.lcta-face` |
| `--color-button-face` (new) | #000000 | #0e1a3c | primary face (19) | Button `face="black"` |
| `--color-button-face-text` (new) | #fbf8f1 | #ffffff | primary face text (19) | Button `face="black"` |
| `--button-layers` (new) | block | none | mustard and rust layers (19) | `.lcta-layer` display |
| `--button-face-shadow` (new) | none | 8px 8px 0 rgb(14 26 60 / 0.16) | primary static shadow (19) | `.lcta-face` |
| `--button-press-shift` (new) | 4px | 0px | press snap of the face (19, canvas draws no motion) | `.lcta:active .lcta-face` |
| `--checkbox-size` (new) | 1.25rem | 44px | (17, 30) | Checkbox |
| `--checkbox-border-width` (new) | 1.5px | 2px | (17) | Checkbox |
| `--color-checkbox-line` (new) | #0e1a3c | #b9c6da | unchecked border (17) | Checkbox |
| `--color-checkbox-on` (new) | #be3330 | #0e1a3c | checked fill and border (17) | Checkbox |
| `--color-checkbox-mark` (new) | #fbf8f1 | #ffffff | check mark (17) | Checkbox |
| `--checkbox-mark-size` (new) | 14px | 20px | (17) | Checkbox |
| `--color-focus` (new) | #0e1a3c | #4a7bd0 | focus ring on light surfaces (31) | every FOCUS_LIGHT string |
| `--focus-offset` (new) | 3px | 2px | (31) | every FOCUS_LIGHT string |
| `link` utility: `--link-weight`, `--color-link-bar`, `--link-bar-size`, `--color-link-hover`, `--link-hover-decoration`, `--link-hover-animation` | 600, #be3330, 2px, #be3330, none, link-slide | 700, transparent, 0px, #0e1a3c, underline, none | (21) | Link `tone="default"` |
| `text-dialog-title` role (new): `--dialog-title-size`, `--dialog-title-leading`, `--dialog-title-tracking` | 1.25rem, 1.2, -0.01em | 22px, 1.2, 0 | (26) | Dialog title |
| `--color-dialog-bg` (new) | #fbf8f1 | #ffffff | (26) | Dialog |
| `--dialog-pad` (new) | 1.5rem | 20px | (26) | Dialog |
| `--dialog-max-w` (new) | 28rem | 460px | desktop width (26) | Dialog `width="md"` |

Colour tokens are named so their utilities never collide with a type role (`text-label-ink` is a colour, `text-field-label` a role). A new colour token whose public value points at another token (`--color-input-bg: var(--color-surface)`) resolves on `:root`, so the portal sets its own literal for it instead of relying on the `--color-surface` override.

Unchanged on purpose: `--color-primary`, `--color-secondary`, `--color-muted`, `--color-accent`, `--shadow-retro`, `--color-surface-raised`, `--color-line` (the six "Same" rows of the audit and the navy button border).

### 4.2 Portal-only tokens (no public twin)

Palette, in the `@theme` block of `portal-theme.css` (so `bg-ice` and the rest exist as utilities; nothing public uses them):

| Token | Value | Use |
|---|---|---|
| `--color-ice` | #8fb8f5 | active nav item, stat number, competition band (24, 33) |
| `--color-ice-light` | #e1ecfb | date block, top band, done block, table head (10, 11, 25) |
| `--color-ice-blue` | #4a7bd0 | individual band, completed status block, calendar individual bar (11) |
| `--color-nav-on-dark` | #c9d6ee | sidebar links, kicker on dark (25, 23) |
| `--color-tag-ink` | #111111 | Individual tag (12) |
| `--color-cancelled` | #c0c0c4 | cancelled calendar bar (calendar legend) |
| `--breakpoint-portal` | 56.25rem | the one 900 px switch: `portal:` variant |

Layout sizes, in `[data-theme="portal"]` (desktop values in the `@media (width >= 56.25rem)` block):

| Token | Phone | Desktop | Use |
|---|---|---|---|
| `--portal-h1-size` | 30px | 40px | page title, League Spartan 800, line-height 1.05 (2) |
| `--portal-h2-size` | 22px | 22px | section heading, sheet title (3, 26) |
| `--portal-kicker-size` | 14px | 14px | greeting and sub lines under the title (6) |
| `--portal-sub-size` | 13px | 14px | sub line under the h1 (6) |
| `--portal-row-min-h` | 76px | 76px | list row (9) |
| `--portal-row-pad-y` / `--portal-row-pad-x` | 12px / 14px | same | (9) |
| `--portal-row-gap` | 14px | 14px | (9) |
| `--portal-row-title` | 15px | 15px | weight 700 (4) |
| `--portal-row-sub` | 13px | 13px | colour muted (5) |
| `--portal-trail-w` | 44px | 44px | chevron column (9) |
| `--portal-dateblock-w` / `-h` | 56px / 52px | same | date and time block (10) |
| `--portal-dateblock-radius` | 0px | 0px | see open question 1 in the index |
| `--portal-dateblock-num` / `-num-solo` / `-word` | 22px / 17px / 11px | same | (10) |
| `--portal-endblock-w` | 96px | 96px | end block and session band (11), see open question 2 |
| `--portal-typeblock-w` / `-icon` | 64px / 26px | same | status block (canvas-only 3) |
| `--portal-stat-num` | 88px | 88px | stat card number, line-height 0.85 (33) |
| `--portal-tap` | 44px | 44px | min tap height for links, back link, arrows |
| `--portal-kv-min-h` | 56px | 56px | key/value row (canvas-only 1) |
| `--portal-card-pad` | 16px | 16px | info card, kv row x padding |
| `--portal-sheet-pad` | 20px | 20px | sheet card (26) |
| `--portal-login-pad` | 24px | 24px | login card (28) |
| `--portal-login-title` | 28px | 28px | login card h1, League Spartan 800 (28) |
| `--portal-page-x` | 20px | 32px | page side padding (34) |
| `--portal-section-gap` | 26px | 32px | gap between sections (34) |
| `--portal-cols-gap` | 24px | 32px | desktop columns |
| `--portal-container` | none | 1200px | content max width (34) |
| `--portal-nav-radius` / `--portal-nav-item-radius` | 18px / 13px | not used | floating bottom nav (24) |
| `--portal-nav-margin` / `--portal-nav-pad` / `--portal-nav-item-h` / `--portal-nav-label` | 16px / 6px / 52px / 11px | not used | (24) |
| `--portal-sidebar-w` / `--portal-sidebar-link-h` / `--portal-sidebar-link-size` | not used | 240px / 48px / 15px | (25) |
| `--portal-brand-kicker` / `--portal-brand-word` | 12px / 22px | same | phone brand block (23) |
| `--portal-band-on-dark-line` | rgb(246 249 253 / 0.35) | same | account button border on the sidebar (25) |

Radius: only `--portal-nav-radius`, `--portal-nav-item-radius` and `--portal-dateblock-radius` may be non-zero, and only the kit's `BottomNav` and `DateBlock` read them (spec 6.1 of the sportiv app and the phase 7 index already approved the rounded floating menu; open question 8 asks the user to confirm it once more against the no-rounded rule). The spinner stays the only circle.

## 5. Component inventory

Kind: T = token only (no markup change beyond reading the token), V = documented variant on the shared component, P = portal-only component in `src/app/_portal/ui/`. "Plan" names the task that delivers it.

### 5.1 The 34 differing rows

| # | Component | Kind | How | Plan |
|---|---|---|---|---|
| 1 | Page background | T | `--color-surface` | A2, A3 |
| 2 | Page title h1 | P | `PageHeader` h1 with `--portal-h1-size` | A6 |
| 3 | Section heading h2 | P | `SectionHeading` (`--portal-h2-size`, optional right link "<text> ›") | A6 |
| 4 | Row title | P | `ListRow` title (`--portal-row-title`, 700) | A6 |
| 5 | Row sub line | P | `ListRow` sub (`--portal-row-sub`, muted) | A6 |
| 6 | Kicker line | P | `PageHeader` kicker (`--portal-kicker-size`, muted, normal case) | A6 |
| 7 | Card | T | `--color-card-line`, `--card-border-width`; kit callers pass `shadow="md"` (8px) | A2, A3 |
| 8 | Info card | T | `--color-surface-subtle` | A3 |
| 9 | List row | P | `ListRow` | A6 |
| 10 | Date or time block | P | `DateBlock` | A6 |
| 11 | End or status block | P | `EndBlock` (todo, done, lesson, group, soft) | A6 |
| 12 | Individual tag | P | `IndividualTag` | A6 |
| 13 | Field label | T | `text-field-label`, `--color-label-ink`, `--field-gap` | A2, A3 |
| 14 | Input | T | input tokens | A2, A3 |
| 15 | Select trigger | T + V | input tokens; variant prop `chevron?: IconName` (default `"chevron-down"`), kit passes `"portal-chevron-down"` | A2, A5 |
| 16 | Field hint | T | `text-field-hint`, `--color-hint-ink` | A2, A3 |
| 17 | Checkbox | T | checkbox tokens (44px box, 2px, navy fill, 20px mark) | A2, A3 |
| 18 | Segmented control | P | `Segmented` (2px navy outline, no dividers, auto width, h 44, 14px 700) replaces the coach `_ui/Segmented.tsx` | A6 |
| 19 | Primary button | T | face colour, layers off, static shadow, 2px border, text role, padding, no press shift | A2, A3 |
| 20 | Secondary button | T | `--color-button-secondary-bg` (white), border 2px, text role, padding | A2, A3 |
| 21 | Link | T | link tokens | A2, A3 |
| 22 | Back header | P | `PageHeader` `back={{ href, label }}` renders "‹ <label>" 15px 700 with a 44px tap | A6 |
| 23 | Phone header and brand | P | `BrandBlock` + `PageHeader`; no navy bar, no initials button | A8 |
| 24 | Bottom nav | P | `BottomNav` floating navy bar, icons, N items | A8 |
| 25 | Desktop nav | P | `Sidebar` (240px navy, icon links, account button) and `TopBand` (ice-light band with the page heading) | A8 |
| 26 | Sheet and dialog | P + T | `Sheet` (moved from the coach `_ui`, restyled: white, card line, 8px shadow, pad 20, h2 22px, no grab handle, desktop 460px centred); shared `Dialog` by tokens | A2, A7 |
| 27 | Google button and divider | P | `GoogleButton` (white, 2px navy, 15px 700, 18px G logo) and `OrLine` (centred "sau", 13px muted, no rules) in `_portal/ui/AuthBits.tsx` | A7 |
| 28 | Login frame card | T | `AuthFrame` hex literals replaced by tokens (`border-card-line`, `shadow-retro`, `bg-surface-dark`, `text-ice`, `text-nav-on-dark`, `text-secondary`), card pad `--portal-login-pad`, h1 28px through `--portal-login-title` | A3 |
| 29 | Save bar | P | `SaveBar` (white, top line, pad 14/20, count League Spartan 20px, primary button) | A6 |
| 30 | Presence table | P | built in plan B Task 5 from kit parts (`PortalCard`, ice-light head, 44px checkboxes) | B5 |
| 31 | Focus ring | T | `--color-focus`, `--focus-offset` | A2, A3 |
| 32 | Icons | V + P | portal icon files `public/icons/portal-*.svg` (canvas paths, stroke 2 round, chevrons 2.5 square); `Icon` size variant gains `"18"`, `"20"`, `"26"` (pixel sizes; existing keys unchanged) | A5 |
| 33 | Stat card | P | `StatCard` (navy, 88px ice number, 14px label #c0c0c4, side lines) | A6 |
| 34 | Desktop page container | P | `PortalShell` main area (max 1200, pad 32, columns gap 32) | A8 |

### 5.2 The 8 canvas-only components

| # | Component | Kit file | Plan |
|---|---|---|---|
| 1 | Key/value card | `KeyValueCard.tsx` | A6 |
| 2 | Now tile | `NowTile.tsx` | A7 |
| 3 | Status (type) block | `StatusBlock.tsx` (blue check = completat, navy clock = necompletat) | A6 |
| 4 | Competition accordion card | `CompetitionCard.tsx` (native `details`/`summary`, 96px navy count block) | A7 |
| 5 | Place block and points cell | `PlaceBlock.tsx`, `PointsCell.tsx` | A7 |
| 6 | Nav icons and the Concursuri tab | `BottomNav`, `Sidebar` items with `portal-*` icons | A8, B1 |
| 7 | Calendar | `MonthGrid.tsx`, `CalendarLegend.tsx`, `MonthPicker.tsx` | A7 |
| 8 | Desktop top band and sidebar account button | `TopBand.tsx`, `Sidebar.tsx` | A8 |

### 5.3 The 9 code-only parts (not drawn)

| Part | Decision |
|---|---|
| Textarea | T: input tokens apply. |
| Toast | P: moved to `_portal/ui/Toast.tsx`, navy, `shadow-retro`, 14px; no change of behaviour. |
| Spinner | P: moved, unchanged (the one round shape). |
| LoadError | P: moved, 14px muted line plus "Încearcă din nou" as a kit link. |
| Entry reveal | P: moved, unchanged. |
| Password field | P: moved; input tokens; eye toggle is a 44px square button. |
| Profile dropdown | Removed: the canvas account button opens Profil. |
| Initials button | Removed: Profil is in the bottom nav. |
| Disabled and invalid states | T: unchanged logic and colours (`--color-disabled`, accent border), they are not text. |

### 5.4 Login

Kept as built (`AuthFrame`, `AuthRibbon`, wave band). Inside the card: inputs, labels and the primary button come from tokens (rows 13, 14, 19), the Google button and "sau" line are `GoogleButton` and `OrLine`, the "Am uitat parola" link is a kit `PortalLink` (14px 700, 44px tap, centred). The card's hard-coded hex values become tokens (row 28). The phone login stays one screen at 390 x 844 (existing `portal-login.spec.ts` assertions stay green).

## 6. Shared portal folder

Created by plan A Task 4, ahead of phase 7 (which planned it in its Task 2):

```
src/app/_portal/
  ui/        kit and moved parts: AuthFrame, AuthRibbon, AuthBits, EntryReveal, PasswordField, Sheet, Toast, Spinner, LoadError,
             BrandBlock, PortalShell, BottomNav, Sidebar, TopBand, PageHeader, SectionHeading, PortalCard, ListRow, DateBlock,
             EndBlock, StatusBlock, IndividualTag, KeyValueCard, StatCard, Segmented, SaveBar, NowTile, MonthPicker, MonthGrid,
             CalendarLegend, CompetitionCard, PlaceBlock, PointsCell, ContactButton, CopyButton, PortalLink, SessionRow (phase 7)
  auth/      LoginForm, ResetForm, InviteForm (take { copy: AuthCopy; homePath: string })
  lib/       entry-transition.ts, nav.ts (NavItem type, isActive)
  kit-preview/ (no route; the preview page lives at src/app/(antrenor)/antrenor/kit-preview, see plan A Task 9)
src/lib/portal/copy-shared.ts   AuthCopy, PORTAL_LABEL, shared state strings
```

Removed from the coach folder after the move: `_ui/{ListCard,Row,SquareLabel,BackHeader,PortalHeader,TopNav,Segmented}.tsx` (replaced by kit parts in plan B; deleted in plan B Task 14 once no import is left).

## 7. Public site untouched

- Plan A Task 2 is the only task that edits `globals.css` values and shared components for the public side, and it must leave every public computed style identical: guard 1 (zero screenshot diffs at 390, 768, 1440 in Chromium and WebKit) and guard 2 (computed-style assertions) both pass before its commit.
- After Task 2, portal tasks may add lines to `portal-theme.css` and files under `src/app/_portal/`, `src/app/(antrenor)/`, `src/app/(sportiv)/`, `public/icons/portal-*.svg`. Any other edit to `src/components/ui/*` or `globals.css` reruns guards 1 and 2.
- The final task of each plan (A10, B14) reruns guard 1 on the merged branch.
