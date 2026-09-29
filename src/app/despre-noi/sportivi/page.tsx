import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Icon } from "@/components/ui/icon";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { Stat } from "@/components/ui/stat";
import {
  computeStats,
  fetchCompetitionsForSportspeople,
  fetchPublicSportspeoplePage,
  fetchSpotlightSportsperson,
  type SportspersonCompetition,
  type SportspersonStats,
  type StrapiSportsperson,
} from "@/lib/strapi-sportsperson";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "./_components/SearchBar";
import { Spotlight } from "./_components/Spotlight";
import { SportspersonCard } from "./_components/SportspersonCard";
import { ViewToggle, type RosterView } from "./_components/ViewToggle";
import { requireEnabled } from "@/lib/strapi-navigation";

// Reads `searchParams.page`, `.search` and `.view`, so the page must be
// rendered dynamically per request — can't be statically pre-rendered.
export const dynamic = "force-dynamic";

/** Athletes shown per page, per view. Spotlight is bonus; not counted here. */
const PAGE_SIZE: Record<RosterView, number> = { carduri: 12, lista: 10 };

/** next/image `sizes` for a card in the roster grid: 1 / 2 / 3 / 4 columns,
 *  capped at the max-w-content column width (1280px minus gutters and gaps).
 *  Phones cap the single card at 260px so it stays portrait. */
const GRID_CARD_SIZES =
  "(min-width: 1280px) 272px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 260px";
const BASE_PATH = "/despre-noi/sportivi";

export const metadata: Metadata = {
  title: "Sportivi",
  description:
    "Profilurile sportivilor clubului EduSport — istoric de competiții, medalii și realizări.",
  alternates: { canonical: "/despre-noi/sportivi" },
};

interface Props {
  searchParams: Promise<{ page?: string; search?: string; view?: string }>;
}

