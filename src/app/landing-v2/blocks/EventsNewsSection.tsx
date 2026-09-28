import Image from "next/image";
import Link from "@/components/ui/link";
import Card, { CardTitle } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
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
    <section className="bg-surface section-feature">
      <div className="max-w-content mx-auto gutter">
        {/* Header */}
        <p className="text-label uppercase text-primary mb-2">
          Actualitate
        </p>
        <h2 className="text-heading text-primary mb-12 md:mb-16">
          Evenimente și noutăți
        </h2>

        {/* Lead (left) + list (right) */}
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.95fr] gap-12 md:gap-16 items-start">
          <div>
            {showEvent ? (
              <>
                <p className="text-label uppercase text-secondary mb-4">
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
    <Card
      href={`/noutati/${featured.slug}`}
      shadow="none"
      padding="none"
      className="group block border-none bg-transparent"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-surface-subtle border-retro border-line">
        {featured.image && (
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-long group-hover:scale-105"
            sizes="(min-width: 768px) 55vw, 100vw"
            placeholder="blur"
            blurDataURL={SHIMMER_DATA_URL}
          />
        )}
      </div>
      {featured.category && (
        <Chip tone="accent" size="sm" className="mt-3">
          {CATEGORY_LABELS[featured.category]}
        </Chip>
      )}
      <CardTitle className="text-body-lg font-semibold mt-2 mb-2">
        {featured.title}
      </CardTitle>
      <p className="text-caption text-secondary mb-2">{featured.date}</p>
      {featured.excerpt && (
        <p className="text-body-sm text-secondary line-clamp-2">{featured.excerpt}</p>
      )}
      <span className="text-body-sm link inline-block mt-4 text-primary">
        Citește articolul
      </span>
    </Card>
  );
}

/** The compact list in the right column. No thumbnails, by request. */
function NewsList({ articles }: { articles: LatestArticleData[] }) {
  const list = articles.slice(0, 4);
  return (
    <div>
      <p className="text-label uppercase text-secondary mb-3">
        Alte articole
      </p>

      <ul>
        {list.map((a, i) => (
          <li key={a.slug + i} className="border-t border-line-subtle first:border-t-0">
            <Link href={`/noutati/${a.slug}`} tone="plain" className="group block py-4">
              <p className="text-body-lg font-semibold text-primary transition-colors group-hover:text-accent">{a.title}</p>
              {/* One muted line, as drawn: "Competitii, 4 septembrie". */}
              <p className="text-caption text-secondary mt-1">
                {a.category ? `${CATEGORY_LABELS[a.category]}, ${a.date}` : a.date}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/noutati"
        className="text-body-sm inline-block mt-4"
      >
        Toate noutățile
      </Link>
    </div>
  );
}
