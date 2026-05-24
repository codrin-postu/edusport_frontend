"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { strapiMediaUrl } from "@/lib/strapi-article";
import type {
  StrapiSportsperson,
  SportspersonStats,
} from "@/lib/strapi-sportsperson";

/**
 * Trading-card style sportsperson card with cursor-tracking 3D tilt.
 *
 * The structure is two divs: an outer wrap that carries the perspective
 * context AND the resting decorative rotation, and an inner card that
 * carries the dynamic rotateX/rotateY/scale from cursor tracking. Keeping
 * the resting Z-rotation OFF the inner card prevents the hover transform
 * from fighting the resting transform — both can coexist on different
 * elements.
 *
 * On hover, the corner closest to the cursor pops forward (math at the
 * bottom of `useTilt`). The card scales to 1.06 ("picked up"), and a
 * radial glare follows the cursor across the card surface.
 *
 * Respects `prefers-reduced-motion`: the active class still toggles for
 * the glare + scale, but rx/ry stay at 0 so the card just lifts uniformly
 * without rocking.
 */

const MAX_TILT_DEG = 14;
const HOVER_SCALE = 1.06;

interface Props {
  sportsperson: StrapiSportsperson;
  stats: SportspersonStats;
  /** Card scale variant. Spotlight gets a slightly bigger frame + foil. */
  size?: "default" | "spotlight";
  /** Resting decorative Z-rotation in degrees, applied while idle. */
  restingRotation?: number;
  /** Optional vertical offset in px (also resting only). */
  restingOffsetY?: number;
}

/** Derive tier (gold/silver/bronze/neutral) + display label from bestPlacement. */
function tierFor(stats: SportspersonStats): {
  color: string;
  label: string;
  badgeText: string | null;
  badgeCount: number;
} {
  if (stats.goldCount > 0) {
    return {
      color: "#fbbf24",
      label: "Aur",
      badgeText: "AUR",
      badgeCount: stats.goldCount,
    };
  }
  if (stats.silverCount > 0) {
    return {
      color: "#cbd5e1",
      label: "Argint",
      badgeText: "ARG",
      badgeCount: stats.silverCount,
    };
  }
  if (stats.bronzeCount > 0) {
    return {
      color: "#ea580c",
      label: "Bronz",
      badgeText: "BRZ",
      badgeCount: stats.bronzeCount,
    };
  }
  return {
    color: "rgba(255,255,255,0.22)",
    label: stats.totalCompetitions > 0 ? "Sportiv" : "Începător",
    badgeText: null,
    badgeCount: 0,
  };
}

