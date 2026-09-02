"use client";

import React, { useMemo } from "react";
import Link from "@/components/ui/link";
import type { HomepageAboutPanel } from "../_types";

// About Us: cream surface, League Spartan headings, a brush-masked skater in
// section 1, and one stepped 5-stripe ribbon (concentric arcs = constant gap)
// threading the sections. Section 2 is pulled UP into the ribbon's empty area;
// section 3 is reversed (content right) and nudged down.

interface Panel {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
}

const DEFAULT_PANELS: Panel[] = [
  {
    eyebrow: "Cine suntem",
    heading: "Asociație non-profit\npentru sport și educație",
    body: "Fondată în 2012, EduSport este o asociație non-profit dedicată dezvoltării sportive și educative a tinerilor - de la primii pași pe gheață până la podiumuri naționale.",
    ctaLabel: "Despre noi",
    ctaUrl: "/despre-noi",
  },
  {
    eyebrow: "Echipa noastră",
    heading: "Antrenori dedicați,\ncursanți motivați",
    body: "Patru antrenori certificați FRPA, fiecare cu o poveste proprie pe gheață. Împreună ghidează peste 50 de cursanți în 6 grupe.",
    ctaLabel: "Cunoaște echipa",
    ctaUrl: "/despre-noi/echipa",
  },
  {
    eyebrow: "Realizările noastre",
    heading: "32 de medalii\nși tot înainte",
    body: "De la primul campionat național la competiții internaționale, cursanții EduSport au urcat pe podium de 32 de ori în 8 ani.",
    ctaLabel: "Vezi realizările",
    ctaUrl: "/despre-noi/realizari",
  },
];

function resolvePanels(cms: HomepageAboutPanel[] | null | undefined): Panel[] {
  if (!cms) return DEFAULT_PANELS;
  return DEFAULT_PANELS.map((def, i) => {
    const p = cms[i];
    if (!p) return def;
    return {
      eyebrow: p.eyebrow?.trim() || def.eyebrow,
      heading: p.heading?.trim() || def.heading,
      body: p.body?.trim() || def.body,
      ctaLabel: p.ctaLabel?.trim() || def.ctaLabel,
      ctaUrl: p.ctaUrl?.trim() || def.ctaUrl,
    };
  });
}

// Ribbon geometry — identical to the mockup's `ribbon(el, 1)`.
const RIBBON_COLS = [
  "var(--color-mustard)",
  "var(--color-orange)",
  "var(--color-rust)",
  "var(--color-burgundy)",
  "var(--color-navy)",
];
function ribbonPaths(): string[] {
  const p = 44, R1 = 220, R2 = 44, Yt = 22, Ye = 560, hx = 730, W = 1200;
  // The ribbon container is capped at max-w-[1600px] so the lines don't drop
  // too far on ultra-wide screens. To keep the horizontals reaching the actual
  // screen edges past that cap, over-extend the two horizontal ends well beyond
  // the viewBox; the desktop <svg> renders with overflow visible and the
  // section clips at the viewport, so the extra just fills the side gaps.
  const EXT = 2000;
  const out: string[] = [];
  for (let k = 0; k < 5; k++) {
    const yT = Yt + k * p;
    const r1 = R1 - k * p;
    const r2 = R2 + k * p;
    out.push(
      `M${-EXT},${yT} H${hx} a${r1},${r1} 0 0 1 ${r1},${r1} V${Ye} a${r2},${r2} 0 0 0 ${r2},${r2} H${W + EXT}`,
    );
  }
  return out;
}
// Stroke is a touch WIDER than the 44 pitch so adjacent concentric stripes
// overlap by ~1px each — otherwise their touching edges anti-alias on the
// curves and the cream background shows through as thin white seams.
const RIBBON_SW = 46;

// Mobile ribbon — a TALL, mostly-vertical thread for the stacked layout: a
// horizontal start high up, a first rounded turn, a long vertical down the
// right side, then a second rounded turn to horizontal low down (behind
// section 3). Separate geometry from the wide desktop ribbon.
function ribbonPathsMobile(): string[] {
  const p = 16, R1 = 76, R2 = 76, Yt = 40, Ye = 1180, hx = 300, W = 400, EXT = 800;
  const out: string[] = [];
  for (let k = 0; k < 5; k++) {
    const yT = Yt + k * p;
    const r1 = R1 - k * p;
    const r2 = R2 + k * p;
    out.push(
      `M${-EXT},${yT} H${hx} a${r1},${r1} 0 0 1 ${r1},${r1} V${Ye} a${r2},${r2} 0 0 0 ${r2},${r2} H${W + EXT}`,
    );
  }
  return out;
}
const RIBBON_SW_MOBILE = 17;

