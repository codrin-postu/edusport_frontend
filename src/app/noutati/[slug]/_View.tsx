import { cn } from "@/utils/cn";
import { CATEGORY_LABELS, type CategoryKey } from "../_data";
import type { BlockNode } from "@/lib/strapi-article";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ChevronRight, Clock, MapPin, Tag, Ticket } from "lucide-react";
import { notFound } from "next/navigation";
import StrapiBlocks from "@/components/blocks/strapi-blocks/StrapiBlocks";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

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
  eventDate?: string; // ISO datetime, populated for evenimente + competitii
  eventLocation?: string;
  eventAdmissionInfo?: string;
}

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edusport.vercel.app";
  const isEventLike =
    article.category === "evenimente" || article.category === "competitii";

  return (
    <div className={cn("min-h-screen", "bg-white")}>
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
      <div className="bg-white border-b border-gray-100 pt-8">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-gray-400">
            <Link href="/noutati" className="hover:text-gray-600 transition-colors">Noutăți</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-gray-600 truncate max-w-[200px] sm:max-w-none">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[400px] bg-gray-100 overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Article body */}
      <article className="bg-white pt-12 pb-40 md:pt-16 md:pb-56">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
            {/* Main content */}
            <div>
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-medium text-edusport-blue">
                  {CATEGORY_LABELS[article.category]}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400 font-light">
                  {formatDate(article.date)}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 leading-snug tracking-tight mb-4">
                {article.title}
              </h1>

              {/* Mobile-only date - sidebar is hidden on mobile */}
              <div className="flex items-center gap-2 mb-8 lg:hidden">
                <CalendarDays className="w-3.5 h-3.5 text-edusport-blue/60 shrink-0" />
                <span className="text-sm text-gray-500 font-light">{formatDate(article.date)}</span>
              </div>

              {/* Body - Strapi Blocks */}
              {article.body && article.body.length > 0 ? (
                <StrapiBlocks blocks={article.body} />
              ) : (
                <p className="text-gray-400 italic text-sm">
                  Conținutul acestui articol nu este disponibil momentan.
                </p>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-28">
              <div className="border border-gray-100 p-6 flex flex-col gap-4">
                <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
                  {SIDEBAR_HEADER[article.category] ?? "Detalii articol"}
                </p>
                <div className="flex flex-col gap-3 text-sm text-gray-600 font-light">
                  <span className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
                    {formatDate(
                      isEventLike && article.eventDate
                        ? article.eventDate
                        : article.date,
                    )}
                  </span>
                  {isEventLike && article.eventDate && (
                    <span className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
                      {new Date(article.eventDate).toLocaleTimeString("ro-RO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                  {isEventLike && article.eventLocation && (
                    <span className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
                      {article.eventLocation}
                    </span>
                  )}
                  {isEventLike && article.eventAdmissionInfo && (
                    <span className="flex items-start gap-3">
                      <Ticket className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
                      {article.eventAdmissionInfo}
                    </span>
                  )}
                  <span className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
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
