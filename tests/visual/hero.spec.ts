import { test, expect } from "@playwright/test";
import { WIDTHS } from "./routes";
import { blockThirdParty, freezeStyles } from "./stabilize";

// The hero baseline is captured once in SP0 and never updated.
//
// This does not use `stabilize`: that helper scrolls the whole (very long)
// landing page and waits for networkidle, which on a slow WebKit run can
// take long enough that the video's `videoOn` phase has already ended by
// the time the screenshot is taken.
//
// It also does not rely on the hero's own autoplay to start the video:
// confirmed by instrumenting `HTMLMediaElement.prototype.play`, every call
// the page makes on its own (the native `autoplay` attribute, and the
// component's `canplay`/`loadeddata` nudge) is rejected in this WebKit test
// run with `NotAllowedError`, even though the video is muted and
// `playsInline`, so `videoOn` never turns on by itself here. A `play()`
// call made from the test through `page.evaluate`, however, is not subject
// to that rejection and succeeds, firing the same native `playing` event
// the component listens for. So the test starts the video itself, waits
// for the resulting dark phase, then freezes and shoots immediately, with
// no scroll and no networkidle wait in between.
for (const width of WIDTHS) {
  test(`landing hero is unchanged at ${width}px`, async({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await blockThirdParty(page);
    await page.goto("/");
    await page.waitForFunction(() => {
      const v = document.querySelector("video");
      return !!v && v.readyState >= 2;
    });
    await page.evaluate(async() => {
      const v = document.querySelector("video");
      if (v && v.paused) await v.play().catch(() => {});
    });
    await page.waitForFunction(() => {
      const v = document.querySelector("video");
      return !!v && !v.paused && document.documentElement.classList.contains("lv2-hero-dark");
    });
    await freezeStyles(page);
    // The header sits over the hero but is not part of the freeze.
    await page.addStyleTag({ content: "[data-site-header], [data-contact-strip] { visibility: hidden !important; }" });
    await expect(page.locator("[data-hero-frozen]")).toHaveScreenshot(`hero-frozen-${width}.png`, { maxDiffPixels: 0 });
  });
}
