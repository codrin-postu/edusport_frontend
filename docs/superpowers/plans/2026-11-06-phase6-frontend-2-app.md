# Phase 6 Frontend, part 2: coach app (Tasks 10 to 20)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Read first: `2026-11-06-phase6-frontend-index.md` (Global Constraints, Review Focus, gaps G1 and G2, rulings). Layout and strings: spec 9; mockup `docs/portal/mockups/coach-mobile.html` screens 1 to 12 for placement only (its dots become commas, "Email" becomes "E-mail", its "Înscrieri noi", parent-access line, month counts and percentages are dropped, spec 17). Every string comes from `src/lib/portal/copy.ts` (T3); a missing string is reported as NEEDS_DECISION, not invented. Data comes from the BFF through `_lib/api.ts` (T10) only.

All page files below live under `src/app/(antrenor)/antrenor/`. e2e specs use `tests/e2e/portal-helpers.ts` (T4) and run at 390 x 844 unless they say 1280 x 800.

---

### Task 10: App shell and client API (Sonnet, normal)

**Files:**
- Create: `_lib/api.ts`, `_lib/use-portal.ts`, `_lib/me-context.tsx`, `(app)/layout.tsx`, `_ui/{PortalShell,PortalHeader,BottomNav,TopNav,Spinner,LoadError,Toast,ListCard,Row,Segmented,BackHeader,Sheet,PasswordField,AthleteSearch,SquareLabel}.tsx`, `tests/e2e/portal-shell.spec.ts`
- Modify: `page.tsx` (T2 placeholder moves to `(app)/page.tsx`, still a placeholder until T12)

**Interfaces:**
- Consumes: T3 (`api-types.ts`, `copy.ts`, `format.ts`), T9 (BFF paths).
- Produces:
  - `type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string; body: unknown }`
  - `portalApi<T>(method: "GET" | "POST" | "PUT" | "DELETE", path: string, body?: unknown): Promise<ApiResult<T>>`: `path` relative to `/api/portal/` (for example `"coach/today"`); `credentials: "same-origin"`; a 401 calls `window.location.assign("/intrare")`; `message` = `error.message` or `STATES.loadFailed` when the body is not JSON.
  - `usePortal<T>(path: string | null): { state: "loading" | "error" | "ready"; data: T | null; reload: () => void }` (null path = idle).
  - `useNoAccess(): (r: ApiResult<unknown>) => boolean`: when `r.status === 403 && r.message === STATES.noAccess`, toasts the message and `router.replace("/grupe")`, returns true.
  - `MeProvider` / `useMe(): CoachMe | null` (one `coach/me` load per shell mount).
  - `(app)/layout.tsx` (server): no refresh cookie (`cookieNames(secure).refresh`, secure from `headers()`) -> `redirect("/intrare")`; else `<MeProvider><PortalShell>{children}</PortalShell></MeProvider>`.
  - `PortalShell`: navy header with the "EDUSPORT" wordmark (same classes as the site Header, `src/components/blocks/header/Header.tsx:164`) and the initials tile (square, `CoachMe.initials`, link to `/profil`, `aria-label` A11Y "Profil"), no yellow border; phone bottom bar Azi / Grupe / Istoric / Profil (`lg:hidden`, active item solid primary fill); from `lg` a top menu Azi / Grupe / Istoric and a name menu with Profil and "Ieși din cont".
  - `Row({ href, time?, title, sub?, label?, tile? })`: whole row one Link (`tone="plain"`), time left (start only), title, one sub-line, optional `SquareLabel`, arrow right; `ListCard` = one Card, rows split by solid hairlines.
  - `Segmented<T>({ options: { value: T; label: string }[]; value: T; onChange })`: square segments, selected solid primary fill.
  - `Sheet` (Radix Dialog as a bottom sheet on phones, square grab handle), `Toast` (`useToast().show(text)`, one at a time, 4 s, `role="status"`), `Spinner` (the only round element), `LoadError` (the text "Nu am putut încărca datele." only, no retry button, spec 9.11).
  - `PasswordField({ label, value, onChange, autoComplete })`: eye button toggling `type`, `aria-label` EYE texts.
  - `AthleteSearch({ group?: string; multiple: boolean; selected: string[]; onToggle(row: CoachSearchRow) })`: input labelled "Caută după nume"; queries `coach/athletes/search?q=&group=` from 3 letters, 250 ms debounce, at most 8 rows "<nume>, <n ani>".

