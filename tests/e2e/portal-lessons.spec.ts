import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset, shot } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("the lesson page reads from the board and saves the presence", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/lplan");
  await expect(page.locator("h1")).toHaveText("Ana Stoica");
  await expect(page.locator("[data-page-header]").getByText("Lecție individuală")).toBeVisible();
  await expect(page.getByRole("link", { name: "‹ Azi" })).toBeVisible();
  const kv = (key: string) => page.getByText(key, { exact: true }).locator("xpath=..");
  await expect(kv("Data")).toContainText("Joi, 5 noiembrie");
  await expect(kv("Ora")).toContainText("17:00, 60 min");
  await expect(kv("Antrenor")).toContainText("Andrei Popa");
  await expect(kv("Se repetă")).toContainText("Nu");
  await page.getByLabel("Prezent, Ana Stoica").evaluate((el) => (el as HTMLInputElement).click());
  await page.getByRole("button", { name: "Salvează prezența" }).click();
  await expect(page.getByText("Salvat.")).toBeVisible();
  const put = (await mockLog()).find((c) => c.method === "PUT" && c.path.endsWith("/coach/lessons/lplan"));
  expect(put?.body).toEqual({ present: true, durationMin: 60, coachIds: ["tm-andrei"] });
});

test("saving a lesson without a change says Nicio modificare.", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/ldone");
  await page.getByRole("button", { name: "Salvează prezența" }).click();
  await expect(page.getByText("Nicio modificare.")).toBeVisible();
});

const lastBody = async(method: string, path: string): Promise<unknown> => (await mockLog()).filter((c) => c.method === method && c.path.endsWith(path)).at(-1)?.body;

