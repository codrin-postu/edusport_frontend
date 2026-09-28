"use client";

import Button from "@/components/ui/button";
import type {
  StrapiSportsperson,
  SportspersonStats,
} from "@/lib/strapi-sportsperson";
import { SportspersonCard } from "../../despre-noi/sportivi/_components/SportspersonCard";

/**
 * Athletes spotlight: title + intro + a big "N+ sportivi legitimați" number +
 * "Vezi toți" CTA on the left, two featured retro `SportspersonCard`s on the
 * right. The number uses the real roster size (`totalCount`) when it's
 * meaningfully larger than the 2 shown, else falls back to "50+".
 */

interface AthletesSpotlightProps {
  athletes: StrapiSportsperson[];
  stats: Record<string, SportspersonStats>;
  /** Real number of public athletes, from meta.pagination.total. */
  totalCount?: number;
  /** Editable copy from homepage.sections.athletes. */
  copy?: {
    heading?: string | null;
    intro?: string | null;
    countLabel?: string | null;
    ctaLabel?: string | null;
    ctaUrl?: string | null;
  } | null;
}

// Used when the CMS has nothing yet. Deliberately free of a hardcoded count:
// the number beside this text is the live one, so a literal here would contradict it.
const FALLBACK = {
  heading: "Sportivii noștri",
  intro:
    "Sportivi care se antrenează săptămânal la EduSport, de la primii pași pe gheață până la podiumuri naționale.",
  countLabel: "sportivi legitimați",
  ctaLabel: "Vezi toți sportivii",
  ctaUrl: "/despre-noi/sportivi",
};

const EMPTY_STATS: SportspersonStats = {
  totalCompetitions: 0,
  yearsActive: 0,
  goldCount: 0,
  silverCount: 0,
  bronzeCount: 0,
  podiumCount: 0,
  bestScore: null,
};

export default function AthletesSpotlight({ athletes, stats, totalCount, copy }: AthletesSpotlightProps) {
  if (!athletes.length) {
    return (
      <section className="bg-surface section-feature">
        <div className="text-body-sm max-w-content mx-auto gutter text-center text-secondary">
          Niciun sportiv încărcat momentan.
        </div>
      </section>
    );
  }
  // Two featured cards for the C layout; the big number + CTA carry the rest.
  const featured = athletes.slice(0, 2);
  // The real total, uncapped. No literal fallback: showing an invented number
  // next to editable copy is how the two came to contradict each other before.
  const bigNumber = typeof totalCount === "number" && totalCount > 0 ? String(totalCount) : null;

  const heading = copy?.heading?.trim() || FALLBACK.heading;
  const intro = copy?.intro?.trim() || FALLBACK.intro;
  const countLabel = copy?.countLabel?.trim() || FALLBACK.countLabel;
  const ctaLabel = copy?.ctaLabel?.trim() || FALLBACK.ctaLabel;
  const ctaUrl = copy?.ctaUrl?.trim() || FALLBACK.ctaUrl;

  return (
    <section className="bg-surface section-feature">
      <div className="max-w-content mx-auto gutter">
        <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-12 md:gap-16 items-center">
          {/* Left — copy + big number + CTA */}
          <div>
            <h2
              className="text-heading text-primary"
            >
              {heading}
            </h2>
            <p className="text-body text-secondary mt-4 max-w-[46ch]">
              {intro}
            </p>

            {bigNumber && (
              <div className="mt-8 mb-8">
                <span className="text-display-lg block text-primary">
                  {bigNumber}
                </span>
                <span className="text-label block uppercase text-accent mt-2">
                  {countLabel}
                </span>
              </div>
            )}

            <Button
              face="cream"
              href={ctaUrl}
              umamiEvent="home.sportivi"
            >
              {ctaLabel}
            </Button>
          </div>

          {/* Right — two featured retro cards. Fixed-width slots keep a strict
              portrait ratio (never squish to square); they wrap to a second row
              when there isn't room instead of shrinking. */}
          <div className="flex flex-wrap gap-6 md:gap-8 justify-center md:justify-start">
            {featured.map((a) => (
              <div key={a.documentId} className="w-[230px] max-w-full">
                <SportspersonCard
                  sportsperson={a}
                  stats={stats[a.documentId] ?? EMPTY_STATS}
                  restingRotation={0}
                  medalsInStats
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
