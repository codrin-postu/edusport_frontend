import { test, expect, type Locator, type Page } from "@playwright/test";

// Pins the computed styles of the shared form and button components on the
// PUBLIC site, so the portal theme tokens can never change them. Runs against
// the mock Strapi (it serves /inscrieri and /contact).

// NOTE: the authored border width is 1.5px, but Chromium snaps computed border
// widths to whole CSS pixels (verified at device scale factors 1 to 4), so it
// reads back as "1px" here. The 1.5px itself is pinned by the WebKit screenshots.
test.use({ viewport: { width: 1280, height: 900 } });

const DRAFT_KEY = "edusport.inscrieri.draft.v2";

function css(locator: Locator, props: string[]): Promise<Record<string, string>> {
  return locator.evaluate((el, names) => {
    const cs = getComputedStyle(el);
    const out: Record<string, string> = {};
    for (const n of names) out[n] = cs.getPropertyValue(n);
    return out;
  }, props);
}

async function seedStep3(page: Page) {
  const draft = JSON.stringify({
    step: 2,
    savedAt: Date.now(),
    answers: {
      email: "ana.pop@example.com", parentName: "Ana Pop", relationship: "parinte", phone: "0712345678",
      childName: "Maria Pop", childBirthDate: "14.03.2016", childHeight: "132", shirtSize: "S",
      lastSeason: "Nu a participat", priorExperience: "Nu este cazul", expectations: "Să patineze",
      membershipAnswer: "nu", subscriptionChoice: "Abonament 8 ședințe grup", source: "Facebook", gdprConsent: true, regulationsConsent: true,
    },
  });
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [DRAFT_KEY, draft]);
  await page.reload();
}

test("/inscrieri: input, label, button, checkbox, focus ring", async({ page }) => {
  await page.goto("/inscrieri?scoala=afi-cotroceni");
  await expect(page.getByText("Pasul 1 din 3")).toBeVisible();

  // input: the first text input of the form, #email
  const input = page.locator("#email");
  expect(await css(input, ["border-top-width", "border-top-color", "padding-left", "font-size", "height"])).toEqual({
    "border-top-width": "1px",
    "border-top-color": "rgb(14, 26, 60)",
    "padding-left": "16px",
    "font-size": "14px",
    height: "48px",
  });

  // label: label[for=email]
  const label = page.locator("label[for=email]");
  expect(await css(label, ["font-size", "font-weight", "text-transform", "letter-spacing", "color"])).toEqual({
    "font-size": "12px",
    "font-weight": "600",
    "text-transform": "uppercase",
    "letter-spacing": "1.68px",
    color: "rgb(73, 82, 105)",
  });

  // keyboard focus on #email: press Tab until it is focused
  await page.locator("body").click({ position: { x: 1, y: 1 } });
  for (let i = 0; i < 40; i++) {
    if (await input.evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press("Tab");
  }
  await expect(input).toBeFocused();
  expect(await css(input, ["outline-color", "outline-offset"])).toEqual({
    "outline-color": "rgb(14, 26, 60)",
    "outline-offset": "3px",
  });

  // step 3 holds the enabled submit button, the consent checkboxes and the consent link
  await seedStep3(page);
  await expect(page.getByText("Pasul 3 din 3")).toBeVisible();
  // primary button: the enabled "Trimite înscrierea" [data-button] (step 3) and its .lcta-face / .lcta-layer spans
  const button = page.locator("[data-button]", { hasText: "Trimite înscrierea" });
  const face = button.locator(".lcta-face");
  expect(await css(face, ["background-color", "border-top-width", "box-shadow", "font-size", "text-transform"])).toEqual({
    "background-color": "rgb(0, 0, 0)",
    "border-top-width": "1px",
    "box-shadow": "none",
    "font-size": "13px",
    "text-transform": "uppercase",
  });
  const layers = button.locator(".lcta-layer");
  expect(await layers.count()).toBeGreaterThan(0);
  for (const display of await layers.evaluateAll((els) => els.map((e) => getComputedStyle(e).display))) {
    expect(display).toBe("block");
  }

  // checkbox: the 20px wrapper of #gdprConsent and its visible box (span[aria-hidden])
  const box = page.locator("label[for=gdprConsent] > span").first();
  const dims = await box.evaluate((el) => ({ w: getComputedStyle(el).width, h: getComputedStyle(el).height }));
  expect(dims).toEqual({ w: "20px", h: "20px" });
  const visibleBox = box.locator("span[aria-hidden]").first();
  expect((await css(visibleBox, ["border-top-width"]))["border-top-width"]).toBe("1px");

  // .link: the first link in the consent text on step 3 (/contact renders a .link only after a send)
  const link = page.locator("label[for=gdprConsent] a.link").first();
  await expect(link).toBeAttached();
  expect(await css(link, ["font-weight", "background-size"])).toEqual({
    "font-weight": "600",
    "background-size": "100% 2px",
  });
});

test("no element has data-theme", async({ page }) => {
  for (const url of ["/inscrieri?scoala=afi-cotroceni", "/contact"]) {
    await page.goto(url);
    await expect(page.locator("[data-theme]")).toHaveCount(0);
  }
});

test("page background", async({ page }) => {
  await page.goto("/inscrieri?scoala=afi-cotroceni");
  // The cream canvas is on html; body itself is navy (the footer reveal).
  expect(await page.locator("html").evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(251, 248, 241)");
  expect(await page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(14, 26, 60)");
});
