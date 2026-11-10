import { expect, test, type Locator, type Page } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset, shot } from "./portal-helpers";

test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];
const ICE_LIGHT = "rgb(225, 236, 251)";
const RED = "rgb(190, 51, 48)";

/** A date row that opens the date sheet: a button whose name starts with its block ("MAR 10"). */
const dateRow = (page: Page, word: string, day: string): Locator => page.getByRole("button", { name: new RegExp(`^${word}\\s*${day}\\s`, "i") });

for (const size of SIZES) {
  test.describe(`Program tab ${size.width}`, () => {
    test.use({ baseURL: COACH_BASE, viewport: size, timezoneId: "Europe/Bucharest" });
    const wide = size.width >= 900;

    test("weekly rules, add, public switch and the next dates", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati?tab=program");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("heading", { name: "Program săptămânal" })).toBeVisible();
      await expect(page.getByText("Marți, 18:15", { exact: true }).first()).toBeVisible();
      await expect(page.getByText("Miercuri, 18:15", { exact: true }).first()).toBeVisible();
      await expect(page.getByText("60 min, săptămânal, din 1 octombrie")).toHaveCount(2);

      for (const name of ["Schimbă programul de marți", "Șterge programul de marți", "Schimbă programul de miercuri", "Șterge programul de miercuri"]) {
        const button = page.getByRole("button", { name });
        await expect(button).toBeVisible();
        expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        await expect(button).toHaveCSS("border-top-left-radius", "0px");
      }
      await expect(page.getByRole("button", { name: "Schimbă programul de marți" })).toHaveText("Schimbă");
      await expect(page.getByRole("button", { name: "Șterge programul de marți" })).toHaveText("Șterge");

      const add = page.getByRole("link", { name: "+ Adaugă program" }).locator("visible=true");
      await expect(add).toHaveCount(1);
      // It sits under "Modifică grupa" in the side column, on both tabs.
      const edit = (await page.getByRole("link", { name: "Modifică grupa" }).boundingBox())!;
      expect((await add.boundingBox())!.y).toBeGreaterThan(edit.y);
      for (const link of await add.all()) await expect(link).toHaveAttribute("href", "/grupe/gavansati?tab=program&nou=1");

      await expect(page.getByText("Programul este public, îl vede oricine pe site.")).toBeVisible();
      await expect(page.getByRole("checkbox", { name: "Arată programul pe site" })).toBeChecked();

      await expect(page.getByRole("heading", { name: "Următoarele date" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Listă" })).toHaveAttribute("aria-pressed", "true");
      await expect(dateRow(page, "Mar", "10")).toContainText("Marți, 18:15");
      await expect(dateRow(page, "Mar", "10")).toContainText("60 min");
      const dates = page.getByRole("heading", { name: "Următoarele date" }).locator("xpath=../..");
      const cancelled = dates.locator("[data-date-block]").filter({ hasText: /^Mie\s*11$/i }).locator("xpath=../..");
      await expect(cancelled).toContainText("Miercuri, 18:15");
      await expect(cancelled.locator("[data-end-block]")).toHaveText("Anulată");
      await expect(cancelled.locator("[data-end-block]")).toHaveCSS("background-color", ICE_LIGHT);
      const moved = dates.locator("[data-date-block]").filter({ hasText: /^Joi\s*19$/i }).locator("xpath=../..");
      await expect(moved).toContainText("Joi, 18:15");
      await expect(moved).toContainText("mutată din marți, 17 noiembrie");
      await expect(moved.locator("[data-end-block]")).toHaveText("Mutată");
      // Only the next 4 dates, then the footer with "Vezi toate" (the calendar).
      await expect(dates.locator("[data-date-block]")).toHaveCount(4);
      const footer = dates.locator("[data-dates-footer]");
      await expect(footer).toContainText("Se arată următoarele 4 date");
      await expect(footer.getByRole("link", { name: "Vezi toate ›" })).toHaveAttribute("href", "/calendar");
      // No row before today, and no other red text than the date words.
      await expect(page.locator("[data-date-block]").filter({ hasText: /^Mie\s*4$/i })).toHaveCount(0);
      const reds = await page.locator("main *").evaluateAll((els, red) => els
        .filter((el) => el.children.length === 0 && (el.textContent ?? "").trim() !== "" && getComputedStyle(el).color === red && !el.hasAttribute("data-date-word"))
        .map((el) => el.textContent), RED);
      expect(reds).toEqual([]);
      await expect(page.locator("[data-date-word]").first()).toHaveCSS("color", RED);

      if (wide) {
        const rule = (await page.getByRole("heading", { name: "Program săptămânal" }).boundingBox())!;
        const next = (await page.getByRole("heading", { name: "Următoarele date" }).boundingBox())!;
        // One page for both tabs (user 2026-11-10): the program stacks in the main column, the next dates below the weekly rules.
        expect(next.y).toBeGreaterThan(rule.y);
        const infoCard = (await page.getByText(/^Antrenori/).first().boundingBox())!;
        expect(infoCard.x).toBeGreaterThan(rule.x);
      }
      await shot(page, info, "grupa-program");
    });

    test("the public checkbox saves", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati?tab=program");
      const box = page.getByRole("checkbox", { name: "Arată programul pe site" });
      await box.evaluate((el) => (el as HTMLInputElement).click());
      await expect(page.getByText("Salvat.")).toBeVisible();
      const put = (await mockLog()).find((c) => c.method === "PUT" && c.path.endsWith("/groups/gavansati/program-public"));
      expect(put?.body).toEqual({ value: false });
      await expect(box).not.toBeChecked();
    });

    test("Lună shows the month grid and the dates under it", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati?tab=program");
      await page.getByRole("button", { name: "Lună" }).click();
      await expect(page.getByTestId("program-month")).toBeVisible();
      await expect(page.getByText("noiembrie 2026")).toBeVisible();
      await expect(page.getByTestId("program-month").getByText("18:15").first()).toBeVisible();
      await expect(dateRow(page, "Mar", "10")).toBeVisible();
    });

    test("a Școala group shows the rules read only", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gprimii?tab=program");
      await expect(page.getByText("Programul Școlii îl schimbă administratorul.")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Program săptămânal" })).toBeVisible();
      await expect(page.getByText("Sâmbătă, 10:00", { exact: true }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: /^(Schimbă|Șterge) programul/ })).toHaveCount(0);
      await expect(page.getByRole("link", { name: "+ Adaugă program" })).toHaveCount(0);
      await expect(page.getByRole("checkbox")).toHaveCount(0);
    });
  });
}
