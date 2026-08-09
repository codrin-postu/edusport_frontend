import React from "react";

/**
 * Hero → registration seam for /landing-v2 (retro pilot).
 *
 * A solid band of parallel warm "tube-lines" (mustard / orange / brick /
 * burgundy) that TOUCH (no cream gaps), flowing across the width with an
 * irregular wave and resolving into the pastel registration fill below.
 *
 * The paths run from x=-80 to x=1280 (past both viewport edges) and the SVG
 * uses `overflow: visible`, so the stroke END-CAPS sit off-screen — you never
 * see a flat cut edge at the left/right of the screen (the frame's
 * `overflow-x-clip` hides the overshoot). Each stripe is the same wave shifted
 * vertically by a constant, so they stay parallel with a constant gap.
 */

// Irregular multi-bump wave; each stripe is this shifted up by `dy`.
const wave = (dy: number) =>
  `M-80,${150 - dy} C120,${188 - dy} 250,${116 - dy} 430,${144 - dy} ` +
  `C600,${170 - dy} 700,${118 - dy} 880,${150 - dy} ` +
  `C1030,${176 - dy} 1150,${124 - dy} 1280,${152 - dy}`;

// Solid band: stroke === pitch so the stripes TOUCH — no cream gaps.
const SEAM_SW = 34;
const STRIPES: { color: string; dy: number }[] = [
  { color: "var(--color-burgundy)", dy: 0 },       // nearest the pastel fill
  { color: "var(--color-rust)", dy: SEAM_SW },
  { color: "var(--color-orange)", dy: SEAM_SW * 2 },
  { color: "var(--color-mustard)", dy: SEAM_SW * 3 }, // top / cream side
];

// Pastel body fill — from the bottom stripe's wave down to the bottom edge.
const FILL = `${wave(0)} L1280,200 L-80,200 Z`;

const RegistrationWaveDivider: React.FC = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 bottom-full translate-y-[1px] z-[1] h-[clamp(140px,16vw,210px)] select-none"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="block"
        style={{ overflow: "visible" }}
      >
        {/* Pastel section body */}
        <path d={FILL} fill="var(--color-pastel)" />
        {/* Solid warm band — stripes touch, ends run off-screen */}
        <g fill="none" strokeWidth={SEAM_SW} strokeLinecap="butt">
          {STRIPES.map((s) => (
            <path key={s.color} d={wave(s.dy)} stroke={s.color} />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default RegistrationWaveDivider;
