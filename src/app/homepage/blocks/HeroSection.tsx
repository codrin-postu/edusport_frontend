import Link from "@/components/ui/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import { cn } from "@/utils/cn";
import Image from "next/image";
import heroBackground from "/public/images/hero-background.png";
import React from "react";
import SkateParallax from "./SkateParallax";

const TYPEWRITER_TEXT = "Clubul Sportiv";
// Typewriter duration in ms — must match hero-typewriter animation in globals.css
const TYPEWRITER_DURATION_MS = 900;
const TYPEWRITER_DELAY_MS = 100;
// Each EDUSPORT letter animates in after the typewriter + a per-letter stagger
const EDUSPORT_START_MS = TYPEWRITER_DELAY_MS + TYPEWRITER_DURATION_MS + 200;
const LETTER_STAGGER_MS = 50;

const BrandingTitle: React.FC = () => (
  <span className="inline-flex">
    {"EDUSPORT".split("").map((letter, index) => (
      <span
        key={index}
        className="hero-letter text-branding-font text-edusport-blue"
        style={{
          animationDelay: `${EDUSPORT_START_MS + index * LETTER_STAGGER_MS}ms`,
          animationDuration: "350ms",
        }}
      >
        {letter}
      </span>
    ))}
  </span>
);

const HeroSection: React.FC = () => {
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
          className={cn("object-cover", "object-center")}
          priority
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
          {/* Title + motto — above skate */}
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
            <div className="flex flex-col gap-0">
              <p className="self-start font-sans font-light text-edusport-navy/50 text-base sm:text-base md:text-lg tracking-widest uppercase">
                <span className="inline-flex items-center">
                  <span className="hero-typewriter">{TYPEWRITER_TEXT}</span>
                  <span className="hero-cursor" aria-hidden="true">|</span>
                </span>
              </p>
              <h1 className="leading-none text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                <BrandingTitle />
              </h1>
            </div>

            <p
              className={cn(
                "font-sans",
                "text-edusport-navy/60",
                "font-light",
                "italic",
                "text-lg",
                "sm:text-xl",
                "md:text-2xl",
                "lg:text-3xl",
                "self-start",
              )}
            >
              Educație prin sport
            </p>
          </div>

          {/* Skate — Framer Motion isolated to this component */}
          <SkateParallax />

          {/* Button — above skate */}
          <div className={cn("relative", "z-30", "mt-16", "md:mt-12")}>
            <Link href="/courses">
              <SpotlightButton
                variant="black"
                className="px-12 py-5 text-xl font-semibold rounded-full"
              >
                Descoperă Cursurile
              </SpotlightButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
