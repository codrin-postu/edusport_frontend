import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const s = canStripTypes ? await import("../../src/lib/portal/sentry-scrub.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const SECRET = "AbCdEf0123456789AbCdEf0123456789";

it("masks the invite secret and the whole query in a URL", () => {
  assert.equal(s.maskUrl(`/invite/${SECRET}`), "/invite/***");
  assert.equal(s.maskUrl("/api/portal/google/callback?code=4%2F0abc&state=xyz"), "/api/portal/google/callback?***");
  assert.equal(s.maskUrl(`https://antrenor.example/invite/${SECRET}?a=1#frag`), "https://antrenor.example/invite/***?***");
});

it("scrubs a transaction-shaped event", () => {
  const event = {
    type: "transaction",
    transaction: `GET /invite/${SECRET}`,
    request: { url: `https://antrenor.example/invite/${SECRET}`, query_string: "code=abc&state=def", headers: { cookie: "x", referer: "https://a/b?code=1" } },
    contexts: {
      nextjs: { request_path: "/api/portal/google/callback?code=abc&state=def" },
      trace: { description: `GET /invite/${SECRET}`, data: { "url.full": `https://h/invite/${SECRET}`, "url.query": "code=abc", "http.target": "/x?code=abc", "http.method": "GET" } },
    },
    spans: [{ description: "GET /api/portal/google/callback?code=abc", data: { "url.path": `/invite/${SECRET}`, "http.url": "https://h/cb?state=s" } }],
  };
  const out = JSON.stringify(s.scrubEvent(event));
  for (const leak of [SECRET, "code=abc", "state=def", "state=s", "code=1"]) assert.ok(!out.includes(leak), leak);
  assert.equal(event.transaction, "GET /invite/***");
  assert.equal(event.contexts.nextjs.request_path, "/api/portal/google/callback?***");
  assert.equal(event.contexts.trace.data["http.method"], "GET");
  assert.equal(event.request.headers.cookie, "***");
});

it("scrubs a span", () => {
  const span = { description: `GET /invite/${SECRET}?x=1`, data: { "url.full": `https://h/invite/${SECRET}?x=1`, "url.query": "x=1", "http.response.status_code": 200 } };
  const out = s.scrubSpan(span);
  assert.equal(out.description, "GET /invite/***?***");
  assert.equal(out.data["url.query"], "***");
  assert.equal(out.data["url.full"], "https://h/invite/***?***");
  assert.equal(out.data["http.response.status_code"], 200);
});

it("masks code, state and secret parameters in free text", async() => {
  const { maskSecrets } = await import("../../src/lib/portal/upstream.ts");
  assert.equal(maskSecrets("a?code=1&state=2&x=3"), "a?code=***&state=***&x=3");
});

const ID = "k2j3h4g5f6d7s8a9q0w1e2r3";

it("scrubs personal data from an event", () => {
  const e = s.scrubEvent({
    message: "fail for ana@example.com",
    user: { email: "ana@example.com", ip_address: "1.2.3.4" },
    extra: { name: "Ana Pop" },
    request: { url: `https://sportiv.example/${ID}/istoric?page=2`, cookies: { s: "x" }, headers: { cookie: "s=x" }, data: { name: "Ana Pop" } },
    exception: { values: [{ value: `athlete ${ID} not held by ana@example.com` }] },
    breadcrumbs: [{ category: "ui.click", message: "button Ana Pop" }, { category: "console", message: "x ana@example.com" }],
  });
  assert.equal(e.user, undefined);
  assert.equal(e.extra, undefined);
  assert.equal(e.request.url, "https://sportiv.example/[athlete]/istoric?***");
  assert.equal(e.request.cookies, undefined);
  assert.equal(e.request.headers.cookie, "***");
  assert.equal(e.request.data, undefined);
  assert.equal(e.breadcrumbs[0].message, undefined);
  const out = JSON.stringify(e);
  for (const leak of ["ana@example.com", ID, "Ana Pop"]) assert.ok(!out.includes(leak), leak);
});

it("scrubText masks e-mails, ids, portal paths and invite secrets", () => {
  assert.equal(s.scrubText("mail ana@example.com now"), "mail ***@*** now");
  assert.equal(s.scrubText(`id ${ID}.`), "id [id].");
  assert.equal(s.scrubText("GET https://antrenor.example/grupe/abc123/modifica?x=1 failed"), "GET https://antrenor.example/grupe/[group]/modifica?*** failed");
  assert.equal(s.scrubText("https://www.example.ro/cursuri?x=1"), "https://www.example.ro/cursuri?***");
  assert.ok(!s.scrubText(`https://sportiv.example/invite/${SECRET}`).includes(SECRET));
  assert.equal(s.scrubText("plain words stay"), "plain words stay");
});

it("scrubs breadcrumbs: clicks and inputs lose their message", () => {
  assert.equal(s.scrubBreadcrumb({ category: "ui.click", message: "button Ana Pop" }).message, undefined);
  assert.equal(s.scrubBreadcrumb({ category: "ui.input", message: "input name" }).message, undefined);
  assert.equal(s.scrubBreadcrumb({ category: "console", message: "to ana@example.com" }).message, "to ***@***");
});

it("tracesSampler is 0 on portal paths and 0.1 elsewhere", () => {
  assert.equal(s.tracesSampler({ name: "GET /sportiv/[athleteId]/calendar" }), 0);
  assert.equal(s.tracesSampler({ name: "GET /antrenor/api/portal/coach/[...path]" }), 0);
  assert.equal(s.tracesSampler({ name: "GET /cursuri" }), 0.1);
  assert.equal(s.tracesSampler({ name: "GET /x", normalizedRequest: { url: "https://sportiv.example/abc" } }), 0);
  assert.equal(s.tracesSampler({ name: "GET /x", normalizedRequest: { url: "https://www.example.ro/abc" } }), 0.1);
  assert.equal(s.isPortalTransaction(undefined, undefined), false);
});

it("masks a 24-char documentId without digits in an uncovered portal path", () => {
  const out = s.scrubUrl("https://sportiv.example/zzz/abcdefghijklmnopqrstuvwx/x");
  assert.ok(!out.includes("abcdefghijklmnopqrstuvwx"), out);
  assert.ok(out.includes("[id]"), out);
});
