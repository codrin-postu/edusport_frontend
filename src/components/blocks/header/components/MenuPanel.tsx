"use client";

import SpotlightButton from "@/components/ui/spotlight-button";
import { WarmStripe } from "@/components/ui/warm-stripe";
import { X } from "lucide-react";
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
  retro?: boolean;
}

const MenuPanel: React.FC<MenuPanelProps> = ({ isOpen, onClose, buttonRef, registrationOpen, retro }) => {
  const [originPoint, setOriginPoint] = React.useState({ x: "100%", y: "2.5rem" });
  const panelRef = React.useRef<HTMLDivElement>(null);

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen && buttonRef.current && panelRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();

      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      const relativeX = buttonCenterX - panelRect.left;
      const relativeY = buttonCenterY - panelRect.top;

      setOriginPoint({ x: `${relativeX}px`, y: `${relativeY}px` });
    }
  }, [isOpen, buttonRef]);

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && !retro) onClose();
      // retro tablet keeps the panel available at md; only close above lg
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [onClose, retro]);

  const ctaHref = registrationOpen !== false ? "/inscrieri" : "/cursuri";
  const ctaLabel = registrationOpen !== false ? "Inscrie-te la cursuri" : "Cursuri";

  if (retro) {
    return (
      <RetroPanel
        isOpen={isOpen}
        onClose={onClose}
        ctaHref={ctaHref}
        ctaLabel={ctaLabel}
        buttonRef={buttonRef}
      />
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[998] overflow-hidden touch-none overscroll-none md:bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            className="fixed top-0 right-0 w-full h-full bg-white overflow-hidden z-[999] md:top-[1rem] md:right-[max(1rem,calc((100vw-var(--max-content-width))/2+1rem))] md:w-[450px] md:h-auto md:max-h-[calc(100vh-2rem)] md:rounded-2xl md:border md:border-black/10 md:shadow-2xl flex flex-col"
            initial={{ clipPath: `circle(0px at ${originPoint.x} ${originPoint.y})` }}
            animate={{ clipPath: `circle(150% at ${originPoint.x} ${originPoint.y})` }}
            exit={{ clipPath: `circle(0px at ${originPoint.x} ${originPoint.y})` }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center justify-between ps-4 md:ps-6 py-2 pe-1">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
                <Link href={ctaHref} onClick={onClose}>
                  <SpotlightButton variant="black" animationDuration={0.7}>{ctaLabel}</SpotlightButton>
                </Link>
              </motion.div>
              <motion.button className="w-10 h-10 flex items-center justify-center" onClick={onClose} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.2 }} aria-label="Close menu">
                <X className="w-6 h-6 text-black hover:text-gray-600 transition-colors" />
              </motion.button>
            </div>

            <motion.div className="px-8 py-4 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <nav className="flex flex-col">
                {navItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    {index > 0 && <hr className="border-t border-gray-100" />}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}>
                      {item.href ? (
                        <Link href={item.href} onClick={onClose} className="group flex w-full -mx-8 px-8 py-3 hover:bg-gray-50 transition-colors">
                          <span className="text-base font-medium text-gray-900 group-hover:text-edusport-blue transition-colors">{item.label}</span>
                        </Link>
                      ) : (
                        <div className="py-3">
                          <p className="text-2xs font-semibold tracking-widest uppercase text-gray-400 mb-1">{item.label}</p>
                          {item.dropdown && (
                            <div className="flex flex-col mt-1">
                              {item.dropdown.map((subItem) => (
                                <Link key={subItem.href} href={subItem.href} onClick={onClose} className="group flex w-full -mx-8 px-8 py-2.5 hover:bg-gray-50 transition-colors">
                                  <span className="text-sm font-medium text-gray-900 group-hover:text-edusport-blue transition-colors">{subItem.label}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </React.Fragment>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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

            <div className="relative z-[1] overflow-y-auto px-3.5 py-3">
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