- [ ] **Step 1: Failing e2e** (`portal-shell.spec.ts`): logged out, `/grupe` lands on `/intrare`; logged in, `/` shows the tile text "AP" and four bottom items; at 1280 x 800 the bottom bar is hidden and the top menu shows "Azi", "Grupe", "Istoric"; with mock `cutAccount` the next navigation that loads data lands on `/intrare`; no element inside the shell except the spinner has a computed `border-radius` other than `0px` (evaluate over `document.querySelectorAll("header *, nav *")`).
- [ ] **Step 2:** `npm run test:e2e -- tests/e2e/portal-shell.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the spec, `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): coach app shell and client API"`

---

### Task 11: Login, reset and invite screens (Sonnet, HIGH, RB3)

**Files:**
- Create: `intrare/page.tsx` (server) + `intrare/LoginForm.tsx`, `am-uitat-parola/page.tsx` + `ResetForm.tsx`, `invitatie/page.tsx` (server) + `InviteForm.tsx`, `_ui/AuthFrame.tsx`, `tests/e2e/portal-login.spec.ts`

**Interfaces:**
- Consumes: T7 (`/api/portal/auth/*`, `readInviteState`), T8 (`googleEnabled`, `/api/portal/google/start`), T10 (`PasswordField`, `portalApi`).
- Produces: the three screens of spec 9.1 and 9.2 in a centred phone card with the EDUSPORT wordmark.
  - `/intrare`: a refresh cookie present -> `redirect("/")`. Order: title, "Continuă cu Google" (link to `/api/portal/google/start`, only when `googleEnabled()`), "sau", E-mail, Parolă, "Intră", link "Am uitat parola". On mount `GET auth/flash`; a message shows in the `role="alert"` line. Submit: `POST auth/login`; ok -> `window.location.assign("/")`; refusal -> `message` in the alert line, password cleared, e-mail kept.
  - `/am-uitat-parola`: step 1 E-mail, "Trimite codul" -> shows `data.message` as sent and step 2 (Cod din e-mail, Parolă nouă, Salvează parola); confirm ok -> `/`; refusals as sent; back link "Înapoi la intrare".
  - `/invitatie`: `readInviteState()`; `none` or `expired` -> the expired text and the link "Înapoi la intrare"; `valid` -> "Bun venit", "Contul tău: <e-mail>", Parolă nouă, "Salvează parola", "sau", "Continuă cu Google" (`/api/portal/google/start?invite=1`, only when enabled); flash message on mount as on `/intrare`.
  - Inputs: `autoComplete` `email`, `current-password` (login), `new-password` (reset, invite), `one-time-code` with `inputMode="numeric"` (code).

- [ ] **Step 1: Failing e2e:** wrong password shows exactly "E-mailul sau parola nu sunt corecte." and the password field is empty; the eye button switches the field to `type="text"` and its label to "Ascunde parola"; a good login lands on `/` (Azi); the reset path shows "Dacă adresa are cont, am trimis un cod." for an unknown e-mail too, and the code step with the mock code `123456` logs in; `/invitatie/inv-old-00000000000000000000000000` shows "Invitația a expirat. Cere administratorului una nouă."; the valid invite shows "Contul tău: antrenor2@example.invalid" and saving a 12-character password lands on `/`; with mock `googleClientId: null` no "Continuă cu Google" link exists; a page text scan finds no "Email" and no `·`.
- [ ] **Step 2:** `npm run test:e2e -- tests/e2e/portal-login.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the spec and the T10 spec; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): login, password reset and invite screens"`

---

### Task 12: Azi, Grupe and the group page (Sonnet, normal)

**Files:**
- Create: `(app)/page.tsx` (Azi), `(app)/grupe/page.tsx`, `(app)/grupe/[id]/page.tsx`, `(app)/grupe/[id]/_program/ProgramTab.tsx` (stub `export function ProgramTab({ groupId, own }: { groupId: string; own: boolean }): JSX.Element` rendering the Spinner; T16 replaces the body), `tests/e2e/portal-azi-grupe.spec.ts`

