import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { fetchArticlesPaginated, strapiMediaUrl, fetchNextEvent } from "@/lib/strapi-article";
import type { StrapiMediaImage } from "@/lib/strapi-article";
import {
  fetchPublicSportspeople,
  fetchSpotlightSportsperson,
  fetchPublicSportspeoplePage,
  fetchCompetitionsForSportspeople,
  computeStats,
  type StrapiSportsperson,
  type SportspersonStats,
  fetchPublicSportspeopleTotal,
} from "@/lib/strapi-sportsperson";
import HomePage from "./landing-v2/_View";
import { type LatestArticleData } from "./homepage/blocks/LatestArticleSection";
import RegistrationSectionV2 from "./landing-v2/blocks/RegistrationSectionV2";
import RegistrationClosedSection from "./homepage/blocks/RegistrationClosedSection";
import { type HeroVariant } from "./landing-v2/blocks/HeroVariant";
import type { HomepageCms } from "./landing-v2/_types";
import { resolveClubFigures, type ClubFiguresCms } from "./homepage/_types";

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

export const revalidate = 3600; // 1 hour — editor changes are pushed via /api/revalidate webhook

interface SiteSettingsCms {
  registration?: { open?: boolean; currentSeason?: string } | null;
  contact?: { addressDisplay?: string | null; whatsappChannelUrl?: string | null } | null;
}

