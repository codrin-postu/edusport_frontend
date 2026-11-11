import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const k = canStripTypes ? await import("../../src/lib/portal/kit-preview.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("the preview is on only for PORTAL_KIT_PREVIEW=1", () => {
  assert.equal(k.kitPreviewEnabled({}), false);
  assert.equal(k.kitPreviewEnabled({ PORTAL_KIT_PREVIEW: "0" }), false);
  assert.equal(k.kitPreviewEnabled({ PORTAL_KIT_PREVIEW: "1" }), true);
});
