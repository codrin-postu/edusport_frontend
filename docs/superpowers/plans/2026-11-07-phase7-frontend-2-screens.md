# Phase 7 Frontend 2: Sportiv Screens Implementation Plan

> **Amended 2026-11-09:** the look, the shared folder and the UI kit come from plan A `2026-11-09-portal-theme-kit.md` (spec `docs/superpowers/specs/2026-11-09-portal-canvas-design.md`); design source `docs/portal/mockups/screens/sportiv-canvas-current/`. Nothing in this plan defines its own colours, sizes or component look.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every screen of the approved design on `sportiv.<domain>`, phone and desktop: Acasă (with the performance variant and the promotion moment), Istoric, Calendar, Parcurs with badges, Concursuri and one competition, Abonament și plăți, Setări and Date sportiv; then the full checks, a boot check on a throwaway Postgres and a click-through of every screen.

**Architecture:** One client page per route under `src/app/(sportiv)/sportiv/(app)/[athleteId]/`, loading one backend route each through `useSportiv` (plan 1 Task 6). Presentation parts live next to their page in `_parts/` and are composed only from the kit in `src/app/_portal/ui/` (plan A) and the token-carried shared components; pure mapping (bars, badge geometry, filters to query) in `src/lib/portal/sportiv-*.ts` with Node tests.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, Tailwind 4, Node `--test`, Playwright.

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/specs/2026-11-07-sportiv-app-design.md` 6.3 to 6.10, 7, 8.3 to 8.6, 9. Index: `2026-11-07-phase7-frontend-index.md`. Design boards (layout and copy): `docs/portal/mockups/screens/sportiv-canvas-current/{Main,MainPerf,Promovare,Istoric,Calendar,Progres,Concursuri,ConcursDetaliu,Plati,Setari}.dc.html` and, for the desktop layout, `Desktop{Main,MainPerf,Istoric,Calendar,Progres,Concursuri,ConcursDetaliu,Plati,Setari}.dc.html` (Cont and Promovare have no desktop board: the sheet and dialog are the same centred layer). Read the board's markup for sizes and spacing; never infer from a screenshot (memory rule).

**Base:** `feat/sportiv` with plan 1 merged.

## Global Constraints

- Amended 2026-11-09: each screen matches its `sportiv-canvas-current` board exactly through the kit and the portal theme. A screen file contains no hex, no arbitrary pixel value, no `text-label`, `text-title`, `border-retro`; a size or colour the theme lacks goes into `src/styles/portal-theme.css` (comment: board name) in the same task. Shared calendar parts reuse the coach ones: `MonthPicker`, `MonthGrid`, `CalendarLegend` (plan A Task 7; Task 9 passes the sportiv marks `grupa`, `individual`, `concurs`, `anulata`, adding the `concurs` bar colour `bg-ice` to `MonthGrid` as one more mark kind); `CompetitionCard`, `PlaceBlock`, `PointsCell` serve Concursuri and the detail (Task 11). Every e2e file also runs the look sweep of plan B Task 15 on its pages (one h1, no red text outside `[data-date-word]`, radius only on the bottom menu and spinner, `body` `rgb(246, 249, 253)`).
See the index (Desktop and Session rows constraints are binding here). Every page: loading Spinner, "Nu am putut încărca datele." with "Încearcă din nou", 390 px first with a column at most 480 px, and the desktop layout from 900 px inside the shell's 1200 px container. Every e2e file here runs its page checks at 390 and at 1280 (`test.describe` over both viewports) and takes a screenshot at each; text assertions hold at both widths, layout assertions per width. Session lists use the shared `SessionRow` (plan 1 T6).

## Review Focus

See the index; lines 4 and 5 are owned by Tasks 7 and 11 of this file.

---

### Task 7: Acasă and the promotion moment (low, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/page.tsx`, `_parts/{PresenceCard,UpcomingList,AbonamentCard,LastCompetitionCard,PromotionDialog}.tsx` (UpcomingList renders `SessionRow`s), `src/lib/portal/sportiv-bars.ts`
- Test: `scripts/portal/sportiv-bars.test.mjs`, `tests/e2e/sportiv-home.spec.ts`

