// Where to go after the password: only inside the wiki. Pure: loaded by Node tests.
const FALLBACK = "/ghid";

export function safeNext(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return FALLBACK;
  if (next !== "/ghid" && !next.startsWith("/ghid/") && !next.startsWith("/ghid?")) return FALLBACK;
  if (next.includes("//") || next.includes("\\")) return FALLBACK;
  const path = next.split(/[?#]/)[0];
  if (path === "/ghid/intra" || path.startsWith("/ghid/intra/")) return FALLBACK;
  if (path.split("/").some((s) => s === ".." || s === ".")) return FALLBACK;
  if (/%(2e|2f|5c)/i.test(next)) return FALLBACK;
  return next;
}
