"use client";

import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import React from "react";

/* ------------------------------------------------------------------ */
/* Path definitions - all in a 100×200 viewBox                         */
/* ------------------------------------------------------------------ */

// Each path goes top-to-bottom within the 100×200 space.
// Origin: top-center area. All hand-crafted cubic beziers.

export const PATHS: Record<string, string> = {
  // A smooth curve right then kinks back left - the classic "3" shape
  "3-turn":
    "M 50 10 C 75 10 85 35 75 55 C 65 75 45 78 45 78 C 45 78 65 82 75 105 C 85 128 70 155 45 165",

  // Like 3-turn but the kink goes the other way (outward bracket)
  bracket:
    "M 50 10 C 25 10 15 35 25 55 C 35 75 55 78 55 78 C 55 78 35 82 25 105 C 15 128 30 155 55 165",

  // Sweeping arc down then a small tight loop at the bottom
  loop:
    "M 60 10 C 85 20 90 60 75 90 C 90 92 100 115 95 135 C 90 155 70 168 50 168 C 30 168 15 155 15 135 C 15 115 30 105 50 100 C 65 97 75 105 72 120 C 69 133 58 137 50 136 C 42 135 36 128 38 120 C 40 113 48 110 54 114 C 59 117 60 125 55 128 C 51 130 46 128 47 124",

  // A single gentle C-curve (one arc, no kink)
  "c-step":
    "M 65 10 C 90 25 90 80 65 100 C 90 120 90 160 65 175",

  // An S-curve - curves one way then the other
  "s-step":
    "M 40 10 C 75 15 80 50 60 75 C 40 100 25 130 60 165",

  // Like bracket but with the kink reversed at the inflection
  counter:
    "M 50 10 C 25 10 15 40 30 65 C 40 82 55 85 55 85 C 55 85 30 90 20 115 C 10 140 25 165 55 175",

  // Two 3-turns back to back - curves right, kinks, curves left, kinks again
  "3-turn-combo":
    "M 30 5 C 60 5 72 28 62 48 C 52 68 35 70 35 70 C 35 70 55 74 68 95 C 80 115 72 138 55 150 C 38 162 20 158 20 158 C 20 158 38 162 50 182 C 62 200 58 175 45 190",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export type SkatingFigure =
  | "3-turn"
  | "bracket"
  | "loop"
  | "c-step"
  | "s-step"
  | "counter";

interface SkatingFigureLineProps {
  /** Which figure to draw */
  figure: SkatingFigure;
  /** External pathLength MotionValue (0–1) for scroll-driven animation.
   *  If omitted the path is drawn statically at full length. */
  pathLength?: MotionValue<number>;
  /** Rotate the figure (degrees). Applied around its own center. */
  rotate?: number;
  /** Absolute position within the parent (px). */
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  /** Width of the rendered SVG in px (height = width * 2). Default 80. */
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  className?: string;
}

export const SkatingFigureLine: React.FC<SkatingFigureLineProps> = ({
  figure,
  pathLength,
  rotate = 0,
  top,
  left,
  right,
  bottom,
  size = 80,
  strokeColor = "white",
  strokeWidth = 1.8,
  strokeOpacity = 0.6,
  className,
}) => {
  const d = PATHS[figure];
  // Normalize strokeWidth so it renders at the same physical pixel thickness
  // regardless of size. viewBox is 100 units wide → scale factor = 100 / size.
  const normalizedStrokeWidth = (strokeWidth / size) * 100;

  return (
    <div
      aria-hidden
      className={`absolute pointer-events-none ${className ?? ""}`}
      style={{
        top,
        left,
        right,
        bottom,
        width: size,
        height: size * 2,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <svg
        viewBox="0 0 100 200"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        fill="none"
      >
        <motion.path
          d={d}
          stroke={strokeColor}
          strokeWidth={normalizedStrokeWidth}
          strokeLinecap="round"
          strokeOpacity={strokeOpacity}
          style={{ pathLength: pathLength ?? 1 }}
        />
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scroll-driven wrapper - convenience component                        */
/* ------------------------------------------------------------------ */

interface ScrollSkatingFigureProps extends SkatingFigureLineProps {
  /** The section ref to track scroll against */
  sectionRef: React.RefObject<HTMLDivElement | null>;
  /** Scroll progress range [start, end] over which the path draws. Default [0, 0.5] */
  scrollRange?: [number, number];
  /** Framer offset for useScroll. Default ["start 40%", "end 20%"] */
  scrollOffset?: [string, string];
}

export const ScrollSkatingFigure: React.FC<ScrollSkatingFigureProps> = ({
  sectionRef,
  scrollRange = [0, 0.5],
  scrollOffset = ["start 40%", "end 20%"],
  ...rest
}) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offset: scrollOffset as any,
  });
  const pathLength = useTransform(scrollYProgress, scrollRange, [0, 1]);

  return <SkatingFigureLine {...rest} pathLength={pathLength} />;
};
