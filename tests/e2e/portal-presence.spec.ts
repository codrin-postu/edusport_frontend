import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, TODAY, loginAs, mockLog, mockReset, shot } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const occ = (group: string, date: string): string => `/prezenta?occurrence=${encodeURIComponent(`occ:${group}:${date}`)}`;
// The tick boxes are visually hidden inputs; clicking through the DOM avoids the fixed bottom bar covering a row.
const tick = (page: Page, name: string): Promise<void> => page.getByLabel(name).evaluate((el) => (el as HTMLInputElement).click());
const FREE_DAY = "2026-11-03";

test("tick two, the counter, save, and what the server received", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gavansati", FREE_DAY));
  await expect(page.getByRole("heading", { name: "Avansați" })).toBeVisible();
  await expect(page.getByText("Andrei Popa (tu)")).toBeVisible();
  await expect(page.getByText("0 prezenți")).toBeVisible();
  await tick(page, "Grup, Maria Ionescu");
  await tick(page, "Uscat, Luca Dumitru");
  await expect(page.getByText("2 prezenți")).toBeVisible();
  await page.getByRole("button", { name: "Salvează", exact: true }).click();
  await expect(page.getByText("Prezență salvată: Avansați, 3 noi.")).toBeVisible();
  await expect(page).toHaveURL(/\/prezenta\?id=s-new/);
  const put = (await mockLog()).find((c) => c.method === "PUT" && c.path.endsWith("/coach/session"));
  const body = put?.body as { ticks: unknown[]; coachIds: string[]; occurrence?: string };
  expect(body.ticks).toHaveLength(2);
  expect(body.coachIds).toContain("tm-andrei");
});

test("the own coach row cannot be removed, others can", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gavansati", FREE_DAY));
  await expect(page.getByText("Andrei Popa (tu)")).toBeVisible();
  await expect(page.getByRole("button", { name: /^Scoate / })).toHaveCount(0);
  await page.getByRole("button", { name: "+ Adaugă alți antrenori" }).click();
  await tick(page, "Bianca Ene");
  await page.getByRole("button", { name: "OK" }).click();
  await expect(page.getByRole("button", { name: "Scoate Bianca Ene" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Scoate / })).toHaveCount(1);
});

test("an archived session is read only", async({ page }) => {
  await loginAs(page);
  await page.goto("/prezenta?id=s-archived");
  await expect(page.getByText("Arhivată. Nu mai poate fi modificată.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Salvează", exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Grup, Maria Ionescu")).toBeDisabled();
});

test("an archived session keeps the check marks: ticked boxes show a dimmed navy mark, unticked stay empty", async({ page }) => {
  await loginAs(page);
  await page.goto("/prezenta?id=s-archived");
  const mark = (name: string) => page.getByLabel(name).locator("xpath=following-sibling::*[2]");
  await expect(mark("Grup, Maria Ionescu")).toBeVisible();
  await expect(mark("Grup, Maria Ionescu")).toHaveCSS("color", "rgba(14, 26, 60, 0.55)");
  await expect(mark("Grup, Matei Radu")).toBeHidden();
});

test("no date button or day sheet: the date is plain text in the subline", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gavansati", FREE_DAY));
  await expect(page.getByText(/^Mar(ți|ti)?, 3 noi/)).toBeVisible();
  await expect(page.locator("[data-page-header] button")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^MA 3 NOI/ })).toHaveCount(0);
});

test("the back link goes where the coach came from, Azi by default", async({ page }) => {
  await loginAs(page);
  await page.goto("/prezenta?id=s-today");
  await expect(page.getByRole("link", { name: "‹ Azi" })).toHaveAttribute("href", "/");
  await page.goto("/prezenta?id=s-today&from=istoric");
  await expect(page.getByRole("link", { name: "‹ Istoric" })).toHaveAttribute("href", "/istoric");
  await page.goto("/prezenta?id=s-today&from=calendar");
  await expect(page.getByRole("link", { name: "‹ Calendar" })).toHaveAttribute("href", "/calendar");
  await page.goto("/prezenta?id=s-today&from=grupa");
  await expect(page.getByRole("link", { name: "‹ Avansați" })).toHaveAttribute("href", "/grupe/gavansati");
  await page.goto("/prezenta?id=s-today&from=nimic");
  await expect(page.getByRole("link", { name: "‹ Azi" })).toBeVisible();
});

