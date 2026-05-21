import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchArticles, strapiMediaUrl } from "@/lib/strapi-article";
import EventDetailPage from "./_View";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    // Both "evenimente" and "competitii" surface on the events listing,
    // so prebuild detail pages for both.
    const [evenimente, competitii] = await Promise.all([
      fetchArticles("evenimente"),
      fetchArticles("competitii"),
    ]);
    return [...evenimente, ...competitii].map((e) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let title = "Eveniment";
  let description = "";
  let image: string | undefined;

  try {
    const article = await fetchArticleBySlug(slug);
    if (article) {
      title = article.title;
      description = article.description ?? "";
      image = article.coverImage ? strapiMediaUrl(article.coverImage.url) : undefined;
    }
  } catch {
    // Strapi unavailable — keep generic metadata; the page itself will 404.
  }

  return {
    title,
    description,
    alternates: { canonical: `/cursuri/evenimente/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  let strapiArticle = null;
  try {
    strapiArticle = await fetchArticleBySlug(slug);
  } catch {
    notFound();
  }

  if (!strapiArticle) notFound();

  const event = {
    slug: strapiArticle.slug,
    title: strapiArticle.title,
    // The actual article category — drives meta-row + sidebar labels.
    category: strapiArticle.category,
    // Posted date (used in the meta row above the title).
    date: strapiArticle.date,
    // Event datetime (used in the sidebar + EventJsonLd startDate).
    eventDate: strapiArticle.eventDate,
    location: strapiArticle.eventLocation,
    coverImage: strapiArticle.coverImage
      ? strapiMediaUrl(strapiArticle.coverImage.url)
      : "/images/courses_generated.png",
    excerpt: strapiArticle.description ?? "",
    body: strapiArticle.body ?? null,
    admissionInfo: strapiArticle.eventAdmissionInfo,
  };

  return <EventDetailPage event={event} />;
}
