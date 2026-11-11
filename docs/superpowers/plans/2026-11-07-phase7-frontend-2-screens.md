# Phase 7 Frontend 2: Sportiv Screens Implementation Plan

> **Refreshed 2026-11-11** (see the index "Refresh 2026-11-11"). The look comes from the portal theme and the kit in `src/app/_portal/ui/`; design source `docs/portal/mockups/screens/sportiv-canvas-current/`. Nothing in this plan defines its own colours, sizes or component look. Tasks renumbered: old T7 to T14 are T6 to T13.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every screen of the approved design on `sportiv.<domain>`, phone and desktop: Acasă (with the performance variant and the promotion moment), Istoric, Calendar, Parcurs with badges, Concursuri and one competition, Abonament și plăți, Setări with Date sportiv and Securitate; then the full checks, a boot check on a throwaway Postgres and a click-through of every screen.

**Architecture:** One client page per route under `src/app/(sportiv)/sportiv/(app)/[athleteId]/`, loading one backend route each through `useSportiv` (plan 1 Task 5). Presentation parts live next to their page in `_parts/` and are composed only from the kit (`src/app/_portal/ui/`) and the coach screens' patterns; pure mapping (bars, badge tiers, filters to query, calendar marks) in `src/lib/portal/sportiv-*.ts` with Node tests.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, Tailwind 4, Node `--test`, Playwright.

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/specs/2026-11-07-sportiv-app-design.md` 6.3 to 6.10, 7, 8.3 to 8.6, 9. Index: `2026-11-07-phase7-frontend-index.md`. Design boards (layout and copy): `sportiv-canvas-current/{Main,MainPerf,Promovare,Istoric,Calendar,Progres,Concursuri,ConcursDetaliu,Plati,Setari}.dc.html` and, for the desktop layout, `Desktop{Main,MainPerf,Istoric,Calendar,Progres,Concursuri,ConcursDetaliu,Plati,Setari}.dc.html` (Cont and Promovare have no desktop board: the sheet and dialog are the same centred layer). Read the board's markup for structure and copy; never infer from a screenshot (memory rule). Where a board and a later portal rule differ (list limits, date squares option B, header band, motion), the rule wins.

**Base:** `feat/sportiv` with plan 1 merged.

## Global Constraints

- The index constraints bind every task (behaviour-only tests, machine load, copy, look through the kit, desktop, lists, forms, session rows).
- Reuse the kit and the coach patterns: `PageHeader` and `PageSub`, `PageBody` with `Columns`/`Column` (main part left, short side column sticky), `ListRow` with a `DateBlock` on every row, `StatCard`, `KeyValueCard`, `SectionHeading`, `PortalCard`, `Sheet` with `popup` and the shared `SheetFooter`, `MonthPicker`, `MonthGrid`, `CalendarLegend` (Task 8 adds the mark kind `concurs` to `MonthGrid`'s `DayMarks`, tokens only), `CompetitionCard`, `PlaceBlock`, `PointsCell`, `ShowMoreButton` (`src/app/_portal/lib/show-more.tsx`), `LoadError` with "Încearcă din nou", `Spinner`.
- Every page: loading spinner, the load-failure state with retry, the phone layout and the desktop layout from the same data. e2e files run their flows at the default viewport; a flow that only exists at one width (bottom nav, sidebar) runs at that width. No layout, colour, size or screenshot assertion anywhere.
- Lists: Istoric, Plăți and Concursuri show 20 rows and "Arată mai multe" (loads the next page of 20 and appends, focus to the first new row); Acasă "Următoarele ședințe" shows 3 (spec 6.3).

## Review Focus

See the index; lines 5 and 6 are owned by Tasks 6 and 10 of this file.

---

### Task 6: Acasă and the promotion moment (low, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/page.tsx`, `_parts/{PresenceCard,UpcomingList,AbonamentCard,LastCompetitionCard,PromotionDialog}.tsx` (UpcomingList renders `SportivSessionRow`s), `src/lib/portal/sportiv-bars.ts`
- Test: `scripts/portal/sportiv-bars.test.mjs`, `tests/e2e/sportiv-home.spec.ts`

**Interfaces:**
- Consumes: `SportivHome`, `MonthBar`; kit parts; `SportivSessionRow` (plan 1 T5).
- Produces: `barRatio(count: number | null, max: number): number` (0 to 1; future and empty months 0; the bar height itself is a theme token); `PromotionDialog({ from, to, firstName, onDone })`.

