import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset, mockState } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];

for (const size of SIZES) {
  test.describe(`Azi ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("greeting, now tile, stat, the four rows and the past list", async({ page }) => {
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
      const today = page.locator("[data-today-list]").getByRole("link").filter({ has: page.locator("[data-status-block]") });
      await expect(today).toHaveCount(4);
      // Every today row shows weekday, day and hour in its square (not the hour alone).
      for (let i = 0; i < 4; i++) {
        await expect(today.nth(i).locator("[data-date-word]")).toHaveText("Joi");
        await expect(today.nth(i).locator("[data-date-num]")).toHaveText("5");
        await expect(today.nth(i).locator("[data-date-time]")).toHaveText(["10:00", "15:00", "17:00", "18:15"][i]);
      }
      await expect(today.nth(0)).toContainText("Primii Pași");
      await expect(today.nth(1)).toContainText("Matei Radu");
      await expect(today.nth(1)).toContainText("50 min");
      await expect(today.nth(1).locator("[data-status-block]")).toHaveAttribute("aria-label", "Individual, completat");
      await expect(today.nth(1)).toHaveAttribute("href", "/lectie/ldone");
      await expect(today.nth(2)).toContainText("Ana Stoica");
      await expect(today.nth(2).locator("[data-status-block]")).toHaveAttribute("aria-label", "Individual, necompletat");
      await expect(today.nth(3)).toContainText("Avansați");
      await expect(today.nth(3)).toContainText("grup, 9 copii, AFI Cotroceni");
      await expect(today.nth(3)).toHaveAttribute("href", /\/prezenta\?id=s-today$/);
      const done = today.nth(3).locator("[data-status-block]");
      await expect(done).toHaveAttribute("aria-label", "Grup, completat");
      const todo = today.nth(0).locator("[data-status-block]");
      await expect(todo).toHaveAttribute("aria-label", "Grup, necompletat");
      await expect(today.nth(0)).toHaveAttribute("href", /\/prezenta\?occurrence=occ%3Agprimii%3A/);
      await expect(page.getByRole("link", { name: "Calendar ›" })).toHaveAttribute("href", "/calendar");
      await expect(page.getByRole("heading", { name: "Prezență de completat" })).toBeVisible();
      const past = page.getByRole("heading", { name: "Prezență de completat" }).locator("xpath=../following-sibling::*[1]//a");
      await expect(past).toHaveCount(1);
      await expect(past).toContainText("Avansați");
      await expect(past.locator("[data-date-word]")).toHaveText("Vin");
      await expect(past.locator("[data-date-num]")).toHaveText("30");
      await expect(past.locator("[data-date-time]")).toHaveText("18:15");
      await expect(past).toContainText("grup, ");
      await expect(past.locator("[data-date-block]")).toHaveCount(1);
    });

    test("no classes and no lessons", async({ page }) => {
      await loginAs(page);
      await mockState({ emptyToday: true });
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Antrenamente azi" })).toBeVisible();
      await expect(page.getByText("Nicio ședință azi.")).toBeVisible();
      // The unsaved presences stay listed on a day without sessions.
      await expect(page.getByRole("heading", { name: "Prezență de completat" })).toBeVisible();
      const past = page.getByRole("heading", { name: "Prezență de completat" }).locator("xpath=../following-sibling::*[1]//a");
      await expect(past).toHaveCount(1);
      await expect(past.locator("[data-date-word]")).toHaveText("Vin");
    });

    test("no past list when nothing is unsaved", async({ page }) => {
      await loginAs(page);
      await page.route("**/api/portal/coach/today*", (route) => route.fulfill({ json: { date: "2026-11-05", today: "2026-11-05", groups: [], lessons: [], todo: [], next: null, week: { groupsHeld: 0, groupsLeft: 0, lessonsHeld: 0, lessonsLeft: 0, missing: 0 } } }));
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Antrenamente azi" })).toBeVisible();
      await expect(page.getByText("Nicio ședință azi.")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Prezență de completat" })).toHaveCount(0);
    });
  });
}

test.describe("Azi layout", () => {
  test.use({ timezoneId: "Europe/Bucharest" });

  test("phone: the brand row and the lesson button", async({ page }) => {
    await page.setViewportSize(SIZES[0]);
    await loginAs(page);
    await page.goto("/");
    const head = page.locator("[data-page-header]");
    await expect(head.getByText("CLUBUL SPORTIV")).toBeVisible();
    await expect(head.getByText("EDUSPORT", { exact: true })).toBeVisible();
    const button = page.getByRole("link", { name: "+ Adaugă antrenament" }).locator("visible=true");
    await expect(button).toHaveCount(1);
  });
});

for (const size of SIZES) {
  test.describe(`Grupe ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("sections, date blocks, rows and links", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Grupe");
      await expect(page.getByText("2 grupe, 13 copii").locator("visible=true")).toBeVisible();
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
    });
  });
}

