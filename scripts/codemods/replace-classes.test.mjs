import { test } from "node:test";
import assert from "node:assert/strict";
import { applyMap } from "./replace-classes.mjs";

const map = {
  rules: [
    { match: /(^|[\s"'`:])text-navy\/(50|60)(?=[\s"'`]|$)/g, replace: "$1text-secondary" },
    { match: /(^|[\s"'`:])text-navy\/(15|20)(?=[\s"'`]|$)/g, replace: () => null },
  ],
};

test("replaces a class and keeps its variant prefix", () => {
  const r = applyMap("<p className=\"hover:text-navy/50 text-sm\">", map);
  assert.equal(r.output, "<p className=\"hover:text-secondary text-sm\">");
  assert.equal(r.changes, 1);
});

test("flags instead of changing when replace returns null", () => {
  const r = applyMap("<p className=\"text-navy/15\">", map);
  assert.equal(r.output, "<p className=\"text-navy/15\">");
  assert.equal(r.flagged.length, 1);
});

test("does not touch similar longer tokens", () => {
  const r = applyMap("<p className=\"text-navy/500\">", map);
  assert.equal(r.changes, 0);
});
