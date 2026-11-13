import { expect, test, type Locator, type Page } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset, mockState } from "./portal-helpers";

test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];

/** A date row that opens the date sheet: a button whose name starts with its block ("MAR 10"). */
const dateRow = (page: Page, word: string, day: string): Locator => page.getByRole("button", { name: new RegExp(`^${word}\\s*${day}\\s`, "i") });

for (const size of SIZES) {
  test.describe(`Program tab ${size.width}`, () => {
    test.use({ baseURL: COACH_BASE, viewport: size, timezoneId: "Europe/Bucharest" });

    test("weekly rules, add, public switch and the next dates", async({ page }) => {
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
      }
      await expect(page.getByRole("button", { name: "Schimbă programul de marți" })).toHaveText("Schimbă");
      await expect(page.getByRole("button", { name: "Șterge programul de marți" })).toHaveText("Șterge");

      const add = page.getByRole("link", { name: "+ Adaugă program" }).locator("visible=true");
      await expect(add).toHaveCount(1);
      for (const link of await add.all()) await expect(link).toHaveAttribute("href", "/grupe/gavansati?tab=program&nou=1");

      await expect(page.getByText("Programul este public, îl vede oricine pe site.")).toBeVisible();
      await expect(page.getByRole("checkbox", { name: "Arată programul pe site" })).toBeChecked();

      await expect(page.getByRole("heading", { name: "Următoarele date" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Listă" })).toHaveAttribute("aria-pressed", "true");
      await expect(dateRow(page, "Mar", "10")).toContainText("Marți, 18:15");
      await expect(dateRow(page, "Mar", "10")).toContainText("60 min");
      const dates = page.getByRole("heading", { name: "Următoarele date" }).locator("xpath=../..");
      const cancelled = dates.locator("[data-date-block]").filter({ hasText: /^Mie\s*11(\s*\d\d:\d\d)?$/i }).locator("xpath=../..");
      await expect(cancelled).toContainText("Miercuri, 18:15");
      await expect(cancelled.locator("[data-end-block]")).toHaveText("Anulată");
      const moved = dates.locator("[data-date-block]").filter({ hasText: /^Joi\s*19(\s*\d\d:\d\d)?$/i }).locator("xpath=../..");
      await expect(moved).toContainText("Joi, 18:15");
      await expect(moved).toContainText("mutată din marți, 17 noiembrie");
      await expect(moved.locator("[data-end-block]")).toHaveText("Mutată");
      // Only the next 4 dates, then the footer with "Vezi toate" (the calendar).
      await expect(dates.locator("[data-date-block]")).toHaveCount(4);
      const footer = dates.locator("[data-dates-footer]");
      await expect(footer).toContainText("Se arată următoarele 4 date");
      await expect(footer.getByRole("link", { name: "Vezi toate ›" })).toHaveAttribute("href", "/calendar");
      // No row before today.
      await expect(page.locator("[data-date-block]").filter({ hasText: /^Mie\s*4(\s*\d\d:\d\d)?$/i })).toHaveCount(0);
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

    test("another coach's Club group does not show the Școala locked note", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/guscat?tab=program");
      await expect(page.getByRole("heading", { name: "Program săptămânal" })).toBeVisible();
      await expect(page.getByText("Programul Școlii îl schimbă administratorul.")).toHaveCount(0);
    });

    test("an own Școala group the backend marks editable shows the edit controls", async({ page }) => {
      await mockState({ schoolEditable: true });
      await loginAs(page);
      await page.goto("/grupe/gprimii?tab=program");
      await expect(page.getByRole("heading", { name: "Program săptămânal" })).toBeVisible();
      await expect(page.getByText("Programul Școlii îl schimbă administratorul.")).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Schimbă programul de sâmbătă" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Șterge programul de duminică" })).toBeVisible();
      await expect(page.getByRole("checkbox")).toHaveCount(1);
    });
  });
}
