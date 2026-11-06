import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const f = canStripTypes ? await import("../../src/lib/portal/format.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("formats day tiles and labels", () => {
  assert.equal(f.dayTile("2026-10-06"), "MA 6 OCT");
  assert.equal(f.dayTile("2026-11-01"), "DU 1 NOI");
  assert.deepEqual(f.dateTile("2026-10-07"), { day: "7", weekday: "MI" });
  assert.equal(f.shortDate("2026-09-30"), "30 sep");
  assert.equal(f.shortDate("2026-11-04"), "4 noi");
  assert.equal(f.pickLabel("2026-10-16"), "vineri 16 oct");
});

it("formats durations", () => {
  assert.equal(f.durationText(50), "50 min");
  assert.equal(f.durationText(60), "1 h");
  assert.equal(f.durationText(75), "1 h 15 min");
});

it("names the relative day in Bucharest time", () => {
  // 22:30 UTC on 5 Nov is 00:30 on 6 Nov in Bucharest (UTC+2).
  assert.equal(f.relativeDay("2026-11-05T22:30:00Z", "2026-11-06"), "azi");
  assert.equal(f.relativeDay("2026-11-05T21:30:00Z", "2026-11-06"), "ieri");
  assert.equal(f.relativeDay("2026-11-04T10:00:00Z", "2026-11-06"), "4 noi");
});

it("moves between months", () => {
  assert.equal(f.addMonths("2026-12", 1), "2027-01");
  assert.equal(f.addMonths("2026-01", -1), "2025-12");
  assert.equal(f.firstOfMonth("2026-10-16"), "2026-10-01");
});
