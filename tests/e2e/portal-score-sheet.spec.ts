import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset, mockState } from "./portal-helpers";

test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];
const sheetCalls = async() => (await mockLog()).filter((c) => c.path.endsWith("/protocol")).map((c) => c.path);

for (const size of SIZES) {
  test.describe(`Score sheet ${size.width}`, () => {
    test.use({ baseURL: COACH_BASE, viewport: size, timezoneId: "Europe/Bucharest" });

    test("a result with a sheet opens on press, fetched once; a hand-entered one is not expandable", async({ page }) => {
      await loginAs(page);
      await page.goto("/sportiv/amaria");
      const rows = page.locator("[data-result-row]");
      await expect(rows).toHaveCount(2);
      expect(await sheetCalls()).toEqual([]);
      const header = rows.first().locator("button[aria-expanded]");
      await expect(header).toHaveAttribute("aria-expanded", "false");
      await header.click();
      await expect(header).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("heading", { name: "Free Skating" })).toBeVisible();
      await expect(page.getByRole("columnheader", { name: "J7" }).first()).toBeAttached();
      await expect(page.getByRole("columnheader", { name: "BV" })).toBeAttached();
      await expect(page.getByRole("cell", { name: "3Lz+2T" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "6,50" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "< x" })).toBeVisible();
      await expect(page.getByRole("cell", { name: "7,75" }).first()).toBeAttached();
      await expect(page.getByText("142,30").first()).toBeVisible();
      expect(await sheetCalls()).toEqual(["/api/portal/coach/athletes/amaria/competitions/101/protocol"]);
      await header.click();
      await expect(header).toHaveAttribute("aria-expanded", "false");
      await header.click();
      expect((await sheetCalls()).length).toBe(1);
      // The third result (Cupa Patinoarului Nord) is hand-entered: a plain row, no button.
      await expect(page.getByText("Cupa Patinoarului Nord")).toBeVisible();
      await expect(page.locator("button[aria-expanded]").filter({ hasText: "Cupa Patinoarului Nord" })).toHaveCount(0);
    });

    test("the judge columns scroll sideways inside the sheet, the page does not", async({ page }) => {
      await loginAs(page);
      await page.goto("/sportiv/amaria");
      await page.locator("[data-result-row]").first().locator("button[aria-expanded]").click();
      const box = page.locator("table").first().locator("xpath=..");
      await expect(box).toHaveCSS("overflow-x", "auto");
      const page_ = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
      expect(page_).toBe(true);
      if (size.width === 390) expect(await box.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
    });

    test("a source that is down answers the short unavailable line inside the row", async({ page }) => {
      await loginAs(page);
      await page.goto("/sportiv/amaria");
      await mockState({ competitionsDown: true });
      await page.reload();
      await expect(page.getByText("Rezultatele nu sunt disponibile acum.")).toBeVisible();
    });
  });
}
