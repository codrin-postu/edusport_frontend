import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const s = canStripTypes ? await import("../../src/app/inscrieri/_schedule.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("nextMonthWindow runs to the same day next month", () => {
  assert.deepEqual(s.nextMonthWindow(new Date(2026, 9, 10)), { from: "2026-10-10", to: "2026-11-10" });
  assert.deepEqual(s.nextMonthWindow(new Date(2026, 11, 20)), { from: "2026-12-20", to: "2027-01-20" });
  assert.deepEqual(s.nextMonthWindow(new Date(2027, 0, 31)), { from: "2027-01-31", to: "2027-02-28" });
});

const ev = (type, startDate, endDate, description = null) => ({ type, startDate, endDate, description });
const EVENTS = [
  ev("scoala", "2026-10-10", "2026-10-10"),
  ev("curs", "2026-10-17", "2026-10-18"),
  ev("curs", "2026-10-10", "2026-10-11"),
  ev("anulat", "2026-10-24", "2026-10-25", "Patinoar închis"),
  ev("liber", "2026-10-31", "2026-11-01"),
  ev("concurs", "2026-11-07", "2026-11-08"),
  ev("curs", "2026-11-07", "2026-11-08"),
  ev("curs", "2026-11-14", "2026-11-15"),
  ev("curs", "2026-10-03", "2026-10-04"),
];
const WINDOW = { from: "2026-10-10", to: "2026-11-10" };

it("scheduleWeekends keeps the weekend events in the window, oldest first", () => {
  assert.deepEqual(s.scheduleWeekends(EVENTS, WINDOW), [
    { startDate: "2026-10-10", endDate: "2026-10-11", state: "curs", description: null },
    { startDate: "2026-10-17", endDate: "2026-10-18", state: "curs", description: null },
    { startDate: "2026-10-24", endDate: "2026-10-25", state: "anulat", description: "Patinoar închis" },
    { startDate: "2026-10-31", endDate: "2026-11-01", state: "liber", description: null },
    { startDate: "2026-11-07", endDate: "2026-11-08", state: "curs", description: null },
  ]);
});

it("a weekend that started yesterday still shows", () => {
  assert.equal(s.scheduleWeekends([ev("curs", "2026-10-10", "2026-10-11")], { from: "2026-10-11", to: "2026-11-11" }).length, 1);
});

it("groupByMonth splits by the month a weekend starts in", () => {
  const months = s.groupByMonth(s.scheduleWeekends(EVENTS, WINDOW));
  assert.deepEqual(months.map((m) => [m.month, m.weekends.length]), [["2026-10", 4], ["2026-11", 1]]);
  assert.deepEqual(s.groupByMonth([]), []);
});
