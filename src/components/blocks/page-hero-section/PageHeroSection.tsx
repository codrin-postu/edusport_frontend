import React from "react";
import Breadcrumb, { type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { WarmStripe } from "@/components/ui/warm-stripe";

interface PageHeroSectionProps {
  children: React.ReactNode;
  /** Kept for API compatibility; the retro hero is a solid navy band (no image). */
  backgroundImage?: string;
  title?: string[];
  breadcrumb?: BreadcrumbItem[];
  variant?: "blue" | "light" | "dark";
}

const PageHeroSection: React.FC<PageHeroSectionProps> = ({ children, title, breadcrumb }) => {
  return (
    <section className="sticky top-20 z-base">
      <div className="relative w-full overflow-hidden bg-surface-dark text-primary-on-dark" style={{ minHeight: "330px" }}>
        <WarmStripe className="absolute inset-x-0 top-0 z-raised h-1.5" />

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
              <span>&nbsp;</span>
            )}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeroSection;
