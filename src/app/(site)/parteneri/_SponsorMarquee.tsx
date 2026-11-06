import React from "react";
import Image from "next/image";
import Card from "@/components/ui/card";
import type { Sponsor } from "./_data";

/**
 * Single-row auto-scrolling sponsor strip. Pure CSS marquee (no JS): the track
 * is duplicated and translated -50% on a slow linear loop, so it reads as an
 * endless belt. Pauses on hover, and respects `prefers-reduced-motion`.
 * Framed retro tiles (cream + navy border + hard offset shadow); a tile shows
 * the logo image when present, otherwise the sponsor name.
 */
function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const inner = sponsor.logo ? (
    <Image
      src={sponsor.logo}
      alt={sponsor.name}
      width={120}
      height={48}
      className="max-h-12 w-auto object-contain"
    />
  ) : (
    <span className="text-label px-3 text-center uppercase text-secondary">
      {sponsor.name}
    </span>
  );
  const tileClassName = "flex h-[82px] w-[150px] shrink-0 items-center justify-center";
  return sponsor.href ? (
    <Card
      href={sponsor.href}
      external
      surface="raised"
      shadow="sm"
      padding="none"
      className={tileClassName}
      aria-label={sponsor.name}
    >
      {inner}
    </Card>
  ) : (
    <Card as="div" surface="raised" shadow="sm" padding="none" className={tileClassName}>
      {inner}
    </Card>
  );
}

export default function SponsorMarquee({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;
  // Duplicate the list so the -50% translate loops seamlessly.
  const belt = [...sponsors, ...sponsors];
  return (
    <div className="sponsor-marquee relative overflow-hidden">
      <style>{`
        @keyframes sponsor-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .sponsor-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: sponsor-scroll 55s linear infinite;
        }
        .sponsor-marquee:hover .sponsor-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .sponsor-track { animation: none; }
        }
      `}</style>
      {/* Edge fades so tiles slide in/out softly against the cream section. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-raised w-12 bg-gradient-to-r from-retro-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-raised w-12 bg-gradient-to-l from-retro-cream to-transparent" />
      <div className="sponsor-track py-2">
        {belt.map((s, i) => (
          <SponsorTile key={`${s.name}-${i}`} sponsor={s} />
        ))}
      </div>
    </div>
  );
}