**Interfaces:**
- Consumes: T10 (`usePortal`, `Row`, `ListCard`, `Segmented`, `useMe`, `useNoAccess`), `CoachToday`, `CoachGroups`, `CoachGroupPage`.
- Produces: links other tasks own: class row -> `/prezenta?id=<sessionId>` when saved, else `/prezenta?occurrence=<occurrenceKey>`; lesson row -> `/lectie/<lessonId>`; "+ Lecție individuală" -> `/lectie/noua`; member row -> `/sportiv/<athleteId>`; "+ Adaugă sportiv" -> `/grupe/<id>/adauga` (own) or `/grupe/<id>/sportiv-nou` (other); "Fă prezența" -> `/prezenta?occurrence=<todayKey>` or, without one, `/prezenta?group=<id>&date=<today>`.
  - Azi (spec 9.3): "Bună, <firstName>", `dayTile(today)`; "Grupe" rows (time, group name, sub "grup, <n copii>", label "Completat" when `done`); "Lecții individuale" rows (time, athlete, "individuală, <durată>", "Completat" when `done`), then "+ Lecție individuală"; "De făcut" rows (date tile `dateTile`, group, "grup, <shortDate>"); groups and lessons both empty -> "Nicio ședință azi." in place of the two sections.
  - Grupe (9.4): "Grupele mele" rows name + "<program joined with ", ">, <n copii>"; "Alte grupe" collapsed button (`aria-expanded`), rows name + "Antrenor: <names>". From `lg`: list left, the selected group page right (`/grupe/<id>` keeps the list).
  - Group page own (9.5): name; `Segmented` "Sportivi" / "Program" bound to `?tab=`; Sportivi: "Antrenori: ...", "Fă prezența", "Sportivi (<n>)", rows name + sub "<n ani>" and "și în <grupă>" joined with ", ", `SquareLabel` "nou" when `isNew`, then "+ Adaugă sportiv"; Program: `<ProgramTab groupId own />`.
  - Group page other (9.6): banner "Grupa altui antrenor", "Program: ...", "Antrenori: ...", "Înlocuiesc azi" when `todayKey`, else "Fă prezența ca înlocuitor" when `standIn` is not empty (opens a `Sheet` listing the slots as rows: date tile, start time, -> `/prezenta?occurrence=<key>`), "+ Adaugă sportiv"; no roster, no tabs.
  - A 403 on the group read -> `useNoAccess`; a 404 -> LoadError.

- [ ] **Step 1: Failing e2e:** Azi shows "Bună, Andrei", the day tile of today, "grup, 9 copii", a "Completat" label on the saved class, the todo row "grup, <shortDate of today - 6>"; Grupe shows "Grupele mele" and "Alte grupe" collapsed (other names hidden until clicked); own group shows "Sportivi (9)", one "nou" label, "și în Uscat Juniori"; the other group shows "Grupa altui antrenor", "Înlocuiesc azi" (mock has a class today there), no "Sportivi (" text; mock today with no classes or lessons shows "Nicio ședință azi.".
- [ ] **Step 2:** `npm run test:e2e -- tests/e2e/portal-azi-grupe.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the spec; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): Azi, Grupe and the group page"`

---

### Task 13: Presence (Sonnet, HIGH, RB3)

**Needs G1:** `CoachMe.coachId` and `CoachMe.coachOptions` (index gap G1). If the backend copy in `api-types.ts` lacks them, stop after Step 1 and report BLOCKED G1.

**Files:**
- Create: `(app)/prezenta/page.tsx`, `(app)/prezenta/{PresenceTable,CoachPicker,DaySheet,ExistingDialog,ReactivateDialog}.tsx`, `src/lib/portal/presence.ts`, `scripts/portal/presence.test.mjs`, `tests/e2e/portal-presence.spec.ts`

