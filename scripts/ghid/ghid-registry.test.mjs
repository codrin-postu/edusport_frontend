import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const r = canStripTypes ? await import("../../src/lib/ghid/registry.ts") : {};
const inl = canStripTypes ? await import("../../src/lib/ghid/inline.ts") : {};
const sh = canStripTypes ? await import("../../src/lib/ghid/shots.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const page = (slug, extra = {}) => ({ slug, title: slug.toUpperCase(), lead: `lead ${slug}`, blocks: [], ...extra });
const groups = [
  { title: "G1", pages: [page("a"), page("b"), page("c")] },
  { title: "G2", pages: [page("d")] },
];

it("orders pages by group, then page", () => {
  assert.deepEqual(r.orderedPages(groups).map((o) => o.page.slug), ["a", "b", "c", "d"]);
  assert.deepEqual(r.orderedPages(groups).map((o) => o.group), ["G1", "G1", "G1", "G2"]);
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

const shot = { w: 100, h: 100, alt: "", marks: [{ key: "a", box: [1, 2, 3, 4] }, { key: "b", box: [5, 6, 7, 8] }] };

it("stepMarks: a step without numbered yields marks without numbers, in the order named", () => {
  assert.deepEqual(sh.stepMarks("s", shot, ["b", "a"]), [{ box: [5, 6, 7, 8] }, { box: [1, 2, 3, 4] }]);
});

it("stepMarks: a numbered step yields 1..n in the order the step names the keys", () => {
  assert.deepEqual(sh.stepMarks("s", shot, ["b", "a"], true), [{ n: 1, box: [5, 6, 7, 8] }, { n: 2, box: [1, 2, 3, 4] }]);
});

it("a badge goes outside the box unless the box is too close to the left edge", () => {
  assert.equal(sh.badgeOutside([30, 10, 20, 5]), true);
  assert.equal(sh.badgeOutside([2, 10, 20, 5]), false);
});

it("an external link's label is part of the search text, its address is not", () => {
  const p = page("x", { blocks: [{ t: "links", items: [{ href: "https://docs.docker.com/engine/install/ubuntu/", label: "Docker Engine pe Ubuntu" }] }] });
  const t = r.pageText(p);
  assert.ok(t.includes("Docker Engine pe Ubuntu"));
  assert.ok(!t.includes("https://"));
});

it("a step's code is part of the search text", () => {
  const p = page("x", { blocks: [{ t: "steps", steps: [{ text: "Rulează.", code: "docker compose up -d" }] }] });
  assert.ok(r.pageText(p).includes("docker compose up -d"));
});

it("stepMarks: a step with a shot and no marks shows none", () => {
  assert.deepEqual(sh.stepMarks("s", shot, undefined), []);
  assert.deepEqual(sh.stepMarks("s", shot, []), []);
});

it("stepMarks throws on a key the shot lacks", () => {
  assert.throws(() => sh.stepMarks("s", shot, ["a", "zz"]), /no mark "zz"/);
});

it("renderInline bolds a lead like any text", () => {
  const out = inl.renderInline("Apasă **Salvează** acum");
  assert.equal(out[1].type, "b");
  assert.equal(out[1].props.children, "Salvează");
});
