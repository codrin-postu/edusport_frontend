import { expect, test, type Locator, type Page } from "@playwright/test";
import { COACH_BASE } from "./portal-helpers";

// Portal motion (user 2026-11-11): transitions exist on ListRow hover and button press, and every duration is 0 with reduced motion.

// The e2e config runs with reduced motion; this file turns it on per test where it needs the motion.
test.use({ baseURL: COACH_BASE, viewport: { width: 1280, height: 900 }, reducedMotion: "no-preference" });

const prop = (l: Locator, name: string): Promise<string> => l.evaluate((el, n) => getComputedStyle(el).getPropertyValue(n), name);
const longest = (v: string): number => Math.max(...v.split(",").map((s) => parseFloat(s)));

async function open(page: Page): Promise<void> {
  await page.goto("/kit-preview");
  await expect(page.locator("[data-kit=Motion]")).toBeVisible();
}

test("list row and buttons have transitions", async({ page }) => {
  await open(page);
  const row = page.locator("[data-motion=row] a");
  expect(longest(await prop(row, "transition-duration"))).toBeGreaterThan(0);
  const chevron = row.locator("[data-row-chevron]");
  expect(longest(await prop(chevron, "transition-duration"))).toBeGreaterThan(0);
  await row.hover();
  await expect.poll(() => prop(row, "background-color")).toBe("rgb(225, 236, 251)");
  await expect.poll(() => prop(chevron, "translate")).toContain("2px");

  const primary = page.locator("[data-motion=buttons] .lcta-face").first();
  expect(longest(await prop(primary, "transition-duration"))).toBeGreaterThan(0);
  const secondary = page.locator("[data-motion=buttons] button").nth(1);
  expect(longest(await prop(secondary, "transition-duration"))).toBeGreaterThan(0);
  await primary.hover();
  await page.mouse.down();
  await expect.poll(() => prop(primary, "transform")).toBe("matrix(1, 0, 0, 1, 2, 2)");
  await page.mouse.up();
  await secondary.hover();
  await page.mouse.down();
  await expect.poll(() => prop(secondary, "transform")).toBe("matrix(1, 0, 0, 1, 2, 2)");
  await page.mouse.up();
});

test("reduced motion makes every duration 0", async({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  const row = page.locator("[data-motion=row] a");
  expect(longest(await prop(row, "transition-duration"))).toBe(0);
  expect(longest(await prop(page.locator("[data-motion=buttons] .lcta-face").first(), "transition-duration"))).toBe(0);
  expect(longest(await prop(page.locator("[data-motion=buttons] button").nth(1), "transition-duration"))).toBe(0);
  expect(longest(await prop(page.locator("[data-motion=segmented] button").first(), "transition-duration"))).toBe(0);
  await row.hover();
  await expect.poll(() => prop(row, "background-color")).toBe("rgb(225, 236, 251)");
});

test("presence demo toggles with a flash, a count change and a sheet", async({ page }) => {
  await open(page);
  const demo = page.locator("[data-motion=presence]");
  await expect(demo.getByText("1 prezenți")).toBeVisible();
  await demo.getByLabel("Ana Popescu").evaluate((el) => (el as HTMLInputElement).click());
  await expect(demo.getByText("2 prezenți")).toBeVisible();
  await expect(demo.locator("[data-flash]").first()).toHaveAttribute("data-flash", /^[ab]$/);
  expect(longest(await prop(demo.locator("[data-motion-count]"), "animation-duration"))).toBeGreaterThan(0);
  await page.locator("[data-motion=save] button").click();
  await expect(page.locator("[data-motion=save] [data-status-block]")).toHaveAttribute("data-pop", "");
  await expect(page.getByRole("status")).toHaveText("Prezența a fost salvată.");
  await page.getByRole("button", { name: "Arată foaia" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Gata" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