**Interfaces:**
- Consumes: `SportivHome`, `MonthBar`; kit `DateBlock`, `KeyValueCard`, `StatCard`, `SectionHeading`, `PortalCard`, `Sheet` (plan A), `SessionRow` (plan 1 T6).
- Produces: `barHeight(count: number | null, max: number): number` (40 px track, future 2 px); `PromotionDialog({ from, to, firstName, onDone })`.

- [ ] **Step 1: Failing tests.** Node: `barHeight(8, 8)` 40, `barHeight(6, 8)` 30, `barHeight(null, 8)` 2, `barHeight(0, 0)` 2. e2e: "Bună, Ana", h1 "Intermediari Bronze", "Școala de patinaj, AFI Cotroceni, 9 ani"; big "26" with "prezențe în sezon"; six month words "sep" to "feb", the current bar ice; "Următoarele ședințe" three `SessionRow`s, the first with date block, "17:30" and "AFI Cotroceni" on the left and a 92 px navy band "Intermediari Bronze" with white text on the right, the second a `#4a7bd0` band "Individual"; the trainer "Alina Gheorghe" is hidden until the row is opened (Enter on the summary opens it, then "Antrenor: Alina Gheorghe" and "Ora: 17:30 - 18:30" show); "Calendar ›" goes to calendar; abonament "Ședința 5/8" and "A-0124, valabil până la 30 noi" (mock with code) or "valabil până la 30 noi" (without), "Detalii ›" to plăți. Ioana: "Club Performanță", "Advanced Novice Girls, Patinoar Nord, 13 ani", card "Ultimul concurs" with "Locul", "2", "Cupa României 2026", "Advanced Novice Girls, 18 concurenți", "Total 98,42 puncte", "Toate ›"; with `skateDown`: "Rezultatele nu sunt disponibile acum." in that card and the rest present. Promotion (mock `promotion`): dialog "Nivel nou" over the page, old "Intermediari Bronze" and new "Intermediari Silver", "Felicitări, Ana! Ai trecut la nivelul următor.", focus on "Mai departe"; click posts `promotion/seen` once and the dialog never returns after reload; Escape does the same; with `reducedMotion: "reduce"` the computed `animation-name` of every dialog part is `none` and the old level is hidden. Both widths: at 1280 the page sits in the sidebar shell with the two-column layout of `DesktopMain` and `DesktopMainPerf` (Ioana: the competition band session rows use `#8fb8f5` with navy text, label "Concurs"), same texts as at 390; the promotion dialog stays a centred layer at both.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-bars.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-home.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Main`, `MainPerf`, `Promovare` (phone) and `DesktopMain`, `DesktopMainPerf` (desktop); keyframes and timings of `Promovare.dc.html` lines 16 to 26 exactly.
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): sportiv Acasă and promotion moment"`

### Task 8: Istoric (low, Haiku)

**Files:**
- Create: `(app)/[athleteId]/istoric/page.tsx`
- Test: `tests/e2e/sportiv-history.spec.ts`

- [ ] **Step 1: Failing e2e.** h1 "Istoric prezență", "Ana Ionescu, sezonul 2026-2027"; summary "26 prezențe", "22 grup", "4 individuale"; first row "Joi 5 noi, 17:30", "Intermediari Bronze, cu Alina Gheorghe", label "Grup"; a lesson row "Lecție, cu Andrei Pop" and "Individual"; "1 - 10 din 26"; "Înainte" loads page 2 ("11 - 20 din 26"), "Înapoi" disabled on page 1; empty mock "Nicio prezență în acest sezon."; no percentage sign anywhere on the page; the same checks at 390 and 1280, with the 1280 layout of `DesktopIstoric`.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-history.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Istoric.dc.html` and `DesktopIstoric.dc.html`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) tests/e2e && git commit -m "feat(portal): sportiv presence history"`

### Task 9: Calendar and the phone calendar link (low, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/calendar/page.tsx`, `_parts/{MonthGrid,DayList}.tsx` (DayList renders `SessionRow`s), `src/lib/portal/sportiv-calendar.ts`, BFF handler pass-through for `calendar.ics` (already allowed in plan 1 T4)
- Test: `scripts/portal/sportiv-calendar.test.mjs`, `tests/e2e/sportiv-calendar.spec.ts`

