import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const f = canStripTypes ? await import("../../src/lib/portal/features.ts") : {};
const coachNavLib = canStripTypes ? await import("../../src/app/(antrenor)/antrenor/_lib/nav.ts") : {};
const sportivNavLib = canStripTypes ? await import("../../src/app/(sportiv)/sportiv/(app)/_lib/nav.ts") : {};
const coach = canStripTypes ? await import("../../src/lib/portal/coach-routes.ts") : {};
const sportiv = canStripTypes ? await import("../../src/lib/portal/sportiv-routes.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const ON = { prezenta: true, abonamente: true, parcurs: true };
const hrefs = (nav) => nav.map((i) => i.href);

it("a me answer without switches leaves everything on", () => {
  assert.deepEqual(f.portalFeatures({}), ON);
  assert.deepEqual(f.portalFeatures(null), ON);
  assert.deepEqual(f.portalFeatures({ features: { prezenta: "no", abonamente: false } }), { ...ON, abonamente: false });
});

it("the sportiv nav drops the pages of switched-off features", () => {
  const off = { prezenta: false, abonamente: true, parcurs: false };
  assert.deepEqual(hrefs(sportivNavLib.sportivNav("a1", true, off)), ["/a1", "/a1/concursuri", "/a1/plati"]);
  assert.deepEqual(hrefs(sportivNavLib.sportivNav("a1", true, ON)), ["/a1", "/a1/istoric", "/a1/concursuri", "/a1/parcurs", "/a1/plati"]);
  assert.deepEqual(hrefs(sportivNavLib.sportivNav("a1", false, { ...ON, abonamente: false })), ["/a1", "/a1/istoric", "/a1/parcurs"]);
});

it("the coach nav has no Istoric and no Prezență page without prezenta", () => {
  const off = coachNavLib.coachNav({ ...ON, prezenta: false });
  assert.ok(!hrefs(off).includes("/istoric"));
  assert.ok(!JSON.stringify(off).includes("/prezenta"));
  assert.ok(JSON.stringify(coachNavLib.coachNav(ON)).includes("/prezenta"));
});

it("the allow-lists refuse the routes of a switched-off feature", () => {
  const money = "/athletes/a1/money";
  assert.equal(sportiv.allowedSportivRoute("GET", money, { ...ON, abonamente: false }), false);
  assert.equal(sportiv.allowedSportivRoute("GET", money, ON), true);
  assert.equal(sportiv.allowedSportivRoute("GET", money), true);
  assert.equal(sportiv.allowedSportivRoute("GET", "/athletes/a1/path", { ...ON, parcurs: false }), false);
  assert.equal(sportiv.allowedSportivRoute("POST", "/athletes/a1/pins", { ...ON, parcurs: false }), false);
  assert.equal(sportiv.allowedSportivRoute("GET", "/athletes/a1/history", { ...ON, prezenta: false }), false);
  assert.equal(sportiv.allowedSportivRoute("GET", "/athletes/a1/home", { prezenta: false, abonamente: false, parcurs: false }), true);
  const noPrezenta = { ...ON, prezenta: false };
  for (const [m, p] of [["GET", "/session"], ["PUT", "/session"], ["POST", "/session/check"], ["POST", "/lessons"], ["GET", "/history"], ["GET", "/groups/g1/saved-days"]]) {
    assert.equal(coach.allowedCoachRoute(m, p, noPrezenta), false, `${m} ${p}`);
    assert.equal(coach.allowedCoachRoute(m, p, ON), true, `${m} ${p}`);
  }
  assert.equal(coach.allowedCoachRoute("GET", "/athletes/a1/parcurs", { ...ON, parcurs: false }), false);
  assert.equal(coach.allowedCoachRoute("POST", "/athletes/a1/awards", { ...ON, parcurs: false }), false);
  assert.equal(coach.allowedCoachRoute("GET", "/today", { prezenta: false, abonamente: false, parcurs: false }), true);
});

it("the coach athlete card hides the attendance and money blocks of a switched-off feature", () => {
  const card = { presence: { season: 4, lessons: 1, last: null, missedThisMonth: 0 }, abonament: { code: null, next: 1, slots: 8, validUntil: "2026-11-28", location: null } };
  assert.deepEqual(f.cardBlocks(card, ON), card);
  assert.equal(f.cardBlocks(card, { ...ON, prezenta: false }).presence, null);
  assert.equal(f.cardBlocks(card, { ...ON, prezenta: false }).abonament, card.abonament);
  assert.equal(f.cardBlocks(card, { ...ON, abonamente: false }).abonament, null);
  assert.equal(f.cardBlocks(card, { ...ON, abonamente: false }).presence, card.presence);
  assert.equal(f.cardBlocks({ abonament: null }, ON).presence, null);
});
