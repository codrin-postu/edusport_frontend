import { test, expect } from "@playwright/test";
import { ROUTES, WIDTHS, discoverSlugs, slugName } from "./routes";
import { blockThirdParty, stabilize } from "./stabilize";

let slugs: string[] = [];

test.beforeAll(async({ browser }, testInfo) => {
  const page = await browser.newPage();
  await blockThirdParty(page);
  slugs = await discoverSlugs(page, String(testInfo.project.use.baseURL));
  await page.close();
});

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const route of ROUTES) {
      test(`${route}`, async({ page }) => {
        await blockThirdParty(page);
        await page.goto(route);
        await stabilize(page);
        await expect(page).toHaveScreenshot(`${slugName(route)}-${width}.png`, { fullPage: true });
      });
    }

    test("detail pages", async({ page }) => {
      await blockThirdParty(page);
      for (const route of slugs) {
        await page.goto(route);
        await stabilize(page);
        await expect(page).toHaveScreenshot(`${slugName(route.split("/").slice(0, -1).join("/"))}__detail-${width}.png`, { fullPage: true });
      }
    });
  });
}
