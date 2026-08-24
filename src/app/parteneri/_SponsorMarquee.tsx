import React from "react";
import Image from "next/image";
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
    <span className="px-3 text-center text-sm font-extrabold uppercase tracking-[0.04em] text-navy/70">
      {sponsor.name}
    </span>
  );
  const className =
    "flex h-[82px] w-[150px] shrink-0 items-center justify-center border-[1.5px] border-navy bg-white shadow-[4px_4px_0_rgb(14_26_60_/_0.13)]";
  return sponsor.href ? (
    <a
      href={sponsor.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={sponsor.name}
    >
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
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
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-retro-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-retro-cream to-transparent" />
      <div className="sponsor-track py-2">
        {belt.map((s, i) => (
          <SponsorTile key={`${s.name}-${i}`} sponsor={s} />
        ))}
      </div>
    </div>
  );
}
