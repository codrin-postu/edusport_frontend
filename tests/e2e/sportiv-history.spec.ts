import { expect, test } from "@playwright/test";
import { mockLog, mockReset, mockState } from "./portal-helpers";
import { SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async({ page }) => {
  await mockReset();
  await loginSportiv(page);
});

test("Istoric lists the season's presences and pages by 20", async({ page }) => {
  await page.goto(`/${ANA}/istoric`);
  await expect(page.getByRole("heading", { name: "Istoric prezență", level: 1 })).toBeVisible();
  await expect(page.getByText("Ana Ionescu, sezonul 2026-2027").locator("visible=true")).toBeVisible();
  await expect(page.getByText("26", { exact: true })).toBeVisible();
  await expect(page.getByText("prezențe", { exact: true })).toBeVisible();
  await expect(page.getByText("22 grup")).toBeVisible();
  await expect(page.getByText("4 individuale")).toBeVisible();
  await expect(page.getByText("Joi 5 noi, 17:30").first()).toBeVisible();
  await expect(page.getByText("Intermediari Bronze, cu Alina Gheorghe").first()).toBeVisible();
  await expect(page.getByText("Grup", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Lecție, cu Andrei Pop").first()).toBeVisible();
  await expect(page.getByText("Individual", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("1 - 20 din 26")).toBeVisible();
  await expect(page.getByRole("button", { name: "Înapoi" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Înainte" })).toBeEnabled();
  expect(await page.locator("body").innerText()).not.toContain("%");

  await page.getByRole("button", { name: "Înainte" }).click();
  await expect(page.getByText("21 - 26 din 26")).toBeVisible();
  expect((await mockLog()).some((c) => c.path.includes(`/${ANA}/history?page=2`))).toBe(true);
  await expect(page.getByRole("button", { name: "Înainte" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Înapoi" })).toBeEnabled();
  await page.getByRole("button", { name: "Înapoi" }).click();
  await expect(page.getByText("1 - 20 din 26")).toBeVisible();
});

test("Istoric without presences says so and has no pager", async({ page }) => {
  await mockState({ emptyHistory: true });
  await page.goto(`/${ANA}/istoric`);
  await expect(page.getByText("Nicio prezență în acest sezon.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Înainte" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Înapoi" })).toHaveCount(0);
});
