import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidation endpoint for Strapi webhooks.
 *
 * Strapi side (Settings → Webhooks → Create new webhook):
 *   URL:     https://<site>/api/revalidate
 *   Method:  POST
 *   Headers: x-revalidate-secret: <REVALIDATE_SECRET env var>
 *   Events:  entry.publish, entry.update, entry.delete, media.*
 *
 * Optionally pass `?path=/some/path` or `?tag=<tag>` on the URL to limit the
 * revalidation scope. With no params the homepage + key dynamic routes are
 * revalidated so the next visit fetches fresh data.
 */
const DEFAULT_PATHS = [
  "/",
  "/contact",
  "/inscrieri",
  "/cursuri",
  "/cursuri/program",
  "/cursuri/regulament",
  "/cursuri/evenimente",
  "/despre-noi",
  "/despre-noi/echipa",
  "/despre-noi/realizari",
  "/noutati",
];

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET not configured" },
      { status: 500 },
    );
  }

  const provided =
    req.headers.get("x-revalidate-secret") ??
    new URL(req.url).searchParams.get("secret");
  if (provided !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const tag = searchParams.get("tag");

  try {
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ ok: true, revalidated: { tag } });
    }
    if (path) {
      revalidatePath(path);
      return NextResponse.json({ ok: true, revalidated: { path } });
    }
    for (const p of DEFAULT_PATHS) revalidatePath(p);
    return NextResponse.json({ ok: true, revalidated: DEFAULT_PATHS });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
