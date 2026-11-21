import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const g = canStripTypes ? await import("../../src/lib/ghid/gate.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("accepts only the token of the same password", () => {
  assert.equal(g.isGhidCookieValid(g.ghidToken("a"), "a"), true);
  assert.equal(g.isGhidCookieValid(g.ghidToken("a"), "b"), false);
  assert.equal(g.isGhidCookieValid(undefined, "a"), false);
});

it("fails closed without a password", () => {
  assert.equal(g.isGhidCookieValid(g.ghidToken(""), ""), false);
  assert.equal(g.isGhidCookieValid(g.ghidToken("a"), undefined), false);
});

it("redirects to the login with next, lets valid cookies and the login through", () => {
  assert.deepEqual(g.ghidGate("/ghid/plati", undefined, "a"), { action: "redirect", to: "/ghid/intra?next=%2Fghid%2Fplati" });
  assert.deepEqual(g.ghidGate("/ghid/plati", undefined, "a", "?q=1"), { action: "redirect", to: "/ghid/intra?next=%2Fghid%2Fplati%3Fq%3D1" });
  assert.deepEqual(g.ghidGate("/ghid/plati", g.ghidToken("a"), "a"), { action: "next" });
  assert.deepEqual(g.ghidGate("/ghid/intra", undefined, "a"), { action: "next" });
  assert.equal(g.ghidGate("/ghid/plati", g.ghidToken(""), "").action, "redirect");
});

it("matches only /ghid and below", () => {
  assert.equal(g.isGhidPath("/ghid"), true);
  assert.equal(g.isGhidPath("/ghid/x"), true);
  assert.equal(g.isGhidPath("/ghidx"), false);
});

it("gates encoded and case variants of /ghid", () => {
  for (const p of ["/%67hid", "/GHID/plati", "/ghid%2fplati", "/%2567hid", "/Ghid"]) {
    assert.equal(g.isGhidRequest(p), true, p);
    assert.equal(g.ghidGate(p, undefined, "a").action, "redirect", p);
  }
  assert.equal(g.isGhidRequest("/ghidx"), false);
  assert.equal(g.isGhidRequest("/%E0%A4%A"), true);
  assert.equal(g.ghidGate("/%E0%A4%A", g.ghidToken("a"), "a").action, "redirect");
  assert.equal(g.ghidGate("/%67hid", g.ghidToken("a"), "a").action, "next");
});
