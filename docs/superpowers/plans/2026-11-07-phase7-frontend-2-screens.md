# Phase 7 Frontend 2: Sportiv Screens Implementation Plan

> Refreshed 2026-11-12: see the index note. Tasks renumbered T6 to T13.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every screen of the approved boards on `sportiv.<domain>`, phone and desktop: Acasă (with the performance variant and the promotion moment), Istoric, Calendar, Parcurs with badges, Concursuri and one competition, Abonament și plăți, Setări and Date sportiv; then the full checks, a boot check against backend `main` and a click-through.

**Architecture:** One client page per route under `src/app/(sportiv)/sportiv/(app)/[athleteId]/`, loading through `useSportiv` (T5). Presentation parts next to their page in `_parts/`, composed from the kit; pure mapping in `src/lib/portal/sportiv-*.ts` with Node tests.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, Tailwind 4, Node `--test`, Playwright.

**Spec:** backend `main:docs/superpowers/specs/2026-11-07-sportiv-app-design.md` 6.3 to 6.10, 7, 8.3 to 8.6, 9. Index `2026-11-07-phase7-frontend-index.md`. Boards: `docs/portal/mockups/screens/sportiv-canvas-current/{Main,MainPerf,Promovare,Istoric,Calendar,Progres,Concursuri,ConcursDetaliu,Plati,Setari}.dc.html` and their `Desktop*` boards (Cont and Promovare have none: sheet and dialog are the same layer). Read the board markup, never a screenshot.

## Global Constraints

See the index. Every page: kit `Spinner` while loading, kit `LoadError` ("Nu am putut încărca datele.", "Încearcă din nou") on failure, phone layout first, desktop through `PageHeader`, `PageSub` and `PageBody` / `Columns` as its `Desktop*` board places the parts. Every e2e file runs its text checks at 390 and at 1280 wide (`test.describe` over both viewports); no layout assertions.

## Review Focus

See the index; lines 4 and 5 are owned by Tasks 6 and 10.

---

### Task 6: Acasă and the promotion moment (low, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/page.tsx`, `_parts/{PresenceCard,UpcomingList,AbonamentCard,LastCompetitionCard,PromotionDialog}.tsx`, `src/lib/portal/sportiv-bars.ts`
- Test: `scripts/portal/sportiv-bars.test.mjs`, `tests/e2e/sportiv-home.spec.ts`

**Interfaces:**
- Consumes: `SportivHome`; kit `StatCard`, `SectionHeading`, `PortalCard`, `KeyValueCard`, `Sheet`, `SessionRow`.
- Produces: `barLevel(count: number | null, max: number): number` (0 to 1; null or a zero max 0); `PromotionDialog({ from, to, firstName, onDone })`.