- [ ] **Step 1: Failing tests.** Node: `barRatio(8, 8)` 1, `barRatio(6, 8)` 0.75, `barRatio(null, 8)` 0, `barRatio(0, 0)` 0. e2e (data and flows): Ana's Acasă shows her first name, level "Intermediari Bronze", "26" presences and six month words "sep" to "feb" from the answer; three upcoming rows, the trainer hidden until a row is opened (Enter opens it and "Alina Gheorghe" shows); the calendar link goes to `/<id>/calendar`; the abonament card shows "Ședința 5/8" and the code line when the mock has a code, no code line without; "Detalii" goes to `/<id>/plati`. Ioana: the card "Ultimul concurs" with the place, the event name and the total from the answer, "Toate" goes to `/<id>/concursuri`, a competition row's band reads "Concurs"; with `skateDown` that card says "Rezultatele nu sunt disponibile acum." and the rest of the page is present. Promotion (mock `promotion`): the dialog opens with the old and new level and focus inside it; "Mai departe" posts `promotion/seen` once and the dialog does not return after a reload; Escape does the same; with `reducedMotion: "reduce"` the new level is visible at once (the old level has `aria-hidden`).
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-bars.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-home.spec.ts --workers=1`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Main`, `MainPerf`, `Promovare` (phone) and `DesktopMain`, `DesktopMainPerf` (desktop). The promotion sequence keeps the board's order (dim, card, old level out, new level in, line) with timings from the `--motion-*` tokens and no overshoot (open question 4); everything off under reduced motion.
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): sportiv Acasă and promotion moment"`

### Task 7: Istoric (low, Haiku)

**Files:**
- Create: `(app)/[athleteId]/istoric/page.tsx`
- Test: `tests/e2e/sportiv-history.spec.ts`

- [ ] **Step 1: Failing e2e.** The summary shows total, group and individual counts from the answer; rows come newest first, each with a date block, a group row naming the group and coach, a lesson row marked "Individual"; with 26 presences 20 rows show and "Arată mai multe" loads page 2 (the mock saw `?page=2`), shows 26 rows, moves focus to row 21 and disappears; the empty mock shows "Nicio prezență în acest sezon.".
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-history.spec.ts --workers=1`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Istoric.dc.html` and `DesktopIstoric.dc.html` (the pager of the board becomes "Arată mai multe").
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app tests/e2e && git commit -m "feat(portal): sportiv presence history"`

### Task 8: Calendar and the phone calendar link (low, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/calendar/page.tsx`, `_parts/DayList.tsx` (renders `SportivSessionRow`s), `src/lib/portal/sportiv-calendar.ts`
- Modify: `src/app/_portal/ui/MonthGrid.tsx` and `CalendarLegend.tsx` (mark kind `concurs`, tokens only; coach calendar unchanged)
- Test: `scripts/portal/sportiv-calendar.test.mjs`, `tests/e2e/sportiv-calendar.spec.ts`

**Interfaces:**
- Produces: `marksOf(items: CalendarItem[]): Record<string, ("grup" | "individual" | "concurs" | "anulata")[]>` (per date, unique, that order; cancelled items give `anulata`), reusing `src/lib/portal/month-grid.ts` for the cells.

- [ ] **Step 1: Failing tests.** Node: a cancelled group item gives `["anulata"]`; a group and a lesson on one date `["grup","individual"]`; a competition `["concurs"]`. e2e: the month from the answer, "Luna trecută" and "Luna viitoare" load the neighbour month (the mock saw `?month=`) and are disabled when `prevMonth`/`nextMonth` is null; choosing day 12 lists its two rows, an "Individual" one and a group one, sorted by time; opening a row shows the trainer; a cancelled session's opened detail says "anulată"; a competition day shows a "Concurs" row; "Adaugă în calendarul telefonului" is a link to `/api/portal/sportiv/athletes/<id>/calendar.ics` and the download is named `edusport-Ana.ics`.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-calendar.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-calendar.spec.ts tests/e2e/portal-calendar.spec.ts --workers=1`. Expected: new FAIL, coach PASS.
- [ ] **Step 3: Implement** from `Calendar.dc.html` and `DesktopCalendar.dc.html`.
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): sportiv calendar and phone calendar file"`

### Task 9: Parcurs and badges (low, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/parcurs/page.tsx`, `_parts/{Badge,BadgeZoom}.tsx`, `src/lib/portal/sportiv-badges.ts`
- Modify: `src/styles/portal-theme.css` (the tier colours of spec 7 as tokens, comment "Progres board")
- Test: `scripts/portal/sportiv-badges.test.mjs`, `tests/e2e/sportiv-path.spec.ts`

