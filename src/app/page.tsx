import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { fetchArticlesPaginated, strapiMediaUrl } from "@/lib/strapi-article";
import HomePage from "./homepage/_View";
import type { HomepageCms } from "./homepage/_types";
import type { LatestArticleData } from "./homepage/blocks/LatestArticleSection";

export const metadata: Metadata = {
  title: { absolute: "EduSport - Școala de Patinaj" },
  description:
    "Descoperă cursurile de patinaj artistic EduSport din București. Cursuri pentru copii și adulți, antrenori profesioniști, evenimente și competiții.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "EduSport - Școala de Patinaj",
    description:
      "Descoperă cursurile de patinaj artistic EduSport din București. Cursuri pentru copii și adulți, antrenori profesioniști, evenimente și competiții.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

export const revalidate = 300; // 5 min

export default async function Page() {
  let registrationOpen = true;
  let cms: HomepageCms = {};
  let latestArticles: LatestArticleData[] | undefined;

  try {
    const [settings, homepage, articlesResult] = await Promise.all([
      fetchStrapi<{ registration?: { open?: boolean } }>(
        "site-settings",
        "fields[0]=registration",
      ),
      fetchStrapi<HomepageCms>("homepage", "populate=*"),
      fetchArticlesPaginated({ page: 1, pageSize: 2 }),
    ]);

    if (settings?.registration?.open !== undefined) {
      registrationOpen = settings.registration.open;
    }
    if (homepage) {
      cms = homepage;
    }
    if (articlesResult.articles.length > 0) {
      latestArticles = articlesResult.articles.map((a) => ({
        title: a.title,
        excerpt: a.description ?? "",
        date: new Date(a.date).toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        image: a.coverImage ? strapiMediaUrl(a.coverImage.url) : "/images/courses_generated.png",
        slug: a.slug,
      }));
    }
  } catch {
    // Fall through with defaults
  }

  return (
    <HomePage
      registrationOpen={registrationOpen}
      cms={cms}
      latestArticles={latestArticles}
    />
  );
}
