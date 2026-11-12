import { expect, test } from "@playwright/test";
import { mockLog, mockReset, mockState } from "./portal-helpers";
import { PARENT_EMAIL, SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("Setări: the account, athletes, security and notifications, with no bottom nav and no 2FA", async({ page }) => {
  await loginSportiv(page);
  await page.goto("/setari");
  await expect(page.getByRole("heading", { name: "Setări" })).toBeVisible();
  await expect(page.getByRole("link", { name: "‹ Înapoi" }).first()).toBeVisible();
  await expect(page.getByText(`Cont: ${PARENT_EMAIL}`).locator("visible=true")).toBeVisible();
  await expect(page.locator("[data-bottom-nav]")).toHaveCount(0);
  await expect(page.getByText("E-mail", { exact: true })).toBeVisible();
  await expect(page.getByText("îl schimbă clubul")).toBeVisible();
  await expect(page.getByLabel("E-mail", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Ana Ionescu/ })).toBeVisible();
  await expect(page.getByText("Intermediari Bronze, 9 ani")).toBeVisible();
  await expect(page.getByText("Școala").first()).toBeVisible();
  await expect(page.getByText("schimbată acum 3 luni")).toBeVisible();
  await expect(page.getByRole("link", { name: /Parolă/ })).toHaveAttribute("href", "/setari/parola");
  await expect(page.getByText("2 dispozitive conectate")).toBeVisible();
  await expect(page.getByRole("link", { name: /Dispozitive/ })).toHaveAttribute("href", "/setari/dispozitive");
  await expect(page.getByText("mereu pornit")).toBeVisible();
  const body = await page.locator("body").innerText();
  for (const word of ["2FA", "passkey", "chei de acces"]) expect(body).not.toContain(word);
});

test("editing Nume and Telefon in the sheet sends PUT me and shows Salvat.", async({ page }) => {
  await loginSportiv(page);
  await page.goto("/setari");
  await page.getByRole("button", { name: /^Nume/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nume").fill("Maria Ionescu");
  await dialog.getByLabel("Telefon").fill("0700111222");
  await dialog.getByRole("button", { name: "Salvează" }).click();
  await expect(page.getByText("Salvat.")).toBeVisible();
  await expect(dialog).toHaveCount(0);
  const put = (await mockLog()).find((c) => c.method === "PUT" && c.path.endsWith("/sportiv/me"));
  expect(put?.body).toEqual({ name: "Maria Ionescu", phone: "0700111222" });
  await expect(page.getByText("Maria Ionescu")).toBeVisible();
});

test("Date sportiv shows the athlete's data read only", async({ page }) => {
  await loginSportiv(page);
  await page.goto("/setari");
  await page.getByRole("link", { name: /Ana Ionescu/ }).click();
  await expect(page).toHaveURL(`${SPORTIV_BASE}/setari/sportiv/${ANA}`);
  await expect(page.getByRole("heading", { name: "Date sportiv" })).toBeVisible();
  for (const label of ["Nume", "Data nașterii", "Vârsta", "Persoană de contact", "Telefon", "E-mail"]) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(page.getByText("Le schimbă clubul.")).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveCount(0);
});

test("a Google only account sees Parolă as nesetată, leading to /forgot-password", async({ page }) => {
  await mockState({ noPassword: true });
  await loginSportiv(page);
  await page.goto("/setari");
  await expect(page.getByText("nesetată")).toBeVisible();
  await expect(page.getByRole("link", { name: /Parolă/ })).toHaveAttribute("href", "/forgot-password");
});

test("the password page changes the password", async({ page }) => {
  await loginSportiv(page);
  await page.goto("/setari");
  await page.getByRole("link", { name: /Parolă/ }).click();
  await expect(page).toHaveURL(`${SPORTIV_BASE}/setari/parola`);
  await page.getByLabel("Parola actuală").fill("Throwaway-Sportiv-1");
  await page.getByLabel("Parola nouă").fill("Alta-parola-123");
  await page.getByRole("button", { name: "Salvează" }).click();
  await expect(page.getByText("Parola a fost schimbată.")).toBeVisible();
  const post = (await mockLog()).find((c) => c.method === "POST" && c.path.endsWith("/sportiv/me/password"));
  expect(post?.body).toEqual({ current: "Throwaway-Sportiv-1", password: "Alta-parola-123" });
});

test("devices: listed, and Deconectează sends DELETE me/devices/<id>", async({ page }) => {
  await loginSportiv(page);
  await page.goto("/setari");
  await page.getByRole("link", { name: /Dispozitive/ }).click();
  await expect(page).toHaveURL(`${SPORTIV_BASE}/setari/dispozitive`);
  await expect(page.getByRole("group", { name: "Chrome pe Mac" })).toBeVisible();
  await page.getByRole("group", { name: "Safari pe iPhone" }).getByRole("button", { name: "Deconectează" }).click();
  await expect.poll(async() => (await mockLog()).some((c) => c.method === "DELETE" && c.path.endsWith("/sportiv/me/devices/devsportiv2"))).toBe(true);
});

test("the schedule e-mail switch sends PUT me/notifications and reads oprit", async({ page }) => {
  await loginSportiv(page);
  await page.goto("/setari");
  await expect(page.getByText("pornit", { exact: true })).toBeVisible();
  await page.getByRole("checkbox", { name: "E-mail la schimbări de program" }).click({ force: true });
  await expect(page.getByText("oprit", { exact: true })).toBeVisible();
  const puts = (await mockLog()).filter((c) => c.method === "PUT" && c.path.endsWith("/sportiv/me/notifications"));
  expect(puts.at(-1)?.body).toEqual({ schedule: false });
  await expect(page.getByRole("checkbox", { name: "E-mail la dispozitiv nou" })).toHaveCount(0);
});

test("Ieșire posts auth/logout and lands on /login", async({ page }) => {
  await loginSportiv(page);
  await page.goto("/setari");
  await page.getByRole("button", { name: "Ieșire" }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect((await mockLog()).some((c) => c.method === "POST" && c.path.endsWith("/auth/logout"))).toBe(true);
});
