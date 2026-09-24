import { test, expect } from "@playwright/test";
import { ROUTES } from "./routes";
import { blockThirdParty } from "./stabilize";

test.skip(({ browserName }) => browserName !== "chromium", "CDP is Chromium only");

// Every text node inside a .font-display element must be drawn with League Spartan.
for (const route of ROUTES) {
  test(`display text renders in League Spartan on ${route}`, async({ page }) => {
    await blockThirdParty(page);
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("DOM.enable");
    await cdp.send("CSS.enable");
    const { root } = await cdp.send("DOM.getDocument", { depth: -1, pierce: false });
    const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: ".font-display, .font-display *" });
    const offenders: string[] = [];
    for (const nodeId of nodeIds) {
      const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
      if (fonts.length && !fonts.some((f) => /Spartan/i.test(f.familyName) || /LeagueSpartan/i.test(f.postScriptName))) {
        const { outerHTML } = await cdp.send("DOM.getOuterHTML", { nodeId });
        offenders.push(`${fonts.map((f) => f.postScriptName).join(",")} :: ${outerHTML.slice(0, 80)}`);
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });
}