**Interfaces:**
- Produces: `monthCells(month: string): { date: string | null }[]` (Monday first, 6 x 7 max); `markersOf(items: CalendarItem[], date: string): ("grupa" | "individual" | "concurs" | "anulata")[]` (unique, that order).

- [ ] **Step 1: Failing tests.** Node: November 2026 starts on a Sunday -> six leading nulls; `markersOf` of a cancelled group item gives `["anulata"]`, of a group and a lesson `["grupa","individual"]`. e2e: "Calendar", "Ana Ionescu, doar ședințele proprii", "Noiembrie 2026" with "Luna trecută" and "Luna viitoare" buttons (disabled at season ends); weekday header "L Ma Mi J V S D"; legend "grupă", "individual", "concurs", "anulată"; tapping 12 shows "Joi, 12 noiembrie" with two `SessionRow`s: "17:00" with a `#4a7bd0` band "Individual" and "17:30" with a navy band "Intermediari Bronze"; opening a row (Enter) shows the trainer and "Ora: 17:30 - 18:30"; a competition day shows a `#8fb8f5` band "Concurs" with navy text; a cancelled session has a `#dde6f3` band with `#5f657a` text and its opened detail says "anulată"; the legend squares are 12 px with backgrounds `#0e1a3c`, `#4a7bd0`, `#8fb8f5`, `#dde6f3`; the top word of the date blocks (weekday or month) is the only red text; "Adaugă în calendarul telefonului" is a link to `/api/portal/sportiv/athletes/<id>/calendar.ics` and the download is named `edusport-Ana.ics`. Both widths: at 1280 the month grid and the day list sit side by side as in `DesktopCalendar`.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-calendar.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-calendar.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Calendar.dc.html` and `DesktopCalendar.dc.html`.
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): sportiv calendar and phone calendar file"`

### Task 10: Parcurs and badges (low, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/parcurs/page.tsx`, `_parts/{Badge,BadgeZoom}.tsx`, `src/lib/portal/sportiv-badges.ts`
- Test: `scripts/portal/sportiv-badges.test.mjs`, `tests/e2e/sportiv-path.spec.ts`

**Interfaces:**
- Produces: `TIER_COLORS: Record<Tier | "locked", { frame: string; shine: string; inner: string }>` (spec 7 values); `tierWord(t: Tier): string` ("bronz", "argint", "aur", "platină", "gheață"); `badgeAria(b: Badge): string` ("50 de antrenamente, nivel argint", "Concursuri, încă niciunul (blocat)").

- [ ] **Step 1: Failing tests.** Node: colors equal the spec values; `badgeAria` examples above. e2e: "Parcurs", "Ana Ionescu, Școala de patinaj"; card "Nivelul tău acum", "Intermediari Bronze" in ice, "din septembrie 2026, AFI Cotroceni", "Marți și joi, 17:30, cu Alina Gheorghe"; "Următorul nivel", "Intermediari Silver", "Antrenorul decide când treci mai departe."; "Până acum" rows "Începători" "sep 2025 - iun 2026" and "Primii Pași"; "Realizări" grid of 3 columns with "50 antrenamente", "Sezon complet", "Prima lecție", "Concursuri" (locked, muted label); tapping "50 antrenamente" opens a dialog listing "25", "50", "100", "250" with dates or "încă nu" and "63 din 100", "Închide" closes; the hexagon SVG has `role="img"` and the aria label; reduced motion: no animation; same checks at 390 and 1280, with the `DesktopProgres` layout at 1280 (the badge grid has more columns there).
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-badges.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-path.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Progres.dc.html` and `DesktopProgres.dc.html` (shapes, `es-zoom` and `es-dim` keyframes).
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): sportiv path and badges"`

### Task 11: Concursuri and one competition (high, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/concursuri/page.tsx`, `concursuri/[resultId]/page.tsx`, `src/lib/portal/sportiv-competitions.ts`
- Test: `scripts/portal/sportiv-competitions.test.mjs`, `tests/e2e/sportiv-competitions.spec.ts`

**Interfaces:**
- Produces: `competitionQuery(s: { q: string; season: string | null; sort: CompetitionSort; page: number }): string` (only the four keys, empty ones left out); `readQuery(params: URLSearchParams)` (the inverse, invalid sort -> `recent`).

