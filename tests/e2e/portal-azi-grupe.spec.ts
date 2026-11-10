import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset, mockState, shot } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];

for (const size of SIZES) {
  test.describe(`Azi ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("greeting, now tile, stat, the four rows and the past list", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Azi");
      await expect(page.getByText("Bună, Andrei")).toBeVisible();
      const tile = page.getByRole("group", { name: "Joi, 5 noiembrie, ora 14:00" });
      for (const t of ["Noi", "5", "14:00", "Joi"]) await expect(tile.getByText(t, { exact: true })).toBeVisible();
      const stat = page.locator("[data-stat-num]").locator("xpath=..").locator("xpath=..");
      await expect(stat.locator("[data-stat-num]")).toHaveText("4");
      await expect(stat).toContainText("antrenamente azi");
      await expect(stat).toContainText("2 completate");
      const rows = page.getByRole("link").filter({ has: page.locator("[data-status-block]") });
      await expect(rows).toHaveCount(5);
      const today = rows.filter({ hasNot: page.locator("[data-date-word]") });
      await expect(today).toHaveCount(4);
      await expect(today.nth(0)).toContainText("Primii Pași");
      await expect(today.nth(0)).toContainText("10:00");
      await expect(today.nth(0).locator("[data-date-num]")).toHaveCSS("color", "rgb(151, 155, 165)");
      await expect(today.nth(1)).toContainText("Matei Radu");
      await expect(today.nth(1)).toContainText("15:00");
      await expect(today.nth(1).locator("[data-individual-tag]")).toHaveCSS("background-color", "rgb(17, 17, 17)");
      await expect(today.nth(1)).toContainText("50 min");
      await expect(today.nth(1).locator("[data-status-block]")).toHaveAttribute("aria-label", "Individual, completat");
      await expect(today.nth(1)).toHaveAttribute("href", "/lectie/ldone");
      await expect(today.nth(2)).toContainText("Ana Stoica");
      await expect(today.nth(2).locator("[data-status-block]")).toHaveAttribute("aria-label", "Individual, necompletat");
      await expect(today.nth(3)).toContainText("Avansați");
      await expect(today.nth(3)).toContainText("18:15");
      await expect(today.nth(3)).toContainText("grup, 9 copii, AFI Cotroceni");
      await expect(today.nth(3)).toHaveAttribute("href", /\/prezenta\?id=s-today$/);
      const done = today.nth(3).locator("[data-status-block]");
      await expect(done).toHaveAttribute("aria-label", "Grup, completat");
      await expect(done).toHaveCSS("background-color", "rgb(74, 123, 208)");
      const todo = today.nth(0).locator("[data-status-block]");
      await expect(todo).toHaveAttribute("aria-label", "Grup, necompletat");
      await expect(todo).toHaveCSS("background-color", "rgb(14, 26, 60)");
      await expect(today.nth(0)).toHaveAttribute("href", /\/prezenta\?occurrence=occ%3Agprimii%3A/);
      await expect(page.getByRole("link", { name: "Calendar ›" })).toHaveAttribute("href", "/calendar");
      await expect(page.getByRole("heading", { name: "Antrenamente fără prezență" })).toBeVisible();
      const past = rows.filter({ has: page.locator("[data-date-word]") });
      await expect(past).toHaveCount(1);
      await expect(past).toContainText("Avansați");
      await expect(past.locator("[data-date-word]")).toHaveText("Vin");
      await expect(past.locator("[data-date-word]")).toHaveCSS("color", "rgb(190, 51, 48)");
      await expect(past.locator("[data-date-num]")).toHaveText("30");
      await expect(past).toContainText("grup, 18:15");
      await shot(page, info, "azi");
    });

    test("no classes and no lessons", async({ page }) => {
      await loginAs(page);
      await mockState({ emptyToday: true });
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Antrenamente azi" })).toBeVisible();
      await expect(page.getByText("Nicio ședință azi.")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Antrenamente fără prezență" })).toHaveCount(0);
    });
  });
}

test.describe("Azi layout", () => {
  test.use({ timezoneId: "Europe/Bucharest" });

  test("phone: the brand row and a full width lesson button under the today card", async({ page }) => {
    await page.setViewportSize(SIZES[0]);
    await loginAs(page);
    await page.goto("/");
    const head = page.locator("[data-page-header]");
    await expect(head.getByText("CLUBUL SPORTIV")).toBeVisible();
    await expect(head.getByText("EDUSPORT", { exact: true })).toBeVisible();
    const button = page.getByRole("link", { name: "+ Lecție individuală" }).locator("visible=true");
    await expect(button).toHaveCount(1);
    const box = await button.boundingBox();
    expect(box!.width).toBeGreaterThan(390 - 2 * 20 - 2);
    const card = await page.getByRole("link", { name: /^18:15 Avansați/ }).first().boundingBox();
    expect(box!.y).toBeGreaterThan(card!.y);
    const past = await page.getByRole("heading", { name: "Antrenamente fără prezență" }).boundingBox();
    expect(past!.y).toBeGreaterThan(box!.y);
  });

  test("desktop: stat and past left of the today card, the lesson button in the top band", async({ page }) => {
    await page.setViewportSize(SIZES[1]);
    await loginAs(page);
    await page.goto("/");
    const stat = await page.locator("[data-stat-num]").boundingBox();
    const past = await page.getByRole("heading", { name: "Antrenamente fără prezență" }).boundingBox();
    const today = await page.getByRole("heading", { name: "Antrenamente azi" }).boundingBox();
    expect(stat!.x).toBeLessThan(today!.x);
    expect(past!.x).toBeLessThan(today!.x);
    const button = page.getByRole("link", { name: "+ Lecție individuală" }).locator("visible=true");
    await expect(button).toHaveCount(1);
    const header = await page.locator("[data-page-header]").boundingBox();
    const bb = await button.boundingBox();
    expect(bb!.y).toBeGreaterThanOrEqual(header!.y);
    expect(bb!.y + bb!.height).toBeLessThanOrEqual(header!.y + header!.height);
  });
});

for (const size of SIZES) {
  test.describe(`Grupe ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("sections, date blocks, rows and links", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/grupe");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Grupe");
      await expect(page.getByText("2 grupe, 13 copii")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Grupele mele" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Alte grupe" })).toBeVisible();
      const row = (name: string) => page.getByRole("link").filter({ hasText: name }).filter({ has: page.locator("[data-date-block]") });
      const avansati = row("Avansați");
      await expect(avansati.locator("[data-date-word]")).toHaveText("Joi");
      await expect(avansati.locator("[data-date-num]")).toHaveText("5");
      await expect(avansati).toContainText("Ma, Mi 18:15, 9 copii");
      await expect(avansati).toHaveAttribute("href", "/grupe/gavansati");
      const primii = row("Primii Pași");
      await expect(primii.locator("[data-date-word]")).toHaveText("Joi");
      await expect(primii.locator("[data-date-num]")).toHaveText("5");
      await expect(primii).toContainText("Sâ, Du 10:00, 4 copii");
      const silver = row("Intermediari Silver");
      await expect(silver.locator("[data-date-word]")).toHaveText("Sâm");
      await expect(silver).toContainText("Sâ, Du 10:00, 2 copii");
      await expect(silver).toContainText("Antrenor: Bianca Ene");
      const uscat = row("Uscat Juniori");
      await expect(uscat.locator("[data-date-word]")).toHaveText("Joi");
      await expect(uscat.locator("[data-date-num]")).toHaveText("5");
      await expect(uscat).toContainText("Antrenor: Bianca Ene");
      await expect(uscat).toHaveAttribute("href", "/grupe/guscat");
      const h = async(name: string) => (await page.getByRole("heading", { name }).boundingBox())!;
      if (size.width >= 900) expect((await h("Alte grupe")).x).toBeGreaterThan((await h("Grupele mele")).x);
      else expect((await h("Alte grupe")).y).toBeGreaterThan((await h("Grupele mele")).y);
      await shot(page, info, "grupe");
    });
  });
}

