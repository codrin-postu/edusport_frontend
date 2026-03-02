"use client";

import Link from "@/components/ui/link";
import { LinkVariants } from "@/utils/constants";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavigationItem {
  label: string;
  href?: string;
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

      {/* Dropdown panel — always rendered when open, never animates itself */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full left-0 pt-2 z-50"
          >
            <div className="rounded-3xl bg-white/75 backdrop-blur-xl border border-black/10 shadow-2xl overflow-hidden">
              {/* Inner content slides when switching items */}
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeItem!.label}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex gap-3 p-2"
                >
                  {/* Image */}
                  <div className="relative w-[300px] h-[300px] shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                    {activeItem!.image ? (
                      <Image
                        src={activeItem!.image}
                        alt={activeItem!.label}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex flex-col justify-start gap-1 min-w-[300px] py-1">
                    {activeItem!.dropdown!.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.href}
                        href={dropdownItem.href}
                        variant={LinkVariants.HEADER}
                        className="block px-3 py-2 rounded-xl hover:bg-white transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{dropdownItem.label}</span>
                        {dropdownItem.description && (
                          <span className="block text-xs text-gray-600 mt-0.5 whitespace-nowrap">{dropdownItem.description}</span>
                        )}
                      </Link>
                    ))}
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
