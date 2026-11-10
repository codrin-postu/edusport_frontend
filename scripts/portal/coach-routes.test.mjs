import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const r = canStripTypes ? await import("../../src/lib/portal/coach-routes.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("allows the coach routes and nothing else", () => {
  assert.equal(r.allowedCoachRoute("PUT", "/program/abc123/dates/2026-11-06"), true);
  assert.equal(r.allowedCoachRoute("GET", "/program/abc123"), false);
  assert.equal(r.allowedCoachRoute("DELETE", "/me/devices/x1"), true);
  assert.equal(r.allowedCoachRoute("GET", "/groups/abc/saved-days"), true);
  assert.equal(r.allowedCoachRoute("GET", "/../club/athletes"), false);
  assert.equal(r.allowedCoachRoute("GET", "/groups/a/b"), false);
  assert.equal(r.allowedCoachRoute("GET", "/groups/a-b"), false);
  assert.equal(r.allowedCoachRoute("PUT", "/program/abc/dates/2026-1-6"), false);
  assert.equal(r.allowedCoachRoute("POST", "/today"), false);
  assert.equal(r.allowedCoachRoute("GET", `/groups/${"a".repeat(65)}`), false);
});

it("forwards only the query parameters a route reads", () => {
  const { forwardedQuery } = r;
  const q = (s) => new URLSearchParams(s);
  assert.equal(forwardedQuery("/today", q("date=2026-11-06&populate=*")), "?date=2026-11-06");
  assert.equal(forwardedQuery("/groups/abc1/saved-days", q("month=2026-11&filters[x]=1")), "?month=2026-11");
  assert.equal(forwardedQuery("/groups/abc1/program", q("month=2026-11&month=2026-12")), "?month=2026-11");
  assert.equal(forwardedQuery("/history", q("month=2026-11&x=1")), "?month=2026-11");
  assert.equal(forwardedQuery("/athletes/search", q("q=ana&group=g1&populate=deep")), "?q=ana&group=g1");
  assert.equal(forwardedQuery("/session", q("id=s1&x=1")), "?id=s1");
  assert.equal(forwardedQuery("/me", q("populate=*")), "");
  assert.equal(forwardedQuery("/groups", q("filters=1")), "");
});

it("allows the canvas routes", () => {
  const a = r.allowedCoachRoute;
  assert.equal(a("GET", "/calendar"), true);
  assert.equal(a("POST", "/calendar"), false);
  assert.equal(a("POST", "/groups/gavansati/members/amaria/move"), true);
  assert.equal(a("POST", "/groups/gavansati/members/amaria/remove"), true);
  assert.equal(a("DELETE", "/groups/gavansati/members/amaria"), false);
  assert.equal(a("POST", "/groups/g/members/../move"), false);
  assert.equal(a("GET", "/competitions"), true);
  assert.equal(a("POST", "/groups/g%2Fx/members/a/move"), false);
  assert.equal(a("POST", "/groups/%2E%2E/members/a/remove"), false);
  assert.equal(a("POST", "/groups/gavansati/members/amaria/remove/"), false);
  const q = (s) => new URLSearchParams(s);
  assert.equal(r.forwardedQuery("/calendar", q("month=2026-11&x=1")), "?month=2026-11");
  assert.equal(r.forwardedQuery("/competitions", q("scope=mine&season=2026-2027&q=x")), "?scope=mine&season=2026-2027");
});

it("allows the lesson plan route and forwards the delete scope", () => {
  const a = r.allowedCoachRoute;
  assert.equal(a("PUT", "/lessons/lser1/plan"), true);
  assert.equal(a("POST", "/lessons/lser1/plan"), false);
  assert.equal(a("PUT", "/lessons/../plan"), false);
  assert.equal(r.forwardedQuery("/lessons/lser1", new URLSearchParams("scope=following&x=1")), "?scope=following");
});
