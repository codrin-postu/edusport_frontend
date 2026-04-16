import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchArticles, strapiMediaUrl } from "@/lib/strapi-article";
import { CURRENT_EVENT, PAST_EVENTS } from "../_data";
import EventDetailPage from "./_View";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const events = await fetchArticles("evenimente");
    return events.map((e) => ({ slug: e.slug }));
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
    const all = [...(CURRENT_EVENT ? [CURRENT_EVENT] : []), ...PAST_EVENTS];
    const mock = all.find((e) => e.slug === slug);
    if (mock) {
      title = mock.title;
      description = mock.excerpt ?? "";
    }
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

  let event = null;

  try {
    const strapiArticle = await fetchArticleBySlug(slug);
    if (strapiArticle) {
      event = {
        slug: strapiArticle.slug,
        title: strapiArticle.title,
        date: strapiArticle.eventDate ?? strapiArticle.date,
        location: strapiArticle.eventLocation,
        coverImage: strapiArticle.coverImage
          ? strapiMediaUrl(strapiArticle.coverImage.url)
          : undefined,
        excerpt: strapiArticle.description ?? "",
        body: strapiArticle.body ?? null,
        admissionInfo: strapiArticle.eventAdmissionInfo,
      };
    }
  } catch {
    // fall back to mock data
  }

  // Fall back to mock data if Strapi unavailable
  if (!event) {
    const all = [...(CURRENT_EVENT ? [CURRENT_EVENT] : []), ...PAST_EVENTS];
    const mock = all.find((e) => e.slug === slug);
    if (!mock) notFound();
    event = { ...mock, body: null };
  }

  return <EventDetailPage event={event} />;
}
