import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import {
  fetchArticleByDocumentId,
  strapiMediaUrl,
} from "@/lib/strapi-article";
import ArticleDetailPage from "../../[slug]/_View";

/**
 * Strapi admin Preview destination. Renders an article by `documentId` in
 * either draft or published status, using the same _View component as the
 * production page so editors see an accurate WYSIWYG of what they're about
 * to publish.
 *
 * Auth: this page only renders when Next.js draft mode is enabled, which
 * happens via /api/preview after the shared secret has been validated.
 * Direct access without the cookie 404s.
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Draft-preview route: never index, even if draft mode were ever enabled for a
// crawler. (Direct hits already 404 without the draft cookie.)
export const metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ documentId: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const { isEnabled: draftEnabled } = await draftMode();
  if (!draftEnabled) {
    // Reject direct hits — the preview cookie must have been set by /api/preview.
    notFound();
  }

  const { documentId } = await params;
  const { status: statusParam } = await searchParams;
  const status = statusParam === "published" ? "published" : "draft";

  let strapiArticle = null;
  try {
    strapiArticle = await fetchArticleByDocumentId(documentId, status);
  } catch {
    notFound();
  }

  if (!strapiArticle) notFound();

  const article = {
    slug: strapiArticle.slug,
    title: strapiArticle.title,
    description: strapiArticle.description ?? "",
    date: strapiArticle.date,
    category: strapiArticle.category,
    coverImage: strapiArticle.coverImage
      ? strapiMediaUrl(strapiArticle.coverImage.url)
      : "/images/courses_generated.png",
    body: strapiArticle.body ?? null,
    gallery: strapiArticle.gallery,
    video: strapiArticle.video,
    eventDate: strapiArticle.eventDate,
    eventLocation: strapiArticle.eventLocation,
    eventAdmissionInfo: strapiArticle.eventAdmissionInfo,
  };

  return (
    <>
      {/* Draft banner — fixed across the very top, ABOVE the site header
          (which is `fixed top-0 z-[100]`). Uses z-[9999] so it stays
          visible no matter how the layout reshuffles. The spacer div below
          reserves matching vertical space so the article isn't clipped by
          the banner. */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background:
            status === "draft" ? "#d9822f" : "#328048", // amber for draft, green for published preview
          color: "#fff",
          textAlign: "center",
          padding: "6px 12px",
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        Previzualizare {status === "draft" ? "DRAFT" : "PUBLICAT"} — modificările nu sunt vizibile pe site
      </div>
      {/* Push the article down by the banner height so the header still
          sits in its normal position below it. */}
      <div aria-hidden style={{ height: 28 }} />
      <ArticleDetailPage article={article} />
    </>
  );
}
