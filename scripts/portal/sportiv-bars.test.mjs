import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const f = canStripTypes ? await import("../../src/lib/portal/sportiv-bars.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("is 1 for the tallest month and a share for the others", () => {
  assert.equal(f.barLevel(8, 8), 1);
  assert.equal(f.barLevel(6, 8), 0.75);
  assert.equal(f.barLevel(0, 8), 0);
});

it("is 0 for a month to come or when there is no tallest month", () => {
  assert.equal(f.barLevel(null, 8), 0);
  assert.equal(f.barLevel(0, 0), 0);
  assert.equal(f.barLevel(3, 0), 0);
});
