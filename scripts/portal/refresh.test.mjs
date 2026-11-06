import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const lib = canStripTypes ? await import("../../src/lib/portal/refresh.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const session = (n) => ({ ok: true, session: { accessToken: `a${n}`, refreshToken: `r${n}`, accessExpiresAt: "2026-11-06T10:00:00Z", deviceKey: null } });

function setup(behaviour) {
  const state = { calls: 0, now: 1_000_000 };
  const run = async(token) => {
    state.calls += 1;
    await new Promise((r) => setTimeout(r, 5));
    return behaviour(token, state.calls);
  };
  return { state, refresh: lib.createRefresher(run, () => state.now) };
}

it("runs once for parallel calls with one token", async() => {
  const { state, refresh } = setup((_t, n) => session(n));
  const [a, b] = await Promise.all([refresh("rt1"), refresh("rt1")]);
  assert.equal(state.calls, 1);
  assert.deepEqual(a, b);
});

it("reuses a finished result inside the grace, runs again after it", async() => {
  const { state, refresh } = setup((_t, n) => session(n));
  const first = await refresh("rt1");
  state.now += 5000;
  assert.deepEqual(await refresh("rt1"), first);
  assert.equal(state.calls, 1);
  state.now += 26_000;
  await refresh("rt1");
  assert.equal(state.calls, 2);
});

it("runs per token", async() => {
  const { state, refresh } = setup((t) => session(t));
  await Promise.all([refresh("rt1"), refresh("rt2")]);
  assert.equal(state.calls, 2);
});

it("answers not ok when run rejects, and does not cache it", async() => {
  let fail = true;
  const { state, refresh } = setup((_t, n) => {
    if (fail) throw new Error("down");
    return session(n);
  });
  assert.deepEqual(await refresh("rt1"), { ok: false });
  fail = false;
  assert.equal((await refresh("rt1")).ok, true);
  assert.equal(state.calls, 2);
});

it("does not cache a refusal", async() => {
  const { state, refresh } = setup(() => ({ ok: false }));
  await refresh("rt1");
  await refresh("rt1");
  assert.equal(state.calls, 2);
});
