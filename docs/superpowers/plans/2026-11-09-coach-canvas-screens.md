# Coach Screens on the Canvas (Plan B) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every coach screen on `antrenor.` rebuilt to the Design canvas with the plan A kit, phone and desktop: shell and nav (Azi, Grupe, Concursuri, Istoric, Profil), login, Azi, Calendar, Prezență, Lecție individuală, Grupe, Grupă, Modifică grupa with Mută and Scoate, the coach view of an athlete, Concursuri, Istoric, Profil, Setări cont and Securitate.

**Architecture:** Pages stay client components under `src/app/(antrenor)/antrenor/(app)/` loading through `usePortal` and `portalApi` (`_lib/`), now composed only from `src/app/_portal/ui/` parts and the token-carried shared components. One markup per page serves both layouts; the `portal:` variant (900 px) switches the columns, and `PortalShell` switches bottom nav and sidebar. New backend routes are reached through the BFF allowlist and mocked in `tests/e2e/mock-portal.mjs`.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, Tailwind 4, Playwright, Node `--test`.

**Spec (binding):** `docs/superpowers/specs/2026-11-09-portal-canvas-design.md`. Design: `docs/portal/mockups/screens/coach-canvas-v1/` (`gen_coach.py` holds every size, copy string and layout; the boards `Antrenor*.dc.html` and screenshots `s_*.png` show them; grep boards, never read one whole). Backend contracts: `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/plan-redesign/docs/superpowers/plans/2026-11-09-coach-portal-additions.md` ("HTTP contracts", binding). Index: `2026-11-09-portal-redesign-index.md`. Decisions: `docs/portal/DECISIONS.md`.

**Base:** `feat/portal` with plan A merged (`feat/portal-theme`). The controller cuts `feat/coach-canvas` and one worktree per task. Tasks 5, 10, 11, 12 and 13 can be built against the mock before the backend plan is merged; the click-through in Task 15 needs the backend Tasks 1 to 7. Ledger `/Users/codrin/Documents/Programming/edusport_frontend/.superpowers/sdd/2026-11-09-portal-redesign/plan-b.md`.

| Task | Risk | Model | Review |
|---|---|---|---|
| 1 Types, copy, BFF allowlist, mock | high (BFF allowlist) | Sonnet | batch A |
| 2 Shell and nav | low | Sonnet | |
| 3 Login, reset, invite | low | Haiku | |
| 4 Azi | low | Sonnet | |
| 5 Calendar | low | Sonnet | |
| 6 Prezență | low | Sonnet | |
| 7 Lecție individuală | low | Haiku | |
| 8 Grupe | low | Haiku | |
| 9 Grupă and its Program tab | low | Sonnet | |
| 10 Modifică grupa, Mută, Scoate | high (writes membership) | Sonnet | batch A |
| 11 Sportiv (coach view of an athlete) | high (contact data) | Sonnet | batch A |
| 12 Concursuri | low | Sonnet | |
| 13 Istoric | low | Haiku | |
| 14 Profil, Setări cont, Securitate | low | Haiku | |
| 15 Cleanup, full checks, screenshots, click-through | low | Sonnet | final review |

## Global Constraints

- Everything in plan A "Global Constraints" (repo, commits, per-task checks, public site untouched, no site branching, tokens only, copy rules, shapes, red text, reduced motion, synthetic data, one e2e run at a time).
- Build from the kit. A screen file may not contain a hex value, an arbitrary pixel value, `text-label`, `text-title`, `border-retro` or `shadow-retro-sm`; layout sizes the kit lacks become a token in `src/styles/portal-theme.css` with a `/* layout */` comment, added in the same task.
- Every e2e file of this plan runs its checks inside `test.describe` over `{ width: 390, height: 844 }` and `{ width: 1280, height: 900 }`, with `timezoneId: "Europe/Bucharest"` and the mock's frozen today (Thursday `2026-11-05`, browser clock `12:00Z` = 14:00 local, `portal-helpers.ts`). Text assertions hold at both widths; layout assertions per width; each describe saves a full-page screenshot to the test output (`<screen>-390.png`, `<screen>-1280.png`) for Task 15.
- Every screen keeps its loading `Spinner`, the `LoadError` line "Nu am putut încărca datele." with "Încearcă din nou", and its existing behaviour and e2e coverage (`tests/e2e/portal-*.spec.ts`). An old assertion that encodes the old look (caps label text, "De făcut", a collapsed list) is replaced by the canvas assertion of the same task; list each replaced assertion in the ledger.
- Copy: exact strings below, added to `src/lib/portal/copy.ts` under the named object. Counts through `roCount` (`src/club/ro-count` rules as in `copy.ts`: "1 copil", "13 copii", "20 de copii").
- Mock: each task extends `tests/e2e/mock-portal.mjs` and `portal-fixtures.mjs` only with what its tests need, matching the backend contract shapes exactly. Fixture additions: `asofia` in `gavansati` carries `leavesOn: "2026-11-12"`; `location: "AFI Cotroceni"` on `gavansati` and `gprimii`, `location: "Patinoar Nord"` on `gsilver` and `guscat`.

## Review Focus

- **Mută to another coach's group**: the sheet only lists own groups; a forged request answers 403 "Nu mai ai acces la această grupă." and the row stays. Pinned by Task 10.
- **Contact on a stand-in child**: no Contact section, no Sună, no WhatsApp, no copy button. Pinned by Task 11.
- **Phone link shapes**: "0722 000 222" gives `tel:+40722000222` and `https://wa.me/40722000222`. Pinned by Task 11 (`phoneLinks`).
- **One h1 per page** at both widths (the top band and the phone header are the same element). Pinned by every task (`page.locator("h1")` count 1).
- **No red text** outside `[data-date-word]` and no rounded element outside the named exceptions (bottom nav and its active item, date and place blocks, spinner), on every screen. Pinned by Task 15 (a sweep over all screens).

