import { expect, test } from "@playwright/test";
import { COACH_BASE, isolate, loginAs, mockLog, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("the profile page lists the rows and logs out", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil");
  await expect(page.getByRole("heading", { name: "Andrei Popa" })).toBeVisible();
  await expect(page.getByText("Antrenor", { exact: true }).locator("visible=true")).toBeVisible();
  await expect(page.getByRole("link", { name: "Setări cont" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Securitate" }).first()).toBeVisible();
  await page.getByRole("button", { name: "Ieși din cont" }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("settings: e-mail is read only and the phone is saved", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil/setari");
  await expect(page.getByText("antrenor1@example.invalid")).toBeVisible();
  await expect(page.getByText("Numele și e-mailul le schimbă administratorul.")).toBeVisible();
  await expect(page.getByLabel("E-mail")).toHaveCount(0);
  await expect(page.getByLabel("Nume", { exact: true })).toHaveCount(0);
  await page.getByLabel("Telefon").fill("0700000000");
  await page.getByRole("button", { name: "Salvează" }).first().click();
  await expect(page.getByText("Salvat.")).toBeVisible();
  const put = (await mockLog()).find((c) => c.method === "PUT" && c.path.endsWith("/coach/me"));
  expect(put?.body).toEqual({ phone: "0700000000" });
});

test("an empty phone is sent as null", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil/setari");
  await page.getByLabel("Telefon").fill("");
  await page.getByRole("button", { name: "Salvează" }).first().click();
  await expect(page.getByText("Salvat.")).toBeVisible();
  const put = (await mockLog()).find((c) => c.method === "PUT" && c.path.endsWith("/coach/me"));
  expect(put?.body).toEqual({ phone: null });
});

test("a wrong current password shows the message and the coach stays in", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil/setari");
  await page.getByLabel("Parola actuală").fill("gresita-gresita");
  await page.getByLabel("Parola nouă").fill("Alta-parola-123");
  await page.getByRole("button", { name: "Salvează" }).last().click();
  await expect(page.getByText("Parola actuală nu este corectă.")).toBeVisible();
  await page.goto("/profil");
  await expect(page).toHaveURL(/\/profil$/);
});

test("a password over 128 characters shows the rule text", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil/setari");
  await page.getByLabel("Parola actuală").fill("Throwaway-Coach-1");
  await page.getByLabel("Parola nouă").fill("a".repeat(129));
  await page.getByRole("button", { name: "Salvează" }).last().click();
  await expect(page.getByText("Parola poate avea cel mult 128 de caractere.")).toBeVisible();
});

test("a good password change shows the toast and clears the fields", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil/setari");
  await page.getByLabel("Parola actuală").fill("Throwaway-Coach-1");
  await page.getByLabel("Parola nouă").fill("Alta-parola-123");
  await page.getByRole("button", { name: "Salvează" }).last().click();
  await expect(page.getByText("Salvat.")).toBeVisible();
  await expect(page.getByLabel("Parola actuală")).toHaveValue("");
  await expect(page.getByLabel("Parola nouă")).toHaveValue("");
  const post = (await mockLog()).find((c) => c.method === "POST" && c.path.endsWith("/coach/me/password"));
  expect(post?.body).toEqual({ current: "Throwaway-Coach-1", password: "Alta-parola-123" });
});

test("a Google only coach sees Setează o parolă and no current password", async({ page, request }) => {
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
  await expect(page.getByRole("link", { name: "Setează o parolă" })).toHaveAttribute("href", "/forgot-password");
  await expect(page.getByLabel("Parola actuală")).toHaveCount(0);
});

test("security lists the devices by name, one marked acesta, and revokes another", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil/securitate");
  await expect(page.getByText("Chrome pe Windows")).toBeVisible();
  await expect(page.getByText("Safari pe iPhone")).toBeVisible();
  await expect(page.getByText("acesta", { exact: true })).toHaveCount(1);
  await expect(page.getByText(/dev\d|sess-/)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Deconectează" })).toHaveCount(3);
  await page.getByRole("group", { name: "Safari pe iPhone" }).getByRole("button", { name: "Deconectează" }).click();
  await expect(page.getByText("Safari pe iPhone")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Deconectează" })).toHaveCount(2);
  await expect(page).toHaveURL(/\/profil\/securitate$/);
});

test("signing out the current device lands on the login screen", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil/securitate");
  await page.getByRole("group").filter({ hasText: "acesta" }).getByRole("button", { name: "Deconectează" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];

for (const size of SIZES) {
  test.describe(`Profil ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("profile list", async({ page }) => {
      await loginAs(page);
      await page.goto("/profil");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Andrei Popa");
      await expect(page.getByText("Antrenor", { exact: true }).locator("visible=true")).toBeVisible();
      await expect(page.locator("main").getByRole("link", { name: /Setări cont/ })).toContainText("nume, e-mail, telefon, parolă");
      await expect(page.locator("main").getByRole("link", { name: /Securitate/ })).toContainText("dispozitive conectate");
      await expect(page.getByRole("button", { name: "Ieși din cont" })).toBeVisible();
    });

    test("settings", async({ page }) => {
      await loginAs(page);
      await page.goto("/profil/setari");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Setări cont");
      await expect(page.getByRole("link", { name: "‹ Profil" })).toHaveAttribute("href", "/profil");
      const cont = page.getByRole("heading", { name: "Cont", exact: true });
      await expect(cont).toBeVisible();
      await expect(page.getByText("Nume", { exact: true })).toBeVisible();
      await expect(page.getByText("Andrei Popa")).toBeVisible();
      await expect(page.getByText("E-mail", { exact: true })).toBeVisible();
      await expect(page.getByText("antrenor1@example.invalid")).toBeVisible();
      await expect(page.getByText("Numele și e-mailul le schimbă administratorul. După schimbarea e-mailului, intri cu adresa nouă.")).toBeVisible();
      await expect(page.getByLabel("Telefon")).toBeVisible();
      await expect(page.getByLabel("Parola actuală")).toBeVisible();
      await expect(page.getByLabel("Parola nouă")).toBeVisible();
      await expect(page.getByRole("button", { name: "Salvează" })).toHaveCount(2);
    });

    test("security rows", async({ page }) => {
      await loginAs(page);
      await page.goto("/profil/securitate");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Securitate");
      await expect(page.getByRole("link", { name: "‹ Profil" })).toHaveAttribute("href", "/profil");
      await expect(page.getByRole("group", { name: "Chrome pe Windows" }).getByRole("button", { name: "Deconectează" })).toBeVisible();
      await expect(page.getByRole("group", { name: "Safari pe iPhone" }).getByRole("button", { name: "Deconectează" })).toBeVisible();
    });
  });
}
