"use client";

import { Menu } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import SpotlightButton from "@/components/ui/spotlight-button";
import MenuPanel from "./components/MenuPanel";
import HeaderTop from "./components/HeaderTop";
import NavigationMenuInteractive from "./components/NavigationMenuInteractive";
import { desktopNavItems } from "./navItems";

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
            color: isHovered ? "var(--color-edusport-blue)" : "#111827",
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

const MenuButton = React.forwardRef<
  HTMLDivElement,
  {
    isOpen: boolean;
    onToggle: () => void;
  }
>(({ isOpen, onToggle }, ref) => {
  return (
    <button
      className="group flex items-center gap-2 text-gray-900 w-24 justify-end"
      onClick={onToggle}
    >
      <span className="font-light text-lg">Meniu</span>
      <div
        ref={ref}
        className={`
          relative flex items-center justify-center rounded-full bg-black
          w-10 h-10
          md:w-4 md:h-4 md:group-hover:w-10 md:group-hover:h-10
          transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          ${isOpen ? "!w-10 !h-10" : ""}
        `}
      >
        <Menu
          className={`
            w-5 h-5 text-white
            opacity-100
            md:opacity-0 md:group-hover:opacity-100
            transition-opacity duration-200 delay-100
            ${isOpen ? "!opacity-100" : ""}
          `}
        />
      </div>
    </button>
  );
});

MenuButton.displayName = "MenuButton";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col w-full items-center bg-black">
        <motion.div
          className="w-full overflow-hidden"
          initial={{ height: "2rem" }}
          animate={{ height: isScrolled ? "0rem" : "2rem" }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <HeaderTop />
        </motion.div>
        <motion.header
          className="w-full bg-white h-20"
          initial={{
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
          }}
          animate={{
            borderTopLeftRadius: isScrolled ? "0rem" : "1.5rem",
            borderTopRightRadius: isScrolled ? "0rem" : "1.5rem",
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="h-full w-full max-w-content mx-auto px-4 flex justify-between items-center">
            {/* Left side - Brand */}
            <a href="/" className="flex flex-col">
              <span className="text-sm text-gray-900 tracking-wider">
                CLUBUL SPORTIV
              </span>
              <CascadingText
                text="EDUSPORT"
                className="text-lg text-branding-font tracking-wider"
              />
            </a>

            {/* Center - Desktop nav (lg+) */}
            <div className="hidden lg:flex flex-1 justify-start pl-8">
              <NavigationMenuInteractive items={desktopNavItems} />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* CTA: hidden on mobile, visible on tablet+  */}
              <SpotlightButton
                className="hidden md:block"
                animationDuration={0.7}
              >
                Inscrie-te la cursuri
              </SpotlightButton>
              {/* Meniu: hidden on desktop */}
              <div className="lg:hidden">
                <MenuButton
                  ref={menuButtonRef}
                  isOpen={isMenuOpen}
                  onToggle={() => setIsMenuOpen(!isMenuOpen)}
                />
              </div>
            </div>
          </div>
        </motion.header>
      </div>
      <MenuPanel
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        buttonRef={menuButtonRef}
      />
    </>
  );
};

export default Header;
