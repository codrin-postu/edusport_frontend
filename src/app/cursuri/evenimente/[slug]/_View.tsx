import { cn } from "@/utils/cn";
import type { BlockNode, CategoryKey } from "@/lib/strapi-article";
import React from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, Clock, MapPin, Tag, Ticket } from "lucide-react";
import { notFound } from "next/navigation";
import StrapiBlocks from "@/components/blocks/strapi-blocks/StrapiBlocks";
import { ArticleImage } from "@/components/blocks/article-card/ArticleImage";
import { WarmStripe } from "@/components/ui/warm-stripe";
import { EventJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface EventData {
  slug: string;
  title: string;
  category: CategoryKey;
  date: string; // posted date (used in the meta row)
  eventDate?: string; // event datetime (used in the sidebar + EventJsonLd)
  location?: string;
  coverImage?: string;
  excerpt: string;
  body: BlockNode[] | null;
  admissionInfo?: string;
  tags?: string[];
}

// Singular Romanian descriptors for the supported event-like categories.
const SINGULAR_LABEL: Partial<Record<CategoryKey, string>> = {
  evenimente: "Eveniment",
  competitii: "Competiție",
};

const SIDEBAR_HEADER: Partial<Record<CategoryKey, string>> = {
  evenimente: "Detalii eveniment",
  competitii: "Detalii competiție",
};

interface Props {
  event: EventData;
}

const EventDetailPage: React.FC<Props> = ({ event }) => {
  if (!event) {
    notFound();
  }

  const siteUrl = SITE_URL;

  return (
    <div className={cn("min-h-screen", "bg-surface")}>
      <EventJsonLd
        name={event.title}
        description={event.excerpt}
        startDate={event.eventDate ?? event.date}
        location={event.location}
        image={event.coverImage}
        url={`${siteUrl}/cursuri/evenimente/${event.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: siteUrl },
          { name: "Evenimente", url: `${siteUrl}/cursuri/evenimente` },
          { name: event.title, url: `${siteUrl}/cursuri/evenimente/${event.slug}` },
        ]}
      />
      {/* Top bar - breadcrumb */}
      <div className="bg-surface border-b-retro border-line pt-8">
        <div className="w-full max-w-content mx-auto gutter py-4">
          <nav className="text-label flex items-center gap-2 uppercase text-secondary">
            <Link href="/cursuri" className="text-primary hover:text-accent transition-colors">Cursuri</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href="/cursuri/evenimente" className="text-primary hover:text-accent transition-colors">Evenimente</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-primary truncate max-w-[200px] sm:max-w-none">{event.title}</span>
          </nav>
        </div>
      </div>

      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[400px] overflow-hidden border-b-retro border-line bg-surface-subtle">
        <ArticleImage src={event.coverImage} alt={event.title} iconClassName="w-14 h-14" />
        <WarmStripe className="absolute inset-x-0 bottom-0 h-1.5 z-10" />
      </div>

      {/* Event body */}
      <article className="bg-surface section">
        <div className="w-full max-w-content mx-auto gutter">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
            {/* Main content */}
            <div>
              <div className="text-caption flex flex-wrap items-center gap-2 mb-4">
                <span className="text-label text-accent">
                  {SINGULAR_LABEL[event.category] ?? "Eveniment"}
                </span>
                <span className="text-line-subtle">·</span>
                <span className="text-secondary">{formatDate(event.date)}</span>
              </div>

              <h1 className="text-heading text-primary mb-8">
                {event.title}
              </h1>

              {event.body && event.body.length > 0 ? (
                <StrapiBlocks blocks={event.body} />
              ) : event.excerpt ? (
                <p className="text-secondary leading-relaxed">{event.excerpt}</p>
              ) : (
                <p className="text-body-sm text-secondary italic">
                  Detaliile despre acest eveniment nu sunt disponibile momentan.
                </p>
              )}
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="bg-surface border-retro border-line shadow-retro p-6 flex flex-col gap-4">
                <p className="text-label uppercase text-accent">
                  {SIDEBAR_HEADER[event.category] ?? "Detalii eveniment"}
                </p>
                <div className="text-body-sm flex flex-col gap-3 text-secondary">
                  <span className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {formatDate(event.eventDate ?? event.date)}
                  </span>
                  <span className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {new Date(event.eventDate ?? event.date).toLocaleTimeString("ro-RO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {event.location && (
                    <span className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      {event.location}
                    </span>
                  )}
                  {event.admissionInfo && (
                    <span className="flex items-start gap-3">
                      <Ticket className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      {event.admissionInfo}
                    </span>
                  )}
                  {event.tags && event.tags.length > 0 && (
                    <span className="flex items-start gap-3">
                      <Tag className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      {event.tags.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
};

export default EventDetailPage;
