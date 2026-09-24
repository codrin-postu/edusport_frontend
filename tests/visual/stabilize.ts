import type { Page } from "@playwright/test";

const BLOCK = /analytics\.codrin\.space|glitchtip\.codrin\.space|youtube\.com|ytimg\.com/;

export async function blockThirdParty(page: Page): Promise<void> {
  await page.route(BLOCK, (route) => route.abort());
}

/**
 * Blocks the hero background video request so the landing page never enters
 * the "video on" color state during a screenshot. For the page suite only:
 * `hero.spec.ts` covers the video-on state separately by force-playing.
 */
export async function blockHeroVideo(page: Page): Promise<void> {
  await page.route("**/hero-0803.mp4", (route) => route.abort());
}

/** The style freeze `stabilize` injects, shared with `freezeStyles` below. */
const FREEZE_CSS = `
  #cc-main, [data-visual="announcement"] { display: none !important; }
  *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
  video { visibility: hidden !important; }
`;

/** Makes a page deterministic before a screenshot. */
export async function stabilize(page: Page): Promise<void> {
  await page.addStyleTag({ content: FREEZE_CSS });
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

/**
 * Applies only the style freeze (no scroll, no networkidle wait), then waits
 * for fonts. For screenshots that need to be taken the instant a transient
 * page state is reached, before anything else can move it along: the freeze
 * hides the video, so callers must reach their state first and call this
 * right before the screenshot, not before.
 */
export async function freezeStyles(page: Page): Promise<void> {
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.evaluate(async() => {
    await document.fonts.ready;
  });
}
