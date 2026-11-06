import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset, mockState } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const WD = ["DU", "LU", "MA", "MI", "JO", "VI", "SÂ"];
const MON = ["IAN", "FEB", "MAR", "APR", "MAI", "IUN", "IUL", "AUG", "SEP", "OCT", "NOI", "DEC"];
const SHORT = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "noi", "dec"];

test("Azi: greeting, day tile, groups, lessons and the todo row", async({ page }) => {
  await loginAs(page);
  await page.goto("/");
  const now = new Date();
  await expect(page.getByRole("heading", { name: "Bună, Andrei" })).toBeVisible();
  await expect(page.getByText(`${WD[now.getDay()]} ${now.getDate()} ${MON[now.getMonth()]}`)).toBeVisible();
  await expect(page.getByText("grup, 9 copii")).toBeVisible();
  const saved = page.getByRole("link").filter({ hasText: "grup, 9 copii" });
  await expect(saved.getByText("Completat")).toBeVisible();
  await expect(saved).toHaveAttribute("href", /\/prezenta\?id=s-today$/);
  await expect(page.getByText("Lecții individuale")).toBeVisible();
  await expect(page.getByRole("link", { name: "+ Lecție individuală" })).toHaveAttribute("href", "/lectie/noua");
  const six = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  await expect(page.getByText(`grup, ${six.getDate()} ${SHORT[six.getMonth()]}`)).toBeVisible();
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
  // The mock gives Uscat Juniori a class only on Monday and Thursday; on other days the stand-in sheet lists its recent slots.
  if ([1, 4].includes(new Date().getDay())) {
    await expect(page.getByRole("link", { name: "Înlocuiesc azi" })).toBeVisible();
  } else {
    await page.getByRole("button", { name: "Fă prezența ca înlocuitor" }).click();
    await expect(page.getByRole("dialog").getByRole("link")).toHaveCount(2);
    await expect(page.getByRole("dialog").getByRole("link").first()).toHaveAttribute("href", /\/prezenta\?occurrence=occ%3Aguscat%3A/);
    await page.keyboard.press("Escape");
  }
  await expect(page.getByText("Sportivi (")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Sportivi" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "+ Adaugă sportiv" })).toHaveAttribute("href", "/grupe/guscat/sportiv-nou");
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
