"use client";

import Link from "@/components/ui/link";
import { LinkVariants } from "@/utils/constants";
import { ArrowUpRight, ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const [shine, setShine] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const menuRef = useRef<HTMLDivElement>(null);

  const handlePromoMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setShine({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
  }, []);

  const handlePromoMouseLeave = useCallback(() => {
    setShine((s) => ({ ...s, active: false }));
  }, []);

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
      className="relative flex items-center gap-x-5 h-12"
      onMouseLeave={close}
    >
      {/* Nav buttons */}
      {items.map((item, index) => {
        const itemIsOpen = activeIndex === index;

        if (item.dropdown) {
          return (
            <button
              key={item.label}
              className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors outline-none"
              onMouseEnter={() => open(index)}
              onClick={() => (itemIsOpen ? close() : open(index))}
            >
              {item.label}
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${itemIsOpen ? "rotate-180" : ""}`}
              />
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href || "#"}
            variant={LinkVariants.HEADER}
            className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
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
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full left-0 pt-6 z-50"
          >
            <div className="rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden">
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
                  {/* Left - Promo card (square) */}
                  {activeItem!.promo && activeItem!.dropdown!.length > 0 && (
                    <Link
                      href={activeItem!.dropdown![0].href}
                      variant={LinkVariants.HEADER}
                      onClick={close}
                      onMouseMove={handlePromoMouseMove}
                      onMouseLeave={handlePromoMouseLeave}
                      className={`relative w-[280px] h-[200px] shrink-0 self-start m-2 rounded-xl bg-gradient-to-br ${activeItem!.promo.gradient} p-6 flex flex-col justify-start overflow-hidden`}
                    >
                      {/* Link icon */}
                      <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-white/60" />
                      {/* Cursor-following diagonal shine */}
                      <div
                        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                        style={{
                          opacity: shine.active ? 1 : 0,
                          background: `linear-gradient(135deg, transparent ${Math.max(0, ((shine.x + shine.y) / 4.8) - 30)}%, rgba(255,255,255,0.18) ${((shine.x + shine.y) / 4.8)}%, transparent ${Math.min(100, ((shine.x + shine.y) / 4.8) + 30)}%)`,
                        }}
                      />
                      <h3 className="relative text-base font-bold text-white leading-tight">
                        {activeItem!.promo.title}
                      </h3>
                      <p className="relative text-[11px] text-white/90 font-medium leading-relaxed mt-1.5">
                        {activeItem!.promo.description}
                      </p>
                    </Link>
                  )}

                  {/* Right - Links */}
                  <div className="flex flex-col py-3 px-2 min-w-[360px]">
                    <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest uppercase text-gray-400">
                      {activeItem!.label}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {activeItem!.dropdown!.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          variant={LinkVariants.HEADER}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={close}
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-edusport-blue transition-colors shrink-0" />
                          <div>
                            <span className="text-sm font-semibold text-gray-900 group-hover:text-edusport-blue transition-colors">
                              {dropdownItem.label}
                            </span>
                            {dropdownItem.description && (
                              <span className="block text-xs text-gray-500 font-light mt-0.5">
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
