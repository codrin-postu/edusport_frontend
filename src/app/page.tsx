import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { fetchArticlesPaginated, strapiMediaUrl } from "@/lib/strapi-article";
import HomePage from "./homepage/_View";
import LatestArticleSection, { type LatestArticleData } from "./homepage/blocks/LatestArticleSection";
import RegistrationSection from "./homepage/blocks/RegistrationSection";
import RegistrationClosedSection from "./homepage/blocks/RegistrationClosedSection";
import type { HomepageCms } from "./homepage/_types";

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

  const [settingsResult, homepageResult, articlesPromiseResult] = await Promise.allSettled([
    fetchStrapi<{ registration?: { open?: boolean } }>(
      "site-settings",
      "fields[0]=registration",
    ),
    fetchStrapi<HomepageCms>(
      "homepage",
      "populate[hero]=true&populate[registration]=true&populate[registrationClosed]=true&populate[about][populate]=*",
    ),
    fetchArticlesPaginated({ page: 1, pageSize: 2 }),
  ]);

  if (settingsResult.status === "fulfilled" && settingsResult.value?.registration?.open !== undefined) {
    registrationOpen = settingsResult.value.registration.open;
  }
  if (homepageResult.status === "fulfilled" && homepageResult.value) {
    cms = homepageResult.value;
  }
  if (articlesPromiseResult.status === "fulfilled" && articlesPromiseResult.value.articles.length > 0) {
    latestArticles = articlesPromiseResult.value.articles.map((a) => ({
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

  return (
    <HomePage
      registrationOpen={registrationOpen}
      cms={cms}
      registrationSlot={<RegistrationSection cms={cms.registration} />}
      registrationClosedSlot={<RegistrationClosedSection cms={cms.registrationClosed} />}
      latestArticlesSlot={<LatestArticleSection articles={latestArticles} />}
    />
  );
}
