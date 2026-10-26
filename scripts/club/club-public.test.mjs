// Loads the TypeScript source directly (node >= 22.18 strips types natively).
// src/lib/club-public.ts has only type imports, which is what makes this possible.
import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const lib = canStripTypes ? await import("../../src/lib/club-public.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

// Prices from the approved mockup (form-steps-v4); the real ones come from the Prețuri screen.
const TOOLTIP_1 = "Disponibil doar pentru prima ședință";
const item = (over) => ({ name: "Abonament 8 ședințe grup", kind: "subscription", sessions: 8, memberPrice: 770, nonMemberPrice: 890, tooltip: null, ...over });
const SCHOOL = {
  name: "Școala de Patinaj - AFI Cotroceni",
  slug: "afi-cotroceni",
  priceNotes: ["Nota 1"],
  priceLists: [
    {
      name: "Standard",
      items: [
        item({ name: "1 ședință grup", kind: "session", sessions: null, memberPrice: null, nonMemberPrice: 180, tooltip: TOOLTIP_1 }),
        item({ name: "Abonament 6 ședințe grup", sessions: 6, memberPrice: 660, nonMemberPrice: 790 }),
        item({}),
      ],
    },
    { name: "Avansați Gold", items: [item({ name: "Abonament Avansați Gold 8 ședințe", memberPrice: 1080, nonMemberPrice: null })] },
  ],
};
const INFO = { season: { label: "2026-2027", startMonth: "2026-10-01", endMonth: "2027-05-31" }, membershipFee: 270, schools: [SCHOOL] };

it("parsePublicClubInfo keeps a well-formed response as is", () => {
  assert.deepEqual(lib.parsePublicClubInfo(INFO), INFO);
});

it("parsePublicClubInfo drops malformed parts instead of failing", () => {
  const raw = {
    season: { label: "2026-2027" },
    membershipFee: "270",
    schools: [
      { name: "Fără slug" },
      {
        ...SCHOOL,
        priceNotes: ["", 7, "Nota 1"],
        priceLists: [
          { name: "Goală", items: [item({ memberPrice: null, nonMemberPrice: null }), item({ kind: "altceva" }), "x"] },
          SCHOOL.priceLists[0],
        ],
      },
    ],
  };
  const out = lib.parsePublicClubInfo(raw);
  assert.equal(out.season, null);
  assert.equal(out.membershipFee, null);
  assert.deepEqual(out.schools.map((s) => s.slug), ["afi-cotroceni"]);
  assert.deepEqual(out.schools[0].priceLists.map((l) => l.name), ["Standard"]);
  assert.deepEqual(out.schools[0].priceNotes, ["Nota 1"]);
  assert.equal(lib.parsePublicClubInfo(null), null);
  assert.equal(lib.parsePublicClubInfo({ season: null }), null);
});

it("offers each item to the audience it has a price for", () => {
  const items = lib.schoolItems(SCHOOL);
  assert.deepEqual(lib.offeredItems(items, "member").map((i) => i.name), [
    "Abonament 6 ședințe grup",
    "Abonament 8 ședințe grup",
    "Abonament Avansați Gold 8 ședințe",
  ]);
  assert.deepEqual(lib.offeredItems(items, "nonMember").map((i) => i.name), [
    "1 ședință grup",
    "Abonament 6 ședințe grup",
    "Abonament 8 ședințe grup",
  ]);
});

it("audienceFor reads the stored membership answer", () => {
  assert.equal(lib.audienceFor("da"), "member");
  assert.equal(lib.audienceFor("nu"), "nonMember");
  assert.equal(lib.audienceFor(""), null);
  assert.equal(lib.audienceFor("Da"), null);
});

it("websitePriceTiers builds the two cards, tooltips kept, no note line", () => {
  const [members, nonMembers] = lib.websitePriceTiers(SCHOOL, 270);
  assert.deepEqual(members, {
    title: "Pentru Membri",
    priceItems: [
      { label: "Abonament 6 ședințe grup", price: "660 RON" },
      { label: "Abonament 8 ședințe grup", price: "770 RON" },
      { label: "Abonament Avansați Gold 8 ședințe", price: "1080 RON" },
    ],
    bottomItem: { label: "Taxa de membru (o dată/sezon)", price: "270 RON" },
  });
  assert.equal(nonMembers.title, "Pentru Neafiliați");
  assert.deepEqual(nonMembers.priceItems[0], { label: "1 ședință grup", price: "180 RON", tooltip: TOOLTIP_1 });
  assert.equal(JSON.stringify(nonMembers).includes("note"), false);
});

it("websitePriceTiers: no fee row without a fee; null when nothing is offered", () => {
  assert.equal(lib.websitePriceTiers(SCHOOL, null)[0].bottomItem, undefined);
  assert.equal(lib.websitePriceTiers({ ...SCHOOL, priceLists: [] }, 270), null);
  assert.equal(lib.websitePriceTiers(null, 270), null);
});

it("priceBox shows the annual fee in the member box only", () => {
  const member = lib.priceBox(SCHOOL, "member", 270);
  assert.equal(member.title, "Pentru Membri");
  assert.deepEqual(member.rows.at(-1), { label: "Taxa de membru (o dată/sezon)", price: "270 RON", tooltip: null });
  const nonMember = lib.priceBox(SCHOOL, "nonMember", 270);
  assert.equal(nonMember.title, "Pentru Neafiliați");
  assert.deepEqual(nonMember.rows.map((r) => r.price), ["180 RON", "790 RON", "890 RON"]);
  assert.equal(nonMember.rows[0].tooltip, TOOLTIP_1);
});

it("subscriptionOptions depend on membership", () => {
  assert.deepEqual(lib.subscriptionOptions(SCHOOL, null), []);
  assert.deepEqual(lib.subscriptionOptions(SCHOOL, "member").map((o) => o.value), [
    "Abonament 6 ședințe grup",
    "Abonament 8 ședințe grup",
    "Abonament Avansați Gold 8 ședințe",
  ]);
  assert.ok(!lib.subscriptionOptions(SCHOOL, "member").some((o) => o.value === "1 ședință grup"));
});

it("upsell computes the savings from the prices (mockup text)", () => {
  assert.deepEqual(lib.upsell(SCHOOL, 270), {
    rows: [
      { label: "Abonament 8 ședințe grup", nonMemberPrice: 890, memberPrice: 770 },
      { label: "Abonament 6 ședințe grup", nonMemberPrice: 790, memberPrice: 660 },
    ],
    text:
      "Economisești 120 RON la fiecare abonament de 8 ședințe. Taxa de membru (270 RON pe sezon) se recuperează de la al treilea abonament. Doar membrii au acces la Avansați Gold.",
  });
});

it("upsell follows other prices and drops sentences it cannot back", () => {
  const cheap = { ...SCHOOL, priceLists: [{ name: "Standard", items: [item({ memberPrice: 500, nonMemberPrice: 800 })] }] };
  assert.equal(lib.upsell(cheap, 270).text, "Economisești 300 RON la fiecare abonament de 8 ședințe. Taxa de membru (270 RON pe sezon) se recuperează de la primul abonament.");
  assert.equal(lib.upsell(cheap, null).text, "Economisești 300 RON la fiecare abonament de 8 ședințe.");
  const same = { ...SCHOOL, priceLists: [{ name: "Standard", items: [item({ memberPrice: 890 })] }] };
  assert.equal(lib.upsell(same, 270), null);
});

it("ordinals and lists read as Romanian", () => {
  assert.equal(lib.ordinalRo(1), "primul");
  assert.equal(lib.ordinalRo(2), "al doilea");
  assert.equal(lib.ordinalRo(12), "al 12-lea");
  assert.equal(lib.joinRo(["A"]), "A");
  assert.equal(lib.joinRo(["A", "B"]), "A și B");
  assert.equal(lib.joinRo(["A", "B", "C"]), "A, B și C");
});

it("registrations are open only with the switch on, a current Sezon and a school", () => {
  assert.equal(lib.registrationsOpen(true, INFO), true);
  assert.equal(lib.registrationsOpen(false, INFO), false);
  assert.equal(lib.registrationsOpen(true, { ...INFO, season: null }), false);
  assert.equal(lib.registrationsOpen(true, { ...INFO, schools: [] }), false);
  // Public read unavailable: the switch alone decides.
  assert.equal(lib.registrationsOpen(true, null), true);
  assert.equal(lib.registrationsOpen(false, null), false);
});

it("seasonMonthBounds gives the Program calendar range", () => {
  assert.deepEqual(lib.seasonMonthBounds(INFO.season), { seasonStart: "2026-10", seasonEnd: "2027-05" });
  assert.equal(lib.seasonMonthBounds(null), null);
  assert.equal(lib.seasonMonthBounds({ label: "x", startMonth: "oct", endMonth: "mai" }), null);
});

it("user-visible text uses comma-below ș and ț, never the cedilla", () => {
  const all = JSON.stringify([lib.upsell(SCHOOL, 270), lib.priceBox(SCHOOL, "nonMember", 270), lib.MEMBER_FEE_LABEL, lib.ordinalRo(6)]);
  assert.doesNotMatch(all, /[şţŞŢ]/);
});