**Interfaces:**
- Consumes: `CoachSession`, `SessionCheck`, `SessionSaveBody`, `SessionSaved`, `CoachGroupPage.standIn`, T10 UI, `useMe().coachId`.
- Produces:
  - `src/lib/portal/presence.ts` (pure): `sessionQuery(search: URLSearchParams): string | null` (passes exactly one of `occurrence`, `id`, or `group`+`date` with optional `time`, `duration`; else null); `presentCount(rows: { grup: boolean; uscat: boolean }[]): number` (rows with either tick); `saveBody(s: CoachSession, ticks: Map<string, { grup: boolean; uscat: boolean }>, coachIds: string[], reactivate: string[], keepInactive: string[]): SessionSaveBody` (`id` when `sessionId`, else `occurrence` when `occurrenceKey`, else `added`; only ticked rows go in `ticks`).
  - Screen (spec 9.7, 8.1, 8.2, 8.3): header group name and date button `dayTile(date)`; "Antrenor" list: each `coachIds` name from `coachOptions`, the coach's own as "<nume> (tu)", a remove control on others only (own row never removable, S28); "+ Adaugă alți antrenori" opens a `Sheet` checklist of `coachOptions`; stand-in (`standIn`) shows "Vei apărea ca antrenor la această ședință."; `outsideSchedule` shows "În afara programului"; table "Sportiv" | "Grup" | "Uscat" (`kind === "school"`: no "Uscat" column, and under each name `abonament ?? "Fără abonament"`; Club: no line); square tick boxes; footer counter `<n prezenți>` beside "Salvează"; `savedLine` under the header when present; `archived` or `!editable`: ticks disabled, line "Arhivată. Nu mai poate fi modificată.", no save button.
  - Date button: `DaySheet` with "Alege ziua pentru care faci prezența.", a month calendar (react-day-picker, square cells, days after today disabled; on a stand-in session only the dates of the group's `standIn` slots enabled), button "Alege <pickLabel(date)>". No saved-day marks and no legend line (gap G2). Pick: `POST coach/session/check { groupId, date, startTime }` -> `existing`: `ExistingDialog` (title, one row per saved session "<startTime>, <n prezenți>, Salvată de <savedBy>", "Deschide prezența salvată" -> `?id=`, "Adaugă încă o ședință în ziua asta" -> `?group=&date=&time=&duration=`); `occurrence` -> `?occurrence=`; `free` -> `?group=&date=`.
  - Save: `PUT coach/session`; 200 -> toast `data.toast`, `router.replace("/prezenta?id=" + sessionId)`; 409 with `details.inactive` -> `ReactivateDialog` once per athlete (phase 5 texts), then resend with `reactivate` / `keepInactive`; 403 "Arhivată. ..." -> reload the session (shows read only); 403 no access -> `useNoAccess`; other refusal -> message in a `role="alert"` line, ticks kept.

- [ ] **Step 1: Failing tests.** Node: `sessionQuery(new URLSearchParams("occurrence=k1&id=x"))` -> `"occurrence=k1"` (occurrence wins, one key only); `sessionQuery(new URLSearchParams("group=g&date=2026-11-06"))` -> `"group=g&date=2026-11-06"`; `sessionQuery(new URLSearchParams("date=2026-11-06"))` -> `null`; `presentCount` of two ticked one empty -> 2; `saveBody` with `sessionId: "s1"` has `id: "s1"` and no `occurrence`; unticked rows absent from `ticks`. e2e: today's own class: tick two, footer "2 prezenți", save shows the mock toast and the mock received `ticks` of length 2 and `coachIds` containing the fixture coach id; own row reads "Andrei Popa (tu)"; the archived session shows the archived line and no "Salvează" button; the Școala session has no "Uscat" header and shows "Fără abonament"; picking a day with a saved session opens "Există deja o ședință salvată"; the stand-in session shows "Vei apărea ca antrenor la această ședință."; a save answered 403 "Nu mai ai acces la această grupă." lands on `/grupe` with that toast.
- [ ] **Step 2:** `node --test scripts/portal/presence.test.mjs` and `npm run test:e2e -- tests/e2e/portal-presence.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run both; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): presence for own groups and stand-in"`

---

### Task 14: Individual lessons (Sonnet, normal)

**Needs G1** (as Task 13): the new lesson needs the coach's own id and the coach options.

**Files:**
- Create: `(app)/lectie/noua/page.tsx`, `(app)/lectie/[id]/page.tsx`, `(app)/lectie/DurationPicker.tsx`, `tests/e2e/portal-lessons.spec.ts`

**Interfaces:**
- Consumes: `LessonBody`, `LessonPatch`, `LessonSaved`, `CoachLesson`, T10 `AthleteSearch` (`multiple: false`), `CoachPicker` from T13 (`(app)/prezenta/CoachPicker.tsx`, props `{ me: string; options: { id: string; name: string }[]; value: string[]; onChange(ids: string[]): void; locked?: boolean }`). If T13 is not merged yet, T14 waits for it (same group, run T13 first).
- Produces (spec 8.4, MOCK 7, 7b, 7c):
  - New: "Lecție individuală"; Sportiv (`AthleteSearch`), Data (`DatePickerField`, default today), Ora (time input, `step=300`), Durată (`DurationPicker`: sheet with "Ore" 0 to 3 and "Minute" 00 to 55 in 5s, shows `durationText`, button "OK", default 50), Antrenor (`CoachPicker`, own id preselected and locked); "Salvează lecția" -> `POST coach/lessons` -> toast, `router.replace("/lectie/" + lessonId)`.
  - Lesson page: header "Lecție individuală", `dayTile(date)`; Antrenor; row Sportiv | Prezent (square tick, sub "<startTime>, <durată>"); Durată; "Salvează prezența" -> `PUT coach/lessons/<id>` `{ present, durationMin, coachIds }`; `archived` or `!editable` -> read only with the archived line; `deletable` -> "Șterge lecția" opening a confirm dialog "Ștergi lecția din <shortDate>?" with "Șterge lecția" / "Renunță" (T3 `LESSON`) -> `DELETE` -> toast, `router.replace("/")`.

- [ ] **Step 1: Failing e2e:** new lesson for the fixture athlete "Maria Dumitrescu" at 16:00 with 1 h 15 min sends `durationMin: 75` and lands on the lesson page; the lesson page "Salvează prezența" sends `present: true`; a planned lesson shows "Șterge lecția", the dialog text, and deleting returns to Azi; the archived lesson has no save button.
- [ ] **Step 2:** `npm run test:e2e -- tests/e2e/portal-lessons.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): individual lessons"`

---

### Task 15: Adaugă sportiv, Sportiv nou, athlete card (Sonnet, normal)

**Files:**
- Create: `(app)/grupe/[id]/adauga/page.tsx`, `(app)/grupe/[id]/sportiv-nou/page.tsx`, `(app)/sportiv/[id]/page.tsx`, `tests/e2e/portal-athletes.spec.ts`

**Interfaces:**
- Consumes: `CoachSearchRow`, `CoachNewAthleteBody`, `JoinResult`, `CoachAthleteCard`, `CoachGroupPage` (group name), T10 `AthleteSearch` (`multiple: true`, `group`).
- Produces (spec 8.5 to 8.7):
  - Adaugă: title "Adaugă în <grupă>"; search; picked rows show a tick; last row "Nu e în listă: sportiv nou" -> `sportiv-nou`; with picks: "Din data" (`DatePickerField`, default today) and "Adaugă <n sportivi>" -> `POST coach/groups/<id>/members { athleteIds, from }` -> back to the group page, which lists the new members; no toast (the spec gives none; decided by Claude, low impact).
  - Sportiv nou: "Sportiv nou"; "Nume și prenume" (required), "Data nașterii" (`DatePickerField`, optional, placeholder "zz.ll.aaaa"), "Părinte", "Telefon" (`inputMode="tel"`), "E-mail" each with "opțional"; button "Adaugă în <grupă>" -> `POST coach/athletes` -> toast `data.toast`, back to the group page.
  - Card: name, `<n ani>` (blank when null), "Grupe" names joined with ", ", "Școala" line when `school`, "Contact" block when `contact` with name, phone and "Sună" (`tel:` link) only when `phone`.
  - Refusals: 403 no access -> `useNoAccess`; others in a `role="alert"` line.

- [ ] **Step 1: Failing e2e:** typing "An" shows no results and no request; "Ana" shows rows "Ana Bălan, 9 ani"; picking two shows "Adaugă 2 sportivi" and the mock receives `athleteIds` of length 2 and `from` = today; "Nu e în listă: sportiv nou" opens the form with the button "Adaugă în Avansați"; saving only a name posts `{ groupId, name }`; the card of an own child shows "Contact" and a `tel:` link; the card of a child seen only on a stand-in session shows no "Contact".
- [ ] **Step 2:** `npm run test:e2e -- tests/e2e/portal-athletes.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): add athletes, new athlete and the athlete card"`

---

### Task 16: Program tab, read and Program public (Sonnet, normal)

**Files:**
- Modify: `(app)/grupe/[id]/_program/ProgramTab.tsx` (T12 stub)
- Create: `(app)/grupe/[id]/_program/{ProgramList,ProgramMonth,DateRow}.tsx`, `src/lib/portal/program.ts`, `scripts/portal/program.test.mjs`, `tests/e2e/portal-program-read.spec.ts`

**Interfaces:**
- Consumes: `CoachProgram`, `Occurrence`, `ProgramRow`, `GET coach/groups/<id>/program?month=`, `PUT coach/groups/<id>/program-public`.
- Produces:
  - `src/lib/portal/program.ts` (pure): `dateState(o: Occurrence, today: string): "past" | "pause" | "cancelled" | "moved" | "open"` (past when `o.date < today`; pause from the occurrence break state as the admin `DatePanel.tsx` reads it; cancelled and moved from `status` / `originalDate`); `eventDocumentId(o: Occurrence): string | null` (`o.documentId ?? null`, never `o.eventId`).
  - `ProgramTab` (spec 9.8): `Segmented` "Listă" / "Lună"; month arrows (A11Y labels) and month name; Listă: series rows (`ProgramRow.text`, `fromText`) then the month's dates as `DateRow` (date tile, time, state word "trecut" for past, the pause notice `Pauză: <nume>.` for pause dates, no actions in this task); Lună: a 7-column square grid with the occurrence times; Club own group and `programPublic !== null`: switch "Program public" with the hint "Programul apare în calendarul de pe site." -> PUT, toast `data.toast`, value from the answer on reload; Școala (`kind === "school"` or `!editable`): read only and the line "Programul Școlii îl schimbă administratorul." for Școala.
  - Exposes `onAction` slots on `DateRow` and a "+ Adaugă program" / "Schimbă" slot that T17 fills (props `actions?: ReactNode`).

- [ ] **Step 1: Failing tests.** Node: `dateState` past for yesterday, open for today, pause for a pause-state fixture; `eventDocumentId({ eventId: 7, documentId: "ev1", ... })` -> `"ev1"`. e2e: own Club group Program tab shows the series text "Ma, Mi 18:15", "Program public" switch toggling sends `{ value: true }` and shows "Salvat."; a past date row shows "trecut"; the Școala group shows "Programul Școlii îl schimbă administratorul." and no switch; "Lună" shows a grid.
- [ ] **Step 2:** `node --test scripts/portal/program.test.mjs`, `npm run test:e2e -- tests/e2e/portal-program-read.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run both; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): Program tab read view and Program public"`

---

### Task 17: Program tab, writes (Sonnet, normal)

**Files:**
- Create: `(app)/grupe/[id]/_program/{AddProgramSheet,ChangeSheet,DateSheet}.tsx`, `tests/e2e/portal-program-write.spec.ts`
- Modify: `ProgramTab.tsx`, `ProgramList.tsx` (fill the T16 slots)

**Interfaces:**
- Consumes: `ProgramAddBody`, `ProgramChangeBody`, `ProgramEndBody`, `DateBody`, `DateAnswer`, `eventDocumentId`, `dateState`; behaviour reference p3be `src/admin/dashboard/grupe/{ProgramDrawer,DatePanel}.tsx` and strings `src/club/groups/copy/grupe-ui.ts` (already in `copy.ts`).
- Produces (spec 9.8, P4 6.3; only on own Club groups with `editable`):
  - "+ Adaugă program" sheet: "Se repetă" switch; on: "Cât de des" (Săptămânal / La 2 săptămâni / Lunar), "Zile" (square day toggles, solid fill when on), "De la" (time), "Durată" (minutes, 5-step), "Se aplică din" (date, default today, not before today); off: one date, time, duration. `POST coach/groups/<id>/program` -> reload, toast as the admin shows it.
  - Series row "Schimbă" sheet: same fields with "Se aplică din" (default `ProgramRow.nextDate`), `PUT coach/program/<ProgramRow.eventId>`; "Șterge programul" -> `POST coach/program/<eventId>/end { from }`.
  - A one-off class: delete -> `DELETE coach/program/<documentId>`.
  - Date row actions on `open` dates only: "Ține" / "Anulează" / "Mută" (`DateSheet`: reason field as the admin, for Mută a new date and time, tick "Anunță părinții pe e-mail" off by default on Anulează and Mută) -> `PUT coach/program/<eventDocumentId(o)>/dates/<o.date>` with `DateBody` and `notifyParents` (never `notify`).
  - Refusals: 403 no access -> `useNoAccess`; other messages in the sheet's alert line; no undo (S43).

- [ ] **Step 1: Failing e2e:** adding a weekly series Ma, Jo at 17:00 for 50 min posts `{ repeat: true, freq: "weekly", days: ["tue","thu"], startTime: "17:00", durationMin: 50, from: <today> }`; cancelling a future date with the tick on sends `PUT .../program/<documentId>/dates/<date>` whose URL holds the occurrence `documentId` (not the numeric id) and body `{ mode: "cancel", notifyParents: true }`; past and pause rows have no action buttons; "Șterge programul" posts `{ from }`.
- [ ] **Step 2:** `npm run test:e2e -- tests/e2e/portal-program-write.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run this spec and the T16 spec; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): coach Program changes"`

---

### Task 18: Istoric (Haiku, normal)

**Files:**
- Create: `(app)/istoric/page.tsx`, `tests/e2e/portal-history.spec.ts`

**Interfaces:**
- Consumes: `CoachHistory`, `GET coach/history?month=`, `format.ts` (`dateTile`, `addMonths`, `durationText`), `HISTORY` copy.
- Produces (spec 9.9): month switcher (arrows with A11Y labels, month name upper-case as the mockup "OCTOMBRIE", `?luna=` in the URL, default current month); summary line HISTORY summary(`sessions`, `lessons`, `hours`); rows: date tile, `name`, sub by kind (`grup` -> "grup, <n prezenți>", `inlocuitor` -> "înlocuitor, <n prezenți>", `individuala` -> "individuală, <durată>"), link `/prezenta?id=<sessionId>` or `/lectie/<lessonId>`. No desktop list and detail split here (index ruling 9).

- [ ] **Step 1: Failing e2e:** current month shows the summary with "ședințe de grup" and "ore"; a stand-in row reads "înlocuitor, 10 prezenți"; the previous-month arrow changes the URL to `?luna=<prev>` and reloads; a row opens the presence page.
- [ ] **Step 2:** `npm run test:e2e -- tests/e2e/portal-history.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): coach Istoric"`

---

### Task 19: Profil, Setări cont, Securitate (Sonnet, HIGH, RB3)

**Files:**
- Create: `(app)/profil/page.tsx`, `(app)/profil/setari/page.tsx`, `(app)/profil/securitate/page.tsx`, `tests/e2e/portal-profile.spec.ts`

**Interfaces:**
- Consumes: `CoachMe`, `CoachDevice`, `PUT coach/me`, `POST coach/me/password`, `GET coach/me/devices`, `DELETE coach/me/devices/<id>`, `POST auth/logout`, T10 `PasswordField`, `format.relativeDay`.
- Produces (spec 9.10, 5.2, S11, S18):
  - Profil: name, "Antrenor"; rows "Setări cont", "Securitate", "Ieși din cont" (POST `auth/logout`, then `window.location.assign("/intrare")`).
  - Setări cont: "Nume" and "E-mail" read only with the hint; "Telefon" editable + "Salvează" -> PUT `{ phone }` (empty -> null) -> toast; "Schimbă parola": when `hasPassword`, "Parola actuală" + "Parola nouă" + "Salvează" -> POST `{ current, password }`; when not (Google only), a link "Setează o parolă" to `/am-uitat-parola` (S18); success toast `data.toast`, fields cleared; refusals (wrong current, rule texts, 429) shown as sent.
  - Securitate: list "Dispozitiv" | "Ultima dată" rows: label, "acesta" when `current`, `relativeDay(lastSeenAt, today)`; "Deconectează" per row -> DELETE; `revokedCurrent` -> `window.location.assign("/intrare")` (the BFF already cleared cookies, T9); else reload the list.

- [ ] **Step 1: Failing e2e:** Setări shows the e-mail read only (no input) and saving the phone sends `{ phone: "0700000000" }` and shows "Salvat."; a wrong current password shows the mock message and keeps the coach logged in; the Google-only coach sees "Setează o parolă" and no "Parola actuală"; Securitate lists two devices, one marked "acesta"; "Deconectează" on the other reloads with one row; "Deconectează" on "acesta" lands on `/intrare` and `/` then redirects to `/intrare`; "Ieși din cont" lands on `/intrare`.
- [ ] **Step 2:** `npm run test:e2e -- tests/e2e/portal-profile.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): Profil, Setări cont and Securitate"`

---

### Task 20: Full checks and click-through renders (Sonnet, normal)

Runs in a background worktree of `feat/portal` after every task is merged. Never touches the TEST environment.

**Files:**
- Create: `docs/portal/mockups/screens/phase6-renders/*.png`, `docs/portal/mockups/screens/phase6-renders/index.html` (companion screen, `docs/portal/mockups/companion-light.html` prepended), `scripts/portal/clickthrough.mjs` (Playwright script)
- Modify: `docs/portal/DECISIONS.md` (append "plan 6 frontend, decided by Claude (low impact, 2026-11-06)" with rulings 1 to 10 of the index, the G2 calendar choice, and the task-level low-impact choices: T15 no add toast, T18 no desktop split)

- [ ] **Step 1: Full suite.** Run: `npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:scripts && npm run test:e2e && npm run test:a11y`; then `npm run test:visual` (report diffs, never update). Static scan: `grep -rnE "rounded-(full|sm|md|lg|xl|2xl|3xl)\b|border-(dashed|dotted)|[–—·]" "src/app/(antrenor)" src/lib/portal` returns only the Spinner's `rounded-full`. Expected: all green.
- [ ] **Step 2: Real backend, throwaway.** Backend worktree detached at p3be `feat/athletes` HEAD; Postgres `es64-pg` on 127.0.0.1:55464, Strapi on 1384 with `PORTAL_BFF_SECRET=test-bff-secret-000000000000000000`, `PORTAL_HOSTS=antrenor`, Brevo unset; fixtures `scripts/fixtures/phase4-shape.js`, `phase5-shape.js`, `phase6-shape.js` (coach `antrenor1@example.invalid` / `Throwaway-Coach-1`). Next: `NEXT_DIST_DIR=.next-p6 npm run build && npx next start -p 3210` with `STRAPI_INTERNAL_URL=http://localhost:1384`, the same secret.
- [ ] **Step 3: Click-through** (`node scripts/portal/clickthrough.mjs http://antrenor.localhost:3210`): screenshot at 390 x 844 and at 1280 x 800 each of: login, login error, reset step 1, reset step 2, invite valid, invite expired, Azi, Azi empty day, Grupe (others open), own group Sportivi, own group Program Listă, Program Lună, Program add sheet, date sheet, other coach's group, stand-in sheet, presence own, presence Școala, presence archived, presence stand-in, day sheet, existing session dialog, reactivate dialog, new lesson, duration sheet, lesson presence, delete lesson dialog, Adaugă sportiv with results, Sportiv nou, athlete card own, Istoric, Profil, Setări cont, Setări Google only, Securitate. Screens the real fixture cannot reach (archived, Google only, reactivate) use the e2e mock on 3200 / 18891 and say so under the image. Name files `<nn>-<screen>-<phone|desktop>.png`.
- [ ] **Step 4:** Write `index.html` (one section per screen, phone and desktop side by side, light mode overrides first) and list any contract mismatch seen against the real backend (each one a line under "Found against the real backend").
- [ ] **Step 5:** Stop Strapi and Next, remove `es64-pg`, remove the backend worktree.
- [ ] **Step 6: Commit** `git add docs/portal scripts/portal/clickthrough.mjs && git commit -m "docs(portal): phase 6 coach app renders and plan rulings"`

Then: one Opus whole-branch review of `feat/portal` (index "Review batches"), fix wave, and the companion review with the renders before any merge or deploy.
