# Coach "Antrenament nou", Program Tab and Lesson Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The approved 2026-11-10 canvas on `antrenor.`, phone and desktop: Azi's "+ Lecție individuală" becomes "+ Adaugă antrenament" opening "Antrenament nou" (Grup or Individual, once or repeating, days, Ora, Durată, Din data, Până la, Antrenor for an individual lesson, a summary line, "Adaugă antrenamentul"); the Grupă Program tab redesigned (rule rows per weekday with "Schimbă" and "Șterge", "+ Adaugă program" opening the same form with the group preset, the public switch with its hint, "Următoarele date" as a list or a month with date blocks and end blocks); the single-date sheet (Anulează with a note, Mută, Șterge), the "Schimbă programul" and "Șterge programul" sheets; the lesson page (details, Prezent, Salvează prezența, Modifică lecția through the same form, Șterge lecția with a confirm).

**Architecture:** One client component `TrainingForm` (`src/app/(antrenor)/antrenor/(app)/antrenament/TrainingForm.tsx`) with a pure state module (`src/lib/portal/training-form.ts`: value, readiness, request bodies, summary text) used in three modes: new (`/antrenament/nou`), new with a group preset (`/antrenament/nou?grupa=<id>`, from "+ Adaugă program"), and edit of a lesson (`/lectie/<id>/modifica`). The Program tab keeps `ProgramTab.tsx` as the loader and swaps its parts for kit-built rows and three sheets. Pages stay client components loading through `usePortal` and `portalApi`, composed only from `src/app/_portal/ui/` parts and portal tokens. New backend routes are reached through the BFF allowlist (`src/lib/portal/coach-routes.ts`) and mocked in `tests/e2e/mock-portal.mjs`.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, Tailwind 4, Playwright, Node `--test`.

**Design (binding):** `docs/portal/mockups/screens/coach-canvas-v1/`: `AntrenorAdauga.dc.html`, `AntrenorAdaugaIndividual.dc.html`, `AntrenorDesktopAdauga.dc.html`, `AntrenorDesktopAdaugaIndividual.dc.html`, `AntrenorGrupaProgram.dc.html` (+ Desktop), `AntrenorProgramData.dc.html`, `AntrenorProgramSchimba.dc.html`, `AntrenorProgramSterge.dc.html` (+ Desktop each), `AntrenorLectieDetaliu.dc.html` (+ Desktop), screenshots `s_<board>.png`. Markup and copy in `gen_coach.py` from the line `# ---------- antrenament nou, program, o dată, lecție ----------` (`days`, `summary`, `add_form`, `rules_card`, `DATES`, `dates_card`, `dsheet`, `csheet`, `ssheet`, `lesson_detail`); grep boards, never read one whole. Decisions: `docs/portal/DECISIONS.md`, entry "2026-11-10 (user)". Canvas spec `docs/superpowers/specs/2026-11-09-portal-canvas-design.md`.

**Backend contracts (binding):** `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/training-add/docs/superpowers/plans/2026-11-10-coach-training-add.md`, section "HTTP contracts" (branch `feat/training-add`). Its "Open questions for the user" are shared with this plan; the defaults are built here as listed below.

**Base:** `feat/coach-screens` (96a091e or later). The controller cuts one worktree per task from `feat/coach-screens` and merges back. Every task builds against the mock; the click-through in Task 9 needs the backend plan merged on `feat/training-add`. Ledger `/Users/codrin/Documents/Programming/edusport_frontend/.superpowers/sdd/2026-11-10-coach-training/progress.md`.

| Task | Risk | Model | Review |
|---|---|---|---|
| 1 Types, BFF allowlist, copy, format, mock | high (BFF allowlist) | Sonnet | batch A |
| 2 Kit parts: day squares, choice row, summary band | low | Haiku | |
| 3 Form state module and `TrainingForm` | low | Sonnet | |
| 4 "Antrenament nou" page, Azi button, old lesson route | low | Sonnet | |
| 5 Program tab redesign | low | Sonnet | |
| 6 Date, Schimbă and Șterge programul sheets | high (program writes) | Sonnet | batch A |
| 7 Lesson page, Modifică lecția, Șterge lecția | high (deletes lessons) | Sonnet | batch A |
| 8 Calendar and Istoric links | low | Haiku | |
| 9 Cleanup, look sweep, screenshots, click-through | low | Sonnet | final review |

Order: Task 1 first. Tasks 2 and 1 can run together; Task 3 needs 1 and 2; Tasks 4, 5, 7 need 3; Task 6 needs 5; Task 8 needs 1; Task 9 needs all.

## Global Constraints

