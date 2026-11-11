import { expect, test } from "@playwright/test";
import { COACH_BASE, COACH_EMAIL, COACH_PASSWORD, isolate, mockReset, mockState } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async({ page }) => {
  await mockReset();
  await isolate(page);
});

const INVITE_OLD = "inv-old-00000000000000000000000000";
const INVITE_VALID = "inv-valid-0000000000000000000000";

async function noStrayText(page: import("@playwright/test").Page): Promise<void> {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/Email/);
  expect(text).not.toContain("·");
}

test("a wrong password shows the refusal and empties the password", async({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill("wrong-password-1");
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("E-mailul sau parola nu sunt corecte.");
  await expect(page.getByLabel("Parolă", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("E-mail")).toHaveValue(COACH_EMAIL);
  await noStrayText(page);
});

test("the eye button shows the password", async({ page }) => {
  await page.goto("/login");
  const field = page.getByLabel("Parolă", { exact: true });
  await field.fill("abc");
  await expect(field).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Arată parola" }).click();
  await expect(field).toHaveAttribute("type", "text");
  await expect(page.getByRole("button", { name: "Ascunde parola" })).toBeVisible();
});

test("inputs carry the right autocomplete", async({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("E-mail")).toHaveAttribute("autocomplete", "email");
  await expect(page.getByLabel("Parolă", { exact: true })).toHaveAttribute("autocomplete", "current-password");
});

test("a good login lands on Azi", async({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill(COACH_PASSWORD);
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  await expect(page.locator("[data-bottom-nav]").getByRole("link", { name: "Azi", exact: true })).toBeVisible();
});

test("a signed in coach is moved off the login screen", async({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill(COACH_PASSWORD);
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  await page.goto("/login");
  await expect(page).toHaveURL(/localhost:3200\/$/);
});

test("reset: an unknown e-mail gets the same text, the code logs in", async({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: "Am uitat parola" }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await page.getByLabel("E-mail").fill("necunoscut@example.invalid");
  await page.getByRole("button", { name: "Trimite codul" }).click();
  await expect(page.getByText("Dacă adresa are cont, am trimis un cod.")).toBeVisible();
  const code = page.getByLabel("Cod din e-mail");
  await expect(code).toHaveAttribute("autocomplete", "one-time-code");
  await expect(code).toHaveAttribute("inputmode", "numeric");
  await expect(page.getByLabel("Parolă nouă")).toHaveAttribute("autocomplete", "new-password");
  await expect(page.getByRole("link", { name: "Înapoi la intrare" })).toBeVisible();
  await noStrayText(page);
});

test("reset: the mock code logs a known coach in", async({ page }) => {
  await page.goto("/forgot-password");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByRole("button", { name: "Trimite codul" }).click();
  await page.getByLabel("Cod din e-mail").fill("123456");
  await page.getByLabel("Parolă nouă").fill("Alta-Parola-12345");
  await page.getByRole("button", { name: "Salvează parola" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
});

test("an old invite shows the expired text and no secret stays in the URL", async({ page }) => {
  await page.goto(`/invite/${INVITE_OLD}`);
  await expect(page).toHaveURL(/\/invite$/);
  await expect(page.getByText("Invitația a expirat. Cere administratorului una nouă.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la intrare" })).toBeVisible();
});

test("a failed invite read shows the load error, not the expired text", async({ page }) => {
  await mockState({ refuseSecret: true });
  await page.goto(`/invite/${INVITE_VALID}`);
  await expect(page.getByText("Nu am putut încărca datele.")).toBeVisible();
  await expect(page.getByText("Invitația a expirat.")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Înapoi la intrare" })).toBeVisible();
});

test("no invite cookie shows the expired text", async({ page }) => {
  await page.goto("/invite");
  await expect(page.getByText("Invitația a expirat. Cere administratorului una nouă.")).toBeVisible();
});

test("a valid invite saves a password and lands on Azi", async({ page }) => {
  await page.goto(`/invite/${INVITE_VALID}`);
  expect(page.url()).not.toContain(INVITE_VALID);
  await expect(page.getByText("Bun venit")).toBeVisible();
  await expect(page.getByText("Contul tău: antrenor2@example.invalid")).toBeVisible();
  await expect(page.getByLabel("Parolă nouă")).toHaveAttribute("autocomplete", "new-password");
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveAttribute("href", "/api/portal/google/start?invite=1");
  await noStrayText(page);
  await page.getByLabel("Parolă nouă").fill("doisprezece12");
  await page.getByRole("button", { name: "Salvează parola" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
});

test("without a Google client id there is no Google link", async({ page }) => {
  await mockState({ googleClientId: null });
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Intră" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveCount(0);
  await page.goto(`/invite/${INVITE_VALID}`);
  await expect(page.getByText("Contul tău: antrenor2@example.invalid")).toBeVisible();
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveCount(0);
});

test("with Google configured the login shows the link before the form", async({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveAttribute("href", "/api/portal/google/start");
});

test("a signed in Google only coach sets a password: e-mail prefilled, code logs in", async({ page, request }) => {
  await isolate(page);
  const raw = "http://localhost:3200";
  const host = { host: "antrenor.localhost:3200" };
  const cookiesOf = (res: Awaited<ReturnType<typeof request.get>>): string[] =>
    res.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value.split(";")[0]);
  const start = await request.get(`${raw}/api/portal/google/start`, { headers: host, maxRedirects: 0 });
  const state = new URL(start.headers().location).searchParams.get("state") ?? "";
  const jar = cookiesOf(start).join("; ");
  const cb = await request.get(`${raw}/api/portal/google/callback?code=ok:antrenor3@example.invalid&state=${state}`, { headers: { ...host, cookie: jar }, maxRedirects: 0 });
  const session = cookiesOf(cb).map((c) => ({ name: c.slice(0, c.indexOf("=")), value: c.slice(c.indexOf("=") + 1) })).filter((c) => c.value !== "");
  await page.context().addCookies(session.map((c) => ({ ...c, url: COACH_BASE })));
  await page.goto("/profil/setari");
  await page.getByRole("link", { name: "Setează o parolă" }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await expect(page.getByText("antrenor3@example.invalid")).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi", exact: true })).toHaveAttribute("href", "/profil/setari");
  await page.getByRole("button", { name: "Trimite codul" }).click();
  await page.getByLabel("Cod din e-mail").fill("123456");
  await page.getByLabel("Parolă nouă").fill("Alta-Parola-12345");
  await page.getByRole("button", { name: "Salvează parola" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  await page.goto("/profil/setari");
  await expect(page.getByLabel("Parola actuală")).toBeVisible();
});

test.describe("branded frame", () => {
  test("desktop: the brand panel and the form", async({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");
    const frame = page.locator("[data-auth-frame]");
    await expect(frame.getByText(/^clubul sportiv$/i)).toBeVisible();
    await expect(frame.getByText("Portal antrenor", { exact: true })).toBeVisible();
    await expect(frame.getByText("EDUSPORT", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Intră în cont" })).toBeVisible();
  });
});

async function signIn(page: import("@playwright/test").Page, password: string = COACH_PASSWORD): Promise<void> {
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Intră" }).click();
}

test.describe("entry transition", () => {
  test("a good login plays the exit, the reveal, then leaves nothing behind", async({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/login");
    await signIn(page);
    const overlay = page.locator("[data-entry-overlay]");
    await expect(overlay).toBeAttached();
    await expect(page.locator("[data-auth-frame]")).toHaveAttribute("data-leaving", "");
    await expect(overlay).toContainText("EDUSPORT");
    await expect(overlay).toContainText(/clubul sportiv/i);
    await expect(overlay).toHaveAttribute("aria-hidden", "true");
    await expect(page).toHaveURL(/localhost:3200\/$/);
    await expect(page.locator("[data-entry-reveal]")).toBeAttached();
    await expect(page.locator("[data-entry-reveal]")).toHaveCount(0, { timeout: 1500 });
    expect(await page.evaluate(() => window.sessionStorage.getItem("es-entry"))).toBeNull();
    await page.getByRole("link", { name: "Grupe" }).first().click();
    await expect(page).toHaveURL(/\/grupe/);
    await page.goto("/");
    await expect(page.locator("[data-bottom-nav]").getByRole("link", { name: "Azi", exact: true })).toBeVisible();
    await expect(page.locator("[data-entry-reveal]")).toHaveCount(0);
    await page.reload();
    await expect(page.locator("[data-entry-reveal]")).toHaveCount(0);
  });

  test("a wrong password starts no animation and the form stays usable", async({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/login");
    await signIn(page, "wrong-password-1");
    await expect(page.getByRole("main").getByRole("alert")).toHaveText("E-mailul sau parola nu sunt corecte.");
    await expect(page.locator("[data-entry-overlay]")).toHaveCount(0);
    await expect(page.locator("[data-auth-frame]")).not.toHaveAttribute("data-leaving", "");
    await page.getByLabel("Parolă", { exact: true }).fill("x");
    await expect(page.getByRole("button", { name: "Intră" })).toBeEnabled();
  });

  test("reduced motion navigates at once, with no overlay ever", async({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      new MutationObserver(() => {
        if (document.querySelector("[data-entry-overlay], [data-entry-reveal]")) (window as unknown as { __sawOverlay: boolean }).__sawOverlay = true;
      }).observe(document, { childList: true, subtree: true });
    });
    await page.goto("/login");
    await signIn(page);
    await expect(page).toHaveURL(/localhost:3200\/$/);
    await expect(page.locator("[data-bottom-nav]").getByRole("link", { name: "Azi", exact: true })).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { __sawOverlay?: boolean }).__sawOverlay ?? false)).toBe(false);
  });
});