---

### Task 1: Types, copy, BFF allowlist, mock (high, Sonnet)

**Files:**
- Modify: `src/lib/portal/api-types.ts` (backend contract types verbatim, header comment updated with the backend plan name), `src/lib/portal/coach-routes.ts`, `src/lib/portal/copy.ts`, `src/lib/portal/format.ts`, `tests/e2e/mock-portal.mjs`, `tests/e2e/portal-fixtures.mjs`
- Test: `scripts/portal/coach-routes.test.mjs` (extend), `scripts/portal/format.test.mjs` (extend)

**Interfaces:**
- `coach-routes.ts` `ROUTES` gains `["GET", "/calendar"]`, `["POST", \`/groups/${ID}/members/${ID}/move\`]`, `["POST", \`/groups/${ID}/members/${ID}/remove\`]`, `["GET", "/competitions"]`; `QUERY` gains `[/^\/calendar$/, ["month"]]`, `[/^\/competitions$/, ["scope", "season"]]`.
- `format.ts` gains:

```ts
export function phoneLinks(phone: string): { tel: string; wa: string } | null; // "0722 000 222" -> { tel: "tel:+40722000222", wa: "https://wa.me/40722000222" }; "+40 722 000 222" the same; fewer than 10 digits -> null
export function weekdayShort(date: string): string;   // "Lun" "Mar" "Mie" "Joi" "Vin" "Sâm" "Dum"
export function monthShort(date: string): string;     // "Ian" ... "Noi" "Dec"
export function longDay(date: string): string;        // "Joi, 5 noiembrie"
export function shortWhen(date: string): string;      // "Joi, 5 noi"
export function dayMonthYear(date: string): string;   // "26 oct 2026"
export function dayMonthShort(date: string): string;  // "12 noi"
```

- Copy objects (exact strings):
  - `NAV = { today: "Azi", groups: "Grupe", competitions: "Concursuri", history: "Istoric", profile: "Profil", menu: "Meniu" }`
  - `AZI` adds: `greeting: (first: string) => \`Bună, ${first}\``, `title: "Azi"`, `todayHeading: "Antrenamente azi"`, `calendarLink: "Calendar"`, `statLabel: "antrenamente azi"`, `doneOne: "completat"`, `doneMany: "completate"`, `pastHeading: "Antrenamente fără prezență"`, `addLesson: "+ Lecție individuală"`, `groupSub: (children: string, location: string | null) => location ? \`grup, ${children}, ${location}\` : \`grup, ${children}\``, `minutes: (n: number) => \`${n} min\``, `nowLabel: (weekdayDay: string, time: string) => \`${weekdayDay}, ora ${time}\``
  - `CALENDAR = { title: "Calendar", sub: "Ședințele și lecțiile tale", prev: "Luna anterioară", next: "Luna următoare", legendGroup: "grup", legendIndividual: "individual", legendCancelled: "anulată", empty: "Nicio ședință în această zi.", grid: "Zilele lunii" }`
  - `GRUPE` adds: `mine: "Grupele mele"`, `others: "Alte grupe"`, `sub: (groups: string, children: string) => \`${groups}, ${children}\``, `coach: (names: string) => \`Antrenor: ${names}\``
  - `GROUP` adds: `program: "Program:"`, `place: "Loc:"`, `coaches: "Antrenori:"`, `doPresence: "Fă prezența"`, `edit: "Modifică grupa"`, `tabAthletes: (n: number) => \`Sportivi (${n})\``, `tabProgram: "Program"`, `alsoIn: (names: string) => \`și în ${names}\``, `isNew: "nou"`, `until: (dayMonth: string) => \`până pe ${dayMonth}\`` (user 2026-11-09)
  - `EDIT_GROUP = { title: "Modifică grupa", sub: (group: string, n: string) => \`${group}, ${n}\`, add: "+ Adaugă sportiv", done: "Gata", move: "Mută", remove: "Scoate", moveTitle: (name: string) => \`Muți pe ${name} în altă grupă\`, moveText: (group: string) => \`Prezențele de până acum rămân în ${group}.\`, newGroup: "Grupa nouă", from: "Din data", cancel: "Renunță", moveConfirm: "Mută", removeTitle: (name: string) => \`Scoți pe ${name} din grupă?\`, removeText: "Prezențele de până acum rămân. Nu mai apare la ședințele grupei.", removeConfirm: "Scoate din grupă", noOtherGroup: "Nu ai altă grupă în care să-l muți." }`
  - `CARD` adds: `parent: "Părinte"`, `copy: "Copiază numărul"`, `copied: "Numărul a fost copiat."`, `whatsapp: "WhatsApp"`, `presence: "Prezențe"`, `inSeason: "În sezon"`, `presences: (n: string) => \`${n} de prezențe\`` (built with `roCount` so 1 gives "1 prezență"), `lessons: "Lecții individuale"`, `lessonsValue: (n: number) => \`${n} în sezon\``, `last: "Ultima"`, `missed: "Lipsă luna asta"`, `competitions: "Concursuri"`, `all: "Toate"`, `category: (season: string) => \`Categoria ${season}\``, `count: "concursuri"`, `podiums: "podiumuri"`, `abonament: "Abonament"`, `validUntil: "Valabil până la"`, `location: "Locație"`, `ageSection: (age: string, section: string | null) => section ? \`${age}, ${section}\` : age`
  - `COMPETITIONS = { title: "Concursuri", sub: "Rezultatele sportivilor clubului", all: "Toți sportivii", mine: "Grupele mele", season: "Sezon", athletes: "sportivi", place: "Loc", points: "puncte", unavailable: "Rezultatele nu sunt disponibile acum.", empty: "Niciun rezultat în acest sezon.", filter: "Sportivi" }`
  - `HISTORY` adds: `title: "Istoric"`, `statLabel: (month: string) => \`ședințe de grup în ${month}\``, `lessons: "lecții individuale"`, `hours: "ore"`, `presentSub: (n: number) => \`grup, ${n} prezenți\``, `standInSub: (n: number) => \`înlocuitor, ${n} prezenți\``, `notDoneSub: "grup, fără prezență"`
  - `PROFILE` adds: `role: "Antrenor"`, `settings: "Setări cont"`, `settingsSub: "nume, e-mail, telefon, parolă"`, `security: "Securitate"`, `securitySub: "dispozitive conectate"`, `logout: "Ieși din cont"`
  - `PRESENCE` adds: `coachLabel: "Antrenor"`, `you: (name: string) => \`${name} (tu)\``, `addCoaches: "+ Adaugă alți antrenori"`, `headAthlete: "Sportiv"`, `headGroup: "Grup"`, `headDry: "Uscat"`, `present: (n: string) => \`${n} prezenți\``, `save: "Salvează"`
  - `LESSON` adds: `title: "Lecție individuală"`, `present: "Prezent"`, `save: "Salvează lecția"`
  - Any string the existing code already defines with the same text is reused, not duplicated; "doneOne"/"doneMany" and "noOtherGroup", "empty" texts are decided by Claude (low impact, logged by Task 15).
