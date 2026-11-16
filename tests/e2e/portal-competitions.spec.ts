import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset, mockState } from "./portal-helpers";

test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];
const calls = async() => (await mockLog()).filter((c) => c.path.includes("/competitions")).map((c) => c.path);

for (const size of SIZES) {
  test.describe(`Concursuri ${size.width}`, () => {
    test.use({ baseURL: COACH_BASE, viewport: size, timezoneId: "Europe/Bucharest" });

    test("three cards newest first, the first open, members link to the athlete", async({ page }) => {
      await loginAs(page);
      await page.goto("/concursuri");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Concursuri");
      await expect(page.getByRole("group", { name: "Sportivi" }).getByRole("button").first()).toHaveText("Grupele mele");
      await expect(page.getByRole("button", { name: "Grupele mele" })).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("button", { name: "Toți sportivii" })).toHaveAttribute("aria-pressed", "false");
      await expect.poll(calls).toContain("/api/portal/coach/competitions?scope=mine");
      await expect(page.getByRole("group", { name: "Sportivi" })).toBeVisible();
      await expect(page.getByText("Sezon", { exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Sezon" })).toHaveText("2026-2027");
      const cards = page.locator("[data-comp-card]");
      await expect(cards).toHaveCount(3);
      await expect(cards.nth(0).getByRole("button", { expanded: true })).toContainText("Cupa României");
      await expect(cards.nth(1).getByRole("button")).toContainText("Edu Sport Trophy");
      await expect(cards.nth(2).getByRole("button")).toContainText("Cupa Patinoarului Nord");
      await expect(cards.nth(0).locator("button[aria-expanded]")).toHaveAttribute("aria-expanded", "true");
      await expect(cards.nth(1).locator("button[aria-expanded]")).toHaveAttribute("aria-expanded", "false");
      await expect(cards.nth(1).locator("[data-comp-member]")).toHaveCount(0);
      const first = cards.nth(0);
      await expect(first.locator("[data-date-block]").first()).toContainText("Oct");
      await expect(first.locator("[data-date-block]").first()).toContainText("26");
      await expect(first.locator("[data-date-time]")).toHaveCount(0);
      await expect(first.locator("button[aria-expanded]")).toContainText("Brașov");
      await expect(first.locator("[data-comp-count]")).toContainText("2");
      await expect(first.locator("[data-comp-count]")).toContainText("sportivi");
      const members = first.locator("[data-comp-member]");
      await expect(members).toHaveCount(2);
      await expect(members.nth(0)).toContainText("Loc");
      await expect(members.nth(0)).toContainText("Maria Ionescu");
      await expect(members.nth(0)).toContainText("Advanced Novice Girls");
      await expect(members.nth(0)).toContainText("142,30");
      await expect(members.nth(0)).toHaveAttribute("href", "/sportiv/amaria");
      await members.nth(0).click();
      await expect(page).toHaveURL(/\/sportiv\/amaria$/);
    });

    test("Toți sportivii asks for scope=all with the season and shows every athlete", async({ page }) => {
      await loginAs(page);
      await page.goto("/concursuri");
      await expect(page.locator("[data-comp-card]")).toHaveCount(3);
      await expect(page.locator("[data-comp-card]").first().locator("[data-comp-member]")).toHaveCount(2);
      await expect(page.locator("[data-comp-card]").first()).not.toContainText("Dara Constantin");
      await page.getByRole("button", { name: "Toți sportivii" }).click();
      await expect(page.getByRole("button", { name: "Toți sportivii" })).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator("[data-comp-card]").first().locator("[data-comp-member]")).toHaveCount(3);
      expect(await calls()).toContain("/api/portal/coach/competitions?scope=all&season=2026-2027");
    });

    test("another season is requested; an empty season says so", async({ page }) => {
      await loginAs(page);
      await page.goto("/concursuri");
      await page.getByRole("button", { name: "Sezon" }).click();
      await page.getByRole("menuitemradio", { name: "2025-2026" }).click();
      await expect(page.getByText("Niciun rezultat în acest sezon.")).toBeVisible();
      await expect(page.locator("[data-comp-card]")).toHaveCount(0);
      expect((await calls()).some((p) => p.includes("season=2025-2026"))).toBe(true);
    });

    test("a closed card opens with Enter on its header", async({ page }) => {
      await loginAs(page);
      await page.goto("/concursuri");
      const second = page.locator("[data-comp-card]").nth(1);
      const header = second.locator("button[aria-expanded]");
      await expect(header).toHaveAttribute("aria-expanded", "false");
      await header.focus();
      await page.keyboard.press("Enter");
      await expect(header).toHaveAttribute("aria-expanded", "true");
      await expect(second.locator("[data-comp-member]")).toHaveCount(2);
    });

    test("a source that is down shows the notice and no card", async({ page }) => {
      await mockState({ competitionsDown: true });
      await loginAs(page);
      await page.goto("/concursuri");
      await expect(page.getByText("Rezultate indisponibile.")).toBeVisible();
      await expect(page.locator("[data-comp-card]")).toHaveCount(0);
    });
  });
}
