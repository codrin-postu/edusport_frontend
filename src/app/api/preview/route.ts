import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Preview entry point — invoked by Strapi admin's Preview side panel.
 *
 * Strapi calls this URL with `?secret=...&documentId=...&status=draft|published`.
 * We:
 *   1. Validate the shared secret (env var STRAPI_PREVIEW_SECRET).
 *   2. Enable Next.js draft mode (sets a signed cookie that the preview
 *      page reads to know it's in preview context).
 *   3. Redirect to /noutati/preview/[documentId]?status=draft so the
 *      page can fetch + render the unpublished entry.
 *
 * Returning anything other than a redirect makes Strapi show the response
 * inline, which we don't want here — we always redirect.
 */

const PREVIEW_SECRET = process.env.STRAPI_PREVIEW_SECRET ?? "";
const IS_PROD = process.env.NODE_ENV === "production";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const documentId = searchParams.get("documentId");
  const status = searchParams.get("status");

  if (!documentId) {
    return new Response("Missing documentId", { status: 400 });
  }

  // In production we strictly require the secret to match — drafts must not
  // leak to anonymous visitors. In development we allow access without a
  // configured secret, so the integration works out-of-the-box with a fresh
  // checkout. (If the dev sets STRAPI_PREVIEW_SECRET locally and Strapi
  // sends a value, we still verify the match.)
  if (IS_PROD) {
    if (!PREVIEW_SECRET) {
      return new Response(
        "Preview not configured (STRAPI_PREVIEW_SECRET missing on frontend)",
        { status: 500 },
      );
    }
    if (secret !== PREVIEW_SECRET) {
      return new Response("Forbidden", { status: 403 });
    }
  } else if (PREVIEW_SECRET && secret !== PREVIEW_SECRET) {
    // Dev with a secret configured — still enforce, but the error message
    // tells the developer which side to fix.
    return new Response(
      `Forbidden: secret mismatch (frontend has STRAPI_PREVIEW_SECRET set, ` +
        `incoming secret param ${secret ? "differs" : "is missing"})`,
      { status: 403 },
    );
  }

  (await draftMode()).enable();

  const resolvedStatus = status === "published" ? "published" : "draft";
  redirect(`/noutati/preview/${encodeURIComponent(documentId)}?status=${resolvedStatus}`);
}
