import { readFile } from "node:fs/promises";
import path from "node:path";
import { requireGhid } from "@/lib/ghid/require";

export const dynamic = "force-dynamic";

const ROOT = path.join(process.cwd(), "content", "ghid", "img");
const NOT_FOUND = () => new Response("Not found", { status: 404 });

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  // Outside the (wiki) layout, so it checks the cookie itself (the middleware is the first line).
  await requireGhid();
  const segments = (await params).path;
  // Every segment must be a plain name: no dots first (so no ".."), no separators, no NUL, no drive letters.
  if (segments.some((s) => s === "" || s.startsWith(".") || /[\\/\0:]/.test(s))) return NOT_FOUND();
  const last = segments[segments.length - 1];
  if (!last.endsWith(".jpg")) return NOT_FOUND();
  const file = path.resolve(ROOT, ...segments);
  if (!file.startsWith(ROOT + path.sep)) return NOT_FOUND();
  try {
    const data = await readFile(file);
    return new Response(new Uint8Array(data), { headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, max-age=86400" } });
  } catch {
    return NOT_FOUND();
  }
}
