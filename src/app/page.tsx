import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { fetchArticlesPaginated, strapiMediaUrl, fetchNextEvent } from "@/lib/strapi-article";
import type { StrapiMediaImage } from "@/lib/strapi-article";
import {
  fetchPublicSportspeople,
  fetchSpotlightSportsperson,
  fetchPublicSportspeoplePage,
  fetchCompetitionsForAthletes,
  computeStats,
  parsePlacement,
  type StrapiSportsperson,
  type SportspersonStats,
  fetchPublicSportspeopleTotal,
} from "@/lib/strapi-sportsperson";
import HomePage from "./landing-v2/_View";
import { type LatestArticleData } from "./homepage/blocks/LatestArticleSection";
import RegistrationSectionV2 from "./landing-v2/blocks/RegistrationSectionV2";
import RegistrationClosedSection from "./homepage/blocks/RegistrationClosedSection";
import { type HeroVariant } from "./landing-v2/blocks/HeroVariant";
import type { RecentMedal } from "./landing-v2/blocks/EventResultsSection";
import type { HomepageCms } from "./landing-v2/_types";

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

const STRIP_IMAGE_CAP = 16;
// Matches `athletes.slice(0, 2)` in AthletesSpotlight. Fetching a third meant
// an extra batched competitions query for an athlete that never rendered.
const FEATURED_ATHLETE_CAP = 2;
const RECENT_MEDALS_CAP = 4;

// Hardcoded placeholder set used when Strapi athletes have no gallery photos
// and no main portraits yet. Skating-themed Unsplash URLs, served directly.
const PLACEHOLDER_STRIP_IMAGES: StrapiMediaImage[] = [
  { url: "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?auto=format&fit=crop&w=1200&q=70", alternativeText: "Patinaj artistic" },
  { url: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=70", alternativeText: "Sportiv pe gheață" },
  { url: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=1200&q=70", alternativeText: "Concurs de patinaj" },
  { url: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?auto=format&fit=crop&w=1200&q=70", alternativeText: "Patinator în mișcare" },
  { url: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1200&q=70", alternativeText: "Patinaj artistic" },
];

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

// Trimmed Strapi competition shape — only the fields we need for the recent-medals list.
interface MedalSourceCompetition {
  name: string;
  date: string;
  participantData?: Array<{
    documentId?: string;
    name?: string;
    category?: string | null;
    placement?: number | null;
  }> | null;
  sportspeople?: Array<{
    documentId: string;
    slug: string;
    showPublicPage: boolean;
  }> | null;
}

function buildRecentMedals(competitions: MedalSourceCompetition[]): RecentMedal[] {
  const flat: RecentMedal[] = [];
  for (const comp of competitions) {
    const spMap = new Map((comp.sportspeople ?? []).map((sp) => [sp.documentId, sp]));
    for (const p of comp.participantData ?? []) {
      const placement = parsePlacement(p.placement);
      if (placement !== 1 && placement !== 2 && placement !== 3) continue;
      const sp = p.documentId ? spMap.get(p.documentId) : undefined;
      flat.push({
        athlete: p.name ?? "",
        athleteSlug: sp?.showPublicPage ? sp.slug : undefined,
        competitionName: comp.name,
        competitionDate: comp.date,
        category: p.category ?? "",
        placement,
      });
    }
  }
  flat.sort((a, b) => b.competitionDate.localeCompare(a.competitionDate));
  return flat.slice(0, RECENT_MEDALS_CAP);
}

// Built from athlete photos only. The list query does not populate `gallery`
// (see LIST_POPULATE_PARAMS in strapi-sportsperson.ts), so a gallery branch
// here silently produced nothing; populating it for every athlete just to fill
// a 3-image strip is not worth the payload.
function buildStripImages(athletes: StrapiSportsperson[]): StrapiMediaImage[] {
  const photoImages = athletes
    .map((a) => a.photo)
    .filter((p): p is StrapiMediaImage => !!p?.url);
  const seen = new Set<string>();
  const merged: StrapiMediaImage[] = [];
  for (const img of photoImages) {
    if (seen.has(img.url)) continue;
    seen.add(img.url);
    merged.push(img);
    if (merged.length >= STRIP_IMAGE_CAP) break;
  }
  return merged;
}

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
    competitionsResult,
    nextEventResult,
    athletesTotalResult,
  ] = await Promise.allSettled([
    fetchStrapi<{ registration?: { open?: boolean; currentSeason?: string } }>("site-settings"),
    fetchStrapi<HomepageCms>("homepage"),
    fetchArticlesPaginated({ page: 1, pageSize: 5 }),
    fetchPublicSportspeople(),
    fetchSpotlightSportsperson(),
    fetchStrapi<MedalSourceCompetition[]>(
      "competitions",
      new URLSearchParams({
        "sort[0]": "date:desc",
        "pagination[pageSize]": "20",
        "fields[0]": "name",
        "fields[1]": "date",
        "fields[2]": "participantData",
        "populate[sportspeople][fields][0]": "documentId",
        "populate[sportspeople][fields][1]": "slug",
        "populate[sportspeople][fields][2]": "showPublicPage",
      }).toString(),
    ),
    fetchNextEvent(),
    fetchPublicSportspeopleTotal(),
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
  if (homepageResult.status === "fulfilled" && homepageResult.value) {
    cms = homepageResult.value;
  }
  if (articlesPromiseResult.status === "fulfilled" && articlesPromiseResult.value.articles.length > 0) {
    latestArticles = articlesPromiseResult.value.articles.map((a) => ({
      title: a.title,
      excerpt: a.description ?? "",
      date: new Date(a.date).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" }),
      image: a.coverImage ? strapiMediaUrl(a.coverImage.url) : "/images/courses_generated.png",
      slug: a.slug,
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
      const compsByAthlete = await fetchCompetitionsForAthletes(featuredAthletes.map((a) => a.documentId));
      for (const a of featuredAthletes) {
        featuredStats[a.documentId] = computeStats(compsByAthlete.get(a.documentId) ?? [], a.activeSince);
      }
    } catch {
      for (const a of featuredAthletes) {
        featuredStats[a.documentId] = computeStats([], a.activeSince);
      }
    }
  }

  const liveStripImages = buildStripImages(athletes);
  const stripImages: StrapiMediaImage[] =
    liveStripImages.length > 0 ? liveStripImages : PLACEHOLDER_STRIP_IMAGES;

  const competitions: MedalSourceCompetition[] =
    competitionsResult.status === "fulfilled" ? competitionsResult.value : [];
  const recentMedals = buildRecentMedals(competitions);

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
        recentMedals={recentMedals}
        heroNextEvent={heroNextEvent}
        articles={displayArticles}
        registrationSlot={<RegistrationSectionV2 cms={cms.registration} season={currentSeason} />}
        registrationClosedSlot={<RegistrationClosedSection cms={cms.registrationClosed} season={currentSeason} />}
      />
    </>
  );
}
