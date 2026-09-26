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
