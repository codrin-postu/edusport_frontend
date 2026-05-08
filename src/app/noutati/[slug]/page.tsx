import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchArticleBySlug,
  fetchArticles,
  strapiMediaUrl,
} from "@/lib/strapi-article";
import ArticleDetailPage from "./_View";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const articles = await fetchArticles();
    return articles
      .filter((a) => a.category !== "evenimente")
      .map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let title = "Articol";
  let description = "";
  let image: string | undefined;

  try {
    const article = await fetchArticleBySlug(slug);
    if (article) {
      title = article.title;
      description = article.description ?? "";
      image = article.coverImage
        ? strapiMediaUrl(article.coverImage.url)
        : undefined;
    }
  } catch {
    // Strapi unavailable — keep generic metadata; the page itself will 404.
  }

  return {
    title,
    description,
    alternates: { canonical: `/noutati/${slug}` },
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

  const article = {
    slug: strapiArticle.slug,
    title: strapiArticle.title,
    description: strapiArticle.description ?? "",
    // Always the article's posted date — never overridden by eventDate.
    date: strapiArticle.date,
    category: strapiArticle.category,
    coverImage: strapiArticle.coverImage
      ? strapiMediaUrl(strapiArticle.coverImage.url)
      : "/images/courses_generated.png",
    body: strapiArticle.body ?? null,
    // Event-only metadata, surfaced separately in the sidebar.
    eventDate: strapiArticle.eventDate,
    eventLocation: strapiArticle.eventLocation,
    eventAdmissionInfo: strapiArticle.eventAdmissionInfo,
  };

  return <ArticleDetailPage article={article} />;
}