- [ ] **Step 1: Failing tests.** Node: `barLevel(8, 8)` 1, `barLevel(6, 8)` 0.75, `barLevel(null, 8)` 0, `barLevel(0, 0)` 0. e2e as Ana: "Bună, Ana", h1 "Intermediari Bronze", "Școala de patinaj, AFI Cotroceni, 9 ani"; "26" and "prezențe în sezon"; month words "sep" to "feb"; "Următoarele ședințe" with three `SessionRow`s, the first "17:30", "AFI Cotroceni", "Intermediari Bronze", the second "Individual"; "Calendar ›" goes to `/<anaId>/calendar`; abonament "Ședința 5/8" and "A-0124, valabil până la 30 noi" ("valabil până la 30 noi" when `code` is null); "Detalii ›" goes to `/<anaId>/plati`. As Ioana: "Club Performanță", "Advanced Novice Girls, Patinoar Nord, 13 ani", card "Ultimul concurs" with "Locul", "2", "Cupa României 2026", "Advanced Novice Girls, 2 din 18", "98,42", "Toate ›" to `/<ioanaId>/concursuri`; a competition session row reads "Concurs". `skateDown`: that card reads "Rezultatele nu sunt disponibile acum." and the greeting and session rows are present. `noCompetitions` (`lastCompetition: null`): no "Ultimul concurs" text. Stale (`stale: true`): "Rezultatele pot fi mai vechi. Actualizate <d mmm>.". Promotion (`promotion` switch): dialog "Nivel nou" with "Intermediari Bronze", "Intermediari Silver", "Felicitări, Ana! Ai trecut la nivelul următor.", focus on "Mai departe"; clicking it posts `promotion/seen` once (mock log) and after reload no dialog; Escape does the same; with reduced motion (config default) the dialog shows "Intermediari Silver" at once and the old-level element is not attached.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-bars.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-home.spec.ts --workers=2`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Main`, `MainPerf`, `Promovare`, `DesktopMain`, `DesktopMainPerf`; the keyframes of `Promovare.dc.html` lines 16 to 26 go into `portal-theme.css` on the motion tokens.
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/lib/portal src/styles scripts/portal tests/e2e && git commit -m "feat(portal): sportiv Acasă and promotion moment"`

### Task 7: Istoric (low, Haiku)

**Files:**
- Create: `(app)/[athleteId]/istoric/page.tsx`
- Test: `tests/e2e/sportiv-history.spec.ts`

- [ ] **Step 1: Failing e2e.** h1 "Istoric prezență", "Ana Ionescu, sezonul 2026-2027"; "26 prezențe", "22 grup", "4 individuale"; first row "Joi 5 noi, 17:30", "Intermediari Bronze, cu Alina Gheorghe", "Grup"; an individual row "Lecție, cu Andrei Pop", "Individual"; "1 - 20 din 26"; "Înainte" requests `history?page=2` and shows "21 - 26 din 26"; "Înapoi" disabled on page 1, "Înainte" disabled on the last page; `emptyHistory`: "Nicio prezență în acest sezon." and no pager; no "%" in the page text.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-history.spec.ts --workers=2`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Istoric` and `DesktopIstoric` (desktop `Columns half`: summary card and list, as the coach Istoric).
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) tests/e2e && git commit -m "feat(portal): sportiv presence history"`

### Task 8: Calendar and the phone calendar link (low, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/calendar/page.tsx`, `src/lib/portal/sportiv-calendar.ts`
- Modify: `src/app/_portal/ui/MonthGrid.tsx` (`DayMarks` gains `"concurs"`, bar `bg-ice`), `src/app/_portal/ui/CalendarLegend.tsx` (prop `withCompetition?: boolean` adds "concurs"), `src/lib/portal/copy-shared.ts` (`KIT.legend.concurs` "concurs")
- Test: `scripts/portal/sportiv-calendar.test.mjs`, `tests/e2e/sportiv-calendar.spec.ts`

**Interfaces:**
- Produces: `sportivMarks(items: CalendarItem[]): Record<string, DayMarks>` (per date, unique, order `grup`, `individual`, `concurs`, `anulata`; a cancelled item gives only `anulata`); `itemsOnDay(items: CalendarItem[], date: string): CalendarItem[]` (by `startTime`, null last).

- [ ] **Step 1: Failing tests.** Node: a cancelled group item -> `["anulata"]`; a group and a lesson the same day -> `["grup","individual"]`; a competition -> `["concurs"]`; `itemsOnDay` order. e2e: first request is `calendar` with no `month`; "Calendar", "Ana Ionescu, doar ședințele proprii", "Noiembrie 2026"; "Luna trecută" requests `month=2026-10`; "Luna viitoare" is disabled when `nextMonth` is null; legend "grupă", "individual", "concurs", "anulată"; choosing 12 shows "Joi, 12 noiembrie" with rows "Individual" and "Intermediari Bronze"; Enter on a row shows its trainer and "Ora: 17:30 - 18:30"; a cancelled session's opened row reads "anulată"; a competition day row reads "Concurs"; "Adaugă în calendarul telefonului" is a link to `/api/portal/sportiv/athletes/<anaId>/calendar.ics` and clicking it downloads `edusport-ana.ics`.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-calendar.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-calendar.spec.ts tests/e2e/portal-calendar.spec.ts --workers=2`. Expected: FAIL (sportiv), PASS (coach).
- [ ] **Step 3: Implement** from `Calendar` and `DesktopCalendar` with kit `MonthPicker`, `MonthGrid`, `CalendarLegend withCompetition`, `SessionRow`.
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/app/_portal src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): sportiv calendar and phone calendar file"`

