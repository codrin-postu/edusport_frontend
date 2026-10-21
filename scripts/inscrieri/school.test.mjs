import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const { resolveSchool, showsPinnedSchool } = canStripTypes ? await import("../../src/app/inscrieri/_school.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const afi = { name: "Școala de Patinaj - AFI Cotroceni", slug: "afi-cotroceni" };
const two = { name: "Școala de Patinaj - Patinoar 2", slug: "patinoar-2" };

it("one school: chosen without asking", () => {
  assert.deepEqual(resolveSchool([afi], null), { state: "chosen", school: afi });
  assert.deepEqual(resolveSchool([afi], "afi-cotroceni"), { state: "chosen", school: afi });
  assert.equal(showsPinnedSchool(1), false);
});

it("?scoala picks the school, ignoring case and spaces", () => {
  assert.deepEqual(resolveSchool([afi, two], " Patinoar-2 "), { state: "chosen", school: two });
});

it("2+ schools and no ?scoala: Alege școala, pinned afterwards", () => {
  assert.deepEqual(resolveSchool([afi, two], null), { state: "choose", schools: [afi, two], unknownSlug: false });
  assert.equal(showsPinnedSchool(2), true);
});

it("an unknown ?scoala is never mapped to another school", () => {
  assert.deepEqual(resolveSchool([afi], "club"), { state: "choose", schools: [afi], unknownSlug: true });
  assert.deepEqual(resolveSchool([afi, two], "nu-exista"), { state: "choose", schools: [afi, two], unknownSlug: true });
});

it("no school: nothing to register for", () => {
  assert.deepEqual(resolveSchool([], null), { state: "none" });
  assert.deepEqual(resolveSchool([], "afi-cotroceni"), { state: "none" });
});