- Mock routes (shapes of the backend contracts): `GET /calendar?month=` (from the fixture weekdays, start times and lessons; `gavansati` on `2026-11-11` cancelled; saved sessions marked `done`), `POST /groups/:id/members/:aid/move` and `/remove` (own source and own target, else 403 `MSG.noAccess`; missing or same target 400 "Alege grupa."; `from` not ISO or before today 400 `MSG.invalid`; `from` equal to today removes the child from `world.members[source]` and, for a move, adds it to the target; a later `from` keeps the child in the source list with `leavesOn: <from>` on its `CoachMember` (backend contract); answers `{ athleteName, groupName, from, toast: "Salvat." }`), `GET /competitions` (fixture: three events "Cupa României" `2026-10-26` "Brașov", "Edu Sport Trophy" `2026-09-13` "București", "Cupa Patinoarului Nord" `2026-06-15` "București" with members from the fixture children, seasons `["2026-2027", "2025-2026"]`; `scope=mine` keeps own-group children only; state switch `competitionsDown` answers `{ available: false }`), and the added fields of `today` (`location`), `groups` (`next`, others `program`, `children`, `next`), `groups/:id` (`location`), `athletes/:id` (`sectionName: "Școala de patinaj"`, `groupRows` from the fixture memberships, `presence: { season: 26, lessons: 4, last: "2026-11-03", missedThisMonth: 1 }`, `abonament: { code: "A-0124", next: 5, slots: 8, validUntil: "2026-11-30", location: "AFI Cotroceni" }` for own children and `null` otherwise, `competitions` available with `category: "Advanced Novice Girls"`, `season: "2026-2027"`, `count: 3`, `podiums: 3` and the three fixture events, or `{ available: false }` under `competitionsDown`), `history` (`done`, `occurrenceKey`, one not-done row on the 2nd of the month for Avansați).

- [ ] **Step 1: Failing tests.** `coach-routes.test.mjs`: `allowedCoachRoute("GET", "/calendar")` true, `("POST", "/calendar")` false, `("POST", "/groups/gavansati/members/amaria/move")` true, `("POST", "/groups/gavansati/members/amaria/remove")` true, `("DELETE", "/groups/gavansati/members/amaria")` false, `("POST", "/groups/g/members/../move")` false, `("GET", "/competitions")` true; `forwardedQuery("/calendar", "month=2026-11&x=1")` = `"?month=2026-11"`; `forwardedQuery("/competitions", "scope=mine&season=2026-2027&q=x")` = `"?scope=mine&season=2026-2027"`. `format.test.mjs`: the examples above, `phoneLinks("0722")` null, `weekdayShort("2026-11-05")` "Joi", `monthShort("2026-11-05")` "Noi", `longDay("2026-11-04")` "Miercuri, 4 noiembrie", `dayMonthShort("2026-11-12")` "12 noi".
- [ ] **Step 2: Run** `node --test scripts/portal/coach-routes.test.mjs scripts/portal/format.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** types, routes, copy, format and mock.
- [ ] **Step 4: Run** the same command, `npx tsc --noEmit`, and `npm run test:e2e -- tests/e2e/portal-proxy.spec.ts`. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): coach types, copy, routes and mock for the canvas screens"`

### Task 2: Shell and nav (low, Sonnet)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/layout.tsx` (renders the kit `PortalShell`), `src/app/(antrenor)/antrenor/_lib/` (a `coachNav(): NavItem[]` in a new `_lib/nav.ts`)
- Delete use of: `_ui/{PortalShell,PortalHeader,TopNav,BottomNav}.tsx` (files removed in Task 15)
- Test: `tests/e2e/portal-shell.spec.ts` (rewrite the look assertions)

