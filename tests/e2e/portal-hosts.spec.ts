import { expect, test } from "@playwright/test";

const COACH_BASE = "http://antrenor.localhost:3200";
// Node does not resolve *.localhost, so API requests reach the server on localhost with the coach Host header.
const AS_COACH = { headers: { host: "antrenor.localhost:3200" } };

test.describe("coach host", () => {
  test.use({ baseURL: COACH_BASE });

  test("robots.txt disallows everything", async({ request }) => {
    const res = await request.get("http://localhost:3200/robots.txt", AS_COACH);
    expect(await res.text()).toContain("Disallow: /");
  });

  test("pages are noindex and carry no site extras", async({ page }) => {
    const res = await page.goto("/");
    expect(res?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    await expect(page.locator("script[src*=\"umami\"]")).toHaveCount(0);
    await expect(page.locator("meta[name=\"robots\"][content*=\"noindex\"]")).toHaveCount(1);
  });

  test("an unknown URL shows the coach 404, not the site one", async({ page }) => {
    const res = await page.goto("/xyz/abc");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("Pagina nu există.")).toBeVisible();
    await expect(page.getByRole("banner")).toHaveCount(0);
  });

  test("site pages and sitemap answer 404", async({ request }) => {
    expect((await request.get("http://localhost:3200/sitemap.xml", AS_COACH)).status()).toBe(404);
    expect((await request.get("http://localhost:3200/cursuri", AS_COACH)).status()).toBe(404);
  });

  test("encoded traversal into the main site answers 404", async({ request }) => {
    for (const p of ["/..%2Fnoutati%2Fx", "/%2E%2E%2Fnoutati", "/..%5Cnoutati", "/..%252Fnoutati"]) {
      expect((await request.get(`http://localhost:3200${p}`, AS_COACH)).status(), p).toBe(404);
    }
  });
});

test.describe("main host", () => {
  test("an unknown URL shows the styled site 404 with the header", async({ page }) => {
    const res = await page.goto("/pagina-care-nu-exista");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("404");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByText("This page could not be found")).toHaveCount(0);
  });

  test("sitemap and robots still answer", async({ request }) => {
    expect((await request.get("/sitemap.xml")).status()).toBe(200);
    expect((await request.get("/robots.txt")).status()).toBe(200);
  });

  test("coach paths answer 404", async({ request }) => {
    expect((await request.get("/antrenor")).status()).toBe(404);
    expect((await request.post("/api/portal/auth/login", { data: {} })).status()).toBe(404);
  });

  test("site pages still serve", async({ request }) => {
    expect((await request.get("/cursuri/program")).status()).toBe(200);
  });
});