### Task 9: Parcurs and badges (low, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/parcurs/page.tsx`, `_parts/{Badge,BadgeZoom}.tsx`, `src/lib/portal/sportiv-badges.ts`
- Modify: `src/styles/portal-theme.css` (tier colours of spec 7 as `--portal-tier-<tier>-{frame,shine,inner}` and `-locked-`, comment "Progres")
- Test: `scripts/portal/sportiv-badges.test.mjs`, `tests/e2e/sportiv-path.spec.ts`

**Interfaces:**
- Produces: `tierWord(t: Tier): string` ("bronz", "argint", "aur", "platină", "gheață"); `badgeAria(b: Badge): string` ("50 de antrenamente, nivel argint", "Concursuri, încă niciunul (blocat)"); `badgeProgress(b: Badge): string | null` ("63 din 100", null when `next` is null).

- [ ] **Step 1: Failing tests.** Node: the examples above. e2e: "Parcurs", "Ana Ionescu, Școala de patinaj"; "Nivelul tău acum", "Intermediari Bronze", "din septembrie 2026, AFI Cotroceni", "Marți și joi, 17:30, cu Alina Gheorghe"; "Următorul nivel", "Intermediari Silver", "Antrenorul decide când treci mai departe."; "Până acum" with "Începători", "sep 2025 - iun 2026", "Primii Pași"; "Realizări" with "50 antrenamente", "Sezon complet", "Prima lecție", "Concursuri"; each badge `role="img"` with its `badgeAria` label; activating "50 antrenamente" (click and Enter) opens a dialog listing "25", "50", "100", "250" with dates or "încă nu" and "63 din 100", "Închide" closes it and focus returns to the badge; with `now: null` the "Nivelul tău acum" card is absent.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-badges.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-path.spec.ts --workers=2`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Progres` and `DesktopProgres` (hexagon shapes, `es-zoom` and `es-dim` keyframes on the motion tokens).
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/lib/portal src/styles scripts/portal tests/e2e && git commit -m "feat(portal): sportiv path and badges"`

### Task 10: Concursuri and one competition (high, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/concursuri/page.tsx`, `concursuri/[resultId]/page.tsx`, `src/lib/portal/sportiv-competitions.ts`
- Test: `scripts/portal/sportiv-competitions.test.mjs`, `tests/e2e/sportiv-competitions.spec.ts`

**Interfaces:**
- Produces: `competitionQuery(s: { q: string; season: string | null; sort: CompetitionSort; page: number }): string` (only those keys, defaults `""`, null, `recent`, 1 left out); `readQuery(params: URLSearchParams): { q; season; sort; page }` (inverse; unknown sort `recent`, page under 1 is 1).

- [ ] **Step 1: Failing tests.** Node: round trip; `sort=evil` -> `recent`; defaults give `""`. e2e as Ioana: "Concursuri", "Ioana Marin, 41 de concursuri"; "Categoria de concurs, sezonul 2026-2027", "Advanced Novice Girls", "din 2025", "înainte: Basic Novice"; "101,07", "record total", "12", "podiumuri", "5", "victorii"; search "Caută" with placeholder "Nume concurs sau oraș", select "Toate sezoanele" plus the `seasons`, select "Cele mai noi", "Cel mai bun loc", "Cele mai multe puncte"; 20 rows and "1 - 20 din 41"; typing "brasov" sends one request with `q=brasov` after 300 ms and the URL keeps `?q=brasov`; reloading keeps the filter; a row opens `/<ioanaId>/concursuri/<resultId>`: "‹ Concursuri", h1 "Cupa României 2026", "Locul 2 din 18", "Total 98,42", "record: 101,07", "Program scurt" with "TES", "PCS", "Deduceri" and the "Element", "Bază", "Scor" table, "Program liber"; "Clasamentul complet (pagina oficială) ›" has `target="_blank"` and `rel="noopener noreferrer"`, and is absent when `officialUrl` is null; `skateDown`: both pages show "Rezultatele nu sunt disponibile acum."; stale: "Rezultatele pot fi mai vechi. Actualizate <d mmm>."; a season with no rows: "Niciun rezultat în acest sezon."; as Ana `/<anaId>/concursuri` shows the 404 page and the mock saw no `competitions` call; no other skater's name of the mock event appears in the page text.
- [ ] **Step 2: Run** `node --test scripts/portal/sportiv-competitions.test.mjs` and `npm run test:e2e -- tests/e2e/sportiv-competitions.spec.ts --workers=2`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Concursuri`, `ConcursDetaliu` and their `Desktop*` boards with kit `CompetitionCard`, `PlaceBlock`, `PointsCell`, `Pager`; native `select`s; wide tables scroll inside their own box. Ana's 404 comes from `current.performance === false` before any request.
- [ ] **Step 4: Run** the same commands. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/lib/portal scripts/portal tests/e2e && git commit -m "feat(portal): sportiv competitions list and detail"`

