import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const r = canStripTypes ? await import("../../src/lib/ghid/registry.ts") : {};
const inl = canStripTypes ? await import("../../src/lib/ghid/inline.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const page = (slug, extra = {}) => ({ slug, title: slug.toUpperCase(), lead: `lead ${slug}`, blocks: [], ...extra });
const groups = [
  { title: "G1", topics: [{ title: "T1", pages: [page("a"), page("b")] }, { title: "T2", pages: [page("c")] }] },
  { title: "G2", topics: [{ title: "T3", pages: [page("d")] }] },
];

it("orders pages by group, topic, page", () => {
  assert.deepEqual(r.orderedPages(groups).map((o) => o.page.slug), ["a", "b", "c", "d"]);
  assert.deepEqual(r.orderedPages(groups).map((o) => [o.group, o.topic]).slice(2), [["G1", "T2"], ["G2", "T3"]]);
});

it("findPage: undefined slug is the first page, unknown is undefined", () => {
  assert.equal(r.findPage(groups, undefined).slug, "a");
  assert.equal(r.findPage(groups, "c").slug, "c");
  assert.equal(r.findPage(groups, "nu-exista"), undefined);
  assert.equal(r.findPage([], undefined), undefined);
});

it("neighbours: no prev at the first, no next at the last", () => {
  assert.equal(r.neighbours(groups, "a").prev, undefined);
  assert.equal(r.neighbours(groups, "a").next.slug, "b");
  assert.equal(r.neighbours(groups, "d").next, undefined);
  assert.equal(r.neighbours(groups, "d").prev.slug, "c");
  assert.deepEqual(r.neighbours(groups, "nu-exista"), {});
});

it("pageText strips ** and covers every block text", () => {
  const p = page("x", {
    title: "Titlu **t**",
    lead: "Lead **l**",
    blocks: [
      { t: "p", text: "para **b**" },
      { t: "h2", text: "h2" },
      { t: "list", items: ["i1", "**i2**"] },
      { t: "steps", steps: [{ text: "pas **1**", shot: "s1" }] },
      { t: "warn", text: "atentie" },
      { t: "video", src: "/v.mp4" },
      { t: "links", items: [{ slug: "a", label: "eticheta" }] },
    ],
  });
  const t = r.pageText(p);
  assert.ok(!t.includes("**"));
  for (const w of ["Titlu t", "Lead l", "para b", "h2", "i1", "i2", "pas 1", "atentie", "eticheta"]) assert.ok(t.includes(w), w);
  assert.ok(!t.includes("/v.mp4") && !t.includes("s1"));
});

it("renderInline bolds only **pairs**", () => {
  const out = inl.renderInline("a **b** c");
  assert.equal(out.length, 3);
  assert.equal(out[1].type, "b");
  assert.equal(out[1].props.children, "b");
  assert.deepEqual(inl.renderInline("fara"), ["fara"]);
});
