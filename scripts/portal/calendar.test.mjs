import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const c = canStripTypes ? await import("../../src/lib/portal/calendar.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const item = (over) => ({
  kind: "grup", cancelled: false, date: "2026-11-05", startTime: "10:00", durationMin: 60, title: "G", children: 4, location: null,
  done: false, standIn: false, sessionId: null, occurrenceKey: "k", lessonId: null, eventId: null, oneOff: false, ...over,
});
const cal = {
  month: "2026-11", today: "2026-11-05",
  days: [
    { date: "2026-11-05", items: [item({ title: "A" }), item({ title: "B", startTime: "11:00" }), item({ kind: "individual", title: "C", startTime: "15:00", lessonId: "l1" })] },
    { date: "2026-11-11", items: [item({ date: "2026-11-11", cancelled: true })] },
  ],
};

it("marks: one per item in order, cancelled gives anulata", () => {
  assert.deepEqual(c.marksOf(cal)["2026-11-05"], ["grup", "grup", "individual"]);
  assert.deepEqual(c.marksOf(cal)["2026-11-11"], ["anulata"]);
  assert.equal(c.marksOf(cal)["2026-11-06"], undefined);
});

it("items of a day: the answer's items, empty for a quiet day", () => {
  assert.deepEqual(c.itemsOn(cal, "2026-11-05").map((i) => i.title), ["A", "B", "C"]);
  assert.deepEqual(c.itemsOn(cal, "2026-11-06"), []);
});

it("date target: the real event, one-off flag and series date; none without an event or for a lesson", () => {
  const moved = c.dateTargetOf(item({ eventId: "ev1", oneOff: true, date: "2026-11-07", occurrenceKey: "ev1|2026-11-05|10:00" }));
  assert.deepEqual(moved, { documentId: "ev1", date: "2026-11-07", startTime: "10:00", status: "scheduled", cancelReason: null, note: undefined, oneOff: true, originalDate: "2026-11-05" });
  assert.equal(c.dateTargetOf(item({ eventId: "ev1", occurrenceKey: "ev1|2026-11-05|10:00" })).originalDate, null);
  assert.equal(c.dateTargetOf(item({ eventId: "ev1", cancelled: true, reason: "boală" })).status, "cancelled");
  assert.equal(c.dateTargetOf(item({ eventId: null })), null);
  assert.equal(c.dateTargetOf(item({ kind: "individual", eventId: "ev1", lessonId: "l1" })), null);
});
