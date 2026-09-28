import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import Button from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import Card from "@/components/ui/card";
import Chip from "@/components/ui/chip";
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
    <section className="bg-surface section">
      <div className="w-full max-w-content mx-auto gutter">
        <p className="text-label uppercase text-accent mb-12">
          Următorul eveniment
        </p>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Cover (clickable) */}
          <Card
            href={`/cursuri/evenimente/${event.slug}`}
            surface="subtle"
            padding="none"
            className="relative block aspect-[16/9] overflow-hidden"
          >
            <ArticleImage
              src={event.coverImage}
              alt={event.title}
              imgClassName="transition-transform duration-slow group-hover/card:scale-105"
              iconClassName="w-12 h-12"
            />
            <Chip tone="highlight" size="md" shape="slanted" className="absolute top-3 left-3">
              În curând
            </Chip>
          </Card>

          {/* Content (not clickable — only image + button lead to the event) */}
          <div className="flex flex-col gap-6">
            <h2 className="text-heading text-primary">
              {event.title}
            </h2>

            <div className="text-body-sm flex flex-col gap-2 text-secondary">
              <span className="flex items-center gap-3">
                <Icon name="calendar-days" className="text-accent" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-3">
                <Icon name="clock" className="text-accent" />
                {new Date(event.date).toLocaleTimeString("ro-RO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {event.location && (
                <span className="flex items-center gap-3">
                  <Icon name="map-pin" className="text-accent" />
                  {event.location}
                </span>
              )}
            </div>

            <p className="text-body text-secondary border-t border-line-subtle pt-6">
              {event.excerpt}
            </p>

            <Button
              face="black"
              href={`/cursuri/evenimente/${event.slug}`}
              className="w-fit"
            >
              Citește mai mult
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function NoEventSection() {
  return (
    <section className="bg-surface section">
      <div className="w-full max-w-content mx-auto gutter">
        <p className="text-label uppercase text-accent mb-12">
          Următorul eveniment
        </p>
        <div className="flex flex-col gap-3 py-12 border-l-4 border-rust pl-6">
          <p className="text-body text-secondary">
            Niciun eveniment planificat momentan
          </p>
          <p className="text-body-sm text-secondary max-w-narrow">
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
    <section className="bg-surface section">
      <div className="w-full max-w-content mx-auto gutter">
        <p className="text-label uppercase text-accent mb-12">
          Evenimente anterioare
        </p>

        <div className="flex flex-col">
          {events.map((event) => (
            <Link
              key={event.slug}
              href={`/cursuri/evenimente/${event.slug}`}
              className="group grid sm:grid-cols-[128px_1fr] gap-6 sm:gap-8 py-8 items-start border-t border-line-subtle first:border-t-0 outline-none"
            >
              {/* Thumbnail */}
              <Card
                as="div"
                surface="subtle"
                shadow="none"
                padding="none"
                className="relative w-full sm:w-32 aspect-video sm:aspect-square overflow-hidden shrink-0"
              >
                <ArticleImage src={event.coverImage} alt={event.title} />
              </Card>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <span className="text-caption text-secondary">
                  {formatDate(event.date)}
                </span>
                <h3 className="text-title text-primary">
                  {event.title}
                </h3>
                <p className="text-body-sm text-secondary line-clamp-2">
                  {event.excerpt}
                </p>
                <span className="text-label relative inline-block w-fit mt-1 pb-0.5 uppercase text-accent after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-rust after:transition-transform group-hover:after:scale-x-100">
                  Detalii
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button face="black" href="/noutati">
            Vezi toate evenimentele
          </Button>
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
    <div className={cn("min-h-screen", "bg-surface", "flex", "flex-col")}>
      <PageHeroSection title={["EVENIMENTE"]} breadcrumb={[{ label: "Cursuri", href: "/cursuri" }, { label: "Evenimente" }]}>
        <h1 className="text-display text-primary-on-dark">
          Evenimente
        </h1>
        <p className="text-body text-secondary-on-dark">
          Spectacole, competiții și momente speciale organizate de Școala de
          Patinaj EduSport de-a lungul sezonului.
        </p>
      </PageHeroSection>

      <div className="relative z-raised bg-surface flex-1">
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
