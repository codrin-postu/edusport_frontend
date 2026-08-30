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
  /**
   * Retro pilot skin (landing-v2 only). Keeps the exact card layout + the
   * cursor-tracking 3D tilt, but:
   *  - square corners + an 8px navy edge (frames the photo),
   *  - a hard offset shadow at rest that blooms into a soft "lift" shadow on
   *    hover — carried on the STATIC outer wrapper so it never tilts with the
   *    card (a shadow shouldn't rotate),
   *  - a gentler tilt (6° / 1.03) so a corner never lifts past its shadow,
   *  - no photo overlays: the left tier ribbon + top-left medal block are
   *    dropped, and medal count moves into the bottom stat bar as "Medalii".
   */
  retro?: boolean;
  /**
   * Move the medal count out of the top-left corner (and drop the left ribbon)
   * into the bottom stat bar as a "Medalii" stat — independent of the retro
   * skin, so the legacy card can use the new medal placement too.
   */
  medalsInStats?: boolean;
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
      color: "var(--color-medal-gold)",
      label: "Aur",
      badgeText: "AUR",
      badgeCount: stats.goldCount,
    };
  }
  if (stats.silverCount > 0) {
    return {
      color: "var(--color-medal-silver)",
      label: "Argint",
      badgeText: "ARG",
      badgeCount: stats.silverCount,
    };
  }
  if (stats.bronzeCount > 0) {
    return {
      color: "var(--color-medal-bronze)",
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
  retro = false,
  medalsInStats = false,
}: Props) {
  // Medals shown in the bottom bar (instead of the top corner) whenever the
  // retro skin is on OR the caller opts in explicitly.
  const bottomMedals = retro || medalsInStats;
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Tracks whether the pointer is currently over the card. A trailing rAF
    // scheduled by the last mousemove can run *after* mouseleave; without this
    // guard it would re-apply a tilt and leave the card stuck.
    let over = false;

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!over) return; // pointer already left — don't tilt
        // Tilt math: corner nearest cursor pops toward viewer.
        // CSS rotateX(+) leans the bottom forward; rotateY(+) leans the left
        // forward. So mouse-top → rx negative, mouse-right → ry negative.
        const maxTilt = retro ? 5 : MAX_TILT_DEG;
        const rx = reduced ? 0 : (y - 0.5) * 2 * maxTilt;
        const ry = reduced ? 0 : -(x - 0.5) * 2 * maxTilt;
        card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      });
    };
    const onEnter = () => {
      over = true;
      card.classList.add("is-tilting");
      card.style.setProperty("--scale", String(retro ? 1.03 : HOVER_SCALE));
    };
    const onLeave = () => {
      // Cancel any queued tilt frame so a late rAF can't re-apply a tilt after
      // the pointer has left — the card always returns flat.
      over = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
  }, [retro]);

  const tier = tierFor(stats);
  // Retro "Medalii" stat: total podium medals, tinted by tier (bronze swapped
  // to a lighter orange for legibility on the dark name-block gradient).
  const medalTotal = stats.goldCount + stats.silverCount + stats.bronzeCount;
  const medalColor =
    medalTotal === 0
      ? "var(--color-cream)"
      : tier.color === "var(--color-medal-bronze)"
        ? "var(--color-orange)"
        : tier.color;
  const isSpotlight = size === "spotlight";
  const initials = sportsperson.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className={cn("block", retro && "sp-wrap-retro")}
      style={
        {
          perspective: retro ? "1500px" : "1100px",
          transformStyle: "preserve-3d",
          transform: `rotate(${restingRotation}deg) translateY(${restingOffsetY}px)`,
          transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        } as React.CSSProperties
      }
    >
      <style>{`
        /* Retro drop shadow lives on the static wrapper so it stays flat
           while the inner card tilts. Hard offset at rest → soft lift on
           hover (card picks up toward the viewer). */
        /* Soft blurred shadow, ON THE CARD (not the wrapper) so it tilts with
           the card and hugs it — same as the live /sportivi card — instead of
           sitting flat behind and reading as a detached shape. Grows on hover. */
        .sp-card-retro {
          box-shadow: 4px 8px 16px rgba(14,26,60,0.25);
        }
        .sp-card-retro.is-tilting {
          box-shadow: 8px 20px 26px rgba(14,26,60,0.38);
        }
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
      `}</style>
      <Link
        href={`/despre-noi/sportivi/${sportsperson.slug}`}
        aria-label={`Vezi profilul ${sportsperson.name}`}
        className={cn(
          "group block focus:outline-none focus-visible:ring-2 focus-visible:ring-edusport-blue focus-visible:ring-offset-2",
          retro ? "rounded-[12px]" : "rounded-xl",
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={cardRef}
          className={cn(
            "sp-card relative bg-navy",
            retro
              ? "sp-card-retro rounded-[12px] overflow-hidden"
              : "rounded-xl overflow-hidden",
            isSpotlight ? "h-[360px] w-[260px]" : "h-[360px] w-full",
          )}
          style={{
            // Non-retro: soft drop shadow + white hairline. Retro: the navy
            // "border" is an 8px padding FRAME with a rounded OUTER corner
            // (rounded-[12px]); the inner layer below is square-clipped, so
            // only the outside is rounded, the inside stays square.
            boxShadow: retro
              ? undefined
              : "0 16px 36px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.12)",
          }}
        >
          {/* Inner content layer — clips the photo to the card's rounding. */}
          <div
            className={cn(
              "relative h-full w-full overflow-hidden",
              retro ? "rounded-[12px]" : "rounded-xl",
            )}
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
          {!bottomMedals && tier.badgeText && (
            <div
              aria-hidden
              className="absolute left-[14px] top-[14px] z-20 font-black leading-none"
              style={{
                transform: "translateZ(20px)",
                textShadow: "0 1px 4px rgba(0,0,0,0.55)",
              }}
            >
              <span className="block text-2xl tracking-[-0.02em] text-white">
                {tier.badgeCount}×
              </span>
              <span
                className="mt-[3px] block text-3xs uppercase tracking-[0.24em]"
                /* Bronze (--color-medal-bronze) reads brown against the dark
                   photo — swap to a lighter orange for legibility. */
                style={{
                  color:
                    tier.color === "var(--color-medal-bronze)"
                      ? "var(--color-orange)"
                      : tier.color,
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
                isSpotlight ? "text-xl" : "text-lg",
              )}
            >
              {sportsperson.name}
            </h4>
            {sportsperson.activeSince && (
              <div className="mb-2 text-3xs font-semibold uppercase tracking-[0.16em] text-white/55">
                Membru din {sportsperson.activeSince.slice(0, 4)}
              </div>
            )}
            <div className="flex gap-[10px] border-t border-white/20 pt-[6px]">
              <div>
                <div
                  className="text-lg font-extrabold leading-none tracking-[-0.01em]"
                  style={{ color: tier.color }}
                >
                  {String(stats.totalCompetitions).padStart(2, "0")}
                </div>
                <div className="mt-[3px] text-3xs font-semibold uppercase tracking-[0.18em] text-white/65">
                  Comp.
                </div>
              </div>
              {bottomMedals && (
                <div>
                  <div
                    className="text-lg font-extrabold leading-none tracking-[-0.01em]"
                    style={{ color: medalColor }}
                  >
                    {String(medalTotal).padStart(2, "0")}
                  </div>
                  <div className="mt-[3px] text-3xs font-semibold uppercase tracking-[0.18em] text-white/65">
                    Medalii
                  </div>
                </div>
              )}
              <div>
                <div className="text-lg font-extrabold leading-none tracking-[-0.01em] text-white">
                  {stats.bestScore !== null
                    ? stats.bestScore.toFixed(2)
                    : "—"}
                </div>
                <div className="mt-[3px] text-3xs font-semibold uppercase tracking-[0.18em] text-white/65">
                  Best
                </div>
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
 * Retro brand gradient palette for photo-less cards. Picked deterministically
 * from the athlete's slug so the same person always gets the same colours
 * across SSR and re-renders. Each pair anchors on a dark/saturated brand tone
 * (navy/blue/rust) so the white name text over the bottom overlay stays legible.
 * Values mirror the globals.css @theme tokens (navy #0e1a3c, blue #2138b8,
 * rust #be3330, gold #fbbf24).
 */
const FALLBACK_GRADIENTS: Array<{ from: string; to: string }> = [
  { from: "#0e1a3c", to: "#2138b8" }, // navy → blue
  { from: "#2138b8", to: "#0e1a3c" }, // blue → navy
  { from: "#0e1a3c", to: "#be3330" }, // navy → rust
  { from: "#be3330", to: "#0e1a3c" }, // rust → navy
  { from: "#2138b8", to: "#be3330" }, // blue → rust
  { from: "#be3330", to: "#fbbf24" }, // rust → gold
  { from: "#0e1a3c", to: "#fbbf24" }, // navy → gold
  { from: "#2138b8", to: "#fbbf24" }, // blue → gold
];

function pickFallbackGradient(seed: string): { from: string; to: string } {
  // Simple deterministic hash — sum of char codes is plenty for an
  // 8-bucket palette and survives across SSR/CSR identically.
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i)) | 0;
  return FALLBACK_GRADIENTS[Math.abs(hash) % FALLBACK_GRADIENTS.length];
}

export default SportspersonCard;
