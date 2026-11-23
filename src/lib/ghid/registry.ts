// Pure helpers over the wiki content tree. No imports from the app: loaded by Node tests.
import type { GhidGroup, GhidPage } from "./types.ts";

export type OrderedPage = { page: GhidPage; group: string };

export function orderedPages(groups: GhidGroup[]): OrderedPage[] {
  return groups.flatMap((g) => g.pages.map((page) => ({ page, group: g.title })));
}

/** An undefined slug is the first page (the /ghid home). */
export function findPage(groups: GhidGroup[], slug: string | undefined): GhidPage | undefined {
  const all = orderedPages(groups);
  if (slug === undefined) return all[0]?.page;
  return all.find((o) => o.page.slug === slug)?.page;
}

export function findEntry(groups: GhidGroup[], slug: string | undefined): OrderedPage | undefined {
  const all = orderedPages(groups);
  if (slug === undefined) return all[0];
  return all.find((o) => o.page.slug === slug);
}

export function neighbours(groups: GhidGroup[], slug: string): { prev?: GhidPage; next?: GhidPage } {
  const all = orderedPages(groups);
  const i = all.findIndex((o) => o.page.slug === slug);
  if (i < 0) return {};
  return { prev: all[i - 1]?.page, next: all[i + 1]?.page };
}

export function stripMarkup(text: string): string {
  return text.replace(/\*\*/g, "");
}

/** Title, lead and every block text, markup stripped: what search indexes. */
export function pageText(page: GhidPage): string {
  const parts: string[] = [page.title, page.lead];
  for (const b of page.blocks) {
    switch (b.t) {
      case "p":
      case "h2":
      case "warn":
      case "code":
        parts.push(b.text);
        break;
      case "list":
        parts.push(...b.items);
        break;
      case "steps":
        parts.push(...b.steps.flatMap((s) => (s.code ? [s.text, s.code] : [s.text])));
        break;
      case "links":
        parts.push(...b.items.flatMap((i) => (i.label ? [i.label] : [])));
        break;
      case "video":
        break;
    }
  }
  return parts.map(stripMarkup).join("\n");
}
