import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import SpotlightButton from "@/components/ui/spotlight-button";
import React from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { ArticleImage } from "@/components/blocks/article-card/ArticleImage";
import type { Event } from "./_data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CurrentEventSection({ event }: { event: Event }) {
  return (
    <section className="bg-retro-cream py-16 md:py-20">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <p className="text-eyebrow font-bold uppercase text-rust mb-10">
          Următorul eveniment
        </p>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Cover (clickable) */}
          <Link
            href={`/cursuri/evenimente/${event.slug}`}
            className="group relative block aspect-[16/9] overflow-hidden border-[1.5px] border-navy shadow-[8px_8px_0_rgb(14_26_60_/_0.16)] bg-navy/[0.04]"
          >
            <ArticleImage
              src={event.coverImage}
              alt={event.title}
              imgClassName="transition-transform duration-500 group-hover:scale-105"
              iconClassName="w-12 h-12"
            />
            <span
              className="absolute top-3 left-3 inline-flex items-center bg-mustard text-navy text-[10.5px] font-extrabold uppercase tracking-[0.03em] px-4 py-1.5"
              style={{ clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
            >
              În curând
            </span>
          </Link>

          {/* Content (not clickable — only image + button lead to the event) */}
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.3px]">
              {event.title}
            </h2>

            <div className="flex flex-col gap-2 text-sm text-navy/70">
              <span className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4 text-rust shrink-0" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-rust shrink-0" />
                {new Date(event.date).toLocaleTimeString("ro-RO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {event.location && (
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-rust shrink-0" />
                  {event.location}
                </span>
              )}
            </div>

            <p className="text-navy/[0.65] text-base leading-relaxed border-t border-navy/10 pt-5">
              {event.excerpt}
            </p>

            <SpotlightButton
              layers
              layersFace="black"
              href={`/cursuri/evenimente/${event.slug}`}
              className="w-fit text-xs"
            >
              Citește mai mult
            </SpotlightButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function NoEventSection() {
  return (
    <section className="bg-retro-cream py-16 md:py-20">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <p className="text-eyebrow font-bold uppercase text-rust mb-10">
          Următorul eveniment
        </p>
        <div className="flex flex-col gap-3 py-12 border-l-4 border-rust pl-6">
          <p className="text-2xl font-semibold text-navy/30">
            Niciun eveniment planificat momentan
          </p>
          <p className="text-sm text-navy/50 max-w-md">
            Reveniți mai târziu pentru informații despre următoarele evenimente
            și competiții organizate de Clubul Sportiv EduSport.
          </p>
        </div>
      </div>
    </section>
  );
}

function PastEventsSection({ events }: { events: Event[] }) {
  if (events.length === 0) return null;

  return (
    <section className="bg-retro-cream py-16 md:py-20">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <p className="text-eyebrow font-bold uppercase text-rust mb-10">
          Evenimente anterioare
        </p>

        <div className="flex flex-col">
          {events.map((event) => (
            <Link
              key={event.slug}
              href={`/cursuri/evenimente/${event.slug}`}
              className="group grid sm:grid-cols-[128px_1fr] gap-5 sm:gap-8 py-7 items-start border-t border-navy/10 first:border-t-0 outline-none"
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-32 aspect-video sm:aspect-square overflow-hidden border-[1.5px] border-navy bg-navy/[0.03] shrink-0">
                <ArticleImage src={event.coverImage} alt={event.title} />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <span className="text-[11.5px] text-navy/45">
                  {formatDate(event.date)}
                </span>
                <h3 className="text-lg font-bold text-navy leading-snug">
                  {event.title}
                </h3>
                <p className="text-sm text-navy/[0.62] leading-relaxed line-clamp-2">
                  {event.excerpt}
                </p>
                <span className="relative inline-block w-fit mt-1 pb-0.5 text-[11.5px] font-bold uppercase tracking-[0.03em] text-rust after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-rust after:transition-transform group-hover:after:scale-x-100">
                  Detalii
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <SpotlightButton layers layersFace="black" href="/noutati" className="text-xs">
            Vezi toate evenimentele
          </SpotlightButton>
        </div>
      </div>
    </section>
  );
}

interface EventsPageProps {
  currentEvent: Event | null;
  pastEvents: Event[];
}

const EventsPage: React.FC<EventsPageProps> = ({ currentEvent, pastEvents }) => {
  return (
    <div className={cn("min-h-screen", "bg-retro-cream", "flex", "flex-col")}>
      <PageHeroSection title={["EVENIMENTE"]} breadcrumb={[{ label: "Cursuri", href: "/cursuri" }, { label: "Evenimente" }]}>
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Evenimente
        </h1>
        <p className="text-retro-cream/70 text-base">
          Spectacole, competiții și momente speciale organizate de Școala de
          Patinaj EduSport de-a lungul sezonului.
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-retro-cream flex-1">
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
