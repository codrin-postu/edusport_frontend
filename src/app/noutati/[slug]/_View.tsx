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
import Link from "next/link";
import { CalendarDays, ChevronRight, Clock, MapPin, Tag, Ticket } from "lucide-react";
import { notFound } from "next/navigation";
import StrapiBlocks from "@/components/blocks/strapi-blocks/StrapiBlocks";
import { ArticleImage } from "@/components/blocks/article-card/ArticleImage";
import { WarmStripe } from "@/components/ui/warm-stripe";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { GalleryCarousel } from "@/components/blocks/gallery-carousel";

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
      <div className="relative w-full aspect-video bg-black overflow-hidden border-[1.5px] border-navy">
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
        className="link-underline-rust text-rust font-semibold"
      >
        {video.url}
      </a>
    );
  }
  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden border-[1.5px] border-navy">
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
    <div className={cn("min-h-screen", "bg-retro-cream")}>
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
      {/* Top bar - breadcrumb */}
      <div className="bg-retro-cream border-b-[1.5px] border-navy pt-8">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-eyebrow font-bold uppercase text-navy/55">
            <Link href="/noutati" className="text-navy/80 hover:text-rust transition-colors">Noutăți</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-navy truncate max-w-[200px] sm:max-w-none">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[400px] overflow-hidden border-b-[1.5px] border-navy bg-navy/[0.04]">
        <ArticleImage src={article.coverImage} alt={article.title} iconClassName="w-14 h-14" />
        <WarmStripe className="absolute inset-x-0 bottom-0 h-1.5 z-10" />
      </div>

      {/* Article body */}
      <article className="bg-retro-cream pt-12 pb-40 md:pt-16 md:pb-56">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
            {/* Main content */}
            <div>
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4 text-[11.5px]">
                <span className="font-bold uppercase tracking-[0.04em] text-rust">
                  {CATEGORY_LABELS[article.category]}
                </span>
                <span className="text-navy/30">·</span>
                <span className="text-navy/45">
                  {formatDate(article.date)}
                </span>
              </div>

              <h1 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px] mb-4">
                {article.title}
              </h1>

              {/* Mobile-only date - sidebar is hidden on mobile */}
              <div className="flex items-center gap-2 mb-8 lg:hidden">
                <CalendarDays className="w-3.5 h-3.5 text-rust shrink-0" />
                <span className="text-sm text-navy/50">{formatDate(article.date)}</span>
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
                <StrapiBlocks blocks={article.body} />
              ) : (
                <p className="text-navy/40 italic text-sm">
                  Conținutul acestui articol nu este disponibil momentan.
                </p>
              )}

              {/* Gallery — same carousel + lightbox used on /despre-noi/realizari.
                  Handles arbitrary counts (3-up desktop window with prev/next
                  controls, swipe + dots/counter on mobile, fullscreen
                  lightbox with arrow-key nav). */}
              {article.gallery && article.gallery.length > 0 && (
                <div className="mt-10">
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
              <div className="bg-retro-cream border-[1.5px] border-navy shadow-[8px_8px_0_rgb(14_26_60_/_0.16)] p-6 flex flex-col gap-4">
                <p className="text-eyebrow font-bold uppercase text-rust">
                  {SIDEBAR_HEADER[article.category] ?? "Detalii articol"}
                </p>
                <div className="flex flex-col gap-3 text-sm text-navy/75">
                  <span className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 text-rust shrink-0 mt-0.5" />
                    {formatDate(
                      isEventLike && article.eventDate
                        ? article.eventDate
                        : article.date,
                    )}
                  </span>
                  {isEventLike && article.eventDate && (
                    <span className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-rust shrink-0 mt-0.5" />
                      {new Date(article.eventDate).toLocaleTimeString("ro-RO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                  {isEventLike && article.eventLocation && (
                    <span className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-rust shrink-0 mt-0.5" />
                      {article.eventLocation}
                    </span>
                  )}
                  {isEventLike && article.eventAdmissionInfo && (
                    <span className="flex items-start gap-3">
                      <Ticket className="w-4 h-4 text-rust shrink-0 mt-0.5" />
                      {article.eventAdmissionInfo}
                    </span>
                  )}
                  <span className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-rust shrink-0 mt-0.5" />
                    {CATEGORY_LABELS[article.category]}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
