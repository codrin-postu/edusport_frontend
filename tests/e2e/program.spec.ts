import { expect, test } from "@playwright/test";

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// The mock (tests/e2e/mock-strapi.mjs) gives the Sunday of the week that holds the 1st of the
// month two Școala groups, and the 1st a Club date named "Grupa Club Alfa"; the calendar opens
// on that month and, in the week view, on that week.
const now = new Date();
const first = new Date(now.getFullYear(), now.getMonth(), 1);
const DOUBLED = ymd(new Date(first.getFullYear(), first.getMonth(), 1 + ((7 - first.getDay()) % 7)));
const CLUB_DAY = ymd(first);

test("the Program notebook lists the Școala groups by time, comma letters", async({ page }) => {
  await page.goto("/cursuri/program");
  const notebook = page.locator("section", { hasText: "Program Școala de Patinaj" });
  await expect(notebook.getByText("09:00 - 09:50")).toBeVisible();
  await expect(notebook.getByText("- Primii Pași")).toBeVisible();
  await expect(notebook.getByText("- Avansați Bronze")).toBeVisible();
  await expect(notebook.getByText("Primii Paşi")).toHaveCount(0);
});

test("the month view shows one Școala tile on a two-group day and the Club tile under its group name", async({ page }) => {
  await page.goto("/cursuri/program");
  const doubled = page.locator(`td[data-date="${DOUBLED}"]`);
  await expect(doubled).toBeVisible();
  await expect(doubled.getByText("Școala de patinaj", { exact: true })).toHaveCount(1);
  await expect(doubled.getByText("Avansați Gold")).toHaveCount(0);
  const clubDay = page.locator(`td[data-date="${CLUB_DAY}"]`);
  await expect(clubDay.getByText("Grupa Club Alfa", { exact: true })).toHaveCount(1);
  await expect(clubDay.getByText("Antrenament")).toHaveCount(0);
});

test("the week view shows one Școala tile on a two-group day and the Club tile under its group name", async({ page }) => {
  await page.goto("/cursuri/program");
  await expect(page.locator(`td[data-date="${DOUBLED}"]`)).toBeVisible();
  await page.getByRole("button", { name: "Lunar" }).click();
  await page.getByRole("menuitemradio", { name: "Săptămânal" }).click();
  const doubled = page.locator(`.fc-timegrid-col[data-date="${DOUBLED}"]`);
  await expect(doubled).toBeVisible();
  await expect(doubled.getByText("Școala de patinaj", { exact: true })).toHaveCount(1);
  await expect(doubled.getByText("Avansați Gold")).toHaveCount(0);
  const clubDay = page.locator(`.fc-timegrid-col[data-date="${CLUB_DAY}"]`);
  await expect(clubDay.getByText("Grupa Club Alfa", { exact: true })).toHaveCount(1);
  await expect(clubDay.getByText("Antrenament")).toHaveCount(0);
});
