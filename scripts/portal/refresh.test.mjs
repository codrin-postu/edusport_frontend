import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const lib = canStripTypes ? await import("../../src/lib/portal/refresh.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const session = (n) => ({ ok: true, session: { accessToken: `a${n}`, refreshToken: `r${n}`, accessExpiresAt: "2026-11-06T10:00:00Z", deviceKey: null } });

function setup(behaviour) {
  const state = { calls: 0, now: 1_000_000, ctxs: [] };
  const run = async(token, ctx) => {
    state.ctxs.push(ctx);
    state.calls += 1;
    await new Promise((r) => setTimeout(r, 5));
    return behaviour(token, state.calls, ctx);
  };
  return { state, refresh: lib.createRefresher(run, () => state.now) };
}

it("runs once for parallel calls with one token", async() => {
  const { state, refresh } = setup((_t, n) => session(n));
  const [a, b] = await Promise.all([refresh("rt1", "dev1", null), refresh("rt1", "dev1", null)]);
  assert.equal(state.calls, 1);
  assert.deepEqual(a, b);
});

it("reuses a finished result inside the grace, runs again after it", async() => {
  const { state, refresh } = setup((_t, n) => session(n));
  const first = await refresh("rt1", "dev1", null);
  state.now += 5000;
  assert.deepEqual(await refresh("rt1", "dev1", null), first);
  assert.equal(state.calls, 1);
  state.now += 6000;
  await refresh("rt1", "dev1", null);
  assert.equal(state.calls, 2);
});

it("runs per token", async() => {
  const { state, refresh } = setup((t) => session(t));
  await Promise.all([refresh("rt1", "dev1", null), refresh("rt2", "dev1", null)]);
  assert.equal(state.calls, 2);
});

it("answers not ok when run rejects, and does not cache it", async() => {
  let fail = true;
  const { state, refresh } = setup((_t, n) => {
    if (fail) throw new Error("down");
    return session(n);
  });
  assert.deepEqual(await refresh("rt1", "dev1", null), { ok: false, transient: 502 });
  fail = false;
  assert.equal((await refresh("rt1", "dev1", null)).ok, true);
  assert.equal(state.calls, 2);
});

it("does not cache a refusal", async() => {
  const { state, refresh } = setup(() => ({ ok: false }));
  await refresh("rt1", "dev1", null);
  await refresh("rt1", "dev1", null);
  assert.equal(state.calls, 2);
});

it("does not hand a cached result to the same token with another or no device", async() => {
  const { state, refresh } = setup((_t, n) => session(n));
  await refresh("rt1", "dev1", null);
  await refresh("rt1", "dev2", null);
  assert.equal(state.calls, 2);
  await refresh("rt1", null, null);
  await refresh("rt1", null, null);
  assert.equal(state.calls, 4);
});

it("shares only calls in flight without a device", async() => {
  const { state, refresh } = setup((_t, n) => session(n));
  await Promise.all([refresh("rt1", null, null), refresh("rt1", null, null)]);
  assert.equal(state.calls, 1);
});

it("gives each parallel refresh its own ctx", async() => {
  const { state, refresh } = setup((_t, _n, ctx) => ({ ok: true, session: { accessToken: ctx.ip, refreshToken: "r", accessExpiresAt: "2026-11-06T10:00:00Z", deviceKey: null } }));
  const [a, b] = await Promise.all([refresh("rt1", "d", { ip: "1.1.1.1" }), refresh("rt2", "d", { ip: "2.2.2.2" })]);
  assert.equal(a.session.accessToken, "1.1.1.1");
  assert.equal(b.session.accessToken, "2.2.2.2");
  assert.deepEqual(state.ctxs.map((c) => c.ip).sort(), ["1.1.1.1", "2.2.2.2"]);
});

it("passes a transient failure through and does not cache it", async() => {
  const { state, refresh } = setup(() => ({ ok: false, transient: 503 }));
  assert.deepEqual(await refresh("rt1", "d", null), { ok: false, transient: 503 });
  await refresh("rt1", "d", null);
  assert.equal(state.calls, 2);
});
