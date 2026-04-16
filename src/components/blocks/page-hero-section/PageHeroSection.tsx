import Image from "next/image";
import { ChevronRight } from "lucide-react";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  title?: string[];
  breadcrumb?: BreadcrumbItem[];
  variant?: "blue" | "light" | "purple" | "dark";
}

const DARK_GRADIENT =
  "linear-gradient(135deg, oklch(0.18 0.04 264) 0%, oklch(0.28 0.06 264) 60%, oklch(0.32 0.05 240) 100%)";

const PageHeroSection: React.FC<PageHeroSectionProps> = ({
  children,
  backgroundImage = "/images/courses.png",
  title,
  breadcrumb,
  variant = "blue",
}) => {
  const isLight = variant === "light";
  const isPurple = variant === "purple";
  const isDark = variant === "dark";

  return (
    <section className="sticky top-20 z-0">
      <div className="relative w-full overflow-hidden" style={{ minHeight: "330px" }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        {/* Solid colour overlay */}
        {!isLight && !isPurple && !isDark && <div className="absolute inset-0 bg-edusport-blue/90" />}
        {isPurple && <div className="absolute inset-0 bg-purple-700/90" />}
        {isDark && <div className="absolute inset-0" style={{ background: DARK_GRADIENT }} />}

        {/* Ghost branding text — right side */}
        {title && (
          <div
            aria-hidden
            className={"absolute right-0 top-16 pr-2 hidden md:flex flex-col gap-0 items-end opacity-[0.1] pointer-events-none select-none"}
          >
            {title.map((word) => (
              <span
                key={word}
                className={`text-branding-font leading-none ${isLight ? "text-black" : "text-white"}`}
                style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
              >
                {word}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative w-full max-w-content mx-auto px-4 md:px-8 lg:px-12 py-16 flex items-start">
          <div className="flex flex-col gap-6 max-w-xl">
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase ${isLight ? "text-gray-900/30" : "text-white/40"}`}
            >
              {breadcrumb ? breadcrumb.map((item, i) => (
                <React.Fragment key={item.label}>
                  {i > 0 && <ChevronRight className="w-3 h-3 shrink-0" />}
                  {item.href ? (
                    <a
                      href={item.href}
                      className={`transition-colors ${isLight ? "hover:text-gray-900/60" : "hover:text-white/70"}`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className={isLight ? "text-gray-900/60" : "text-white/70"}>
                      {item.label}
                    </span>
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
