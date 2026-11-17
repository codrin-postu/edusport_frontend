import { expect, test } from "@playwright/test";
import { mockReset, mockState } from "./portal-helpers";
import { SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async({ page }) => {
  await mockReset();
  await loginSportiv(page);
});

test("Parcurs shows the level now, the next one, the earlier ones and the pins", async({ page }) => {
  await page.goto(`/${ANA}/parcurs`);
  await expect(page.getByRole("heading", { name: "Parcurs", level: 1 })).toBeVisible();
  await expect(page.getByText("Ana Ionescu, Școala de patinaj").locator("visible=true")).toBeVisible();
  await expect(page.getByText("Nivelul tău acum")).toBeVisible();
  await expect(page.getByText("Intermediari Bronze", { exact: true })).toBeVisible();
  await expect(page.getByText("din septembrie 2026, AFI Cotroceni")).toBeVisible();
  await expect(page.getByText("Marți și joi, 17:30, cu Alina Gheorghe")).toBeVisible();
  await expect(page.getByText("Următorul nivel")).toBeVisible();
  await expect(page.getByText("Intermediari Silver", { exact: true })).toBeVisible();
  await expect(page.getByText("Decide antrenorul.")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Până acum" })).toBeVisible();
  await expect(page.getByText("Începători", { exact: true })).toBeVisible();
  await expect(page.getByText("sep 2025 - iun 2026")).toBeVisible();
  await expect(page.getByText("Primii Pași")).toBeVisible();

  for (const title of ["Antrenamente", "Concursuri", "Membru", "Insigne", "Sărituri", "Prietenie"]) {
    await expect(page.getByRole("heading", { name: title, level: 2 })).toBeVisible();
  }
  await expect(page.getByRole("button", { name: "Podium, 4" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Locul 1, 2" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Prima lecție", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Steaua antrenorului, blocat" })).toBeVisible();
});

test("a pin zooms with its date, by click and by Enter, and Închide returns the focus", async({ page }) => {
  await page.goto(`/${ANA}/parcurs`);
  const pin = page.getByRole("button", { name: "Podium, 4" });
  const dialog = page.getByRole("dialog");

  await pin.click();
  await expect(dialog.getByRole("heading", { name: "Podium" })).toBeVisible();
  await expect(dialog.getByText("4", { exact: true })).toBeVisible();
  await expect(dialog.getByText("7 noi 2026")).toBeVisible();
  await dialog.getByRole("button", { name: "Închide" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(pin).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(pin).toBeFocused();
});

test("a friendship pin zooms with its message and who gave it", async({ page }) => {
  await page.goto(`/${ANA}/parcurs`);
  await page.getByRole("button", { name: "Bate palma!, Matei V." }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Bate palma!" })).toBeVisible();
  await expect(dialog.getByText("Matei V., 7 noi 2026")).toBeVisible();
});

test("without a level now the card is absent", async({ page }) => {
  await mockState({ noPathNow: true });
  await page.goto(`/${ANA}/parcurs`);
  await expect(page.getByRole("heading", { name: "Insigne", level: 2 })).toBeVisible();
  await expect(page.getByText("Nivelul tău acum")).toHaveCount(0);
  await expect(page.getByText("Următorul nivel")).toBeVisible();
});
