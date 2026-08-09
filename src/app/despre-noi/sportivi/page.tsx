import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import {
  computeStats,
  fetchCompetitionsForAthletes,
  fetchPublicSportspeoplePage,
  fetchSpotlightSportsperson,
  flattenDistinctCompetitions,
  type SportspersonCompetition,
  type SportspersonStats,
  type StrapiSportsperson,
} from "@/lib/strapi-sportsperson";
import { EditorialTicker } from "./_components/EditorialTicker";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "./_components/SearchBar";
import { SportspersonCard } from "./_components/SportspersonCard";
import { Spotlight } from "./_components/Spotlight";

// Reads `searchParams.page` + `searchParams.search`, so the page must be
// rendered dynamically per request — can't be statically pre-rendered.
export const dynamic = "force-dynamic";

/** Cards shown per page. Spotlight is bonus on page 1; not counted here. */
const PAGE_SIZE = 8;
const BASE_PATH = "/despre-noi/sportivi";

export const metadata: Metadata = {
  title: "Sportivi",
  description:
    "Profilurile sportivilor clubului EduSport — istoric de competiții, medalii și realizări.",
  alternates: { canonical: "/despre-noi/sportivi" },
};

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function SportiviIndexPage({ searchParams }: Props) {
  const { page: pageParam, search: searchParam } = await searchParams;
  const requestedPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const search = (searchParam ?? "").trim();
  // When searching, the spotlight band becomes a distraction (it's a
  // pinned athlete unrelated to the typed query). Hide it so the user
  // sees only matching results.
  const isSearching = search.length > 0;

  // Backend pagination: fetch only what we need to render. Spotlight is
  // a separate single-record query; grid is paginated server-side via
  // Strapi's `pagination[page]` + `pagination[pageSize]`. Both filter to
  // showPublicPage=true.
  let spotlight: StrapiSportsperson | null = null;
  let gridData: StrapiSportsperson[] = [];
  let totalPages = 1;
  let totalAthletes = 0;
  try {
    // Skip the spotlight fetch when searching — it would just go to waste.
    if (!isSearching) {
      spotlight = await fetchSpotlightSportsperson();
    }
    const gridPage = await fetchPublicSportspeoplePage({
      page: requestedPage,
      pageSize: PAGE_SIZE,
      // Keep the spotlight athlete out of the grid so they don't appear
      // twice on page 1.
      excludeDocumentId: spotlight?.documentId,
      search,
    });
    gridData = gridPage.data;
    totalPages = Math.max(1, gridPage.pageCount);
    // Total athletes on the index = grid total + 1 spotlight (if shown).
    totalAthletes = gridPage.total + (spotlight ? 1 : 0);
  } catch {
    // Strapi unavailable — fall through to empty state.
  }

  const currentPage = Math.min(requestedPage, totalPages);

  // Competitions only for the athletes we're actually rendering. ~9 ids
  // max (spotlight + 8 grid) vs. previously fetching for the whole cohort.
  // Spotlight is rendered on every page (pinned), so it's always in the
  // visible set.
  const visibleDocIds = [
    ...(spotlight ? [spotlight.documentId] : []),
    ...gridData.map((s) => s.documentId),
  ];
  let competitionsByAthlete = new Map<string, SportspersonCompetition[]>();
  try {
    if (visibleDocIds.length > 0) {
      competitionsByAthlete = await fetchCompetitionsForAthletes(visibleDocIds);
    }
  } catch {
    // Competition data unavailable — cards just show "—" stats.
  }

  const statsByAthlete = new Map<string, SportspersonStats>();
  for (const sp of [...(spotlight ? [spotlight] : []), ...gridData]) {
    statsByAthlete.set(
      sp.documentId,
      computeStats(
        competitionsByAthlete.get(sp.documentId) ?? [],
        sp.activeSince,
      ),
    );
  }

  const distinctCompetitions = flattenDistinctCompetitions(competitionsByAthlete);

  // Ticker rows — most recent distinct competition names. EditorialTicker
  // hides itself when items=[].
  const competitionNamesTicker = Array.from(
    new Set(distinctCompetitions.map((c) => c.name)),
  ).slice(0, 8);

  return (
    <div className={cn("min-h-screen", "bg-white")}>
      <PageHeroSection
        backgroundImage="/images/hero-background.png"
        title={["SPORTIVI"]}
        variant="blue"
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Sportivi" },
        ]}
      >
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Sportivii noștri
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          Sportivii de performanță ai clubului — profil, istoric de competiții
          și medalii câștigate la concursuri naționale și internaționale.
        </p>
      </PageHeroSection>

      {/* Empty state — render only the hero + a friendly note */}
      {totalAthletes === 0 ? (
        <section className="relative z-10 bg-white py-20">
          <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12 text-center">
            <p className="text-lg font-semibold text-gray-300">
              Niciun profil disponibil momentan
            </p>
            <p className="mt-2 text-sm font-light text-gray-400">
              Reveniți în curând.
            </p>
          </div>
        </section>
      ) : (
        <div className="relative z-10">
          {/* BLACK TICKER — distinct competition names, sits between the
              hero and the spotlight as a hard horizontal break. */}
          {competitionNamesTicker.length > 0 && (
            <EditorialTicker
              items={competitionNamesTicker}
              variant="black"
              durationSec={42}
            />
          )}

          {/* SPOTLIGHT — pinned on every page so the featured athlete
              stays visible while the grid below paginates. Hidden when
              the user has typed a search query (it'd just compete with
              the matching results). Spotlight still uses `rank` for its
              giant outlined "01" watermark — that's intentional (the
              spotlight is always #01). Grid cards dropped the rank chip. */}
          {spotlight && (
            <Spotlight
              sportsperson={spotlight}
              stats={statsByAthlete.get(spotlight.documentId)!}
              rank={1}
            />
          )}

          {/* COLLECTION GRID — on white. Paginated by PAGE_SIZE; spotlight
              is bonus on page 1. The total count above is always the full
              cohort size, not just this page's slice. The `id` anchor is
              the scroll target — Pagination links append `#sportivi-grid`
              so the browser scrolls back to this section on navigation,
              skipping the hero. */}
          <section
            id="sportivi-grid"
            className="scroll-mt-24 bg-white px-6 py-16 md:px-10 md:py-20"
          >
            <div className="mx-auto max-w-content text-center">
              <h2 className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-gray-900">
                {isSearching ? "Rezultate căutare" : "Toți sportivii"}
              </h2>
              <div className="mt-3 text-2xs font-semibold uppercase tracking-[0.32em] text-gray-400">
                {isSearching ? (
                  <>
                    {totalAthletes} {totalAthletes === 1 ? "rezultat" : "rezultate"} pentru
                    {" "}&laquo;{search}&raquo;
                  </>
                ) : (
                  <>
                    {totalAthletes} sportivi
                    {totalPages > 1 && (
                      <> · Pagina {currentPage} din {totalPages}</>
                    )}
                  </>
                )}
              </div>
            </div>

            <SearchBar initialValue={search} scrollAnchor="sportivi-grid" />

            {gridData.length === 0 ? (
              <div className="mx-auto mt-10 max-w-md py-12 text-center">
                <p className="text-base font-semibold text-gray-500">
                  Niciun sportiv găsit.
                </p>
                {isSearching && (
                  <p className="mt-2 text-sm font-light text-gray-400">
                    Încearcă alt nume sau șterge filtrul.
                  </p>
                )}
              </div>
            ) : (
              <div className="mx-auto mt-10 grid max-w-content grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {gridData.map((sp) => (
                  <SportspersonCard
                    key={sp.documentId}
                    sportsperson={sp}
                    stats={statsByAthlete.get(sp.documentId)!}
                  />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={BASE_PATH}
              scrollAnchor="sportivi-grid"
              extraQuery={search ? { search } : undefined}
            />
          </section>

          {/* OUTRO — slim "next step" band. Same inline-link pattern as
              AboutSection / evenimente cards: small eyebrow + short
              statement on one side, a text link with an arrow on the
              other. Reads like a footnote, not a parallel headline. */}
          <section className="border-t border-gray-100 bg-white px-6 py-12 md:px-10 md:py-14">
            <div className="mx-auto flex max-w-content flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-1.5 text-2xs font-semibold uppercase tracking-[0.32em] text-edusport-blue/60">
                  Mai departe
                </div>
                <p className="text-base md:text-lg font-medium text-gray-900">
                  Vezi toate competițiile clubului și rezultatele complete.
                </p>
              </div>
              <Link
                href="/despre-noi/realizari"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-edusport-blue transition-all hover:gap-3 hover:text-edusport-blue/70"
              >
                Toate competițiile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
