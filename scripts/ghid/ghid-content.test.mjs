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

// The render drops a link to an unknown slug, so the tests are what catches a renamed page.
const pageFiles = canStripTypes ? (await readdir(PAGES)).filter((n) => n.endsWith(".ts")) : [];
const registrySource = await readFile(new URL("../../src/content/ghid/index.ts", import.meta.url), "utf8");

it("page slugs are unique and each file is named <slug>.ts", async() => {
  for (const f of pageFiles) {
    const mod = await import(new URL(f, PAGES).href);
    for (const p of Object.values(mod)) assert.equal(`${p.slug}.ts`, f, `${f}: slug is ${p.slug}`);
  }
  const slugs = pages.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, "repeated slug");
});

it("every links item names an existing page, or an https address with a label", () => {
  const slugs = new Set(pages.map((p) => p.slug));
  for (const p of pages)
    for (const b of p.blocks.filter((x) => x.t === "links"))
      for (const it of b.items) {
        if ("href" in it) {
          assert.match(it.href, /^https:\/\/[^\s]+$/, `${p.slug}: external link must be https: ${it.href}`);
          assert.ok(it.label?.trim(), `${p.slug}: external link without a label: ${it.href}`);
        } else assert.ok(slugs.has(it.slug), `${p.slug}: link to unknown page ${it.slug}`);
      }
});

it("every page module is imported once in the registry, and the registry lists each page once", () => {
  const imported = [...registrySource.matchAll(/from "\.\/pages\/([^"]+)"/g)].map((m) => `${m[1]}.ts`);
  assert.equal(new Set(imported).size, imported.length, "a page module is imported twice");
  assert.deepEqual([...imported].sort(), [...pageFiles].sort());
  const names = [...registrySource.matchAll(/import \{ (\w+) \} from "\.\/pages\//g)].map((m) => m[1]);
  const body = registrySource.slice(registrySource.indexOf("GHID_GROUPS"));
  for (const n of names) assert.equal(body.match(new RegExp(`\\b${n}\\b`, "g"))?.length, 1, `${n} must be listed exactly once`);
});

it("every code block has text and a page uses the type", () => {
  const codes = pages.flatMap((p) => p.blocks.filter((b) => b.t === "code").map((b) => ({ slug: p.slug, ...b })));
  assert.ok(codes.length > 0, "no page uses a code block");
  for (const c of codes) assert.ok(c.text.trim(), `${c.slug}: empty code block`);
});
