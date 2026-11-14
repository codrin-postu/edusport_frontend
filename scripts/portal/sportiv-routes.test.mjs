import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const r = canStripTypes ? await import("../../src/lib/portal/sportiv-routes.ts") : {};
const s = canStripTypes ? await import("../../src/lib/portal/site.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const TABLE = [
  ["GET", "/me"], ["PUT", "/me"], ["PUT", "/me/notifications"], ["POST", "/me/password"], ["GET", "/me/devices"], ["DELETE", "/me/devices/d1"],
  ["GET", "/athletes"], ["GET", "/me/notices"], ["POST", "/me/notices/abc123/dismiss"],
  ["GET", "/athletes/a1/home"], ["POST", "/athletes/a1/promotion/seen"], ["GET", "/athletes/a1/profile"], ["GET", "/athletes/a1/history"],
  ["GET", "/athletes/a1/calendar.ics"], ["GET", "/athletes/a1/calendar"], ["GET", "/athletes/a1/competitions"], ["GET", "/athletes/a1/competitions/res-1"],
  ["GET", "/athletes/a1/path"], ["GET", "/athletes/a1/money"], ["GET", "/athletes/a1/payments"], ["GET", "/athletes/a1/subscriptions"],
  ["GET", "/athletes/a1/documents/acord"],
];

it("allows every backend sportiv route with its own method", () => {
  for (const [method, path] of TABLE) {
    assert.equal(r.allowedSportivRoute(method, path), true, `${method} ${path}`);
    for (const other of ["GET", "POST", "PUT", "DELETE"].filter((m) => !TABLE.some(([tm, tp]) => tm === m && tp === path))) assert.equal(r.allowedSportivRoute(other, path), false, `${other} ${path}`);
  }
});

it("refuses everything else", () => {
  assert.equal(r.allowedSportivRoute("PUT", "/athletes/abc/home"), false);
  assert.equal(r.allowedSportivRoute("GET", "/athletes/../me"), false);
  assert.equal(r.allowedSportivRoute("GET", `/athletes/${"a".repeat(65)}/home`), false);
  assert.equal(r.allowedSportivRoute("GET", `/athletes/${"a".repeat(64)}/home`), true);
  assert.equal(r.allowedSportivRoute("GET", "/coach/me"), false);
  assert.equal(r.allowedSportivRoute("POST", "/auth/2fa"), false);
  assert.equal(r.allowedSportivRoute("GET", "/athletes/a1/home/x"), false);
  assert.equal(r.allowedSportivRoute("GET", "/athletes/a1/competitions/a/b"), false);
  assert.equal(r.allowedSportivRoute("GET", "/athletes/a1/competitions/.."), false);
});

it("allows only the notices list and dismiss", () => {
  assert.equal(r.allowedSportivRoute("GET", "/me/notices"), true);
  assert.equal(r.allowedSportivRoute("POST", "/me/notices/abc123/dismiss"), true);
  assert.equal(r.allowedSportivRoute("POST", "/me/notices/../x/dismiss"), false);
  assert.equal(r.allowedSportivRoute("DELETE", "/me/notices/abc123"), false);
  assert.equal(r.allowedSportivRoute("GET", "/me/notices/abc123"), false);
  assert.equal(r.sportivQuery("/me/notices", "?x=1"), "");
  assert.equal(r.sportivQuery("/me/notices", "?seen=1"), "?seen=1");
  assert.equal(r.sportivQuery("/me/notices", "?seen=1&x=2"), "?seen=1");
  assert.equal(r.sportivQuery("/me/notices", "?seen=0"), "");
  assert.equal(r.sportivQuery("/me/notices", "?seen=true"), "");
  assert.equal(r.sportivQuery("/athletes", "?seen=1"), "");
});

it("marks the two file routes", () => {
  assert.equal(r.isSportivFile("/athletes/a1/calendar.ics"), true);
  assert.equal(r.isSportivFile("/athletes/a1/documents/acord"), true);
  assert.equal(r.isSportivFile("/athletes/a1/calendar"), false);
});

it("forwards only the query names a route reads", () => {
  assert.equal(r.sportivQuery("/athletes/a/competitions", "q=x&sort=points&evil=1"), "?q=x&sort=points");
  assert.equal(r.sportivQuery("/athletes/a/competitions", new URLSearchParams("season=2025-2026&page=2&page=3")), "?season=2025-2026&page=2");
  assert.equal(r.sportivQuery("/athletes/a/home", "page=2"), "");
  assert.equal(r.sportivQuery("/athletes/a/history", "page=2&x=1"), "?page=2");
  assert.equal(r.sportivQuery("/athletes/a/payments", "page=2"), "?page=2");
  assert.equal(r.sportivQuery("/athletes/a/calendar", "month=2026-11&q=1"), "?month=2026-11");
  assert.equal(r.sportivQuery("/me", "month=2026-11"), "");
});

it("names the site of a host", () => {
  assert.equal(s.siteOf("sportiv.localhost:3200"), "sportiv");
  assert.equal(s.siteOf("antrenor.localhost:3200"), "antrenor");
  assert.equal(s.siteOf("localhost:3200"), null);
  assert.equal(s.siteOf(null), null);
});
