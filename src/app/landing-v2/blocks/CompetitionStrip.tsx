"use client";

import { useEffect, useRef } from "react";
import { strapiMediaUrl } from "@/lib/strapi-article";
import type { StrapiMediaImage } from "@/lib/strapi-article";

/**
 * Horizontal-scroll image strip — direct port of the demo at
 * https://scroll-driven-animations.style/demos/horizontal-section/css/
 *
 * Demo's mechanism, used here verbatim:
 *
 *   #sectionPin            height 500vh, overflow visible, view-timeline
 *   .pin-wrap-sticky       100vh × 100vw, position sticky top:0
 *   .pin-wrap              250vmax wide, animated via the view-timeline,
 *                          translates from 0 to translateX(-100% + 100vw)
 *   .pin-wrap > *          min-width 60vmax, padding 0 5vmax
 *   img                    height 80vh, width auto, object-fit cover
 *
 * Our adaptations:
 *   - Shows 3 images (heading + 3). Track width is `max-content`, so it fits
 *     the content exactly regardless of count/size; the pan translates by
 *     (content width − 100vw) — no manual vmax tuning per image count.
 *   - Section height 500vh sets the pan-per-scroll pacing (tunable).
 *   - Sticky wrapper pins at `top: 80px` (below the site's fixed nav) and
 *     is `calc(100vh - 80px)` tall so images can never hide behind the header.
 *   - Images: near full-screen height (82vh); square on desktop, turning
 *     portrait on narrow screens (`width = min(82vh, 86vw)`), object-fit cover.
 *   - Background is the unified deep navy (`--color-navy`) instead of the
 *     demo's warm beige.
 *
 * Browser support: Chrome / Edge / Safari TP / Opera (Chromium 115+).
 * Firefox lacks `animation-timeline: view()` — the strip degrades to a
 * static row clipped by the sticky wrapper's `overflow-x: hidden`.
 *
 * Using plain <img> instead of next/image so external placeholder hosts
 * (Unsplash) don't require `next.config.ts` remotePatterns changes.
 */

const STRIP_BG = "var(--color-navy)";
const HEADER_OFFSET_PX = 80;

interface CompetitionStripProps {
  images: StrapiMediaImage[];
}

