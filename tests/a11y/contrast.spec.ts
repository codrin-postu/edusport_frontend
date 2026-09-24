import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { ROUTES } from "../visual/routes";
import { blockThirdParty, stabilize } from "../visual/stabilize";

const FILE = "tests/a11y/contrast-baseline.json";
const baseline: Record<string, number> = JSON.parse(readFileSync(FILE, "utf8"));
const record = process.env.RECORD_CONTRAST === "1";

for (const route of ROUTES) {
  test(`contrast on ${route}`, async({ page }) => {
    await blockThirdParty(page);
    await page.goto(route);
    await stabilize(page);
    const result = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
    const count = result.violations.reduce((n, v) => n + v.nodes.length, 0);
    if (record) {
      baseline[route] = count;
      writeFileSync(FILE, JSON.stringify(baseline, null, 2) + "\n");
      return;
    }
    expect(count, `contrast failures on ${route}`).toBeLessThanOrEqual(baseline[route] ?? 0);
  });
}
