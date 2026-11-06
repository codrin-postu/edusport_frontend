import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const canStripTypes = Boolean(process.features?.typescript);
const g = canStripTypes ? await import("../../src/lib/portal/google.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("makes a base64url token and an S256 pair", () => {
  assert.match(g.randomToken(24), /^[A-Za-z0-9_-]{32}$/);
  const { verifier, challenge } = g.pkcePair();
  assert.equal(challenge, createHash("sha256").update(verifier).digest("base64url"));
});

it("builds the authorization url", () => {
  const u = new URL(g.authUrl({ clientId: "cid", redirectUri: "http://a/cb", state: "st", nonce: "no", challenge: "ch" }));
  assert.equal(`${u.origin}${u.pathname}`, "https://accounts.google.com/o/oauth2/v2/auth");
  const p = u.searchParams;
  assert.equal(p.get("response_type"), "code");
  assert.equal(p.get("scope"), "openid email");
  assert.equal(p.get("code_challenge_method"), "S256");
  assert.equal(p.get("prompt"), "select_account");
  assert.equal(p.get("state"), "st");
  assert.equal(p.get("nonce"), "no");
  assert.equal(p.get("code_challenge"), "ch");
  assert.equal(p.get("client_id"), "cid");
  assert.equal(p.get("redirect_uri"), "http://a/cb");
});

it("round-trips the cookie and rejects expired or malformed ones", () => {
  const v = { state: "s", nonce: "n", verifier: "v", invite: true, exp: 5000 };
  assert.deepEqual(g.decodeGoogleCookie(g.encodeGoogleCookie(v), 4999), v);
  assert.equal(g.decodeGoogleCookie(g.encodeGoogleCookie(v), 5001), null);
  assert.equal(g.decodeGoogleCookie("%%%", 0), null);
  assert.equal(g.decodeGoogleCookie(null, 0), null);
});
