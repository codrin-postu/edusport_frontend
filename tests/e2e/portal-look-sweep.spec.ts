import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset } from "./portal-helpers";

// One sweep over every coach screen: one h1, no red text but the date word, only the named elements round,
// no dashed or dotted borders, the canvas page background.

test.beforeEach(async() => { await mockReset(); });
test.use({ baseURL: COACH_BASE, timezoneId: "Europe/Bucharest" });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];
const SCREENS = ["/", "/calendar", "/grupe", "/grupe/gavansati", "/grupe/gavansati/modifica", "/sportiv/amaria", "/concursuri", "/istoric", "/profil", "/profil/setari", "/prezenta?id=s-today", "/lectie/noua", "/grupe/gavansati/adauga", "/grupe/gavansati/sportiv-nou"];

async function sweep(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("[data-spinner]")).toHaveCount(0);
  const result = await page.evaluate(() => {
    const exceptions: [string, string][] = [["[data-bottom-nav]", "18px"], ["[data-bottom-nav] [aria-current=page]", "13px"], ["[data-date-block]", "6px"]];
    const wrongRadius: string[] = [];
    const red: string[] = [];
    const lines: string[] = [];
    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      const cs = getComputedStyle(el);
      if (el.closest("[data-spinner]")) continue;
      const exception = exceptions.find(([selector]) => el.matches(selector));
      const expected = exception ? exception[1] : "0px";
      const name = `${el.tagName}.${String(el.getAttribute("class") ?? "").slice(0, 60)}`;
      if (cs.borderRadius !== expected) wrongRadius.push(`${name}: ${cs.borderRadius}`);
      const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim() !== "");
      if (hasText && cs.color === "rgb(190, 51, 48)" && !el.closest("[data-date-word]")) red.push(`${el.tagName}:${el.textContent}`);
      for (const side of ["Top", "Right", "Bottom", "Left"] as const) {
        const style = cs[`border${side}Style` as "borderTopStyle"];
        if (style === "dashed" || style === "dotted") lines.push(`${name}: ${style}`);
      }
    }
    return { wrongRadius, red, lines, background: getComputedStyle(document.body).backgroundColor };
  });
  expect(result.wrongRadius, `${path} radius`).toEqual([]);
  expect(result.red, `${path} red text`).toEqual([]);
  expect(result.lines, `${path} dashed or dotted`).toEqual([]);
  expect(result.background, `${path} background`).toBe("rgb(246, 249, 253)");
}

for (const size of SIZES) {
  test.describe(`Look sweep ${size.width}`, () => {
    test.use({ viewport: size });

    test("every signed-in screen", async({ page }) => {
      await loginAs(page);
      for (const path of SCREENS) await sweep(page, path);
    });

    test("the sign-in screen", async({ page }) => {
      await sweep(page, "/login");
    });
  });
}
