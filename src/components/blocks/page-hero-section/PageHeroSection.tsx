import React from "react";
import Breadcrumb, { type BreadcrumbItem } from "@/components/ui/breadcrumb";

interface PageHeroSectionProps {
  children: React.ReactNode;
  /** Kept for API compatibility; the retro hero is a solid navy band (no image). */
  backgroundImage?: string;
  title?: string[];
  breadcrumb?: BreadcrumbItem[];
  variant?: "blue" | "light" | "dark";
  /** Without a breadcrumb the hero keeps an empty line in its place, so titles
   *  line up across pages. `tight` drops that line (the Cursuri banner). */
  tight?: boolean;
}

const PageHeroSection: React.FC<PageHeroSectionProps> = ({ children, title, breadcrumb, tight = false }) => {
  return (
    // Sticks at the header's own live bottom edge (--header-h, published by
    // Header.tsx) instead of a fixed offset, so it never shifts as the
    // contact strip collapses. Its static position under `main`'s pt is the
    // same variable, so there is zero movement at any scroll position.
    <section className="sticky top-[calc(var(--header-h)_-_1rem)] z-base">
      <div className="relative w-full overflow-hidden bg-surface-dark text-primary-on-dark" style={{ minHeight: "330px" }}>
        {title && (
          <div
            aria-hidden
            className="absolute right-0 top-16 pr-2 hidden md:flex flex-col items-end pointer-events-none select-none"
          >
            {title.map((word) => (
              <span
                key={word}
                className="text-branding-font text-surface-subtle-on-dark leading-none"
                style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
              >
                {word}
              </span>
            ))}
          </div>
        )}

        <div className="relative w-full max-w-content mx-auto gutter py-16 flex items-start">
          <div className="flex flex-col gap-6 max-w-narrow">
            {breadcrumb ? (
              <Breadcrumb items={breadcrumb} onDark />
            ) : (
              !tight && <span>&nbsp;</span>
            )}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeroSection;
