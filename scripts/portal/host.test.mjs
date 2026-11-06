import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const lib = canStripTypes ? await import("../../src/lib/portal/host.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("routes hosts", () => {
  const { siteForHost } = lib;
  assert.equal(siteForHost("antrenor.localhost:3200", undefined), "antrenor");
  assert.equal(siteForHost("ANTRENOR.scoaladepatinaj.com", "antrenor.scoaladepatinaj.com"), "antrenor");
  assert.equal(siteForHost("antrenor.evil.com", "antrenor.scoaladepatinaj.com"), "site");
  assert.equal(siteForHost("sportiv.scoaladepatinaj.com", "antrenor.scoaladepatinaj.com"), "reserved");
  assert.equal(siteForHost(null, undefined), "site");
});

it("keeps each host to its pages", () => {
  const { routeRequest } = lib;
  assert.deepEqual(routeRequest("site", "/antrenor/grupe"), { action: "notFound" });
  assert.deepEqual(routeRequest("site", "/api/portal/auth/login"), { action: "notFound" });
  assert.deepEqual(routeRequest("site", "/cursuri"), { action: "next" });
  assert.deepEqual(routeRequest("antrenor", "/"), { action: "rewrite", pathname: "/antrenor" });
  assert.deepEqual(routeRequest("antrenor", "/grupe/abc"), { action: "rewrite", pathname: "/antrenor/grupe/abc" });
  assert.deepEqual(routeRequest("antrenor", "/robots.txt"), { action: "rewrite", pathname: "/antrenor/robots.txt" });
  assert.deepEqual(routeRequest("antrenor", "/sitemap.xml"), { action: "notFound" });
  assert.deepEqual(routeRequest("antrenor", "/antrenor/grupe"), { action: "notFound" });
  assert.deepEqual(routeRequest("antrenor", "/logo.png"), { action: "next" });
  assert.deepEqual(routeRequest("reserved", "/"), { action: "notFound" });
});
