import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const f = canStripTypes ? await import("../../src/lib/portal/format.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("formats day tiles and labels", () => {
  assert.deepEqual(f.dateTile("2026-10-07"), { day: "7", weekday: "MI" });
  assert.equal(f.shortDate("2026-09-30"), "30 sep");
  assert.equal(f.shortDate("2026-11-04"), "4 noi");
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

it("formats phone links and canvas dates", () => {
  assert.deepEqual(f.phoneLinks("0722 000 222"), { tel: "tel:+40722000222", wa: "https://wa.me/40722000222" });
  assert.deepEqual(f.phoneLinks("+40 722 000 222"), { tel: "tel:+40722000222", wa: "https://wa.me/40722000222" });
  assert.equal(f.phoneLinks("0722"), null);
  assert.equal(f.weekdayShort("2026-11-05"), "Joi");
  assert.equal(f.weekdayShort("2026-11-07"), "Sâm");
  assert.equal(f.monthShort("2026-11-05"), "Noi");
  assert.equal(f.longDay("2026-11-04"), "Miercuri, 4 noiembrie");
  assert.equal(f.shortWhen("2026-11-05"), "Joi, 5 noi");
  assert.equal(f.dayMonthYear("2026-10-26"), "26 oct 2026");
  assert.equal(f.dayMonthShort("2026-11-12"), "12 noi");
});

it("speaks days and weeks for the training form", () => {
  assert.equal(f.weekdayLong("2026-11-10"), "marți");
  assert.equal(f.weekdayOfDay("tue"), "marți");
  assert.equal(f.daysSpoken(["thu", "tue"]), "marți și joi");
  assert.equal(f.daysSpoken(["mon", "wed", "fri"]), "luni, miercuri și vineri");
  assert.equal(f.daysSpoken(["sun", "mon"]), "luni și duminică");
  assert.equal(f.daysSpoken(["tue"]), "marți");
  assert.equal(f.dayMonthLong("2026-11-11"), "11 noiembrie");
  assert.equal(f.weekOfMonthOf("2026-11-11"), "second");
  assert.equal(f.weekOfMonthOf("2026-11-07"), "first");
  assert.equal(f.weekOfMonthOf("2026-11-22"), "fourth");
  assert.equal(f.weekOfMonthOf("2026-11-29"), "last");
  assert.equal(f.capitalize("marți"), "Marți");
});
