"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAnimate } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

const PANELS = [
  { color: "var(--color-edusport-blue)" },
  { color: "#07070f" },
  { color: "var(--color-edusport-blue)" },
];

const SLIDE = 0.45;
const STAGGER = 0.15;
const COVER_MS = (STAGGER * (PANELS.length - 1) + SLIDE) * 1000;
const HOLD_MS = 100;

export function PageTransitionOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const animatingRef = useRef(false);

  const [scope0, animate0] = useAnimate();
  const [scope1, animate1] = useAnimate();
  const [scope2, animate2] = useAnimate();

  const animators = [animate0, animate1, animate2];
  const scopes = [scope0, scope1, scope2];

  const cover = useCallback(() => {
    scopes.forEach((scope, i) => {
      if (!scope.current) return;
      scope.current.style.display = "block";
      animators[i](scope.current, { y: "0%" }, {
        duration: SLIDE,
        delay: i * STAGGER,
        ease: [0.76, 0, 0.24, 1],
      });
    });
  }, [scopes, animators]);

  const uncover = useCallback(() => {
    // Reverse order so the top panel peels away first, revealing each color
    scopes.forEach((scope, i) => {
      if (!scope.current) return;
      const reverseIndex = PANELS.length - 1 - i;
      animators[i](scope.current, { y: "-100%" }, {
        duration: SLIDE,
        delay: reverseIndex * STAGGER,
        ease: [0.76, 0, 0.24, 1],
      });
    });
    setTimeout(() => {
      scopes.forEach((scope) => {
        if (!scope.current) return;
        scope.current.style.display = "none";
        scope.current.style.transform = "translateY(100%)";
      });
      animatingRef.current = false;
    }, (STAGGER * (PANELS.length - 1) + SLIDE) * 1000 + 50);
  }, [scopes, animators]);

  // When pathname changes, the new page is mounted → uncover
  useEffect(() => {
    if (pathname === pathnameRef.current) return;
    pathnameRef.current = pathname;

    // Small hold so the new page has time to paint
    const t = setTimeout(() => {
      window.scrollTo(0, 0);
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
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href.startsWith("tel") ||
        href.startsWith("#") ||
        href === pathnameRef.current
      )
        return;

      // Prevent default navigation — we control when it happens
      e.preventDefault();

      if (animatingRef.current) return;
      animatingRef.current = true;

      // 1. Cover the screen
      cover();

      // 2. Navigate AFTER the cover animation completes
      setTimeout(() => {
        router.push(href);
      }, COVER_MS);
    }

    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  }, [cover, router]);

  return (
    <>
      {PANELS.map((panel, i) => (
        <div
          key={i}
          ref={scopes[i]}
          className="fixed inset-x-0 top-20 bottom-0 pointer-events-none"
          style={{
            backgroundColor: panel.color,
            zIndex: 90 + i,
            display: "none",
            transform: "translateY(100%)",
          }}
        />
      ))}
    </>
  );
}
