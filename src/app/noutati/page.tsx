import type { Metadata } from "next";
import NoutatiPage from "./_View";
import { fetchArticlesPaginated, strapiMediaUrl } from "@/lib/strapi-article";
import type { StrapiArticle } from "@/lib/strapi-article";
import type { CategoryKey } from "./_data";

export const metadata: Metadata = {
  title: "Noutăți",
  description:
    "Ultimele noutăți de la școala de patinaj EduSport. Anunțuri, evenimente, competiții și sfaturi utile.",
  alternates: { canonical: "/noutati" },
  openGraph: {
    title: "Noutăți | EduSport",
    description:
      "Ultimele noutăți de la școala de patinaj EduSport.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

export const revalidate = 300;

const PAGE_SIZE = 6;

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
}

function mapStrapiArticle(a: StrapiArticle) {
  return {
    slug: a.slug,
    title: a.title,
    description: a.description ?? "",
    date: a.date,
    category: a.category,
    coverImage: a.coverImage ? strapiMediaUrl(a.coverImage.url) : "/images/courses_generated.png",
    body: "",
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { page: pageParam, category: categoryParam, search: searchParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const category = (categoryParam ?? "toate") as CategoryKey | "toate";
  const search = searchParam ?? "";

  try {
    const [featuredResult, listResult] = await Promise.all([
      fetchArticlesPaginated({ page: 1, pageSize: 1 }),
      fetchArticlesPaginated({ page, pageSize: PAGE_SIZE, category, search }),
    ]);

    const featuredArticle = featuredResult.articles[0]
      ? mapStrapiArticle(featuredResult.articles[0])
      : null;
    const articles = listResult.articles.map(mapStrapiArticle);

    return (
      <NoutatiPage
        articles={articles}
        featuredArticle={featuredArticle}
        total={listResult.total}
        pageCount={listResult.pageCount}
        currentPage={page}
        currentCategory={category}
        currentSearch={search}
      />
    );
  } catch {
    return (
      <NoutatiPage
        articles={[]}
        featuredArticle={null}
        total={0}
        pageCount={1}
        currentPage={page}
        currentCategory={category}
        currentSearch={search}
      />
    );
  }
}
