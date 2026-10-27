# Phase 4-7: Website Program from the Groups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/cursuri/program` shows the same notebook as today, now built from the Școala groups through the new public `GET /api/club/schedule` (falling back to `program.scheduleGroups` while the groups have no series or the read fails); the season calendar on `/cursuri/program` and "Programul pe următoarea lună" on `/inscrieri` keep one Școala tile per school day by merging every Școala group date of a day (W21), and Club group dates stay one tile each, titled with the group name.

**Architecture:** Two pure modules with type-only imports, tested with Node's type stripping like `src/lib/club-public.ts`: `src/lib/club-schedule.ts` (parse the schedule answer, pick the school with slots, turn slots into the notebook's `ScheduleGroup[]`) and `src/utils/scoala-days.ts` (merge the Școala occurrences of a day into one, W21). `src/lib/club-schedule-fetch.ts` fetches with a 60 s revalidate; `occurrences-to-calendar.ts` runs the merge before it builds the tiles and the weekend model, so both pages change at once. No component changes: `ScheduleSection` and `SeasonCalendarViewV2` receive the same shapes as before.

**Tech Stack:** Next.js (React 18+), TypeScript, Node `--test` for pure scripts, Playwright e2e against the mock Strapi (`tests/e2e/mock-strapi.mjs`).

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/specs/2026-10-27-groups-schedules-design.md` (v1.1, backend branch `feat/athletes`), sections 8.3 (public reads), 9.1 to 9.3 (website), 12 (website unit tests and renders); mockup `/Users/codrin/Documents/Programming/edusport_frontend/docs/portal/mockups/screens/phase4/program-site.html` option A (the notebook; its Club notebook is not built, m4 8). Backend contract: backend plan 4-2 (`GET /api/club/schedule`, occurrences with `groupName`). Decisions: `docs/portal/DECISIONS.md`. Agent rules: `/Users/codrin/Documents/Programming/edusport_backend/.superpowers/phase3-shared/agent-rules.md`. Index: `/Users/codrin/Documents/Programming/edusport_backend/.claude/worktrees/p3be/docs/superpowers/plans/2026-10-27-phase4-index.md`.

**Base:** `feat/athletes` of the frontend. The code needs no backend to build (the fallback keeps today's page); the backend contract is plan 4-2's, and the renders use the e2e mock. Runs in parallel with backend plans 4-3 to 4-6 once plan 4-2 is written (merged is not needed for this repo).

**Parallel groups:** A: T1, T2 | B: T3 | C: T4

| Group | Tasks | Runs after | Why they do not collide |
|---|---|---|---|
| A | 1 Schedule read, 2 Școala day merge | nothing | 1: club-schedule.ts, club-schedule-fetch.ts, scripts/club/club-schedule.test.mjs; 2: scoala-days.ts, strapi-calendar.ts (type), occurrences-to-calendar.ts, scripts/club/scoala-days.test.mjs |
| B | 3 Page wiring, mock and e2e | A | cursuri/program/page.tsx, tests/e2e/mock-strapi.mjs, tests/e2e/program.spec.ts |
| C | 4 Checks and renders | B | no repo files |

## Decided while planning (low impact, decided by Claude; the user may overrule any line)

Log them in DECISIONS.md as "plan 4-7, decided by Claude (low impact, 2026-10-27)".

1. **Slot text** in the notebook: "09:00 - 09:50" (the same form as today's CMS slots, `start - end`).
2. **Which school** feeds the notebook with 2+ schools: the first entry of `/api/club/schedule` that has slots (backend plan 4-2 orders schools by section order); with one school nothing changes.
3. **Fallback** to `program.scheduleGroups` when the schedule read fails or answers no slots (spec 9.1); the empty text "Programul sezonului va fi publicat în curând." stays for both empty.
4. **The merged Școala tile's state uses today's per-date reading** (a date cancelled for any reason that is not a break reads "anulat", a break reads "liber", as `groupForOccurrence` does today), then W21's rule over the day's dates; its note is the first non-empty note (break name or reason).
5. **The weekend model on `/inscrieri`** reads the merged days, so a weekend with two groups at different hours is still one "curs" weekend.

## Global Constraints

- Frontend repo `/Users/codrin/Documents/Programming/edusport_frontend`, integration branch `feat/athletes`. Commit only in the worktree your dispatch names (never in p3fe itself); check `git rev-parse --show-toplevel` and `git branch --show-current` before every commit.
- Checks after every task: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, `npm run test:scripts`; after Task 3 also `npm run test:e2e`. Never `npm run test:visual:update`; if `npm run test:visual` reports the program page changed, report the diff to the user (renders are reviewed after implementation).
- Code: TypeScript, no `any`, functions under 30 lines, complexity under 10; match the surrounding file's quote style (this repo's files use double quotes); pure modules have type-only imports (Node loads them with type stripping).
- Copy: no new visible text except what the spec gives; Romanian; no em dash, no middle dot, straight quotes. The CMS subtitle and the TEST tile "Weekend curs" keep an existing middle dot (spec Open 3): not changed here.
- Design: no component or style change; tokens only if any style is touched; no dashed or dotted lines; no pills or circles.
- Caching (spec 9.3): `/cursuri/program` keeps `revalidate = 300`; the occurrences fetch keeps 300 s; the schedule fetch 60 s.
- Synthetic data only; never production; never the TEST environment (ports 1340 / 3010, `edusport-test-pg`) or `strapi_app` / `strapi_db` / 1337. Renders use the e2e mock on its own ports (3200 / 18890) or free ones.
- Commits: Conventional Commits, exactly the message in the task, no `Co-Authored-By`, no AI attribution. Never push.
- Progress board: `printf '%s | 4-7 T<n> | implementer | <status>\n' "$(date -u +%H:%M)" >> /Users/codrin/Documents/Programming/edusport_backend/.superpowers/phase3-shared/progress-board.md`.

## Review Focus

- **Before the migration** (`/api/club/schedule` answers no slots) and **when the backend is down**: the notebook shows `program.scheduleGroups` exactly as today; nothing throws. Pinned by Task 1 (`notebookGroups` fallback) and Task 3 (the page passes the CMS series as the fallback).
- **A day with several Școala groups**: one tile, "curs" while any group holds class, its time span from the first start to the last end; a day where every group is in a break shows "liber" with the break's name; a day where one group is cancelled and the others hold stays "curs". Pinned by Task 2.
- **The weekends list on `/inscrieri`** keeps one row per weekend with the same states as before for a single old Școala series (the data before the migration). Pinned by Task 2 (`scripts/inscrieri/schedule.test.mjs` unchanged and green) and Task 3.
- **Club dates**: one tile per date titled with the group name; cancelled Club dates not shown (as today). Pinned by Task 2.
- **A slot answer with odd data** (a missing `end`, an empty `groups`, a non-array): parsed defensively, empty slots dropped, the fallback used when nothing is left. Pinned by Task 1.

---

## File Structure

```
src/lib/club-schedule.ts          ScheduleSlot, SchoolSchedule, parseClubSchedule, slotsToGroups, notebookGroups (T1)
src/lib/club-schedule-fetch.ts    fetchClubSchedule (60 s) (T1)
src/lib/strapi-calendar.ts        CalendarOccurrence gains groupName, originalDate, originalStartTime (T2)
src/utils/scoala-days.ts          mergeScoalaDays (T2)
src/utils/occurrences-to-calendar.ts   merged Școala days; Club tiles titled with the group name (T2)
src/app/cursuri/program/page.tsx  notebook from the schedule, fallback (T3)
tests/e2e/mock-strapi.mjs         /api/club/schedule (T3)
tests/e2e/program.spec.ts         notebook and fallback (T3)
scripts/club/club-schedule.test.mjs, scripts/club/scoala-days.test.mjs   (T1, T2)
```

---

### Task 1: The schedule read

**Files:**
- Create: `src/lib/club-schedule.ts`, `src/lib/club-schedule-fetch.ts`
- Test: `scripts/club/club-schedule.test.mjs`

**Interfaces:**
- Consumes: `ScheduleGroup` type (`src/app/cursuri/program/_types.ts`), `STRAPI_BASE` (`src/lib/strapi-base.ts`).
- Produces:
  - `ScheduleSlot = { start: string; end: string; groups: string[] }`, `SchoolSchedule = { section: { name: string; slug: string }; slots: ScheduleSlot[] }`.
  - `parseClubSchedule(raw: unknown): SchoolSchedule[]` (defensive), `slotsToGroups(slots): ScheduleGroup[]` (`{ timeSlot: "09:00 - 09:50", courses }`), `notebookGroups(schedule, fallback): ScheduleGroup[]` (the first school with slots, else the fallback).
  - `fetchClubSchedule(): Promise<SchoolSchedule[]>` (`next: { revalidate: 60 }`; `[]` on any failure).

- [ ] **Step 1: Write the failing test**

`scripts/club/club-schedule.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const lib = canStripTypes ? await import("../../src/lib/club-schedule.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const SCHOOL = (slots) => ({ section: { name: "Școala de Patinaj - AFI Cotroceni", slug: "scoala-afi" }, slots });
const SLOTS = [
  { start: "09:00", end: "09:50", groups: ["Avansați Gold"] },
  { start: "10:00", end: "10:50", groups: ["Primii Pași", "Intermediari Silver", "Avansați Silver"] },
];
const FALLBACK = [{ timeSlot: "10:00 - 10:50", courses: ["Primii Paşi"] }];

it("parseClubSchedule keeps a well-formed answer and drops broken parts", () => {
  assert.deepEqual(lib.parseClubSchedule([SCHOOL(SLOTS)]), [SCHOOL(SLOTS)]);
  assert.deepEqual(lib.parseClubSchedule([SCHOOL([{ start: "11:00", groups: ["A"] }, { start: "12:00", end: "12:50", groups: [] }, ...SLOTS])]), [SCHOOL(SLOTS)]);
  assert.deepEqual(lib.parseClubSchedule({ data: 1 }), []);
  assert.deepEqual(lib.parseClubSchedule([{ section: null, slots: SLOTS }]), []);
});

it("slotsToGroups writes the notebook's time slot text", () => {
  assert.deepEqual(lib.slotsToGroups(SLOTS), [
    { timeSlot: "09:00 - 09:50", courses: ["Avansați Gold"] },
    { timeSlot: "10:00 - 10:50", courses: ["Primii Pași", "Intermediari Silver", "Avansați Silver"] },
  ]);
});

it("notebookGroups reads the first school with slots, else the CMS fallback", () => {
  assert.deepEqual(lib.notebookGroups([SCHOOL([]), SCHOOL(SLOTS)], FALLBACK).length, 2);
  assert.deepEqual(lib.notebookGroups([SCHOOL([])], FALLBACK), FALLBACK);
  assert.deepEqual(lib.notebookGroups([], []), []);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/club/club-schedule.test.mjs`
Expected: FAIL (`Cannot find module ... club-schedule.ts`).

- [ ] **Step 3: Write `club-schedule.ts` and `club-schedule-fetch.ts`**

`src/lib/club-schedule.ts`:

```ts
// ---------------------------------------------------------------------------
// The Școala notebook on /cursuri/program, read from GET /api/club/schedule
// (backend plan 4-2): per school, the time slots of the public, active Școala
// groups in the current season. The CMS `program.scheduleGroups` stays the
// fallback (spec 9.1). No runtime imports: scripts/club/club-schedule.test.mjs
// loads this file with node's type stripping.
// ---------------------------------------------------------------------------

import type { ScheduleGroup } from "@/app/cursuri/program/_types";

export type ScheduleSlot = { start: string; end: string; groups: string[] };
export type SchoolSchedule = { section: { name: string; slug: string }; slots: ScheduleSlot[] };

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const isTime = (v: unknown): v is string => typeof v === "string" && /^\d{2}:\d{2}$/.test(v);
const names = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : []);

function parseSlot(v: unknown): ScheduleSlot | null {
  if (!isRecord(v) || !isTime(v.start) || !isTime(v.end)) return null;
  const groups = names(v.groups);
  return groups.length ? { start: v.start, end: v.end, groups } : null;
}

function parseSchool(v: unknown): SchoolSchedule | null {
  if (!isRecord(v) || !isRecord(v.section) || typeof v.section.name !== "string" || typeof v.section.slug !== "string") return null;
  const slots = Array.isArray(v.slots) ? v.slots.map(parseSlot).filter((s): s is ScheduleSlot => s !== null) : [];
  return { section: { name: v.section.name, slug: v.section.slug }, slots };
}

export function parseClubSchedule(raw: unknown): SchoolSchedule[] {
  return Array.isArray(raw) ? raw.map(parseSchool).filter((s): s is SchoolSchedule => s !== null) : [];
}

/** "09:00 - 09:50" (decided 1). */
export const slotsToGroups = (slots: ScheduleSlot[]): ScheduleGroup[] => slots.map((s) => ({ timeSlot: `${s.start} - ${s.end}`, courses: s.groups }));

/** The first school with slots (decided 2), else the CMS series (spec 9.1 fallback, decided 3). */
export function notebookGroups(schedule: SchoolSchedule[], fallback: ScheduleGroup[]): ScheduleGroup[] {
  const school = schedule.find((s) => s.slots.length > 0);
  return school ? slotsToGroups(school.slots) : fallback;
}
```

`src/lib/club-schedule-fetch.ts`:

```ts
import { STRAPI_BASE } from "./strapi-base";
import { parseClubSchedule, type SchoolSchedule } from "./club-schedule";

/** The backend caches this answer for 60 s (`Cache-Control: public, max-age=60`, spec 9.3). */
const REVALIDATE_SECONDS = 60;

/** GET /api/club/schedule; [] when the backend is unreachable or the body is unusable, so the page falls back. */
export async function fetchClubSchedule(): Promise<SchoolSchedule[]> {
  try {
    const res = await fetch(`${STRAPI_BASE}/api/club/schedule`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return [];
    const json = (await res.json().catch(() => null)) as { data?: unknown } | null;
    return parseClubSchedule(json?.data);
  } catch {
    return [];
  }
}
```

- [ ] **Step 4: Run the tests and checks**

Run: `node --test scripts/club/club-schedule.test.mjs && npm run test:scripts && npx tsc --noEmit && npm run lint`
Expected: PASS; zero type errors; lint clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/club-schedule.ts src/lib/club-schedule-fetch.ts scripts/club/club-schedule.test.mjs
git commit -m "feat(program): read the Școala notebook from the groups, CMS series as fallback"
```

---

### Task 2: One Școala tile per day

**Files:**
- Create: `src/utils/scoala-days.ts`
- Modify: `src/lib/strapi-calendar.ts` (`CalendarOccurrence` gains optional `groupName`, `originalDate`, `originalStartTime`)
- Modify: `src/utils/occurrences-to-calendar.ts` (merge first; Club tiles titled with the group name)
- Test: `scripts/club/scoala-days.test.mjs`

**Interfaces:**
- Consumes: `CalendarOccurrence` (type).
- Produces: `mergeScoalaDays(occurrences: CalendarOccurrence[]): CalendarOccurrence[]` (one `scoala` occurrence per date: title "Școala de patinaj"; state "curs" when any of the day's dates holds class, else "anulat" when any is cancelled, else "liber"; `startTime` the first start, `endTime` the last end; `note` the first non-empty note; `status` / `cancelReason` / `state` set so the existing `groupForOccurrence` reads that state). `occurrencesToCalendarEvents` keeps its signature.

- [ ] **Step 1: Write the failing test**

`scripts/club/scoala-days.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const lib = canStripTypes ? await import("../../src/utils/scoala-days.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const occ = (over) => ({
  eventId: 1, title: "Intermediari Bronze", type: "scoala", label: null, color: null, order: 0, date: "2026-11-14", startTime: "11:00", endTime: "11:50",
  status: "scheduled", cancelReason: null, state: "curs", note: null, groupName: "Intermediari Bronze", ...over,
});

it("merges a day's Școala dates into one tile with the time span (W21)", () => {
  const out = lib.mergeScoalaDays([occ({ startTime: "10:00", endTime: "10:50" }), occ({}), occ({ startTime: "09:00", endTime: "09:50", eventId: 3 })]);
  assert.equal(out.length, 1);
  assert.deepEqual([out[0].title, out[0].startTime, out[0].endTime, out[0].state, out[0].status], ["Școala de patinaj", "09:00", "11:50", "curs", "scheduled"]);
});

it("is curs while any group holds class, anulat when every date is cancelled, liber when every date is in a break", () => {
  const cancel = occ({ status: "cancelled", cancelReason: "exception", state: "anulat", note: "Competiție" });
  const brk = occ({ status: "cancelled", cancelReason: "blackout", note: "Vacanța de iarnă" });
  assert.equal(lib.mergeScoalaDays([cancel, occ({})])[0].state, "curs");
  assert.deepEqual([lib.mergeScoalaDays([cancel, brk])[0].state, lib.mergeScoalaDays([cancel, brk])[0].note], ["anulat", "Competiție"]);
  const liber = lib.mergeScoalaDays([brk, occ({ status: "cancelled", cancelReason: "blackout", note: "Vacanța de iarnă" })])[0];
  assert.deepEqual([liber.state, liber.status, liber.cancelReason, liber.note], ["liber", "cancelled", "blackout", "Vacanța de iarnă"]);
});

it("keeps days apart, sorted, and leaves a single old series as it was", () => {
  const out = lib.mergeScoalaDays([occ({ date: "2026-11-15" }), occ({})]);
  assert.deepEqual(out.map((o) => o.date), ["2026-11-14", "2026-11-15"]);
  const old = occ({ title: "Școala de patinaj", groupName: null, status: "cancelled", cancelReason: "exception", state: "liber", note: "Vacanța de toamnă" });
  assert.deepEqual([lib.mergeScoalaDays([old])[0].state, lib.mergeScoalaDays([old])[0].note], ["anulat", "Vacanța de toamnă"]);
});
```

The last assertion pins decided 4: today's website reads a cancelled old "liber" date as "anulat" (`groupForOccurrence`); the merge keeps that reading.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/club/scoala-days.test.mjs`
Expected: FAIL (`Cannot find module ... scoala-days.ts`).

- [ ] **Step 3: Write `scoala-days.ts`**

```ts
// ---------------------------------------------------------------------------
// One Școala de patinaj tile per school day (phase 4 spec 9.2, W21): every
// `scoala` occurrence of a date (one per Școala group after phase 4) is merged
// into one. No runtime imports: scripts/club/scoala-days.test.mjs loads this
// file with node's type stripping.
// ---------------------------------------------------------------------------

import type { CalendarOccurrence } from "@/lib/strapi-calendar";

type DayState = "curs" | "liber" | "anulat";
const TITLE = "Școala de patinaj";

/** Today's reading of one date (as `groupForOccurrence`): a break is "liber", any other cancellation "anulat" (decided 4). */
function stateOf(o: CalendarOccurrence): DayState {
  if (o.status === "cancelled") return o.cancelReason === "blackout" ? "liber" : "anulat";
  return o.state === "anulat" || o.state === "liber" ? o.state : "curs";
}

/** W21: curs if any date holds class, else anulat if any is anulat, else liber. */
function dayState(day: CalendarOccurrence[]): DayState {
  const states = day.map(stateOf);
  if (states.includes("curs")) return "curs";
  return states.includes("anulat") ? "anulat" : "liber";
}

const STATUS: Record<DayState, Pick<CalendarOccurrence, "status" | "cancelReason">> = {
  curs: { status: "scheduled", cancelReason: null },
  anulat: { status: "cancelled", cancelReason: "exception" },
  liber: { status: "cancelled", cancelReason: "blackout" },
};

function merged(day: CalendarOccurrence[]): CalendarOccurrence {
  const state = dayState(day);
  const starts = day.map((o) => o.startTime).filter((t): t is string => !!t).sort();
  const ends = day.map((o) => o.endTime).filter((t): t is string => !!t).sort();
  return {
    ...day[0], title: TITLE, label: null, groupName: null, state, ...STATUS[state],
    startTime: starts[0] ?? null, endTime: ends[ends.length - 1] ?? null,
    note: day.map((o) => o.note).find((n) => n && n.trim()) ?? null,
  };
}

export function mergeScoalaDays(occurrences: CalendarOccurrence[]): CalendarOccurrence[] {
  const byDate = new Map<string, CalendarOccurrence[]>();
  for (const o of occurrences) byDate.set(o.date, [...(byDate.get(o.date) ?? []), o]);
  return [...byDate.keys()].sort().map((date) => merged(byDate.get(date) as CalendarOccurrence[]));
}
```

- [ ] **Step 4: Occurrence type and the conversion**

`src/lib/strapi-calendar.ts`, in `CalendarOccurrence` add:

```ts
  /** Phase 4: the group of a group date (public groups only), and where a moved date came from. */
  groupName?: string | null;
  originalDate?: string | null;
  originalStartTime?: string | null;
```

`src/utils/occurrences-to-calendar.ts`:

```ts
import { mergeScoalaDays } from "@/utils/scoala-days";
```

In `occurrencesToCalendarEvents`, replace the first line with:

```ts
  const scoala = mergeScoalaDays(occurrences.filter((o) => o.type === "scoala"));
```

and in the "Other events" `flush`, title the tile with the group's name when there is one:

```ts
        title: first.groupName ?? occurrenceTitle(first),
```

Everything else (tiles, weekend buckets, Club runs) stays: the merged day is one `scoala` occurrence per date, so the weekend model sees one per day.

- [ ] **Step 5: Run the tests and checks**

Run: `node --test scripts/club/scoala-days.test.mjs && npm run test:scripts && npx tsc --noEmit && npm run lint && npm run check:tokens`
Expected: PASS (`scripts/inscrieri/schedule.test.mjs` unchanged and green); zero type errors.

- [ ] **Step 6: Commit**

```bash
git add src/utils/scoala-days.ts src/utils/occurrences-to-calendar.ts src/lib/strapi-calendar.ts scripts/club/scoala-days.test.mjs
git commit -m "feat(program): one Școala tile per day from every group, Club tiles named after their group"
```

---

### Task 3: Page wiring, the mock and e2e

**Files:**
- Modify: `src/app/cursuri/program/page.tsx`
- Modify: `tests/e2e/mock-strapi.mjs` (`/api/club/schedule`, `/api/program`)
- Create: `tests/e2e/program.spec.ts`

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: `/cursuri/program` passes `notebookGroups(schedule, program.scheduleGroups)` as `scheduleGroups`.

- [ ] **Step 1: Write the failing e2e test and the mock route**

`tests/e2e/mock-strapi.mjs`: add the school schedule next to `SETTINGS`, and two routes before the 404 line (`/api/program` answers the old CMS series, so the test sees which source the notebook used):

```js
const SCHEDULE = [{
  section: { name: "Școala de Patinaj - AFI Cotroceni", slug: "afi-cotroceni" },
  slots: [
    { start: "09:00", end: "09:50", groups: ["Avansați Gold"] },
    { start: "10:00", end: "10:50", groups: ["Primii Pași", "Intermediari Silver", "Avansați Silver"] },
    { start: "11:00", end: "11:50", groups: ["Începători", "Intermediari Bronze", "Avansați Bronze"] },
  ],
}];
```

```js
  if (url.pathname === "/api/club/schedule") return json(res, 200, { data: SCHEDULE });
  if (url.pathname === "/api/program") return json(res, 200, { data: { scheduleGroups: [{ timeSlot: "10:00 - 10:50", courses: ["Primii Paşi"] }] } });
```

`tests/e2e/program.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("the Program notebook lists the Școala groups by time, comma letters", async ({ page }) => {
  await page.goto("/cursuri/program");
  const notebook = page.locator("section", { hasText: "Program Școala de Patinaj" });
  await expect(notebook.getByText("09:00 - 09:50")).toBeVisible();
  await expect(notebook.getByText("- Primii Pași")).toBeVisible();
  await expect(notebook.getByText("- Avansați Bronze")).toBeVisible();
  await expect(notebook.getByText("Primii Paşi")).toHaveCount(0);
});
```

The fallback is pinned by Task 1's unit test; the e2e build prerenders once against one mock, so the empty-schedule path is not run in the browser (one build per e2e run).

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/program.spec.ts`
Expected: FAIL (the notebook still shows the CMS fallback text "Primii Paşi", or the empty text, because the page does not read the schedule yet).

- [ ] **Step 3: Wire the page**

In `src/app/cursuri/program/page.tsx`:

```ts
import { fetchClubSchedule } from "@/lib/club-schedule-fetch";
import { notebookGroups } from "@/lib/club-schedule";
```

Add `fetchClubSchedule()` to the `Promise.allSettled` list (fourth entry) and read it:

```ts
  const [cmsResult, programResult, clubResult, scheduleResult] = await Promise.allSettled([
    fetchStrapi<CmsShape>("program-page", "populate[disclaimers]=true", false),
    fetchStrapi<ProgramShape>("program"),
    fetchPublicClubInfo(),
    fetchClubSchedule(),
  ]);
  const schedule = scheduleResult.status === "fulfilled" ? scheduleResult.value : [];
```

and in `data`:

```ts
    scheduleGroups: notebookGroups(schedule, program?.scheduleGroups?.length ? program.scheduleGroups : []),
```

Update the comment above `ProgramShape` to say the CMS series is now the fallback (spec 9.1).

- [ ] **Step 4: Run the tests and checks**

Run: `npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:scripts && npm run test:e2e`
Expected: PASS (the registration e2e unchanged: its weekends come from the same single mock series, now merged per day).

- [ ] **Step 5: Commit**

```bash
git add src/app/cursuri/program/page.tsx tests/e2e/mock-strapi.mjs tests/e2e/program.spec.ts
git commit -m "feat(program): Program page notebook from the groups' schedule"
```

---

### Task 4: Checks and renders

**Files:** none in the repo. PNGs to `/Users/codrin/Documents/Programming/edusport_frontend/docs/portal/mockups/screens/phase4-renders/` with the prefix `4-7-` (not committed by this task).

**Interfaces:**
- Consumes: everything above, the e2e mock.
- Proves (spec 12): `/cursuri/program` at 1440x900 and 390x844 with the notebook from the schedule and the calendar month; `/inscrieri` "Programul pe următoarea lună"; compared with `/Users/codrin/Documents/Programming/edusport_frontend/docs/portal/mockups/screens/phase4/program-site-desktop.png` / `-phone.png` (option A, without its Club notebook).

- [ ] **Step 1: Full checks**

```bash
REPO=$(git rev-parse --show-toplevel); cd "$REPO"
npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:scripts && npm run test:e2e
npm run test:visual || true
```

Expected: all green; `test:visual` may report the program page as changed (the notebook text is the same; any pixel difference is listed for the user, never re-recorded here).

- [ ] **Step 2: Serve the e2e build against the mock and render**

```bash
T="${TMPDIR:-/tmp}/es47"; mkdir -p "$T"
OUT=/Users/codrin/Documents/Programming/edusport_frontend/docs/portal/mockups/screens/phase4-renders; mkdir -p "$OUT"
node tests/e2e/mock-strapi.mjs 18897 > "$T/mock.log" 2>&1 & echo $! > "$T/mock.pid"
(STRAPI_INTERNAL_URL=http://localhost:18897 NEXT_PUBLIC_STRAPI_URL=http://localhost:18897 NEXT_DIST_DIR=.next-p47 npm run build && STRAPI_INTERNAL_URL=http://localhost:18897 NEXT_PUBLIC_STRAPI_URL=http://localhost:18897 NEXT_DIST_DIR=.next-p47 npx next start -p 3207 > "$T/next.log" 2>&1 & echo $! > "$T/next.pid")
until curl -s -o /dev/null -w '%{http_code}' http://localhost:3207/api/health | grep -q 200; do sleep 2; done
cat > "$T/shots.py" <<'PY'
import asyncio, sys
from playwright.async_api import async_playwright
OUT = sys.argv[1]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for tag, size in (('desktop', {'width': 1440, 'height': 900}), ('phone', {'width': 390, 'height': 844})):
            pg = await (await b.new_context(viewport=size)).new_page()
            for path, name in (('/cursuri/program', 'program'), ('/inscrieri', 'inscrieri')):
                await pg.goto('http://localhost:3207' + path); await pg.wait_for_timeout(2500)
                await pg.screenshot(path=f'{OUT}/4-7-{name}-{tag}.png', full_page=True)
                print(name, tag, await pg.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'))
        await b.close()
asyncio.run(main())
PY
python3 "$T/shots.py" "$OUT"
```

Expected: four PNGs; each line ends with `True` (no horizontal scroll). Port 3207 and 18897 are free choices; never 3010 or 1340.

- [ ] **Step 3: Look and clean up**

Open `phase4-renders/4-7-program-*.png` beside `phase4/program-site-*.png` (option A notebook): the same notebook look, "Sâmbătă & Duminică" / "Program Școala de Patinaj", three time blocks with the groups in order, comma letters, no Club notebook; the calendar tiles one per school day. Show them to the user in the companion. Then:

```bash
kill "$(cat "$T/next.pid")" "$(cat "$T/mock.pid")"
rm -rf "$T" .next-p47
```

No commit unless a check failed (then a `fix(program): ...` commit in the owning task's files and the steps repeated).

---

## Self-review

- **Spec coverage.** 8.3 contract consumed (schedule, `groupName`); 9.1 notebook from `/api/club/schedule`, Școala only, header and CMS subtitle unchanged, fallback to `program.scheduleGroups`, empty text kept (T1, T3); 9.2 one Școala tile per day with W21's rule, time span and note, the weekend model and `/inscrieri` reading the merged result, Club tiles titled with the group name, cancelled Club dates hidden as today (T2, T3); 9.3 revalidate values (T1 fetch 60 s; page 300 s and occurrences 300 s unchanged) (T1, T3); 12 website unit tests (T1, T2), e2e (T3), renders (T4).
- **Placeholder scan:** code in every code step; the visual-test note says exactly what to report.
- **Type consistency:** `ScheduleGroup` is the notebook's existing type; `CalendarOccurrence` optional fields keep every caller compiling; `mergeScoalaDays` returns `CalendarOccurrence[]` for the unchanged conversion.
- **Review Focus:** fallback (T1, T3), merged days (T2), `/inscrieri` weekends (T2, T3), Club tiles (T2), odd answers (T1).
