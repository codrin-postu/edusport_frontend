"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import { type HeroVariant } from "./HeroVariant";

// WebGL hover-morph overlay for the wordmark — heavy (three.js), client-only,
// and only mounted on capable devices, so load it lazily with no SSR.
const HeroWordmarkMorph = dynamic(() => import("./HeroWordmarkMorph"), {
  ssr: false,
});

/**
 * Home hero. z-order: background (0) → weaving line (5) → EDUSPORT wordmark
 * (10) → eyebrow / CTA / next-event strip (30).
 *
 * `HeroVariant` lives in `./HeroVariant.ts` so server components can import it
 * (a `"use client"` export comes through as `undefined` on the server).
 */

export type { HeroVariant };
type Variant = HeroVariant;

const WORDMARK = "EDUSPORT";
// Indices of letters that sit IN FRONT of the weaving line. Mirrors the
// original `/homepage/blocks/HeroSection.tsx`: D (index 1) and O (index 5)
// pop forward; the rest of the letters render behind the line.
const LETTERS_IN_FRONT = new Set([1, 5]);

// ── Wordmark — `text-branding-font text-branding-xl` (same as the footer),
// so the letters scale via the project's clamp font-size and span close to
// edge-to-edge naturally.
//
// Each letter renders as its own `<span>` with its own `z-index` so the
// weaving line (z-5, a sibling) sits BEHIND every letter except D (1) and
// O (5), which pop forward at z-6. Same trick as the original hero.
//
// The fill (color or gradient via background-clip: text) is applied
// PER-SPAN rather than on the parent h1, because `background-clip: text`
// on a parent doesn't render into children that have their own stacking
// context (which the per-letter z-index creates).
//
// Variant E desktop: horizontal split — letters 0-3 dark navy, 4-7 white.
//   The split lands between S (3) and P (4) so no letter is half-cut.
// Variant E mobile: vertical split — each letter gets a vertical gradient
//   text fill so the top of every letter is dark (on cream half) and the
//   bottom is white (on dark half).
const Wordmark: React.FC<{
  variant: Variant;
  mobileMode?: boolean;
  videoOn?: boolean;
}> = ({ variant, mobileMode = false, videoOn = false }) => {
  return (
    <h1
      aria-label={WORDMARK}
      className="text-branding-font text-branding-xl text-center w-full select-none"
    >
      {WORDMARK.split("").map((letter, index) => (
        <span
          key={index}
          style={{
            position: "relative",
            zIndex: LETTERS_IN_FRONT.has(index) ? 6 : 4,
            transition: "color .7s ease",
            ...letterFillStyle(variant, index, mobileMode, videoOn),
          }}
        >
          {letter}
        </span>
      ))}
    </h1>
  );
};

export interface HeroNextEvent {
  title: string;
  dateLabel: string;
  location?: string;
  href: string;
}

