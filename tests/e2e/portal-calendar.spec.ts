import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset, shot } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, timezoneId: "Europe/Bucharest" });
test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];
const NAVY = "rgb(14, 26, 60)";
const BLUE = "rgb(74, 123, 208)";
const CANCELLED = "rgb(192, 192, 196)";

const visible = (page: Page, role: "button" | "link", name: string) => page.getByRole(role, { name, exact: true }).locator("visible=true");
const day = (page: Page, d: number) => page.getByRole("button", { name: `${d} noiembrie`, exact: true });
const barColors = (page: Page, d: number) => day(page, d).locator("span > span").evaluateAll((els) => els.map((el) => getComputedStyle(el).backgroundColor));

for (const size of SIZES) {
  test.describe(`Calendar ${size.width}`, () => {
    test.use({ viewport: size });

    test("header, grid, marks, selection, month change, legend", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/calendar");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Calendar");
      await expect(page.getByRole("link", { name: "‹ Azi" })).toHaveAttribute("href", "/");
      await expect(page.getByText("Ședințele și lecțiile tale").locator("visible=true")).toBeVisible();
      await expect(page.getByText("Noiembrie 2026").locator("visible=true")).toHaveCount(1);
      const grid = page.getByRole("group", { name: "Zilele lunii" });
      await expect(grid.getByRole("button")).toHaveCount(30);
      for (const d of [3, 4, 10]) expect(await barColors(page, d)).toContain(NAVY);
      expect(await barColors(page, 11)).toEqual([CANCELLED]);
      expect(await barColors(page, 5)).toEqual([NAVY, BLUE, BLUE, NAVY]);
      expect((await barColors(page, 5)).filter((c) => c === BLUE)).toHaveLength(2);
      await expect(day(page, 5)).toHaveCSS("background-color", "rgb(225, 236, 251)");
      await expect(page.getByRole("heading", { name: "Joi, 5 noiembrie" })).toBeVisible();
      await expect(day(page, 5)).toHaveAttribute("aria-pressed", "false");
      await expect(day(page, 5)).toHaveAttribute("aria-current", "date");
      await expect(day(page, 4)).not.toHaveAttribute("aria-current", "date");
      await day(page, 4).click();
      await expect(day(page, 4)).toHaveAttribute("aria-pressed", "true");
      await expect(page).toHaveURL(/\/calendar\?luna=2026-11&zi=2026-11-04$/);
      await expect(page.getByRole("heading", { name: "Miercuri, 4 noiembrie" })).toBeVisible();
      const row = page.getByRole("link").filter({ hasText: "Avansați" });
      await expect(row).toHaveCount(1);
      await expect(row).toContainText("18:15");
      for (const t of ["grup", "individual", "anulată"]) await expect(page.getByText(t, { exact: true }).first()).toBeVisible();
      await shot(page, info, "calendar");
      await visible(page, "button", "Luna următoare").click();
      await expect(page.getByText("Decembrie 2026").locator("visible=true")).toHaveCount(1);
      const calls = (await mockLog()).map((c) => c.path);
      expect(calls.some((p) => p.endsWith("/calendar?month=2026-12"))).toBe(true);
      await expect(grid.getByRole("button")).toHaveCount(31);
    });

    test("a cancelled class has no link and the muted title", async({ page }) => {
      await loginAs(page);
      await page.goto("/calendar?luna=2026-11&zi=2026-11-11");
      await expect(page.getByRole("heading", { name: "Miercuri, 11 noiembrie" })).toBeVisible();
      const title = page.getByText("Avansați", { exact: true });
      await expect(title).toHaveCSS("color", "rgb(151, 155, 165)");
      await expect(page.getByText("anulată", { exact: true }).locator("visible=true").first()).toBeVisible();
      await expect(page.getByRole("link").filter({ hasText: "Avansați" })).toHaveCount(0);
      await expect(page.locator("[data-status-block]")).toHaveCount(0);
    });

    test("a quiet day shows the empty line and a reload keeps the day", async({ page }) => {
      await loginAs(page);
      await page.goto("/calendar?luna=2026-11&zi=2026-11-09");
      await expect(page.getByText("Nicio ședință în această zi.")).toBeVisible();
      await page.reload();
      await expect(page.getByRole("heading", { name: "Luni, 9 noiembrie" })).toBeVisible();
    });
  });
}

