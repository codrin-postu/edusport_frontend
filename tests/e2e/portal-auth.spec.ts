import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, COACH_EMAIL, COACH_PASSWORD, mockLog, mockReset, mockState } from "./portal-helpers";

const INVITE = "inv-valid-0000000000000000000000";
// Node does not resolve *.localhost: raw API calls reach the server on localhost with the coach Host header.
const RAW = "http://localhost:3200";
const AS_COACH = { host: "antrenor.localhost:3200", origin: COACH_BASE };
const BADLOGIN = "E-mailul sau parola nu sunt corecte.";

test.use({ baseURL: COACH_BASE });
test.beforeEach(async() => { await mockReset(); });

async function post(page: Page, path: string, body: unknown, origin?: string): Promise<{ status: number; text: string }> {
  await page.goto(`${COACH_BASE}/robots.txt`);
  return page.evaluate(async({ p, b, o }) => {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (o) headers.origin = o;
    const res = await fetch(p, { method: "POST", headers, body: JSON.stringify(b) });
    return { status: res.status, text: await res.text() };
  }, { p: path, b: body, o: origin });
}

const cookieNamed = (page: Page, name: string) => page.context().cookies().then((all) => all.find((c) => c.name === name));

test("login sets HttpOnly session cookies and no token in the body", async({ request }) => {
  const res = await request.post(`${RAW}/api/portal/auth/login`, { data: { email: COACH_EMAIL, password: COACH_PASSWORD }, headers: AS_COACH });
  expect(res.status()).toBe(200);
  const setCookie = res.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value);
  for (const name of ["es_at", "es_rt"]) {
    const line = setCookie.find((c) => c.startsWith(`${name}=`));
    expect(line).toBeTruthy();
    expect(line).toContain("HttpOnly");
    expect(line).toMatch(/SameSite=lax/i);
  }
  const text = await res.text();
  expect(text).not.toMatch(/accessToken|refreshToken/);
  expect(JSON.parse(text)).toEqual({ data: { ok: true } });
  const call = (await mockLog()).find((c) => c.path === "/api/portal/auth/login");
  expect(call?.headers.secret).toBeTruthy();
  expect(call?.headers.ip).toBeTruthy();
  expect(call?.headers.ua).toBeTruthy();
});

test("wrong password and unknown e-mail answer the same 401", async({ page }) => {
  const a = await post(page, "/api/portal/auth/login", { email: COACH_EMAIL, password: "wrong-password-1" }, COACH_BASE);
  const b = await post(page, "/api/portal/auth/login", { email: "nimeni@example.invalid", password: "wrong-password-1" }, COACH_BASE);
  expect(a.status).toBe(401);
  expect(b.status).toBe(401);
  expect(a.text).toBe(b.text);
  expect(a.text).toContain(BADLOGIN);
});

test("a foreign Origin is refused before any upstream call", async({ request }) => {
  const r = await request.post(`${RAW}/api/portal/auth/login`, { data: { email: COACH_EMAIL, password: COACH_PASSWORD }, headers: { ...AS_COACH, origin: "https://evil.example" } });
  expect(r.status()).toBe(403);
  expect((await mockLog()).some((c) => c.path === "/api/portal/auth/login")).toBe(false);
});

test("invite link moves the secret into a cookie and accepts with a password", async({ page }) => {
  const urls: string[] = [];
  page.on("request", (req) => urls.push(req.url()));
  await page.goto(`${COACH_BASE}/invitatie/${INVITE}`);
  expect(new URL(page.url()).pathname).toBe("/invitatie");
  expect(urls.filter((u) => u.includes("inv-valid")).length).toBe(1);
  expect(urls.filter((u) => u.includes("inv-valid"))[0]).toContain("/invitatie/inv-valid");
  expect(page.url()).not.toContain("inv-valid");
  expect((await cookieNamed(page, "es_inv"))?.httpOnly).toBe(true);
  const res = await post(page, "/api/portal/auth/invite/accept", { password: "Noua-Throwaway-2026" }, COACH_BASE);
  expect(res.status).toBe(200);
  expect(await cookieNamed(page, "es_at")).toBeTruthy();
  expect(await cookieNamed(page, "es_rt")).toBeTruthy();
  expect(await cookieNamed(page, "es_inv")).toBeFalsy();
});

test("a malformed invite secret sets no cookie", async({ page }) => {
  await page.goto(`${COACH_BASE}/invitatie/short`);
  expect(new URL(page.url()).pathname).toBe("/invitatie");
  expect(await cookieNamed(page, "es_inv")).toBeFalsy();
});

test("logout clears the session cookies and keeps the device cookie", async({ page, request }) => {
  const login = await post(page, "/api/portal/auth/login", { email: COACH_EMAIL, password: COACH_PASSWORD }, COACH_BASE);
  expect(login.status).toBe(200);
  expect(await cookieNamed(page, "es_dev")).toBeTruthy();
  expect(await cookieNamed(page, "es_at")).toBeTruthy();
  const out = await post(page, "/api/portal/auth/logout", {}, COACH_BASE);
  expect(out.status).toBe(200);
  expect(await cookieNamed(page, "es_at")).toBeFalsy();
  expect(await cookieNamed(page, "es_rt")).toBeFalsy();
  expect(await cookieNamed(page, "es_dev")).toBeTruthy();
  const raw = await request.post(`${RAW}/api/portal/auth/logout`, { headers: AS_COACH });
  const cleared = raw.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value);
  for (const name of ["es_at", "es_rt"]) expect(cleared.find((c) => c.startsWith(`${name}=`))).toMatch(/Max-Age=0/i);
  expect(cleared.some((c) => c.startsWith("es_dev="))).toBe(false);
});

test("logout clears the session cookies even when the backend call fails", async({ page }) => {
  const login = await post(page, "/api/portal/auth/login", { email: COACH_EMAIL, password: COACH_PASSWORD }, COACH_BASE);
  expect(login.status).toBe(200);
  await mockState({ refuseSecret: true });
  const out = await post(page, "/api/portal/auth/logout", {}, COACH_BASE);
  expect(out.status).toBe(200);
  expect(await cookieNamed(page, "es_at")).toBeFalsy();
  expect(await cookieNamed(page, "es_rt")).toBeFalsy();
});

test("an oversized body is refused with 413, declared or chunked", async({ request }) => {
  const big = JSON.stringify({ email: "a@example.invalid", password: "x".repeat(70 * 1024) });
  const declared = await request.post(`${RAW}/api/portal/auth/login`, { data: big, headers: { ...AS_COACH, "content-type": "application/json" } });
  expect(declared.status()).toBe(413);
  expect((await mockLog()).filter((c) => c.path === "/api/portal/auth/login")).toHaveLength(0);
});
