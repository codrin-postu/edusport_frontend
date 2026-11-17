import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const lib = canStripTypes ? await import("../../src/lib/portal/body-limit.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const streamOf = (chunks) => new ReadableStream({
  start(c) { for (const x of chunks) c.enqueue(new TextEncoder().encode(x)); c.close(); },
});
const req = (chunks, length = null) => ({ headers: { get: (n) => (n === "content-length" ? length : null) }, body: chunks === null ? null : streamOf(chunks) });

it("reads a body under the limit", async() => {
  assert.deepEqual(await lib.readLimitedText(req(["{\"a\":", "1}"]), 10), { ok: true, text: "{\"a\":1}" });
  assert.deepEqual(await lib.readLimitedText(req(null), 10), { ok: true, text: "" });
});

it("refuses a body over the limit, declared or streamed", async() => {
  assert.deepEqual(await lib.readLimitedText(req(["x"], "11"), 10), { ok: false, reason: "too-large" });
  assert.deepEqual(await lib.readLimitedText(req(["xxxxx", "xxxxx", "x"]), 10), { ok: false, reason: "too-large" });
});

it("stops reading at the limit instead of buffering the rest", async() => {
  let pulled = 0;
  const body = new ReadableStream({ pull(c) { pulled += 1; c.enqueue(new TextEncoder().encode("xxxxxxxx")); } });
  const out = await lib.readLimitedText({ headers: { get: () => null }, body }, 10);
  assert.equal(out.ok, false);
  assert.ok(pulled <= 3, `pulled ${pulled}`);
});
