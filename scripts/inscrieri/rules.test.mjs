// Loads the TypeScript source directly (node >= 22.18 strips types natively).
// src/app/(site)/inscrieri/_rules.ts has only type imports, which is what makes this possible.
import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const rules = canStripTypes ? await import("../../src/app/(site)/inscrieri/_rules.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const STEP = {
  key: "date",
  title: "Date înscriere",
  questions: [
    { key: "relationship", type: "select", label: "Calitatea față de sportiv:", required: true },
    { key: "relationshipOther", type: "text", label: "Specificați calitatea (ex: Bunic, Frate):", required: false },
    { key: "subscriptionChoice", type: "select", label: "La primul modul doriți să achiziționați:", required: true, options: [] },
    { key: "source", type: "select", required: true },
    { key: "sourceOther", type: "text", required: false },
  ],
};
const keys = (step) => step.questions.map((q) => q.key);

it("prepareStep hides the Alta / Altele fields until their answer is picked", () => {
  assert.deepEqual(keys(rules.prepareStep(STEP, {}, [])), ["relationship", "subscriptionChoice", "source"]);
  const shown = rules.prepareStep(STEP, { relationship: "alta", source: "Altele" }, []);
  assert.deepEqual(keys(shown), ["relationship", "relationshipOther", "subscriptionChoice", "source", "sourceOther"]);
  assert.equal(shown.questions[1].required, true);
  assert.equal(shown.questions[4].required, true);
});

it("prepareStep fills the abonament options from the price lists", () => {
  const step = rules.prepareStep(STEP, {}, [{ value: "Abonament 8 ședințe grup", label: "Abonament 8 ședințe grup" }]);
  assert.deepEqual(step.questions.find((q) => q.key === "subscriptionChoice").options, [
    { value: "Abonament 8 ședințe grup", label: "Abonament 8 ședințe grup", enabled: true },
  ]);
  assert.deepEqual(STEP.questions[2].options, [], "input untouched");
});

const offeredFor = (m) => (m === "da" ? ["Abonament 8 ședințe grup", "Abonament Avansați Gold 8 ședințe"] : ["Abonament 8 ședințe grup", "1 ședință grup"]);

it("applyAnswer clears a follow-up when its answer goes away", () => {
  const before = { relationship: "alta", relationshipOther: "Bunic" };
  assert.deepEqual(rules.applyAnswer(before, "relationship", "parinte", offeredFor), { relationship: "parinte" });
  assert.deepEqual(rules.applyAnswer(before, "relationshipOther", "Frate", offeredFor), { relationship: "alta", relationshipOther: "Frate" });
  assert.deepEqual(rules.applyAnswer({ source: "Altele", sourceOther: "Ziar" }, "source", "Facebook", offeredFor), { source: "Facebook" });
});

it("applyAnswer drops an abonament the new membership answer does not offer", () => {
  const gold = { membershipAnswer: "da", subscriptionChoice: "Abonament Avansați Gold 8 ședințe" };
  assert.deepEqual(rules.applyAnswer(gold, "membershipAnswer", "nu", offeredFor), { membershipAnswer: "nu" });
  const eight = { membershipAnswer: "da", subscriptionChoice: "Abonament 8 ședințe grup" };
  assert.deepEqual(rules.applyAnswer(eight, "membershipAnswer", "nu", offeredFor), { membershipAnswer: "nu", subscriptionChoice: "Abonament 8 ședințe grup" });
});

it("childHeightError follows the backend rule", () => {
  for (const ok of ["132", "50", "230", " 99 ", "", undefined]) assert.equal(rules.childHeightError(ok), undefined, String(ok));
  for (const bad of ["49", "231", "13a", "1.32", "1320", "1,32 m"]) assert.equal(rules.childHeightError(bad), rules.CHILD_HEIGHT_ERROR, bad);
});

it("birthYearOptions spans 25 to 2 years ago, oldest first, inclusive of both ends", () => {
  const now = new Date("2026-06-15T00:00:00Z");
  const years = rules.birthYearOptions(now);
  assert.equal(years.length, 24);
  assert.deepEqual(years[0], { value: "2001", label: "2001" });
  assert.deepEqual(years.at(-1), { value: "2024", label: "2024" });
});

