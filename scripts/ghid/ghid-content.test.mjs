import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const it = canStripTypes ? test : (name) => test.skip(name);

const PAGES = new URL("../../src/content/ghid/pages/", import.meta.url);
const shots = JSON.parse(await readFile(new URL("../../src/content/ghid/shots.json", import.meta.url), "utf8"));
const pages = [];
if (canStripTypes) {
  for (const f of (await readdir(PAGES)).filter((n) => n.endsWith(".ts"))) {
    const mod = await import(new URL(f, PAGES).href);
    pages.push(...Object.values(mod));
  }
}
const steps = pages.flatMap((p) => p.blocks.filter((b) => b.t === "steps").flatMap((b) => b.steps.map((s) => ({ slug: p.slug, ...s }))));

it("every shot a step uses exists in shots.json", () => {
  for (const s of steps.filter((x) => x.shot)) assert.ok(shots[s.shot], `${s.slug}: unknown shot ${s.shot}`);
});

it("every mark key a step names exists in its shot, once", () => {
  for (const s of steps.filter((x) => x.marks)) {
    assert.ok(s.shot, `${s.slug}: marks without a shot`);
    const keys = shots[s.shot].marks.map((m) => m.key);
    for (const k of s.marks) assert.ok(keys.includes(k), `${s.slug}: shot ${s.shot} has no mark "${k}"`);
    assert.equal(new Set(s.marks).size, s.marks.length, `${s.slug}: repeated mark in ${s.shot}`);
  }
});

it("mark keys are unique within a shot", () => {
  for (const [id, d] of Object.entries(shots)) {
    const keys = d.marks.map((m) => m.key);
    assert.ok(keys.every(Boolean), `${id}: a mark has no key`);
    assert.equal(new Set(keys).size, keys.length, `${id}: repeated key`);
  }
});
