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
