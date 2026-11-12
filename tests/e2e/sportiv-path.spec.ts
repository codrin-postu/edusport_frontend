import { expect, test } from "@playwright/test";
import { mockReset, mockState } from "./portal-helpers";
import { SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async({ page }) => {
  await mockReset();
  await loginSportiv(page);
});

test("Parcurs shows the level now, the next one, the earlier ones and the badges", async({ page }) => {
  await page.goto(`/${ANA}/parcurs`);
  await expect(page.getByRole("heading", { name: "Parcurs", level: 1 })).toBeVisible();
  await expect(page.getByText("Ana Ionescu, Școala de patinaj").locator("visible=true")).toBeVisible();
  await expect(page.getByText("Nivelul tău acum")).toBeVisible();
  await expect(page.getByText("Intermediari Bronze", { exact: true })).toBeVisible();
  await expect(page.getByText("din septembrie 2026, AFI Cotroceni")).toBeVisible();
  await expect(page.getByText("Marți și joi, 17:30, cu Alina Gheorghe")).toBeVisible();
  await expect(page.getByText("Următorul nivel")).toBeVisible();
  await expect(page.getByText("Intermediari Silver", { exact: true })).toBeVisible();
  await expect(page.getByText("Antrenorul decide când treci mai departe.")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Până acum" })).toBeVisible();
  await expect(page.getByText("Începători", { exact: true })).toBeVisible();
  await expect(page.getByText("sep 2025 - iun 2026")).toBeVisible();
  await expect(page.getByText("Primii Pași")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Realizări" })).toBeVisible();
  for (const label of ["50 antrenamente", "Sezon complet", "Prima lecție", "Concursuri"]) {
    await expect(page.getByRole("button", { name: new RegExp(label) })).toBeVisible();
  }
  await expect(page.getByRole("img", { name: "50 de antrenamente, nivel argint" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Sezon complet, nivel bronz" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Prima lecție, nivel bronz" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Concursuri, încă niciunul (blocat)" })).toBeVisible();
});

test("a badge zooms into its tiers, by click and by Enter, and Închide returns the focus", async({ page }) => {
  await page.goto(`/${ANA}/parcurs`);
  const badge = page.getByRole("button", { name: /50 antrenamente/ });
  const dialog = page.getByRole("dialog");

  await badge.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "50 antrenamente" })).toBeVisible();
  for (const threshold of ["25", "50", "100", "250"]) await expect(dialog.getByText(threshold, { exact: true })).toBeVisible();
  await expect(dialog.getByText("10 mar 2026")).toBeVisible();
  await expect(dialog.getByText("încă nu")).toHaveCount(2);
  await expect(dialog.getByText("63 din 100")).toBeVisible();
  await dialog.getByRole("button", { name: "Închide" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(badge).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(badge).toBeFocused();
});

test("the top tier has no progress line", async({ page }) => {
  await page.goto(`/${ANA}/parcurs`);
  await page.getByRole("button", { name: /Prima lecție/ }).click();
  await expect(page.getByRole("dialog").getByText(/ din /)).toHaveCount(0);
});

test("without a level now the card is absent", async({ page }) => {
  await mockState({ noPathNow: true });
  await page.goto(`/${ANA}/parcurs`);
  await expect(page.getByRole("heading", { name: "Realizări" })).toBeVisible();
  await expect(page.getByText("Nivelul tău acum")).toHaveCount(0);
  await expect(page.getByText("Următorul nivel")).toBeVisible();
});
