import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const f = canStripTypes ? await import("../../src/lib/portal/sportiv-badges.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const badge = (over) => ({ key: "antrenamente", tier: "silver", label: "50 antrenamente", count: 63, next: 100, tiers: [], ...over });

it("names the tiers for a screen reader", () => {
  assert.deepEqual(["bronze", "silver", "gold", "platinum", "ice"].map(f.tierWord), ["bronz", "argint", "aur", "platină", "gheață"]);
});

it("labels a badge with its tier", () => {
  assert.equal(f.badgeAria(badge({})), "50 de antrenamente, nivel argint");
  assert.equal(f.badgeAria(badge({ tier: "bronze", label: "25 antrenamente" })), "25 de antrenamente, nivel bronz");
  assert.equal(f.badgeAria(badge({ tier: "platinum", label: "250 antrenamente" })), "250 de antrenamente, nivel platină");
  assert.equal(f.badgeAria(badge({ key: "concursuri", tier: "gold", label: "5 concursuri" })), "5 concursuri, nivel aur");
  assert.equal(f.badgeAria(badge({ key: "concursuri", tier: "platinum", label: "10 concursuri" })), "10 concursuri, nivel platină");
  assert.equal(f.badgeAria(badge({ key: "concursuri", tier: "ice", label: "25 concursuri" })), "25 de concursuri, nivel gheață");
  assert.equal(f.badgeAria(badge({ key: "concursuri", tier: "bronze", label: "1 concurs" })), "1 concurs, nivel bronz");
  assert.equal(f.badgeAria(badge({ key: "sezon", tier: "bronze", label: "Sezon complet" })), "Sezon complet, nivel bronz");
});

it("labels a locked badge", () => {
  assert.equal(f.badgeAria(badge({ key: "concursuri", tier: null, label: "Concursuri", count: 0, next: 1 })), "Concursuri, încă niciunul (blocat)");
});

it("says how far the next tier is, nothing at the top", () => {
  assert.equal(f.badgeProgress(badge({})), "63 din 100");
  assert.equal(f.badgeProgress(badge({ count: 0, next: 25 })), "0 din 25");
  assert.equal(f.badgeProgress(badge({ count: 300, next: null })), null);
});
