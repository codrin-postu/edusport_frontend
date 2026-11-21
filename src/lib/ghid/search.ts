// Pure search over the wiki pages. No imports from the app: loaded by Node tests.
export type SearchDoc = { slug: string; title: string; group: string; text: string };

/** Lowercase, no diacritics; Romanian comma-below and cedilla forms of s and t fold to plain s and t. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Every query word must occur in the page. Title matches come first, then reading order. Blank query: no results. */
export function searchDocs(docs: SearchDoc[], query: string, limit = 8): SearchDoc[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const hits: { doc: SearchDoc; inTitle: boolean; i: number }[] = [];
  docs.forEach((doc, i) => {
    const title = normalize(doc.title);
    const body = `${title}\n${normalize(doc.group)}\n${normalize(doc.text)}`;
    if (!words.every((w) => body.includes(w))) return;
    hits.push({ doc, inTitle: words.every((w) => title.includes(w)), i });
  });
  hits.sort((a, b) => Number(b.inTitle) - Number(a.inTitle) || a.i - b.i);
  return hits.slice(0, limit).map((h) => h.doc);
}
