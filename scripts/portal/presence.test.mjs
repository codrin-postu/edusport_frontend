import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const p = canStripTypes ? await import("../../src/lib/portal/presence.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);
const q = (s) => p.sessionQuery(new URLSearchParams(s));

it("sessionQuery passes exactly one kind of key", () => {
  assert.equal(q("occurrence=k1&id=x"), "occurrence=k1");
  assert.equal(q("id=x&group=g&date=2026-11-06"), "id=x");
  assert.equal(q("group=g&date=2026-11-06"), "group=g&date=2026-11-06");
  assert.equal(q("group=g&date=2026-11-06&time=10:00&duration=50&x=1"), "group=g&date=2026-11-06&time=10%3A00&duration=50");
  assert.equal(q("date=2026-11-06"), null);
  assert.equal(q("group=g"), null);
  assert.equal(q(""), null);
});

it("presentCount counts rows with either tick", () => {
  assert.equal(p.presentCount([{ grup: true, uscat: false }, { grup: false, uscat: true }, { grup: false, uscat: false }]), 2);
  assert.equal(p.presentCount([]), 0);
});

const base = { sessionId: null, occurrenceKey: null, added: null, groupId: "g", date: "2026-11-05", startTime: "18:15", durationMin: 60 };
const ticks = new Map([["a", { grup: true, uscat: false }], ["b", { grup: false, uscat: false }], ["c", { grup: false, uscat: true }]]);

it("saveBody: id wins, then occurrence, then added; only ticked rows", () => {
  const withId = p.saveBody({ ...base, sessionId: "s1", occurrenceKey: "k" }, ticks, ["t1"], [], []);
  assert.equal(withId.id, "s1");
  assert.equal("occurrence" in withId, false);
  assert.equal("added" in withId, false);
  assert.deepEqual(withId.ticks.map((t) => t.athleteId), ["a", "c"]);
  assert.deepEqual(withId.coachIds, ["t1"]);
  const occ = p.saveBody({ ...base, occurrenceKey: "k" }, ticks, [], [], []);
  assert.equal(occ.occurrence, "k");
  assert.equal("id" in occ, false);
  const free = p.saveBody({ ...base }, ticks, [], ["a"], ["c"]);
  assert.deepEqual(free.added, { groupId: "g", date: "2026-11-05", startTime: "18:15", durationMin: 60 });
  assert.deepEqual(free.reactivate, ["a"]);
  assert.deepEqual(free.keepInactive, ["c"]);
});
