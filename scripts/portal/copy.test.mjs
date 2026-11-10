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
  assert.equal(copy.HISTORY.lessons(1), "lecție individuală");
  assert.equal(copy.HISTORY.lessons(2), "lecții individuale");
  assert.equal(copy.HISTORY.lessons(20), "de lecții individuale");
  assert.equal(copy.HISTORY.statLabel(1, "noiembrie"), "ședință de grup în noiembrie");
  assert.equal(copy.HISTORY.statLabel(12, "noiembrie"), "ședințe de grup în noiembrie");
  assert.equal(copy.HISTORY.hours("1"), "oră");
  assert.equal(copy.HISTORY.hours("2,8"), "ore");
  assert.equal(copy.HISTORY.hours("24"), "de ore");
  assert.equal(copy.HISTORY.presentSub(1), "grup, 1 prezent");
  assert.equal(copy.HISTORY.standInSub(10), "înlocuitor, 10 prezenți");
});

it("names the training copy", () => {
  assert.equal(copy.AZI.addTraining, "+ Adaugă antrenament");
  assert.equal(copy.PROGRAM.publicHint, "Programul este public, îl vede oricine pe site.");
  assert.equal(copy.TRAINING.title, "Antrenament nou");
  assert.equal(copy.TRAINING.summaryOnce("Miercuri, 12 noiembrie", "18:30"), "Miercuri, 12 noiembrie, 18:30, o singură dată.");
  const curly = /[\u2014\u2013\u00B7\u201E\u201C\u201D\u2018\u2019]/;
  const all = [];
  for (const [name, area] of Object.entries({ TRAINING: copy.TRAINING, PROGRAM: copy.PROGRAM, LESSON: copy.LESSON, AZI: copy.AZI })) strings(area, name, all);
  for (const [path, text] of all) assert.ok(!curly.test(text), `${path}: ${text}`);
});
