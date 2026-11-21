import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const l = canStripTypes ? await import("../../src/lib/ghid/limit.ts") : {};
const n = canStripTypes ? await import("../../src/lib/ghid/next.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("blocks after 10 failures and frees after the window", () => {
  const lim = l.createLimiter();
  for (let i = 0; i < 9; i++) lim.takeFailure("ip", 1000);
  assert.equal(lim.isBlocked("ip", 1000), false);
  lim.takeFailure("ip", 1000);
  assert.equal(lim.isBlocked("ip", 1000), true);
  assert.equal(lim.isBlocked("ip", 1000 + l.GHID_LIMIT.windowMs - 1), true);
  assert.equal(lim.isBlocked("ip", 1000 + l.GHID_LIMIT.windowMs), false);
});

it("keeps keys independent", () => {
  const lim = l.createLimiter();
  for (let i = 0; i < 10; i++) lim.takeFailure("a", 0);
  assert.equal(lim.isBlocked("a", 0), true);
  assert.equal(lim.isBlocked("b", 0), false);
});

it("safeNext keeps wiki paths and refuses the rest", () => {
  assert.equal(n.safeNext("/ghid/plati"), "/ghid/plati");
  assert.equal(n.safeNext("/ghid"), "/ghid");
  for (const bad of ["//evil.com", "https://x", "/ghid/../admin", "/ghid/intra", "/ghid//x", "/ghid\\x", "/ghid/%2e%2e/x", "/ghidx", "", "/", null, undefined]) {
    assert.equal(n.safeNext(bad), "/ghid", String(bad));
  }
});