test("a group without a next class shows the plain row", async({ page }) => {
  await page.route("**/api/portal/coach/groups", (route) => route.fulfill({
    json: { mine: [{ groupId: "gavansati", name: "Avansați", kind: "club", program: ["Ma, Mi 18:15"], children: 9, next: null }], others: [] },
  }));
  await loginAs(page);
  await page.goto("/grupe");
  const first = page.getByRole("link", { name: /Avansați/ });
  await expect(first).toBeVisible();
  await expect(first.locator("[data-date-block]")).toHaveCount(0);
});

for (const size of SIZES) {
  test.describe(`Grupă ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("info card, actions, tabs and the member rows", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Avansați");
      await expect(page.getByRole("link", { name: "‹ Grupe" })).toHaveAttribute("href", "/grupe");
      const card = page.locator("[data-group-info] > div");
      await expect(card).toHaveCSS("background-color", "rgb(225, 236, 251)");
      await expect(card).toContainText("Program: Ma, Mi 18:15");
      await expect(card).toContainText("Loc: AFI Cotroceni");
      await expect(card).toContainText("Antrenori: Andrei Popa");
      await expect(card.locator("b")).toHaveText(["Program:", "Loc:", "Antrenori:"]);
      const presence = page.getByRole("link", { name: "Fă prezența" });
      await expect(presence).toHaveCount(size.width >= 900 ? 2 : 1);
      await expect(presence.last()).toHaveAttribute("href", /\/prezenta\?occurrence=occ%3Agavansati%3A/);
      await expect(page.getByRole("link", { name: "Modifică grupa" })).toHaveAttribute("href", "/grupe/gavansati/modifica");
      await expect(page.getByRole("button", { name: "Sportivi (9)" })).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("button", { name: "Program" })).toHaveAttribute("aria-pressed", "false");
      const rows = page.locator("a[href^='/sportiv/']");
      await expect(rows).toHaveCount(9);
      const row = (name: string) => rows.filter({ hasText: name });
      await expect(row("Tudor Pavel")).toContainText("8 ani, nou");
      await expect(row("Ioana Diaconu")).toContainText("12 ani, și în Uscat Juniori");
      await expect(row("Sofia Nistor")).toContainText("11 ani, până pe 12 noi");
      await expect(row("Sofia Nistor")).toHaveAttribute("href", "/sportiv/asofia?grupa=gavansati");
      const left = (await page.locator("[data-group-info]").boundingBox())!;
      const list = (await rows.first().boundingBox())!;
      if (size.width >= 900) {
        expect(left.x + left.width).toBeLessThan(list.x);
        const band = page.locator("[data-page-header]").getByRole("link", { name: "Fă prezența" });
        await expect(band).toBeVisible();
      } else {
        expect(list.y).toBeGreaterThan(left.y);
      }
      await shot(page, info, "grupa");
    });
  });
}

test("a group without a class today has no Fă prezența", async({ page }) => {
  await page.route("**/api/portal/coach/groups/gavansati", (route) => route.fulfill({
    json: {
      groupId: "gavansati", name: "Avansați", kind: "club", own: true, coaches: ["Andrei Popa"], program: ["Ma, Mi 18:15"], members: [], standIn: [],
      todayKey: null, programPublic: null, location: "AFI Cotroceni",
    },
  }));
  await loginAs(page);
  await page.goto("/grupe/gavansati");
  await expect(page.getByRole("link", { name: "Modifică grupa" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Fă prezența" })).toHaveCount(0);
});

test("own group: the program tab", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati");
  await page.getByRole("button", { name: "Program" }).click();
  await expect(page).toHaveURL(/\/grupe\/gavansati\?tab=program$/);
  await expect(page.locator("a[href^='/sportiv/']")).toHaveCount(0);
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

test("an unknown group shows the load error", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/nu-exista");
  await expect(page.getByText("Nu am putut încărca datele.")).toBeVisible();
});
