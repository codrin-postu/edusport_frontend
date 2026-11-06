import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockRefreshCount, mockReset, mockState } from "./portal-helpers";

const RAW = "http://localhost:3200";
const AS_COACH = { host: "antrenor.localhost:3200", origin: COACH_BASE };

test.use({ baseURL: COACH_BASE });
test.beforeEach(async() => { await mockReset(); });

type Answer = { status: number; json: { data?: unknown; error?: { name: string; message: string } } };

async function api(page: Page, method: string, path: string, body?: unknown): Promise<Answer> {
  return page.evaluate(async({ m, p, b }) => {
    const res = await fetch(`/api/portal/coach${p}`, { method: m, headers: { "content-type": "application/json" }, body: b === undefined ? undefined : JSON.stringify(b) });
    return { status: res.status, json: await res.json() };
  }, { m: method, p: path, b: body });
}

const cookieNamed = (page: Page, name: string) => page.context().cookies().then((all) => all.find((c) => c.name === name));
const coachCalls = async() => (await mockLog()).filter((c) => c.path.startsWith("/api/portal/coach"));

test("today answers with the bearer and the BFF secret", async({ page }) => {
  await loginAs(page);
  const r = await api(page, "GET", "/today");
  expect(r.status).toBe(200);
  expect(r.json.data).toBeTruthy();
  const call = (await coachCalls()).find((c) => c.path.endsWith("/today"));
  expect(call?.headers.auth).toMatch(/^Bearer /);
  expect(call?.headers.secret).toBeTruthy();
});

test("parallel requests after expiry share one refresh, and the old token is reused inside the grace", async({ page }) => {
  // 17 s lifetime minus the 15 s cookie margin: the access cookie lasts 2 s, the token itself outlives the grace checks.
  await mockState({ accessTtlSec: 17 });
  await loginAs(page);
  const oldRt = (await cookieNamed(page, "es_rt"))?.value ?? "";
  expect(oldRt).not.toBe("");
  await page.waitForTimeout(3000);
  const all = await page.evaluate(async() => {
    const paths = ["/today", "/groups", "/me"];
    return Promise.all(paths.map(async(p) => (await fetch(`/api/portal/coach${p}`)).status));
  });
  expect(all).toEqual([200, 200, 200]);
  expect(await mockRefreshCount()).toBe(1);
  await page.waitForTimeout(5000);
  await page.context().clearCookies({ name: "es_at" });
  await page.context().addCookies([{ name: "es_rt", value: oldRt, url: COACH_BASE, httpOnly: true, sameSite: "Lax" }]);
  expect((await api(page, "GET", "/today")).status).toBe(200);
  expect(await mockRefreshCount()).toBe(1);
});

test("a cut account answers 401 SessionEnded and clears the session cookies", async({ page }) => {
  await loginAs(page);
  await mockState({ cutAccount: true });
  const r = await api(page, "GET", "/today");
  expect(r.status).toBe(401);
  expect(r.json.error?.name).toBe("SessionEnded");
  expect(await cookieNamed(page, "es_at")).toBeFalsy();
  expect(await cookieNamed(page, "es_rt")).toBeFalsy();
});

test("a refused BFF secret on a coach call answers 503 and keeps the cookies", async({ page }) => {
  await loginAs(page);
  await mockState({ refuseSecret: true });
  const r = await api(page, "GET", "/today");
  expect(r.status).toBe(503);
  expect(await cookieNamed(page, "es_at")).toBeTruthy();
  expect(await cookieNamed(page, "es_rt")).toBeTruthy();
});

test("a refresh answered 400 ends the session", async({ page }) => {
  await mockState({ accessTtlSec: 1 });
  await loginAs(page);
  await page.waitForTimeout(1500);
  await mockState({ refreshStatus: 400 });
  const r = await api(page, "GET", "/today");
  expect(r.status).toBe(401);
  expect(r.json.error?.name).toBe("SessionEnded");
  expect(await cookieNamed(page, "es_rt")).toBeFalsy();
});

test("a ClubAdminError 403 shows its message and keeps the cookies", async({ page }) => {
  await loginAs(page);
  const r = await api(page, "PUT", "/groups/gsilver/program-public", { value: true });
  expect(r.status).toBe(403);
  expect(r.json.error?.name).toBe("ClubAdminError");
  expect(r.json.error?.message).toBeTruthy();
  expect(await cookieNamed(page, "es_rt")).toBeTruthy();
});

