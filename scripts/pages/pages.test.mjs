// Loads the TypeScript source directly (node >= 22.18 strips types natively).
// src/lib/pages.ts has no imports, which is what makes this possible.
import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const {
  PAGE_KEYS,
  PAGE_ROUTES,
  filterNavItems,
  isHrefEnabled,
  pageKeyForPath,
  parseDisabledPages,
} = canStripTypes ? await import("../../src/lib/pages.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("every key has exactly one route", () => {
  assert.deepEqual(
    [...PAGE_ROUTES.map((r) => r.key)].sort(),
    [...PAGE_KEYS].sort(),
  );
});

it("pageKeyForPath maps each switchable address", () => {
  const cases = {
    "/despre-noi": "istoric",
    "/despre-noi/echipa": "echipa",
    "/despre-noi/sportivi": "sportivi",
    "/despre-noi/sportivi/ana-popescu": "sportivi",
    "/despre-noi/realizari": "realizari",
    "/despre-noi/realizari?sezon=2024-2025": "realizari",
    "/voluntariat": "voluntariat",
    "/voluntariat/inscriere": "voluntariat",
    "/cursuri": "scoala",
    "/cursuri/program": "program",
    "/cursuri/regulament": "regulament",
    "/noutati": "noutati",
    "/noutati?category=evenimente": "noutati",
    "/noutati/un-articol": "noutati",
    "/noutati/#top": "noutati",
    "/parteneri": "parteneri",
    "/inscrieri": "inscrieri",
    "/inscrieri/": "inscrieri",
  };
  for (const [href, key] of Object.entries(cases)) {
    assert.equal(pageKeyForPath(href), key, href);
  }
});

it("always-on, external and unknown addresses have no key", () => {
  for (const href of [
    "/",
    "/contact",
    "/protectia-datelor",
    "https://anpc.ro/",
    "//example.com/noutati",
    "#",
    "",
    "/despre-noi/altceva",
    "/cursuri/altceva",
    "/noutatile",
  ]) {
    assert.equal(pageKeyForPath(href), null, href);
  }
});

it("parseDisabledPages only switches off explicit false on known keys", () => {
  assert.deepEqual(parseDisabledPages(undefined), new Set());
  assert.deepEqual(parseDisabledPages(null), new Set());
  assert.deepEqual(parseDisabledPages({}), new Set());
  assert.deepEqual(
    parseDisabledPages([
      { key: "noutati", enabled: false },
      { key: " parteneri ", enabled: false },
      { key: "echipa", enabled: true },
      { key: "program", enabled: "false" },
      { key: "program" },
      { key: "necunoscut", enabled: false },
      { enabled: false },
      null,
      "noutati",
    ]),
    new Set(["noutati", "parteneri"]),
  );
});

it("isHrefEnabled", () => {
  const off = new Set(["noutati"]);
  assert.equal(isHrefEnabled("/noutati?category=evenimente", off), false);
  assert.equal(isHrefEnabled("/noutati/x", off), false);
  assert.equal(isHrefEnabled("/contact", off), true);
  assert.equal(isHrefEnabled("/noutati", new Set()), true);
});

const menu = [
  { key: "acasa", label: "Acasă", href: "/" },
  {
    key: "despre-noi",
    label: "Despre noi",
    promo: { title: "Despre noi", description: "d", gradient: "g" },
    dropdown: [
      { label: "Istoric", href: "/despre-noi" },
      { label: "Echipa", href: "/despre-noi/echipa" },
    ],
  },
  {
    key: "cursuri",
    label: "Cursuri",
    promo: { title: "Cursuri", description: "d", gradient: "g" },
    dropdown: [
      { label: "Școala", href: "/cursuri" },
      { label: "Evenimente", href: "/noutati?category=evenimente" },
    ],
  },
  { key: "noutati", label: "Noutăți", href: "/noutati" },
  { key: "contact", label: "Contact", href: "/contact" },
];

it("filterNavItems with nothing off returns the same list", () => {
  assert.equal(filterNavItems(menu, new Set()), menu);
});

it("filterNavItems drops links and dropdown children, keeps promo while a child stays", () => {
  const out = filterNavItems(menu, new Set(["noutati", "istoric"]));
  assert.deepEqual(
    out.map((i) => i.key),
    ["acasa", "despre-noi", "cursuri", "contact"],
  );
  const despre = out.find((i) => i.key === "despre-noi");
  assert.deepEqual(despre.dropdown.map((d) => d.label), ["Echipa"]);
  assert.ok(despre.promo);
  const cursuri = out.find((i) => i.key === "cursuri");
  assert.deepEqual(cursuri.dropdown.map((d) => d.label), ["Școala"]);
  // Input untouched.
  assert.equal(menu[1].dropdown.length, 2);
});

it("filterNavItems removes a dropdown whose children are all off", () => {
  const out = filterNavItems(menu, new Set(["istoric", "echipa"]));
  assert.equal(out.find((i) => i.key === "despre-noi"), undefined);
});

it("filterNavItems keeps an untouched dropdown by identity", () => {
  const out = filterNavItems(menu, new Set(["parteneri"]));
  assert.equal(out[1], menu[1]);
});