**Interfaces:**
- `coachNav()` = `[{ href: "/", label: "Azi", icon: "portal-azi", match: ["/calendar", "/prezenta", "/lectie"] }, { href: "/grupe", label: "Grupe", icon: "portal-grupe", match: ["/sportiv"] }, { href: "/concursuri", label: "Concursuri", icon: "portal-concursuri" }, { href: "/istoric", label: "Istoric", icon: "portal-istoric" }, { href: "/profil", label: "Profil", icon: "portal-profil" }]`. The sidebar gets the first four and the account button `{ label: me.firstName, href: "/profil" }`; the bottom nav gets all five. `PortalShell phoneNav={false}` on `/prezenta` and `/lectie/*` (canvas boards Prezenta and Lectie have no bottom nav), through a `phoneNav` read from the pathname in the layout's client child.

- [ ] **Step 1: Failing e2e** (`portal-shell.spec.ts`, logged in): at 390 the bottom nav shows "Azi", "Grupe", "Concursuri", "Istoric", "Profil" with an icon each, "Azi" has `aria-current="page"` and background `rgb(143, 184, 245)`; no navy header bar and no initials button; the brand block shows "CLUBUL SPORTIV" and "EDUSPORT"; on `/prezenta?id=s-today` no bottom nav. At 1280 the sidebar shows "EDUSPORT", four links and the account link "Andrei" to `/profil`; on `/grupe` "Grupe" is current; on `/sportiv/amaria` "Grupe" is current; no bottom nav.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-shell.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): coach shell with bottom nav and sidebar from the canvas"`

### Task 3: Login, reset, invite (low, Haiku)

**Files:**
- Modify: `src/app/_portal/auth/{LoginForm,ResetForm,InviteForm}.tsx` (use `GoogleButton`, `OrLine`, `PortalLink`; drop any caps label or button class), `src/app/_portal/ui/AuthBits.tsx` (old `GoogleBlock` now composes `GoogleButton` and `OrLine`)
- Test: `tests/e2e/portal-login.spec.ts` (extend)

- [ ] **Step 1: Failing e2e** on `/login`: card h1 "Intră în cont" `font-size` `28px`; the Google button has an `svg` (the G), text "Continuă cu Google", `border-top-width` `2px`, `font-size` `15px`, `text-transform` `none`; the "sau" line has no sibling rule element (no `hr`, no element with a border between the Google button and the e-mail field); the label "E-mail" `font-size` `14px`, `text-transform` `none`; the "Intră" button face `background-color` `rgb(14, 26, 60)`; "Am uitat parola" `font-weight` `700`, `min-height` `44px`; the existing one-screen check at 390 x 844 and the ribbon colours still pass; same component checks on `/forgot-password` and the invite page.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-login.spec.ts tests/e2e/portal-auth.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/_portal tests/e2e && git commit -m "feat(portal): login, reset and invite forms on the canvas components"`

### Task 4: Azi (low, Sonnet)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/page.tsx` (and any `_parts` it uses)
- Test: `tests/e2e/portal-azi-grupe.spec.ts` (Azi part rewritten)

**Interfaces:**
- Layout from `gen_coach.py` `azi_head`, `azi_parts`, `today_row` and the `build()` lines for `Azi.dc.html` and `DesktopAzi.dc.html`: `PageHeader` brand, kicker `AZI.greeting(firstName)`, title "Azi", `aside` = `NowTile` (month `monthShort(today)`, day, time `HH:mm` of the browser clock, weekday `weekdayShort`), `actions` (desktop only) = secondary `Button` "+ Lecție individuală" to `/lectie/noua`. Body phone: `StatCard` (big = groups + lessons today, label "antrenamente azi", side `[{ value: done count, label: doneOne or doneMany }]`), `Section` "Antrenamente azi" with link "Calendar" to `/calendar` holding one `ListCard` of rows merged from `groups` and `lessons` sorted by start time (row: `lead` `DateBlock big=startTime` dim when the start time is before now, title group name or athlete name dim likewise, sub `AZI.groupSub(roCount children, location)` or `IndividualTag` + `AZI.minutes(durationMin)`, `end` `StatusBlock kind="Grup"|"Individual" done`), then the secondary full-width "+ Lecție individuală" (phone only), then `Section` "Antrenamente fără prezență" (only when `todo` is not empty) with rows `DateBlock word=weekdayShort big=day`, title group, sub `grup, <start>`, end `StatusBlock kind="Grup" done={false}`. Desktop: `Columns` with `Column grow=1 basis=300` (stat card, past) and `Column grow=2 basis=420` (today). Row links unchanged from today's code (`/prezenta?id=` saved, `/prezenta?occurrence=` unsaved, `/lectie/<id>`).

- [ ] **Step 1: Failing e2e** (mock today; local time 14:00): kicker "Bună, Andrei", h1 "Azi" (one h1); now tile `aria-label` "Joi, 5 noiembrie, ora 14:00" with "Noi", "5", "14:00", "Joi"; stat "4" with "antrenamente azi" and "2" "completate"; four rows in this order: "Primii Pași" 10:00 (time `color` `rgb(151, 155, 165)`), "Matei Radu" 15:00 with "Individual" tag (`background-color` `rgb(17, 17, 17)`) and "50 min" and status `aria-label` "Individual, completat", "Ana Stoica" 17:00 "Individual, necompletat", "Avansați" 18:15 sub "grup, 9 copii, AFI Cotroceni" and "Grup, completat" (block `background-color` `rgb(74, 123, 208)`); the "Grup, necompletat" block `background-color` `rgb(14, 26, 60)`; "Calendar ›" links to `/calendar`; "Antrenamente fără prezență" with one row "Avansați" whose date block shows "Vin" (`[data-date-word]`, `color` `rgb(190, 51, 48)`) and "30"; with `emptyToday` the section "Antrenamente azi" shows "Nicio ședință azi." and the past section is absent. At 390: "+ Lecție individuală" full width under the today card. At 1280: the stat card and the past section are left of the today card (their `x` smaller), the button "+ Lecție individuală" is in the top band.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-azi-grupe.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): coach Azi from the canvas"`

