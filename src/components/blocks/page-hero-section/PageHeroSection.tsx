import { ChevronRight } from "lucide-react";
import React from "react";
import { WarmStripe } from "@/components/ui/warm-stripe";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

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
    <section className="sticky top-20 z-0">
      <div className="relative w-full overflow-hidden bg-navy text-retro-cream" style={{ minHeight: "330px" }}>
        <WarmStripe className="absolute inset-x-0 top-0 z-20 h-1.5" />

        {title && (
          <div
            aria-hidden
            className="absolute right-0 top-16 pr-2 hidden md:flex flex-col items-end opacity-[0.1] pointer-events-none select-none"
          >
            {title.map((word) => (
              <span
                key={word}
                className="text-branding-font text-retro-cream leading-none"
                style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
              >
                {word}
              </span>
            ))}
          </div>
        )}

        <div className="relative w-full max-w-content mx-auto px-4 md:px-8 lg:px-12 py-16 flex items-start">
          <div className="flex flex-col gap-6 max-w-xl">
            <div className="flex items-center gap-1.5 text-eyebrow font-bold uppercase text-retro-cream/55">
              {breadcrumb ? breadcrumb.map((item, i) => (
                <React.Fragment key={item.label}>
                  {i > 0 && <ChevronRight className="w-3 h-3 shrink-0" />}
                  {item.href ? (
                    <a href={item.href} className="transition-colors hover:text-rust">
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-retro-cream/80">{item.label}</span>
                  )}
                </React.Fragment>
              )) : <span>&nbsp;</span>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeroSection;
