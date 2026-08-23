"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import MenuPanel from "./components/MenuPanel";
import HeaderTop from "./components/HeaderTop";
import NavigationMenuInteractive from "./components/NavigationMenuInteractive";
import { desktopNavItems } from "./navItems";
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
}

const Header: React.FC<HeaderProps> = ({ registrationOpen, contactInfo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = React.useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 400);
  }, []);

  const pathname = usePathname();
  const ctaHref = registrationOpen !== false ? "/inscrieri" : "/cursuri";
  const ctaLabel = registrationOpen !== false ? "Inscrie-te la cursuri" : "Cursuri";
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

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col w-full items-center bg-black">
        <motion.div
          className="w-full overflow-hidden"
          initial={{ height: "2rem" }}
          animate={{ height: isScrolled ? "0rem" : "2rem" }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <HeaderTop contactInfo={contactInfo} />
        </motion.div>
        {/* Square corners site-wide (retro). The black contact strip above
            still collapses on scroll via the wrapper's height animation. */}
        <header className="w-full bg-white h-20">
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
        registrationOpen={registrationOpen}
      />
    </>
  );
};

export default Header;