test("routes outside the allow-list never reach Strapi", async({ request }) => {
  for (const p of ["/api/portal/coach/payments", "/api/portal/coach/../../club/athletes", "/api/portal/coach/groups/a-b/program"]) {
    const res = await request.get(`${RAW}${p}`, { headers: AS_COACH });
    expect(res.status()).toBe(404);
  }
  expect(await coachCalls()).toHaveLength(0);
});

test("only the query parameters a route reads are forwarded", async({ page }) => {
  await loginAs(page);
  const today = await page.evaluate(async() => (await fetch("/api/portal/coach/today?date=2026-11-06&populate=*&filters[a]=1")).status);
  expect(today).toBe(200);
  const search = await page.evaluate(async() => (await fetch("/api/portal/coach/athletes/search?q=ana&group=gsilver&populate=deep")).status);
  expect(search).toBe(200);
  const calls = await coachCalls();
  expect(calls.find((c) => c.path.includes("/today"))?.path).toBe("/api/portal/coach/today?date=2026-11-06");
  expect(calls.find((c) => c.path.includes("/athletes/search"))?.path).toBe("/api/portal/coach/athletes/search?q=ana&group=gsilver");
});

test("an oversized proxy body answers 413 and never reaches Strapi", async({ page }) => {
  await loginAs(page);
  const status = await page.evaluate(async() => {
    const res = await fetch("/api/portal/coach/me", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ phone: "1".repeat(70 * 1024) }) });
    return res.status;
  });
  expect(status).toBe(413);
  expect((await coachCalls()).filter((c) => c.path.endsWith("/me"))).toHaveLength(0);
});

test("encoded traversal in the proxy path never reaches Strapi", async({ request }) => {
  for (const p of ["/api/portal/coach/%2E%2E%2F%2E%2E%2Fclub%2Fathletes", "/api/portal/coach/groups/a%2Fb/program"]) {
    const res = await request.get(`${RAW}${p}`, { headers: AS_COACH });
    expect(res.status(), p).toBe(404);
  }
  expect(await coachCalls()).toHaveLength(0);
});

test("a foreign Origin is refused before any call", async({ request }) => {
  const res = await request.put(`${RAW}/api/portal/coach/me`, { data: {}, headers: { ...AS_COACH, origin: "https://evil.example" } });
  expect(res.status()).toBe(403);
  expect(await coachCalls()).toHaveLength(0);
});

test("revoking the current device clears the session cookies", async({ page }) => {
  await loginAs(page);
  const list = await api(page, "GET", "/me/devices");
  const devices = (list.json.data as { devices?: { id: string; current: boolean }[] }).devices ?? (list.json.data as { id: string; current: boolean }[]);
  const current = devices.find((d) => d.current);
  expect(current).toBeTruthy();
  const r = await api(page, "DELETE", `/me/devices/${current?.id}`);
  expect(r.status).toBe(200);
  expect(await cookieNamed(page, "es_at")).toBeFalsy();
  expect(await cookieNamed(page, "es_rt")).toBeFalsy();
});

for (const [status, answer] of [[502, 502], [503, 503], [403, 503]] as const) {
  test(`a refresh failing with ${status} answers ${answer} and keeps the cookies`, async({ page }) => {
    await mockState({ accessTtlSec: 1 });
    await loginAs(page);
    await page.waitForTimeout(1500);
    await mockState({ refreshStatus: status });
    const r = await api(page, "GET", "/today");
    expect(r.status).toBe(answer);
    expect(await cookieNamed(page, "es_rt")).toBeTruthy();
  });
}

test("a refresh refused with 401 ends the session", async({ page }) => {
  await mockState({ accessTtlSec: 1 });
  await loginAs(page);
  await page.waitForTimeout(1500);
  await mockState({ refreshStatus: 401 });
  const r = await api(page, "GET", "/today");
  expect(r.status).toBe(401);
  expect(r.json.error?.name).toBe("SessionEnded");
  expect(await cookieNamed(page, "es_rt")).toBeFalsy();
});