- Everything in `2026-11-09-portal-theme-kit.md` and `2026-11-09-coach-canvas-screens.md` "Global Constraints": repo, commits (plain messages, no attribution), per-task checks only `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens` and the task's own tests (the full suite runs once, in Task 9, in a background worktree), public site untouched, no site branching, tokens only, synthetic data, one e2e run at a time.
- Build from the kit. A screen file may not contain a hex value, an arbitrary pixel value, `text-label`, `text-title`, `border-retro` or `shadow-retro-sm`; a size the kit lacks becomes a token in `src/styles/portal-theme.css` with a `/* layout */` comment in the same task. New shared parts go in `src/app/_portal/ui/` (Task 2), nowhere else.
- Shapes: no pill, no circle, no rounded corner except the named exceptions (bottom nav and its active item, `[data-date-block]` date and place blocks 6px, `[data-spinner]`); the day squares, choice indicators and checkboxes are square. No dashed or dotted line. No red text except the top word of a date block (`[data-date-word]`, `rgb(190, 51, 48)`).
- Copy: exact strings below, added to `src/lib/portal/copy.ts` under the named object; Romanian, straight quotes, no em or en dash, no middle dot, no filler. A string that already exists with the same text is reused. Every rename is listed as old -> new in the ledger and in the task's commit body.
- Every e2e file of this plan runs inside `test.describe` over `{ width: 390, height: 844 }` and `{ width: 1280, height: 900 }`, `timezoneId: "Europe/Bucharest"`, the mock's frozen today Thursday `2026-11-05` (browser clock `12:00Z`, `portal-helpers.ts`), exactly one `h1`, and saves `<screen>-390.png` and `<screen>-1280.png` for Task 9.
- Every screen keeps its loading `Spinner` and the `LoadError` line with "Încearcă din nou". An old assertion that encodes the old look is replaced by the canvas assertion of the same task; list each replaced assertion in the ledger.
- Mock parity: the mock answers exactly the backend contract shapes (field names, refusal messages, status codes). Defaults of the backend plan's open questions are mocked as built: program writes on own Club groups only (`gavansati`); `gprimii` (own Școala) shows the Program tab read only with `PROGRAM.schoolLocked`.
- Fixture additions in `tests/e2e/portal-fixtures.mjs`: a lesson series `sl-ana` (Ana Stoica `aana`, weekly Tue, 17:00, 60 min, from `2026-11-10` to `2027-06-30`, coach `tm-andrei`) with materialised planned lessons `lser1` `2026-11-10`, `lser2` `2026-11-17`, `lser3` `2026-11-24`; rules of `gavansati` from its event `evavansati`: Tue and Wed 18:15, 60 min, weekly, from `2026-10-01` to `2027-05-31` (season end, `untilSeasonEnd: true`); a moved date on `gavansati`: Tue `2026-11-17` moved to Thu `2026-11-19` 18:15 (`status: "override"`, `originalDate: "2026-11-17"`); the existing cancelled `2026-11-11`.

## Review Focus

- **One form, three modes**: new, preset group (Grup selected, the group chosen, back to the group) and edit (Individual only, Sportiv fixed, prefilled from `CoachLesson` and its `series`). The same component, no copy of it. Pinned by Tasks 3, 4, 7.
- **Wrong body for the mode**: a group "Nu se repetă" posts `{ repeat: false, date, startTime, durationMin }` to `POST /groups/:id/program`; a repeating group posts `{ repeat: true, freq, days, startTime, durationMin, from, until }` (`until: null` for "Sfârșitul sezonului", `weekOfMonth` only for Lunar); an individual posts `POST /lessons` with `repeat` or without it. Pinned by Task 3 (node tests on the bodies) and Task 4 (request bodies captured in e2e).
- **"Șterge" on one date vs the program**: the date sheet's "Șterge" sends `mode: "remove"` for a series date and `DELETE /program/:eventId` for a one-off class; "Șterge programul" sends `POST /program/:eventId/end` with `day`. A 409 shows its message in the sheet and keeps it open. Pinned by Task 6.
- **Scope on a repeating lesson**: "Modifică lecția" and "Șterge lecția" on a series lesson ask "Doar această lecție" or "Și lecțiile următoare" and send `scope`; a plain lesson never asks. Pinned by Task 7.
- **Public site untouched**: no file under `src/app/(site)` or the site components changes; `public-style-guard.spec.ts` and `program.spec.ts` stay green. Pinned by Task 9.

## Copy (exact strings)

- `AZI.addLesson: "+ Lecție individuală"` -> `AZI.addTraining: "+ Adaugă antrenament"` (rename; every use moves).
- New `TRAINING = { title: "Antrenament nou", editTitle: "Modifică lecția", group: "Grup", individual: "Individual", groupField: "Grupa", athlete: "Sportiv", repeat: "Se repetă", once: "Nu se repetă", weekly: "Săptămânal", biweekly: "La 2 săptămâni", monthly: "Lunar", days: "Zile", date: "Data", time: "Ora", duration: "Durată", from: "Din data", until: "Până la", seasonEnd: "Sfârșitul sezonului", untilDate: "Alege data", untilDateField: "Data de sfârșit", coach: "Antrenor", submit: "Adaugă antrenamentul", save: "Salvează", scopeTitle: "Ce schimbi?", scopeDeleteTitle: "Ce ștergi?", scopeOne: "Doar această lecție", scopeFollowing: "Și lecțiile următoare", noGroup: "Nu ai o grupă de club." }` and the summary builders below.
- Summary (`trainingSummary` in `training-form.ts`, sentence case, weekday and month names lowercase inside):
  - once: `"<Weekday>, <d> <luna>, <HH:mm>, o singură dată."` -> "Miercuri, 12 noiembrie, 18:30, o singură dată." (board text, no duration)
  - weekly: `"<Zile spuse>, <HH:mm>, <n> min, din <d> <luna> până la sfârșitul sezonului."` -> "Marți și joi, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului."; with a date: "... din 11 noiembrie până pe 31 martie."
  - biweekly: `"La 2 săptămâni, <zile>, ..."` -> "La 2 săptămâni, marți și joi, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului."
  - monthly: `"Lunar, în <a doua> săptămână, <zile>, ..."` -> "Lunar, în a doua săptămână, miercuri, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului." (week words "prima", "a doua", "a treia", "a patra", "ultima"; see Open questions 2)
  - three days: "Luni, miercuri și vineri, ...". Not ready (no day, no time): no summary band.
