"use client";

import SpotlightButton from "@/components/ui/spotlight-button";
import { WarmStripe } from "@/components/ui/warm-stripe";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, { useEffect, useCallback } from "react";
import { navItems } from "../navItems";

const INSTAGRAM_URL = "https://instagram.com/edusport";

interface MenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLElement | null>;
  registrationOpen?: boolean;
}

const MenuPanel: React.FC<MenuPanelProps> = ({ isOpen, onClose, buttonRef, registrationOpen }) => {
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscapeKey]);

  const ctaHref = registrationOpen !== false ? "/inscrieri" : "/cursuri";
  const ctaLabel = registrationOpen !== false ? "Inscrie-te la cursuri" : "Cursuri";

  return (
    <RetroPanel
      isOpen={isOpen}
      onClose={onClose}
      ctaHref={ctaHref}
      ctaLabel={ctaLabel}
      buttonRef={buttonRef}
    />
  );
};

export default MenuPanel;

// ─────────────────────────────────────────────────────────────────────────────
// Retro (landing-v2) panel — unfold from top, cream + square, warm top stripe,
// background tube-lines, brick/gold left-bar hover. Matches nav-responsive-v4.
// ─────────────────────────────────────────────────────────────────────────────

const RetroPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ctaHref: string;
  ctaLabel: string;
  buttonRef: React.RefObject<HTMLElement | null>;
}> = ({ isOpen, onClose, ctaHref, ctaLabel, buttonRef }) => {
  // Anchor the panel right under the real header (its height shifts when the
  // top contact strip collapses on scroll), so it sits flush like the preview.
  const [top, setTop] = React.useState(80);
  React.useEffect(() => {
    if (!isOpen) return;
    const measure = () => {
      const b = buttonRef.current?.getBoundingClientRect();
      if (b) setTop(Math.round(b.bottom + 6));
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [isOpen, buttonRef]);

  // Flatten nav into staggerable rows.
  const rows: React.ReactNode[] = [];
  rows.push(
    <div key="cta" className="md:hidden mx-1 mb-2">
      <SpotlightButton layers layersFace="black" href={ctaHref} onClick={onClose} className="w-full text-xs">
        {ctaLabel}
      </SpotlightButton>
    </div>,
  );
  navItems.forEach((item) => {
    if (item.href) {
      rows.push(
        <Link
          key={item.label}
          href={item.href}
          onClick={onClose}
          className="block px-2.5 py-2 text-[15px] font-medium text-navy border-l-[3px] border-transparent transition-colors hover:border-rust hover:text-rust"
          data-umami-event="nav"
          data-umami-event-url={item.href}
        >
          {item.label}
        </Link>,
      );
    } else {
      rows.push(
        <div key={item.label} className="px-2.5 pt-2.5 pb-1 text-[10.5px] font-bold tracking-[0.1em] uppercase text-rust">
          {item.label}
        </div>,
      );
      item.dropdown?.forEach((sub) =>
        rows.push(
          <Link
            key={sub.href}
            href={sub.href}
            onClick={onClose}
            className="block pl-[18px] pr-2.5 py-1.5 text-[13.5px] text-navy/80 border-l-[3px] border-transparent transition-colors hover:border-mustard hover:text-navy"
            data-umami-event="nav"
            data-umami-event-url={sub.href}
          >
            {sub.label}
          </Link>,
        ),
      );
    }
  });
  rows.push(
    <a
      key="ig"
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 mx-1 mt-1 p-2 transition-opacity hover:opacity-70"
    >
      <span className="w-[34px] h-[34px] rounded-[9px] shrink-0 bg-[linear-gradient(135deg,var(--color-rust),var(--color-orange),var(--color-mustard))]" />
      <span>
        <span className="block text-[13px] font-semibold text-navy">Instagram</span>
        <span className="block text-[11px] text-navy/50">@edusport</span>
      </span>
    </a>,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[998] md:bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-[999] overflow-hidden bg-retro-cream flex flex-col
              inset-x-0 bottom-0
              md:right-4 md:left-auto md:bottom-auto md:mt-2 md:w-[380px] md:max-h-[calc(100vh-120px)]
              md:border-[1.5px] md:border-navy md:shadow-[8px_8px_0_rgba(14,26,60,0.16)]"
            style={{ top }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
          >
            {/* warm top stripe */}
            <WarmStripe className="relative z-[1] h-1" />

            {/* background tube-lines — CSS bordered L-shapes so thickness
                (border-width) and corner (border-radius) are FIXED pixels,
                independent of panel width. Concentric (shared corner centre →
                constant gap); horizontals start at the left edge, verticals sit
                near the right. */}
            <div className="absolute inset-0 z-0 opacity-20 overflow-hidden pointer-events-none" aria-hidden>
              <span
                className="absolute block left-0 bottom-0"
                style={{ top: 96, right: 40, borderTop: "24px solid var(--color-rust)", borderRight: "24px solid var(--color-rust)", borderTopRightRadius: 96 }}
              />
              <span
                className="absolute block left-0 bottom-0"
                style={{ top: 126, right: 70, borderTop: "24px solid var(--color-orange)", borderRight: "24px solid var(--color-orange)", borderTopRightRadius: 66 }}
              />
              <span
                className="absolute block left-0 bottom-0"
                style={{ top: 156, right: 100, borderTop: "24px solid var(--color-mustard)", borderRight: "24px solid var(--color-mustard)", borderTopRightRadius: 36 }}
              />
            </div>

            <div className="relative z-[1] flex-1 min-h-0 overflow-y-auto px-3.5 py-3">
              {rows.map((r, i) => (
                <div key={i}>{r}</div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
