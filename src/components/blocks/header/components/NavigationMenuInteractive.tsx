"use client";

import Link from "@/components/ui/link";
import { LinkVariants } from "@/utils/constants";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface PromoCard {
  title: string;
  description: string;
  gradient: string;
}

interface NavigationItem {
  label: string;
  href?: string;
  promo?: PromoCard;
  image?: string;
  dropdown?: DropdownItem[];
}

interface NavigationMenuInteractiveProps {
  items: NavigationItem[];
}

const contentVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const NavigationMenuInteractive: React.FC<NavigationMenuInteractiveProps> = ({
  items,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const open = (index: number) => setActiveIndex(index);

  const close = () => setActiveIndex(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const isOpen = activeItem?.dropdown != null;

  return (
    <div
      ref={menuRef}
      className="relative flex items-center gap-x-6 h-12"
      onMouseLeave={close}
    >
      {/* Nav buttons */}
      {items.map((item, index) => {
        const itemIsOpen = activeIndex === index;

        if (item.dropdown) {
          return (
            <button
              key={item.label}
              className="text-body-sm flex items-center gap-1 text-primary hover:text-secondary transition-colors outline-none"
              onMouseEnter={() => open(index)}
              onClick={() => (itemIsOpen ? close() : open(index))}
            >
              {item.label}
              <ChevronDown
                className={`size-4 transition-transform duration-fast ${itemIsOpen ? "rotate-180" : ""}`}
              />
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href || "#"}
            variant={LinkVariants.HEADER}
            className="text-body-sm text-primary hover:text-secondary transition-colors"
            // An item without a dropdown still has to close an open one.
            // onMouseLeave on the row only fires when the pointer leaves the
            // whole nav, so moving from a dropdown item onto a plain link left
            // the panel hanging open over the page.
            onMouseEnter={close}
            data-umami-event="nav"
            data-umami-event-url={item.href || "#"}
          >
            {item.label}
          </Link>
        );
      })}

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full left-0 pt-6 z-sticky"
          >
            <div className="nav-dropdown-panel bg-surface-raised border border-line-subtle shadow-xl overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeItem!.label}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex"
                >
                  {/* Promo tile (image + title + description). */}
                  {activeItem!.image && (
                    <div
                      className="nav-promo"
                      style={{ backgroundImage: `url(${activeItem!.image})` }}
                    >
                      <div className="nav-promo-ov" />
                      <div className="nav-promo-c">
                        <div className="nav-promo-t">
                          {activeItem!.promo?.title ?? activeItem!.label}
                        </div>
                        {activeItem!.promo?.description && (
                          <div className="nav-promo-d">{activeItem!.promo.description}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex flex-col py-3 px-2 min-w-[360px]">
                    <p className="text-label px-3 pb-2 uppercase text-muted">
                      {activeItem!.label}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {activeItem!.dropdown!.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          variant={LinkVariants.HEADER}
                          className="group flex items-center gap-3 px-3 py-3 hover:bg-surface-subtle transition-colors"
                          onClick={close}
                          data-umami-event="nav"
                          data-umami-event-url={dropdownItem.href}
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-line-subtle group-hover:text-edusport-blue transition-colors shrink-0" />
                          <div>
                            <span className="text-body-sm text-primary group-hover:text-edusport-blue transition-colors">
                              {dropdownItem.label}
                            </span>
                            {dropdownItem.description && (
                              <span className="text-caption block text-secondary mt-0.5">
                                {dropdownItem.description}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavigationMenuInteractive;
