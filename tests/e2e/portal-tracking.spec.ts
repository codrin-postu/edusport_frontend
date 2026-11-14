import { expect, test } from "@playwright/test";
import { mockReset } from "./portal-helpers";
import { SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";
type Recorded = { website: string; url: string; title: string; referrer: string };

// A stand-in for the Umami script: records what umami.track would send, with Umami's own default payload.
const STUB = `
  (function () {
    var id = document.currentScript.getAttribute("data-website-id");
    window.__umami = [];
    window.umami = { track: function (fn) {
      var base = { website: id, url: location.pathname + location.search, title: document.title, referrer: document.referrer };
      window.__umami.push(typeof fn === "function" ? fn(base) : base);
    } };
  })();
`;

test.use({ baseURL: SPORTIV_BASE });
test.beforeEach(async({ page }) => {
  await mockReset();
  await page.route("http://tracker.invalid/script.js", (route) => route.fulfill({ contentType: "text/javascript", body: STUB }));
});

const recorded = (page: import("@playwright/test").Page) => page.evaluate(() => (window as unknown as { __umami?: Recorded[] }).__umami ?? []);

test("a portal page view is sent as its route pattern, with no title or referrer", async({ page }) => {
  await loginSportiv(page);
  await page.goto(`/${ANA}/calendar`);
  await expect.poll(async() => (await recorded(page)).length).toBeGreaterThan(0);
  const views = await recorded(page);
  expect(views).toHaveLength(1);
  expect(views[0]).toEqual({ website: "test-sportiv", url: "/[athlete]/calendar", title: "", referrer: "" });

  await page.locator(`a[href$="/${ANA}/plati"]:visible`).first().click();
  await expect.poll(async() => (await recorded(page)).length).toBe(2);
  const all = await recorded(page);
  expect(all[1].url).toBe("/[athlete]/plati");
  for (const v of all) {
    const text = JSON.stringify(v);
    expect(text).not.toContain(ANA);
    expect(text).not.toContain("@");
    expect(text).not.toContain("?");
  }
});