### Task 5: Calendar (low, Sonnet)

**Files:**
- Create: `src/app/(antrenor)/antrenor/(app)/calendar/page.tsx`, `calendar/CalendarView.tsx`, `src/lib/portal/calendar.ts`
- Test: `scripts/portal/calendar.test.mjs`, `tests/e2e/portal-calendar.spec.ts`

**Interfaces:**

```ts
export function marksOf(cal: CoachCalendar): Record<string, ("grup" | "individual" | "anulata")[]>; // per date, one mark per item in item order; a cancelled item gives "anulata"
export function itemsOn(cal: CoachCalendar, date: string): CoachCalendarItem[];
```

- Page from `coach_calendar` and the `Calendar.dc.html`, `DesktopCalendar.dc.html` lines of `build()`: `PageHeader` back `{ href: "/", label: "Azi" }`, title "Calendar", sub "Ședințele și lecțiile tale", desktop `actions` = `MonthPicker`; phone body: `MonthPicker`, `MonthGrid` (selected defaults to today when in the month, else the first day with items), `CalendarLegend`, `Section` titled `longDay(selected)` with a `ListCard` of rows built exactly like the Azi rows (cancelled items: sub "anulată", no link, status block omitted, title `color` muted). Desktop: `Columns` (grid and legend `basis=420`, day list `basis=380`). Month changes load `GET /calendar?month=`. URL keeps `?luna=YYYY-MM&zi=YYYY-MM-DD` so a reload stays.

- [ ] **Step 1: Failing tests.** Node: `marksOf` of a fixture with two groups and one lesson on one day -> `["grup", "grup", "individual"]`; a cancelled group -> `"anulata"`. e2e: h1 "Calendar", back link "‹ Azi" to `/`; "Noiembrie 2026"; the grid has 30 day buttons; 3, 4, 10 and 11 November carry a bar with `background-color` `rgb(14, 26, 60)`, 11 November also `rgb(192, 192, 196)` for the cancelled class; 5 November carries two `rgb(74, 123, 208)` bars; today (5) has `background-color` `rgb(225, 236, 251)` until another day is selected; clicking 4 shows the heading "Miercuri, 4 noiembrie" and a row "Avansați" with "18:15"; "Luna următoare" shows "Decembrie 2026" and calls `GET /calendar?month=2026-12` (mock log); the legend reads "grup", "individual", "anulată". At 1280 the month picker is in the top band and the day list is right of the grid.
- [ ] **Step 2: Run** `node --test scripts/portal/calendar.test.mjs` and `npm run test:e2e -- tests/e2e/portal-calendar.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): coach calendar month and day list"`

### Task 6: Prezență (low, Sonnet)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/prezenta/{PresenceView,PresenceTable,CoachPicker,DaySheet,ExistingDialog,ReactivateDialog}.tsx`
- Test: `tests/e2e/portal-presence.spec.ts` (look assertions added; behaviour assertions unchanged)

**Interfaces:**
- From `presence_table`, `coach_line`, `save_bar` and the Prezenta boards: `PageHeader` back "Azi", title group name, sub `${shortWhen(date)}, ${startTime}, ${location}` (location from the group page); coach line: label "Antrenor" 14px 700, names with "(tu)" for the coach, `PortalLink` "+ Adaugă alți antrenori" opening the existing coach picker (now a kit `Sheet`); table: `PortalCard pad="none"`, head row `bg-surface-subtle`, 12px 700 `text-secondary`, columns "Sportiv", "Grup", "Uscat" (44px each), rows min-h 68px (`--portal-presence-row-h`, add to theme), name a link to `/sportiv/<id>?grupa=<groupId>` 15px 700, meta 13px muted (`<age> ani, <abonament>`), shared `Checkbox` (44px through tokens) with `aria-label` "Grup, <nume>" and "Uscat, <nume>"; `SaveBar` with `PRESENCE.present(roCount)` and primary "Salvează" (phone: fixed at the bottom over the page, no bottom nav; desktop: inside a `PortalCard` under the table). Desktop columns: left `basis=280` coach card and the group info card (`PortalCard tone="subtle"`, as in Grupă), right `basis=480 grow=2`. The dialogs keep their texts and flows; their look comes from `Sheet` and tokens.

- [ ] **Step 1: Failing e2e** additions: the head row `background-color` `rgb(225, 236, 251)`, "Sportiv" `font-size` `12px`, `text-transform` `none`; a checkbox `width` `44px`; ticking "Grup, Maria Ionescu" makes it `background-color` `rgb(14, 26, 60)`; the save bar shows "7 prezenți" for `s-today` and its top border `rgb(221, 230, 243)`; "Salvează" face `rgb(14, 26, 60)`; at 390 no bottom nav and the save bar is fixed (`position` `fixed`); at 1280 the group info card is left of the table; all existing presence behaviour tests pass.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-presence.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) src/styles tests/e2e && git commit -m "feat(portal): coach presence sheet from the canvas"`

### Task 7: Lecție individuală (low, Haiku)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/lectie/noua/page.tsx`, `lectie/[id]/LessonView.tsx`, `lectie/DurationPicker.tsx`
- Test: `tests/e2e/portal-lessons.spec.ts` (look assertions added)

- [ ] **Step 1: Failing e2e** additions (from `lesson_form`): back "‹ Azi"; h1 "Lecție individuală"; fields in order "Sportiv", "Data" and "Ora" side by side (same `y`), "Durată", "Antrenor"; the "Prezent" row with a 44px checkbox on the right; full-width primary "Salvează lecția"; at 1280 the form sits in a `PortalCard` with `padding-left` `24px` and `max-width` `520px`; all existing lesson tests pass.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-lessons.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): coach lesson form from the canvas"`

