import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("the lesson page saves the presence", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/lplan");
  await expect(page.getByText("17:00, 1 h")).toBeVisible();
  await page.getByLabel("Prezent, Ana Stoica").evaluate((el) => (el as HTMLInputElement).click());
  await page.getByRole("button", { name: "Salvează prezența" }).click();
  await expect(page.getByText("Salvat.")).toBeVisible();
  const put = (await mockLog()).find((c) => c.method === "PUT" && c.path.endsWith("/coach/lessons/lplan"));
  expect(put?.body).toMatchObject({ present: true, durationMin: 60 });
});

test("saving a lesson without a change says Nicio modificare.", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/ldone");
  await page.getByRole("button", { name: "Salvează prezența" }).click();
  await expect(page.getByText("Nicio modificare.")).toBeVisible();
});

test("a planned lesson can be deleted after a confirmation", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/lplan");
  await page.getByRole("button", { name: "Șterge lecția" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Ștergi lecția din 5 noi?")).toBeVisible();
  await dialog.getByRole("button", { name: "Renunță" }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByRole("button", { name: "Șterge lecția" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Șterge lecția" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  await expect(page.getByText("Lecție ștearsă.")).toBeVisible();
});

test("an archived lesson is read only", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/larchived");
  await expect(page.getByText("Arhivată. Nu mai poate fi modificată.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Salvează prezența" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Șterge lecția" })).toHaveCount(0);
});

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];

for (const size of SIZES) {
  test.describe(`Lecție look ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("lesson page: Prezent row with a 44px checkbox, full width save", async({ page }) => {
      await loginAs(page);
      await page.goto("/lectie/lplan");
      await expect(page.getByText("Prezent", { exact: true })).toBeVisible();
      await expect(page.getByLabel("Prezent, Ana Stoica").locator("xpath=..")).toHaveCSS("width", "44px");
      const save = (await page.getByRole("button", { name: "Salvează prezența" }).boundingBox())!;
      const form = (await page.locator("[data-lesson-form]").boundingBox())!;
      expect(save.width).toBeGreaterThan(form.width * 0.8);
    });
  });
}