- [ ] **Step 1: Failing tests.** Node: round trip of `competitionQuery` and `readQuery`; `sort=evil` -> `recent`. e2e as Ioana: "Concursuri", "Ioana Marin, 41 de concursuri"; "Categoria de concurs, sezonul 2026-2027", "Advanced Novice Girls", "din 2025 înainte: Basic Novice"; "101,07 record total", "12 podiumuri", "5 victorii"; "Caută" with placeholder "Nume concurs sau oraș", "Sezon" with "Toate sezoanele", "Ordine" with "Cele mai noi", "Cel mai bun loc", "Cele mai multe puncte"; 8 rows and "1 - 8 din 41"; typing "brasov" (debounced 300 ms) shows only Brașov rows and keeps the state in the URL; a row opens the detail: "‹ Concursuri", h1 "Cupa României 2026", "Locul 2 din 18", "Total 98,42", "record: 101,07", "Program scurt" with "TES", "PCS", "Deduceri" and the "Element", "Bază", "Scor" table, "Program liber"; "Clasamentul complet (pagina oficială) ›" has `target="_blank"` and `rel="noopener noreferrer"`; with `skateDown` both pages show "Rezultatele nu sunt disponibile acum."; stale mock shows "Rezultatele pot fi mai vechi. Actualizate <d mmm>."; Ana's account opening `/<anaId>/concursuri` shows the 404 page and has no "Concursuri" menu item; no other skater's name from the mock's event appears in any page text; every check of the list and the detail runs at 390 and 1280, with the `DesktopConcursuri` and `DesktopConcursDetaliu` layouts at 1280 (the table of results does not overflow the 1200 px container; wide tables scroll inside their own box).
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-competitions.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-competitions.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Concursuri.dc.html`, `ConcursDetaliu.dc.html`, `DesktopConcursuri.dc.html` and `DesktopConcursDetaliu.dc.html`; selects are native `select` styled square (no tabs).
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): sportiv competitions list and detail"`

### Task 12: Abonament și plăți (high, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/plati/page.tsx`, `_parts/{LeftCard,TicketSheet,TicketGrid,PaymentsList,DocumentRow}.tsx`
- Test: `tests/e2e/sportiv-money.spec.ts`

- [ ] **Step 1: Failing e2e.** "Abonament și plăți", "Ana Ionescu"; "Rămas de plată" "150 RON", line "Lecție 12 noi", "Plata se face la club."; mock with nothing left "Nimic de plată." and no "Plata se face" line; mock with advance "Avans: 40 RON"; abonament card "A-0124", "Școala noiembrie, 1 noi - 30 noi", "Ședința 5 din 8", "Vezi zilele ›" opens the sheet: 8 boxes, 4 navy with dates, one outlined "următoarea", 3 light, "Valabil până la 30 noi, 4 rămase", the note "Data se poate prelungi dacă școala are un weekend liber.", heading "Alte abonamente" with "Școala octombrie, 8/8, valabil până la 31 oct"; "Plăți" rows "Abonament noiembrie" "2 noi, numerar" "320 RON"; no "anulată", no recorder name; "Fișa de înscriere 2026-2027", "PDF", "Descarcă" linking to `/api/portal/sportiv/athletes/<id>/documents/acord` (download, `application/pdf`); mock without a document hides that block; no button or link labeled "Plătește"; the same checks at 390 and 1280, with the `DesktopPlati` layout at 1280.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-money.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Plati.dc.html`, `DesktopPlati.dc.html` and the "Grilă curată" ticket of `docs/portal/mockups/screens/ticket-options-v2.html` (option A).
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) tests/e2e && git commit -m "feat(portal): sportiv abonament, payments and registration PDF"`

### Task 13: Setări and Date sportiv (low, Sonnet)

**Files:**
- Create: `(app)/setari/page.tsx`, `setari/sportiv/[athleteId]/page.tsx`, `setari/parola/page.tsx`, `setari/dispozitive/page.tsx` (shared device list with `theme="sportiv"`)
- Test: `tests/e2e/sportiv-settings.spec.ts`

