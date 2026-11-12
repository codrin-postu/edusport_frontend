import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { isolate, mockReset } from "./portal-helpers";
import { ADULT_EMAIL, PARENT_EMAIL, SPORTIV_BASE, SPORTIV_PASSWORD } from "./sportiv-helpers";

const INVITE_SPORTIV = "inv-sportiv-00000000000000000000";
const RAW = "http://localhost:3200";
const AS_SPORTIV = { host: "sportiv.localhost:3200" };

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async({ page }) => {
  await mockReset();
  await isolate(page);
});

async function signIn(page: Page, email: string, password: string): Promise<void> {
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Parolă", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Intră" }).click();
}

test("the login shows the sportiv frame, Google and both fields", async({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("Portal sportiv", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByLabel("Parolă", { exact: true })).toBeVisible();
});

test("a wrong password shows the refusal", async({ page }) => {
  await page.goto("/login");
  await signIn(page, PARENT_EMAIL, "wrong-password-1");
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("E-mailul sau parola nu sunt corecte.");
});

test("a good login of a parent goes to the root", async({ page }) => {
  await page.goto("/login");
  await signIn(page, PARENT_EMAIL, SPORTIV_PASSWORD);
  await expect(page).toHaveURL(`${SPORTIV_BASE}/`);
  expect((await page.context().cookies(SPORTIV_BASE)).some((c) => c.name === "es_rt")).toBe(true);
});

test("a good login of an adult sportiv signs in", async({ page }) => {
  await page.goto("/login");
  await signIn(page, ADULT_EMAIL, SPORTIV_PASSWORD);
  await expect(page).toHaveURL(`${SPORTIV_BASE}/`);
  expect((await page.context().cookies(SPORTIV_BASE)).some((c) => c.name === "es_rt")).toBe(true);
});

test("a reset request shows the answer", async({ page }) => {
  await page.goto("/forgot-password");
  await page.getByLabel("E-mail").fill(PARENT_EMAIL);
  await page.getByRole("button", { name: "Trimite codul" }).click();
  await expect(page.getByText("Dacă adresa are cont, am trimis un cod.")).toBeVisible();
});

test("an invite link moves the secret into a cookie and shows the welcome", async({ page, request }) => {
  const bridge = await request.get(`${RAW}/invite/${INVITE_SPORTIV}`, { headers: AS_SPORTIV, maxRedirects: 0 });
  expect(bridge.status()).toBe(303);
  expect(bridge.headers().location).toBe("/invite");
  await page.goto(`/invite/${INVITE_SPORTIV}`);
  await expect(page).toHaveURL(`${SPORTIV_BASE}/invite`);
  await expect(page.getByRole("heading", { name: "Bine ai venit" })).toBeVisible();
  await expect(page.getByText(PARENT_EMAIL)).toBeVisible();
  await expect(page.getByRole("textbox", { name: "E-mail" })).toHaveCount(0);
  await expect(page.getByText("Portal sportiv", { exact: true })).toBeVisible();
});

test("an accepted invite without a session lands on the login form", async({ page }) => {
  await page.goto(`/invite/${INVITE_SPORTIV}`);
  await page.getByLabel("Parolă nouă").fill("Alta-Parola-12345");
  await page.getByRole("button", { name: "Salvează" }).click();
  await expect(page).toHaveURL(`${SPORTIV_BASE}/login`);
  await expect(page.getByLabel("E-mail")).toBeVisible();
  expect((await page.context().cookies(SPORTIV_BASE)).some((c) => c.name === "es_rt")).toBe(false);
});

test("an unknown invite shows the expired text", async({ page }) => {
  await page.goto("/invite/inv-nothing-0000000000000000000000");
  await expect(page.getByRole("heading", { name: "Bine ai venit" })).toBeVisible();
  await expect(page.getByLabel("Parolă nouă")).toHaveCount(0);
});

test("robots.txt disallows everything and every page says noindex", async({ page }) => {
  const robots = await page.goto("/robots.txt");
  expect(await robots?.text()).toContain("Disallow: /");
  for (const path of ["/login", "/forgot-password", "/invite", "/robots.txt", "/nope"]) {
    const res = await page.goto(path);
    expect(res?.headers()["x-robots-tag"], path).toBe("noindex, nofollow");
  }
});

test("an unknown path shows the 404 page", async({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("Pagina nu există").first()).toBeVisible();
});

async function googleStart(request: APIRequestContext): Promise<URL> {
  const start = await request.get(`${RAW}/api/portal/google/start`, { headers: AS_SPORTIV, maxRedirects: 0 });
  expect(start.status()).toBe(303);
  return new URL(start.headers().location ?? "");
}

test("Google start redirects with the sportiv callback", async({ request }) => {
  const url = await googleStart(request);
  expect(url.origin).toBe("https://accounts.google.com");
  // PORTAL_HOST_SPORTIV is configured in the e2e build, so the callback is https (as for the coach host).
  expect(url.searchParams.get("redirect_uri")).toBe("https://sportiv.localhost:3200/api/portal/google/callback");
});

test("no page offers a 2FA or passkey step", async({ page }) => {
  for (const path of ["/login", "/forgot-password", `/invite/${INVITE_SPORTIV}`]) {
    await page.goto(path);
    const text = (await page.locator("body").innerText()).toLowerCase();
    expect(text, path).not.toMatch(/2fa|passkey|autentificare în doi|chei de acces|cod de verificare/);
  }
});

test("a good login stores the entry flag before moving on, and reduced motion adds no overlay", async({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const w = window as unknown as { __entry: string[] };
    w.__entry = [];
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function(k: string, v: string) {
      if (k === "es-entry") w.__entry.push(v);
      return set.call(this, k, v);
    };
  });
  await page.goto("/login");
  await signIn(page, PARENT_EMAIL, SPORTIV_PASSWORD);
  await expect(page.locator("[data-entry-overlay]")).toBeAttached();
  await expect(page).toHaveURL(`${SPORTIV_BASE}/`);
});

test("with reduced motion the overlay is never attached", async({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    new MutationObserver(() => {
      if (document.querySelector("[data-entry-overlay]")) (window as unknown as { __saw: boolean }).__saw = true;
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto("/login");
  await signIn(page, PARENT_EMAIL, SPORTIV_PASSWORD);
  await expect(page).toHaveURL(`${SPORTIV_BASE}/`);
  expect(await page.evaluate(() => (window as unknown as { __saw?: boolean }).__saw ?? false)).toBe(false);
});
