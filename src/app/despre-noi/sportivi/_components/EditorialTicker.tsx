"use client";

import React from "react";
import { cn } from "@/utils/cn";

/**
 * Horizontally-scrolling marquee strip used between sections of the sportivi
 * index. CSS-animation only — no JS, no scroll listeners. The items are
 * rendered twice in a row so the `translateX(-50%)` loop is seamless.
 *
 * Two variants:
 *   - "white": white background, brand-blue ★ prefix, dark text.
 *   - "gold":  medal-yellow background, dark ◆ prefix.
 *
 * Both match the exact proportions (13px Inter 800, 0.3em tracking, 28px
 * item padding) of the editorial ticker on the magazine mockup.
 *
 * Marked `aria-hidden` because the ticker is decorative — the same numbers
 * are shown again as real text in the spotlight section.
 */

interface Props {
  items: string[];
  variant?: "white" | "gold" | "blue" | "black";
  /** Animation duration in seconds (lower = faster). Default 36s. */
  durationSec?: number;
  className?: string;
}

export function EditorialTicker({
  items,
  variant = "white",
  durationSec = 36,
  className,
}: Props) {
  if (items.length === 0) return null;

  const colorClasses =
    variant === "gold"
      ? "bg-gold text-gray-900"
      : variant === "blue"
        ? "bg-edusport-blue text-white"
        : variant === "black"
          ? "bg-black text-white"
          : "bg-white text-gray-900";

  const prefixClasses =
    variant === "gold"
      ? "text-gray-900"
      : variant === "blue" || variant === "black"
        ? "text-gold"
        : "text-edusport-blue";

  const prefix = variant === "gold" ? "◆ " : "★ ";

  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden whitespace-nowrap py-3 select-none",
        colorClasses,
        className,
      )}
    >
      <div
        className="inline-block motion-reduce:!animate-none"
        style={{
          animation: `edusport-ticker-scroll ${durationSec}s linear infinite`,
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-block px-7 text-sm font-extrabold uppercase tracking-[0.3em]"
          >
            <span className={prefixClasses}>{prefix}</span>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes edusport-ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default EditorialTicker;