it("parseBirthDate reads ZZ.LL.AAAA and blanks anything else without throwing", () => {
  assert.deepEqual(rules.parseBirthDate("14.03.2016"), { day: "14", month: "03", year: "2016" });
  assert.deepEqual(rules.parseBirthDate("14 martie 2016"), rules.EMPTY_BIRTH_DATE_PARTS);
  assert.deepEqual(rules.parseBirthDate(""), rules.EMPTY_BIRTH_DATE_PARTS);
  assert.deepEqual(rules.parseBirthDate(undefined), rules.EMPTY_BIRTH_DATE_PARTS);
  assert.deepEqual(rules.parseBirthDate(true), rules.EMPTY_BIRTH_DATE_PARTS);
});

it("composeBirthDate joins only once all three parts are picked", () => {
  assert.equal(rules.composeBirthDate({ day: "14", month: "03", year: "2016" }), "14.03.2016");
  assert.equal(rules.composeBirthDate({ day: "14", month: "03", year: "" }), "");
  assert.equal(rules.composeBirthDate(rules.EMPTY_BIRTH_DATE_PARTS), "");
});

it("childBirthDateError enforces the picker's range and rejects impossible calendar dates", () => {
  const now = new Date("2026-06-15T00:00:00Z");
  for (const ok of ["14.03.2016", "01.01.2001", "28.02.2024", undefined, ""]) {
    assert.equal(rules.childBirthDateError(ok, now), undefined, String(ok));
  }
  assert.equal(rules.childBirthDateError("30.02.2016", now), rules.BIRTH_DATE_ERROR, "30 February does not exist");
  assert.equal(rules.childBirthDateError("31.04.2016", now), rules.BIRTH_DATE_ERROR, "31 April does not exist");
  assert.equal(rules.childBirthDateError("14.03.2000", now), rules.BIRTH_DATE_ERROR, "older than 25 years");
  assert.equal(rules.childBirthDateError("14.03.2025", now), rules.BIRTH_DATE_ERROR, "younger than 2 years");
  assert.equal(rules.childBirthDateError("14 martie 2016", now), rules.BIRTH_DATE_ERROR, "old free-text format");
});

const ANSWERS = {
  email: " ana.pop@example.com ",
  parentName: "Ana Pop",
  relationship: "parinte",
  relationshipOther: "rămas din altă alegere",
  phone: "0712345678",
  childName: "Maria Pop",
  childBirthDate: "14.03.2016",
  childHeight: "132",
  shirtSize: "S",
  lastSeason: "Nu a participat",
  priorExperience: "Nu este cazul",
  expectations: "Să învețe să patineze",
  membershipAnswer: "da",
  subscriptionChoice: "Abonament 8 ședințe grup",
  source: "Altele",
  sourceOther: "Ziar",
  gdprConsent: true,
  regulationsConsent: true,
  level: "câmp vechi din draft",
};

const KEY = "0b6f3c1e-2a4d-4c8e-9f10-123456789abc";

it("newSubmissionKey makes a fresh UUID v4 each time, with or without randomUUID", () => {
  const first = rules.newSubmissionKey();
  assert.equal(first.length, 36);
  assert.ok(rules.isSubmissionKey(first));
  assert.notEqual(rules.newSubmissionKey(), first);
  Object.defineProperty(crypto, "randomUUID", { value: undefined, configurable: true });
  try {
    const fallback = rules.newSubmissionKey();
    assert.ok(rules.isSubmissionKey(fallback));
    assert.notEqual(rules.newSubmissionKey(), fallback);
  } finally {
    delete crypto.randomUUID;
  }
  assert.ok(rules.isSubmissionKey(rules.newSubmissionKey()));
});

it("isSubmissionKey keeps only a UUID v4 from a saved draft", () => {
  assert.ok(rules.isSubmissionKey(KEY));
  assert.equal(rules.isSubmissionKey(undefined), false);
  assert.equal(rules.isSubmissionKey(""), false);
  assert.equal(rules.isSubmissionKey("0b6f3c1e-2a4d-1c8e-9f10-123456789abc"), false);
  assert.equal(rules.isSubmissionKey(`${KEY} `), false);
});

