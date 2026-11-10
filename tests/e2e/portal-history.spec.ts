import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset, shot } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("the previous month arrow changes the URL and reloads", async({ page }) => {
  await loginAs(page);
  await page.goto("/istoric");
  await expect(page.getByText("Noiembrie 2026").locator("visible=true")).toBeVisible();
  await page.getByRole("button", { name: "Luna anterioară" }).locator("visible=true").click();
  await expect(page).toHaveURL(/\/istoric\?luna=2026-10$/);
  await expect(page.getByText("Octombrie 2026").locator("visible=true")).toBeVisible();
  await expect(page.getByText("înlocuitor, 10 prezenți")).toBeVisible();
  expect((await mockLog()).some((c) => c.path.includes("history?month=2026-10"))).toBe(true);
  await page.getByRole("button", { name: "Luna următoare" }).locator("visible=true").click();
  await expect(page).toHaveURL(/\/istoric\?luna=2026-11$/);
});

test("a row opens the presence page", async({ page }) => {
  await loginAs(page);
  await page.goto("/istoric");
  await page.getByRole("link", { name: /Intermediari Silver/ }).click();
  await expect(page).toHaveURL(/\/prezenta\?id=s-standin$/);
});

test("a lesson row opens the lesson page", async({ page }) => {
  await loginAs(page);
  await page.goto("/istoric");
  await page.getByRole("link", { name: /Matei Radu/ }).click();
  await expect(page).toHaveURL(/\/lectie\/ldone$/);
});

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];

for (const size of SIZES) {
  test.describe(`Istoric ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("stat card, status rows and month picker", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/istoric");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Istoric");
      await expect(page.getByText("Noiembrie 2026").locator("visible=true")).toBeVisible();
      await expect(page.locator("[data-stat-num]")).toHaveText("2");
      await expect(page.getByText("ședințe de grup în noiembrie")).toBeVisible();
      await expect(page.getByText("lecții individuale")).toBeVisible();
      await expect(page.getByText("2,8")).toBeVisible();
      const rows = page.locator("main a[href]");
      await expect(rows).toHaveCount(4);
      const words = ["Joi", "Mie", "Mar", "Lun"];
      const nums = ["5", "4", "3", "2"];
      for (let i = 0; i < 4; i++) {
        await expect(rows.nth(i).locator("[data-date-word]")).toHaveText(words[i]);
        await expect(rows.nth(i).locator("[data-date-num]")).toHaveText(nums[i]);
      }
      await expect(rows.nth(0)).toContainText("Avansați");
      await expect(rows.nth(0)).toContainText("grup, 8 prezenți");
      await expect(rows.nth(0).getByRole("img", { name: "Grup, completat" })).toBeVisible();
      await expect(rows.nth(1)).toContainText("Intermediari Silver");
      await expect(rows.nth(1)).toContainText("înlocuitor, 10 prezenți");
      await expect(rows.nth(2)).toContainText("Matei Radu");
      await expect(rows.nth(2).locator("[data-individual-tag]")).toHaveText("Individual");
      await expect(rows.nth(2)).toContainText("50 min");
      await expect(rows.nth(2).getByRole("img", { name: "Individual, completat" })).toBeVisible();
      await expect(rows.nth(3)).toContainText("grup, fără prezență");
      await expect(rows.nth(3).getByRole("img", { name: "Grup, necompletat" })).toBeVisible();
      await expect(rows.nth(3)).toHaveAttribute("href", /^\/prezenta\?occurrence=occ%3Agavansati%3A2026-11-02/);
      await shot(page, info, "istoric");
    });
  });
}
