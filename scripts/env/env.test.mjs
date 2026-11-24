import { test } from "node:test";
import assert from "node:assert/strict";

// Node without type stripping cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const lib = canStripTypes ? await import("../../src/lib/env.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("envText treats missing, empty and blank values as missing", () => {
  assert.equal(lib.envText(undefined), undefined);
  assert.equal(lib.envText(""), undefined);
  assert.equal(lib.envText("   "), undefined);
  assert.equal(lib.envText(" https://x.ro "), "https://x.ro");
});

it("envOr falls back on empty values, which ?? would let through", () => {
  assert.equal(lib.envOr("", "fallback"), "fallback");
  assert.equal(lib.envOr(undefined, "fallback"), "fallback");
  assert.equal(lib.envOr("set", "fallback"), "set");
});

it("siteUrlFrom returns the configured origin in production", () => {
  assert.equal(lib.siteUrlFrom("https://www.example.ro", "production"), "https://www.example.ro");
});

it("siteUrlFrom fails a production build without NEXT_PUBLIC_SITE_URL, empty value included, with a clear message", () => {
  assert.throws(() => lib.siteUrlFrom(undefined, "production"), /NEXT_PUBLIC_SITE_URL is required for a production build/);
  assert.throws(() => lib.siteUrlFrom("", "production"), /NEXT_PUBLIC_SITE_URL is required/);
  assert.throws(() => lib.siteUrlFrom("  ", "production"), /NEXT_PUBLIC_SITE_URL is required/);
});

it("siteUrlFrom uses a local default outside production, never the old domain", () => {
  assert.equal(lib.siteUrlFrom(undefined, "development"), "http://localhost:3000");
  assert.equal(lib.siteUrlFrom("", undefined), "http://localhost:3000");
});

it("strapiImagePattern derives the uploads host from the Strapi URL", () => {
  assert.deepEqual(lib.strapiImagePattern("https://cms.example.ro"), { protocol: "https", hostname: "cms.example.ro", port: "", pathname: "/uploads/**" });
  assert.deepEqual(lib.strapiImagePattern("http://localhost:18890"), { protocol: "http", hostname: "localhost", port: "18890", pathname: "/uploads/**" });
  assert.equal(lib.strapiImagePattern(undefined), null);
  assert.equal(lib.strapiImagePattern(""), null);
  assert.equal(lib.strapiImagePattern("not a url"), null);
});
