import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 }, timezoneId: "Europe/Bucharest" });
test.beforeEach(async() => { await mockReset(); });

const bar = (page: import("@playwright/test").Page) => page.locator("[data-phone-bar]");

test("phone: the compact bar shows with the back link and title once the big title scrolled away", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati");
  await expect(page.getByRole("heading", { level: 1, name: "Avansați" })).toBeVisible();
  await expect(bar(page)).toHaveAttribute("aria-hidden", "true");
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(bar(page)).toHaveAttribute("aria-hidden", "false");
  await expect(bar(page).getByRole("link", { name: "‹ Grupe" })).toHaveAttribute("href", "/grupe");
  const title = bar(page).locator("[data-phone-bar-title]");
  await expect(title).toHaveText("Avansați");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bar(page)).toHaveAttribute("aria-hidden", "true");
});

test("phone: Azi shows the brand in the bar instead of a back link", async({ page }) => {
  await page.setViewportSize({ width: 390, height: 520 });
  await loginAs(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Antrenamente azi" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(bar(page)).toHaveAttribute("aria-hidden", "false");
  await expect(bar(page).getByRole("link", { name: "Clubul Sportiv EduSport" })).toBeVisible();
  await expect(bar(page).getByText("‹")).toHaveCount(0);
  await expect(bar(page).locator("[data-phone-bar-title]")).toHaveText("Azi");
});

test("phone: the tabs switch and the bar shows while scrolled", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati");
  await page.getByRole("button", { name: "Program" }).click();
  await expect(page).toHaveURL(/tab=program/);
  await expect(page.getByRole("heading", { name: "Program săptămânal" })).toBeVisible();
  // Same block above the tabs on both tabs.
  await expect(page.getByText(/^Antrenori/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Modifică grupa" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(bar(page)).toHaveAttribute("aria-hidden", "false");
});

test("desktop: no compact bar, the Program tab opens", async({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await loginAs(page);
  await page.goto("/grupe/gavansati");
  await expect(bar(page)).toBeHidden();
  await page.getByRole("button", { name: /^Program$/ }).click();
  await expect(page.getByRole("heading", { name: "Program săptămânal" })).toBeVisible();
});
