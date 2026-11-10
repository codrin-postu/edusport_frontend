import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset, mockState, shot } from "./portal-helpers";

test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];
const calls = async() => (await mockLog()).filter((c) => c.path.includes("/competitions")).map((c) => c.path);

for (const size of SIZES) {
  test.describe(`Concursuri ${size.width}`, () => {
    test.use({ baseURL: COACH_BASE, viewport: size, timezoneId: "Europe/Bucharest" });

    test("three cards newest first, the first open, members link to the athlete", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/concursuri");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Concursuri");
      await expect(page.getByText("Rezultatele sportivilor clubului")).toBeVisible();
      await expect(page.getByRole("button", { name: "Toți sportivii" })).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("button", { name: "Grupele mele" })).toHaveAttribute("aria-pressed", "false");
      await expect(page.getByRole("group", { name: "Sportivi" })).toBeVisible();
      await expect(page.getByText("Sezon", { exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Sezon" })).toHaveText("2026-2027");
      const cards = page.locator("details");
      await expect(cards).toHaveCount(3);
      await expect(cards.nth(0).locator("summary")).toContainText("Cupa României");
      await expect(cards.nth(1).locator("summary")).toContainText("Edu Sport Trophy");
      await expect(cards.nth(2).locator("summary")).toContainText("Cupa Patinoarului Nord");
      await expect(cards.nth(0)).toHaveAttribute("open", "");
      await expect(cards.nth(1)).not.toHaveAttribute("open", "");
      const first = cards.nth(0);
      await expect(first.locator("[data-date-block]").first()).toContainText("Oct");
      await expect(first.locator("[data-date-block]").first()).toContainText("26");
      await expect(first.locator("summary")).toContainText("Brașov");
      await expect(first.locator("[data-comp-count]")).toContainText("3");
      await expect(first.locator("[data-comp-count]")).toContainText("sportivi");
      const members = first.locator("[data-comp-member]");
      await expect(members).toHaveCount(3);
      await expect(members.nth(0)).toContainText("Loc");
      await expect(members.nth(0)).toContainText("Maria Ionescu");
      await expect(members.nth(0)).toContainText("Advanced Novice Girls");
      await expect(members.nth(0)).toContainText("142,30");
      await expect(members.nth(0)).toHaveAttribute("href", "/sportiv/amaria");
      await shot(page, info, "concursuri");
      await members.nth(0).click();
      await expect(page).toHaveURL(/\/sportiv\/amaria$/);
    });

    test("Grupele mele asks for scope=mine with the season and shows own children only", async({ page }) => {
      await loginAs(page);
      await page.goto("/concursuri");
      await expect(page.locator("details")).toHaveCount(3);
      await expect(page.locator("details").first().locator("[data-comp-member]")).toHaveCount(3);
      await page.getByRole("button", { name: "Grupele mele" }).click();
      await expect(page.getByRole("button", { name: "Grupele mele" })).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator("details").first().locator("[data-comp-member]")).toHaveCount(2);
      await expect(page.locator("details").first()).not.toContainText("Dara Constantin");
      expect(await calls()).toContain("/api/portal/coach/competitions?scope=mine&season=2026-2027");
    });

    test("another season is requested; an empty season says so", async({ page }) => {
      await loginAs(page);
      await page.goto("/concursuri");
      await page.getByRole("button", { name: "Sezon" }).click();
      await page.getByRole("menuitemradio", { name: "2025-2026" }).click();
      await expect(page.getByText("Niciun rezultat în acest sezon.")).toBeVisible();
      await expect(page.locator("details")).toHaveCount(0);
      expect((await calls()).some((p) => p.includes("season=2025-2026"))).toBe(true);
    });

    test("a closed card opens with Enter on its summary", async({ page }) => {
      await loginAs(page);
      await page.goto("/concursuri");
      const second = page.locator("details").nth(1);
      await expect(second).not.toHaveAttribute("open", "");
      await second.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(second).toHaveAttribute("open", "");
    });

    test("a source that is down shows the notice and no card", async({ page }) => {
      await mockState({ competitionsDown: true });
      await loginAs(page);
      await page.goto("/concursuri");
      await expect(page.getByText("Rezultatele nu sunt disponibile acum.")).toBeVisible();
      await expect(page.locator("details")).toHaveCount(0);
    });
  });
}

test.describe("Concursuri layout", () => {
  test.use({ baseURL: COACH_BASE, viewport: { width: 1280, height: 900 }, timezoneId: "Europe/Bucharest" });

  test("at 1280 the filters share a row, the select is 220px and the list 860px at most", async({ page }) => {
    await loginAs(page);
    await page.goto("/concursuri");
    await expect(page.locator("details")).toHaveCount(3);
    const seg = await page.getByRole("group", { name: "Sportivi" }).boundingBox();
    const sel = await page.getByRole("button", { name: "Sezon" }).boundingBox();
    expect(seg && sel && Math.abs(seg.y + seg.height - (sel.y + sel.height)) < 4).toBe(true);
    expect(sel?.width).toBeCloseTo(220, 0);
    const list = await page.locator("details").first().boundingBox();
    expect(list?.width).toBeLessThanOrEqual(860);
    expect(list?.width).toBeGreaterThan(800);
  });
});