test("a group without a next class keeps the row aligned with an empty date block", async({ page }) => {
  await page.route("**/api/portal/coach/groups", (route) => route.fulfill({
    json: { mine: [{ groupId: "gavansati", name: "Avansați", kind: "club", program: ["Ma, Mi 18:15"], children: 9, next: null }], others: [] },
  }));
  await loginAs(page);
  await page.goto("/grupe");
  const first = page.getByRole("link", { name: /Avansați/ });
  await expect(first).toBeVisible();
  await expect(first.locator("[data-date-empty]")).toHaveCount(1);
  await expect(first.locator("[data-date-word]")).toHaveCount(0);
  await first.locator("[data-date-empty]").hover();
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await expect(page.getByText("Următorul antrenament")).toHaveCount(0);
});

test("a date block with a next class shows its tooltip on hover", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.getByRole("link", { name: /Avansați/ }).locator("[data-date-block]").hover();
  await expect(page.getByRole("tooltip")).toHaveText("Următorul antrenament");
});

test("the same tooltip shows on keyboard focus", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe");
  await page.getByRole("link", { name: /Avansați/ }).locator("[data-date-block]").focus();
  await expect(page.getByRole("tooltip")).toHaveText("Următorul antrenament");
});

for (const size of SIZES) {
  test.describe(`Grupă ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("info card, actions, tabs and the member rows", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Avansați");
      await expect(page.getByRole("link", { name: "‹ Grupe" })).toHaveAttribute("href", "/grupe");
      const card = page.locator("[data-group-info] > div");
      await expect(card).toContainText("Program: Ma, Mi 18:15");
      await expect(card).toContainText("Loc: AFI Cotroceni");
      await expect(card).toContainText("Antrenori: Andrei Popa");
      await expect(card.locator("b")).toHaveText(["Program:", "Loc:", "Antrenori:"]);
      const presence = page.getByRole("link", { name: "Fă prezența" });
      await expect(presence).toHaveCount(1);
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
      if (size.width >= 900) await expect(page.locator("[data-page-header]").getByRole("link")).toHaveCount(1);
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

test("other group: banner, names and ages read only, stand-in today", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/guscat");
  await expect(page.getByText("Grupa altui antrenor")).toBeVisible();
  await expect(page.getByText("Program: Lu, Jo 17:00")).toBeVisible();
  await expect(page.getByRole("link", { name: "Înlocuiesc azi" })).toBeVisible();
  await expect(page.getByText("Ioana Diaconu")).toBeVisible();
  await expect(page.getByText("12 ani")).toBeVisible();
  await expect(page.locator("a[href^='/sportiv/']")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Mută" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Scoate" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Modifică grupa" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "+ Adaugă sportiv" })).toHaveAttribute("href", "/grupe/guscat/sportiv-nou");
});

test("other group without a class today: the stand-in sheet lists the recent slots", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gsilver");
  await expect(page.getByRole("link", { name: "Înlocuiesc azi" })).toHaveCount(0);
  await page.getByRole("button", { name: "Fă prezența ca înlocuitor" }).click();
  const rows = page.getByRole("dialog").getByRole("link");
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toHaveAttribute("href", "/prezenta?occurrence=occ%3Agsilver%3A2026-11-05&from=grupa");
});

test("an unknown group shows the load error", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/nu-exista");
  await expect(page.getByText("Nu am putut încărca datele.")).toBeVisible();
});

test("a group with no weekly schedule shows no leading comma and an empty date block", async({ page }) => {
  await loginAs(page);
  await mockState({ unscheduledGroup: true });
  await page.goto("/grupe");
  const row = page.getByRole("link", { name: /Fără program/ });
  await expect(row).toContainText("18 copii");
  await expect(row.locator("[data-date-empty]")).toHaveCount(1);
  const text = (await row.innerText()).replace(/\s+/g, " ");
  expect(text).not.toMatch(/, 18 copii|^,/);
  expect(text).toContain("Fără program");
  await expect(row.getByText("18 copii", { exact: true })).toBeVisible();
});

test.describe("Azi week column", () => {
  test.use({ timezoneId: "Europe/Bucharest" });

  test("desktop: Azi pe scurt heading, next row link, week values", async({ page }) => {
    await page.setViewportSize(SIZES[1]);
    await loginAs(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Azi pe scurt" })).toBeVisible();
    const nextRow = page.getByRole("heading", { name: "Următorul antrenament" }).locator("xpath=../following-sibling::*[1]//a");
    // 14:00 Bucharest: the 15:00 lesson of Matei Radu is the first one after now.
    await expect(nextRow).toContainText("Matei Radu");
    await expect(nextRow.locator("[data-date-time]")).toHaveText("15:00");
    await expect(nextRow.locator("[data-date-word]")).toHaveText("Joi");
    await expect(nextRow.locator("[data-date-num]")).toHaveText("5");
    await expect(nextRow).toHaveAttribute("href", "/lectie/ldone");
    await expect(page.getByText("Ședințe de grup", { exact: true }).locator("xpath=following-sibling::*[1]")).toHaveText("3 ținute, 3 rămase");
    await expect(page.getByText("Lecții individuale", { exact: true }).locator("xpath=following-sibling::*[1]")).toHaveText(/^\d+ ținut(ă|e), \d+ rămas(ă|e)$/);
    await expect(page.getByText("Prezență necompletată", { exact: true }).locator("xpath=following-sibling::*[1]")).toHaveText("0");
  });

  test("no next: the section is hidden, the week stays; singular forms", async({ page }) => {
    await loginAs(page);
    await page.route("**/api/portal/coach/today*", (route) => route.fulfill({
      json: { date: "2026-11-05", today: "2026-11-05", groups: [], lessons: [], todo: [], next: null, week: { groupsHeld: 1, groupsLeft: 1, lessonsHeld: 0, lessonsLeft: 2, missing: 3 } },
    }));
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Următorul antrenament" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Săptămâna aceasta" })).toBeVisible();
    await expect(page.getByText("1 ținută, 1 rămasă")).toBeVisible();
    await expect(page.getByText("0 ținute, 2 rămase")).toBeVisible();
    await expect(page.getByText("Prezență necompletată", { exact: true }).locator("xpath=following-sibling::*[1]")).toHaveText("3");
  });

  test("a lesson as next links to its lesson page", async({ page }) => {
    await loginAs(page);
    await page.route("**/api/portal/coach/today*", (route) => route.fulfill({
      json: { date: "2026-11-05", today: "2026-11-05", groups: [], lessons: [], todo: [], next: { kind: "individual", date: "2026-11-06", startTime: "09:00", title: "Ana Stoica", location: null, occurrenceKey: null, lessonId: "l9" }, week: { groupsHeld: 0, groupsLeft: 0, lessonsHeld: 0, lessonsLeft: 1, missing: 0 } },
    }));
    await page.goto("/");
    const row = page.getByRole("link", { name: /Ana Stoica/ });
    await expect(row).toHaveAttribute("href", "/lectie/l9");
    await expect(row.locator("[data-date-time]")).toHaveText("09:00");
    await expect(row.locator("[data-date-word]")).toHaveText("Vin");
  });
});
