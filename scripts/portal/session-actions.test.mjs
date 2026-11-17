import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const DIR = "src/app/(antrenor)/antrenor/(app)/calendar";
const s = canStripTypes ? await import(`../../${DIR}/session-actions.ts`) : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("a future group session offers all four, a future lesson no move", () => {
  assert.deepEqual(s.sessionActions({ kind: "group", archived: false, future: true }), ["prezenta", "anuleaza", "muta", "sterge"]);
  assert.deepEqual(s.sessionActions({ kind: "lesson", archived: false, future: true }), ["prezenta", "anuleaza", "sterge"]);
});

it("an archived session offers presence only", () => {
  assert.deepEqual(s.sessionActions({ kind: "group", archived: true, future: false }), ["prezenta"]);
  assert.deepEqual(s.sessionActions({ kind: "lesson", archived: true, future: false }), ["prezenta"]);
});

it("a cancelled lesson can only be deleted; a past or held lesson cannot be cancelled", () => {
  assert.deepEqual(s.sessionActions({ kind: "lesson", archived: false, future: true, cancelled: true }), ["sterge"]);
  assert.deepEqual(s.sessionActions({ kind: "lesson", archived: false, future: false }), ["prezenta", "sterge"]);
  assert.deepEqual(s.sessionActions({ kind: "lesson", archived: false, future: true, done: true }), ["prezenta", "sterge"]);
});

it("archived: saved presence older than the 7 day window", () => {
  assert.equal(s.isArchived("2026-11-01", "2026-11-08", true), false);
  assert.equal(s.isArchived("2026-11-01", "2026-11-09", true), true);
  assert.equal(s.isArchived("2026-11-01", "2026-11-30", false), false);
});

it("cancelBody trims and leaves an empty reason out", () => {
  assert.deepEqual(s.cancelBody("  "), {});
  assert.deepEqual(s.cancelBody(" bolnav "), { reason: "bolnav" });
});

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");

test("CalendarView opens SessionSheet on tap", () => {
  const src = read(`${DIR}/CalendarView.tsx`);
  assert.match(src, /import \{ SessionSheet \}/);
  assert.match(src, /onOpen=\{\(\) => setOpen\(i\)\}/);
  assert.match(src, /<SessionSheet /);
});

test("a group session goes through the existing DateSheet, no second implementation", () => {
  const src = read(`${DIR}/SessionSheet.tsx`);
  assert.match(src, /from "\.\.\/grupe\/\[id\]\/_program\/DateSheet"/);
  assert.match(src, /<DateSheet /);
  assert.match(src, /anuleaza: "cancel", muta: "move", sterge: "remove"/);
});

test("the sheet and the date sheet carry no hint or description line", () => {
  for (const p of [`${DIR}/SessionSheet.tsx`, "src/app/(antrenor)/antrenor/(app)/grupe/[id]/_program/DateSheet.tsx"]) {
    const src = read(p);
    assert.doesNotMatch(src, /description=/, p);
    assert.doesNotMatch(src, /\bsub=/, p);
  }
});

test("the lesson cancel goes through the allowed route", () => {
  assert.match(read(`${DIR}/SessionSheet.tsx`), /`\$\{path\}\/cancel`/);
});
