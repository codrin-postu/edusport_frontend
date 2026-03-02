import { cn } from "@/utils/cn";
import { CURRENT_EVENT, PAST_EVENTS, type Event } from "../_View";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, ChevronRight, Clock, MapPin, Tag } from "lucide-react";
import { notFound } from "next/navigation";

// ---------------------------------------------------------------------------
// Data access — will be replaced by Strapi fetch
// ---------------------------------------------------------------------------

function getEvent(slug: string): Event | undefined {
  const all = [...(CURRENT_EVENT ? [CURRENT_EVENT] : []), ...PAST_EVENTS];
  return all.find((e) => e.slug === slug);
}

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

interface Props {
  slug: string;
}

const EventDetailPage: React.FC<Props> = ({ slug }) => {
  const event = getEvent(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className={cn("min-h-screen", "bg-white")}>
      {/* Top bar — breadcrumb + back */}
      <div className="bg-white border-b border-gray-100 pt-8">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-gray-400">
            <Link href="/cursuri" className="hover:text-gray-600 transition-colors">Cursuri</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href="/cursuri/evenimente" className="hover:text-gray-600 transition-colors">Evenimente</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-gray-600 truncate max-w-[200px] sm:max-w-none">{event.title}</span>
          </nav>

        </div>
      </div>

      {/* Cover image — capped height on desktop */}
      {event.coverImage && (
        <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[400px] bg-gray-100 overflow-hidden">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Article body */}
      <article className="bg-white py-12 md:py-16">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
            {/* Main content */}
            <div>
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-medium text-edusport-blue">
                  Eveniment
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400 font-light">
                  {formatDate(event.date)}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 leading-snug tracking-tight mb-8">
                {event.title}
              </h1>

              {/* Body */}
              <div
                className="prose prose-gray prose-base max-w-none font-light leading-relaxed
                  prose-headings:font-semibold prose-headings:text-gray-900 prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-600 prose-p:mb-5
                  prose-a:text-edusport-blue prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-800
                  prose-blockquote:border-l-edusport-blue prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                  prose-ul:text-gray-600 prose-li:text-gray-600"
              >
                {event.body ? (
                  event.body.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-gray-600 mb-5">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400 italic">
                    Detaliile despre acest eveniment nu sunt disponibile momentan.
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
              <div className="border border-gray-100 p-6 flex flex-col gap-4">
                <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
                  Detalii eveniment
                </p>
                <div className="flex flex-col gap-3 text-sm text-gray-600 font-light">
                  <span className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
                    {formatDate(event.date)}
                  </span>
                  <span className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
                    {new Date(event.date).toLocaleTimeString("ro-RO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {event.location && (
                    <span className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
                      {event.location}
                    </span>
                  )}
                  {event.tags && event.tags.length > 0 && (
                    <span className="flex items-start gap-3">
                      <Tag className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
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
