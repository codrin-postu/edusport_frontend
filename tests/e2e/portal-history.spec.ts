import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("the current month shows the summary and the rows", async({ page }) => {
  await loginAs(page);
  await page.goto("/istoric");
  await expect(page.getByRole("heading", { name: "NOIEMBRIE" })).toBeVisible();
  await expect(page.getByText(/2 ședințe de grup, 1 lecție individuală, 2,8 ore/)).toBeVisible();
  await expect(page.getByText("înlocuitor, 10 prezenți")).toBeVisible();
  await expect(page.getByText("grup, 8 prezenți")).toBeVisible();
  await expect(page.getByText("individuală, 50 min")).toBeVisible();
});

test("the previous month arrow changes the URL and reloads", async({ page }) => {
  await loginAs(page);
  await page.goto("/istoric");
  await page.getByRole("button", { name: "Luna anterioară" }).click();
  await expect(page).toHaveURL(/\/istoric\?luna=2026-10$/);
  await expect(page.getByRole("heading", { name: "OCTOMBRIE" })).toBeVisible();
  await expect(page.getByText("înlocuitor, 10 prezenți")).toBeVisible();
  await page.getByRole("button", { name: "Luna următoare" }).click();
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