test("Școala: no Uscat column, a line under each name; Club: no line", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gprimii", "2026-11-07"));
  await expect(page.getByText("Paul Enache", { exact: true })).toBeVisible();
  await expect(page.getByText("Uscat", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Abonament 8 ședințe").first()).toBeVisible();
  await expect(page.getByText("Fără abonament")).toBeVisible();
  await page.goto(occ("gavansati", FREE_DAY));
  await expect(page.getByText("Uscat", { exact: true })).toBeVisible();
  await expect(page.getByText("Abonament 8 ședințe")).toHaveCount(0);
});

test("the stand-in session says the coach will appear", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gsilver", TODAY));
  await expect(page.getByText("Vei apărea ca antrenor la această ședință.")).toBeVisible();
});

test("a stand-in read refused with no access lands on Grupe with that toast", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gsilver", "2026-11-06"));
  await expect(page).toHaveURL(/\/grupe$/);
  await expect(page.getByText("Nu mai ai acces la această grupă.")).toBeVisible();
});

test("an inactive athlete asks before the save goes on", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gavansati", FREE_DAY));
  await tick(page, "Grup, Robert Toma");
  await page.getByRole("button", { name: "Salvează", exact: true }).click();
  await expect(page.getByText("Robert Toma are statusul Inactiv. Reactivezi sportivul?")).toBeVisible();
  await page.getByRole("button", { name: "Reactivează și salvează" }).click();
  await expect(page).toHaveURL(/\/prezenta\?id=s-new/);
});

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];
const NAVY = "rgb(14, 26, 60)";
const ICE = "rgb(225, 236, 251)";

for (const size of SIZES) {
  test.describe(`Prezență look ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("the saved session counts its present children", async({ page }) => {
      await loginAs(page);
      await page.goto("/prezenta?id=s-today");
      await expect(page.locator("[data-save-bar]")).toContainText("7 prezenți");
      await expect(page.locator("[data-save-bar]")).toHaveCSS("border-top-color", "rgb(221, 230, 243)");
    });

    test("header, coach line, table, save bar", async({ page }, info) => {
      await loginAs(page);
      await page.goto(occ("gavansati", TODAY));
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Avansați");
      await expect(page.getByRole("link", { name: "‹ Azi" })).toHaveAttribute("href", "/");
      await expect(page.getByText("Joi, 5 noi, 18:15, AFI Cotroceni")).toBeVisible();
      await expect(page.getByText("Antrenor", { exact: true }).locator("visible=true").first()).toHaveCSS("font-weight", "700");
      await expect(page.getByText("Andrei Popa (tu)")).toBeVisible();
      await expect(page.getByRole("button", { name: "+ Adaugă alți antrenori" })).toBeVisible();
      const head = page.locator("[data-presence-head]");
      await expect(head).toHaveCSS("background-color", ICE);
      const sportiv = head.getByText("Sportiv", { exact: true });
      await expect(sportiv).toHaveCSS("font-size", "12px");
      await expect(sportiv).toHaveCSS("text-transform", "none");
      const box = page.getByLabel("Grup, Maria Ionescu");
      await expect(box.locator("xpath=..")).toHaveCSS("width", "44px");
      await expect(page.getByRole("link", { name: "Maria Ionescu" })).toHaveAttribute("href", /\/sportiv\/[^?]+\?grupa=gavansati$/);
      await expect(page.getByText("Uscat", { exact: true })).toBeVisible();
      await tick(page, "Grup, Maria Ionescu");
      await expect(box.locator("xpath=following-sibling::span[1]")).toHaveCSS("background-color", NAVY);
      const bar = page.locator("[data-save-bar]");
      await expect(bar).toContainText(/\d+ prezenți/);
      await expect(bar).toHaveCSS("border-top-color", "rgb(221, 230, 243)");
      await expect(bar.locator(".lcta-face")).toHaveCSS("background-color", NAVY);
      await expect(bar.getByRole("button", { name: "Salvează", exact: true })).toBeVisible();
      if (size.width < 900) {
        await expect(page.getByRole("navigation", { name: "Meniu" }).locator("visible=true")).toHaveCount(0);
        await expect(bar.locator("xpath=..")).toHaveCSS("position", "fixed");
      } else {
        const info_ = (await page.locator("[data-group-info]").boundingBox())!;
        const table = (await head.boundingBox())!;
        expect(table.x + table.width).toBeLessThanOrEqual(info_.x);
        await expect(page.getByText("Program:")).toBeVisible();
        await expect(page.getByText("Loc:")).toBeVisible();
        await expect(page.getByText("Antrenori:")).toBeVisible();
      }
      await shot(page, info, "prezenta");
    });
  });
}
