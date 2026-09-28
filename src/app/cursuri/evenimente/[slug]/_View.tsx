import { cn } from "@/utils/cn";
import type { BlockNode, CategoryKey } from "@/lib/strapi-article";
import React from "react";
import Icon from "@/components/ui/icon";
import Card from "@/components/ui/card";
import { notFound } from "next/navigation";
import StrapiBlocks from "@/components/blocks/strapi-blocks/StrapiBlocks";
import { ArticleImage } from "@/components/blocks/article-card/ArticleImage";
import { WarmStripe } from "@/components/ui/warm-stripe";
import Breadcrumb from "@/components/ui/breadcrumb";
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
      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[330px] overflow-hidden border-b-retro border-line bg-surface-subtle">
        <ArticleImage src={event.coverImage} alt={event.title} iconClassName="w-14 h-14" />
        <div
          aria-hidden
          className="absolute inset-0 z-raised pointer-events-none"
          style={{ background: "linear-gradient(to bottom, var(--color-surface-dark) 0%, var(--color-overlay) 35%, transparent 65%)" }}
        />
        <div className="absolute inset-x-0 top-0 z-raised">
          <div className="w-full max-w-content mx-auto gutter pt-8">
            <Breadcrumb
              onDark
              items={[
                { label: "Cursuri", href: "/cursuri" },
                { label: "Evenimente", href: "/cursuri/evenimente" },
                { label: event.title },
              ]}
            />
          </div>
        </div>
        <WarmStripe className="absolute inset-x-0 bottom-0 h-1.5 z-raised" />
      </div>

      {/* Event body */}
      <article className="bg-surface section">
        <div className="w-full max-w-content mx-auto gutter">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
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
              <Card className="flex flex-col gap-4">
                <p className="text-label uppercase text-accent">
                  {SIDEBAR_HEADER[event.category] ?? "Detalii eveniment"}
                </p>
                <div className="text-body-sm flex flex-col gap-3 text-secondary">
                  <span className="flex items-start gap-3">
                    <Icon name="calendar-days" className="text-accent mt-0.5" />
                    {formatDate(event.eventDate ?? event.date)}
                  </span>
                  <span className="flex items-start gap-3">
                    <Icon name="clock" className="text-accent mt-0.5" />
                    {new Date(event.eventDate ?? event.date).toLocaleTimeString("ro-RO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {event.location && (
                    <span className="flex items-start gap-3">
                      <Icon name="map-pin" className="text-accent mt-0.5" />
                      {event.location}
                    </span>
                  )}
                  {event.admissionInfo && (
                    <span className="flex items-start gap-3">
                      <Icon name="ticket" className="text-accent mt-0.5" />
                      {event.admissionInfo}
                    </span>
                  )}
                  {event.tags && event.tags.length > 0 && (
                    <span className="flex items-start gap-3">
                      <Icon name="tag" className="text-accent mt-0.5" />
                      {event.tags.join(", ")}
                    </span>
                  )}
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
};

export default EventDetailPage;