- [ ] **Step 1: Failing e2e.** No floating menu; "‹ Înapoi"; "Setări", "Cont: maria.ionescu@example.invalid"; "Contul meu" rows "Nume" (sheet, saving sends `{ name, phone }` and shows "Salvat."), "E-mail" with "îl schimbă clubul" and no input, "Telefon"; "Sportivi" rows "Ana Ionescu", "Intermediari Bronze, 9 ani", "Școala" opening "Date sportiv" with "Nume", "Data nașterii", "Vârsta", "Persoană de contact", "Telefon", "E-mail", "Le schimbă clubul.", "Deschide panoul"; "Securitate": "Parolă" "schimbată acum 3 luni", "Dispozitive" "2 dispozitive conectate"; no "2FA" text with `NEXT_PUBLIC_PORTAL_2FA` unset; "Notificări": "E-mail la schimbări de program" "pornit", toggling sends `{ schedule: false }` and shows "oprit"; "E-mail la dispozitiv nou" "mereu pornit" with no switch; "Ieșire" lands on `/login`; the same checks at 390 and 1280, with the `DesktopSetari` layout at 1280 (at 1280 the sidebar is present, so the "No floating menu" check applies to the phone width only).
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-settings.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Setari.dc.html` and `DesktopSetari.dc.html`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) tests/e2e && git commit -m "feat(portal): sportiv settings and athlete data"`

### Task 14: Full checks, boot check and click-through (low, Sonnet)

**Files:**
- Create: `scripts/portal/clickthrough-sportiv.mjs` (Playwright), `docs/portal/mockups/screens/phase7-renders/index.html` (companion screen, `docs/portal/mockups/companion-light.html` prepended), `docs/portal/mockups/screens/phase7-renders/*-{390,1280}.png`
- Modify: `docs/portal/DECISIONS.md` (append the plan rulings of the index under a dated heading; in this task's worktree the file has no other pending edits)

- [ ] **Step 1: Full suites** in a background worktree: `npm run test:scripts`, `npm run test:e2e`, `npm run test:visual`, `npm run test:a11y`. Expected: PASS; a visual diff on a coach screen is a regression, not a rebaseline (memory rule).
- [ ] **Step 2: Boot check.** Throwaway Postgres `es74-pg` on 127.0.0.1:55468; Strapi from the backend `feat/athletes` (7-1 to 7-3 merged) on 1388 with the backend index env, fixtures 4 to 7, the fake skate-results of backend 7-3 on 18893; Next on 3218 with `PORTAL_HOST_SPORTIV=sportiv.localhost:3218`, `PORTAL_HOST_ANTRENOR=antrenor.localhost:3218`, Strapi URL `http://127.0.0.1:1388`, the same BFF secret. Expected: `curl -H 'Host: sportiv.localhost:3218' http://127.0.0.1:3218/robots.txt` prints "Disallow: /".
- [ ] **Step 3: Click-through** `node scripts/portal/clickthrough-sportiv.mjs http://sportiv.localhost:3218`: log in as `parinte1@example.invalid` and `sportiv18@example.invalid`; screenshot each of the screens below twice, at 390 x 844 (`<nn>-<screen>-390.png`) and at 1280 x 800 (`<nn>-<screen>-1280.png`); the 1280 shots show the sidebar shell. Screens: login, login error, reset, invite, picker, account menu, Acasă (Ana), Acasă (Ioana), promotion (fixture flips Ana's main group), Istoric, Istoric page 2, Calendar, Calendar day, Parcurs, badge zoom, Concursuri, Concursuri filtered, competition detail, competitions down (fake down, snapshots cleared), Abonament și plăți, ticket sheet, Setări, Date sportiv, Dispozitive. Compare each shot against its design board (phone boards at 390, `Desktop*.dc.html` at 1280) side by side in the companion page; screens with no desktop board (login, reset, invite, picker, account menu, promotion) are compared at 1280 against their phone board centred.
- [ ] **Step 4: Clean up** Next, Strapi, the fake, `docker rm -f es74-pg`.
- [ ] **Step 5: Commit** `git add docs/portal/mockups/screens/phase7-renders scripts/portal/clickthrough-sportiv.mjs docs/portal/DECISIONS.md && git commit -m "docs(portal): phase 7 sportiv renders and plan rulings"`
