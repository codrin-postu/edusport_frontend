import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const m = canStripTypes ? await import("../../src/lib/portal/month-grid.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("November 2026 starts on a Sunday: six leading blanks", () => {
  const cells = m.monthCells("2026-11");
  assert.equal(cells.length, 42);
  assert.deepEqual(cells.slice(0, 6), [null, null, null, null, null, null]);
  assert.equal(cells[6], "2026-11-01");
  assert.equal(cells[35], "2026-11-30");
  assert.equal(cells[36], null);
});

it("September 2026 starts on a Tuesday: one leading blank, length a multiple of 7", () => {
  const cells = m.monthCells("2026-09");
  assert.equal(cells[0], null);
  assert.equal(cells[1], "2026-09-01");
  assert.equal(cells.length % 7, 0);
});

it("shifts months across year ends", () => {
  assert.equal(m.shiftMonth("2026-12", 1), "2027-01");
  assert.equal(m.shiftMonth("2026-01", -1), "2025-12");
});

it("titles a month in Romanian", () => {
  assert.equal(m.monthTitle("2026-11"), "Noiembrie 2026");
});
