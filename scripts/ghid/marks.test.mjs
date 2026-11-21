import { test } from "node:test";
import assert from "node:assert/strict";
import { markBox } from "./marks.mjs";

const vp = { width: 1280, height: 760 };

test("a box becomes percent of the viewport", () => {
  assert.deepEqual(markBox({ x: 1152, y: 266, width: 128, height: 76 }, vp, 0), [90, 35, 10, 10]);
});

test("pad grows the box on every side", () => {
  assert.deepEqual(markBox({ x: 100, y: 100, width: 100, height: 60 }, vp, 4), [7.5, 12.6, 8.4, 8.9]);
});

test("boxes past the edge clamp to 100", () => {
  const b = markBox({ x: 1152, y: 608, width: 300, height: 300 }, vp, 0);
  assert.equal(b[0] + b[2], 100);
  assert.equal(b[1] + b[3], 100);
  assert.deepEqual(markBox({ x: -50, y: -50, width: 100, height: 100 }, vp, 0), [0, 0, 3.9, 6.6]);
});
