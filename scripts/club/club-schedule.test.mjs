import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const lib = canStripTypes ? await import("../../src/lib/club-schedule.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const SCHOOL = (slots) => ({ section: { name: "Școala de Patinaj - AFI Cotroceni", slug: "scoala-afi" }, slots });
const SLOTS = [
  { start: "09:00", end: "09:50", groups: ["Avansați Gold"] },
  { start: "10:00", end: "10:50", groups: ["Primii Pași", "Intermediari Silver", "Avansați Silver"] },
];
const FALLBACK = [{ timeSlot: "10:00 - 10:50", courses: ["Primii Paşi"] }];

it("parseClubSchedule keeps a well-formed answer and drops broken parts", () => {
  assert.deepEqual(lib.parseClubSchedule([SCHOOL(SLOTS)]), [SCHOOL(SLOTS)]);
  assert.deepEqual(lib.parseClubSchedule([SCHOOL([{ start: "11:00", groups: ["A"] }, { start: "12:00", end: "12:50", groups: [] }, ...SLOTS])]), [SCHOOL(SLOTS)]);
  assert.deepEqual(lib.parseClubSchedule({ data: 1 }), []);
  assert.deepEqual(lib.parseClubSchedule([{ section: null, slots: SLOTS }]), []);
});

it("parseClubSchedule survives non-array slots and groups", () => {
  assert.deepEqual(lib.parseClubSchedule([SCHOOL("nope")]), [SCHOOL([])]);
  assert.deepEqual(lib.parseClubSchedule([SCHOOL({ start: "09:00" })]), [SCHOOL([])]);
  assert.deepEqual(lib.parseClubSchedule([SCHOOL([{ start: "09:00", end: "09:50", groups: "Avansați Gold" }, ...SLOTS])]), [SCHOOL(SLOTS)]);
  assert.deepEqual(lib.parseClubSchedule([SCHOOL([{ start: "09:00", end: "09:50", groups: null }])]), [SCHOOL([])]);
});

it("slotsToGroups writes the notebook's time slot text", () => {
  assert.deepEqual(lib.slotsToGroups(SLOTS), [
    { timeSlot: "09:00 - 09:50", courses: ["Avansați Gold"] },
    { timeSlot: "10:00 - 10:50", courses: ["Primii Pași", "Intermediari Silver", "Avansați Silver"] },
  ]);
});

it("notebookGroups reads the first school with slots, else the CMS fallback", () => {
  assert.deepEqual(lib.notebookGroups([SCHOOL([]), SCHOOL(SLOTS)], FALLBACK).length, 2);
  assert.deepEqual(lib.notebookGroups([SCHOOL([])], FALLBACK), FALLBACK);
  assert.deepEqual(lib.notebookGroups([], []), []);
});

// The fetch module imports "./strapi-base" without an extension, which node's own
// resolver rejects; a resolve hook adds ".ts" for the duration of this import.
const fetchLib = canStripTypes && typeof (await import("node:module")).registerHooks === "function"
  ? await (async() => {
      const { registerHooks } = await import("node:module");
      const hooks = registerHooks({
        resolve(spec, ctx, next) {
          if (spec.startsWith("./") && !/\.\w+$/.test(spec)) return next(`${spec}.ts`, ctx);
          return next(spec, ctx);
        },
      });
      try {
        return await import("../../src/lib/club-schedule-fetch.ts");
      } finally {
        hooks.deregister();
      }
    })()
  : null;
const itFetch = fetchLib ? test : (name) => test.skip(name);

itFetch("fetchClubSchedule returns [] when the request fails, is not ok, or the body is unusable", async() => {
  const real = globalThis.fetch;
  try {
    globalThis.fetch = async() => { throw new Error("down"); };
    assert.deepEqual(await fetchLib.fetchClubSchedule(), []);
    globalThis.fetch = async() => new Response("{}", { status: 500 });
    assert.deepEqual(await fetchLib.fetchClubSchedule(), []);
    globalThis.fetch = async() => new Response("not json", { status: 200 });
    assert.deepEqual(await fetchLib.fetchClubSchedule(), []);
    globalThis.fetch = async() => new Response(JSON.stringify({ data: [SCHOOL(SLOTS)] }), { status: 200 });
    assert.deepEqual(await fetchLib.fetchClubSchedule(), [SCHOOL(SLOTS)]);
  } finally {
    globalThis.fetch = real;
  }
});