interface HeroSectionProps {
  variant: Variant;
  motto?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  nextEvent?: HeroNextEvent | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ ctaLabel, ctaUrl, nextEvent }) => {
  // Retro hero is always the cream layout (variant B). The WebGL morph is left
  // completely untouched — it just receives the cream variant like before.
  const safeVariant: Variant = "B";
  const displayCtaLabel = ctaLabel ?? "Vezi cursurile";
  const displayCtaUrl = ctaUrl ?? "/cursuri";

  // Gate the WebGL wordmark morph to hover-capable, motion-OK, WebGL devices.
  // The static <Wordmark> underneath is the fallback everywhere else.
  const [showMorph, setShowMorph] = useState(false);
  const [morphReady, setMorphReady] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    // `?morph` forces the morph to mount (for the auto-play demo button) even on
    // touch / no-hover devices.
    const forced = new URLSearchParams(window.location.search).has("morph");
    setShowMorph(forced || (fine && !reduced && webgl));
  }, []);

  // Hero intro: the video (navy) plays ONCE for ~20s, then fades to the cream
  // hero and STAYS there — no loop (only a page reload replays it).
  // Reduced-motion skips the video entirely. `videoOn` drives the bg fade, the
  // wordmark ink, the nav-dark flag and every text/CTA colour swap.
  const [videoOn, setVideoOn] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVideoOn(true);
    const id = window.setTimeout(() => setVideoOn(false), 18000);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("lv2-hero-dark", videoOn);
    return () => document.documentElement.classList.remove("lv2-hero-dark");
  }, [videoOn]);

  const ink = videoOn ? "var(--color-retro-cream)" : "var(--color-navy)";

  // Home-hero nav states, read by the <style> block below (base retro nav is
  // global; these add the transparent-over-hero entrance, home only):
  //   • lv2-nav-entrance → slide-in entrance
  //   • lv2-hero-dark    → dark hero → white nav text
  //   • lv2-nav-solid    → past 20vh: solid bar slides in, text reverts to dark
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("lv2-nav", "lv2-nav-entrance");

    const onScroll = () => {
      html.classList.toggle("lv2-nav-solid", window.scrollY > window.innerHeight * 0.2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      html.classList.remove(
        "lv2-nav",
        "lv2-nav-entrance",
        "lv2-hero-dark",
        "lv2-nav-solid",
      );
    };
  }, [safeVariant]);

  return (
    // Inner wrapper uses overflow-x-clip (not overflow-hidden) so the
    // wordmark's 1% horizontal bleed clips on the x-axis only. `-mt-20` pulls
    // the hero up behind the fixed nav.
    <section className="relative h-[max(100svh,600px)] max-h-[1200px] -mt-20">
      <style>{`
        /* Nav transparent over hero → solid on scroll. Targets the shared
           Header's DOM via structure (no Header.tsx edits). */
        html.lv2-nav div:has(> header.bg-white) { background-color: transparent !important; }

        /* Main bar transparent; a white ::before grows DOWN from the top on
           scroll (stays inside the bar → never covers the black contact strip,
           never needs overflow:hidden → never clips the nav dropdown). */
        html.lv2-nav header.bg-white {
          background-color: transparent !important;
          position: relative !important;
          box-shadow: none !important;
          border-radius: 0 !important;   /* retro: square corners, not the rounded top */
          transition: box-shadow .2s ease;
        }
        html.lv2-nav header.bg-white > div { position: relative; z-index: 1; }
        html.lv2-nav header.bg-white::before {
          content: ""; position: absolute; left: 0; right: 0; top: 0; height: 0;
          /* Retro: the bar that slides in on scroll is cream, not white. */
          background: var(--color-retro-cream); z-index: 0; border-radius: inherit;
          transition: height .55s cubic-bezier(.45,0,.15,1), background-color .35s ease;
        }
        html.lv2-nav.lv2-nav-solid header.bg-white::before { height: 100%; }
        html.lv2-nav.lv2-nav-solid header.bg-white {
          box-shadow: 0 6px 24px rgba(0,0,0,.12);
          transition: box-shadow .35s ease .5s;   /* shadow waits for the white */
        }

        /* Dark hero (video phase or G): the top contact strip (phone/location)
           sits transparent over the hero — whiten it so it's readable on dark. */
        html.lv2-nav.lv2-hero-dark:not(.lv2-nav-solid) div:has(> header.bg-white) > div:first-child,
        html.lv2-nav.lv2-hero-dark:not(.lv2-nav-solid) div:has(> header.bg-white) > div:first-child * {
          color: #ffffff !important;
        }

        /* Dark hero variant (G): brand + nav links go white while transparent.
           CTA group (right) keeps its own pill. Light variants keep dark text. */
        html.lv2-nav.lv2-hero-dark:not(.lv2-nav-solid) header.bg-white > div > a,
        html.lv2-nav.lv2-hero-dark:not(.lv2-nav-solid) header.bg-white > div > a *,
        html.lv2-nav.lv2-hero-dark:not(.lv2-nav-solid) header.bg-white > div > div:nth-child(2),
        html.lv2-nav.lv2-hero-dark:not(.lv2-nav-solid) header.bg-white > div > div:nth-child(2) * {
          color: #ffffff !important;
        }
        /* …except the dropdown panel, which always has a white background —
           keep its text dark (more specific selector wins over the rule above). */
        html.lv2-nav.lv2-hero-dark:not(.lv2-nav-solid) header.bg-white > div > div:nth-child(2) .nav-dropdown-panel,
        html.lv2-nav.lv2-hero-dark:not(.lv2-nav-solid) header.bg-white > div > div:nth-child(2) .nav-dropdown-panel * {
          color: var(--color-ink) !important;
        }
        /* …but the promo tile sits on a dark image overlay — keep it cream
           always (higher specificity than the dark-panel rule above). */
        html.lv2-nav.lv2-hero-dark:not(.lv2-nav-solid) header.bg-white > div > div:nth-child(2) .nav-dropdown-panel .nav-promo,
        html.lv2-nav.lv2-hero-dark:not(.lv2-nav-solid) header.bg-white > div > div:nth-child(2) .nav-dropdown-panel .nav-promo * {
          color: var(--color-retro-cream) !important;
        }

        /* ── entrance (plays on each arrival) ──────────────────────────────
           black strip slides down, then brand → nav → CTA slide + fade in. */
        @keyframes lv2SlideDown { from { transform: translateY(-110%); } to { transform: translateY(0); } }
        @keyframes lv2SlideFade { from { transform: translateY(-150%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        html.lv2-nav-entrance div:has(> header.bg-white) > div:first-child {
          animation: lv2SlideDown .45s cubic-bezier(.2,.75,.25,1) both;
        }
        html.lv2-nav-entrance header.bg-white > div > *:nth-child(1) { animation: lv2SlideFade .5s cubic-bezier(.2,.75,.25,1) both .55s; }
        html.lv2-nav-entrance header.bg-white > div > *:nth-child(2) { animation: lv2SlideFade .5s cubic-bezier(.2,.75,.25,1) both .68s; }
        html.lv2-nav-entrance header.bg-white > div > *:nth-child(3) { animation: lv2SlideFade .5s cubic-bezier(.2,.75,.25,1) both .81s; }

        /* Hero motto + CTA rise gently in after the wordmark (the wordmark
           itself is NOT animated here so the WebGL morph is left undisturbed). */
        @keyframes lv2HeroRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .lv2-hero-rise { animation: lv2HeroRise .6s cubic-bezier(.2,.75,.25,1) both .35s; }
        @media (prefers-reduced-motion: reduce) { .lv2-hero-rise { animation: none; } }
      `}</style>
      <div className="relative h-full overflow-x-clip">
        {/* Background layer (cream) */}
        <Background variant={safeVariant} />
        {/* Background video + navy duotone — fades in during the video phase. */}
        <video
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${videoOn ? "opacity-100" : "opacity-0"}`}
          src="/hero-0803.mp4"
          autoPlay
          muted
          playsInline
          aria-hidden
        />
        <div
          className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ${videoOn ? "opacity-100" : "opacity-0"}`}
          style={{ background: "linear-gradient(rgba(14,26,60,.55), rgba(14,26,60,.72))" }}
          aria-hidden
        />

        <div className="relative h-full -translate-y-[5%] flex flex-col justify-center">
          {/* Small label above the wordmark — matches the nav brand style
              (Inter, normal weight, wide tracking, 70% navy). */}
          <p
            className="w-full text-center z-30 mb-3 uppercase font-normal select-none"
            style={{
              letterSpacing: "0.18em",
              fontSize: "clamp(11px, 1.2vw, 15px)",
              color: ink,
              opacity: videoOn ? 0.85 : 0.7,
              transition: "color .7s ease, opacity .7s ease",
            }}
          >
            Clubul Sportiv
          </p>

          {/* Wordmark — edge to edge. translateX(-1.5%) nudges it left so E bleeds off. */}
          <div
            className="w-full z-10 relative isolate"
            style={{ transform: "translateX(-1.5%)" }}
          >
            <div className="hidden md:block relative">
              {/* Static wordmark. Once the WebGL morph has painted its first
                  frame it becomes the invisible source of truth — still laid
                  out (sizes the container + measured by the morph) and in the
                  a11y/SEO tree, just faded out. Crossfade (not instant) so
                  there's never a flash of nothing during the handoff. */}
              <div
                className={`transition-opacity duration-300 ${
                  showMorph && morphReady ? "opacity-0" : "opacity-100"
                }`}
              >
                <Wordmark variant={safeVariant} videoOn={videoOn} />
              </div>
              {/* WebGL liquid-dilation morph — the visible wordmark on capable
                  devices; distorts outward around the cursor on hover. */}
              {showMorph && (
                <HeroWordmarkMorph variant={safeVariant} videoOn={videoOn} onReady={() => setMorphReady(true)} />
              )}
            </div>
            <div className="md:hidden">
              <Wordmark variant={safeVariant} mobileMode videoOn={videoOn} />
            </div>
          </div>

          {/* Action row — primary layers CTA + secondary Noutăți button.
              Replaces the old motto. Rises in gently after the wordmark. */}
          <div className="lv2-hero-rise w-full px-6 md:px-12 mt-8 md:mt-10 z-30 flex flex-col sm:flex-row items-center justify-center gap-4">
            <SpotlightButton
              layers
              layersFace={videoOn ? "cream" : "black"}
              href={displayCtaUrl}
              className="text-sm w-full sm:w-auto"
              umamiEvent="hero.cta_primary"
            >
              {displayCtaLabel}
            </SpotlightButton>
            <NextLink
              href="/noutati"
              data-umami-event="hero.cta_noutati"
              className={`inline-flex items-center justify-center w-full sm:w-auto border-[1.5px] bg-transparent px-8 py-3.5 text-sm font-bold uppercase tracking-[0.03em] transition-colors ${
                videoOn
                  ? "border-[var(--color-retro-cream)] text-retro-cream hover:bg-retro-cream hover:text-navy"
                  : "border-navy text-navy hover:bg-black hover:text-white"
              }`}
            >
              Noutăți
            </NextLink>
          </div>
        </div>

        {/* Next-event strip — pinned near the hero bottom, above the seam
            (no separator line; sits on the cream). */}
        {nextEvent && (
          <div className="hidden sm:block absolute left-0 right-0 bottom-[clamp(150px,16vw,210px)] z-30 px-6 md:px-12">
            <div className="max-w-content mx-auto flex items-center gap-3">
              <span className="shrink-0 text-3xs font-extrabold tracking-[0.08em] uppercase px-2 py-1 border-[1.5px] border-navy bg-mustard text-navy">
                Următorul eveniment
              </span>
              <span
                className="text-sm font-medium truncate"
                style={{ color: ink, transition: "color .7s ease" }}
              >
                {nextEvent.title} — {nextEvent.dateLabel}
                {nextEvent.location ? `, ${nextEvent.location}` : ""}
              </span>
              <span className="flex-1" />
              <NextLink
                href={nextEvent.href}
                className="link-underline-rust shrink-0 text-2xs font-bold uppercase tracking-[0.04em]"
                style={{ color: ink, transition: "color .7s ease" }}
              >
                Vezi
              </NextLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;

// ────────────────────────────────────────────────────────────────────────────
// Background layer — three variants, all absolutely positioned behind content
// ────────────────────────────────────────────────────────────────────────────

const Background: React.FC<{ variant: Variant }> = ({ variant }) => {
  switch (variant) {
    case "B":
      return <div className="absolute inset-0 z-0" style={{ background: "var(--color-cream)" }} />;
    case "E":
      return (
        <>
          <div
            className="absolute inset-0 z-0 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, var(--color-cream) 0%, var(--color-cream) 50%, var(--color-navy) 50%, var(--color-navy) 100%)",
            }}
          />
          <div
            className="absolute inset-0 z-0 md:hidden"
            style={{
              background:
                "linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream) 50%, var(--color-navy) 50%, var(--color-navy) 100%)",
            }}
          />
        </>
      );
    case "G":
      // Solid dark blue — the navy from the split (E) variant.
      return <div className="absolute inset-0 z-0" style={{ background: "var(--color-navy)" }} />;
  }
};

