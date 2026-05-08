import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import type { Event } from "./_data";

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
// Sub-components
// ---------------------------------------------------------------------------

function CurrentEventSection({ event }: { event: Event }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60 mb-10">
          Următorul eveniment
        </p>

        <Link
          href={`/cursuri/evenimente/${event.slug}`}
          className="group grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Cover image */}
          {event.coverImage && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-semibold backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                În curând
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-snug group-hover:text-edusport-blue transition-colors">
              {event.title}
            </h2>

            <div className="flex flex-col gap-2 text-sm text-gray-500 font-light">
              <span className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-edusport-blue/60 shrink-0" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-edusport-blue/60 shrink-0" />
                {new Date(event.date).toLocaleTimeString("ro-RO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {event.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-edusport-blue/60 shrink-0" />
                  {event.location}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-base font-light leading-relaxed border-t border-gray-100 pt-5">
              {event.excerpt}
            </p>

            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-edusport-blue group-hover:gap-3 transition-all w-fit">
              Citește mai mult
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

function NoEventSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60 mb-10">
          Următorul eveniment
        </p>
        <div className="flex flex-col gap-3 py-12 border-l-2 border-edusport-blue/10 pl-6">
          <p className="text-2xl font-semibold text-gray-300">
            Niciun eveniment planificat momentan
          </p>
          <p className="text-sm text-gray-400 font-light max-w-md">
            Reveniți mai târziu pentru informații despre următoarele evenimente
            și competiții organizate de Școala de Patinaj EduSport.
          </p>
        </div>
      </div>
    </section>
  );
}

function PastEventsSection({ events }: { events: Event[] }) {
  if (events.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60 mb-10">
          Evenimente anterioare
        </p>

        <div className="flex flex-col divide-y divide-gray-200">
          {events.map((event) => (
            <Link
              key={event.slug}
              href={`/cursuri/evenimente/${event.slug}`}
              className="group grid sm:grid-cols-[128px_1fr] gap-5 sm:gap-8 py-7 items-start hover:opacity-75 transition-opacity"
            >
              {/* Thumbnail */}
              {event.coverImage ? (
                <div className="relative w-full sm:w-32 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="hidden sm:flex w-32 aspect-square rounded-xl bg-edusport-blue/5 items-center justify-center shrink-0">
                  <CalendarDays className="w-8 h-8 text-edusport-blue/20" />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-xs text-gray-400 font-light">
                    {formatDate(event.date)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-edusport-blue transition-colors leading-snug">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-2">
                  {event.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-edusport-blue mt-1">
                  Detalii <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/noutati"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-edusport-blue/20 text-sm font-medium text-edusport-blue hover:bg-edusport-blue hover:text-white transition-colors"
          >
            Vezi toate evenimentele
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface EventsPageProps {
  currentEvent: Event | null;
  pastEvents: Event[];
}

const EventsPage: React.FC<EventsPageProps> = ({ currentEvent, pastEvents }) => {
  return (
    <div className={cn("min-h-screen", "bg-white", "flex", "flex-col")}>
      <PageHeroSection title={["EVENIMENTE"]} breadcrumb={[{ label: "Cursuri", href: "/cursuri" }, { label: "Evenimente" }]}>
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Evenimente
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          Spectacole, competiții și momente speciale organizate de Școala de
          Patinaj EduSport de-a lungul sezonului.
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-white flex-1">
        {currentEvent ? (
          <CurrentEventSection event={currentEvent} />
        ) : (
          <NoEventSection />
        )}

        <PastEventsSection events={pastEvents} />
      </div>
    </div>
  );
};

export default EventsPage;
