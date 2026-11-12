import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, isolate, loginAs, mockLog, mockReset } from "./portal-helpers";
import { ADULT_EMAIL, PARENT_EMAIL, SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA_ID = "athana0001";
const FOREIGN_ID = "athforeign1";

test.beforeEach(async() => { await mockReset(); });

const sportivCalls = async() => (await mockLog()).filter((c) => c.path.startsWith("/api/portal/sportiv"));

async function get(page: Page, path: string): Promise<{ status: number; type: string | null; disposition: string | null; nosniff: string | null; text: string }> {
  return page.evaluate(async(p) => {
    const res = await fetch(`/api/portal/sportiv${p}`);
    return { status: res.status, type: res.headers.get("content-type"), disposition: res.headers.get("content-disposition"), nosniff: res.headers.get("x-content-type-options"), text: await res.text() };
  }, path);
}

test("a sportiv login sends host sportiv even when the body says antrenor", async({ page }) => {
  await isolate(page);
  await page.goto(`${SPORTIV_BASE}/robots.txt`);
  const status = await page.evaluate(async(email) => {
    const res = await fetch("/api/portal/auth/login", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ host: "antrenor", email, password: "Throwaway-Sportiv-1" }),
    });
    return res.status;
  }, PARENT_EMAIL);
  expect(status).toBe(200);
  const login = (await mockLog()).find((c) => c.path === "/api/portal/auth/login");
  expect((login?.body as { host?: string }).host).toBe("sportiv");
});

test("a coach login on the sportiv host is refused", async({ page }) => {
  await isolate(page);
  await page.goto(`${SPORTIV_BASE}/robots.txt`);
  const status = await page.evaluate(async() => (await fetch("/api/portal/auth/login", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "antrenor1@example.invalid", password: "Throwaway-Coach-1" }),
  })).status);
  expect(status).toBe(401);
});

test("a coach cookie never reaches a sportiv request", async({ page }) => {
  await loginAs(page);
  await page.goto(`${SPORTIV_BASE}/robots.txt`);
  const r = await get(page, "/me");
  expect(r.status).toBe(401);
  expect(await sportivCalls()).toHaveLength(0);
  expect((await page.context().cookies(COACH_BASE)).some((c) => c.name === "es_rt")).toBe(true);
  expect((await page.context().cookies(SPORTIV_BASE)).some((c) => c.name === "es_rt")).toBe(false);
});

test("me answers with the bearer after a sportiv login", async({ page }) => {
  await loginSportiv(page, ADULT_EMAIL);
  const r = await get(page, "/me");
  expect(r.status).toBe(200);
  expect(JSON.parse(r.text).data.email).toBe(ADULT_EMAIL);
  expect((await sportivCalls())[0]?.headers.auth).toMatch(/^Bearer /);
});

test("a foreign origin write is refused before any call", async({ page }) => {
  await loginSportiv(page);
  const res = await page.request.post("http://localhost:3200/api/portal/sportiv/me/password", { headers: { host: "sportiv.localhost:3200", origin: "http://evil.example", "content-type": "application/json" }, data: {} });
  expect(res.status()).toBe(403);
  expect((await sportivCalls()).filter((c) => c.method === "POST")).toHaveLength(0);
});

test("the calendar file streams with its headers", async({ page }) => {
  await loginSportiv(page);
  const r = await get(page, `/athletes/${ANA_ID}/calendar.ics`);
  expect(r.status).toBe(200);
  expect(r.type).toContain("text/calendar");
  expect(r.disposition).toBe("attachment; filename=\"edusport-ana.ics\"");
  expect(r.text).toContain("BEGIN:VCALENDAR");
  expect(r.nosniff).toBe("nosniff");
});

test("the agreement PDF streams with nosniff", async({ page }) => {
  await loginSportiv(page);
  const r = await get(page, `/athletes/${ANA_ID}/documents/acord`);
  expect(r.status).toBe(200);
  expect(r.type).toContain("application/pdf");
  expect(r.nosniff).toBe("nosniff");
});

test("an athlete the holder does not hold passes the ClubAdminError through", async({ page }) => {
  await loginSportiv(page);
  const r = await get(page, `/athletes/${FOREIGN_ID}/calendar.ics`);
  expect(r.status).toBe(403);
  expect(JSON.parse(r.text).error.message).toBe("Nu mai ai acces la acest sportiv.");
  expect((await page.context().cookies(SPORTIV_BASE)).some((c) => c.name === "es_rt")).toBe(true);
});

test("a path outside the allowlist is 404 and never called", async({ page }) => {
  await loginSportiv(page);
  const r = await get(page, "/coach/me");
  expect(r.status).toBe(404);
  expect(await sportivCalls()).toHaveLength(0);
});