### Task 11: Abonament și plăți (high, Sonnet)

**Files:**
- Create: `(app)/[athleteId]/plati/page.tsx`, `_parts/{LeftCard,TicketSheet,TicketGrid,PaymentsList,DocumentRow}.tsx`
- Test: `tests/e2e/sportiv-money.spec.ts`

**Interfaces:**
- Consumes: `money`, `payments?page=`, `subscriptions` (three requests on load; `subscriptions` again only when the sheet opens if not loaded).

- [ ] **Step 1: Failing e2e.** "Abonament și plăți", "Ana Ionescu"; "Rămas de plată", "150 RON", "Lecție 12 noi", "Plata se face la club."; a mock where `left` (170) differs from the sum of `lines` (150) shows "170 RON" (the page never adds lines); `nothingOwed`: "Nimic de plată." and no "Plata se face la club."; `advance: 40`: "Avans: 40 RON"; abonament "A-0124", "Școala noiembrie, 1 noi - 30 noi", "Ședința 5 din 8"; "Vezi zilele ›" opens the sheet: 8 boxes, 4 with dates, one "următoarea", "Valabil până la 30 noi, 4 rămase", "Data se poate prelungi dacă școala are un weekend liber.", "Alte abonamente" with "Școala octombrie, 8/8, valabil până la 31 oct"; Escape closes it and focus returns to "Vezi zilele ›"; "Plăți" rows "Abonament noiembrie", "2 noi, numerar", "320 RON"; no "anulată" and no recorder name; pager only when `total` is over 20; "Fișa de înscriere 2026-2027", "PDF", "Descarcă" linking to `/api/portal/sportiv/athletes/<anaId>/documents/acord`, the download answers `application/pdf`; `noDocument`: no "Fișa de înscriere"; no control named "Plătește".
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-money.spec.ts --workers=2`. Expected: FAIL.
- [ ] **Step 3: Implement** from `Plati`, `DesktopPlati` and option A "Grilă curată" of `docs/portal/mockups/screens/ticket-options-v2.html`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) tests/e2e && git commit -m "feat(portal): sportiv abonament, payments and registration PDF"`

### Task 12: Setări and Date sportiv (low, Sonnet)

**Files:**
- Create: `(app)/setari/page.tsx`, `setari/sportiv/[athleteId]/page.tsx`, `setari/parola/page.tsx`, `setari/dispozitive/page.tsx`, `src/app/_portal/ui/DeviceList.tsx` and `src/app/_portal/ui/PasswordForm.tsx` (moved out of the coach `profil/securitate/SecurityView.tsx` and `profil/setari/SettingsView.tsx`)
- Modify: coach `SecurityView.tsx`, `SettingsView.tsx` (use the moved parts, behaviour unchanged)
- Test: `tests/e2e/sportiv-settings.spec.ts`

**Interfaces:**
- Produces: `DeviceList({ apiBase }: { apiBase: "coach/me" | "sportiv/me" })` (list, "Deconectează", `revokedCurrent` -> `/login`); `PasswordForm({ apiPath, email }: { apiPath: "coach/me/password" | "sportiv/me/password"; email: string })`.