export default function CompetitionStrip({ images }: CompetitionStripProps) {
  // Refs on both desktop + mobile sections so we cover whichever is rendered
  // at the current breakpoint. The observer flips a class on <html> while
  // either section is in view; CSS in the <style> block below inverts the
  // global header to dark-navy while that class is set.
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const NAV_DARK_CLASS = "lv2-nav-dark";
    let intersectingCount = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) intersectingCount += 1;
          else intersectingCount = Math.max(0, intersectingCount - 1);
        }
        if (intersectingCount > 0) html.classList.add(NAV_DARK_CLASS);
        else html.classList.remove(NAV_DARK_CLASS);
      },
      // Shrink the detection zone to the top ~10% of the viewport so the nav
      // only flips to the strip colour once the section has scrolled right up
      // to the nav — not while it's still filling the lower screen. Tune -90%.
      { threshold: 0, rootMargin: "0px 0px -90% 0px" },
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => {
      io.disconnect();
      html.classList.remove(NAV_DARK_CLASS);
    };
  }, []);

  if (!images.length) return null;
  // Show at most 3 images.
  const shown = images.slice(0, 3);
  return (
    <>
      <style>{`
        /* Nav inversion while the strip is in view. Toggled by the
           IntersectionObserver above (adds .lv2-nav-dark on html).
           Targets the global Header's white nav bar (header.bg-white) and
           its text. Smooth-transitions in both directions. */
        header.bg-white {
          transition: background-color 0.35s ease, color 0.35s ease !important;
        }
        html.lv2-nav-dark header.bg-white {
          background-color: ${STRIP_BG} !important;
        }
        html.lv2-nav-dark header.bg-white * {
          color: white !important;
        }
        /* …except the dropdown panel — it always has a white background, so its
           text must stay dark (more specific selector wins over the rule above). */
        html.lv2-nav-dark header.bg-white .nav-dropdown-panel,
        html.lv2-nav-dark header.bg-white .nav-dropdown-panel * {
          color: var(--color-ink) !important;
        }
        /* The home hero adds a white ::before to the nav bar for its
           scroll-to-solid effect, which would otherwise cover the colour above.
           Paint that layer the strip colour (and force it full-height) so the
           nav actually matches the picture section's background. */
        html.lv2-nav-dark header.bg-white::before {
          height: 100% !important;
          background: ${STRIP_BG} !important;
        }

        @supports (animation-timeline: view()) {
          @keyframes csstrip-move {
            to {
              /* End with the LAST image centered (not right-aligned): pan so the
                 last item's centre lands at 50vw. The exact offset lives in
                 --end-extra so each breakpoint (which has different track pad,
                 item pad and image width) can center it correctly. */
              transform: translateX(calc(-100% + var(--end-extra)));
            }
          }

          .csstrip-section {
            height: 500vh;
            overflow: visible;
            background: ${STRIP_BG};
            view-timeline-name: --csstrip-tl;
            view-timeline-axis: block;
          }

          .csstrip-sticky {
            height: calc(100vh - ${HEADER_OFFSET_PX}px);
            width: 100vw;
            position: sticky;
            top: ${HEADER_OFFSET_PX}px;
            overflow-x: hidden;
          }

          .csstrip-track {
            position: relative;
            z-index: 1;
            height: 100%;
            width: max-content;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 5vw;
            /* 50vw + track right pad (5vw) + half image + item right pad. */
            --end-extra: calc(55vw + min(82vh, 86vw) / 2 + 5vmax);
            box-sizing: border-box;
            will-change: transform;
            animation: linear csstrip-move forwards;
            animation-timeline: --csstrip-tl;
            animation-range: contain 0% contain 100%;
          }

          /* Retro 4-stripe band behind the images. Each stripe draws
             left→right locked to the SAME scroll timeline, starting after
             the heading settles (~14%) and finishing at a different scroll
             point (58/67/91/100%) so the colours advance at different
             speeds — centre pair fastest, outer slowest. */
          .csstrip-lines {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            transform: translateY(-50%);
            z-index: 0;
            pointer-events: none;
          }
          .csstrip-band {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0;
          }
          .csstrip-band i {
            display: block;
            /* Thicker on wider screens, floored on small ones. */
            height: clamp(40px, 4vw, 84px);
            transform-origin: left center;
            will-change: transform;
            animation: linear csstrip-band-draw both;
            animation-timeline: --csstrip-tl;
          }
          .csstrip-band i:nth-child(1) { background: var(--color-mustard);  animation-range: contain 8% contain 100%; }
          .csstrip-band i:nth-child(2) { background: var(--color-orange);   animation-range: contain 8% contain 56%; }
          .csstrip-band i:nth-child(3) { background: var(--color-rust);     animation-range: contain 8% contain 65%; }
          .csstrip-band i:nth-child(4) { background: var(--color-burgundy); animation-range: contain 8% contain 89%; }
          @keyframes csstrip-band-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
          @keyframes csstrip-heading-in { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }

          .csstrip-track > * {
            padding: 0 5vmax;
            box-sizing: border-box;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .csstrip-img {
            /* Near full-screen height. Width is capped to the height (square on
               desktop) AND to 86vw (so it turns portrait as the viewport
               narrows). One rule → square on wide, portrait on narrow. */
            height: min(82vh, calc(100vh - ${HEADER_OFFSET_PX}px));
            width: min(82vh, 86vw);
            object-fit: cover;
            display: block;
          }

          .csstrip-heading {
            font-family: var(--font-lora), Georgia, "Times New Roman", Times, serif;
            font-size: clamp(1.25rem, 4.5vw, 2.25rem);
            line-height: 1.2;
            max-width: min(460px, 82vw);
            color: white;
            margin: 0;
            font-weight: 500;
            text-align: left;
            will-change: transform, opacity;
            animation: linear csstrip-heading-in both;
            animation-timeline: --csstrip-tl;
            animation-range: contain 0% contain 8%;
          }

          /* The heading is the first track item. Instead of a full-viewport
             cell (which shoved the first image ~100vw to the right), center the
             heading at scroll-start via a left inset (~45vw − half the heading)
             and keep only a modest right gap so the first image follows close
             behind. The pan then carries the heading left. */
          .csstrip-lead {
            min-width: 0;
            padding-left: max(4vw, calc(45vw - 15rem));
            padding-right: 6vw;
            justify-content: flex-start;
          }

          /* Small screens: heading readable immediately (no scroll-in fade),
             images spread further apart, and the end offset recomputed for the
             mobile padding + 86vw image so the last image still centers. */
          @media (max-width: 640px) {
            .csstrip-track {
              padding: 0 4vw;
              /* 50vw + track pad 4vw + half image (86vw/2=43vw) + item pad 9vw. */
              --end-extra: calc(54vw + 43vw + 9vw);
            }
            .csstrip-track > * { padding: 0 9vw; }
            .csstrip-heading {
              animation: none;
              opacity: 1;
              transform: none;
            }
          }
        }

        /* Fallback for browsers without animation-timeline (Firefox today):
           render a normal-flow horizontal scroll row instead of broken pinning. */
        @supports not (animation-timeline: view()) {
          .csstrip-section { background: ${STRIP_BG}; }
          .csstrip-sticky {
            width: 100%; height: 86vh;
            overflow-x: auto;
            display: flex;
            align-items: center;
          }
          .csstrip-track {
            display: flex;
            height: 100%;
            align-items: center;
          }
          .csstrip-track > * {
            flex-shrink: 0; padding: 0 2vw;
            display: flex; align-items: center; justify-content: center;
          }
          .csstrip-img {
            height: min(82vh, calc(100vh - ${HEADER_OFFSET_PX}px)); width: min(82vh, 86vw);
            object-fit: cover; display: block;
          }
          .csstrip-heading {
            font-family: var(--font-lora), Georgia, serif;
            font-size: 1.5rem; max-width: 320px; color: white; margin: 0;
          }
          /* No scroll timeline → the draw-in can't run; hide the band rather
             than show it statically full-width. */
          .csstrip-lines { display: none; }
        }
      `}</style>

      {/* CSS scroll-driven horizontal pan — same behaviour on all breakpoints. */}
      <section
        ref={sectionRef}
        className="csstrip-section"
        aria-label="Galeria competițiilor"
      >
        <div className="csstrip-sticky">
          {/* Retro stripe band, drawn behind the images on the same scroll
              timeline. Decorative only. */}
          <div className="csstrip-lines" aria-hidden>
            <div className="csstrip-band">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="csstrip-track">
            <div className="csstrip-lead">
              <h2 className="csstrip-heading">
                Pe gheață, în formă maximă. Momente din competițiile sportivilor noștri.
              </h2>
            </div>
            {shown.map((img, i) => (
              <div key={`${img.url}-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={strapiMediaUrl(img.url)}
                  alt={img.alternativeText ?? ""}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="csstrip-img"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
