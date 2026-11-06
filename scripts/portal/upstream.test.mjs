import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const u = canStripTypes ? await import("../../src/lib/portal/upstream.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("builds the BFF headers", () => {
  const h = u.bffHeaders({ secret: "s", ip: null });
  assert.equal(h["x-portal-secret"], "s");
  assert.equal(h["x-portal-client-ip"], "unknown");
  assert.equal(h["content-type"], "application/json");
  assert.ok(!("authorization" in h) && !("x-portal-device" in h) && !("x-portal-user-agent" in h));
  const full = u.bffHeaders({ secret: "s", ip: " 1.2.3.4 ", userAgent: "u".repeat(600), device: "d", access: "tok" });
  assert.equal(full["x-portal-client-ip"], "1.2.3.4");
  assert.equal(full["x-portal-user-agent"].length, 512);
  assert.equal(full.authorization, "Bearer tok");
  assert.equal(u.bffHeaders({ secret: "s", ip: "x".repeat(65) })["x-portal-client-ip"], "unknown");
});

it("classifies coach answers", () => {
  assert.equal(u.classifyCoach(200, {}), "ok");
  assert.equal(u.classifyCoach(401, {}), "refresh");
  assert.equal(u.classifyCoach(403, { error: { name: "ForbiddenError", message: "x" } }), "cut");
  assert.equal(u.classifyCoach(403, {}), "cut");
  assert.equal(u.classifyCoach(403, { data: null, error: { status: 403, name: "ClubAdminError", message: "Nu mai ai acces la această grupă." } }), "refusal");
  assert.equal(u.classifyCoach(404, {}), "refusal");
});

it("reads a session only when it is whole", () => {
  const ok = { accessToken: "a", refreshToken: "r", accessExpiresAt: "2026-11-06T10:00:00Z", deviceKey: null };
  assert.deepEqual(u.readSession({ data: ok }), ok);
  assert.equal(u.readSession({ data: { ...ok, accessExpiresAt: "nope" } }), null);
  assert.equal(u.readSession({ data: { ...ok, deviceKey: 3 } }), null);
  assert.equal(u.readSession({ data: { ...ok, refreshToken: undefined } }), null);
  assert.equal(u.readSession(null), null);
});

it("masks secrets", () => {
  assert.ok(u.maskSecrets("GET /invitatie/abcDEF123?x=1").includes("/invitatie/***?x=1"));
  assert.equal(u.maskSecrets("{\"secret\":\"abc\",\"email\":\"a@b\"}"), "{\"secret\":\"***\",\"email\":\"a@b\"}");
  assert.equal(u.maskSecrets("{\"refreshToken\":\"r\",\"accessToken\":\"a\",\"password\":\"p\",\"current\":\"c\",\"code\":\"1\"}"), "{\"refreshToken\":\"***\",\"accessToken\":\"***\",\"password\":\"***\",\"current\":\"***\",\"code\":\"***\"}");
});

it("forwards only a real client IP", async() => {
  const { cleanIp } = await import("../../src/lib/portal/client-ip.ts");
  assert.equal(cleanIp(" 203.0.113.9 "), "203.0.113.9");
  assert.equal(cleanIp("2001:db8::1"), "2001:db8::1");
  assert.equal(cleanIp("1.1.1.1, 2.2.2.2"), null);
  assert.equal(cleanIp("evil\nheader"), null);
  assert.equal(cleanIp(null), null);
});

it("only a backend 401 ends the session on refresh", () => {
  const { refreshFailure } = u;
  assert.equal(refreshFailure(401), null);
  assert.equal(refreshFailure(400), null);
  assert.equal(refreshFailure(502), 502);
  assert.equal(refreshFailure(503), 503);
  assert.equal(refreshFailure(403), 503);
  assert.equal(refreshFailure(429), 502);
});