test("Modifică lecția on a plain lesson saves with scope one and no question", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/lplan");
  await page.getByRole("link", { name: "Modifică lecția" }).click();
  await expect(page).toHaveURL(/\/lectie\/lplan\/modifica$/);
  await expect(page.locator("h1")).toHaveText("Modifică lecția");
  await expect(page.getByRole("link", { name: "‹ Ana Stoica" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Individual" })).toHaveCount(0);
  await expect(page.getByText("Ana Stoica", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Ora")).toHaveValue("17:00");
  await expect(page.getByLabel("Durată")).toContainText("60 min");
  await expect(page.getByLabel("Se repetă")).toContainText("Nu se repetă");
  await page.getByLabel("Ora").fill("17:30");
  await page.getByRole("button", { name: "Salvează", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/\/lectie\/lplan$/);
  expect(await lastBody("PUT", "/lessons/lplan/plan")).toMatchObject({ scope: "one", startTime: "17:30", date: "2026-11-05" });
  await expect(page.getByText("17:30, 60 min")).toBeVisible();
});

test("a lesson of a series asks which lessons before it saves", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/lser2");
  await expect(page.getByText("Săptămânal, marți, până la sfârșitul sezonului")).toBeVisible();
  await page.getByRole("link", { name: "Modifică lecția" }).click();
  await page.getByLabel("Ora").fill("18:00");
  await page.getByRole("button", { name: "Salvează", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Ce schimbi?" })).toBeVisible();
  await expect(dialog.getByRole("radio", { name: "Doar această lecție" })).toHaveAttribute("aria-checked", "true");
  // Renunță drops the question and sends nothing.
  await dialog.getByRole("button", { name: "Renunță" }).click();
  await expect(dialog).toHaveCount(0);
  expect(await lastBody("PUT", "/lessons/lser2/plan")).toBeUndefined();
  await page.getByRole("button", { name: "Salvează", exact: true }).click();
  await dialog.getByRole("radio", { name: "Și lecțiile următoare" }).click();
  await dialog.getByRole("button", { name: "Salvează", exact: true }).click();
  await expect(page).toHaveURL(/\/lectie\/lnew\d+$/);
  expect(await lastBody("PUT", "/lessons/lser2/plan")).toMatchObject({ scope: "following", startTime: "18:00", repeat: { freq: "weekly", days: ["tue"], until: null } });
});

test("Doar această lecție on a series lesson sends no repeat", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/lser2/modifica");
  await page.getByLabel("Ora").fill("18:00");
  await page.getByRole("button", { name: "Salvează", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Salvează", exact: true }).click();
  await expect(page).toHaveURL(/\/lectie\/lser2$/);
  expect(await lastBody("PUT", "/lessons/lser2/plan")).toMatchObject({ scope: "one", startTime: "18:00", repeat: null });
});

test("a refusal of the edit shows in the scope sheet", async({ page }) => {
  await loginAs(page);
  // 17:00 on the 10th is the first lesson of the series: moving the 17th onto the 10th clashes.
  await page.goto("/lectie/lser2/modifica");
  await page.getByLabel("Se repetă").click();
  await page.getByRole("menuitemradio", { name: "Nu se repetă", exact: true }).click();
  await page.getByRole("group", { name: "Data" }).getByRole("spinbutton").first().click();
  await page.keyboard.type("10112026");
  await page.getByRole("button", { name: "Salvează", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Salvează", exact: true }).click();
  await expect(page.getByRole("dialog").getByText("Sportivul are deja o lecție pe marți, 10 noi, la 17:00.")).toBeVisible();
});

test("the archived lesson has no Modifică lecția", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/larchived");
  await expect(page.getByRole("link", { name: "Modifică lecția" })).toHaveCount(0);
  await page.goto("/lectie/larchived/modifica");
  await expect(page).toHaveURL(/\/lectie\/larchived$/);
});

test("a planned lesson is deleted after a confirmation, no scope", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/lplan");
  await page.getByRole("button", { name: "Șterge lecția" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Ștergi lecția din 5 noi?" })).toBeVisible();
  await dialog.getByRole("button", { name: "Renunță" }).click();
  await expect(dialog).toHaveCount(0);
  expect((await mockLog()).filter((c) => c.method === "DELETE")).toHaveLength(0);
  await page.getByRole("button", { name: "Șterge lecția" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Șterge lecția" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  await expect(page.getByText("Lecție ștearsă.")).toBeVisible();
  expect((await mockLog()).filter((c) => c.method === "DELETE").map((c) => c.path.replace(/^.*\/coach/, ""))).toEqual(["/lessons/lplan"]);
});

test("Șterge lecția on a series lesson asks which lessons", async({ page }) => {
  await loginAs(page);
  await page.goto("/lectie/lser2");
  await page.getByRole("button", { name: "Șterge lecția" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Ce ștergi?" })).toBeVisible();
  await dialog.getByRole("radio", { name: "Și lecțiile următoare" }).click();
  await dialog.getByRole("button", { name: "Șterge lecția" }).click();
  await expect(page.getByText("Lecții șterse.")).toBeVisible();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  expect((await mockLog()).filter((c) => c.method === "DELETE").map((c) => c.path.replace(/^.*\/coach/, ""))).toEqual(["/lessons/lser2?scope=following"]);
  await page.goto("/lectie/lser3");
  await expect(page.getByText("Nu am putut încărca datele.")).toBeVisible();
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

    test("lesson page: Prezent row with a 44px checkbox, full width save", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/lectie/lplan");
      await expect(page.getByText("Prezent", { exact: true })).toBeVisible();
      await expect(page.getByLabel("Prezent, Ana Stoica").locator("xpath=..")).toHaveCSS("width", "44px");
      const save = (await page.getByRole("button", { name: "Salvează prezența" }).boundingBox())!;
      const form = (await page.locator("[data-lesson-form]").boundingBox())!;
      expect(save.width).toBeGreaterThan(form.width * 0.8);
      expect(form.width).toBeLessThanOrEqual(520);
      await expect(page.locator("h1")).toHaveCount(1);
      await shot(page, info, "lectie-detaliu");
    });

    test("edit page and the scope sheet", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/lectie/lser2/modifica");
      await expect(page.locator("h1")).toHaveCount(1);
      await shot(page, info, "lectie-modifica");
      await page.getByLabel("Ora").fill("18:00");
      await page.getByRole("button", { name: "Salvează", exact: true }).click();
      const box = (await page.getByRole("dialog").boundingBox())!;
      if (size.width >= 900) expect(Math.round(box.width)).toBe(460);
      else expect(Math.round(box.y + box.height)).toBe(size.height);
    });
  });
}
