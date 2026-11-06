import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const c = canStripTypes ? await import("../../src/lib/portal/cookies.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const now = 1_800_000_000_000;
const session = (deviceKey) => ({ accessToken: "a", refreshToken: "r", accessExpiresAt: new Date(now + 600000).toISOString(), deviceKey });

it("names cookies with the __Host- prefix only over https", () => {
  assert.equal(c.cookieNames(true).refresh, "__Host-es_rt");
  assert.equal(c.cookieNames(false).refresh, "es_rt");
  assert.equal(c.cookieNames(true).flash, "__Host-es_flash");
});

it("sets session cookies httpOnly, lax, path /", () => {
  const list = c.sessionCookies(session(null), now, true);
  assert.equal(list.length, 2);
  assert.equal(list[0].maxAge, 585);
  assert.equal(list[1].maxAge, 2592000);
  for (const x of list) assert.deepEqual([x.secure, x.httpOnly, x.sameSite, x.path], [true, true, "lax", "/"]);
  const withDevice = c.sessionCookies(session("d"), now, false);
  assert.equal(withDevice.length, 3);
  assert.equal(withDevice[2].maxAge, 34560000);
  assert.equal(withDevice[2].secure, false);
});

it("clamps the access max-age", () => {
  const late = { ...session(null), accessExpiresAt: new Date(now + 5000).toISOString() };
  assert.equal(c.sessionCookies(late, now, true)[0].maxAge, 0);
  const far = { ...session(null), accessExpiresAt: new Date(now + 3600000).toISOString() };
  assert.equal(c.sessionCookies(far, now, true)[0].maxAge, 600);
});

it("clears access and refresh, keeps the device", () => {
  assert.deepEqual(c.clearSessionCookies(true).map((x) => x.name), ["__Host-es_at", "__Host-es_rt"]);
  assert.ok(c.clearSessionCookies(true).every((x) => x.value === "" && x.maxAge === 0));
});

it("detects https", () => {
  assert.equal(c.isSecureRequest("https://a.ro/x", null), true);
  assert.equal(c.isSecureRequest("http://a.ro/x", "https"), true);
  assert.equal(c.isSecureRequest("http://a.ro/x", null), false);
});
