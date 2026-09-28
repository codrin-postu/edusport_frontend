import React from "react";
import { cn } from "@/utils/cn";

// Parallelogram: flat top and bottom, both side edges slanting right.
const SLANTED_CLIP = "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)";

const TONE = {
  accent: "bg-accent text-primary-on-dark",
  highlight: "bg-accent-on-dark text-primary",
  neutral: "bg-surface-subtle text-primary",
  outline: "border-retro border-accent text-accent",
} as const;

// Square chips; slanted ones get extra side padding so the text clears the tips.
const SIZE = {
  sm: { square: "px-2 py-1", slanted: "px-3 py-1" },
  md: { square: "px-3 py-2", slanted: "px-4 py-2" },
} as const;

type ChipProps = {
  /** accent: rust fill. highlight: mustard fill. neutral: grey. outline: rust border. */
  tone?: keyof typeof TONE;
  /** sm (default): inline tags. md: status badges on cards. */
  size?: keyof typeof SIZE;
  /** square (default) or slanted (the former Pill parallelogram). */
  shape?: "square" | "slanted";
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "className" | "children">;

/** Tag, badge or status label. Always text-label caps. */
export default function Chip({
  tone = "neutral",
  size = "sm",
  shape = "square",
  className,
  style,
  children,
  ...rest
}: ChipProps) {
  return (
    <span
      className={cn(
        "text-label inline-flex items-center gap-1 whitespace-nowrap",
        TONE[tone],
        SIZE[size][shape],
        className,
      )}
      style={shape === "slanted" ? { clipPath: SLANTED_CLIP, ...style } : style}
      {...rest}
    >
      {children}
    </span>
  );
}

export { Chip };
