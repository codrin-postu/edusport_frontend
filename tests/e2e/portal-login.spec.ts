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
  await page.goto("/intrare");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill("wrong-password-1");
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("E-mailul sau parola nu sunt corecte.");
  await expect(page.getByLabel("Parolă", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("E-mail")).toHaveValue(COACH_EMAIL);
  await noStrayText(page);
});

test("the eye button shows the password", async({ page }) => {
  await page.goto("/intrare");
  const field = page.getByLabel("Parolă", { exact: true });
  await field.fill("abc");
  await expect(field).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Arată parola" }).click();
  await expect(field).toHaveAttribute("type", "text");
  await expect(page.getByRole("button", { name: "Ascunde parola" })).toBeVisible();
});

test("inputs carry the right autocomplete", async({ page }) => {
  await page.goto("/intrare");
  await expect(page.getByLabel("E-mail")).toHaveAttribute("autocomplete", "email");
  await expect(page.getByLabel("Parolă", { exact: true })).toHaveAttribute("autocomplete", "current-password");
});

test("a good login lands on Azi", async({ page }) => {
  await page.goto("/intrare");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill(COACH_PASSWORD);
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  await expect(page.getByRole("link", { name: "Profil" }).first()).toHaveText("AP");
});

test("a signed in coach is moved off the login screen", async({ page }) => {
  await page.goto("/intrare");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill(COACH_PASSWORD);
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  await page.goto("/intrare");
  await expect(page).toHaveURL(/localhost:3200\/$/);
});

test("reset: an unknown e-mail gets the same text, the code logs in", async({ page }) => {
  await page.goto("/intrare");
  await page.getByRole("link", { name: "Am uitat parola" }).click();
  await expect(page).toHaveURL(/\/am-uitat-parola$/);
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
  await page.goto("/am-uitat-parola");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByRole("button", { name: "Trimite codul" }).click();
  await page.getByLabel("Cod din e-mail").fill("123456");
  await page.getByLabel("Parolă nouă").fill("Alta-Parola-12345");
  await page.getByRole("button", { name: "Salvează parola" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
});

test("an old invite shows the expired text and no secret stays in the URL", async({ page }) => {
  await page.goto(`/invitatie/${INVITE_OLD}`);
  await expect(page).toHaveURL(/\/invitatie$/);
  await expect(page.getByText("Invitația a expirat. Cere administratorului una nouă.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la intrare" })).toBeVisible();
});

test("no invite cookie shows the expired text", async({ page }) => {
  await page.goto("/invitatie");
  await expect(page.getByText("Invitația a expirat. Cere administratorului una nouă.")).toBeVisible();
});

test("a valid invite saves a password and lands on Azi", async({ page }) => {
  await page.goto(`/invitatie/${INVITE_VALID}`);
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
  await page.goto("/intrare");
  await expect(page.getByRole("button", { name: "Intră" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveCount(0);
  await page.goto(`/invitatie/${INVITE_VALID}`);
  await expect(page.getByText("Contul tău: antrenor2@example.invalid")).toBeVisible();
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveCount(0);
});

test("with Google configured the login shows the link before the form", async({ page }) => {
  await page.goto("/intrare");
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveAttribute("href", "/api/portal/google/start");
});
