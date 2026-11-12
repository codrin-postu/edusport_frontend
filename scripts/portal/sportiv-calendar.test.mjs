import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const c = canStripTypes ? await import("../../src/lib/portal/sportiv-calendar.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const item = (over) => ({
  date: "2026-11-12", startTime: "17:30", endTime: "18:30", kind: "grupa", title: "G", location: null, coaches: [], cancelled: false, note: null, ...over,
});

it("a cancelled group item gives only anulata", () => {
  assert.deepEqual(c.sportivMarks([item({ cancelled: true })])["2026-11-12"], ["anulata"]);
});

it("a group and a lesson the same day: grup, individual, once each", () => {
  const marks = c.sportivMarks([item({ kind: "individual" }), item(), item({ startTime: "19:00" })]);
  assert.deepEqual(marks["2026-11-12"], ["grup", "individual"]);
});

it("a competition gives concurs", () => {
  assert.deepEqual(c.sportivMarks([item({ kind: "concurs" })])["2026-11-12"], ["concurs"]);
});

it("itemsOnDay: that date only, by start time, no time last", () => {
  const items = [item({ title: "late", startTime: "19:00" }), item({ title: "none", startTime: null }), item({ title: "early", startTime: "09:00" }), item({ title: "other", date: "2026-11-13" })];
  assert.deepEqual(c.itemsOnDay(items, "2026-11-12").map((i) => i.title), ["early", "late", "none"]);
  assert.deepEqual(c.itemsOnDay(items, "2026-11-20"), []);
});
