import Link from "@/components/ui/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import { cn } from "@/utils/cn";
import Image from "next/image";
import heroBackground from "../../../../public/images/hero-background-2.png";
import React from "react";
import SkateParallax from "./SkateParallax";
import { motion } from "motion/react";

const TYPEWRITER_TEXT = "Clubul Sportiv";
// Typewriter duration in ms - must match hero-typewriter animation in globals.css
const TYPEWRITER_DURATION_MS = 900;
const TYPEWRITER_DELAY_MS = 100;
// Each EDUSPORT letter animates in after the typewriter + a per-letter stagger
const EDUSPORT_START_MS = TYPEWRITER_DELAY_MS + TYPEWRITER_DURATION_MS + 200;
const LETTER_STAGGER_MS = 50;

// Which letters should sit IN FRONT of the weaving line. Only D and O.
const LETTERS_IN_FRONT = new Set([1, 5]);

const BrandingTitle: React.FC = () => (
  <span className="inline-flex">
    {"EDUSPORT".split("").map((letter, index) => {
      const zClass = LETTERS_IN_FRONT.has(index) ? "z-[6]" : "z-[4]";
      return (
        <span
          key={index}
          className={`hero-letter text-branding-font text-edusport-blue relative ${zClass}`}
          style={{
            animationDelay: `${EDUSPORT_START_MS + index * LETTER_STAGGER_MS}ms`,
            animationDuration: "350ms",
          }}
        >
          {letter}
        </span>
      );
    })}
  </span>
);

const WEAVE_PATH =
  "M -10 100 C 60 0, 200 200, 340 100 C 360 80, 380 40, 415 40 C 470 40, 470 135, 415 135 C 380 135, 360 100, 380 75 C 470 0, 600 200, 810 100";

const WEAVE_DURATION = 4;
const WEAVE_DELAY = 2;
const WEAVE_CYCLE = 20;
const WEAVE_BURST = 0.12; // visible fraction of the path

const burstTransition = {
  duration: WEAVE_DURATION,
  // moderate-fast in, slow middle, moderate-fast out
  ease: [0.3, 0.1, 0.1, 0.2] as [number, number, number, number],
  delay: WEAVE_DELAY,
  repeat: Infinity,
  repeatDelay: WEAVE_CYCLE - WEAVE_DURATION,
};

const MAIN_STROKE = 8;

const WeavingLine: React.FC = () => (
  <svg
    aria-hidden
    className="absolute -top-[25%] -bottom-[25%] left-0 right-0 -translate-y-1 sm:-translate-y-1.5 md:-translate-y-2 pointer-events-none z-[5]"
    viewBox="0 0 800 200"
    preserveAspectRatio="none"
    overflow="visible"
    fill="none"
    style={{ color: "#ffffff" }}
  >
    <motion.path
      d={WEAVE_PATH}
      stroke="currentColor"
      strokeWidth={MAIN_STROKE}
      strokeLinecap="butt"
      pathLength="1"
      strokeDasharray={`${WEAVE_BURST} 100`}
      initial={{ strokeDashoffset: WEAVE_BURST }}
      animate={{ strokeDashoffset: -(1 + WEAVE_BURST) }}
      transition={burstTransition}
    />
  </svg>
);

interface HeroSectionProps {
  motto?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  motto,
  ctaLabel,
  ctaUrl,
}) => {
  const displayMotto = motto ?? "Educație prin sport";
  const displayCtaLabel = ctaLabel ?? "Descoperă Cursurile";
  const displayCtaUrl = ctaUrl ?? "/cursuri";

  return (
    <section
      className={cn(
        "relative",
        "h-screen",
        "max-h-[1200px]",
        "2xl:overflow-hidden",
      )}
    >
      <div className="overflow-x-clip h-full">
        {/* Background */}
        <Image
          src={heroBackground}
          alt="Hero background"
          fill
          sizes="100vw"
          className={cn("object-cover", "object-center")}
          priority
          placeholder="blur"
        />

        {/* Content area */}
        <div
          className={cn(
            "relative",
            "h-full",
            "flex",
            "flex-col",
            "items-center",
            "justify-start",
            "2xl:justify-center",
            "pt-28",
            "md:pt-24",
            "lg:pt-32",
            "2xl:pt-0",
          )}
        >
          {/* Title + motto - above skate */}
          <div
            className={cn(
              "relative",
              "z-30",
              "text-center",
              "px-4",
              "flex",
              "flex-col",
              "items-center",
              "gap-4",
              "md:gap-6",
            )}
          >
            <div className="flex flex-col gap-0 max-w-full">
              <p className="self-start font-sans font-light text-edusport-navy/50 text-xs sm:text-sm md:text-lg tracking-widest uppercase">
                {TYPEWRITER_TEXT}
              </p>
              <h1 className="leading-none text-[clamp(2rem,11vw,2.75rem)] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                <span className="relative inline-flex isolate">
                  <WeavingLine />
                  <BrandingTitle />
                </span>
              </h1>
            </div>

            <p
              className={cn(
                "font-sans",
                "text-edusport-navy/60",
                "font-light",
                "italic",
                "text-base",
                "sm:text-xl",
                "md:text-2xl",
                "lg:text-3xl",
                "self-start",
                "max-w-full",
              )}
            >
              {displayMotto}
            </p>
          </div>

          {/* Skate - Framer Motion isolated to this component */}
          <SkateParallax />

          {/* Button - above skate */}
          <div className={cn("relative", "z-30", "mt-16", "md:mt-12")}>
            <Link href={displayCtaUrl}>
              <SpotlightButton
                variant="black"
                className="px-12 py-5 text-xl font-semibold rounded-full"
              >
                {displayCtaLabel}
              </SpotlightButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
