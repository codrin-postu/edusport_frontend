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

test("the day sheet marks saved days, blocks the future and opens the existing dialog", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gavansati", FREE_DAY));
  await page.getByRole("button", { name: "MA 3 NOI" }).click();
  await expect(page.getByText("Alege ziua pentru care faci prezența.")).toBeVisible();
  await expect(page.locator("td.bg-surface-highlight")).toHaveCount(1);
  await expect(page.getByText("are prezență salvată")).toBeVisible();
  await expect(page.getByRole("button", { name: /, 6 noiembrie/ })).toBeDisabled();
  await page.getByRole("button", { name: /, 5 noiembrie/ }).click();
  await page.getByRole("button", { name: "Alege joi 5 noi" }).click();
  await expect(page.getByText("Există deja o ședință salvată")).toBeVisible();
  await expect(page.getByText("18:15, 7 prezenți, Salvată de Andrei Popa")).toBeVisible();
  await page.getByRole("link", { name: "Deschide prezența salvată" }).click();
  await expect(page).toHaveURL(/\/prezenta\?id=s-today$/);
});

test("picking a day without a saved session opens its class", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gavansati", TODAY));
  await page.getByRole("button", { name: "JO 5 NOI" }).click();
  await page.getByRole("button", { name: /, 4 noiembrie/ }).click();
  await page.getByRole("button", { name: "Alege miercuri 4 noi" }).click();
  await expect(page).toHaveURL(/\/prezenta\?occurrence=occ%3Agavansati%3A2026-11-04$/);
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

test("a stand-in sees no add button, and Deschide only on a session that lists them", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gsilver", TODAY));
  await page.getByRole("button", { name: /^JO 5 NOI/ }).click();
  await page.getByRole("button", { name: /, 2 noiembrie/ }).click();
  await page.getByRole("button", { name: "Alege luni 2 noi" }).click();
  await expect(page.getByText("Există deja o ședință salvată")).toBeVisible();
  await expect(page.getByRole("link", { name: "Deschide prezența salvată" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Adaugă încă o ședință în ziua asta" })).toHaveCount(0);
});

test("an own group still offers the add button, and Deschide where the coach is listed", async({ page }) => {
  await loginAs(page);
  await page.goto(occ("gavansati", FREE_DAY));
  await page.getByRole("button", { name: "MA 3 NOI" }).click();
  await page.getByRole("button", { name: /, 5 noiembrie/ }).click();
  await page.getByRole("button", { name: "Alege joi 5 noi" }).click();
  await expect(page.getByRole("link", { name: "Deschide prezența salvată" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Adaugă încă o ședință în ziua asta" })).toBeVisible();
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
