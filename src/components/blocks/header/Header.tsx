"use client";

import { usePathname } from "next/navigation";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";
import MenuPanel from "./components/MenuPanel";
import HeaderTop from "./components/HeaderTop";
import NavigationMenuInteractive from "./components/NavigationMenuInteractive";
import {
  navItems as staticNavItems,
  getDesktopNavItems,
  type NavItem,
} from "./navItems";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";
import { ENROL_CTA, ENROL_CTA_CLOSED, ENROL_HREF } from "@/lib/cta";

// Layers button (same hover fan as the CTA), square, matched to the CTA
// height, with a hamburger face.
const MenuButton = React.forwardRef<
  HTMLElement,
  { onToggle: () => void }
>(({ onToggle }, ref) => {
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onToggle}
      aria-label="Meniu"
      className="lcta flex-shrink-0"
    >
      <span aria-hidden className="lcta-layer lcta-l1" />
      <span aria-hidden className="lcta-layer lcta-l2" />
      <span className="lcta-face relative size-12 bg-black flex flex-col items-center justify-center gap-1">
        <span className="w-[20px] h-[2px] bg-surface-raised" />
        <span className="w-[20px] h-[2px] bg-surface-raised" />
        <span className="w-[20px] h-[2px] bg-surface-raised" />
      </span>
    </button>
  );
});

MenuButton.displayName = "MenuButton";

interface HeaderProps {
  registrationOpen?: boolean;
  contactInfo?: SiteContactInfo;
  /**
   * The menu, already merged with any CMS promo overrides by the layout.
   * Defaults to the static definition, so the component still renders the full
   * menu when nothing is passed.
   */
  navItems?: NavItem[];
}

const Header: React.FC<HeaderProps> = ({
  registrationOpen,
  contactInfo,
  navItems = staticNavItems,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = React.useRef<HTMLElement>(null);

  const lastAtTop = React.useRef<boolean | null>(null);
  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const atTop = y <= 400;
    // The class is what actually shows or hides the strip; see globals.css.
    // The same class also drives --header-h there (the header's live
    // total height), so anything sitting flush under the fixed header
    // stays in sync with the strip without any extra bookkeeping here.
    document.documentElement.classList.toggle("nav-strip-open", atTop);
    // One session entry, written only when the strip changes state: the path
    // whose strip was last closed. The inline script in layout.tsx reads it
    // so a reload of that page paints the strip closed from the first frame.
    if (atTop !== lastAtTop.current) {
      lastAtTop.current = atTop;
      try {
        if (atTop) sessionStorage.removeItem("esNavClosed");
        else sessionStorage.setItem("esNavClosed", window.location.pathname);
      } catch {
        // Private mode or full quota. The strip still works, it just cannot
        // survive a reload in the right state.
      }
    }
  }, []);

  // Clears the per-page esNavY:* entries an older version wrote on every
  // scroll. Safe to delete once old sessions are gone.
  useEffect(() => {
    try {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key?.startsWith("esNavY:")) sessionStorage.removeItem(key);
      }
    } catch {
      // Storage unavailable: nothing to clean.
    }
  }, []);

  const pathname = usePathname();
  const ctaHref = registrationOpen !== false ? ENROL_HREF : "/cursuri";
  const ctaLabel = registrationOpen !== false ? ENROL_CTA : ENROL_CTA_CLOSED;
  // Desktop nav excludes "Acasa" (no need for a home link in the top bar).
  // The filter itself lives in navItems.ts so both this and the mobile panel
  // stay in sync with a single definition.
  const desktopNavItems = React.useMemo(
    () => getDesktopNavItems(navItems),
    [navItems],
  );
  const toggleMenu = useCallback(() => setIsMenuOpen((open) => !open), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  React.useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Transitions are enabled one frame after load. Without this the strip would
  // visibly slide open on every page load, because the class lands in the same
  // frame as the first paint.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      document.documentElement.classList.add("nav-anim"),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-header flex flex-col w-full items-center bg-black">
        {/* Height comes from CSS (see globals.css), not from motion. The state
            has to be right in the first painted frame, and anything React does
            happens after hydration, which is after the browser has painted. */}
        <div data-contact-strip className="w-full overflow-hidden">
          <HeaderTop contactInfo={contactInfo} />
        </div>
        {/* Square corners site-wide (retro). The black contact strip above
            still collapses on scroll via the wrapper's height animation.

            data-site-header is a STYLING HOOK, do not remove it. The landing
            hero and the competition strip each inject a <style> block that
            restyles this bar: transparent over the hero, cream once scrolled,
            inverted to dark while the picture strip is in view. Those 27
            selectors used to key off `header.bg-white`, so changing the colour
            class silently unhooked all of them and the nav stopped reacting to
            the page. Keyed on the attribute, the colour is free to change.

            Cream (--color-retro-cream, #fbf8f1) matches the page body; white
            read as a separate band floating above the content. */}
        <header data-site-header className="w-full bg-surface h-20">
          <div className="h-full w-full max-w-content mx-auto gutter flex justify-between items-center">
            {/* Left side - Brand */}
            <Link href="/" className="flex flex-col">
              <span className="text-body-sm text-primary">
                CLUBUL SPORTIV
              </span>
              <span className="text-header-logo text-branding-font text-primary">EDUSPORT</span>
            </Link>

            {/* Center - Desktop nav (lg+) */}
            <div className="hidden lg:flex flex-1 justify-start pl-8">
              <NavigationMenuInteractive items={desktopNavItems} />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* CTA: hidden on mobile, visible on tablet+  */}
              <Button
                face="black"
                href={ctaHref}
                className="hidden md:inline-flex"
              >
                {ctaLabel}
              </Button>
              {/* Meniu: hidden on desktop */}
              <div className="lg:hidden">
                <MenuButton ref={menuButtonRef} onToggle={toggleMenu} />
              </div>
            </div>
          </div>
        </header>
      </div>
      <MenuPanel
        isOpen={isMenuOpen}
        onClose={closeMenu}
        buttonRef={menuButtonRef}
        navItems={navItems}
        registrationOpen={registrationOpen}
        contactInfo={contactInfo}
      />
    </>
  );
};

export default Header;
