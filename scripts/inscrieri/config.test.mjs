// The offline config must be the public model of the backend registry
// `inscriere` (plan 2A Task 2). Run `npm run check:inscriere-config` against a
// running backend to compare with the live endpoint as well.
import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const t = canStripTypes ? await import("../../src/app/(site)/inscrieri/_types.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const q = () => Object.fromEntries(t.FALLBACK_CONFIG.steps.flatMap((s) => s.questions).map((x) => [x.key, x]));

it("has the 3 approved steps with the script form questions in order", () => {
  assert.deepEqual(
    t.FALLBACK_CONFIG.steps.map((s) => [s.key, s.title, s.questions.map((x) => x.key)]),
    [
      ["date", "Date înscriere", ["email", "parentName", "relationship", "relationshipOther", "phone", "childName", "childBirthDate", "childHeight", "shirtSize", "lastSeason", "priorExperience", "expectations"]],
      ["abonament", "Abonament", ["membershipAnswer", "subscriptionChoice"]],
      ["finalizare", "Finalizare înscriere", ["source", "sourceOther", "gdprConsent", "regulationsConsent"]],
    ],
  );
});

it("uses the script form's option values and labels", () => {
  const opts = (key) => q()[key].options.map((o) => [o.value, o.label]);
  assert.deepEqual(opts("relationship"), [["parinte", "Părinte"], ["tutore", "Tutore Legal"], ["alta", "Alta (Vă rugăm specificați)"]]);
  assert.deepEqual(opts("membershipAnswer"), [["da", "Da, doresc să devin membru"], ["nu", "Nu, optez pentru tarife neafiliați"]]);
  assert.deepEqual(opts("lastSeason").map(([v]) => v), ["Nu a participat", "Începători", "Intermediari", "Avansați"]);
  assert.deepEqual(opts("source").map(([v]) => v), ["Facebook", "Instagram", "Recomandare", "Căutare Google", "Altele"]);
  assert.deepEqual(q().subscriptionChoice.options, []);
});

it("follow-ups are optional in the config; the form requires them when shown", () => {
  assert.equal(q().relationshipOther.required, false);
  assert.equal(q().sourceOther.required, false);
  assert.equal(q().relationshipOther.label, "Specificați calitatea (ex: Bunic, Frate):");
  assert.equal(q().sourceOther.label, "Vă rugăm să specificați de unde ați aflat de noi:");
});

it("consents carry their title and the document link inside the text", () => {
  const { gdprConsent, regulationsConsent } = q();
  assert.equal(gdprConsent.title, "Consimțământ GDPR");
  assert.ok(gdprConsent.label.includes(gdprConsent.linkLabel));
  assert.equal(gdprConsent.linkUrl, "/protectia-datelor");
  assert.equal(regulationsConsent.title, "Acord Regulament");
  assert.ok(regulationsConsent.label.includes(regulationsConsent.linkLabel));
  assert.equal(regulationsConsent.linkUrl, "/cursuri/regulament");
});

it("drops the questions only the old website form had", () => {
  for (const key of ["level", "howHeard", "clubInterest", "privacyConsent", "regulationsAgreement"]) assert.equal(q()[key], undefined, key);
});

it("keeps childBirthDate a plain text answer key; the zi/lună/an UI is a replace slot keyed on childBirthDate, not a config type", () => {
  assert.equal(q().childBirthDate.type, "text");
  assert.equal(q().childBirthDate.required, true);
  assert.equal(q().childBirthDate.label, "Data nașterii copilului");
  assert.equal(t.PLACEHOLDERS.childBirthDate, undefined, "the free-text placeholder stays removed");
});

it("uses comma-below ș and ț, never the cedilla", () => {
  assert.doesNotMatch(JSON.stringify([t.FALLBACK_CONFIG, t.PLACEHOLDERS, t.SUBSCRIPTION_PLACEHOLDER]), /[şţŞŢ]/);
});