export function SportspersonCard({
  sportsperson,
  stats,
  size = "default",
  restingRotation = 0,
  restingOffsetY = 0,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        // Tilt math: corner nearest cursor pops toward viewer.
        // CSS rotateX(+) leans the bottom forward; rotateY(+) leans the left
        // forward. So mouse-top → rx negative, mouse-right → ry negative.
        const rx = reduced ? 0 : (y - 0.5) * 2 * MAX_TILT_DEG;
        const ry = reduced ? 0 : -(x - 0.5) * 2 * MAX_TILT_DEG;
        card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      });
    };
    const onEnter = () => {
      card.classList.add("is-tilting");
      card.style.setProperty("--scale", String(HOVER_SCALE));
    };
    const onLeave = () => {
      card.classList.remove("is-tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--scale", "1");
    };
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const tier = tierFor(stats);
  const isSpotlight = size === "spotlight";
  const initials = sportsperson.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className="block"
      style={
        {
          perspective: "1100px",
          transformStyle: "preserve-3d",
          transform: `rotate(${restingRotation}deg) translateY(${restingOffsetY}px)`,
          transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        } as React.CSSProperties
      }
    >
      <style>{`
        .sp-card {
          --rx: 0deg;
          --ry: 0deg;
          --scale: 1;
          transform: rotateX(var(--rx)) rotateY(var(--ry)) scale(var(--scale));
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.4s ease;
          will-change: transform;
        }
        .sp-card.is-tilting {
          transition: transform 0.06s linear, box-shadow 0.4s ease;
        }
        .sp-card-foil {
          background:
            linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.32) 50%, transparent 60%),
            linear-gradient(135deg, rgba(255, 184, 48, 0.18), transparent 40%, rgba(255,255,255,0.14) 70%, transparent);
          background-size: 200% 100%, 100% 100%;
          animation: sp-foil 4s linear infinite;
        }
        @keyframes sp-foil {
          from { background-position: 200% 0, 0 0; }
          to   { background-position: -200% 0, 0 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sp-card-foil { animation: none; }
        }
      `}</style>
      <Link
        href={`/despre-noi/sportivi/${sportsperson.slug}`}
        aria-label={`Vezi profilul ${sportsperson.name}`}
        className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-edusport-blue focus-visible:ring-offset-2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={cardRef}
          className={cn(
            "sp-card relative overflow-hidden rounded-xl bg-[#15217a]",
            isSpotlight ? "h-[360px] w-[260px]" : "h-[360px] w-full",
          )}
          style={{
            // Thin neutral hairline. The tier signal now comes from the
            // slanted ribbon down the left edge — the same SVG accent that
            // marks podium results on /despre-noi/realizari. Removing the
            // coloured ring stops the two tier indicators from competing.
            boxShadow:
              "0 16px 36px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.12)",
          }}
        >
          {/* Photo or initials fallback */}
          {sportsperson.photo?.url ? (
            <Image
              src={strapiMediaUrl(sportsperson.photo.url)}
              alt={sportsperson.photo.alternativeText ?? sportsperson.name}
              fill
              sizes={
                isSpotlight
                  ? "260px"
                  : "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              }
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(140deg, ${pickFallbackGradient(sportsperson.slug).from} 0%, ${pickFallbackGradient(sportsperson.slug).to} 100%)`,
              }}
            >
              <span className="select-none text-5xl font-semibold text-white/40">
                {initials}
              </span>
            </div>
          )}

          {/* Foil shimmer — spotlight only (too noisy on every grid card) */}
          {isSpotlight && (
            <div
              aria-hidden
              className="sp-card-foil pointer-events-none absolute inset-0 mix-blend-overlay"
            />
          )}

          {/* Slanted-line ribbon — same SVG accent as the podium result
              rows on /despre-noi/realizari (matching opacities 0.22 / 0.28
              / 0.32). Coloured via `currentColor` from the tier hex on the
              <svg>'s inline style. Only rendered when the athlete has at
              least one medal — non-medalists get a clean photo with no
              ribbon (the lines would just be noise without a tier signal). */}
          {tier.badgeText && (
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-[4] h-full w-[80px]"
              viewBox="0 0 80 100"
              preserveAspectRatio="none"
              fill="none"
              style={{ color: tier.color }}
            >
              <path d="M 50 -10 L 26 110" stroke="currentColor" strokeWidth="11" opacity="0.22" />
              <path d="M 67 -10 L 43 110" stroke="currentColor" strokeWidth="11" opacity="0.28" />
              <path d="M 79.5 -10 L 55.5 110" stroke="currentColor" strokeWidth="2" opacity="0.32" />
            </svg>
          )}

          {/* Top-row: medal count over the ribbon. Parallax forward via
              translateZ(20) so it lifts during the tilt. (Rank chip was
              removed — the position number didn't carry useful meaning.) */}
          {tier.badgeText && (
            <div
              aria-hidden
              className="absolute left-[14px] top-[14px] z-20 font-black leading-none"
              style={{
                transform: "translateZ(20px)",
                textShadow: "0 1px 4px rgba(0,0,0,0.55)",
              }}
            >
              <span className="block text-[24px] tracking-[-0.02em] text-white">
                {tier.badgeCount}×
              </span>
              <span
                className="mt-[3px] block text-[9px] uppercase tracking-[0.24em]"
                /* Bronze hex (#ea580c) reads brown against the dark photo
                   — swap to a lighter orange for legibility. */
                style={{
                  color: tier.color === "#ea580c" ? "#fdba74" : tier.color,
                }}
              >
                {tier.label}
              </span>
            </div>
          )}

          {/* Name block — translateZ(30) so it sits on top of the photo */}
          <div
            className="absolute inset-x-0 bottom-0 z-20 px-[14px] pb-[14px] pt-[60px]"
            style={{
              background:
                "linear-gradient(transparent, rgba(0,0,0,0.92) 60%)",
              transform: "translateZ(30px)",
            }}
          >
            <h4
              className={cn(
                "mb-[5px] font-bold leading-tight tracking-[-0.01em] text-white",
                isSpotlight ? "text-[22px]" : "text-[18px]",
              )}
            >
              {sportsperson.name}
            </h4>
            {sportsperson.activeSince && (
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                Membru din {sportsperson.activeSince.slice(0, 4)}
              </div>
            )}
            <div className="flex gap-[10px] border-t border-white/20 pt-[6px]">
              <div>
                <div
                  className="text-[17px] font-extrabold leading-none tracking-[-0.01em]"
                  style={{ color: tier.color }}
                >
                  {String(stats.totalCompetitions).padStart(2, "0")}
                </div>
                <div className="mt-[3px] text-[8px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Comp.
                </div>
              </div>
              <div>
                <div className="text-[17px] font-extrabold leading-none tracking-[-0.01em] text-white">
                  {stats.bestScore !== null
                    ? stats.bestScore.toFixed(2)
                    : "—"}
                </div>
                <div className="mt-[3px] text-[8px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Best
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

/**
 * Vibrant gradient palette for photo-less cards. Picked deterministically
 * from the athlete's slug so the same person always gets the same colours
 * across SSR and re-renders. Keeps the listing visually playful without
 * having to ask editors to upload a photo for every athlete.
 */
const FALLBACK_GRADIENTS: Array<{ from: string; to: string }> = [
  { from: "#f97316", to: "#db2777" }, // sunset (orange → pink)
  { from: "#0ea5e9", to: "#1e3a8a" }, // ocean (sky → indigo)
  { from: "#10b981", to: "#0f766e" }, // forest (emerald → teal)
  { from: "#d946ef", to: "#6d28d9" }, // berry (fuchsia → violet)
  { from: "#fbbf24", to: "#e11d48" }, // citrus (amber → rose)
  { from: "#6366f1", to: "#7c3aed" }, // sky (indigo → purple)
  { from: "#14b8a6", to: "#0e7490" }, // mint (teal → cyan)
  { from: "#fb7185", to: "#ea580c" }, // coral (rose → orange)
];

function pickFallbackGradient(seed: string): { from: string; to: string } {
  // Simple deterministic hash — sum of char codes is plenty for an
  // 8-bucket palette and survives across SSR/CSR identically.
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i)) | 0;
  return FALLBACK_GRADIENTS[Math.abs(hash) % FALLBACK_GRADIENTS.length];
}

export default SportspersonCard;
