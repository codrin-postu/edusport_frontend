import { test } from "node:test";
import assert from "node:assert/strict";
import { countMatches } from "./check.mjs";

test("counts text opacity classes", () => {
  const c = countMatches("<p className=\"text-navy/50 hover:text-retro-cream/70\">");
  assert.equal(c["text-opacity"], 2);
});

test("counts default palette colors", () => {
  const c = countMatches("<div className=\"bg-gray-200 text-red-500\">");
  assert.equal(c["default-palette"], 2);
});

test("ignores role tokens", () => {
  const c = countMatches("<p className=\"text-secondary bg-surface-subtle border-line\">");
  assert.equal(Object.values(c).reduce((a, b) => a + b, 0), 0);
});

test("counts arbitrary px and off-scale spacing", () => {
  const c = countMatches("<div className=\"mt-[3px] p-2.5 gap-5 px-4\">");
  assert.equal(c["arbitrary-px"], 1);
  assert.equal(c["off-scale-spacing"], 2);
});

test("counts rounded but not rounded-none or rounded-full", () => {
  const c = countMatches("<div className=\"rounded-md rounded rounded-full rounded-none\">");
  assert.equal(c["radius"], 2);
});

test("counts numeric z-index", () => {
  const c = countMatches("<div className=\"z-[100] z-10 z-header\">");
  assert.equal(c["z-index"], 2);
});