### Task 8: Grupe (low, Haiku)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/grupe/{page,GroupsList}.tsx`, `grupe/layout.tsx` if it renders a header
- Test: `tests/e2e/portal-azi-grupe.spec.ts` (Grupe part rewritten)

- [ ] **Step 1: Failing e2e** (from `GROUPS`, `OTHERS`): h1 "Grupe", sub "2 grupe, 13 copii"; section "Grupele mele" rows "Avansați" with date block "Mar" "10" and sub "Ma, Mi 18:15, 9 copii", "Primii Pași" with "Sâm" "7" and "Sâ, Du 10:00, 4 copii"; section "Alte grupe" visible without a click, rows "Intermediari Silver" ("Sâm" "7", "Sâ, Du 10:00, 2 copii", "Antrenor: Bianca Ene") and "Uscat Juniori" ("Joi" "5", "Antrenor: Bianca Ene"); a group with `next: null` shows the plain row without a date block; each row links to `/grupe/<id>`; at 1280 the two sections are side by side.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-azi-grupe.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): coach groups list with the next class date"`

### Task 9: Grupă and its Program tab (low, Sonnet)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/grupe/[id]/{page,GroupView}.tsx`, `grupe/[id]/_program/*.tsx` (look only: kit `Sheet`, `ListRow`, `SectionHeading`; `SquareSwitch` and `PublicSwitch` keep their behaviour), `grupe/[id]/adauga/AddAthletes.tsx`, `grupe/[id]/sportiv-nou/*` (look only)
- Test: `tests/e2e/portal-azi-grupe.spec.ts`, `portal-program-read.spec.ts`, `portal-program-write.spec.ts`, `portal-athletes.spec.ts` (look assertions added)

- [ ] **Step 1: Failing e2e** (from `group_info`, `gtabs`, `gactions`, `members`): back "‹ Grupe"; h1 "Avansați"; the info card `background-color` `rgb(225, 236, 251)` with "Program: Ma, Mi 18:15", "Loc: AFI Cotroceni", "Antrenori: Andrei Popa" (labels bold); "Fă prezența" primary (only when `todayKey`) and "Modifică grupa" secondary to `/grupe/gavansati/modifica`; segmented "Sportivi (9)" pressed and "Program"; nine member rows, "Tudor Pavel" sub "8 ani, nou", "Ioana Diaconu" sub "12 ani, și în Uscat Juniori", a member with `leavesOn: "2026-11-12"` (mock fixture `asofia`) sub "11 ani, până pe 12 noi", each linking to `/sportiv/<id>?grupa=gavansati`; another coach's group keeps today's stand-in behaviour with the same kit look; at 1280 the info card and actions are left of the list and "Fă prezența" also sits in the top band; Program tab tests still pass.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-azi-grupe.spec.ts tests/e2e/portal-program-read.spec.ts tests/e2e/portal-program-write.spec.ts tests/e2e/portal-athletes.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): coach group page and program tab from the canvas"`

### Task 10: Modifică grupa, Mută, Scoate (high, Sonnet)

**Files:**
- Create: `src/app/(antrenor)/antrenor/(app)/grupe/[id]/modifica/{page,EditGroup,MoveSheet,RemoveSheet}.tsx`
- Test: `tests/e2e/portal-group-edit.spec.ts`

**Interfaces:**
- From `edit_rows`, the `GrupaModifica`, `GrupaMuta`, `GrupaScoate` boards: `PageHeader` back `{ href: "/grupe/<id>", label: <group name> }`, title "Modifică grupa", sub `EDIT_GROUP.sub(name, roCount members "sportivi")`; phone: secondary full "+ Adaugă sportiv" (to `/grupe/<id>/adauga`), `PortalCard` of rows (min-h 68px, name 15px 700, sub 13px muted, two secondary small buttons "Mută" and "Scoate": min-h 44px, pad-x 12px, 14px 700, through `--portal-small-btn-pad-x: 12px` added to the theme), primary full "Gata" (to `/grupe/<id>`); desktop: the two buttons in the top band, list `max-width` 640px. Only for an own group; another coach's group redirects to `/grupe/<id>`.
- `MoveSheet({ athlete, group, targets, onDone })`: `Sheet` title `moveTitle(name)`, description `moveText(group)`, shared `Select` "Grupa nouă" (own groups except this one; none -> the text `noOtherGroup` and only "Renunță"), `Input type="date"` "Din data" (default today, `min` today), two columns "Renunță" (secondary) and "Mută" (primary); submit `POST groups/<id>/members/<athleteId>/move` `{ toGroupId, from }`; success: toast "Salvat.", sheet closes, list reloads; refusal: the server message under the form, sheet stays open.
- Member sub lines on the Grupă page and here: `<age> ani`, then ", nou", ", și în <groups>" and, when `leavesOn` is set, ", " + `GROUP.until(dayMonthShort(leavesOn))` (user 2026-11-09). The row keeps its Mută and Scoate buttons; a second change answers 409 and the message shows in the sheet.
- `RemoveSheet`: title `removeTitle(name)`, description `removeText`, "Din data", "Renunță" and "Scoate din grupă"; `POST .../remove` `{ from }`.

