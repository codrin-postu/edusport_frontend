import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import {
  computeStats,
  fetchCompetitionsForAthletes,
  fetchPublicSportspeoplePage,
  fetchSpotlightSportsperson,
  type SportspersonCompetition,
  type SportspersonStats,
  type StrapiSportsperson,
} from "@/lib/strapi-sportsperson";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "./_components/SearchBar";
import { Spotlight } from "./_components/Spotlight";

/** One numeric stat in a roster row. */
function RosterStat({
  value,
  label,
  accent = false,
  className,
}: {
  value: string;
  label: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-end shrink-0", className)}>
      <span
        className={cn(
          "font-display text-[17px] font-extrabold leading-none tabular-nums",
          accent ? "text-rust" : "text-navy",
        )}
      >
        {value}
      </span>
      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-navy/50">
        {label}
      </span>
    </div>
  );
}

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

  return (
    <div className={cn("min-h-screen", "bg-retro-cream")}>
      <PageHeroSection
        backgroundImage="/images/hero-background.png"
        title={["SPORTIVI"]}
        variant="blue"
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Sportivi" },
        ]}
      >
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Sportivii noștri
        </h1>
        <p className="text-retro-cream/70 text-base">
          Sportivii de performanță ai clubului — profil, istoric de competiții
          și medalii câștigate la concursuri naționale și internaționale.
        </p>
      </PageHeroSection>

      {/* Empty state — render only the hero + a friendly note */}
      {totalAthletes === 0 ? (
        <section className="relative z-10 bg-retro-cream py-20">
          <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12 text-center">
            <p className="font-display text-display-sm font-extrabold text-navy/25">
              Niciun profil disponibil momentan
            </p>
            <p className="mt-2 text-sm text-navy/50">
              Reveniți în curând.
            </p>
          </div>
        </section>
      ) : (
        <div className="relative z-10">
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
            className="scroll-mt-24 bg-retro-cream px-4 py-16 md:px-8 lg:px-12 md:py-20"
          >
            <div className="mx-auto max-w-content text-center">
              <h2 className="font-display text-display-md font-extrabold leading-[1.05] tracking-[-0.5px] text-navy">
                {isSearching ? "Rezultate căutare" : "Toți sportivii"}
              </h2>
              <div className="mt-3 text-2xs font-bold uppercase tracking-[0.32em] text-rust">
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
                <p className="text-base font-semibold text-navy/50">
                  Niciun sportiv găsit.
                </p>
                {isSearching && (
                  <p className="mt-2 text-sm text-navy/40">
                    Încearcă alt nume sau șterge filtrul.
                  </p>
                )}
              </div>
            ) : (
              <div className="mx-auto mt-10 max-w-3xl border-y-[1.5px] border-navy text-left">
                {gridData.map((sp, i) => {
                  const st = statsByAthlete.get(sp.documentId)!;
                  const medalTotal =
                    st.goldCount + st.silverCount + st.bronzeCount;
                  const rank = (currentPage - 1) * PAGE_SIZE + i + 1;
                  return (
                    <Link
                      key={sp.documentId}
                      href={`/despre-noi/sportivi/${sp.slug}`}
                      className="group relative flex items-center gap-4 sm:gap-6 px-3 sm:px-4 py-4 border-b border-navy/12 last:border-b-0 transition-colors hover:bg-navy/[0.035]"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 bottom-0 w-1 bg-rust opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <span
                        aria-hidden
                        className="font-display font-black text-[26px] sm:text-[30px] leading-none w-9 sm:w-11 text-center shrink-0 tabular-nums text-navy/[0.16] group-hover:text-rust transition-colors"
                      >
                        {String(rank).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="text-base font-bold tracking-[-0.2px] text-navy group-hover:text-rust transition-colors truncate">
                          {sp.name}
                        </div>
                        {sp.activeSince && (
                          <div className="mt-0.5 text-3xs font-semibold uppercase tracking-[0.1em] text-navy/45">
                            Membru din {sp.activeSince.slice(0, 4)}
                          </div>
                        )}
                      </div>
                      <div className="ml-auto flex items-center gap-4 sm:gap-6">
                        <RosterStat
                          value={String(st.totalCompetitions).padStart(2, "0")}
                          label="Comp."
                          accent
                          className="w-12"
                        />
                        <RosterStat
                          value={String(medalTotal).padStart(2, "0")}
                          label="Medalii"
                          className="w-12"
                        />
                        <RosterStat
                          value={
                            st.bestScore !== null
                              ? st.bestScore.toFixed(2)
                              : "—"
                          }
                          label="Best"
                          className="hidden sm:flex w-14"
                        />
                        <ChevronRight className="w-4 h-4 shrink-0 text-navy/40 group-hover:text-rust transition-colors" />
                      </div>
                    </Link>
                  );
                })}
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
          <section className="border-t-[1.5px] border-navy/12 bg-retro-cream px-4 py-12 md:px-8 lg:px-12 md:py-14">
            <div className="mx-auto flex max-w-content flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-1.5 text-eyebrow font-bold uppercase text-rust">
                  Mai departe
                </div>
                <p className="text-base md:text-lg font-semibold text-navy">
                  Vezi toate competițiile clubului și rezultatele complete.
                </p>
              </div>
              <Link
                href="/despre-noi/realizari"
                className="link-underline-rust text-sm font-semibold text-rust"
              >
                Toate competițiile
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
