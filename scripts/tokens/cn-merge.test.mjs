import { test } from "node:test";
import assert from "node:assert/strict";
import { extendTailwindMerge } from "tailwind-merge";
import { twMergeConfig } from "../../src/utils/tw-merge-config.mjs";

const twMerge = extendTailwindMerge(twMergeConfig);
const cn = (...inputs) => twMerge(inputs.filter(Boolean).join(" "));

test("type role + color class both survive (different tailwind-merge groups)", () => {
  assert.equal(cn("text-body text-secondary"), "text-body text-secondary");
});

test("two type role classes conflict, only the last one survives", () => {
  assert.equal(cn("text-body text-caption"), "text-caption");
});

test("border-retro width + border-line color both survive (existing behaviour)", () => {
  assert.equal(cn("border-retro border-line"), "border-retro border-line");
});

test("section-py utility and a background color both survive", () => {
  assert.equal(cn("section bg-surface"), "section bg-surface");
});

test("gutter utility and a width class both survive", () => {
  assert.equal(cn("gutter max-w-content"), "gutter max-w-content");
});

test("link utility and a text color class both survive", () => {
  assert.equal(cn("link text-primary"), "link text-primary");
});

test("link and link-on-dark both survive (used together on navy)", () => {
  assert.equal(cn("link link-on-dark"), "link link-on-dark");
});

test("z-header wins over a numeric z-index conflict", () => {
  assert.equal(cn("z-10 z-header"), "z-header");
});

test("z-header and an unrelated class both survive", () => {
  assert.equal(cn("z-header max-w-content"), "z-header max-w-content");
});

test("duration-fast wins over a numeric duration conflict", () => {
  assert.equal(cn("duration-200 duration-fast"), "duration-fast");
});

test("duration-fast and an unrelated class both survive", () => {
  assert.equal(cn("duration-fast bg-surface"), "duration-fast bg-surface");
});
