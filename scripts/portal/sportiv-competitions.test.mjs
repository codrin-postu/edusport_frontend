import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const f = canStripTypes ? await import("../../src/lib/portal/sportiv-competitions.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const defaults = { q: "", season: null, sort: "recent", page: 1 };

it("leaves the defaults out", () => {
  assert.equal(f.competitionQuery(defaults), "");
});

it("writes only what differs from the defaults", () => {
  assert.equal(f.competitionQuery({ ...defaults, q: "brasov" }), "q=brasov");
  assert.equal(f.competitionQuery({ q: "cupa", season: "2025-2026", sort: "place", page: 2 }), "q=cupa&season=2025-2026&sort=place&page=2");
});

it("round trips", () => {
  const s = { q: "cupa ro", season: "2026-2027", sort: "points", page: 3 };
  assert.deepEqual(f.readQuery(new URLSearchParams(f.competitionQuery(s))), s);
  assert.deepEqual(f.readQuery(new URLSearchParams("")), defaults);
});

it("reads an unknown sort as recent and a page under 1 as 1", () => {
  assert.equal(f.readQuery(new URLSearchParams("sort=evil")).sort, "recent");
  assert.equal(f.readQuery(new URLSearchParams("page=0")).page, 1);
  assert.equal(f.readQuery(new URLSearchParams("page=-4")).page, 1);
  assert.equal(f.readQuery(new URLSearchParams("page=abc")).page, 1);
});

it("keeps only http(s) official links", () => {
  assert.equal(f.safeOfficialUrl("https://x.example/a"), "https://x.example/a");
  assert.equal(f.safeOfficialUrl("javascript:alert(1)"), null);
  assert.equal(f.safeOfficialUrl(null), null);
});
