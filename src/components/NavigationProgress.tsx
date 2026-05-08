"use client";

import { motion, useAnimate } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Top-of-viewport progress bar shown the instant a user clicks an internal
// link, dismissed once the new pathname commits. Catches every <a> click via a
// global capture listener so it works regardless of which Link wrapper is in
// play, and survives slow server components blocking on Strapi.

const APPEAR_DELAY_MS = 80; // hide on sub-80ms (cached) navigations
const FADE_IN_MS = 280;
const COMPLETE_SNAP_MS = 220; // scaleX 0.85 → 1 when route commits
const COMPLETE_HOLD_MS = 120; // brief hold at 100% before fading
const FADE_OUT_MS = 350;
const RESET_DELAY_MS = COMPLETE_SNAP_MS + COMPLETE_HOLD_MS + FADE_OUT_MS;

export default function NavigationProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click capture — schedule the bar to appear after a short delay so cached
  // navigations (which commit in <80ms) never paint anything.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (anchor.target === "_blank") return;
      if (
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href.startsWith("tel") ||
        href.startsWith("#")
      )
        return;

      const targetPath = href.split("?")[0].split("#")[0];
      if (targetPath === pathname) return;

      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      showTimerRef.current = setTimeout(() => {
        showTimerRef.current = null;
        setActive(true);
      }, APPEAR_DELAY_MS);
    }
    window.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("click", handleClick, true);
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
    };
  }, [pathname]);

  // Show: fade in opacity, grow scaleX with an asymptotic curve toward 0.85.
  useEffect(() => {
    if (!active || !scope.current) return;
    animate(
      scope.current,
      { opacity: 1 },
      { duration: FADE_IN_MS / 1000, ease: "easeOut" },
    );
    animate(
      scope.current,
      { scaleX: [0, 0.35, 0.6, 0.78, 0.85] },
      {
        duration: 4,
        ease: [0.1, 0.5, 0.5, 1],
        times: [0, 0.18, 0.45, 0.75, 1],
      },
    );
  }, [active, animate, scope]);

  // Pathname commit: snap to 100%, hold briefly, then fade out smoothly.
  useEffect(() => {
    // Cached nav arrived before the bar even appeared — cancel and bail.
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (!active) return;

    if (scope.current) {
      animate(
        scope.current,
        { scaleX: 1 },
        { duration: COMPLETE_SNAP_MS / 1000, ease: [0.22, 1, 0.36, 1] },
      );
      animate(
        scope.current,
        { opacity: 0 },
        {
          duration: FADE_OUT_MS / 1000,
          delay: (COMPLETE_SNAP_MS + COMPLETE_HOLD_MS) / 1000,
          ease: "easeInOut",
        },
      );
    }

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setActive(false);
      // Reset to baseline so the next navigation starts clean.
      if (scope.current) {
        scope.current.style.opacity = "0";
        scope.current.style.transform = "scaleX(0)";
      }
    }, RESET_DELAY_MS);
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <motion.div
      ref={scope}
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[4px] bg-edusport-blue origin-left pointer-events-none"
      style={{ zIndex: 9999, opacity: 0, transform: "scaleX(0)" }}
    />
  );
}
