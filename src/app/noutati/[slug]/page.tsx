import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchArticles, strapiMediaUrl } from "@/lib/strapi-article";
import { ARTICLES } from "../_data";
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
      image = article.coverImage ? strapiMediaUrl(article.coverImage.url) : undefined;
    }
  } catch {
    const mock = ARTICLES.find((a) => a.slug === slug);
    if (mock) {
      title = mock.title;
      description = mock.description ?? "";
    }
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

  let article = null;

  try {
    const strapiArticle = await fetchArticleBySlug(slug);
    if (strapiArticle) {
      article = {
        slug: strapiArticle.slug,
        title: strapiArticle.title,
        description: strapiArticle.description ?? "",
        date: strapiArticle.date,
        category: strapiArticle.category,
        coverImage: strapiArticle.coverImage
          ? strapiMediaUrl(strapiArticle.coverImage.url)
          : "/images/courses_generated.png",
        body: strapiArticle.body ?? null,
      };
    }
  } catch {
    // fall back to mock data
  }

  // Fall back to mock data if Strapi is unavailable
  if (!article) {
    const mock = ARTICLES.find((a) => a.slug === slug);
    if (!mock) notFound();
    article = { ...mock, body: null };
  }

  return <ArticleDetailPage article={article} />;
}
