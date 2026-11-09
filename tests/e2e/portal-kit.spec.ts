import { test, expect, type Locator, type Page } from "@playwright/test";
import { COACH_BASE } from "./portal-helpers";

// Computed styles of every portal kit part on /kit-preview (coach host, no login), at phone and desktop width.
// The values come from the portal canvas spec; a failing value means a kit or theme-file bug, not a test edit.

const NAVY = "rgb(14, 26, 60)";
const WHITE = "rgb(255, 255, 255)";
const LINE = "rgb(221, 230, 243)";
const MUTED = "rgb(95, 101, 122)";
const ICE = "rgb(143, 184, 245)";
const ICE_LIGHT = "rgb(225, 236, 251)";
const ICE_BLUE = "rgb(74, 123, 208)";
const RED = "rgb(190, 51, 48)";

function css(locator: Locator, props: string[]): Promise<Record<string, string>> {
  return locator.evaluate((el, names) => {
    const cs = getComputedStyle(el);
    const out: Record<string, string> = {};
    for (const n of names) out[n] = cs.getPropertyValue(n);
    return out;
  }, props);
}

const kit = (page: Page, name: string): Locator => page.locator(`[data-kit="${name}"]`);

for (const size of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
  const phone = size.width === 390;

  test.describe(`kit preview at ${size.width}`, () => {
    test.use({ baseURL: COACH_BASE, viewport: size });
    test.beforeEach(async({ page }) => {
      await page.goto("/kit-preview");
      await expect(kit(page, "Field")).toBeVisible();
    });

    test("page and theme", async({ page }) => {
      await expect(page.locator("body")).toHaveAttribute("data-theme", "portal");
      expect((await css(page.locator("body"), ["background-color"]))["background-color"]).toBe("rgb(246, 249, 253)");
    });

    test("input, label, hint and select", async({ page }) => {
      const input = kit(page, "Field").locator("input");
      expect(await css(input, ["border-top-width", "border-top-color", "background-color", "height", "padding-left", "font-size"])).toEqual({
        "border-top-width": "1px", "border-top-color": "rgb(185, 198, 218)", "background-color": WHITE, height: "48px", "padding-left": "14px", "font-size": "15px",
      });
      const label = await css(kit(page, "Field").locator("label"), ["font-size", "font-weight", "text-transform", "letter-spacing", "color"]);
      expect(label).toMatchObject({ "font-size": "14px", "font-weight": "700", "text-transform": "none", color: NAVY });
      expect(["normal", "0px"]).toContain(label["letter-spacing"]);
      expect(await css(kit(page, "Field").locator("p"), ["font-size", "color"])).toEqual({ "font-size": "13px", color: MUTED });

      const trigger = kit(page, "Select").locator("button[aria-haspopup=listbox]");
      expect(await css(trigger, ["border-top-width", "border-top-color", "background-color", "height", "padding-left", "font-size"])).toEqual({
        "border-top-width": "1px", "border-top-color": "rgb(185, 198, 218)", "background-color": WHITE, height: "48px", "padding-left": "14px", "font-size": "15px",
      });
      expect(await trigger.locator("use").getAttribute("href")).toContain("portal-chevron-down");
    });

    test("buttons", async({ page }) => {
      const group = kit(page, "Button");
      const face = group.locator(".lcta-face");
      expect(await css(face, ["background-color", "color", "border-top-width", "box-shadow", "font-size", "font-weight", "text-transform", "padding-left", "height"])).toEqual({
        "background-color": NAVY, color: WHITE, "border-top-width": "2px", "box-shadow": "rgba(14, 26, 60, 0.16) 8px 8px 0px 0px",
        "font-size": "15px", "font-weight": "700", "text-transform": "none", "padding-left": "20px", height: "48px",
      });
      for (const layer of await group.locator(".lcta-layer").all()) expect((await css(layer, ["display"])).display).toBe("none");
      expect(await css(group.locator("button:not(.lcta)"), ["background-color", "border-top-width", "border-top-color"])).toEqual({
        "background-color": WHITE, "border-top-width": "2px", "border-top-color": NAVY,
      });
    });

    test("checkbox", async({ page }) => {
      const boxes = kit(page, "Checkbox").locator("label > span.relative");
      for (const box of await boxes.all()) expect(await css(box, ["width", "height"])).toEqual({ width: "44px", height: "44px" });
      const first = kit(page, "Checkbox").locator("label").nth(0).locator("span[aria-hidden]");
      const second = kit(page, "Checkbox").locator("label").nth(1).locator("span[aria-hidden]");
      expect(await css(first, ["border-top-width", "background-color"])).toEqual({ "border-top-width": "2px", "background-color": NAVY });
      expect(await css(second, ["border-top-width", "border-top-color"])).toEqual({ "border-top-width": "2px", "border-top-color": "rgb(185, 198, 218)" });
      expect((await css(kit(page, "Checkbox").locator("label").nth(0).locator("svg"), ["width"])).width).toBe("20px");
    });

    test("focus ring, link, caps label, card", async({ page }) => {
      const input = kit(page, "Field").locator("input");
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        if (await input.evaluate((el) => el === document.activeElement)) break;
      }
      expect(await css(input, ["outline-color", "outline-offset"])).toEqual({ "outline-color": ICE_BLUE, "outline-offset": "2px" });

      const link = kit(page, "Link").locator("a").first();
      expect(await css(link, ["font-weight", "background-size"])).toEqual({ "font-weight": "700", "background-size": "100% 0px" });
      await link.hover();
      expect(await css(link, ["text-decoration-line", "color"])).toEqual({ "text-decoration-line": "underline", color: NAVY });

      expect((await css(kit(page, "Dialog").locator(".text-label"), ["text-transform"]))["text-transform"]).toBe("uppercase");
      expect(await css(kit(page, "Card").locator("> *").first(), ["border-top-width", "border-top-color"])).toEqual({ "border-top-width": "1px", "border-top-color": LINE });
    });

    test("dialog", async({ page }) => {
      await page.getByRole("button", { name: "Deschide dialogul" }).click();
      const content = page.getByRole("dialog");
      await expect(content).toBeVisible();
      expect(await css(content, ["background-color", "padding-left"])).toEqual({ "background-color": WHITE, "padding-left": "20px" });
      expect((await css(content.locator("h2"), ["font-size"]))["font-size"]).toBe("22px");
      expect((await css(page.locator("div.bg-overlay"), ["background-color"]))["background-color"]).toBe("rgba(14, 26, 60, 0.45)");
    });

    test("sheet", async({ page }) => {
      await page.getByRole("button", { name: "Deschide foaia" }).click();
      const content = page.getByRole("dialog");
      await expect(content).toBeVisible();
      expect(await css(content, ["background-color", "padding-left", "border-top-width"])).toEqual({ "background-color": WHITE, "padding-left": "20px", "border-top-width": "1px" });
      expect(await page.locator("[aria-hidden] .h-1.w-12").count()).toBe(0);
      if (!phone) expect((await css(content, ["width"])).width).toBe("460px");
    });

    test("list row, date block, end block, status block, tag", async({ page }) => {
      const list = kit(page, "ListCard");
      const rows = list.locator(".divide-y > a");
      expect((await css(rows.first(), ["min-height"]))["min-height"]).toBe("76px");
      expect(await css(list.getByText("Intermediari Bronze", { exact: true }), ["font-size", "font-weight"])).toEqual({ "font-size": "15px", "font-weight": "700" });
      expect(await css(list.getByText("grup, 14 copii, AFI Cotroceni", { exact: true }), ["font-size", "color"])).toEqual({ "font-size": "13px", color: MUTED });
      expect((await css(rows.nth(1), ["border-top-color"]))["border-top-color"]).toBe(LINE);
      expect((await css(rows.first().locator("> span").last(), ["width"])).width).toBe("44px");

      const block = list.locator("[data-date-block]").first();
      expect(await css(block, ["width", "height", "border-radius", "background-color"])).toEqual({ width: "52px", height: "52px", "border-radius": "6px", "background-color": ICE_LIGHT });
      expect(await css(block.locator("[data-date-word]"), ["color", "font-size", "text-transform"])).toEqual({ color: RED, "font-size": "11px", "text-transform": "uppercase" });
      const num = await css(block.locator("[data-date-num]"), ["font-size", "font-family"]);
      expect(num["font-size"]).toBe("22px");
      expect(num["font-family"]).toContain("League Spartan");

      expect(await css(list.locator("[data-end-block]").first(), ["width", "background-color", "font-size", "font-weight"])).toEqual({ width: "96px", "background-color": NAVY, "font-size": "11px", "font-weight": "800" });
      const status = list.locator("[data-status-block]").first();
      expect(await css(status, ["width", "background-color"])).toEqual({ width: "64px", "background-color": ICE_BLUE });
      await expect(status).toHaveAttribute("aria-label", "Individual, completat");
      expect(await css(list.locator("[data-individual-tag]"), ["background-color", "font-size", "text-transform"])).toEqual({ "background-color": "rgb(17, 17, 17)", "font-size": "11px", "text-transform": "none" });
    });

    test("stat card, segmented, save bar", async({ page }) => {
      expect(await css(page.locator("[data-stat-num]"), ["font-size", "color"])).toEqual({ "font-size": "88px", color: ICE });
      const group = kit(page, "Segmented").locator("[role=group]");
      expect((await css(group, ["border-top-width"]))["border-top-width"]).toBe("2px");
      const buttons = group.locator("button");
      expect(await css(buttons.first(), ["height", "font-size", "font-weight", "background-color"])).toEqual({ height: "44px", "font-size": "14px", "font-weight": "700", "background-color": NAVY });
      expect((await css(buttons.nth(1), ["background-color"]))["background-color"]).toBe(WHITE);
      expect((await css(page.locator("[data-save-bar]"), ["border-top-color"]))["border-top-color"]).toBe(LINE);
      expect((await css(page.locator("[data-save-count]"), ["font-size"]))["font-size"]).toBe("20px");
    });

    test("month grid and competition card", async({ page }) => {
      const cells = kit(page, "MonthGrid").locator("[role=group] button");
      await expect(cells).toHaveCount(30);
      expect((await css(cells.first(), ["height"])).height).toBe("48px");
      const summary = kit(page, "CompetitionCard").locator("summary");
      await expect(summary).toBeVisible();
      await expect(kit(page, "CompetitionCard").locator("[data-comp-member]")).toHaveCount(2);
      expect((await css(kit(page, "CompetitionCard").locator("[data-comp-count]"), ["width"])).width).toBe("96px");
    });

    test("shell", async({ page }) => {
      const h1 = page.locator("h1");
      await expect(h1).toHaveCount(1);
      const header = page.locator("[data-page-header]");
      const nav = page.locator("[data-bottom-nav]");
      const side = page.locator("[data-sidebar]");
      if (phone) {
        await expect(nav).toBeVisible();
        await expect(side).toBeHidden();
        expect(await css(nav, ["background-color", "border-radius"])).toEqual({ "background-color": NAVY, "border-radius": "18px" });
        await expect(nav.locator("a")).toHaveCount(5);
        expect(await css(nav.locator("[aria-current=page]"), ["background-color", "border-radius"])).toEqual({ "background-color": ICE, "border-radius": "13px" });
        expect((await css(h1, ["font-size"]))["font-size"]).toBe("30px");
        expect((await css(header, ["background-color"]))["background-color"]).toBe("rgba(0, 0, 0, 0)");
      } else {
        await expect(side).toBeVisible();
        await expect(nav).toBeHidden();
        expect(await css(side, ["width", "background-color"])).toEqual({ width: "240px", "background-color": NAVY });
        expect((await css(side.locator("nav a:not([aria-current])").first(), ["color"])).color).toBe("rgb(201, 214, 238)");
        expect((await css(side.locator("[aria-current=page]"), ["background-color"]))["background-color"]).toBe(ICE);
        expect((await css(h1, ["font-size"]))["font-size"]).toBe("40px");
        expect((await css(header, ["background-color"]))["background-color"]).toBe(ICE_LIGHT);
        expect((await css(page.locator("[data-page-body]"), ["max-width"]))["max-width"]).toBe("1200px");
      }
    });

    test("only the named elements are round, and no red text but the date word", async({ page }) => {
      const result = await page.evaluate(() => {
        const exceptions: [string, string][] = [["[data-bottom-nav]", "18px"], ["[data-bottom-nav] [aria-current=page]", "13px"], ["[data-date-block]", "6px"]];
        const wrongRadius: string[] = [];
        const red: string[] = [];
        for (const el of Array.from(document.body.querySelectorAll("*"))) {
          const cs = getComputedStyle(el);
          if (el.closest("[data-spinner]")) continue;
          const exception = exceptions.find(([selector]) => el.matches(selector));
          const expected = exception ? exception[1] : "0px";
          if (cs.borderRadius !== expected) wrongRadius.push(`${el.tagName}.${el.className}: ${cs.borderRadius}`);
          const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim() !== "");
          if (hasText && cs.color === "rgb(190, 51, 48)" && !el.closest("[data-date-word]")) red.push(el.tagName + ":" + el.textContent);
        }
        return { wrongRadius, red };
      });
      expect(result.wrongRadius).toEqual([]);
      expect(result.red).toEqual([]);
    });
  });
}

test("the kit preview is not served on the public host", async({ request }) => {
  const res = await request.get("http://localhost:3200/kit-preview");
  expect(res.status()).toBe(404);
});