**Interfaces:**
- Produces: `tierWord(t: Tier): string` ("bronz", "argint", "aur", "platină", "gheață"); `badgeAria(b: Badge): string` ("50 de antrenamente, nivel argint", "Concursuri, încă niciunul (blocat)"); tier colours come from theme tokens by tier name (`--portal-tier-<tier>-*`), not from a TS table.

- [ ] **Step 1: Failing tests.** Node: `badgeAria` and `tierWord` examples above (the aria text is behaviour for screen readers). e2e: the current level, the next level and "Până acum" rows come from the answer; a locked badge has the "blocat" aria label; tapping a badge opens a dialog listing its tiers with the reached dates or "încă nu" and the progress "63 din 100", "Închide" closes it and focus returns to the badge; each hexagon has `role="img"` and its aria label.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-badges.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-path.spec.ts --workers=1`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Progres.dc.html` and `DesktopProgres.dc.html` (shapes); the zoom uses the kit motion tokens without overshoot (open question 4).
- [ ] **Step 4: Run** the same commands and `npm run check:tokens`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app src/lib/portal src/styles scripts/portal tests/e2e && git commit -m "feat(portal): sportiv path and badges"`

### Task 10: Concursuri and one competition (high, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/concursuri/page.tsx`, `concursuri/[resultId]/page.tsx`, `src/lib/portal/sportiv-competitions.ts`
- Test: `scripts/portal/sportiv-competitions.test.mjs`, `tests/e2e/sportiv-competitions.spec.ts`

**Interfaces:**
- Produces: `competitionQuery(s: { q: string; season: string | null; sort: CompetitionSort }): string` (only these keys plus `page` when asked, empty ones left out); `readQuery(params: URLSearchParams)` (the inverse, invalid sort -> `recent`).

- [ ] **Step 1: Failing tests.** Node: round trip of `competitionQuery` and `readQuery`; `sort=evil` -> `recent`. e2e as Ioana: the category block, records and total from the answer; 20 rows and "Arată mai multe" loads `page=2` and appends; typing "brasov" (debounced 300 ms) requests `q=brasov`, shows the filtered rows and keeps the state in the URL (a reload keeps it); the season select and the order select send `season=` and `sort=`; a row opens the detail: back link to Concursuri, the place, total and segments from the answer, each segment's element table; the official link has `target="_blank"` and `rel="noopener noreferrer"` and is absent when `officialUrl` is null; with `skateDown` both pages show "Rezultatele nu sunt disponibile acum."; the `stale` mock shows "Rezultatele pot fi mai vechi. Actualizate <d mmm>."; Ana's account opening `/<anaId>/concursuri` shows the 404 page; no other skater's name from the mock's event appears in any page text; a foreign result id shows the 404 page.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-competitions.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-competitions.spec.ts --workers=1`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Concursuri.dc.html`, `ConcursDetaliu.dc.html`, `DesktopConcursuri.dc.html` and `DesktopConcursDetaliu.dc.html` with `PlaceBlock`, `PointsCell` and native selects styled by the kit (no tabs); wide tables scroll inside their own box.
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): sportiv competitions list and detail"`

### Task 11: Abonament și plăți (high, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/plati/page.tsx`, `_parts/{LeftCard,TicketSheet,TicketGrid,PaymentsList,DocumentRow}.tsx`
- Test: `tests/e2e/sportiv-money.spec.ts`