// ────────────────────────────────────────────────────────────────────────────
// Per-variant style helpers
// ────────────────────────────────────────────────────────────────────────────

const GRADIENT_TEXT_STYLE: React.CSSProperties = {
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
};

// Per-letter fill — applied to each individual <span> in the wordmark so
// gradient text works through the per-letter z-index stacking contexts.
function letterFillStyle(
  variant: Variant,
  index: number,
  mobileMode: boolean,
  videoOn = false,
): React.CSSProperties {
  switch (variant) {
    case "B":
      // Cream ink over the video phase, navy over the cream phase.
      return { color: videoOn ? "var(--color-retro-cream)" : "var(--color-navy)" };
    case "E":
      // Mobile: vertical split — top of every letter on cream half (dark
      // text), bottom on dark half (cream text). Per-letter vertical
      // gradient with 50% hard stop matches the seam through each glyph.
      if (mobileMode) {
        return {
          ...GRADIENT_TEXT_STYLE,
          backgroundImage:
            "linear-gradient(180deg, var(--color-navy) 0%, var(--color-navy) 50%, var(--color-cream) 50%, var(--color-cream) 100%)",
        };
      }
      // Desktop: horizontal split — letters 0-3 (E D U S) on cream half
      // get dark navy; 4-7 (P O R T) on dark half get cream. The seam
      // falls between S and P so no single letter is sliced.
      return { color: index < 4 ? "var(--color-navy)" : "var(--color-cream)" };
    case "G":
      // Cream wordmark on the dark-blue background (no gradient).
      return { color: "var(--color-cream)" };
  }
}

