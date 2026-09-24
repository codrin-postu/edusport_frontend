import { test, expect } from "@playwright/test";
import { WIDTHS } from "./routes";
import { blockThirdParty, stabilize } from "./stabilize";

// The hero baseline is captured once in SP0 and never updated.
for (const width of WIDTHS) {
  test(`landing hero is unchanged at ${width}px`, async({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await blockThirdParty(page);
    await page.goto("/");
    await stabilize(page);
    // The header sits over the hero but is not part of the freeze.
    await page.addStyleTag({ content: "[data-site-header] { visibility: hidden !important; }" });
    await expect(page.locator("[data-hero-frozen]")).toHaveScreenshot(`hero-frozen-${width}.png`, { maxDiffPixels: 0 });
  });
}