- `PROGRAM` additions: `weeklyHeading: "Program săptămânal"`, `nextHeading: "Următoarele date"`, `ruleTitle: (weekday: string, time: string) => \`${weekday}, ${time}\`` ("Marți, 17:30"), `ruleSub: (min: number, freq: string, from: string, until: string | null) => until ? \`${min} min, ${freq}, din ${from}, până pe ${until}\` : \`${min} min, ${freq}, din ${from}\`` ("60 min, săptămânal, din 1 septembrie"; `freq` words "săptămânal", "la 2 săptămâni", "lunar"), `publicLabel: "Arată programul pe site"`, `movedFromSub: (when: string) => \`mutată din ${when}\`` ("mutată din joi, 20 noiembrie"), `moved: "Mutată"`, `dateOnly: "Schimbi doar această dată. Programul săptămânal rămâne."`, `cancelSub: "Părinții văd data anulată și nota."`, `moveSub: "Alegi altă zi sau oră pentru această dată."`, `remove: "Șterge"`, `removeSub: "Data dispare din program, fără notă."`, `giveUp: "Renunță"`, `changeSub: (rule: string) => \`${rule}. Datele de dinainte rămân cum au fost.\``, `endTitle: (weekday: string) => \`Ștergi programul de ${weekday}?\`` ("Ștergi programul de marți?"), `endText: "Ședințele și prezențele de până atunci rămân. După data aleasă nu mai apare."`, `toasts.dateRemoved: (day: string) => \`Ședința din ${day} a fost ștearsă.\``.
- `PROGRAM.publicHint: "Programul apare în calendarul de pe site."` -> `"Programul este public, îl vede oricine pe site."` (user 2026-11-10); `PROGRAM.publicTitle: "Program public"` -> `PROGRAM.publicLabel: "Arată programul pe site"` (rename, board text).
- `LESSON` additions: `repeat: "Se repetă"`, `no: "Nu"`, `edit: "Modifică lecția"`, `when: (time: string, min: number) => \`${time}, ${min} min\`` ("18:30, 45 min"), `seriesText: (freq: string, days: string, until: string | null) => until ? \`${freq}, ${days}, până pe ${until}\` : \`${freq}, ${days}, până la sfârșitul sezonului\`` ("Săptămânal, marți, până la sfârșitul sezonului"), `deletedMany: "Lecții șterse."` (backend toast, shown as sent).
- Decided by Claude (low impact, logged in Task 9): `TRAINING.editTitle`, `untilDate`, `untilDateField`, `scope*`, `noGroup`, `LESSON.seriesText`, the monthly summary wording, Mută's fields in the date sheet.

---

### Task 1: Types, BFF allowlist, copy, format, mock (high, Sonnet)

**Files:**
- Modify: `src/lib/portal/api-types.ts` (backend contract types verbatim; header names the backend plan), `src/lib/portal/coach-routes.ts`, `src/lib/portal/copy.ts`, `src/lib/portal/format.ts`, `tests/e2e/mock-portal.mjs`, `tests/e2e/portal-fixtures.mjs`
- Test: `scripts/portal/coach-routes.test.mjs`, `scripts/portal/format.test.mjs`, `scripts/portal/copy.test.mjs` (extend each)

**Interfaces:**
- `ROUTES` gains `["PUT", \`/lessons/${ID}/plan\`]`; `QUERY` gains `[new RegExp(\`^/lessons/${ID}$\`), ["scope"]]`.
- `format.ts` gains:

```ts
export function weekdayLong(date: string): string;        // "marți" (lowercase)
export function weekdayOfDay(day: DayKey): string;        // "tue" -> "marți"
export function daysSpoken(days: DayKey[]): string;       // ["tue","thu"] -> "marți și joi"; three -> "luni, miercuri și vineri"; Monday first
export function dayMonthLong(date: string): string;       // "2026-11-11" -> "11 noiembrie"
export function weekOfMonthOf(date: string): WeekOfMonth; // day 1-7 "first", 8-14 "second", 15-21 "third", 22-28 "fourth", 29-31 "last"
export const capitalize: (s: string) => string;
```