it("buildPayload sends the script form answers and only the abonament name", () => {
  assert.deepEqual(rules.buildPayload(ANSWERS, "", KEY), {
    email: "ana.pop@example.com",
    parentName: "Ana Pop",
    relationship: "parinte",
    phone: "0712345678",
    childName: "Maria Pop",
    childBirthDate: "14.03.2016",
    childHeight: "132",
    shirtSize: "S",
    lastSeason: "Nu a participat",
    priorExperience: "Nu este cazul",
    expectations: "Să învețe să patineze",
    membershipAnswer: "da",
    source: "Altele",
    sourceOther: "Ziar",
    subscriptionChoice: { priceItemName: "Abonament 8 ședințe grup" },
    gdprConsent: true,
    regulationsConsent: true,
    website: "",
    submissionKey: KEY,
  });
});

it("buildPayload keeps the honeypot and unticked consents as they are", () => {
  const out = rules.buildPayload({ gdprConsent: "true" }, "spam", KEY);
  assert.equal(out.website, "spam");
  assert.equal(out.gdprConsent, false);
  assert.equal(out.regulationsConsent, false);
  assert.deepEqual(out.subscriptionChoice, { priceItemName: "" });
});

it("parseSubmitResponse reads the 2A + 2D success", () => {
  assert.deepEqual(
    rules.parseSubmitResponse({ ok: true, registrationNumber: "2026-0142", downloadToken: "tok", documents: ["acord", "adeziune", "x"] }, true),
    { ok: true, registrationNumber: "2026-0142", downloadToken: "tok", documents: ["acord", "adeziune"] },
  );
});

it("parseSubmitResponse: a success without a token offers no download", () => {
  assert.deepEqual(rules.parseSubmitResponse({ ok: true, registrationNumber: "2026-0142", documents: ["acord"] }, true), {
    ok: true,
    registrationNumber: "2026-0142",
    downloadToken: null,
    documents: [],
  });
});

it("parseSubmitResponse passes the backend error through, else none", () => {
  assert.deepEqual(rules.parseSubmitResponse({ ok: false, code: "closed", error: "Înscrierile sunt închise." }, false), {
    ok: false,
    code: "closed",
    error: "Înscrierile sunt închise.",
  });
  assert.deepEqual(rules.parseSubmitResponse(null, false), { ok: false, code: null, error: null });
  assert.equal(rules.parseSubmitResponse({ ok: true }, true).ok, false, "no number is not a success");
  assert.equal(rules.parseSubmitResponse({ ok: true, registrationNumber: "2026-0001" }, false).ok, false);
});

it("documentUrl builds the 2D link", () => {
  assert.equal(
    rules.documentUrl("https://cms.example.ro", "a.b+c/=", "adeziune"),
    "https://cms.example.ro/api/forms/inscriere/documents?token=a.b%2Bc%2F%3D&kind=adeziune",
  );
});

it("signing sentence: plural, or singular with only the Acord", () => {
  assert.equal(rules.signingSentence(2), "Documentele vor fi semnate la prima ședință de curs.");
  assert.equal(rules.signingSentence(1), "Documentul va fi semnat la prima ședință de curs.");
  assert.deepEqual(rules.expectedDocuments("da"), ["acord", "adeziune"]);
  assert.deepEqual(rules.expectedDocuments("nu"), ["acord"]);
});

it("splitOnLink turns the document name into a link", () => {
  assert.deepEqual(
    rules.splitOnLink("Confirm citirea documentului Politica de Confidențialitate și sunt de acord cu prelucrarea datelor.", "Politica de Confidențialitate"),
    { before: "Confirm citirea documentului ", link: "Politica de Confidențialitate", after: " și sunt de acord cu prelucrarea datelor." },
  );
  assert.equal(rules.splitOnLink("Text schimbat de admin.", "Politica de Confidențialitate"), null);
  assert.equal(rules.splitOnLink("Orice", ""), null);
});