export default async function SportiviIndexPage({ searchParams }: Props) {
  await requireEnabled("sportivi");
  const { page: pageParam, search: searchParam, view: viewParam } = await searchParams;
  // `?view=lista` picks the ranked list; anything else (or absent) is cards.
  const view: RosterView = viewParam === "lista" ? "lista" : "carduri";
  const pageSize = PAGE_SIZE[view];
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
      pageSize,
      search,
    });
    gridData = gridPage.data;
    totalPages = Math.max(1, gridPage.pageCount);
    // The spotlight athlete is also listed in the grid, so the grid total is
    // already the full count. Excluding them made the band feel like a
    // different section of the site rather than a highlight of this one, and
    // left a gap in the alphabetical run.
    totalAthletes = gridPage.total;
  } catch {
    // Strapi unavailable — fall through to empty state.
  }

  const currentPage = Math.min(requestedPage, totalPages);

  // Competitions only for the athletes we're actually rendering. The spotlight
  // athlete now also appears in the grid, so de-duplicate by documentId to
  // avoid looking their results up twice.
  const visibleAthletes = [...(spotlight ? [spotlight] : []), ...gridData].filter(
    (a, i, all) => all.findIndex((b) => b.documentId === a.documentId) === i,
  );
  let competitionsByAthlete = new Map<string, SportspersonCompetition[]>();
  try {
    if (visibleAthletes.length > 0) {
      competitionsByAthlete = await fetchCompetitionsForSportspeople(visibleAthletes);
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

  return (
    <div className={cn("min-h-screen", "bg-surface")}>
      <PageHeroSection
        backgroundImage="/images/hero-background.png"
        title={["SPORTIVI"]}
        variant="blue"
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Sportivi" },
        ]}
      >
        <h1 className="text-display text-primary-on-dark">
          Sportivii noștri
        </h1>
        <p className="text-body text-secondary-on-dark">
          Sportivii de performanță ai clubului — profil, istoric de competiții
          și medalii câștigate la concursuri naționale și internaționale.
        </p>
      </PageHeroSection>

      {/* Empty state — render only the hero + a friendly note */}
      {totalAthletes === 0 ? (
        <section className="relative z-raised bg-surface section">
          <div className="w-full max-w-content mx-auto gutter text-center">
            <p className="text-heading text-secondary">
              Niciun profil disponibil momentan
            </p>
            <p className="text-body-sm mt-2 text-secondary">
              Reveniți în curând.
            </p>
          </div>
        </section>
      ) : (
        <div className="relative z-raised">
          {/* SPOTLIGHT — pinned on every page so the featured athlete
              stays visible while the grid below paginates. Hidden when
              the user has typed a search query (it'd just compete with
              the matching results). Grid cards dropped the rank chip. */}
          {spotlight && (
            <Spotlight
              sportsperson={spotlight}
              stats={statsByAthlete.get(spotlight.documentId)!}
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
            className="scroll-mt-24 bg-surface gutter section"
          >
            <div className="mx-auto max-w-content text-center">
              <h2 className="text-display text-primary">
                {isSearching ? "Rezultate căutare" : "Toți sportivii"}
              </h2>
              <div className="text-label mt-3 uppercase text-accent">
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

            <SearchBar
              initialValue={search}
              scrollAnchor="sportivi-grid"
              extraQuery={view === "lista" ? { view } : undefined}
            />

            <div className="mx-auto mt-12 max-w-content">
              {/* View picker: right-aligned on desktop, centred under the
                  centred header on phones. */}
              <div className="flex justify-center sm:justify-end">
                <ViewToggle view={view} search={search || undefined} />
              </div>

              {gridData.length === 0 ? (
                <div className="mx-auto mt-12 max-w-md py-12 text-center">
                  <p className="text-body text-secondary">
                    Niciun sportiv găsit.
                  </p>
                  {isSearching && (
                    <p className="text-body-sm mt-2 text-secondary">
                      Încearcă alt nume sau șterge filtrul.
                    </p>
                  )}
                </div>
              ) : view === "carduri" ? (
                /* CARD VIEW: the same trading card as the landing and the
                   spotlight, flat at rest (restingRotation 0) but keeping the
                   pointer-follow 3D tilt on hover. */
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                  {gridData.map((sp) => (
                    <div
                      key={sp.documentId}
                      className="mx-auto w-full max-w-[260px] sm:max-w-none"
                    >
                      <SportspersonCard
                        sportsperson={sp}
                        stats={statsByAthlete.get(sp.documentId)!}
                        restingRotation={0}
                        retro
                        imageSizes={GRID_CARD_SIZES}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* LIST VIEW: ranked rows, full content width. Below lg the
                   stats stack under the name; from lg they sit in fixed-width
                   right-aligned columns on the row. */
                <div className="mt-6 border-y-retro border-line text-left">
                  {gridData.map((sp, i) => {
                    const st = statsByAthlete.get(sp.documentId)!;
                    const medalTotal =
                      st.goldCount + st.silverCount + st.bronzeCount;
                    const rank = (currentPage - 1) * pageSize + i + 1;
                    return (
                      <Link
                        key={sp.documentId}
                        href={`/despre-noi/sportivi/${sp.slug}`}
                        className="group relative flex items-center gap-4 sm:gap-6 px-3 sm:px-4 py-4 border-b border-line-subtle last:border-b-0 transition-colors hover-layer"
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-0 bottom-0 w-1 bg-rust opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <span
                          aria-hidden
                          className="text-heading w-9 sm:w-11 text-center shrink-0 tabular-nums text-muted group-hover:text-accent transition-colors"
                        >
                          {String(rank).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1 lg:flex lg:items-center lg:gap-6">
                          <div className="min-w-0 lg:flex-1">
                            <div className="text-body text-primary group-hover:text-accent transition-colors truncate">
                              {sp.name}
                            </div>
                            {sp.activeSince && (
                              <div className="text-label mt-0.5 uppercase text-secondary">
                                Membru din {sp.activeSince.slice(0, 4)}
                              </div>
                            )}
                          </div>
                          <div className="mt-3 flex gap-6 lg:mt-0 lg:shrink-0">
                            <Stat
                              size="sm"
                              layout="stack"
                              value={String(st.totalCompetitions).padStart(2, "0")}
                              label="Competiții"
                              accent
                              labelClassName="whitespace-nowrap"
                              className="shrink-0 w-28 lg:items-end"
                            />
                            <Stat
                              size="sm"
                              layout="stack"
                              value={String(medalTotal).padStart(2, "0")}
                              label="Medalii"
                              labelClassName="whitespace-nowrap"
                              className="shrink-0 w-20 lg:items-end"
                            />
                            <Stat
                              size="sm"
                              layout="stack"
                              value={
                                st.bestScore !== null
                                  ? st.bestScore.toFixed(2)
                                  : "—"
                              }
                              label="Cel mai bun scor"
                              labelClassName="whitespace-nowrap"
                              className="shrink-0 hidden sm:flex w-40 lg:items-end"
                            />
                          </div>
                        </div>
                        <Icon name="chevron-right" className="shrink-0 text-secondary group-hover:text-accent transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={BASE_PATH}
              scrollAnchor="sportivi-grid"
              scrollTargetId="sportivi-grid"
              extraQuery={{ search, view: view === "lista" ? view : "" }}
            />
          </section>
        </div>
      )}
    </div>
  );
}
