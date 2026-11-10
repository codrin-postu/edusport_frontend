import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 }, timezoneId: "Europe/Bucharest" });
test.beforeEach(async() => { await mockReset(); });

const classRow = (i: number, date: string) => ({
  sessionId: null, occurrenceKey: `occ:g${i}:${date}`, groupId: `g${i}`, groupName: `Grupa ${i}`, date, startTime: `${String(8 + i).padStart(2, "0")}:00`,
  children: 5, done: false, standIn: false, location: null,
});
const WEEK = { groupsHeld: 0, groupsLeft: 7, lessonsHeld: 0, lessonsLeft: 0, missing: 7 };

test("Azi: five rows then Vezi toate, for the today list and the list to complete", async({ page }) => {
  await loginAs(page);
  await page.route("**/api/portal/coach/today*", (route) => route.fulfill({
    json: {
      date: "2026-11-05", today: "2026-11-05", lessons: [], next: null, week: WEEK,
      groups: Array.from({ length: 7 }, (_, i) => classRow(i + 1, "2026-11-05")),
      todo: Array.from({ length: 7 }, (_, i) => classRow(i + 1, `2026-11-0${(i % 4) + 1}`)),
    },
  }));
  await page.goto("/");
  const todayList = page.locator("[data-today-list]");
  await expect(todayList.getByRole("link").filter({ has: page.locator("[data-status-block]") })).toHaveCount(5);
  await expect(todayList.getByRole("link", { name: "Vezi toate (7) ›" })).toHaveAttribute("href", "/calendar?luna=2026-11&zi=2026-11-05");
  const past = page.getByRole("heading", { name: "Prezență de completat" }).locator("xpath=../..");
  await expect(past.getByRole("link").filter({ has: page.locator("[data-status-block]") })).toHaveCount(5);
  await expect(past.getByRole("link", { name: "Vezi toate (7) ›" })).toHaveAttribute("href", "/istoric");
});

test("Azi: exactly five rows show no Vezi toate", async({ page }) => {
  await loginAs(page);
  await page.route("**/api/portal/coach/today*", (route) => route.fulfill({
    json: { date: "2026-11-05", today: "2026-11-05", lessons: [], next: null, week: WEEK, groups: Array.from({ length: 5 }, (_, i) => classRow(i + 1, "2026-11-05")), todo: [] },
  }));
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Vezi toate/ })).toHaveCount(0);
});

test("Istoric: 20 rows, Arată mai multe adds 20 and focuses the first new row", async({ page }) => {
  await loginAs(page);
  const rows = Array.from({ length: 45 }, (_, i) => ({
    kind: "grup", date: "2026-11-02", name: `Grupa ${i + 1}`, present: 3, durationMin: 60, sessionId: `s${i + 1}`, lessonId: null, done: true, occurrenceKey: null,
  }));
  await page.route("**/api/portal/coach/history*", (route) => route.fulfill({ json: { month: "2026-11", sessions: 45, lessons: 0, hours: "45", rows } }));
  await page.goto("/istoric");
  const list = page.locator("a[href*='/prezenta']");
  await expect(list).toHaveCount(20);
  const more = page.getByRole("button", { name: "Arată mai multe" });
  await more.click();
  await expect(list).toHaveCount(40);
  await expect(list.nth(20)).toBeFocused();
  await more.click();
  await expect(list).toHaveCount(45);
  await expect(page.getByRole("button", { name: "Arată mai multe" })).toHaveCount(0);
});

test("Concursuri: 20 cards, Arată mai multe adds 20 and focuses the first new one", async({ page }) => {
  await loginAs(page);
  const events = Array.from({ length: 30 }, (_, i) => ({
    eventId: `e${i + 1}`, name: `Concurs ${i + 1}`, date: "2026-11-02", location: "Bucuresti", members: [{ athleteId: "a1", name: "Ana", category: "Novice", placement: 1, total: 50 }],
  }));
  await page.route("**/api/portal/coach/competitions*", (route) => route.fulfill({ json: { available: true, stale: false, seasons: ["2026-2027"], season: "2026-2027", events } }));
  await page.goto("/concursuri");
  const cards = page.locator("details");
  await expect(cards).toHaveCount(20);
  await page.getByRole("button", { name: "Arată mai multe" }).click();
  await expect(cards).toHaveCount(30);
  await expect(cards.nth(20).locator("summary")).toBeFocused();
  await expect(page.getByRole("button", { name: "Arată mai multe" })).toHaveCount(0);
});