- Mock routes (contract shapes, refusals with the backend texts): `GET /groups/:id/program` adds `rules` (one per weekday of the fixture series, `nextDate` the next class date from today) and the moved and cancelled occurrences; `POST /groups/:id/program` accepts `until` (400 "Cerere invalidă." when before `from`, after `2027-05-31` or not ISO); `PUT /program/:eventId` and `POST /program/:eventId/end` accept `day` (400 when not one of the event's days; on success the mock updates `rules`: an end removes that day's rule, a change replaces its time and duration); `PUT /program/:eventId/dates/:date` accepts `mode: "remove"` (409 "Data are prezența salvată. Poți doar să o anulezi." when `world.saved` has a session of the group on that date; else the date leaves the occurrences, answer `{ mode: "remove", date, emails: 0 }`); `POST /lessons` with `repeat` (materialises weekly, biweekly or monthly dates up to `until` or `2027-05-31` into `world.lessons` with a `seriesId`; 409 "Sportivul are deja o lecție pe <ziua, d mmm>, la <HH:mm>." when an existing lesson of the athlete meets a date and time; answers `{ lessonId, seriesId, count, toast: "Salvat." }`; without `repeat` `{ lessonId, seriesId: null, count: 1, toast }`); `GET /lessons/:id` adds `series` and `planEditable`; `PUT /lessons/:id/plan` (404 not mine, 409 "Datele s-au schimbat. Reîncarcă pagina." (`PRESENCE_ERRORS.stale`) when saved or past, `following` deletes the series rows from the lesson's date and writes the new ones); `DELETE /lessons/:id?scope=` (`following` deletes the series rows from that date, answers `{ deleted: true, count, toast }` with "Lecții șterse." when count > 1, else "Lecție ștearsă."; `scope=x` 400). A `world.requests` array records the last body per route for e2e assertions (test only).

- [ ] **Step 1: Failing tests.** `coach-routes.test.mjs`: `allowedCoachRoute("PUT", "/lessons/lser1/plan")` true, `("POST", "/lessons/lser1/plan")` false, `("PUT", "/lessons/../plan")` false; `forwardedQuery("/lessons/lser1", "scope=following&x=1")` = `"?scope=following"`. `format.test.mjs`: `weekdayLong("2026-11-10")` "marți", `daysSpoken(["thu","tue"])` "marți și joi", `daysSpoken(["mon","wed","fri"])` "luni, miercuri și vineri", `dayMonthLong("2026-11-11")` "11 noiembrie", `weekOfMonthOf("2026-11-11")` "second", `weekOfMonthOf("2026-11-29")` "last", `capitalize("marți")` "Marți". `copy.test.mjs`: no string in `TRAINING`, `PROGRAM`, `LESSON`, `AZI` contains U+2014, U+2013, U+00B7, U+201E or a curly quote (U+201C, U+201D, U+2018, U+2019); `AZI.addTraining` is "+ Adaugă antrenament"; `PROGRAM.publicHint` is "Programul este public, îl vede oricine pe site.".
- [ ] **Step 2: Run** `node --test scripts/portal/coach-routes.test.mjs scripts/portal/format.test.mjs scripts/portal/copy.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** types, routes, copy, format and mock. Backend texts live in `edusport_backend/.claude/worktrees/training-add/src/club/presence/copy/core.ts` and `src/club/groups/copy/`; copy them exactly.
- [ ] **Step 4: Run** the same command, `npx tsc --noEmit`, `npm run test:e2e -- tests/e2e/portal-proxy.spec.ts`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): training add types, copy, routes and mock"`

### Task 2: Kit parts: day squares, choice row, summary band (low, Haiku)

**Files:**
- Create: `src/app/_portal/ui/DaySquares.tsx`, `src/app/_portal/ui/ChoiceRow.tsx`, `src/app/_portal/ui/SummaryBand.tsx`
- Modify: `src/styles/portal-theme.css` (tokens if needed), the kit preview page used by `portal-kit.spec.ts`
- Test: `tests/e2e/portal-kit.spec.ts` (extend)

**Interfaces:**

```tsx
/** "Zile": seven square checkboxes Lu..Du in a 7-column grid (gen_coach.py `days`). */
export function DaySquares({ value, onChange, label }: { value: DayKey[]; onChange: (v: DayKey[]) => void; label: string }): JSX.Element;
/** A selectable row with a square indicator, a bold label and a muted line (gen_coach.py `choice`); role="radio". */
export function ChoiceRow({ label, sub, checked, onSelect, children }: { label: string; sub: string; checked: boolean; onSelect: () => void; children?: React.ReactNode }): JSX.Element;
/** The ice-light summary line above the submit button (gen_coach.py `summary`). */
export function SummaryBand({ children }: { children: string }): JSX.Element;
```

- [ ] **Step 1: Failing e2e** on the kit preview: `DaySquares` has 7 `role="checkbox"` items "Lu" to "Du", each 44px high, `border-radius` `0px`; a checked one `background-color` `rgb(14, 26, 60)`, `color` `rgb(255, 255, 255)`, `border-width` `2px`; an unchecked one `background-color` `rgb(255, 255, 255)`, `border-color` `rgb(185, 198, 218)`, `border-width` `1px`; Space and click toggle `aria-checked`; `ChoiceRow` min-height 60px, the indicator 20px square (`border-radius` `0px`), checked row border 2px navy, the group arrow keys move the selection (`role="radiogroup"` on the wrapper the caller gives); `SummaryBand` `background-color` `rgb(225, 236, 251)`, `font-weight` `600`, `font-size` `14px`.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-kit.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** with tokens only.
- [ ] **Step 4: Run** the same command and `npm run check:tokens`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/_portal/ui src/styles tests/e2e && git commit -m "feat(portal): day squares, choice row and summary band in the kit"`

### Task 3: Form state module and `TrainingForm` (low, Sonnet)

**Files:**
- Create: `src/lib/portal/training-form.ts`, `src/app/(antrenor)/antrenor/(app)/antrenament/TrainingForm.tsx`
- Test: `scripts/portal/training-form.test.mjs`

**Interfaces:**

```ts
export type TrainingKind = "grup" | "individual";
export type RepeatChoice = "none" | "weekly" | "biweekly" | "monthly";
export type TrainingValue = {
  kind: TrainingKind; groupId: string | null; athlete: { athleteId: string; name: string } | null;
  repeat: RepeatChoice; days: DayKey[]; date: string; startTime: string; durationMin: number;
  from: string; until: string | null; coachIds: string[];
};
export type TrainingMode = { kind: "new" } | { kind: "preset"; groupId: string } | { kind: "edit"; lesson: CoachLesson };
export function initialValue(mode: TrainingMode, today: string, me: string): TrainingValue; // new: grup, weekly, from today, 60 min; edit: from the lesson and its series
export function ready(v: TrainingValue): boolean;
export function groupBody(v: TrainingValue): ProgramAddBody;                     // POST /groups/:id/program
export function lessonBody(v: TrainingValue): CoachLessonBody;                   // POST /lessons
export function planBody(v: TrainingValue, scope: "one" | "following"): CoachLessonPlanBody; // PUT /lessons/:id/plan
export function trainingSummary(v: TrainingValue): string | null;
```

  Layout from `add_form`: `Segmented` "Grup" / "Individual" (hidden in edit mode); "Grupa" select (own Club groups from `GET /groups` `mine` with `kind: "club"`; none -> the Grup tab is hidden and Individual is selected) or "Sportiv" (the existing athlete search; read only in edit mode); for "Nu se repetă": "Data" and "Ora" side by side, "Durată", then "Se repetă"; for a repeat: "Se repetă", `DaySquares`, "Ora" and "Durată" side by side, "Din data" and "Până la" side by side ("Până la" select "Sfârșitul sezonului" / "Alege data"; "Alege data" shows "Data de sfârșit" below); for Individual also "Antrenor" (the existing `CoachPicker`: the coach first and fixed, others added; Open questions 5); `SummaryBand` with `trainingSummary`; full-width primary button (`TRAINING.submit`, or `TRAINING.save` in edit mode). Durations 15 to 240 step 5 (`DurationPicker`). The default day for a new repeat is the weekday of "Din data".

- [ ] **Step 1: Failing node tests:** `trainingSummary` gives the five example texts of the Copy section exactly; `groupBody` for weekly Tue, Thu 17:30, 60, from `2026-11-11`, until null -> `{ repeat: true, freq: "weekly", days: ["tue","thu"], startTime: "17:30", durationMin: 60, from: "2026-11-11", until: null }` (no `weekOfMonth`); monthly from `2026-11-11` adds `weekOfMonth: "second"`; once -> `{ repeat: false, date, startTime, durationMin }`; `lessonBody` once -> `{ athleteId, date, startTime, durationMin, coachIds }` with no `repeat` key; weekly -> `repeat: { freq: "weekly", days, until }` and `date` = from; `planBody(v, "following")` carries `scope: "following"` and `repeat: null` for once; `ready` false without a time, without a day on a repeat, with `until` before `from`, or without a group or athlete; `initialValue` edit of `lser2` -> individual, weekly, `days: ["tue"]`, `from: "2026-11-17"`, `until: null`.
- [ ] **Step 2: Run** `node --test scripts/portal/training-form.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** the module and the component (the component is exercised by Task 4's e2e).
- [ ] **Step 4: Run** the same command and `npx tsc --noEmit`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal src/app/\(antrenor\) scripts/portal && git commit -m "feat(portal): one training form for groups and lessons"`

### Task 4: "Antrenament nou" page, Azi button, old lesson route (low, Sonnet)

**Files:**
- Create: `src/app/(antrenor)/antrenor/(app)/antrenament/nou/page.tsx`
- Modify: `src/app/(antrenor)/antrenor/(app)/page.tsx` (Azi button), `src/app/(antrenor)/antrenor/(app)/lectie/noua/page.tsx` (becomes a client redirect to `/antrenament/nou?tip=individual`)
- Test: `tests/e2e/portal-training-add.spec.ts` (new), `tests/e2e/portal-azi-grupe.spec.ts`, `tests/e2e/portal-lessons.spec.ts` (old new-lesson assertions moved here)

**Interfaces:** `PageHeader` with back "‹ Azi" to `/` (or "‹ <group name>" to `/grupe/<id>?tab=program` with `?grupa=`), h1 "Antrenament nou"; phone: the form; desktop: the form in a `PortalCard` `pad` 24px, `max-width` 560px (token). After a group write: toast from the answer (`PROGRAM.toasts.programAdded` or `classAdded(dayMonth)`), go to `/grupe/<id>?tab=program`. After a lesson write: toast "Salvat.", go to `/lectie/<lessonId>`. A refusal shows its message in an `AlertLine` above the button and keeps the values.

- [ ] **Step 1: Failing e2e:** Azi shows "+ Adaugă antrenament" (phone: full width under the today card; desktop: in the top band) linking to `/antrenament/nou`, and no "+ Lecție individuală"; `/antrenament/nou` h1 "Antrenament nou", segmented "Grup" pressed and "Individual"; "Grupa" lists "Avansați" only (not "Primii Pași"); "Se repetă" shows "Săptămânal"; tick "Ma" and "Jo", Ora "17:30", Durată "60 min", Din data `2026-11-11` -> the band reads "Marți și joi, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului."; "Până la" "Alege data" and `2027-03-31` -> "... până pe 31 martie."; "Adaugă antrenamentul" posts the body of Task 3 (from `world.requests`) and lands on `/grupe/gavansati?tab=program` with the toast; "Nu se repetă" with Data `2026-11-12`, Ora "18:30" -> band "Joi, 12 noiembrie, 18:30, o singură dată." and the body `repeat: false`; "Individual": "Sportiv" search "Ana" picks Ana Stoica, "Antrenor" shows "Andrei Popa (tu)", "Nu se repetă" `2026-11-12` 18:30, 45 min -> lands on `/lectie/<id>`; a weekly Tue 17:00 series for Ana from `2026-11-10` -> 409 text "Sportivul are deja o lecție pe marți, 10 nov, la 17:00." in the alert and the form keeps its values; `/antrenament/nou?grupa=gavansati` -> Grup selected, "Avansați" chosen, back "‹ Avansați"; `/lectie/noua` redirects to `/antrenament/nou?tip=individual` with Individual selected; at 390 "Data" and "Ora" share a `y`, "Din data" and "Până la" share a `y`; at 1280 the card is 560px wide at most; the day squares and the button are square (`border-radius` `0px`).
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-training-add.spec.ts tests/e2e/portal-azi-grupe.spec.ts tests/e2e/portal-lessons.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): Antrenament nou replaces the lesson form on Azi"`

### Task 5: Program tab redesign (low, Sonnet)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/grupe/[id]/_program/{ProgramTab,ProgramList,ProgramMonth,DateRow,PublicSwitch}.tsx`; create `_program/RulesCard.tsx`
- Test: `tests/e2e/portal-program-read.spec.ts` (rewritten to the board)

**Interfaces:** from `prog_body` and the desktop board: `Segmented` "Sportivi (9)" / "Program" (pressed); `Section` "Program săptămânal" with one `ListCard` of `RulesCard` rows from `CoachProgram.rules` (title `PROGRAM.ruleTitle(capitalize(weekdayOfDay(day)), startTime)`, sub `PROGRAM.ruleSub(durationMin, freqWord, dayMonthLong(from), untilSeasonEnd ? null : dayMonthLong(to))`, end two `SmallButton`s "Schimbă" and "Șterge" with `aria-label` "Schimbă programul de marți" / "Șterge programul de marți"); secondary full-width "+ Adaugă program" linking to `/antrenament/nou?grupa=<id>` (desktop: also in the top band); the public switch row (`PROGRAM.publicLabel` bold, `PROGRAM.publicHint` muted, the 44px square checkbox on the right; Club own only, as today); `h2` "Următoarele date", `Segmented` "Listă" / "Lună"; Listă: the occurrences from today to the end of the next month (two month reads, merged and sorted; decided by Claude) as `ListRow`s with `DateBlock word=weekdayShort big=day`, title `ruleTitle(weekday, startTime)`, sub `AZI.minutes(durationMin)` or, for a moved date, `PROGRAM.movedFromSub(longDay(originalDate) lowercased weekday)` with the block showing the new day, and `EndBlock kind="soft"` "Anulată" or "Mutată"; a Pauză date keeps today's `PROGRAM.breakNotice`; a row opens the date sheet (Task 6) when the date is open and the group editable. Lună: the existing `ProgramMonth` with the same row look under the grid. Desktop: `Columns`, left (tabs, rules, add, public), right (dates). A Școala own group: rules read only (no buttons), `PROGRAM.schoolLocked`, no add button, no public row.

- [ ] **Step 1: Failing e2e** (mock today `2026-11-05`): `/grupe/gavansati?tab=program` has "Program săptămânal" with two rows "Marți, 18:15" sub "60 min, săptămânal, din 1 octombrie" and "Miercuri, 18:15" with the same sub, each with "Schimbă" and "Șterge" 44px high and square; "+ Adaugă program" href `/antrenament/nou?grupa=gavansati`; "Arată programul pe site" with "Programul este public, îl vede oricine pe site." and a checked checkbox; "Următoarele date" with "Listă" pressed; the first rows: "Mar" "10" "Marți, 18:15" "60 min"; "Mie" "11" with end block "Anulată" (`background-color` `rgb(225, 236, 251)`); "Joi" "19" "Joi, 18:15" sub "mutată din marți, 17 noiembrie" and end block "Mutată"; the date word of every block `rgb(190, 51, 48)` and no other red text; "Lună" shows the month grid of November; `/grupe/gprimii?tab=program` shows the rules without buttons and "Programul Școlii îl schimbă administratorul."; at 1280 the dates column is right of the rules (`x` larger) and "+ Adaugă program" is also in the top band; old assertions on "Program public" and the old list replaced (ledger).
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-program-read.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): program tab with weekly rules and next dates"`

### Task 6: Date, Schimbă and Șterge programul sheets (high, Sonnet)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/grupe/[id]/_program/{DateSheet,ChangeSheet,ProgramTab}.tsx`; create `_program/EndSheet.tsx`
- Delete: `_program/AddProgramSheet.tsx`, `_program/ProgramForm.tsx` (the add goes through Task 4; move any helper still used into `training-form.ts` first)
- Test: `tests/e2e/portal-program-write.spec.ts` (rewritten to the boards)

**Interfaces:**
- Date sheet (`dsheet`): kit `Sheet` (phone bottom, desktop centred 460px), title `capitalize(longDay(date)) + ", " + startTime` ("Joi, 13 noiembrie, 17:30" on the board), muted `PROGRAM.dateOnly`, a `radiogroup` of three `ChoiceRow`s: "Anulează" (`cancelSub`, selected by default; "Notă" field below it while selected, up to 120 characters), "Mută" (`moveSub`; while selected "Data nouă" and "Ora" side by side below it), "Șterge" (`removeSub`); "Renunță" secondary and "Salvează" primary side by side. Saves: Anulează -> `PUT /program/:eventId/dates/:date` `{ mode: "cancel", reason }` (no `notifyParents`, Open questions 6); Mută -> `{ mode: "move", newDate, newStartTime, reason: null }`; Șterge -> series date `{ mode: "remove" }`, one-off class (`oneOff: true`) `DELETE /program/:eventId`. A cancelled or moved date opens with that choice selected and its values filled, plus the existing "Ține" as a fourth choice "Se ține" (decided by Claude: the board shows an open date only; keeps the existing keep action reachable). Toasts from `PROGRAM.toasts`.
- Schimbă programul (`csheet`): title "Schimbă programul", muted `changeSub(ruleTitle)`, `DaySquares` (the row's day preselected), "Ora" and "Durată" side by side, "Se aplică din" (default the rule's `nextDate`), "Renunță" and "Schimbă". Body `PUT /program/:eventId` `{ freq, weekOfMonth (monthly only), days, startTime, durationMin, from, day }`.
- Șterge programul (`ssheet`): title `endTitle(weekdayOfDay(day))`, muted `endText`, "Din data" (default `nextDate`), "Renunță" and "Șterge programul". Body `POST /program/:eventId/end` `{ from, day }`.
- Every sheet: a refusal shows its message inside the sheet (`AlertLine`) and the sheet stays open; success closes it, toasts and reloads the tab; `useNoAccess` handles a 403 as today.

- [ ] **Step 1: Failing e2e:** tap the "Mar 10" row -> sheet "Marți, 10 noiembrie, 18:15", "Schimbi doar această dată. Programul săptămânal rămâne.", "Anulează" checked with "Notă"; type "Patinoarul este închis." and "Salvează" -> request `{ mode: "cancel", reason: "Patinoarul este închis." }` without `notifyParents`, toast "Ședința din 10 nov a fost anulată.", the row shows "Anulată"; "Mută" shows "Data nouă" and "Ora", save `2026-11-12` 18:15 -> `{ mode: "move", newDate: "2026-11-12", newStartTime: "18:15", reason: null }`; "Șterge" on a series date -> `{ mode: "remove" }` and the row is gone; "Șterge" on today's date with a saved session -> the sheet shows "Data are prezența salvată. Poți doar să o anulezi." and stays open; "Șterge" on a one-off class -> `DELETE /program/<eventId>`; "Schimbă" on "Marți, 18:15" -> "Schimbă programul", "Marți, 18:15. Datele de dinainte rămân cum au fost.", "Ma" checked, Ora "18:00", "Schimbă" -> body with `day: "tue"`, `days: ["tue"]`, `startTime: "18:00"`, then the rule reads "Marți, 18:00"; "Șterge" on "Miercuri, 18:15" -> "Ștergi programul de miercuri?", "Ședințele și prezențele de până atunci rămân. După data aleasă nu mai apare.", "Șterge programul" -> `{ from: <nextDate>, day: "wed" }` and the Wednesday rule is gone; "Renunță" closes each sheet without a request; at 1280 the sheet is centred and 460px wide; at 390 it sits at the bottom; every choice indicator square; no dashed border.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-program-write.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command and `npm run test:e2e -- tests/e2e/portal-program-read.spec.ts`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) src/lib/portal tests/e2e && git commit -m "feat(portal): date, change and end sheets of the program tab"`

### Task 7: Lesson page, Modifică lecția, Șterge lecția (high, Sonnet)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/lectie/[id]/LessonView.tsx`
- Create: `src/app/(antrenor)/antrenor/(app)/lectie/[id]/modifica/page.tsx`, `lectie/[id]/ScopeSheet.tsx`
- Test: `tests/e2e/portal-lessons.spec.ts` (lesson page part rewritten)

**Interfaces:** from `lesson_detail`: `PageHeader` back "‹ Azi", kicker "Lecție individuală", h1 athlete name; `KeyValueCard` rows "Data" (`capitalize(longDay(date))`), "Ora" (`LESSON.when(startTime, durationMin)`), "Antrenor" (names from `coachOptions`, joined with ", "), "Se repetă" ("Nu" or `LESSON.seriesText(freqWord capitalized, daysSpoken, untilSeasonEnd ? null : dayMonthLong(to))`); a `PortalCard` row "Prezent" with the 44px square checkbox; primary "Salvează prezența" (existing `PUT /lessons/:id`, disabled while `editable` is false or the date is after today, as today); secondary "Modifică lecția" to `/lectie/<id>/modifica` (shown when `planEditable`); the text link "Șterge lecția" (when `deletable`) opening a confirm `Sheet` "Ștergi lecția din <d mmm>?" (`LESSON.deleteConfirm`), "Renunță" and "Șterge lecția". On a series lesson the confirm is the `ScopeSheet` (title "Ce ștergi?", `ChoiceRow`s "Doar această lecție" / "Și lecțiile următoare", then "Șterge lecția"), sending `?scope=one|following`. `/lectie/<id>/modifica`: `TrainingForm` in edit mode, h1 "Modifică lecția", back "‹ <athlete>"; "Salvează" on a series lesson opens the `ScopeSheet` (title "Ce schimbi?") before `PUT /lessons/:id/plan`; then toast and go to `/lectie/<answer lessonId>`. Desktop: content `max-width` 520px.

- [ ] **Step 1: Failing e2e:** `/lectie/lplan` -> kicker "Lecție individuală", h1 "Ana Stoica", kv "Data" "Joi, 5 noiembrie", "Ora" "17:00, 60 min", "Antrenor" "Andrei Popa", "Se repetă" "Nu"; "Prezent" checkbox; "Salvează prezența" posts the existing body; "Modifică lecția" -> `/lectie/lplan/modifica` with h1 "Modifică lecția", no segmented, "Sportiv" "Ana Stoica" read only, Ora "17:00", Durată "60 min", "Nu se repetă"; change Ora to "17:30", "Salvează" -> `PUT /lessons/lplan/plan` with `scope: "one"` and no scope sheet; `/lectie/lser2` -> "Se repetă" "Săptămânal, marți, până la sfârșitul sezonului"; "Modifică lecția", Ora "18:00", "Salvează" -> "Ce schimbi?" with "Doar această lecție" and "Și lecțiile următoare"; choose the second -> body `scope: "following"`, `repeat: { freq: "weekly", days: ["tue"], until: null }`; "Șterge lecția" on `lser2` -> "Ce ștergi?", "Și lecțiile următoare" -> `DELETE /lessons/lser2?scope=following`, toast "Lecții șterse.", lands on `/`; on `lplan` -> "Ștergi lecția din 5 nov?" and `DELETE /lessons/lplan` with no scope; the archived lesson `larchived` keeps today's read-only behaviour and has no "Modifică lecția"; at 1280 the content is 520px wide at most.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-lessons.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): lesson page with edit and delete of one or the following"`

### Task 8: Calendar and Istoric links (low, Haiku)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/calendar/CalendarView.tsx`, `istoric/HistoryView.tsx` (links only, if they do not already point there)
- Test: `tests/e2e/portal-calendar.spec.ts`, `tests/e2e/portal-history.spec.ts` (extend)

- [ ] **Step 1: Failing e2e:** the calendar of November shows Ana Stoica on Tue 10, 17 and 24 November (series lessons of the fixture) as individual items linking to `/lectie/lser1`, `/lectie/lser2`, `/lectie/lser3`; the moved date shows on 19 November and not on 17 November for Avansați; a removed date (after a `remove` in the mock) is absent; an Istoric lesson row links to `/lectie/<id>`; no item links to `/lectie/noua`.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-calendar.spec.ts tests/e2e/portal-history.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** (the mock's calendar reads `world.lessons`, so series lessons appear once Task 1 is in).
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): calendar and history open the lesson page"`

### Task 9: Cleanup, look sweep, screenshots, click-through (low, Sonnet)

**Files:**
- Modify: `tests/e2e/portal-look-sweep.spec.ts` (add `/antrenament/nou`, `/antrenament/nou?grupa=gavansati`, `/grupe/gavansati?tab=program`, the three sheets open, `/lectie/lser2`, `/lectie/lser2/modifica`), `scripts/portal/clickthrough-coach-canvas.mjs` (training steps), `docs/portal/DECISIONS.md` (append "2026-11-10 coach training screens (decided by Claude, low impact)": the items listed under "Decided by Claude" in the Copy section, the two-month "Listă" range, "Se ține" as a fourth choice, the back link to the group from a preset form, the Grup tab hidden without a Club group)

- [ ] **Step 1: Sweep e2e** on the new screens at 390 and 1280: one `h1`; no red text outside `[data-date-word]`; `border-radius` `0px` on every element except the named exceptions; no `dashed` or `dotted` border; `body` `background-color` `rgb(246, 249, 253)`; no horizontal scroll at 390.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-look-sweep.spec.ts`. Expected: PASS (fix any screen that fails).
- [ ] **Step 3: Full checks in a background worktree:** `npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:scripts`, `npm run test:e2e` (all, includes `public-style-guard.spec.ts` and `program.spec.ts`), `npx playwright test tests/visual/pages.spec.ts` against the current baseline (0 failed; no public page snapshot changes). Record counts in the ledger; `git diff --stat feat/coach-screens -- 'src/app/(site)' src/components` is empty except shared primitives already used by the portal (list any).
- [ ] **Step 4: Screenshots:** copy each new screen's 390 and 1280 screenshot into `docs/portal/mockups/screens/coach-canvas-v1/built/` and put them beside the matching `s_Antrenor*.png` (`AntrenorAdauga`, `AntrenorAdaugaIndividual`, `AntrenorGrupaProgram`, `AntrenorProgramData`, `AntrenorProgramSchimba`, `AntrenorProgramSterge`, `AntrenorLectieDetaliu`, and the Desktop ones) in one companion screen with the light-mode overrides (`mockups/companion-light.html`) for the user's check. Do not merge before the user approves.
- [ ] **Step 5: Click-through** against a real Strapi once the backend plan is merged on `feat/training-add`: boot check as in the backend plan (`es-ta-pg` on 127.0.0.1:55473, Strapi 1393), Next on 3221 with `PORTAL_STRAPI_URL=http://127.0.0.1:1393`; the script logs in as `antrenor1@example.invalid`, adds a weekly group program with "Până la", ends one weekday, removes one date and keeps it back, adds a one-off class, adds a weekly lesson series, edits it from the second lesson on, deletes the following, and fails on any console error or non-2xx BFF answer. Never ports 1340 or 3010 or the user's containers.
- [ ] **Step 6: Commit** `git add -A src/app tests/e2e scripts/portal docs/portal && git commit -m "chore(portal): training screens sweep, screenshots and click-through"`

## Open questions for the user

Shared with the backend plan (same numbers); each has the default this plan builds.

1. **Program writes on Școala groups.** The boards show a Școala group ("Intermediari Bronze, Școala de patinaj") with "Schimbă", "Șterge" and the public switch; today only own Club groups are editable by a coach. Default: Club only; a Școala group's tab is read only with "Programul Școlii îl schimbă administratorul." and the form's group list holds own Club groups only.
2. **"Lunar".** No week-of-month control on the board. Default: the week of "Din data" is used and the summary says it ("Lunar, în a doua săptămână, miercuri, ...").
3. **Pauză dates in a lesson series.** Default: kept as planned lessons.
4. **Refusal texts.** Defaults: "Data are prezența salvată. Poți doar să o anulezi." and "Sportivul are deja o lecție pe marți, 10 nov, la 17:00.".
5. **Lesson coach.** The board has a single "Antrenor" select; a coach's lesson must include the coach. Default: the existing picker, the coach fixed first, others may be added.
6. **E-mail to parents on a cancel.** Default: no e-mail tick and no e-mail; the note shows with the date.
7. **Scope question on a repeating lesson.** Not on the boards. Default: "Ce schimbi?" / "Ce ștergi?" with "Doar această lecție" and "Și lecțiile următoare" before the request.
