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
  assert.equal(event.transaction, "GET /invite");
  assert.equal(event.contexts.nextjs.request_path, "/api/portal/google/callback?***");
  assert.equal(event.contexts.trace.data["http.method"], "GET");
  assert.equal(event.request.headers.cookie, undefined);
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
  assert.equal(e.request.headers.cookie, undefined);
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

const withLocation = (hostname, fn) => {
  const had = Object.getOwnPropertyDescriptor(globalThis, "location");
  Object.defineProperty(globalThis, "location", { value: { hostname }, configurable: true, writable: true });
  try { fn(); } finally { if (had) Object.defineProperty(globalThis, "location", had); else delete globalThis.location; }
};

it("scrubs a server error event shaped like captureRequestError: no ids in request_path or headers", () => {
  const ID = "k2j3h4g5f6d7s8a9q0w1e2r3";
  const event = {
    transaction: `GET /${ID}/concursuri/res-0001`,
    contexts: { nextjs: { request_path: `/${ID}/concursuri/res-0001?page=2`, router_kind: "App Router", route_path: "/[athlete]/concursuri/[result]" } },
    request: {
      method: "GET",
      headers: {
        host: "sportiv.edusport.ro",
        "user-agent": "Mozilla/5.0",
        "accept-language": "ro",
        "content-type": "text/html",
        referer: `https://sportiv.edusport.ro/${ID}/calendar`,
        "next-url": `/sportiv/${ID}/calendar`,
        "next-router-state-tree": encodeURIComponent(JSON.stringify(["", { children: [["athleteId", ID, "d"]] }])),
        cookie: "s=x",
        "x-forwarded-for": "1.2.3.4",
      },
    },
  };
  const out = s.scrubEvent(event);
  const text = JSON.stringify(out);
  for (const leak of [ID, "res-0001", "page=2", "athleteId", "calendar", "s=x", "1.2.3.4"]) assert.ok(!text.includes(leak), leak);
  assert.equal(out.contexts.nextjs.request_path, "/[athlete]/concursuri/[result]?***");
  assert.equal(out.transaction, "GET /[athlete]/concursuri/[result]");
  assert.deepEqual(Object.keys(out.request.headers).sort(), ["accept-language", "content-type", "user-agent"]);
});

it("in the browser the portal comes from the hostname: breadcrumbs, fetch urls and transactions become patterns", () => {
  for (const host of ["sportiv.edusport.ro", "sportiv.localhost"]) {
    withLocation(host, () => {
      const crumb = s.scrubBreadcrumb({ category: "navigation", data: { from: "/athana0001/concursuri/r_1-2", to: "/athana0001/istoric?page=2" } });
      assert.equal(crumb.data.from, "/[athlete]/concursuri/[result]");
      assert.equal(crumb.data.to, "/[athlete]/istoric?***");
      const fetchCrumb = s.scrubBreadcrumb({ category: "fetch", data: { url: "/api/portal/sportiv/athletes/athana0001/competitions/res-0001?season=1" } });
      assert.equal(fetchCrumb.data.url, "/api/portal/sportiv/athletes/[id]/competitions/[id]?***");
      const ev = s.scrubEvent({ transaction: "/athana0001/concursuri/r_1-2" });
      assert.equal(ev.transaction, "/[athlete]/concursuri/[result]");
    });
  }
  withLocation("antrenor.edusport.ro", () => {
    assert.equal(s.scrubUrl("/grupe/grp00001/modifica"), "/grupe/[group]/modifica");
  });
});

it("masks ids in /api/portal paths on any host", () => {
  assert.equal(s.scrubUrl("/api/portal/sportiv/athletes/abc/devices/xyz"), "/api/portal/sportiv/athletes/[id]/devices/[id]");
  assert.equal(s.scrubUrl("http://frontend:3000/api/portal/sportiv/me/notices/n1/dismiss"), "http://frontend:3000/api/portal/sportiv/me/notices/[id]/dismiss");
});

it("scrubSpan masks ids with scrubUrl", () => {
  const span = { description: "GET /sportiv/athana0001/istoric", data: { "url.path": "/sportiv/athana0001/calendar", "http.method": "GET" } };
  const out = s.scrubSpan(span);
  assert.equal(out.description, "GET /[athlete]/istoric");
  assert.equal(out.data["url.path"], "/[athlete]/calendar");
  assert.equal(out.data["http.method"], "GET");
});
