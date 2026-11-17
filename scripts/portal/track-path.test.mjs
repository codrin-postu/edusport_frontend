import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const t = canStripTypes ? await import("../../src/lib/portal/track-path.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("normalises sportiv paths to route patterns", () => {
  assert.equal(t.trackPath("sportiv", "/k2j3h4g5f6d7s8a9q0w1e2r3"), "/[athlete]");
  assert.equal(t.trackPath("sportiv", "/k2j3h4g5f6d7s8a9q0w1e2r3/istoric"), "/[athlete]/istoric");
  assert.equal(t.trackPath("sportiv", "/k2j3/concursuri/r_1-2?page=2"), "/[athlete]/concursuri/[result]");
  assert.equal(t.trackPath("sportiv", "/setari/sportiv/k2j3"), "/setari/sportiv/[athlete]");
  assert.equal(t.trackPath("sportiv", "/sportiv/k2j3/plati"), "/[athlete]/plati");
  assert.equal(t.trackPath("sportiv", "/invite/SECRETVALUE"), "/invite");
  assert.equal(t.trackPath("sportiv", "/"), "/");
  assert.equal(t.trackPath("sportiv", "/login?next=/x"), "/login");
  assert.equal(t.trackPath("sportiv", "/k2j3/ceva"), "/[other]");
});

it("normalises antrenor paths to route patterns", () => {
  assert.equal(t.trackPath("antrenor", "/grupe/abc123/modifica"), "/grupe/[group]/modifica");
  assert.equal(t.trackPath("antrenor", "/lectie/abc123"), "/lectie/[lesson]");
  assert.equal(t.trackPath("antrenor", "/lectie/noua"), "/lectie/noua");
  assert.equal(t.trackPath("antrenor", "/sportiv/abc123"), "/sportiv/[athlete]");
  assert.equal(t.trackPath("antrenor", "/antrenor/sportiv/abc123"), "/sportiv/[athlete]");
  assert.equal(t.trackPath("antrenor", "/ceva/necunoscut"), "/[other]");
  assert.equal(t.trackPath("antrenor", "/invite/SECRET?x=1"), "/invite");
});
