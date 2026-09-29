import type { Page } from "@playwright/test";

export const WIDTHS = [390, 768, 1440] as const;

export const ROUTES = [
  "/",
  "/despre-noi",
  "/despre-noi/echipa",
  "/despre-noi/sportivi",
  "/despre-noi/realizari",
  "/cursuri",
  "/cursuri/program",
  "/cursuri/regulament",
  "/noutati",
  "/contact",
  "/parteneri",
  "/voluntariat",
  "/voluntariat/inscriere",
  "/inscrieri",
  "/protectia-datelor",
  "/pagina-care-nu-exista",
] as const;

/** First detail page under each list, read from the live list at test time. */
export async function discoverSlugs(page: Page, base: string): Promise<string[]> {
  const found: string[] = [];
  for (const [list, prefix] of [
    ["/despre-noi/sportivi", "/despre-noi/sportivi/"],
    ["/noutati", "/noutati/"],
  ] as const) {
    await page.goto(new URL(list, base).toString());
    const href = await page
      .locator(`a[href^="${prefix}"]`)
      .evaluateAll((as, p) => as.map((a) => a.getAttribute("href")).find((h) => h && h.length > p.length && !h.includes("/preview/")), prefix);
    if (href) found.push(href);
  }
  return found;
}

export function slugName(route: string): string {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "__");
}
