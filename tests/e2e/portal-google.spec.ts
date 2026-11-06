import { expect, test, type APIRequestContext } from "@playwright/test";
import { mockLog, mockReset, mockState } from "./portal-helpers";

const RAW = "http://localhost:3200";
const AS_COACH = { host: "antrenor.localhost:3200" };

test.beforeEach(async() => { await mockReset(); });

type Redirect = { status: number; location: string; cookies: string[] };

async function get(request: APIRequestContext, path: string, cookie?: string): Promise<Redirect> {
  const res = await request.get(`${RAW}${path}`, { headers: { ...AS_COACH, ...(cookie ? { cookie } : {}) }, maxRedirects: 0 });
  const cookies = res.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value);
  return { status: res.status(), location: res.headers().location ?? "", cookies };
}

async function begin(request: APIRequestContext): Promise<{ state: string; jar: string }> {
  const start = await get(request, "/api/portal/google/start");
  expect(start.status).toBe(303);
  const url = new URL(start.location);
  expect(url.origin).toBe("https://accounts.google.com");
  expect(url.searchParams.get("redirect_uri")).toBe("http://antrenor.localhost:3200/api/portal/google/callback");
  const line = start.cookies.find((c) => c.startsWith("es_g="));
  expect(line).toContain("HttpOnly");
  return { state: url.searchParams.get("state") ?? "", jar: line?.split(";")[0] ?? "" };
}

test("a good callback sets the session and goes home", async({ request }) => {
  const { state, jar } = await begin(request);
  const cb = await get(request, `/api/portal/google/callback?code=ok:antrenor1@example.invalid&state=${state}`, jar);
  expect(cb.status).toBe(303);
  expect(cb.location).toBe("/");
  for (const name of ["es_at", "es_rt"]) expect(cb.cookies.some((c) => c.startsWith(`${name}=`))).toBe(true);
  expect(cb.cookies.find((c) => c.startsWith("es_g="))).toMatch(/Max-Age=0/i);
  const call = (await mockLog()).find((c) => c.path === "/api/portal/auth/google");
  expect(call?.headers.secret).toBeTruthy();
  expect(JSON.stringify(call?.body)).toContain("codeVerifier");
});

test("a wrong state goes back to the login with no Strapi call", async({ request }) => {
  const { jar } = await begin(request);
  const cb = await get(request, "/api/portal/google/callback?code=ok:antrenor1@example.invalid&state=nope", jar);
  expect(cb.location).toBe("/intrare");
  expect(cb.cookies.some((c) => c.startsWith("es_at="))).toBe(false);
  expect((await mockLog()).some((c) => c.path === "/api/portal/auth/google")).toBe(false);
});

test("a refusal leaves the Strapi message in the flash cookie", async({ request }) => {
  const { state, jar } = await begin(request);
  const cb = await get(request, `/api/portal/google/callback?code=ok:nobody@example.invalid&state=${state}`, jar);
  expect(cb.location).toBe("/intrare");
  const flash = cb.cookies.find((c) => c.startsWith("es_flash="))?.split(";")[0] ?? "";
  const res = await request.get(`${RAW}/api/portal/auth/flash`, { headers: { ...AS_COACH, cookie: flash } });
  expect(await res.json()).toEqual({ data: { message: "Nu am găsit un cont pentru adresa asta." } });
});

test("a Strapi failure goes to the login with a flash", async({ request }) => {
  await mockState({ failGoogle: true });
  const { state, jar } = await begin(request);
  const cb = await get(request, `/api/portal/google/callback?code=ok:antrenor1@example.invalid&state=${state}`, jar);
  expect(cb.location).toBe("/intrare");
  expect(cb.cookies.some((c) => c.startsWith("es_flash="))).toBe(true);
});

test("no client id means the login page", async({ request }) => {
  await mockState({ googleClientId: null });
  const start = await get(request, "/api/portal/google/start");
  expect(start.location).toBe("/intrare");
  expect(start.cookies.some((c) => c.startsWith("es_g="))).toBe(false);
});
