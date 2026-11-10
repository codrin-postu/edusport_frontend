import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 1280, height: 900 }, timezoneId: "Europe/Bucharest" });
test.beforeEach(async() => { await mockReset(); });

const PAGES = ["/", "/grupe", "/grupe/gavansati", "/istoric", "/calendar", "/profil"];

test("desktop: the now tile sits at the right edge of the container on every coach page", async({ page }) => {
  await loginAs(page);
  const rights: number[] = [];
  for (const path of PAGES) {
    await page.goto(path);
    const tile = page.getByRole("group", { name: /, ora \d\d:\d\d$/ });
    await expect(tile).toBeVisible();
    const box = (await tile.boundingBox())!;
    const inner = await page.locator("[data-page-header] > div").evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.right - parseFloat(getComputedStyle(el).paddingRight);
    });
    expect(Math.abs(box.x + box.width - inner)).toBeLessThan(0.5);
    rights.push(Math.round((box.x + box.width) * 10) / 10);
  }
  expect(new Set(rights).size).toBe(1);
  const w = await page.locator("[data-page-header] > div").evaluate((el) => el.getBoundingClientRect().width);
  expect(w).toBeLessThanOrEqual(1040);
  await page.screenshot({ path: process.env.PORTAL_SHOTS ? `${process.env.PORTAL_SHOTS}/built-now-tile-1280.png` : test.info().outputPath("tile-1280.png") });
});

test("desktop: the tile time updates across a minute on a page other than Azi", async({ page }) => {
  await loginAs(page);
  await page.clock.install({ time: new Date("2026-11-05T12:58:30Z") });
  await page.goto("/grupe");
  await expect(page.getByRole("group", { name: "Joi, 5 noiembrie, ora 14:58" })).toBeVisible();
  await page.clock.runFor(91_000);
  await expect(page.getByRole("group", { name: "Joi, 5 noiembrie, ora 15:00" })).toBeVisible();
});

test("phone: Azi keeps its tile, other pages have none", async({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginAs(page);
  await page.goto("/");
  await expect(page.getByRole("group", { name: /^.*, ora \d\d:\d\d$/ })).toBeVisible();
  await page.goto("/grupe");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("group", { name: /ora \d\d:\d\d/ })).toHaveCount(0);
});