- [ ] **Step 1: Failing e2e.** "Rămas de plată" shows the amount and lines of the answer and "Plata se face la club."; the nothing-left mock shows "Nimic de plată." and no "Plata se face" line; the advance mock shows "Avans: 40 RON"; the abonament card shows the code and "Ședința 5 din 8"; "Vezi zilele" opens the ticket sheet (URL-driven popup) with 8 boxes, 4 used with their dates, 1 marked as the next one, "4 rămase", and "Alte abonamente" from `earlier`; closing it removes the flag; payment rows (each with a date block) show what, method and amount, 20 then "Arată mai multe"; no cancelled payment and no recorder name appear; "Fișa de înscriere" links to `/api/portal/sportiv/athletes/<id>/documents/acord` and the download is a PDF; the mock without a document hides that block; no button or link named "Plătește".
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-money.spec.ts --workers=1`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Plati.dc.html`, `DesktopPlati.dc.html` and the "Grilă curată" ticket of `docs/portal/mockups/screens/ticket-options-v2.html` (option A).
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app tests/e2e && git commit -m "feat(portal): sportiv abonament, payments and registration PDF"`

### Task 12: Setări, Date sportiv and Securitate (high, Sonnet)

**Files:**
- Create: `(app)/setari/page.tsx`, `setari/sportiv/[athleteId]/page.tsx`, `setari/securitate/page.tsx`
- Move (rename, coach import updated): the coach Securitate of the frontend 6b plan, `src/app/(antrenor)/antrenor/(app)/profil/securitate/{SecurityView,TwoFactorSection,BackupCodesSheet,PasskeysSection}.tsx` -> `src/app/_portal/security/`, taking `{ api: "coach/me" | "sportiv/me" }` for the device list (Securitate routes are `/api/portal/me/*` on both hosts)
- Test: `tests/e2e/sportiv-settings.spec.ts`

- [ ] **Step 1: Failing e2e.** Setări shows the account e-mail with "îl schimbă clubul" and no e-mail input; the Nume and Telefon popups send `{ name, phone }` on Salvează, show "Salvat." and change nothing on Renunță; a 400 shows the server message in the popup; "Sportivi" rows open Date sportiv with the answer's fields and "Le schimbă clubul."; "Parolă" shows "schimbată acum 3 luni" (or "nesetată" for a Google-only account) and opens the password change; "E-mail la schimbări de program" toggles and sends `{ schedule: false }`, then shows "oprit"; "E-mail la dispozitiv nou" has no switch; Securitate on the sportiv host lists the sportiv devices from `/api/portal/sportiv/me/devices`, "Deconectează" on a device sends the DELETE, and the 2FA and passkey sections call `/api/portal/me/*` (the mock saw the sportiv bearer); "Ieșire" lands on `/login`. The coach Securitate e2e of the frontend 6b plan stays green.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-settings.spec.ts --workers=1`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Setari.dc.html` and `DesktopSetari.dc.html`; Securitate has no sportiv board and uses the coach Securitate layout.
- [ ] **Step 4: Run** the same command plus the coach Securitate spec (`tests/e2e/portal-security.spec.ts`). Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app tests/e2e && git commit -m "feat(portal): sportiv settings, athlete data and Securitate"`

### Task 13: Full checks, boot check and click-through (low, Sonnet)

**Files:**
- Create: `scripts/portal/clickthrough-sportiv.mjs` (Playwright, behaviour only: each screen loads its data with no error state and the main flows work; no screenshots)
- Modify: `docs/portal/DECISIONS.md` (append the plan rulings of the index under a dated heading; in this task's worktree the file has no other pending edits)

- [ ] **Step 1: Full suites** in a background worktree, one at a time: `npm run test:scripts`, then `npm run test:e2e -- --workers=2`. Expected: PASS.
- [ ] **Step 2: Boot check.** `lsof -i :55484 -i :1414 -i :3231 -i :18895` (all free). Throwaway Postgres `es74-pg` on 127.0.0.1:55484; Strapi from the backend `feat/athletes` (7-1 to 7-3 merged) on 1414 with the backend index env (`WEBAUTHN_ORIGINS` naming `http://antrenor.localhost:3231,http://sportiv.localhost:3231`), fixtures phase 4, 5, 6, 7, the backend fake skate-results (`node scripts/fake-skate.mjs 18895`, `SKATE_RESULTS_API=http://127.0.0.1:18895`); Next on 3231 with `PORTAL_HOST_SPORTIV=sportiv.localhost:3231`, `PORTAL_HOST_ANTRENOR=antrenor.localhost:3231`, the Strapi URL `http://127.0.0.1:1414` and the same BFF secret. Expected: `curl -H 'Host: sportiv.localhost:3231' http://127.0.0.1:3231/robots.txt` prints "Disallow: /".
- [ ] **Step 3: Click-through** `node scripts/portal/clickthrough-sportiv.mjs http://sportiv.localhost:3231`: log in as `parinte1@example.invalid`, `parinte2fa@example.invalid` (TOTP from the scratch ids file) and `sportiv18@example.invalid`; walk login, 2FA step, reset, invite, picker, account menu, Acasă (Ana and Ioana), promotion (fixture flips Ana's main group), Istoric and "Arată mai multe", Calendar and a day, Parcurs and a badge, Concursuri, a filter, a competition detail, competitions down (fake down, snapshots cleared), Abonament și plăți and the ticket sheet, Setări, Date sportiv, Securitate; each step prints `PASS` on the data it expects. Then tell the user the localhost addresses so they review the look by hand against the boards (the user checks visuals; no screenshot step).
- [ ] **Step 4: Clean up** Next, Strapi, the fake, `docker rm -f es74-pg`.
- [ ] **Step 5: Commit** `git add scripts/portal/clickthrough-sportiv.mjs docs/portal/DECISIONS.md && git commit -m "chore(portal): phase 7 sportiv click-through and plan rulings"`
