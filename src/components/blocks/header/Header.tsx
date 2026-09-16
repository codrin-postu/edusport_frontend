"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import MenuPanel from "./components/MenuPanel";
import HeaderTop from "./components/HeaderTop";
import NavigationMenuInteractive from "./components/NavigationMenuInteractive";
import { navItems as staticNavItems, type NavItem } from "./navItems";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";

const CascadingText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className={`inline-flex ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          className="text-branding-font"
          animate={{
            color: isHovered ? "var(--color-edusport-blue)" : "var(--color-ink)",
          }}
          transition={{
            duration: 0.1,
            delay: index * 0.05,
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
};

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
      <span className="lcta-face relative w-[46px] bg-black flex flex-col items-center justify-center gap-[5px]">
        <span className="w-[20px] h-[2px] bg-white" />
        <span className="w-[20px] h-[2px] bg-white" />
        <span className="w-[20px] h-[2px] bg-white" />
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

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const atTop = y <= 400;
    // The class is what actually shows or hides the strip; see globals.css.
    document.documentElement.classList.toggle("nav-strip-open", atTop);
    // Remembered so the inline script in layout.tsx can get the very first
    // painted frame right if this page is reloaded from here. Keyed per path,
    // since scroll position is per page, and session-scoped so it dies with
    // the tab.
    try {
      sessionStorage.setItem(`esNavY:${window.location.pathname}`, String(y));
    } catch {
      // Private mode or full quota. The strip still works, it just cannot
      // survive a reload in the right state.
    }
  }, []);

  const pathname = usePathname();
  const ctaHref = registrationOpen !== false ? "/inscrieri" : "/cursuri";
  const ctaLabel = registrationOpen !== false ? "Inscrie-te la cursuri" : "Cursuri";
  // Desktop nav excludes "Acasa" (no need for a home link in the top bar)
  const desktopNavItems = React.useMemo(
    () => navItems.filter((item) => item.key !== "acasa"),
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
      <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col w-full items-center bg-black">
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
        <header data-site-header className="w-full bg-retro-cream h-20">
          <div className="h-full w-full max-w-content mx-auto px-4 flex justify-between items-center">
            {/* Left side - Brand */}
            <Link href="/" className="flex flex-col">
              <span className="text-sm text-gray-900 tracking-wider">
                CLUBUL SPORTIV
              </span>
              <CascadingText
                text="EDUSPORT"
                className="text-lg text-branding-font tracking-wider"
              />
            </Link>

            {/* Center - Desktop nav (lg+) */}
            <div className="hidden lg:flex flex-1 justify-start pl-8">
              <NavigationMenuInteractive items={desktopNavItems} />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* CTA: hidden on mobile, visible on tablet+  */}
              <SpotlightButton
                layers
                layersFace="black"
                href={ctaHref}
                className="hidden md:inline-flex text-xs"
              >
                {ctaLabel}
              </SpotlightButton>
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
