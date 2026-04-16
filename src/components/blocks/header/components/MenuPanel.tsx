"use client";

import SpotlightButton from "@/components/ui/spotlight-button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, { useEffect, useCallback } from "react";
import { navItems } from "../navItems";

const INSTAGRAM_IMAGE = "/images/menu/instagram.png";
const INSTAGRAM_URL = "https://instagram.com/edusport";

const MenuLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}> = ({ href, children, className = "", onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center transition-colors ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="menu-link-underline">{children}</span>
    </Link>
  );
};

interface MenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLDivElement | null>;
  registrationOpen?: boolean;
}

const MenuPanel: React.FC<MenuPanelProps> = ({ isOpen, onClose, buttonRef, registrationOpen }) => {
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

      // Calculate position relative to the panel
      const relativeX = buttonCenterX - panelRect.left;
      const relativeY = buttonCenterY - panelRect.top;

      setOriginPoint({
        x: `${relativeX}px`,
        y: `${relativeY}px`,
      });
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
      if (e.matches) onClose();
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [onClose]);

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
            initial={{
              clipPath: `circle(0px at ${originPoint.x} ${originPoint.y})`,
            }}
            animate={{
              clipPath: `circle(150% at ${originPoint.x} ${originPoint.y})`,
            }}
            exit={{
              clipPath: `circle(0px at ${originPoint.x} ${originPoint.y})`,
            }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {/* Header with button and close */}
            <div className="flex items-center justify-between ps-4 md:ps-6 py-2 pe-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Link
                  href={registrationOpen !== false ? "/inscrieri" : "/cursuri"}
                  onClick={onClose}
                >
                  <SpotlightButton variant="black" animationDuration={0.7}>
                    {registrationOpen !== false ? "Inscrie-te la cursuri" : "Cursuri"}
                  </SpotlightButton>
                </Link>
              </motion.div>

              <motion.button
                className="w-10 h-10 flex items-center justify-center"
                onClick={onClose}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-black hover:text-gray-600 transition-colors" />
              </motion.button>
            </div>

            <motion.div
              className="px-8 py-4 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <nav className="flex flex-col">
                {navItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    {index > 0 && <hr className="border-t border-gray-100" />}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + index * 0.05,
                      }}
                    >
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="group flex w-full -mx-8 px-8 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-base font-medium text-gray-900 group-hover:text-edusport-blue transition-colors">
                            {item.label}
                          </span>
                        </Link>
                      ) : (
                        <div className="py-3">
                          <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-1">
                            {item.label}
                          </p>
                          {item.dropdown && (
                            <div className="flex flex-col mt-1">
                              {item.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={onClose}
                                  className="group flex w-full -mx-8 px-8 py-2.5 hover:bg-gray-50 transition-colors"
                                >
                                  <span className="text-sm font-medium text-gray-900 group-hover:text-edusport-blue transition-colors">
                                    {subItem.label}
                                  </span>
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
