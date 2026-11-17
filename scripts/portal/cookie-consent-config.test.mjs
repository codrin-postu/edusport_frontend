import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const mod = canStripTypes ? await import("../../src/components/blocks/cookie-consent/config.ts") : {};
const config = mod.default;
const it = canStripTypes ? test : (name) => test.skip(name);

it("never pre-enables a category that needs consent", () => {
  assert.equal(config.categories.necessary.enabled, true);
  assert.equal(config.categories.necessary.readOnly, true);
  assert.equal(config.categories.functionality.enabled, false);
  assert.equal(config.categories.analytics.enabled, false);
});

it("keeps refusal as visible as acceptance on both layers", () => {
  assert.equal(config.guiOptions.consentModal.equalWeightButtons, true);
  assert.equal(config.guiOptions.preferencesModal.equalWeightButtons, true);
  const ro = config.language.translations.ro;
  assert.ok(ro.consentModal.acceptAllBtn);
  assert.ok(ro.consentModal.acceptNecessaryBtn, "first layer has a refuse button");
});

it("exposes the category names the gates rely on", () => {
  assert.equal(mod.COOKIE_CATEGORIES.functionality, "functionality");
  assert.ok(mod.COOKIE_PREFERENCES_LABEL.length > 0);
});
