import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 1280, height: 900 } });
test.beforeEach(async() => { await mockReset(); });

test("hovering the account button opens the menu; Setări cont goes to the settings", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil");
  const account = page.locator("[data-sidebar-account]");
  await expect(account).toHaveAttribute("aria-haspopup", "menu");
  await expect(page.getByRole("menuitem", { name: "Setări cont" })).toBeHidden();
  await account.hover();
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Ieși din cont" })).toBeVisible();
  await page.getByRole("menuitem", { name: "Setări cont" }).click();
  await expect(page).toHaveURL(/\/profil\/setari$/);
});

test("Escape closes the menu opened from the keyboard", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil");
  await page.locator("[data-sidebar-account]").focus();
  await expect(page.getByRole("menuitem", { name: "Setări cont" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menuitem", { name: "Setări cont" })).toBeHidden();
});

test("Ieși din cont signs out and lands on the login screen", async({ page }) => {
  await loginAs(page);
  await page.goto("/profil");
  await page.locator("[data-sidebar-account]").hover();
  await page.getByRole("menuitem", { name: "Ieși din cont" }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect((await mockLog()).some((c) => c.method === "POST" && c.path.endsWith("/auth/logout"))).toBe(true);
});
