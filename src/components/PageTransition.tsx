"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAnimate } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { SkateLoader } from "./SkateLoader";

const PANELS = [
  { color: "var(--color-edusport-blue)" },
  { color: "#07070f" },
  { color: "var(--color-edusport-blue)" },
];

const SLIDE = 0.45;
const STAGGER = 0.15;
const COVER_MS = (STAGGER * (PANELS.length - 1) + SLIDE) * 1000;
const HOLD_MS = 0;

export function PageTransitionOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const animatingRef = useRef(false);

  const [scope0, animate0] = useAnimate();
  const [scope1, animate1] = useAnimate();
  const [scope2, animate2] = useAnimate();
  const [scopeSpinner, animateSpinner] = useAnimate();

  const animators = [animate0, animate1, animate2];
  const scopes = [scope0, scope1, scope2];

  const cover = useCallback(() => {
    scopes.forEach((scope, i) => {
      if (!scope.current) return;
      scope.current.style.display = "block";
      animators[i](scope.current, { y: ["100%", "0%"] }, {
        duration: SLIDE,
        delay: i * STAGGER,
        ease: [0.76, 0, 0.24, 1],
      });
    });
    // Diamond stays stationary; panel 3's slide-up "reveals" it via a
    // clip-path inset whose top edge tracks panel 3's leading edge.
    if (scopeSpinner.current) {
      scopeSpinner.current.style.display = "flex";
      animateSpinner(
        scopeSpinner.current,
        { clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"] },
        {
          duration: SLIDE,
          delay: (PANELS.length - 1) * STAGGER,
          ease: [0.76, 0, 0.24, 1],
        },
      );
    }
  }, [scopes, animators, scopeSpinner, animateSpinner]);

  const uncover = useCallback(() => {
    // Panel 3 leaves first (delay 0). The diamond is clipped from the bottom
    // upward in lockstep, so panel 3's trailing edge "hides" the diamond.
    if (scopeSpinner.current) {
      animateSpinner(
        scopeSpinner.current,
        { clipPath: ["inset(0% 0 0 0)", "inset(0 0 100% 0)"] },
        {
          duration: SLIDE,
          delay: 0,
          ease: [0.76, 0, 0.24, 1],
        },
      );
    }
    scopes.forEach((scope, i) => {
      if (!scope.current) return;
      const reverseIndex = PANELS.length - 1 - i;
      animators[i](scope.current, { y: ["0%", "-100%"] }, {
        duration: SLIDE,
        delay: reverseIndex * STAGGER,
        ease: [0.76, 0, 0.24, 1],
      });
    });
    setTimeout(() => {
      scopes.forEach((scope) => {
        if (!scope.current) return;
        scope.current.style.display = "none";
      });
      if (scopeSpinner.current) {
        scopeSpinner.current.style.display = "none";
        scopeSpinner.current.style.clipPath = "inset(100% 0 0 0)";
      }
      animatingRef.current = false;
    }, (STAGGER * (PANELS.length - 1) + SLIDE) * 1000 + 50);
  }, [scopes, animators, scopeSpinner, animateSpinner]);

  // When pathname changes, the new page is mounted → uncover
  useEffect(() => {
    if (pathname === pathnameRef.current) return;
    pathnameRef.current = pathname;

    // Small hold so the new page has time to paint
    const t = setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView();
        } else {
          window.scrollTo(0, 0);
        }
      } else {
        window.scrollTo(0, 0);
      }
      uncover();
    }, HOLD_MS);
    return () => clearTimeout(t);
  }, [pathname, uncover]);

  // Intercept all internal link clicks
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        anchor.target === "_blank" ||
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href.startsWith("tel") ||
        href.startsWith("#")
      )
        return;

      // Only animate when navigating away from the landing page
      if (pathnameRef.current !== "/") return;

      // Skip transition if only query params are changing (same pathname)
      const hrefPathname = href.split("?")[0];
      if (hrefPathname === pathnameRef.current) return;

      // Prevent default navigation - we control when it happens
      e.preventDefault();

      if (animatingRef.current) return;
      animatingRef.current = true;

      // 1. Cover the screen
      cover();

      // 2. Navigate AFTER the cover animation completes
      setTimeout(() => {
        try {
          router.push(href);
        } catch {
          uncover();
          animatingRef.current = false;
        }
      }, COVER_MS);
    }

    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  }, [cover, uncover, router]);

  return (
    <>
      {PANELS.map((panel, i) => (
        <div
          key={i}
          ref={scopes[i]}
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundColor: panel.color,
            zIndex: 200 + i,
            display: "none",
            transform: "translateY(100%)",
          }}
        />
      ))}
      <div
        ref={scopeSpinner}
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        style={{
          zIndex: 203,
          display: "none",
          clipPath: "inset(100% 0 0 0)",
        }}
      >
        <SkateLoader />
      </div>
    </>
  );
}
