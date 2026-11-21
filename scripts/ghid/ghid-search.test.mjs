import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const s = canStripTypes ? await import("../../src/lib/ghid/search.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const docs = [
  { slug: "a", title: "Despre sistem", group: "Început", text: "Ce face sistemul." },
  { slug: "b", title: "Înregistrează o plată", group: "Plăți", text: "Apasă Plată, alege sportivul și suma." },
  { slug: "c", title: "Grupe", group: "Club", text: "Fiecare sportiv are o grupă. Plata se leagă de sportiv." },
];

it("normalize folds case, diacritics and both s/t forms", () => {
  assert.equal(s.normalize("Plăți ȘȚ"), "plati st");
  assert.equal(s.normalize("Şţ"), "st");
});

it("finds a page by its plain spelling", () => {
  assert.equal(s.searchDocs(docs, "plata")[0].title, "Înregistrează o plată");
});

it("a blank query gives nothing", () => {
  assert.deepEqual(s.searchDocs(docs, "   "), []);
  assert.deepEqual(s.searchDocs(docs, ""), []);
});

it("every word is required", () => {
  assert.deepEqual(s.searchDocs(docs, "plata sportiv").map((d) => d.slug), ["b", "c"]);
  assert.deepEqual(s.searchDocs(docs, "plata despre"), []);
});

it("title matches come before body matches and the limit applies", () => {
  assert.deepEqual(s.searchDocs(docs, "grupe").map((d) => d.slug), ["c"]);
  assert.deepEqual(s.searchDocs(docs, "sportiv").map((d) => d.slug), ["b", "c"]);
  assert.deepEqual(s.searchDocs([docs[2], docs[1]], "plata").map((d) => d.slug), ["b", "c"]);
  assert.equal(s.searchDocs(docs, "s", 1).length, 1);
});
