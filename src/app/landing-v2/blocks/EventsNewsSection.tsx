import Image from "next/image";
import Link from "@/components/ui/link";
import { CATEGORY_LABELS } from "@/app/noutati/_data";
import { SHIMMER_DATA_URL } from "@/lib/blurDataUrl";
import type { Event } from "../../cursuri/evenimente/_data";
import type { LatestArticleData } from "../../homepage/blocks/LatestArticleSection";
import { EventCard } from "./EventResultsSection";

/**
 * "Evenimente si noutati": the Actualitate hub. Two fixed desktop columns, a
 * lead on the left (next event, or the featured article when there is none) and
 * a compact list on the right. Recent podiums used to sit below this; they were
 * removed because they read as a stray list on the landing page. They still
 * live on /despre-noi/realizari.
 */

interface EventsNewsSectionProps {
  event: Event | null;
  articles: LatestArticleData[];
}

export default function EventsNewsSection({ event, articles }: EventsNewsSectionProps) {
  const showEvent = !!event;
  const showNews = articles.length > 0;
  if (!showEvent && !showNews) return null;

  // The two columns are FIXED on desktop, regardless of what content exists.
  //
  // This used to collapse to md:grid-cols-1 whenever the event was missing,
  // which is the common case: an "event" is just an article in the evenimente
  // or competitii category whose eventDate is still in the future, so between
  // competitions there is none. The news column then became the only column and
  // the featured article's 16:9 cover stretched to the full content width,
  // giving the desktop a phone-sized layout at three times the scale.
  //
  // So the left slot always holds the largest thing available: the event card
  // if there is one, otherwise the featured article. The list fills the right.
  const [featured, ...rest] = articles;
  const listArticles = showEvent ? articles : rest;

  return (
    <section className="bg-retro-cream py-20 md:py-28">
      <div className="max-w-content mx-auto px-6 md:px-8">
        {/* Header */}
        <p className="text-2xs font-bold tracking-[0.2em] uppercase text-navy mb-2">
          Actualitate
        </p>
        <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.3px] mb-12 md:mb-14">
          Evenimente și noutăți
        </h2>

        {/* Lead (left) + list (right) */}
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.95fr] gap-10 md:gap-14 items-start">
          <div>
            {showEvent ? (
              <>
                <p className="text-3xs md:text-2xs font-bold tracking-[0.2em] uppercase text-navy/45 mb-4">
                  Eveniment următor
                </p>
                <EventCard event={event!} />
              </>
            ) : (
              featured && <FeaturedArticle article={featured} />
            )}
          </div>
          {listArticles.length > 0 && <NewsList articles={listArticles} />}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

/** The one article that gets an image, in the left column when there is no event. */
function FeaturedArticle({ article: featured }: { article: LatestArticleData }) {
  return (
    <Link href={`/noutati/${featured.slug}`} className="group block">
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 border-[1.5px] border-navy">
        {featured.image && (
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 768px) 55vw, 100vw"
            placeholder="blur"
            blurDataURL={SHIMMER_DATA_URL}
          />
        )}
      </div>
      {featured.category && (
        <span className="mt-3 inline-block bg-rust text-retro-cream text-3xs font-extrabold tracking-[0.1em] uppercase px-2 py-1">
          {CATEGORY_LABELS[featured.category]}
        </span>
      )}
      <h3 className="font-display font-bold text-navy leading-tight mt-2 mb-1.5 text-xl md:text-2xl">
        {featured.title}
      </h3>
      <p className="text-xs text-navy/40 mb-2">{featured.date}</p>
      {featured.excerpt && (
        <p className="text-sm text-navy/55 leading-relaxed line-clamp-2">{featured.excerpt}</p>
      )}
      <span className="link-underline-rust inline-block mt-4 text-sm font-bold text-navy">
        Citește articolul
      </span>
    </Link>
  );
}

/** The compact list in the right column. No thumbnails, by request. */
function NewsList({ articles }: { articles: LatestArticleData[] }) {
  const list = articles.slice(0, 4);
  return (
    <div>
      <p className="text-3xs md:text-2xs font-bold tracking-[0.2em] uppercase text-navy/45 mb-3">
        Alte articole
      </p>

      <ul>
        {list.map((a, i) => (
          <li key={a.slug + i} className="border-t border-navy/10 first:border-t-0">
            <Link href={`/noutati/${a.slug}`} className="group block py-3.5">
              <p className="font-display text-base font-bold text-navy leading-snug">{a.title}</p>
              {/* One muted line, as drawn: "Competitii, 4 septembrie". */}
              <p className="text-xs text-navy/40 mt-1">
                {a.category ? `${CATEGORY_LABELS[a.category]}, ${a.date}` : a.date}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/noutati"
        className="link-underline-rust inline-block mt-4 text-sm font-bold text-navy"
      >
        Toate noutățile
      </Link>
    </div>
  );
}
