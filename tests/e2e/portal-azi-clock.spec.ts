import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 1280, height: 900 }, timezoneId: "Europe/Bucharest" });
test.beforeEach(async() => { await mockReset(); });

// The mock's day is Thursday 5 November 2026; Bucharest is UTC+2 then.
test("the now tile ticks on the minute", async({ page }) => {
  await loginAs(page);
  await page.clock.install({ time: new Date("2026-11-05T12:58:30Z") });
  await page.goto("/");
  const tile = page.getByRole("group", { name: "Joi, 5 noiembrie, ora 14:58" });
  await expect(tile).toBeVisible();
  await page.clock.runFor(31_000);
  await expect(page.getByRole("group", { name: "Joi, 5 noiembrie, ora 14:59" }).getByText("14:59", { exact: true })).toBeVisible();
  await page.clock.runFor(60_000);
  await expect(page.getByRole("group", { name: "Joi, 5 noiembrie, ora 15:00" })).toBeVisible();
  await page.clock.runFor(60_000);
  await expect(page.getByRole("group", { name: "Joi, 5 noiembrie, ora 15:01" }).getByText("15:01", { exact: true })).toBeVisible();
});

test("at midnight the date rolls over and today is fetched again", async({ page }) => {
  await loginAs(page);
  await page.clock.install({ time: new Date("2026-11-05T21:59:30Z") });
  let fetches = 0;
  page.on("request", (r) => { if (r.url().includes("/api/portal/coach/today")) fetches += 1; });
  await page.goto("/");
  await expect(page.getByRole("group", { name: "Joi, 5 noiembrie, ora 23:59" })).toBeVisible();
  const before = fetches;
  await page.clock.runFor(31_000);
  const tile = page.getByRole("group", { name: "Vineri, 6 noiembrie, ora 00:00" });
  await expect(tile).toBeVisible();
  await expect(tile.getByText("Vin", { exact: true })).toBeVisible();
  await expect(tile.getByText("6", { exact: true })).toBeVisible();
  await expect.poll(() => fetches).toBeGreaterThan(before);
  await expect(page.getByRole("heading", { name: "Antrenamente azi" })).toBeVisible();
});

test("the clock pauses while the tab is hidden and resyncs when it shows", async({ page }) => {
  await loginAs(page);
  await page.clock.install({ time: new Date("2026-11-05T12:58:30Z") });
  await page.goto("/");
  await expect(page.getByRole("group", { name: "Joi, 5 noiembrie, ora 14:58" })).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(5 * 60_000);
  await expect(page.getByRole("group", { name: "Joi, 5 noiembrie, ora 14:58" })).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("group", { name: "Joi, 5 noiembrie, ora 15:03" })).toBeVisible();
});
