import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const r = canStripTypes ? await import("../../src/app/(antrenor)/antrenor/(app)/grupe/[id]/_program/rules.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const rule = (extra) => ({ eventId: "a", day: "tue", freq: "weekly", weekOfMonth: null, startTime: "18:15", durationMin: 60, from: "2026-10-01", to: "2027-05-31", untilSeasonEnd: true, nextDate: "2026-11-17", ...extra });

it("a second class on the same weekday keeps its own event", () => {
  const early = rule({ eventId: "early", startTime: "18:15" });
  const late = rule({ eventId: "late", startTime: "19:00" });
  const rules = [early, late];
  assert.equal(r.eventForDate(rules, late, "2026-11-17"), "late");
  assert.equal(r.eventForDate(rules, early, "2026-11-17"), "early");
});

it("a split weekday addresses the row that covers the date, at the same time first", () => {
  const old = rule({ eventId: "old", to: "2026-11-16", untilSeasonEnd: false });
  const next = rule({ eventId: "new", from: "2026-11-17" });
  const other = rule({ eventId: "other", startTime: "19:00", from: "2026-11-17" });
  assert.equal(r.eventForDate([old, other, next], old, "2026-11-24"), "new");
  assert.equal(r.eventForDate([old, next], old, "2026-11-03"), "old");
  assert.equal(r.eventForDate([old], old, "2026-12-01"), "old");
});

it("byWeekday puts the earlier start first inside a weekday", () => {
  const rows = [rule({ eventId: "late", startTime: "19:00" }), rule({ eventId: "mon", day: "mon" }), rule({ eventId: "early" })];
  assert.deepEqual(r.byWeekday(rows).map((x) => x.eventId), ["mon", "early", "late"]);
});