test.describe("Calendar program dates and lessons", () => {
  test.use({ viewport: SIZES[0] });
  const open = async(page: Page, date: string) => {
    await loginAs(page);
    await page.goto(`/calendar?luna=2026-11&zi=${date}`);
    await expect(page.locator("[data-spinner]")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^\S+, \d+ noiembrie$/ })).toBeVisible();
  };

  test("series lessons show on every date and open the lesson page", async({ page }) => {
    for (const [date, id] of [["2026-11-10", "lser1"], ["2026-11-17", "lser2"], ["2026-11-24", "lser3"]]) {
      await open(page, date);
      const row = page.getByRole("link").filter({ hasText: "Ana Stoica" });
      await expect(row).toHaveCount(1);
      await expect(row).toContainText("17:00");
      await expect(row).toContainText("Individual");
      await expect(row).toHaveAttribute("href", `/lectie/${id}`);
    }
    await expect(page.locator("a[href='/lectie/noua']")).toHaveCount(0);
  });

  test("a moved date shows on its new day and not on the old one", async({ page }) => {
    await open(page, "2026-11-17");
    await expect(page.getByRole("link").filter({ hasText: "Avansați" })).toHaveCount(0);
    await page.goto("/calendar?luna=2026-11&zi=2026-11-19");
    const row = page.getByRole("link").filter({ hasText: "Avansați" });
    await expect(row).toHaveCount(1);
    await expect(row).toContainText("18:15");
  });

  test("a removed date is gone", async({ page }) => {
    await open(page, "2026-11-24");
    await expect(page.getByRole("link").filter({ hasText: "Avansați" })).toHaveCount(1);
    const status = await page.evaluate(async() => (await fetch("/api/portal/coach/program/evavansati/dates/2026-11-24", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "remove" }) })).status);
    expect(status).toBe(200);
    await page.goto("/calendar?luna=2026-11&zi=2026-11-24");
    await expect(page.getByRole("heading", { name: "Marți, 24 noiembrie" })).toBeVisible();
    await expect(page.getByRole("link").filter({ hasText: "Avansați" })).toHaveCount(0);
    await expect(page.getByRole("link").filter({ hasText: "Ana Stoica" })).toHaveCount(1);
  });
});

test.describe("Calendar layout", () => {
  test("desktop: month picker in the top band, day list right of the grid", async({ page }) => {
    await page.setViewportSize(SIZES[1]);
    await loginAs(page);
    await page.goto("/calendar");
    const header = await page.locator("[data-page-header]").boundingBox();
    const next = await visible(page, "button", "Luna următoare").boundingBox();
    expect(next!.y + next!.height).toBeLessThanOrEqual(header!.y + header!.height);
    const grid = await page.getByRole("group", { name: "Zilele lunii" }).boundingBox();
    const list = await page.getByRole("heading", { name: "Joi, 5 noiembrie" }).boundingBox();
    expect(list!.x).toBeGreaterThan(grid!.x + grid!.width - 1);
  });

  test("phone: the month picker sits above the grid, the list below the legend", async({ page }) => {
    await page.setViewportSize(SIZES[0]);
    await loginAs(page);
    await page.goto("/calendar");
    const next = await visible(page, "button", "Luna următoare").boundingBox();
    const grid = await page.getByRole("group", { name: "Zilele lunii" }).boundingBox();
    const list = await page.getByRole("heading", { name: "Joi, 5 noiembrie" }).boundingBox();
    expect(next!.y).toBeLessThan(grid!.y);
    expect(list!.y).toBeGreaterThan(grid!.y + grid!.height);
  });
});

test("a group row opens the presence page with a back link to Calendar", async({ page }) => {
  await loginAs(page);
  await page.goto("/calendar");
  const row = page.locator("main a[href^='/prezenta']").first();
  await expect(row).toHaveAttribute("href", /&from=calendar$/);
  await row.click();
  await expect(page.getByRole("link", { name: "‹ Calendar" })).toHaveAttribute("href", "/calendar");
});
