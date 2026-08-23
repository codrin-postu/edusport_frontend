import type { Metadata } from "next";
import { fetchArticleBySlug, fetchArticles, strapiMediaUrl } from "@/lib/strapi-article";
import type { BlockNode, CategoryKey } from "@/lib/strapi-article";
import EventDetailPage from "./_View";

// Demo fallback so the page is viewable until Strapi is populated.
const DEMO_EVENT = {
  slug: "demo",
  title: "Spectacol de Crăciun 2025",
  category: "evenimente" as CategoryKey,
  date: "2025-12-15T10:00:00",
  eventDate: "2025-12-21T11:00:00",
  location: "Patinoarul Cotroceni On Ice, AFI Palace Cotroceni",
  coverImage: "/images/courses.png",
  excerpt: "Spectacolul anual de Crăciun al Școlii de Patinaj EduSport.",
  admissionInfo: "Intrare liberă",
  tags: ["Spectacol", "Crăciun"],
  body: [
    { type: "paragraph", children: [
      { type: "text", text: "Vă invităm cu drag la cel mai așteptat eveniment al sezonului. Cursanții din " },
      { type: "text", text: "toate grupele", bold: true },
      { type: "text", text: " vor urca pe gheață pentru o demonstrație specială de patinaj artistic." },
    ] },
    { type: "heading", level: 2, children: [{ type: "text", text: "Program" }] },
    { type: "paragraph", children: [{ type: "text", text: "Spectacolul începe la ora 11:00 și durează aproximativ 90 de minute, cu o pauză scurtă la mijloc." }] },
    { type: "list", format: "unordered", children: [
      { type: "list-item", children: [{ type: "text", text: "Deschiderea oficială și cuvântul antrenorilor" }] },
      { type: "list-item", children: [{ type: "text", text: "Demonstrații pe grupe de nivel" }] },
      { type: "list-item", children: [{ type: "text", text: "Numărul special al grupei de performanță" }] },
    ] },
    { type: "quote", children: [{ type: "text", text: "Intrarea este gratuită pentru familiile cursanților. Locurile în tribune sunt limitate." }] },
    { type: "paragraph", children: [
      { type: "text", text: "Mai multe detalii găsiți în " },
      { type: "link", url: "/cursuri/regulament", children: [{ type: "text", text: "regulamentul evenimentelor" }] },
      { type: "text", text: "." },
    ] },
    { type: "heading", level: 3, children: [{ type: "text", text: "Cum ajungi" }] },
    { type: "paragraph", children: [{ type: "text", text: "Patinoarul se află la etajul 2 al AFI Palace Cotroceni, cu acces facil cu metroul și autobuzul." }] },
    { type: "image", image: { url: "/uploads/demo.png", alternativeText: "Spectacol pe gheață", caption: "Ediția de anul trecut a spectacolului." } },
  ] as unknown as BlockNode[],
};

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
    strapiArticle = null;
  }

  // Demo fallback until Strapi has events.
  if (!strapiArticle) return <EventDetailPage event={{ ...DEMO_EVENT, slug }} />;

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
