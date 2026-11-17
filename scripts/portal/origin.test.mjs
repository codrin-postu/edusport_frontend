import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const o = canStripTypes ? await import("../../src/lib/portal/origin.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("accepts only the host's own origin on writes", () => {
  assert.equal(o.originAllowed("POST", "https://antrenor.x.ro", "antrenor.x.ro", true), true);
  assert.equal(o.originAllowed("POST", "https://antrenor.x.ro", "ANTRENOR.x.ro", true), true);
  assert.equal(o.originAllowed("POST", "http://antrenor.x.ro", "antrenor.x.ro", true), false);
  assert.equal(o.originAllowed("POST", null, "antrenor.x.ro", true), false);
  assert.equal(o.originAllowed("POST", "https://evil.ro", "antrenor.x.ro", true), false);
  assert.equal(o.originAllowed("PUT", "https://antrenor.x.ro", null, true), false);
  assert.equal(o.originAllowed("GET", null, null, true), true);
  assert.equal(o.originAllowed("POST", "http://antrenor.localhost:3200", "antrenor.localhost:3200", false), true);
});
