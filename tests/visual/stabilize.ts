import type { Page } from "@playwright/test";

const BLOCK = /analytics\.codrin\.space|glitchtip\.codrin\.space|youtube\.com|ytimg\.com/;

export async function blockThirdParty(page: Page): Promise<void> {
  await page.route(BLOCK, (route) => route.abort());
}

/** Makes a page deterministic before a screenshot. */
export async function stabilize(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      #cc-main, [data-visual="announcement"] { display: none !important; }
      *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
      video { visibility: hidden !important; }
    `,
  });
  await page.evaluate(async() => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
  });
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(300);
}
