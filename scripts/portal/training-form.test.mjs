import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const t = canStripTypes ? await import("../../src/lib/portal/training-form.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const base = {
  kind: "grup", groupId: "gavansati", athlete: null, repeat: "weekly", days: ["thu", "tue"], date: "2026-11-05", startTime: "17:30", durationMin: 60,
  from: "2026-11-11", until: null, coachIds: ["tm-andrei"],
};

it("writes the five summary texts", () => {
  assert.equal(t.trainingSummary({ ...base, repeat: "none", date: "2026-11-12", startTime: "18:30" }), "Joi, 12 noiembrie, 18:30, o singură dată.");
  assert.equal(t.trainingSummary(base), "Marți și joi, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului.");
  assert.equal(t.trainingSummary({ ...base, until: "2027-03-31" }), "Marți și joi, 17:30, 60 min, din 11 noiembrie până pe 31 martie.");
  assert.equal(t.trainingSummary({ ...base, repeat: "biweekly" }), "La 2 săptămâni, marți și joi, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului.");
  assert.equal(t.trainingSummary({ ...base, repeat: "monthly", days: ["tue"] }), "Lunar, în a doua marți a lunii, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului.");
  assert.equal(t.trainingSummary({ ...base, days: ["mon", "wed", "fri"] }), "Luni, miercuri și vineri, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului.");
  assert.equal(t.trainingSummary({ ...base, startTime: "" }), null);
  assert.equal(t.trainingSummary({ ...base, days: [] }), null);
  assert.equal(t.monthlyNote("2026-11-11"), "Săptămâna din lună se ia din \"Din data\": 11 noiembrie este a doua miercuri.");
});

it("builds the group body", () => {
  assert.deepEqual(t.groupBody(base), { repeat: true, freq: "weekly", days: ["tue", "thu"], startTime: "17:30", durationMin: 60, from: "2026-11-11", until: null });
  assert.deepEqual(t.groupBody({ ...base, repeat: "monthly", days: ["wed"] }), {
    repeat: true, freq: "monthly", days: ["wed"], weekOfMonth: "second", startTime: "17:30", durationMin: 60, from: "2026-11-11", until: null,
  });
  assert.deepEqual(t.groupBody({ ...base, repeat: "none", date: "2026-11-12" }), { repeat: false, date: "2026-11-12", startTime: "17:30", durationMin: 60 });
});

it("builds the lesson and plan bodies", () => {
  const ind = { ...base, kind: "individual", groupId: null, athlete: { athleteId: "aana", name: "Ana Stoica" } };
  const once = t.lessonBody({ ...ind, repeat: "none", date: "2026-11-12" });
  assert.deepEqual(once, { athleteId: "aana", date: "2026-11-12", startTime: "17:30", durationMin: 60, coachIds: ["tm-andrei"] });
  assert.equal("repeat" in once, false);
  assert.deepEqual(t.lessonBody(ind), {
    athleteId: "aana", date: "2026-11-11", startTime: "17:30", durationMin: 60, coachIds: ["tm-andrei"], repeat: { freq: "weekly", days: ["tue", "thu"], until: null },
  });
  assert.deepEqual(t.planBody({ ...ind, repeat: "none", date: "2026-11-12" }, "following"), {
    date: "2026-11-12", startTime: "17:30", durationMin: 60, coachIds: ["tm-andrei"], scope: "following", repeat: null,
  });
  assert.equal(t.planBody(ind, "one").scope, "one");
});

it("knows when the form is ready", () => {
  assert.equal(t.ready(base), true);
  assert.equal(t.ready({ ...base, startTime: "" }), false);
  assert.equal(t.ready({ ...base, days: [] }), false);
  assert.equal(t.ready({ ...base, until: "2026-11-10" }), false);
  assert.equal(t.ready({ ...base, until: "" }), false);
  assert.equal(t.ready({ ...base, groupId: null }), false);
  assert.equal(t.ready({ ...base, kind: "individual" }), false);
  assert.equal(t.ready({ ...base, kind: "individual", athlete: { athleteId: "a", name: "A" } }), true);
  assert.equal(t.ready({ ...base, repeat: "none", date: "" }), false);
});

it("starts from the mode", () => {
  const n = t.initialValue({ kind: "new" }, "2026-11-05", "tm-andrei");
  assert.deepEqual(n, { kind: "grup", groupId: null, athlete: null, repeat: "none", days: ["thu"], date: "2026-11-05", startTime: "", durationMin: 60, from: "2026-11-05", until: null, coachIds: ["tm-andrei"] });
  const preset = t.initialValue({ kind: "preset", groupId: "g1" }, "2026-11-05", "tm-andrei");
  assert.deepEqual([preset.groupId, preset.repeat], ["g1", "weekly"]);
  const lesson = {
    lessonId: "lser2", athleteId: "aana", athleteName: "Ana Stoica", date: "2026-11-17", startTime: "17:00", durationMin: 60, coachIds: ["tm-andrei"],
    series: { seriesId: "sl-ana", freq: "weekly", days: ["tue"], weekOfMonth: null, startTime: "17:00", durationMin: 60, from: "2026-11-10", to: "2027-06-30", untilSeasonEnd: true },
  };
  const e = t.initialValue({ kind: "edit", lesson }, "2026-11-05", "tm-andrei");
  assert.deepEqual([e.kind, e.repeat, e.days, e.from, e.until, e.athlete.name], ["individual", "weekly", ["tue"], "2026-11-17", null, "Ana Stoica"]);
  const single = t.initialValue({ kind: "edit", lesson: { ...lesson, series: null } }, "2026-11-05", "tm-andrei");
  assert.equal(single.repeat, "none");
});
