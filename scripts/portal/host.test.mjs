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

it("passes only real static files on the coach host", () => {
  const { routeRequest } = lib;
  assert.deepEqual(routeRequest("antrenor", "/noutati/a.b"), { action: "rewrite", pathname: "/antrenor/noutati/a.b" });
  assert.deepEqual(routeRequest("antrenor", "/icons/x.svg"), { action: "next" });
  assert.deepEqual(routeRequest("antrenor", "/favicon.ico"), { action: "next" });
  assert.deepEqual(routeRequest("antrenor", "/_next/static/a.js"), { action: "next" });
});

it("decodes percent-encoded paths before routing", () => {
  const { routeRequest } = lib;
  assert.deepEqual(routeRequest("site", "/%61ntrenor/grupe"), { action: "notFound" });
  assert.deepEqual(routeRequest("site", "/api/%70ortal/auth/login"), { action: "notFound" });
  assert.deepEqual(routeRequest("antrenor", "/%61ntrenor/grupe"), { action: "notFound" });
  assert.deepEqual(routeRequest("site", "/%E0%A4%A"), { action: "next" });
});

it("answers 404 for encoded separators and dot segments", () => {
  const { routeRequest } = lib;
  const gone = { action: "notFound" };
  for (const p of ["/..%2Fnoutati%2Fx", "/%2E%2E%2Fnoutati", "/..%5Cnoutati", "/%2e%2e/noutati", "/a%252F..%252Fnoutati", "/a/%2E/b", "/a\\b"]) {
    assert.deepEqual(routeRequest("antrenor", p), gone, p);
    assert.deepEqual(routeRequest("site", p), gone, p);
  }
  assert.deepEqual(routeRequest("site", "/x%2F..%2Fantrenor%2Fgrupe"), gone);
});

it("rewrites the coach host with the raw path", () => {
  const { routeRequest } = lib;
  assert.deepEqual(routeRequest("antrenor", "/grupe/a%20b"), { action: "rewrite", pathname: "/antrenor/grupe/a%20b" });
});
