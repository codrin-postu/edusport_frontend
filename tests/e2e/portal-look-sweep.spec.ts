import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset, mockState } from "./portal-helpers";

// One sweep over every coach screen: one h1, no red text but the date word, only the named elements round,
// no dashed or dotted borders, the canvas page background.

test.beforeEach(async() => { await mockReset(); });
test.use({ baseURL: COACH_BASE, timezoneId: "Europe/Bucharest" });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];
const INVITE = "inv-valid-0000000000000000000000";
const SCREENS = ["/", "/calendar", "/grupe", "/grupe/gavansati", "/grupe/gavansati/modifica", "/sportiv/amaria", "/concursuri", "/istoric", "/profil", "/profil/setari", "/profil/securitate", "/lectie/ldone", "/grupe/gavansati?tab=program", "/prezenta?id=s-today", "/antrenament/nou", "/antrenament/nou?grupa=gavansati", "/antrenament/nou?tip=individual", "/lectie/lser2", "/lectie/lser2/modifica", "/grupe/gavansati/adauga", "/grupe/gavansati/sportiv-nou"];

async function sweep(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page.locator("h1")).toHaveCount(1);
  await check(page, path);
}

/** The look rules on whatever the page shows now (open sheets and error states included). */
async function check(page: Page, path: string): Promise<void> {
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
    return { wrongRadius, red, lines, scrolls: document.documentElement.scrollWidth > window.innerWidth, background: getComputedStyle(document.body).backgroundColor };
  });
  expect(result.wrongRadius, `${path} radius`).toEqual([]);
  expect(result.red, `${path} red text`).toEqual([]);
  expect(result.lines, `${path} dashed or dotted`).toEqual([]);
  expect(result.scrolls, `${path} horizontal scroll`).toBe(false);
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

const DATA_SCREENS = ["/", "/calendar", "/grupe", "/grupe/gavansati", "/grupe/gavansati/modifica", "/sportiv/amaria", "/concursuri", "/istoric", "/profil/setari", "/profil/securitate", "/lectie/ldone", "/antrenament/nou", "/antrenament/nou?grupa=gavansati", "/lectie/lser2", "/lectie/lser2/modifica", "/grupe/gavansati/adauga", "/grupe/gavansati/sportiv-nou", "/grupe/gavansati?tab=program", "/prezenta?id=s-today"];
const LOAD_FAILED = "Nu am putut încărca datele.";
const NAVY = "rgb(14, 26, 60)";

for (const size of SIZES) {
  test.describe(`Look sweep, sheets and error states ${size.width}`, () => {
    test.use({ viewport: size });

    test("the sign-in side screens", async({ page }) => {
      await sweep(page, "/forgot-password");
      await sweep(page, `/invite/${INVITE}`);
    });

    test("every open sheet", async({ page }) => {
      await loginAs(page);
      const dialog = page.getByRole("dialog");
      const open = async(path: string, name: string, step: () => Promise<void>) => {
        await page.goto(path);
        await expect(page.locator("[data-spinner]")).toHaveCount(0);
        await step();
        await expect(dialog).toBeVisible();
        await check(page, name);
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
      };
      await open("/grupe/gavansati/modifica", "Mută sheet", () => page.getByRole("button", { name: /^Mută / }).first().click());
      await open("/grupe/gavansati/modifica", "Scoate sheet", () => page.getByRole("button", { name: /^Scoate / }).first().click());
      await open("/grupe/gavansati?tab=program", "Schimbă program sheet", () => page.getByRole("button", { name: "Schimbă programul de marți" }).click());
      await open("/grupe/gavansati?tab=program", "Șterge program sheet", () => page.getByRole("button", { name: "Șterge programul de marți" }).click());
      await open("/grupe/gavansati?tab=program", "Dată sheet", () => page.getByRole("button", { name: /^Mar\s*10\s/i }).click());
      await open("/grupe/gavansati?tab=program", "Dată anulată sheet", () => page.getByRole("button", { name: /^Mie\s*11\s/i }).click());
      await open("/grupe/gavansati?tab=program", "Dată mutată sheet", () => page.getByRole("button", { name: /^Joi\s*19\s/i }).click());
      await open("/prezenta?id=s-today", "Day sheet", () => page.locator("[data-page-header] button").first().click());
      await open("/lectie/lser2/modifica", "Ce schimbi sheet", async() => { await page.getByLabel("Ora").fill("18:00"); await page.getByRole("button", { name: "Salvează", exact: true }).click(); });
      await open("/lectie/lser2", "Ce ștergi sheet", () => page.getByRole("button", { name: "Șterge lecția" }).click());
      await open("/lectie/lplan", "Șterge lecția sheet", () => page.getByRole("button", { name: "Șterge lecția" }).click());
      await open("/antrenament/nou?tip=individual", "Coach picker sheet", () => page.getByRole("button", { name: "+ Adaugă alți antrenori" }).click());
    });

    test("invalid input and error lines", async({ page }) => {
      // The sign-in refusal.
      await page.goto("/login");
      await page.getByLabel("E-mail").fill("antrenor1@example.invalid");
      await page.getByLabel("Parolă", { exact: true }).fill("wrong-password-1");
      await page.getByRole("button", { name: "Intră" }).click();
      await expect(page.getByRole("main").getByRole("alert")).toBeVisible();
      await check(page, "login refusal");
      // A refused password change: error line and an invalid field.
      await loginAs(page);
      await page.goto("/profil/setari");
      await page.getByLabel("Parola actuală").fill("Throwaway-Coach-1");
      await page.getByLabel("Parola nouă").fill("a".repeat(129));
      await page.getByRole("button", { name: "Salvează" }).last().click();
      await expect(page.getByText("Parola poate avea cel mult 128 de caractere.")).toBeVisible();
      await check(page, "password rule");
      // An invalid field: navy border (not red) and the alert line in navy with its icon.
      await page.goto("/kit-preview");
      const field = page.locator("[aria-invalid=true]");
      await expect(field).toHaveCount(1);
      await expect(field).toHaveCSS("border-top-color", NAVY);
      const line = page.getByText("Numărul nu este valid.");
      await expect(line).toHaveCSS("color", NAVY);
      await expect(line.locator("svg")).toBeVisible();
    });

    test("the load failure on every screen has the retry", async({ page }) => {
      await loginAs(page);
      for (const path of DATA_SCREENS) {
        await mockState({ coachDown: true });
        await page.goto(path);
        const retry = page.getByRole("button", { name: "Încearcă din nou" });
        await expect(retry, `${path} retry`).toBeVisible();
        await expect(page.getByText(LOAD_FAILED).first()).toBeVisible();
        await check(page, `${path} error`);
        await mockState({ coachDown: false });
        await retry.click();
        await expect(page.getByText(LOAD_FAILED), `${path} after retry`).toHaveCount(0);
        await expect(page.getByRole("button", { name: "Încearcă din nou" })).toHaveCount(0);
      }
    });
  });
}