interface AboutUsSectionProps {
  panels?: HomepageAboutPanel[] | null;
}

const AboutUsSection: React.FC<AboutUsSectionProps> = ({ panels: cmsPanels }) => {
  const PANELS = useMemo(() => resolvePanels(cmsPanels), [cmsPanels]);
  const paths = useMemo(ribbonPaths, []);
  const mobilePaths = useMemo(ribbonPathsMobile, []);

  return (
    <section className="relative bg-retro-cream overflow-hidden py-6 md:py-10">
      {/* Mobile: the ribbon sits as a faint, out-of-flow background (doesn't
          push any content). Desktop uses the in-flow full-bleed ribbon below. */}
      <svg
        viewBox="0 0 400 1400"
        preserveAspectRatio="xMidYMin meet"
        aria-hidden
        className="md:hidden absolute inset-x-0 top-0 w-full h-auto opacity-[0.12] pointer-events-none z-0 overflow-visible"
      >
        {mobilePaths.map((d, k) => (
          <path key={k} d={d} fill="none" stroke={RIBBON_COLS[k]} strokeWidth={RIBBON_SW_MOBILE} />
        ))}
      </svg>

      <div className="max-w-content mx-auto relative z-[1]">
        {/* ── Section 1 — content + brush-masked skater ── */}
        <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-14 py-10 px-6 md:px-16">
          <div className="max-w-[620px]">
            <Content panel={PANELS[0]!} />
          </div>
        </div>

        {/* ── Ribbon (desktop) — full-bleed to the screen edges, uniform scale.
             The horizontal segments start/end at the viewport edge; the SVG
             breaks out of the 1040 container via the left-1/2 / w-screen trick. */}
        <div className="hidden md:block relative left-1/2 -translate-x-1/2 w-screen max-w-[1600px]">
          <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" className="block w-full h-auto overflow-visible" aria-hidden>
            {paths.map((d, k) => (
              <path key={k} d={d} fill="none" stroke={RIBBON_COLS[k]} strokeWidth={RIBBON_SW} />
            ))}
          </svg>
        </div>

        {/* ── Section 2 — pulled up into the ribbon's empty area (scales with
             the full-bleed ribbon height: ~-62% of ribbon height = -41vw) ── */}
        <div className="relative z-[2] min-h-[360px] flex items-center py-10 px-6 md:px-16 mt-0 md:[margin-top:max(-656px,-41vw)]">
          <div className="max-w-[490px]">
            <Content panel={PANELS[1]!} accent />
          </div>
        </div>

        {/* ── Section 3 — reversed (content right), nudged down.
             The ribbon is full-bleed (its height scales with the viewport
             width) and section 2 is pulled UP by -41vw, so section 3's top must
             also scale with vw or the ribbon's tall right-side vertical rides
             over this content on very wide screens. `max(2.75rem, 41vw - 320px)`
             keeps the tuned 44px on ≤~md and grows the clearance beyond that so
             section 3 always sits clear of the lines. The ribbon width is
             capped at 1600px (see above), so the clearance is clamped at the
             matching 336px (41vw-320px at 1600) — beyond 1600 nothing scales,
             so section 3 doesn't drift ever further down. ── */}
        <div className="min-h-[360px] flex items-center md:justify-end py-10 px-6 md:px-16 mt-0 md:[margin-top:clamp(2.75rem,calc(41vw_-_320px),336px)] text-left md:text-right">
          <div className="max-w-[490px] md:ml-auto">
            <Content panel={PANELS[2]!} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;

// ─────────────────────────────────────────────────────────────────────────────

const Content: React.FC<{ panel: Panel; accent?: boolean }> = ({ panel, accent = false }) => (
  <>
    <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy mb-3">
      {panel.eyebrow}
    </div>
    <h2
      className="font-display text-display-md font-black text-navy tracking-[-0.5px] mb-3.5"
      style={{ lineHeight: accent ? 1.3 : 0.98 }}
    >
      {panel.heading.split("\n").map((line, j) => (
        <React.Fragment key={j}>
          {j > 0 && <br />}
          {accent ? (
            <span className="box-decoration-clone bg-mustard px-1.5">{line}</span>
          ) : (
            line
          )}
        </React.Fragment>
      ))}
    </h2>
    <p className="text-sm leading-relaxed text-navy/60 max-w-[440px] mb-5">{panel.body}</p>
    <Link
      href={panel.ctaUrl}
      className="link-underline-rust inline-block w-fit text-[12.5px] font-bold uppercase tracking-[0.04em] text-navy"
    >
      {panel.ctaLabel}
    </Link>
  </>
);
