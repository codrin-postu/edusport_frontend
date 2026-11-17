import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const f = canStripTypes ? await import("../../src/lib/portal/parcurs.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const pin = (over) => ({ pin: "podium", label: "Podium", earnedOn: "2026-11-07", count: 3, ...over });

it("reads an earned pin with its count", () => {
  assert.equal(f.pinAria(pin({})), "Podium, 3");
});

it("reads a pin earned once without a number", () => {
  assert.equal(f.pinAria(pin({ count: 1 })), "Podium");
});

it("reads an unearned pin as blocked", () => {
  assert.equal(f.pinAria(pin({ earnedOn: null, count: 0 })), "Podium, blocat");
});

it("shows the count number only above one", () => {
  assert.equal(f.showCount(pin({ count: 1 })), false);
  assert.equal(f.showCount(pin({ count: 2 })), true);
  assert.equal(f.showCount(pin({ earnedOn: null, count: 0 })), false);
});

it("names the friendship pin image with two digits", () => {
  assert.equal(f.friendPinId(7), "prietenie-07");
  assert.equal(f.friendPinId(15), "prietenie-15");
});
