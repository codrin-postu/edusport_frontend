import { test } from "node:test";
import assert from "node:assert/strict";

const canStripTypes = Boolean(process.features?.typescript);
const s = canStripTypes ? await import("../../src/lib/portal/sentry-scrub.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const SECRET = "AbCdEf0123456789AbCdEf0123456789";

it("masks the invite secret and the whole query in a URL", () => {
  assert.equal(s.maskUrl(`/invitatie/${SECRET}`), "/invitatie/***");
  assert.equal(s.maskUrl("/api/portal/google/callback?code=4%2F0abc&state=xyz"), "/api/portal/google/callback?***");
  assert.equal(s.maskUrl(`https://antrenor.example/invitatie/${SECRET}?a=1#frag`), "https://antrenor.example/invitatie/***?***");
});

it("scrubs a transaction-shaped event", () => {
  const event = {
    type: "transaction",
    transaction: `GET /invitatie/${SECRET}`,
    request: { url: `https://antrenor.example/invitatie/${SECRET}`, query_string: "code=abc&state=def", headers: { cookie: "x", referer: "https://a/b?code=1" } },
    contexts: {
      nextjs: { request_path: "/api/portal/google/callback?code=abc&state=def" },
      trace: { description: `GET /invitatie/${SECRET}`, data: { "url.full": `https://h/invitatie/${SECRET}`, "url.query": "code=abc", "http.target": "/x?code=abc", "http.method": "GET" } },
    },
    spans: [{ description: "GET /api/portal/google/callback?code=abc", data: { "url.path": `/invitatie/${SECRET}`, "http.url": "https://h/cb?state=s" } }],
  };
  const out = JSON.stringify(s.scrubEvent(event));
  for (const leak of [SECRET, "code=abc", "state=def", "state=s", "code=1"]) assert.ok(!out.includes(leak), leak);
  assert.equal(event.transaction, "GET /invitatie/***");
  assert.equal(event.contexts.nextjs.request_path, "/api/portal/google/callback?***");
  assert.equal(event.contexts.trace.data["http.method"], "GET");
  assert.equal(event.request.headers.cookie, "***");
});

it("scrubs a span", () => {
  const span = { description: `GET /invitatie/${SECRET}?x=1`, data: { "url.full": `https://h/invitatie/${SECRET}?x=1`, "url.query": "x=1", "http.response.status_code": 200 } };
  const out = s.scrubSpan(span);
  assert.equal(out.description, "GET /invitatie/***?***");
  assert.equal(out.data["url.query"], "***");
  assert.equal(out.data["url.full"], "https://h/invitatie/***?***");
  assert.equal(out.data["http.response.status_code"], 200);
});

it("masks code, state and secret parameters in free text", async() => {
  const { maskSecrets } = await import("../../src/lib/portal/upstream.ts");
  assert.equal(maskSecrets("a?code=1&state=2&x=3"), "a?code=***&state=***&x=3");
});
