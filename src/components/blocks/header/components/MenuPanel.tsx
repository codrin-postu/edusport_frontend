"use client";

import SpotlightButton from "@/components/ui/spotlight-button";
import { WarmStripe } from "@/components/ui/warm-stripe";
import { AnimatePresence, motion } from "motion/react";
import { DURATION, EASE } from "@/lib/motion";
import Link from "next/link";
import React, { useEffect, useCallback } from "react";
import { navItems as staticNavItems, type NavItem } from "../navItems";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";

interface MenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLElement | null>;
  /**
   * The menu, already merged with any CMS promo overrides. Defaults to the
   * static definition so the panel still renders without the prop. The mobile
   * panel shows no promo card, so an override changes nothing here, but both
   * surfaces read the same list.
   */
  navItems?: NavItem[];
  registrationOpen?: boolean;
  contactInfo?: SiteContactInfo;
}

const MenuPanel: React.FC<MenuPanelProps> = ({ isOpen, onClose, buttonRef, navItems = staticNavItems, registrationOpen, contactInfo }) => {
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
      navItems={navItems}
      instagramUrl={contactInfo?.instagramUrl}
    />
  );
};

export default MenuPanel;

// ─────────────────────────────────────────────────────────────────────────────
// Retro (landing-v2) panel: unfold from top, cream + square, warm top stripe,
// brick/gold left-bar hover. Matches nav-responsive-v4.
// ─────────────────────────────────────────────────────────────────────────────

const RetroPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ctaHref: string;
  ctaLabel: string;
  buttonRef: React.RefObject<HTMLElement | null>;
  navItems: NavItem[];
  instagramUrl?: string;
}> = ({ isOpen, onClose, ctaHref, ctaLabel, buttonRef, navItems, instagramUrl }) => {
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
      <SpotlightButton layers layersFace="black" href={ctaHref} onClick={onClose} className="text-caption w-full">
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
          className="text-body-sm block px-3 py-2 text-primary border-l-[3px] border-transparent transition-colors hover:border-rust hover:text-accent"
          data-umami-event="nav"
          data-umami-event-url={item.href}
        >
          {item.label}
        </Link>,
      );
    } else {
      rows.push(
        <div key={item.label} className="text-label px-3 pt-3 pb-1 uppercase text-accent">
          {item.label}
        </div>,
      );
      item.dropdown?.forEach((sub) =>
        rows.push(
          <Link
            key={sub.href}
            href={sub.href}
            onClick={onClose}
            className="text-caption block pl-4 pr-3 py-2 text-primary border-l-[3px] border-transparent transition-colors hover:border-mustard hover:text-primary"
            data-umami-event="nav"
            data-umami-event-url={sub.href}
          >
            {sub.label}
          </Link>,
        ),
      );
    }
  });
  if (instagramUrl) {
    const igHandle = `@${instagramUrl.replace(/\/+$/, "").split("/").pop()}`;
    rows.push(
      <a
        key="ig"
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 mx-1 mt-1 p-2 transition-opacity hover:opacity-70"
      >
        <span className="w-[34px] h-[34px] shrink-0 bg-[linear-gradient(135deg,var(--color-rust),var(--color-orange),var(--color-mustard))]" />
        <span>
          <span className="text-caption block text-primary">Instagram</span>
          <span className="text-caption block text-secondary">{igHandle}</span>
        </span>
      </a>,
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-menu md:bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-menu overflow-hidden bg-surface flex flex-col
              inset-x-0 bottom-0
              md:right-4 md:left-auto md:bottom-auto md:mt-2 md:w-[380px] md:max-h-[calc(100vh-120px)]
              md:border-retro md:border-line md:shadow-retro"
            style={{ top }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.out }}
          >
            {/* warm top stripe */}
            <WarmStripe className="relative z-raised h-1" />

            <div className="relative z-raised flex-1 min-h-0 overflow-y-auto px-4 py-3">
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
