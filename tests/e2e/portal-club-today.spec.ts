import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 }, timezoneId: "Europe/Bucharest" });
test.beforeEach(async() => { await mockReset(); });

async function openClub(page: import("@playwright/test").Page) {
  await loginAs(page);
  await page.goto("/");
  await page.getByRole("link", { name: "Toate antrenamentele de azi din club" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/[?&]club=1/);
  return dialog;
}

test("the button opens the club's sessions of the day", async({ page }) => {
  const dialog = await openClub(page);
  await expect(dialog.getByText("Antrenamentele clubului azi")).toBeVisible();
  await expect(dialog).toContainText("Joi, 5 noiembrie. Atinge o grupă");
  const school = dialog.getByRole("link", { name: /Primii Pași/ });
  await expect(school).toContainText("Școala");
  await expect(school).toContainText("Ioana Dinu, Mihai Stan, AFI Cotroceni");
  await expect(dialog.getByRole("link", { name: /Avansați/ })).toContainText("Andrei Popa (tu), AFI Cotroceni");
  await expect(dialog.getByRole("link", { name: /Andrei Popa \(tu\), 50 min/ })).toHaveAttribute("href", "/lectie/ldone");
});

test("a group row opens the group page", async({ page }) => {
  const dialog = await openClub(page);
  await dialog.getByRole("link", { name: /Avansați/ }).click();
  await expect(page).toHaveURL(/\/grupe\/gavansati/);
});

test("another coach's lesson is not a link", async({ page }) => {
  const dialog = await openClub(page);
  const other = dialog.getByText("Ioana Dinu, 45 min");
  await expect(other).toBeVisible();
  await expect(dialog.getByRole("link").filter({ hasText: "Ioana Dinu, 45 min" })).toHaveCount(0);
});

test("Închide removes club=1", async({ page }) => {
  const dialog = await openClub(page);
  await dialog.getByRole("button", { name: "Închide" }).last().click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).not.toHaveURL(/club=1/);
});