/** First value that is a non-blank string, else undefined. */
function firstFilled(...values: (string | null | undefined)[]): string | undefined {
  for (const v of values) {
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return undefined;
}

// Matches `athletes.slice(0, 2)` in AthletesSpotlight. Fetching a third meant
// an extra batched competitions query for an athlete that never rendered.
const FEATURED_ATHLETE_CAP = 2;

// Fallback demo content so the athletes + news sections still render when Strapi
// returns nothing (local dev / empty CMS). Real data overrides these.
const PLACEHOLDER_ATHLETES: StrapiSportsperson[] = [
  { id: -1, documentId: "ph-1", name: "Maria Ionescu", slug: "#", showPublicPage: false, activeSince: "2018-01-01" },
  { id: -2, documentId: "ph-2", name: "Andrei Popescu", slug: "#", showPublicPage: false, activeSince: "2016-01-01" },
  { id: -3, documentId: "ph-3", name: "Elena Radu", slug: "#", showPublicPage: false, activeSince: "2019-01-01" },
];
const phStat = (g: number, s: number, b: number, c: number, y: number): SportspersonStats => ({
  totalCompetitions: c, yearsActive: y, goldCount: g, silverCount: s, bronzeCount: b, podiumCount: g + s + b, bestScore: null,
});
const PLACEHOLDER_STATS: Record<string, SportspersonStats> = {
  "ph-1": phStat(5, 3, 2, 14, 8),
  "ph-2": phStat(8, 4, 1, 20, 10),
  "ph-3": phStat(6, 5, 3, 18, 7),
};
const PLACEHOLDER_ARTICLES: LatestArticleData[] = [
  { title: "Sportivii EduSport urcă pe podium la Cupa Brașov", excerpt: "Trei medalii pentru clubul nostru într-un weekend plin de emoții pe gheață.", date: "18 martie 2025", image: "/images/courses_generated.png", slug: "#" },
  { title: "Înscrieri deschise pentru sezonul de primăvară", excerpt: "Locuri limitate la grupele de începători și avansați.", date: "12 martie 2025", image: "/images/courses_generated.png", slug: "#" },
  { title: "Gala de iarnă — spectacol pe gheață la AFI Cotroceni", excerpt: "Un spectacol de neuitat cu sportivii clubului.", date: "28 februarie 2025", image: "/images/courses_generated.png", slug: "#" },
  { title: "Rezultate excelente la Campionatul Național", excerpt: "Sportivii noștri s-au remarcat printre cei mai buni din țară.", date: "14 februarie 2025", image: "/images/courses_generated.png", slug: "#" },
  { title: "Doi antrenori noi se alătură echipei EduSport", excerpt: "Experiență și pasiune pentru patinaj artistic.", date: "30 ianuarie 2025", image: "/images/courses_generated.png", slug: "#" },
];

export default async function Page() {
  const heroVariant: HeroVariant = "B"; // retro hero locked to the cream layout
  let registrationOpen = true;
  let currentSeason: string | undefined;
  let cms: HomepageCms = {};
  let latestArticles: LatestArticleData[] | undefined;

  const [
    settingsResult,
    homepageResult,
    articlesPromiseResult,
    sportspeopleResult,
    spotlightAthleteResult,
    nextEventResult,
    athletesTotalResult,
    clubFiguresResult,
  ] = await Promise.allSettled([
    fetchStrapi<SiteSettingsCms>("site-settings"),
    fetchStrapi<HomepageCms>("homepage", "populate=competitionGallery"),
    fetchArticlesPaginated({ page: 1, pageSize: 5 }),
    fetchPublicSportspeople(),
    fetchSpotlightSportsperson(),
    fetchNextEvent(),
    fetchPublicSportspeopleTotal(),
    fetchStrapi<ClubFiguresCms>("club-figures"),
  ]);

  const nextEvent = nextEventResult.status === "fulfilled" ? nextEventResult.value : null;
  const athletesTotal =
    athletesTotalResult.status === "fulfilled" ? athletesTotalResult.value : null;

  if (settingsResult.status === "fulfilled" && settingsResult.value?.registration) {
    if (settingsResult.value.registration.open !== undefined) {
      registrationOpen = settingsResult.value.registration.open;
    }
    currentSeason = settingsResult.value.registration.currentSeason;
  }
  const contact = settingsResult.status === "fulfilled" ? settingsResult.value?.contact : undefined;
  if (homepageResult.status === "fulfilled" && homepageResult.value) {
    cms = homepageResult.value;
  }

  // The location and the WhatsApp channel are written once, in Setari site. The
  // homepage keeps its own field only when an editor deliberately overrode it,
  // so an empty field here means "use the setting", not "show nothing". That is
  // what left the WhatsApp button without an address.
  const registrationCms: HomepageCms["registration"] = {
    ...(cms.registration ?? {}),
    locationName: firstFilled(cms.registration?.locationName, contact?.addressDisplay),
  };
  const registrationClosedCms: HomepageCms["registrationClosed"] = {
    ...(cms.registrationClosed ?? {}),
    whatsappUrl: firstFilled(cms.registrationClosed?.whatsappUrl, contact?.whatsappChannelUrl),
  };

  // Club numbers come from the shared "Cifre club" list. The inline
  // sections.stats list stays as the fallback for anything not migrated.
  const clubFigures = clubFiguresResult.status === "fulfilled" ? clubFiguresResult.value : null;
  const resolvedStats =
    resolveClubFigures(cms.sections?.statIds, clubFigures?.figures) ?? cms.sections?.stats ?? null;
  const sectionsCms: HomepageCms["sections"] = { ...(cms.sections ?? {}), stats: resolvedStats };
  cms = { ...cms, sections: sectionsCms };
  if (articlesPromiseResult.status === "fulfilled" && articlesPromiseResult.value.articles.length > 0) {
    latestArticles = articlesPromiseResult.value.articles.map((a) => ({
      title: a.title,
      excerpt: a.description ?? "",
      date: new Date(a.date).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" }),
      image: a.coverImage ? strapiMediaUrl(a.coverImage.url) : "/images/courses_generated.png",
      slug: a.slug,
      // Carried through so the Actualitate section can label each article.
      // This was missing, so `category` was always undefined and the label
      // silently never rendered no matter what the component did with it.
      category: a.category,
    }));
  }

  const athletes: StrapiSportsperson[] =
    sportspeopleResult.status === "fulfilled" ? sportspeopleResult.value : [];

  // Featured athletes: daily spotlight + next two from the grid endpoint.
  const spotlight: StrapiSportsperson | null =
    spotlightAthleteResult.status === "fulfilled" ? spotlightAthleteResult.value : null;

  let gridFollowUp: StrapiSportsperson[] = [];
  try {
    const page = await fetchPublicSportspeoplePage({
      page: 1,
      pageSize: FEATURED_ATHLETE_CAP,
      excludeDocumentId: spotlight?.documentId,
    });
    gridFollowUp = page.data;
  } catch {
    gridFollowUp = athletes.filter((a) => a.documentId !== spotlight?.documentId);
  }

  const featuredAthletes: StrapiSportsperson[] = [
    ...(spotlight ? [spotlight] : []),
    ...gridFollowUp,
  ].slice(0, FEATURED_ATHLETE_CAP);

  const featuredStats: Record<string, SportspersonStats> = {};
  if (featuredAthletes.length > 0) {
    try {
      const compsByAthlete = await fetchCompetitionsForSportspeople(featuredAthletes);
      for (const a of featuredAthletes) {
        featuredStats[a.documentId] = computeStats(compsByAthlete.get(a.documentId) ?? [], a.activeSince);
      }
    } catch {
      for (const a of featuredAthletes) {
        featuredStats[a.documentId] = computeStats([], a.activeSince);
      }
    }
  }

  // Chosen in the admin, and nothing else. An empty list hides the section
  // rather than filling it with athlete portraits or stock photos, which is
  // what it used to do and why nobody could control what appeared there.
  const stripImages: StrapiMediaImage[] = (cms.competitionGallery ?? []).filter(
    (img): img is StrapiMediaImage => !!img?.url,
  );

  const heroNextEvent = nextEvent
    ? {
        title: nextEvent.title,
        dateLabel: new Date(nextEvent.date).toLocaleDateString("ro-RO", { day: "numeric", month: "long" }),
        location: nextEvent.location,
        href: `/cursuri/evenimente/${nextEvent.slug}`,
      }
    : null;

  // The event card in Evenimente si noutati, same source as the hero pill.
  const currentEventCard = nextEvent
    ? {
        slug: nextEvent.slug,
        title: nextEvent.title,
        date: nextEvent.date,
        location: nextEvent.location,
        coverImage: nextEvent.coverImageUrl ?? "/images/courses_generated.png",
        excerpt: "",
        body: "",
        admissionInfo: nextEvent.admissionInfo,
      }
    : null;

  // Fall back to demo content when the CMS returns nothing.
  const displayAthletes = featuredAthletes.length > 0 ? featuredAthletes : PLACEHOLDER_ATHLETES;
  const displayStats = featuredAthletes.length > 0 ? featuredStats : PLACEHOLDER_STATS;
  const displayArticles = latestArticles && latestArticles.length > 0 ? latestArticles : PLACEHOLDER_ARTICLES;

  return (
    <>
      {/* Home hero nav entrance: transparent-over-hero nav on first paint. The
          base `lv2-nav` retro class is set globally on <html> in layout.tsx; this
          only adds the home-only hero entrance state. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){var c=document.documentElement.classList;c.add('lv2-nav','lv2-nav-entrance');})();",
        }}
      />
      <HomePage
        registrationOpen={registrationOpen}
        cms={cms}
        heroVariant={heroVariant}
        featuredAthletes={displayAthletes}
        featuredStats={displayStats}
        athletesTotal={athletesTotal ?? undefined}
        stripImages={stripImages}
        currentEvent={currentEventCard}
        heroNextEvent={heroNextEvent}
        articles={displayArticles}
        registrationSlot={<RegistrationSectionV2 cms={registrationCms} season={currentSeason} />}
        registrationClosedSlot={<RegistrationClosedSection cms={registrationClosedCms} season={currentSeason} />}
      />
    </>
  );
}
