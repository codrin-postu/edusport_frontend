import ConsentGate from "@/components/blocks/cookie-consent/ConsentGate";
import { COOKIE_CATEGORIES } from "@/components/blocks/cookie-consent/config";
import { cn } from "@/utils/cn";
import { CATEGORY_LABELS, type CategoryKey } from "../_data";
import {
  type BlockNode,
  type StrapiMediaImage,
  type StrapiVideoField,
  resolveVideoEmbed,
  strapiMediaUrl,
} from "@/lib/strapi-article";
import React from "react";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import StrapiBlocks from "@/components/blocks/strapi-blocks/StrapiBlocks";
import { ArticleImage } from "@/components/blocks/article-card/ArticleImage";
import { WarmStripe } from "@/components/ui/warm-stripe";
import Breadcrumb from "@/components/ui/breadcrumb";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { GalleryCarousel } from "@/components/blocks/gallery-carousel";
import Card from "@/components/ui/card";

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

interface ArticleData {
  slug: string;
  title: string;
  description: string;
  date: string; // posted date — never the event date
  category: CategoryKey;
  coverImage: string;
  body: BlockNode[] | null; // null = body unavailable
  gallery?: StrapiMediaImage[];
  video?: StrapiVideoField | null;
  eventDate?: string; // ISO datetime, populated for evenimente + competitii
  eventLocation?: string;
  eventAdmissionInfo?: string;
}

// ---------------------------------------------------------------------------
// Article-level Video field renderer
//
// Mode 'url' → YouTube/Vimeo iframe via resolveVideoEmbed. Falls back to a
// plain anchor when the URL doesn't match a known provider.
// Mode 'upload' → native <video controls> served from Strapi.
// ---------------------------------------------------------------------------
const ArticleVideo: React.FC<{ video: StrapiVideoField }> = ({ video }) => {
  if (!video.url) return null;
  if (video.mode === "upload") {
    return (
      <div className="relative w-full aspect-video bg-black overflow-hidden border-retro border-line">
        <video
          src={strapiMediaUrl(video.url)}
          controls
          preload="metadata"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }
  const embed = resolveVideoEmbed(video.url);
  if (!embed) {
    return (
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link text-accent font-semibold"
      >
        {video.url}
      </a>
    );
  }
  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden border-retro border-line">
      <ConsentGate category={COOKIE_CATEGORIES.functionality} label="YouTube">
        <iframe
          src={embed.embedUrl}
          title="Video"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </ConsentGate>
    </div>
  );
};

// Sidebar header text per category (event-like categories show event details).
const SIDEBAR_HEADER: Partial<Record<CategoryKey, string>> = {
  evenimente: "Detalii eveniment",
  competitii: "Detalii competiție",
};

interface Props {
  article: ArticleData;
}

const ArticleDetailPage: React.FC<Props> = ({ article }) => {
  if (!article) {
    notFound();
  }

  const siteUrl = SITE_URL;
  const isEventLike =
    article.category === "evenimente" || article.category === "competitii";

  return (
    <div className={cn("min-h-screen", "bg-surface")}>
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        date={article.date}
        image={article.coverImage}
        url={`${siteUrl}/noutati/${article.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: siteUrl },
          { name: "Noutăți", url: `${siteUrl}/noutati` },
          { name: article.title, url: `${siteUrl}/noutati/${article.slug}` },
        ]}
      />
      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[330px] overflow-hidden border-b-retro border-line bg-surface-subtle">
        <ArticleImage src={article.coverImage} alt={article.title} iconClassName="w-14 h-14" />
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
                { label: "Noutăți", href: "/noutati" },
                { label: article.title },
              ]}
            />
          </div>
        </div>
        <WarmStripe className="absolute inset-x-0 bottom-0 h-1.5 z-raised" />
      </div>

      {/* Article body */}
      <article className="bg-surface section">
        <div className="w-full max-w-content mx-auto gutter">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
            {/* Main content */}
            <div>
              {/* Meta */}
              <div className="text-caption flex flex-wrap items-center gap-2 mb-4">
                <span className="text-label text-accent">
                  {CATEGORY_LABELS[article.category]}
                </span>
                <span className="text-line-subtle">·</span>
                <span className="text-secondary">
                  {formatDate(article.date)}
                </span>
              </div>

              <h1 className="text-heading text-primary mb-4">
                {article.title}
              </h1>

              {/* Mobile-only date - sidebar is hidden on mobile */}
              <div className="flex items-center gap-2 mb-8 lg:hidden">
                <Icon name="calendar-days" className="text-accent" />
                <span className="text-body-sm text-secondary">{formatDate(article.date)}</span>
              </div>

              {/* Article-level video (separate field from body) — placed
                  above body so editors can lead with a feature clip. */}
              {article.video?.url && (
                <div className="mb-8">
                  <ArticleVideo video={article.video} />
                </div>
              )}

              {/* Body - Strapi Blocks */}
              {article.body && article.body.length > 0 ? (
                <div className="max-w-prose">
                  <StrapiBlocks blocks={article.body} />
                </div>
              ) : (
                <p className="text-body-sm text-secondary italic max-w-prose">
                  Conținutul acestui articol nu este disponibil momentan.
                </p>
              )}

              {/* Gallery — same carousel + lightbox used on /despre-noi/realizari.
                  Handles arbitrary counts (3-up desktop window with prev/next
                  controls, swipe + dots/counter on mobile, fullscreen
                  lightbox with arrow-key nav). */}
              {article.gallery && article.gallery.length > 0 && (
                <div className="mt-12">
                  <GalleryCarousel
                    images={article.gallery.map((img) => ({
                      src: strapiMediaUrl(img.url),
                      alt: img.alternativeText ?? img.caption ?? "",
                    }))}
                    eyebrow="Galerie"
                    className="mb-0"
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-24">
              <Card className="flex flex-col gap-4">
                <p className="text-label uppercase text-accent">
                  {SIDEBAR_HEADER[article.category] ?? "Detalii articol"}
                </p>
                <div className="text-body-sm flex flex-col gap-3 text-secondary">
                  <span className="flex items-start gap-3">
                    <Icon name="calendar-days" className="text-accent mt-0.5" />
                    {formatDate(
                      isEventLike && article.eventDate
                        ? article.eventDate
                        : article.date,
                    )}
                  </span>
                  {isEventLike && article.eventDate && (
                    <span className="flex items-start gap-3">
                      <Icon name="clock" className="text-accent mt-0.5" />
                      {new Date(article.eventDate).toLocaleTimeString("ro-RO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                  {isEventLike && article.eventLocation && (
                    <span className="flex items-start gap-3">
                      <Icon name="map-pin" className="text-accent mt-0.5" />
                      {article.eventLocation}
                    </span>
                  )}
                  {isEventLike && article.eventAdmissionInfo && (
                    <span className="flex items-start gap-3">
                      <Icon name="ticket" className="text-accent mt-0.5" />
                      {article.eventAdmissionInfo}
                    </span>
                  )}
                  <span className="flex items-start gap-3">
                    <Icon name="tag" className="text-accent mt-0.5" />
                    {CATEGORY_LABELS[article.category]}
                  </span>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
