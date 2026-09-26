import Image from "next/image";
import SpotlightButton from "@/components/ui/spotlight-button";
import { WarmStripe } from "@/components/ui/warm-stripe";
import { Calendar, MapPin } from "lucide-react";
import type { Event } from "../../cursuri/evenimente/_data";

// Helpers module (the standalone EventResults section was merged into
// EventsNewsSection). Exposes the event card + medal marker-tag helpers +
// the RecentMedal type consumed by EventsNewsSection / page.tsx / _View.

// Lightweight shape for the recent-medals list — built in `page.tsx` from
// the Strapi `competitions` fetch and passed in as a prop.
export interface RecentMedal {
  athlete: string;
  athleteSlug?: string;
  competitionName: string;
  competitionDate: string; // ISO date
  category: string;
  placement: 1 | 2 | 3;
}

export const PLACEMENT_LABEL: Record<1 | 2 | 3, string> = {
  1: "Aur",
  2: "Argint",
  3: "Bronz",
};
// Retro medal marker-tags (square, no dot). Aur = mustard, Argint = silver,
// Bronz = bronze — see globals.css retro tokens.
export const PLACEMENT_TAG: Record<1 | 2 | 3, string> = {
  1: "bg-mustard text-primary",
  2: "bg-silver text-primary",
  3: "bg-bronze text-primary-on-dark",
};

function formatRoDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
}

export function formatRoMonthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ro-RO", { month: "short", year: "numeric" });
}

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="flex flex-col border-retro border-line bg-surface-raised">
      <WarmStripe />
      {event.coverImage && (
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-surface-subtle border-b-retro border-line">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6 md:p-8 flex flex-col">
        <p className="text-label uppercase text-primary mb-3">
          Eveniment următor
        </p>
        <h3 className="text-heading text-primary mb-4">
          {event.title}
        </h3>
        <div className="text-body-sm flex flex-wrap items-center gap-x-5 gap-y-2 text-secondary mb-4">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4 shrink-0 text-accent" />
            {formatRoDate(event.date)}
          </span>
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0 text-accent" />
              {event.location}
            </span>
          )}
        </div>
        <p className="text-body-sm text-secondary mb-5 max-w-[560px]">{event.excerpt}</p>
        {event.admissionInfo && (
          <p className="text-body-sm text-secondary italic mb-6">{event.admissionInfo}</p>
        )}
        <SpotlightButton
          layers
          layersFace="cream"
          href={`/cursuri/evenimente/${event.slug}`}
          className="text-body-sm self-start"
          umamiEvent="home.event_details"
        >
          Vezi detalii
        </SpotlightButton>
      </div>
    </article>
  );
}