- [ ] **Step 1: Failing e2e.** Phone: no bottom nav, back "‹ Înapoi"; "Setări", "Cont: maria.ionescu@example.invalid"; "Contul meu" rows "Nume", "E-mail" with "îl schimbă clubul" and no input, "Telefon"; editing Nume and Telefon in the sheet sends `PUT me` `{ name, phone }` and shows "Salvat."; "Sportivi" rows "Ana Ionescu", "Intermediari Bronze, 9 ani", "Școala" opening "Date sportiv" with "Nume", "Data nașterii", "Vârsta", "Persoană de contact", "Telefon", "E-mail", "Le schimbă clubul."; "Securitate": "Parolă" "schimbată acum 3 luni" (to `/setari/parola`; `hasPassword: false`: "nesetată", to `/forgot-password`), "Dispozitive" "2 dispozitive conectate" (to `/setari/dispozitive`, "Deconectează" sends `DELETE me/devices/<id>`); no text "2FA", "passkey", "chei de acces"; "Notificări": "E-mail la schimbări de program" "pornit", toggling sends `PUT me/notifications` `{ schedule: false }` and shows "oprit"; "E-mail la dispozitiv nou" "mereu pornit" with no switch; "Ieșire" posts `auth/logout` and lands on `/login`. The coach `portal-profile.spec.ts` still passes.
- [ ] **Step 2: Run** `npm run test:e2e -- tests/e2e/sportiv-settings.spec.ts tests/e2e/portal-profile.spec.ts --workers=2`. Expected: FAIL (sportiv), PASS (coach).
- [ ] **Step 3: Implement** from `Setari` and `DesktopSetari`, without the board's 2FA row.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add src/app/\(sportiv\) src/app/\(antrenor\) src/app/_portal tests/e2e && git commit -m "feat(portal): sportiv settings and athlete data"`

### Task 13: Full checks, boot check and click-through (low, Sonnet)

**Files:**
- Create: `scripts/portal/clickthrough-sportiv.mjs` (Playwright), `docs/portal/mockups/screens/phase7-renders/index.html` (companion page, `docs/portal/mockups/companion-light.html` prepended) and its `*-{390,1280}.png`
- Modify: `docs/portal/DECISIONS.md` (append the index "Decided by Claude" list under "2026-11-12 phase 7 frontend, decided by Claude (low impact)")

- [ ] **Step 1: Full suites**, run in the background with nothing else running: `npm run test:scripts`, `npm run test:e2e -- --workers=2`, `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`. Expected: PASS.
- [ ] **Step 2: Boot check.** Backend: a detached worktree of `main` (`716b4cc`) at `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p7fe-boot`; Postgres `postgres:16` container `es74-pg` on 127.0.0.1:55468; Strapi on 1388 with the env of backend `docs/superpowers/plans/2026-11-07-phase7-index.md`; fixtures `phase4-shape.js` to `phase7-shape.js` with `ES_THROWAWAY_DB=1`; `node scripts/fake-skate.mjs 18894`. Next on 3218 with `PORTAL_HOST_SPORTIV=sportiv.localhost:3218`, `PORTAL_HOST_ANTRENOR=antrenor.localhost:3218`, `PORTAL_STRAPI_URL=http://127.0.0.1:1388` and the same BFF secret. Expected: `curl -H 'Host: sportiv.localhost:3218' http://127.0.0.1:3218/robots.txt` prints "Disallow: /".
- [ ] **Step 3: Click-through** `node scripts/portal/clickthrough-sportiv.mjs http://sportiv.localhost:3218`: logs in as `parinte1@example.invalid` (`Throwaway-Parent-1`) and `sportiv18@example.invalid`, opens every screen (login, login error, reset, invite, picker, account menu, Acasă Ana, Acasă Ioana, promotion, Istoric and page 2, Calendar and a day, Parcurs, badge zoom, Concursuri, filtered, detail, competitions down, Abonament și plăți, ticket sheet, Setări, Date sportiv, Dispozitive), fails on any page error or on "Rămas de plată" differing from the `left` of the `money` response, and saves `<nn>-<screen>-390.png` and `-1280.png` for the companion page (manual comparison with the boards; not a baseline, no assertions).
- [ ] **Step 4: Clean up**: stop Next, Strapi and the fake, `docker rm -f es74-pg`, `git -C /Users/codrin/Documents/Programming/edusport_backend worktree remove .claude/worktrees/p7fe-boot`.
- [ ] **Step 5: Commit** `git add docs/portal/mockups/screens/phase7-renders scripts/portal/clickthrough-sportiv.mjs docs/portal/DECISIONS.md && git commit -m "docs(portal): phase 7 sportiv renders and decisions"`
</content>
</invoke>
