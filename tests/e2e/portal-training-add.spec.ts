import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, MOCK_PORTAL, loginAs, mockReset, shot } from "./portal-helpers";

test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];
const NAVY = "rgb(14, 26, 60)";

/** The last body the mock saw for a write route, e.g. `lastBody("POST", "/groups/gavansati/program")`. */
async function lastBody(method: string, path: string): Promise<unknown> {
  const res = await fetch(`${MOCK_PORTAL}/__mock/log`);
  return ((await res.json()) as { requests: Record<string, unknown> }).requests[`${method} ${path}`];
}

async function typeDate(page: Page, label: string, ddmmyyyy: string): Promise<void> {
  const field = page.getByRole("group", { name: label });
  await field.getByRole("spinbutton").first().click();
  await page.keyboard.type(ddmmyyyy);
}

async function pick(page: Page, label: string, option: string): Promise<void> {
  await page.getByLabel(label, { exact: true }).click();
  await page.getByRole("menuitemradio", { name: option, exact: true }).click();
}

const submit = (page: Page, name = "Adaugă antrenamentul") => page.getByRole("button", { name });

for (const size of SIZES) {
  test.describe(`Antrenament nou ${size.width}`, () => {
    test.use({ baseURL: COACH_BASE, viewport: size, timezoneId: "Europe/Bucharest" });

    test("Azi links to the form", async({ page }) => {
      await loginAs(page);
      await page.goto("/");
      const add = page.getByRole("link", { name: "+ Adaugă antrenament" }).locator("visible=true");
      await expect(add).toHaveAttribute("href", "/antrenament/nou");
      await expect(page.getByText("+ Lecție individuală")).toHaveCount(0);
    });

    test("the group form: defaults, weekly summary, an end date and the body", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/antrenament/nou");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Antrenament nou");
      await expect(page.getByRole("link", { name: "‹ Azi" })).toHaveAttribute("href", "/");
      await expect(page.getByRole("button", { name: "Grup", exact: true })).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("button", { name: "Individual", exact: true })).toHaveAttribute("aria-pressed", "false");
      await page.getByLabel("Grupa", { exact: true }).click();
      await expect(page.getByRole("menuitemradio", { name: "Avansați" })).toBeVisible();
      await expect(page.getByRole("menuitemradio", { name: "Primii Pași" })).toHaveCount(0);
      await page.getByRole("menuitemradio", { name: "Avansați" }).click();
      await expect(page.getByLabel("Se repetă", { exact: true })).toContainText("Săptămânal");
      await expect(submit(page)).toBeDisabled();

      const days = page.getByRole("checkbox");
      await expect(days.filter({ hasText: "Jo" })).toHaveAttribute("aria-checked", "true");
      await days.filter({ hasText: "Ma" }).click();
      await page.getByLabel("Ora", { exact: true }).fill("17:30");
      await expect(page.getByLabel("Durată", { exact: true })).toContainText("60 min");
      await typeDate(page, "Din data", "11112026");
      await expect(page.getByText("Marți și joi, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului.")).toBeVisible();
      await pick(page, "Până la", "Alege data");
      await typeDate(page, "Data de sfârșit", "31032027");
      await expect(page.getByText("Marți și joi, 17:30, 60 min, din 11 noiembrie până pe 31 martie.")).toBeVisible();
      await shot(page, info, "antrenament-nou");

      // Square shapes.
      for (const el of [days.first(), submit(page)]) await expect(el).toHaveCSS("border-top-left-radius", "0px");
      await expect(days.filter({ hasText: "Ma" })).toHaveCSS("background-color", NAVY);
      const form = (await page.locator("[data-training-form]").boundingBox())!;
      if (size.width >= 900) expect(form.width).toBeLessThanOrEqual(560);

      await submit(page).click();
      await expect(page).toHaveURL(/\/grupe\/gavansati\?tab=program$/);
      await expect(page.getByText("Program adăugat.")).toBeVisible();
      expect(await lastBody("POST", "/groups/gavansati/program")).toEqual({
        repeat: true, freq: "weekly", days: ["tue", "thu"], startTime: "17:30", durationMin: 60, from: "2026-11-11", until: "2027-03-31",
      });
    });

    test("the side by side rows share a line (phone included)", async({ page }) => {
      await loginAs(page);
      await page.goto("/antrenament/nou");
      const y = async(text: string) => (await page.getByText(text, { exact: true }).locator("visible=true").first().boundingBox())!.y;
      expect(Math.abs((await y("Din data")) - (await y("Până la")))).toBeLessThan(2);
      expect(Math.abs((await y("Ora")) - (await y("Durată")))).toBeLessThan(2);
      await pick(page, "Se repetă", "Nu se repetă");
      expect(Math.abs((await y("Data")) - (await y("Ora")))).toBeLessThan(2);
    });

    test("Lunar says which week it uses", async({ page }) => {
      await loginAs(page);
      await page.goto("/antrenament/nou?grupa=gavansati");
      await pick(page, "Se repetă", "Lunar");
      await typeDate(page, "Din data", "11112026");
      await page.getByLabel("Ora", { exact: true }).fill("17:30");
      await expect(page.getByText("Săptămâna din lună se ia din \"Din data\": 11 noiembrie este a doua miercuri.")).toBeVisible();
      await expect(page.getByText("Lunar, în a doua miercuri a lunii, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului.")).toBeVisible();
      await submit(page).click();
      await expect(page).toHaveURL(/tab=program$/);
      expect(await lastBody("POST", "/groups/gavansati/program")).toMatchObject({ freq: "monthly", weekOfMonth: "second", days: ["wed"] });
    });

    test("a one-off class: summary, body and the program tab", async({ page }) => {
      await loginAs(page);
      await page.goto("/antrenament/nou?grupa=gavansati");
      await pick(page, "Se repetă", "Nu se repetă");
      await typeDate(page, "Data", "12112026");
      await page.getByLabel("Ora", { exact: true }).fill("18:30");
      await expect(page.getByText("Joi, 12 noiembrie, 18:30, o singură dată.")).toBeVisible();
      await submit(page).click();
      await expect(page).toHaveURL(/\/grupe\/gavansati\?tab=program$/);
      await expect(page.getByText("Ședință adăugată: 12 noiembrie.")).toBeVisible();
      expect(await lastBody("POST", "/groups/gavansati/program")).toEqual({ repeat: false, date: "2026-11-12", startTime: "18:30", durationMin: 60 });
    });

    test("a class held 3 days ago saves and opens its Prezență", async({ page }) => {
      await loginAs(page);
      await page.goto("/antrenament/nou?grupa=gavansati");
      await pick(page, "Se repetă", "Nu se repetă");
      await typeDate(page, "Data", "02112026");
      await page.getByLabel("Ora", { exact: true }).fill("18:15");
      await submit(page).click();
      await expect(page).toHaveURL(/\/prezenta\?/);
      await expect(page.getByText("Ședință adăugată: 2 noiembrie.")).toBeVisible();
      await expect(page.getByRole("link", { name: "Maria Ionescu" })).toBeVisible();
      expect(await lastBody("POST", "/groups/gavansati/program")).toEqual({ repeat: false, date: "2026-11-02", startTime: "18:15", durationMin: 60 });
    });

    test("a class 8 days back shows the server refusal and keeps the form", async({ page }) => {
      await loginAs(page);
      await page.goto("/antrenament/nou?grupa=gavansati");
      await pick(page, "Se repetă", "Nu se repetă");
      await typeDate(page, "Data", "28102026");
      await page.getByLabel("Ora", { exact: true }).fill("18:15");
      await submit(page).click();
      await expect(page.getByRole("alert").getByText("Cerere invalidă.")).toBeVisible();
      await expect(page).toHaveURL(/\/antrenament\/nou/);
      await expect(page.getByLabel("Ora", { exact: true })).toHaveValue("18:15");
    });

    test("an individual lesson: athlete, coach, body and the lesson page", async({ page }, info) => {
      await loginAs(page);
      await page.goto("/antrenament/nou");
      await page.getByRole("button", { name: "Individual", exact: true }).click();
      await page.getByLabel("Caută după nume").fill("Ana");
      await page.getByRole("button", { name: /Ana Stoica/ }).click();
      await expect(page.getByText("Andrei Popa (tu)")).toBeVisible();
      await pick(page, "Se repetă", "Nu se repetă");
      await typeDate(page, "Data", "12112026");
      await page.getByLabel("Ora", { exact: true }).fill("18:30");
      await pick(page, "Durată", "45 min");
      await expect(page.getByText("Joi, 12 noiembrie, 18:30, o singură dată.")).toBeVisible();
      await shot(page, info, "antrenament-nou-individual");
      await submit(page).click();
      await expect(page).toHaveURL(/\/lectie\/lnew1$/);
      expect(await lastBody("POST", "/lessons")).toEqual({ athleteId: "aana", date: "2026-11-12", startTime: "18:30", durationMin: 45, coachIds: ["tm-andrei"] });
    });

    test("a clashing weekly series shows the refusal and keeps the values", async({ page }) => {
      await loginAs(page);
      await page.goto("/antrenament/nou?tip=individual");
      await page.getByLabel("Caută după nume").fill("Ana");
      await page.getByRole("button", { name: /Ana Stoica/ }).click();
      await typeDate(page, "Din data", "10112026");
      await page.getByLabel("Ora", { exact: true }).fill("17:00");
      await expect(page.getByRole("checkbox").filter({ hasText: "Ma" })).toHaveAttribute("aria-checked", "true");
      await submit(page).click();
      await expect(page.getByRole("alert").getByText("Sportivul are deja o lecție pe marți, 10 noi, la 17:00.")).toBeVisible();
      await expect(page).toHaveURL(/\/antrenament\/nou/);
      await expect(page.getByLabel("Ora", { exact: true })).toHaveValue("17:00");
      expect(await lastBody("POST", "/lessons")).toMatchObject({ repeat: { freq: "weekly", days: ["tue"], until: null }, date: "2026-11-10" });
    });

    test("a double tap on the button creates one lesson only", async({ page }) => {
      await loginAs(page);
      await page.goto("/antrenament/nou?tip=individual");
      await page.getByLabel("Caută după nume").fill("Maria");
      await page.getByRole("button", { name: /Maria Ionescu/ }).click();
      await pick(page, "Se repetă", "Nu se repetă");
      await page.getByLabel("Ora", { exact: true }).fill("16:00");
      await submit(page).dblclick();
      await expect(page).toHaveURL(/\/lectie\/lnew1$/);
      const log = (await (await fetch(`${MOCK_PORTAL}/__mock/log`)).json()) as { calls: { method: string; path: string }[] };
      expect(log.calls.filter((c) => c.method === "POST" && c.path.endsWith("/coach/lessons"))).toHaveLength(1);
    });

    test("a group preset and the old lesson address", async({ page }) => {
      await loginAs(page);
      await page.goto("/antrenament/nou?grupa=gavansati");
      await expect(page.getByRole("link", { name: "‹ Avansați" })).toHaveAttribute("href", "/grupe/gavansati?tab=program");
      await expect(page.getByRole("button", { name: "Grup", exact: true })).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByLabel("Grupa", { exact: true })).toContainText("Avansați");
      await page.goto("/lectie/noua");
      await expect(page).toHaveURL(/\/antrenament\/nou\?tip=individual$/);
      await expect(page.getByRole("button", { name: "Individual", exact: true })).toHaveAttribute("aria-pressed", "true");
    });
  });
}