- [ ] **Step 1: Failing e2e:** `/grupe/gavansati/modifica` shows h1 "Modifică grupa", sub "Avansați, 9 sportivi", nine rows each with "Mută" and "Scoate"; "Mută" on "Maria Ionescu" opens the sheet "Muți pe Maria Ionescu în altă grupă" with "Prezențele de până acum rămân în Avansați.", the select offers only "Primii Pași", "Din data" is `2026-11-05`; "Mută" posts `{ toGroupId: "gprimii", from: "2026-11-05" }` (mock log), shows "Salvat." and the row is gone; "Scoate" on "Luca Dumitru" opens "Scoți pe Luca Dumitru din grupă?" with "Prezențele de până acum rămân. Nu mai apare la ședințele grupei."; choosing `2026-11-20` posts `from: "2026-11-20"`, the row stays and its sub line ends with "până pe 20 noi" (also on the Grupă page); a forged move to `gsilver` through `page.evaluate(fetch)` answers 403 and the mock state is unchanged; `/grupe/gsilver/modifica` redirects to `/grupe/gsilver`; at 1280 the sheet is 460px wide and centred, at 390 it sits at the bottom with full width; Escape closes the sheet and focus returns to the "Mută" button.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-group-edit.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) src/styles tests/e2e && git commit -m "feat(portal): coach moves or removes a child from a group"`

### Task 11: Sportiv, the coach view of an athlete (high, Sonnet)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/sportiv/[id]/{page,AthleteCard}.tsx`
- Test: `tests/e2e/portal-athletes.spec.ts` (athlete page part rewritten)

**Interfaces:**
- From `athlete_parts`, `athlete_presence`, `athlete_comp` and the Sportiv boards: `PageHeader` back `{ href: "/grupe/<grupa>", label: <that group name> }` when `?grupa=` names one of the athlete's `groupRows`, else `{ href: "/grupe", label: "Grupe" }`; title name; sub `CARD.ageSection(roCount age "ani", sectionName)`. Sections, phone order: Contact (only when `contact` has a phone: "Părinte" 13px muted, name 15px 700, phone League Spartan 800 24px tracking 0.02em with `CopyButton`, a two-column grid of `ContactButton` "Sună" primary (`tel:`) and "WhatsApp" (`https://wa.me/`, `external`)), Prezențe (`KeyValueCard`: "În sezon" `presences(roCount)`, "Lecții individuale" `lessonsValue`, "Ultima" `shortWhen(last)` (the row is left out when `last` is null), "Lipsă luna asta" number), Concursuri (when `competitions.available` and `count > 0`: link "Toate" to `/concursuri`; card with the ice-light category row "Categoria <season>" over the category 15px 800, counts League Spartan 18px with "concursuri" and "podiumuri" 11px muted; then up to three rows `PlaceBlock`, event name, `dayMonthYear(date), location`, `PointsCell`; when `available` is false the section shows "Rezultatele nu sunt disponibile acum."), Grupe (`ListCard` of `groupRows`, title name, sub program joined with ", ", link `/grupe/<id>`), Școala (`KeyValueCard`: "Abonament" `<code>, Ședința <next>/<slots>` or `Ședința <next>/<slots>` without a code, "Valabil până la" `shortWhen` without the weekday ("30 noi"), "Locație"; only when `abonament` is not null). Desktop columns: (Contact, Prezențe, Grupe) `basis=380` and (Concursuri, Școala) `basis=380`.

- [ ] **Step 1: Failing e2e:** `/sportiv/amaria?grupa=gavansati`: back "‹ Avansați"; h1 "Maria Ionescu"; sub "11 ani, Școala de patinaj"; Contact: "Părinte", "Părinte Exemplu", "0722 000 222", button "Copiază numărul" (clicking it shows "Numărul a fost copiat." and the clipboard holds "0722 000 222", with the clipboard permission granted in the test context), "Sună" `href` `tel:+40722000222`, "WhatsApp" `href` `https://wa.me/40722000222` with `target="_blank"` and `rel` containing `noopener`; Prezențe rows "În sezon" "26 de prezențe", "Lecții individuale" "4 în sezon", "Ultima" "Mar, 3 noi" (mock `last: "2026-11-03"`), "Lipsă luna asta" "1"; Concursuri "Categoria 2026-2027", three rows with "Loc"; Grupe row "Avansați"; Școala "Abonament" "A-0124, Ședința 5/8". A stand-in child (`adara`, seen on `s-standin`): no "Contact" heading, no `a[href^="tel:"]`, no `a[href*="wa.me"]`, no "Copiază numărul", no "Școala" section; `competitionsDown` -> "Rezultatele nu sunt disponibile acum." under Concursuri and the rest renders. At 1280 Concursuri is right of Contact.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-athletes.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): coach athlete page with contact, presence and competitions"`

### Task 12: Concursuri (low, Sonnet)

**Files:**
- Create: `src/app/(antrenor)/antrenor/(app)/concursuri/{page,CompetitionsView}.tsx`
- Test: `tests/e2e/portal-competitions.spec.ts`

- [ ] **Step 1: Failing e2e** (from `comps_parts`): h1 "Concursuri", sub "Rezultatele sportivilor clubului"; segmented "Toți sportivii" (pressed) and "Grupele mele" with group label "Sportivi"; select "Sezon" showing "2026-2027"; three `CompetitionCard`s newest first, the first open: "Cupa României", date block "Oct" "26", "Brașov", count block with the member count and "sportivi"; member rows with "Loc", name, category and points, each linking to `/sportiv/<id>`; "Grupele mele" calls `GET /competitions?scope=mine&season=2026-2027` and shows only own-group children; season "2025-2026" calls with that season; an empty season shows "Niciun rezultat în acest sezon."; `competitionsDown` shows "Rezultatele nu sunt disponibile acum." and no card; a closed card opens with Enter on its summary; at 1280 the segmented control and the select (220px, `--portal-season-w` added to the theme) are on one row and the list `max-width` is 860px.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-competitions.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) src/styles tests/e2e && git commit -m "feat(portal): coach competitions tab"`

### Task 13: Istoric (low, Haiku)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/istoric/{page,HistoryView}.tsx`
- Test: `tests/e2e/portal-history.spec.ts` (look assertions added)

