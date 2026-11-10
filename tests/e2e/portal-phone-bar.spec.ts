import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 }, timezoneId: "Europe/Bucharest" });
test.beforeEach(async() => { await mockReset(); });

const bar = (page: import("@playwright/test").Page) => page.locator("[data-phone-bar]");

test("phone: the compact bar shows with the back link and title once the big title scrolled away", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati");
  await expect(page.getByRole("heading", { level: 1, name: "Avansați" })).toBeVisible();
  await expect(bar(page)).toHaveCSS("opacity", "0");
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(bar(page)).toHaveCSS("opacity", "1");
  const box = (await bar(page).boundingBox())!;
  expect(Math.round(box.y)).toBe(0);
  await expect(bar(page).getByRole("link", { name: "‹ Grupe" })).toHaveAttribute("href", "/grupe");
  const title = bar(page).locator("[data-phone-bar-title]");
  await expect(title).toHaveText("Avansați");
  await expect(title).toHaveCSS("font-size", "16px");
  await expect(title).toHaveCSS("font-weight", "700");
  await expect(bar(page)).toHaveCSS("background-color", "rgb(225, 236, 251)");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bar(page)).toHaveCSS("opacity", "0");
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.screenshot({ path: process.env.PORTAL_SHOTS ? `${process.env.PORTAL_SHOTS}/built-phone-bar-390.png` : test.info().outputPath("bar-390.png") });
});

test("phone: Azi shows the brand in the bar instead of a back link", async({ page }) => {
  await page.setViewportSize({ width: 390, height: 520 });
  await loginAs(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Antrenamente azi" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(bar(page)).toHaveCSS("opacity", "1");
  await expect(bar(page).getByRole("link", { name: "Clubul Sportiv EduSport" })).toBeVisible();
  await expect(bar(page).getByText("‹")).toHaveCount(0);
  await expect(bar(page).locator("[data-phone-bar-title]")).toHaveText("Azi");
});

test("phone: the tabs stay under the bar while scrolled and sit at the same y on both tabs", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati");
  const tabs = page.locator("[data-group-tabs]");
  const y1 = (await tabs.boundingBox())!.y;
  await page.getByRole("button", { name: "Program" }).click();
  await expect(page).toHaveURL(/tab=program/);
  await expect(page.getByRole("heading", { name: "Program săptămânal" })).toBeVisible();
  const y2 = (await tabs.boundingBox())!.y;
  expect(Math.abs(y1 - y2)).toBeLessThan(1);
  // Same block above the tabs on both tabs.
  await expect(page.getByText(/^Antrenori/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Modifică grupa" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(bar(page)).toHaveCSS("opacity", "1");
  const stuck = (await tabs.boundingBox())!;
  expect(Math.round(stuck.y)).toBe(44);
  await page.screenshot({ path: process.env.PORTAL_SHOTS ? `${process.env.PORTAL_SHOTS}/built-grupa-tabs-sticky-390.png` : test.info().outputPath("tabs-390.png") });
});

test("desktop: no compact bar, same two column group page on both tabs", async({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await loginAs(page);
  await page.goto("/grupe/gavansati");
  await expect(bar(page)).toBeHidden();
  const a = (await page.locator("[data-group-tabs]").boundingBox())!;
  await page.getByRole("button", { name: /^Program$/ }).click();
  await expect(page.getByRole("heading", { name: "Program săptămânal" })).toBeVisible();
  const b = (await page.locator("[data-group-tabs]").boundingBox())!;
  expect(Math.abs(a.y - b.y)).toBeLessThan(1);
  expect(Math.abs(a.x - b.x)).toBeLessThan(1);
});
