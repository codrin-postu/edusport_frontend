import { test } from "node:test";
import assert from "node:assert/strict";
import { countMatches, stripComments } from "./check.mjs";

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

test("ignores a class name inside a line comment", () => {
  const c = countMatches("// className=\"text-navy/50\"\nconst x = 1;");
  assert.equal(Object.values(c).reduce((a, b) => a + b, 0), 0);
});

test("ignores a class name inside a block comment", () => {
  const c = countMatches("/* className=\"z-[100] bg-gray-200\" */\nconst x = 1;");
  assert.equal(Object.values(c).reduce((a, b) => a + b, 0), 0);
});

test("ignores a class name inside a JSX comment", () => {
  const c = countMatches("<div>{/* className=\"rounded-md text-red-500\" */}</div>");
  assert.equal(Object.values(c).reduce((a, b) => a + b, 0), 0);
});

test("still counts a real class next to a comment", () => {
  const c = countMatches(
    "// this used to be text-navy/50\nconst x = <div className=\"z-[100]\" />;",
  );
  assert.equal(c["z-index"], 1);
  assert.equal(c["text-opacity"], undefined);
});

test("stripComments does not treat // inside a string as a comment", () => {
  const stripped = stripComments("const url = \"http://example.com\"; // real comment z-[1]");
  assert.match(stripped, /http:\/\/example\.com/);
  assert.doesNotMatch(stripped, /real comment/);
});

test("stripComments removes block comments spanning multiple lines", () => {
  const stripped = stripComments("/* start\n text-red-500\n end */\nconst x = 1;");
  assert.doesNotMatch(stripped, /text-red-500/);
  assert.match(stripped, /const x = 1;/);
});
