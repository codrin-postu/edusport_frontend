import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset, shot } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("a new lesson sends 75 minutes and lands on the lesson page", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/noua");
  await expect(page.getByRole("heading", { name: "Lecție individuală" })).toBeVisible();
  await expect(page.getByText("Andrei Popa (tu)")).toBeVisible();
  await expect(page.getByRole("button", { name: /^Șterge/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Salvează lecția" })).toBeDisabled();
  await page.getByLabel("Caută după nume").fill("Maria");
  await page.getByRole("button", { name: /Maria Ionescu/ }).click();
  await page.getByLabel("Ora").fill("16:00");
  await expect(page.getByRole("button", { name: "50 min" })).toBeVisible();
  await page.getByRole("button", { name: "50 min" }).click();
  await page.getByLabel("Ore").selectOption("1");
  await page.getByLabel("Minute").selectOption("15");
  await page.getByRole("button", { name: "OK" }).click();
  await expect(page.getByRole("button", { name: "1 h 15 min" })).toBeVisible();
  await page.getByRole("button", { name: "Salvează lecția" }).click();
  await expect(page).toHaveURL(/\/lectie\/lnew1$/);
  const post = (await mockLog()).find((c) => c.method === "POST" && c.path.endsWith("/coach/lessons"));
  const body = post?.body as { athleteId: string; startTime: string; durationMin: number; coachIds: string[]; date: string };
  expect(body).toMatchObject({ athleteId: "amaria", startTime: "16:00", durationMin: 75, date: "2026-11-05" });
  expect(body.coachIds).toContain("tm-andrei");
});

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

test("a double tap on Salvează lecția creates one lesson only", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/noua");
  await page.getByLabel("Caută după nume").fill("Maria");
  await page.getByRole("button", { name: /Maria Ionescu/ }).click();
  await page.getByLabel("Ora").fill("16:00");
  await page.getByRole("button", { name: "Salvează lecția" }).dblclick();
  await expect(page).toHaveURL(/\/lectie\/lnew1$/);
  const posts = (await mockLog()).filter((c) => c.method === "POST" && c.path.endsWith("/coach/lessons"));
  expect(posts).toHaveLength(1);
});

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];

for (const size of SIZES) {
  test.describe(`Lecție look ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("new lesson form", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/lectie/noua");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Lecție individuală");
      await expect(page.getByRole("link", { name: "‹ Azi" })).toHaveAttribute("href", "/");
      const y = async(text: string) => (await page.getByText(text, { exact: true }).locator("visible=true").first().boundingBox())!.y;
      const ys = [await y("Sportiv"), await y("Data"), await y("Durată"), await y("Antrenor")];
      expect([...ys].sort((a, b) => a - b)).toEqual(ys);
      expect(Math.abs((await y("Data")) - (await y("Ora")))).toBeLessThan(2);
      await expect(page.getByRole("button", { name: "Salvează lecția" })).toBeVisible();
      const form = page.locator("[data-lesson-form]");
      if (size.width >= 900) {
        await expect(form).toHaveCSS("padding-left", "24px");
        await expect(form).toHaveCSS("max-width", "520px");
      } else {
        await expect(form).toHaveCSS("padding-left", "0px");
      }
      await shot(page, info, "lectie");
    });

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
