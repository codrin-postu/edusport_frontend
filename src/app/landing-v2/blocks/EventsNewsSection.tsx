import Image from "next/image";
import Link from "@/components/ui/link";
import { CATEGORY_LABELS } from "@/app/noutati/_data";
import { SHIMMER_DATA_URL } from "@/lib/blurDataUrl";
import type { Event } from "../../cursuri/evenimente/_data";
import type { LatestArticleData } from "../../homepage/blocks/LatestArticleSection";
import {
  EventCard,
  PLACEMENT_LABEL,
  PLACEMENT_TAG,
  formatRoMonthYear,
  type RecentMedal,
} from "./EventResultsSection";

/**
 * "Evenimente și noutăți" — merged Actualitate hub for /landing-v2.
 *
 * Replaces the separate EventResultsSection + LatestArticlesRetro sections,
 * which read as two adjacent "latest updates" blocks. Layout (approved in the
 * brainstorm companion, variant V1):
 *   - top: next-event card (left) + news column (featured + list, right)
 *   - full-width below: recent podiums as a 3-across grid (no dividers)
 *
 * Reuses the real `EventCard` + medal marker-tag helpers from
 * `EventResultsSection`. The old EventResultsSection / LatestArticlesRetro
 * components are kept in the tree only for their exported types/helpers.
 */

interface EventsNewsSectionProps {
  event: Event | null;
  medals: RecentMedal[];
  articles: LatestArticleData[];
}

export default function EventsNewsSection({ event, medals, articles }: EventsNewsSectionProps) {
  const showEvent = !!event;
  const showNews = articles.length > 0;
  const showMedals = medals.length > 0;
  if (!showEvent && !showNews && !showMedals) return null;

  // Single-column when only one of event/news is present.
  const topCols = showEvent && showNews ? "md:grid-cols-[1.15fr_0.95fr]" : "md:grid-cols-1";

  return (
    <section className="bg-[var(--color-retro-cream)] py-20 md:py-28">
      <div className="max-w-content mx-auto px-6 md:px-8">
        {/* Header */}
        <p className="text-2xs font-bold tracking-[0.2em] uppercase text-navy mb-2">
          Actualitate
        </p>
        <h2
          className="font-['League_Spartan'] font-extrabold text-navy leading-[1.05] mb-12 md:mb-14"
          style={{ fontSize: "clamp(26px, 3.4vw, 40px)", letterSpacing: "-0.3px" }}
        >
          Evenimente și noutăți
        </h2>

        {/* Event (left) + News (right) */}
        {(showEvent || showNews) && (
          <div className={`grid grid-cols-1 ${topCols} gap-10 md:gap-14 items-start`}>
            {showEvent && (
              <div>
                <p className="text-3xs md:text-2xs font-bold tracking-[0.2em] uppercase text-navy/45 mb-4">
                  Eveniment următor
                </p>
                <EventCard event={event!} />
              </div>
            )}
            {showNews && <NewsColumn articles={articles} />}
          </div>
        )}

        {/* Full-width recent podiums */}
        {showMedals && <PodiumsGrid medals={medals} />}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function NewsColumn({ articles }: { articles: LatestArticleData[] }) {
  const [featured, ...rest] = articles;
  const list = rest.slice(0, 3);
  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-4">
        <p className="text-3xs md:text-2xs font-bold tracking-[0.2em] uppercase text-navy/45">
          Noutăți
        </p>
        <Link
          href="/noutati"
          className="relative text-sm font-bold text-navy pb-[3px] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-rust after:transition-[width] after:duration-200 hover:after:w-full shrink-0"
        >
          Vezi toate
        </Link>
      </div>

      {featured && (
        <Link href={`/noutati/${featured.slug}`} className="group block">
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 border-[1.5px] border-navy">
            {featured.image && (
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 45vw, 100vw"
                placeholder="blur"
                blurDataURL={SHIMMER_DATA_URL}
              />
            )}
            {featured.category && (
              <span className="absolute top-3 left-3 bg-mustard text-navy text-3xs font-extrabold tracking-widest uppercase px-2 py-1 border-[1.5px] border-navy z-10">
                {CATEGORY_LABELS[featured.category]}
              </span>
            )}
          </div>
          <h3 className="font-['League_Spartan'] font-bold text-navy leading-tight mt-3 mb-1.5 text-xl md:text-2xl">
            {featured.title}
          </h3>
          {featured.excerpt && (
            <p className="text-sm text-navy/55 leading-relaxed line-clamp-2">{featured.excerpt}</p>
          )}
        </Link>
      )}

      <ul className="mt-4">
        {list.map((a, i) => (
          <li key={a.slug + i} className="border-t border-navy/10">
            <Link href={`/noutati/${a.slug}`} className="group block py-3">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                {a.category && (
                  <span className="text-3xs font-bold tracking-[0.12em] uppercase text-rust">
                    {CATEGORY_LABELS[a.category]}
                  </span>
                )}
                {a.category && (
                  <span className="w-[2px] h-[10px] bg-navy/25 shrink-0" aria-hidden />
                )}
                <span className="text-xs text-navy/40">{a.date}</span>
              </div>
              <p className="text-sm font-bold text-navy leading-snug">{a.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function PodiumsGrid({ medals }: { medals: RecentMedal[] }) {
  return (
    <div className="mt-16 md:mt-20">
      <div className="flex items-end justify-between gap-4 mb-6">
        <p className="text-3xs md:text-2xs font-bold tracking-[0.2em] uppercase text-navy/45">
          Podiumuri recente
        </p>
        <Link
          href="/despre-noi/realizari"
          className="relative text-sm font-bold text-navy pb-[3px] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-rust after:transition-[width] after:duration-200 hover:after:w-full shrink-0"
        >
          Vezi toate
        </Link>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-11 gap-y-1.5">
        {medals.map((m, i) => {
          const label = PLACEMENT_LABEL[m.placement];
          const nameNode = m.athleteSlug ? (
            <Link href={`/despre-noi/sportivi/${m.athleteSlug}`} className="text-navy">
              {m.athlete}
            </Link>
          ) : (
            <span className="text-navy">{m.athlete}</span>
          );
          return (
            <li key={i} className="flex items-center gap-4 py-3.5">
              <span
                aria-label={label}
                title={label}
                className={`shrink-0 w-[66px] text-center py-1.5 text-2xs font-extrabold uppercase tracking-[0.04em] ${PLACEMENT_TAG[m.placement]}`}
              >
                {label}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-tight truncate">{nameNode}</p>
                <p className="text-xs text-navy/50 leading-tight truncate mt-0.5">
                  {m.competitionName}
                  {m.category ? ` · ${m.category}` : ""}
                </p>
              </div>
              <span className="shrink-0 text-2xs tracking-wide uppercase text-navy/40">
                {formatRoMonthYear(m.competitionDate)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
