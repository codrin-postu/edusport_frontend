import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const copy = canStripTypes ? await import("../../src/lib/portal/copy.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const BANNED = /[–—·“”„]|Email|\p{Extended_Pictographic}/u;

function strings(value, path, out) {
  if (typeof value === "string") out.push([path, value]);
  else if (typeof value === "function") {
    out.push([`${path}("X")`, String(value("X", "X", "X"))]);
    out.push([`${path}(3)`, String(value(3, 3, 3))]);
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) strings(v, `${path}.${k}`, out);
  }
}

it("keeps every coach string free of banned characters", () => {
  const all = [];
  for (const [name, area] of Object.entries(copy)) strings(area, name, all);
  assert.ok(all.length > 100);
  for (const [path, text] of all) assert.ok(!BANNED.test(text), `${path}: ${text}`);
});

it("agrees counts in Romanian", () => {
  assert.equal(copy.AZI.groupLine(1), "grup, 1 copil");
  assert.equal(copy.AZI.groupLine(12), "grup, 12 copii");
  assert.equal(copy.AZI.groupLine(20), "grup, 20 de copii");
  assert.equal(copy.ADD_ATHLETE.submit(1), "Adaugă 1 sportiv");
  assert.equal(copy.PRESENCE.presentCount(10), "10 prezenți");
});
