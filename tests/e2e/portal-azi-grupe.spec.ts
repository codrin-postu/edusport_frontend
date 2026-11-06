import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset, mockState } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("Azi: greeting, day tile, groups, lessons and the todo row", async({ page }) => {
  await loginAs(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Bună, Andrei" })).toBeVisible();
  await expect(page.getByText("JO 5 NOI")).toBeVisible();
  await expect(page.getByText("grup, 9 copii")).toBeVisible();
  const saved = page.getByRole("link").filter({ hasText: "grup, 9 copii" });
  await expect(saved.getByText("Completat")).toBeVisible();
  await expect(saved).toHaveAttribute("href", /\/prezenta\?id=s-today$/);
  await expect(page.getByText("Lecții individuale")).toBeVisible();
  await expect(page.getByRole("link", { name: "+ Lecție individuală" })).toHaveAttribute("href", "/lectie/noua");
  await expect(page.getByText("grup, 30 oct")).toBeVisible();
  await expect(page.getByText("De făcut")).toBeVisible();
});

test("Azi: no classes and no lessons", async({ page }) => {
  await loginAs(page);
  await mockState({ emptyToday: true });
  await page.goto("/");
  await expect(page.getByText("Nicio ședință azi.")).toBeVisible();
  await expect(page.getByText("Lecții individuale")).toHaveCount(0);
});

test("Grupe: mine, the other groups collapsed until clicked", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe");
  await expect(page.getByRole("heading", { name: "Grupele mele" })).toBeVisible();
  await expect(page.getByText("Ma, Mi 18:15, 9 copii")).toBeVisible();
  const others = page.getByRole("button", { name: "Alte grupe" });
  await expect(others).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("Uscat Juniori")).toHaveCount(0);
  await others.click();
  await expect(others).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Uscat Juniori")).toBeVisible();
  await expect(page.getByText("Antrenor: Bianca Ene").first()).toBeVisible();
});

test("own group: members, the new label, other groups, tabs", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati");
  await expect(page.getByRole("heading", { name: "Avansați" })).toBeVisible();
  await expect(page.getByText("Sportivi (9)")).toBeVisible();
  await expect(page.getByText("nou", { exact: true })).toHaveCount(1);
  await expect(page.getByText("și în Uscat Juniori")).toBeVisible();
  await expect(page.getByText("Antrenori: Andrei Popa")).toBeVisible();
  await expect(page.getByRole("link", { name: "Fă prezența" })).toHaveAttribute("href", /\/prezenta\?occurrence=occ%3Agavansati%3A/);
  await expect(page.getByRole("link", { name: "+ Adaugă sportiv" })).toHaveAttribute("href", "/grupe/gavansati/adauga");
  await page.getByRole("button", { name: "Program" }).click();
  await expect(page).toHaveURL(/\/grupe\/gavansati\?tab=program$/);
  await expect(page.getByText("Sportivi (9)")).toHaveCount(0);
});

test("other group: banner, stand-in today, no roster", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/guscat");
  await expect(page.getByText("Grupa altui antrenor")).toBeVisible();
  await expect(page.getByText("Program: Lu, Jo 17:00")).toBeVisible();
  await expect(page.getByRole("link", { name: "Înlocuiesc azi" })).toBeVisible();
  await expect(page.getByText("Sportivi (")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Sportivi" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "+ Adaugă sportiv" })).toHaveAttribute("href", "/grupe/guscat/sportiv-nou");
});

test("other group without a class today: the stand-in sheet lists the recent slots", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gsilver");
  await expect(page.getByRole("link", { name: "Înlocuiesc azi" })).toHaveCount(0);
  await page.getByRole("button", { name: "Fă prezența ca înlocuitor" }).click();
  const rows = page.getByRole("dialog").getByRole("link");
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toHaveAttribute("href", "/prezenta?occurrence=occ%3Agsilver%3A2026-11-05");
});

test("desktop: the list stays beside the group page", async({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await loginAs(page);
  await page.goto("/grupe/gavansati");
  await expect(page.getByRole("heading", { name: "Grupele mele" })).toBeVisible();
  await expect(page.getByText("Sportivi (9)")).toBeVisible();
});

test("an unknown group shows the load error", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/nu-exista");
  await expect(page.getByText("Nu am putut încărca datele.")).toBeVisible();
});
