import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const f = canStripTypes ? await import("../../src/lib/portal/sportiv-format.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("writes the history line with the time when there is one", () => {
  assert.equal(f.historyWhen("2026-11-05", "17:30"), "Joi 5 noi, 17:30");
  assert.equal(f.historyWhen("2026-11-05", null), "Joi 5 noi");
});

it("formats amounts in lei with Romanian separators", () => {
  assert.equal(f.ron(150), "150 RON");
  assert.equal(f.ron(1250.5), "1.250,50 RON");
  assert.equal(f.ron(0), "0 RON");
});

it("writes the visible range of a page", () => {
  assert.equal(f.range(1, 20, 26), "1 - 20 din 26");
  assert.equal(f.range(21, 26, 26), "21 - 26 din 26");
});

it("says how long ago a date was, in months then days", () => {
  const now = new Date("2026-11-12T10:00:00Z");
  assert.equal(f.sinceText("2026-08-12", now), "acum 3 luni");
  assert.equal(f.sinceText("2026-10-12", now), "acum 1 lună");
  assert.equal(f.sinceText("2026-11-07", now), "acum 5 zile");
  assert.equal(f.sinceText("2026-11-12T08:00:00Z", now), "azi");
  assert.equal(f.sinceText(null, now), "nesetată");
});

it("writes a month with its year, long and short", () => {
  assert.equal(f.monthYear("2026-09"), "septembrie 2026");
  assert.equal(f.monthYearShort("2025-09"), "sep 2025");
  assert.equal(f.monthYearShort("2026-06"), "iun 2026");
});