- [ ] **Step 1: Failing e2e** (from `hist_hero`, `HIST`): h1 "Istoric"; `MonthPicker` "Noiembrie 2026" (phone in the body, desktop in the top band); stat card "2" with "ședințe de grup în noiembrie", side "1" "lecții individuale" and "2,8" "ore"; rows newest first with date blocks ("Joi" "5", "Mie" "4", "Mar" "3", "Lun" "2"): "Avansați" sub "grup, 8 prezenți" status "Grup, completat"; "Intermediari Silver" sub "înlocuitor, 10 prezenți"; "Matei Radu" with the "Individual" tag and "50 min", status "Individual, completat"; the not-done "Avansați" row sub "grup, fără prezență" with "Grup, necompletat" linking to `/prezenta?occurrence=<key>`; "Luna anterioară" loads `month=2026-10`. Existing history tests pass.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-history.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): coach history with status blocks"`

### Task 14: Profil, Setări cont, Securitate (low, Haiku)

**Files:**
- Modify: `src/app/(antrenor)/antrenor/(app)/profil/{page,ProfileView}.tsx`, `profil/setari/SettingsView.tsx`, `profil/securitate/SecurityView.tsx`
- Test: `tests/e2e/portal-profile.spec.ts` (look assertions added)

- [ ] **Step 1: Failing e2e** (from `profile_list`, `settings_parts`): `/profil` h1 "Andrei Popa", sub "Antrenor"; rows "Setări cont" ("nume, e-mail, telefon, parolă") and "Securitate" ("dispozitive conectate"); secondary full "Ieși din cont"; `/profil/setari` back "‹ Profil", h1 "Setări cont", section "Cont" with key/value "Nume" "Andrei Popa", "E-mail" "antrenor1@example.invalid" and the note "Numele și e-mailul le schimbă administratorul. După schimbarea e-mailului, intri cu adresa nouă.", section "Telefon" with field "Telefon" and "Salvează", section "Schimbă parola" with "Parola actuală", "Parola nouă", "Salvează"; at 1280 Cont is left of Telefon and parola; `/profil/securitate` lists the two devices as `ListRow`s with a secondary "Deconectează" each (no canvas board: kit rows, decided by Claude, logged in Task 15). Existing profile tests pass.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-profile.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(antrenor\) tests/e2e && git commit -m "feat(portal): coach profile, settings and security from the canvas"`

### Task 15: Cleanup, full checks, screenshots, click-through (low, Sonnet)

**Files:**
- Delete: `src/app/(antrenor)/antrenor/_ui/{ListCard,Row,SquareLabel,BackHeader,PortalHeader,TopNav,BottomNav,Segmented,PortalShell}.tsx` (and `AthleteSearch.tsx` if no import is left)
- Create: `tests/e2e/portal-look-sweep.spec.ts`, `scripts/portal/clickthrough-coach-canvas.mjs`
- Modify: `docs/portal/DECISIONS.md` (append "2026-11-09 coach canvas screens (decided by Claude, low impact)": `doneOne`/`doneMany` texts, "Nu ai altă grupă în care să-l muți.", "Nicio ședință în această zi.", "Niciun rezultat în acest sezon.", the athlete back link from `?grupa=`, Securitate rows without a board)

- [ ] **Step 1: Sweep e2e** `portal-look-sweep.spec.ts`: for `/`, `/calendar`, `/grupe`, `/grupe/gavansati`, `/grupe/gavansati/modifica`, `/sportiv/amaria`, `/concursuri`, `/istoric`, `/profil`, `/profil/setari`, `/prezenta?id=s-today`, `/lectie/noua`, `/login` (logged out) at 390 and 1280: exactly one `h1`; no element with a direct text node has `color` `rgb(190, 51, 48)` outside `[data-date-word]`; every element except the bottom nav, its active item, `[data-date-block]` (date and place blocks, 6px) and `[data-spinner]` has `border-radius` `0px`; no element has `border-style` `dashed` or `dotted`; `body` `background-color` `rgb(246, 249, 253)`.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/portal-look-sweep.spec.ts`. Expected: PASS (fix any screen that fails).
- [ ] **Step 3: Full checks in a background worktree:** `npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:scripts && node --test scripts/portal/*.test.mjs scripts/tokens/*.test.mjs`, `npm run test:e2e` (all), `npx playwright test tests/visual/pages.spec.ts` against the plan A baseline (0 failed). Record counts.
- [ ] **Step 4: Screenshots:** copy the 390 and 1280 screenshots of every screen into `docs/portal/mockups/screens/coach-canvas-v1/built/`, and put them beside the matching `s_Antrenor*.png` in one companion screen for the user's check (DECISIONS rule: visual changes approved on real screenshots). Do not merge before the user approves.
- [ ] **Step 5: Click-through** against a real Strapi when the backend plan Tasks 1 to 7 are merged: boot check `es-cr-pg` (see the backend plan), Next on 3219 with `PORTAL_STRAPI_URL=http://127.0.0.1:1389`; `node scripts/portal/clickthrough-coach-canvas.mjs` logs in as `antrenor1@example.invalid` and opens every screen of Step 1, moves the fixture child from tomorrow, opens Concursuri (expects "Rezultatele nu sunt disponibile acum."), and fails on any console error or non-2xx BFF answer.
- [ ] **Step 6: Commit** `git add -A src/app tests/e2e scripts/portal docs/portal && git commit -m "chore(portal): remove the old coach parts, look sweep and screenshots"`
