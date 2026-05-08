"use client";

import Link from "@/components/ui/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar, Clock, MapPin } from "lucide-react";
import { motion } from "motion/react";
import React, { useRef } from "react";
import { ScrollSkatingFigure } from "@/components/ui/skating-figure";
import type { HomepageRegistration } from "../_types";

/* ------------------------------------------------------------------ */
/* Ghost branding text                                                  */
/* ------------------------------------------------------------------ */

const BoldTextStrip: React.FC = () => {
  const words = ["SCOALA", "DE", "PATINAJ"];
  return (
    <div className="flex flex-col gap-0 items-end opacity-[0.1] pointer-events-none select-none">
      {words.map((word, i) => (
        <motion.span
          key={word}
          className="text-branding-font text-white leading-none"
          style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.15 + i * 0.1,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main section                                                        */
/* ------------------------------------------------------------------ */

interface RegistrationSectionProps {
  cms?: HomepageRegistration | null;
}

const RegistrationSection: React.FC<RegistrationSectionProps> = ({ cms }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const seasonLabel = cms?.seasonLabel ?? "Sezonul 2025–2026";
  const heading = cms?.heading ?? "Sezonul a început!";
  const body = cms?.body ?? "Visezi să aluneci grațios pe gheață? La Școala de Patinaj EduSport te așteptăm într-un mediu prietenos și plin de energie, indiferent dacă ești la primii pași sau vrei să îți perfecționezi tehnica.";
  const bodySecondary = cms?.bodySecondary ?? "Cursurile sunt deschise pentru toate nivelurile - începători, intermediari și avansați - cu antrenori foști sportivi de performanță. Ne vedem sâmbăta și duminica, 4 octombrie 2025, la patinoarul Cotroceni On Ice din AFI Cotroceni.";
  const scheduleDays = cms?.scheduleDays ?? "Sâmbătă & Duminică";
  const scheduleTimes = cms?.scheduleTimes ?? "10:00–10:50 & 11:00–11:50";
  const locationName = cms?.locationName ?? "AFI Cotroceni";
  const ctaPrimaryLabel = cms?.ctaPrimaryLabel ?? "Înscrie-te";
  const ctaPrimaryUrl = cms?.ctaPrimaryUrl ?? "/inscrieri";
  const ctaSecondaryLabel = cms?.ctaSecondaryLabel ?? "Află mai mult";
  const ctaSecondaryUrl = cms?.ctaSecondaryUrl ?? "/cursuri";
  const pricesLinkLabel = cms?.pricesLinkLabel ?? "Vezi prețurile";
  const pricesLinkUrl = cms?.pricesLinkUrl ?? "/cursuri#preturi";

  return (
    <div
      ref={sectionRef}
      className="relative h-full flex flex-col justify-start md:justify-center pt-20 pb-8 bg-edusport-blue"
    >
          {/* Ghost branding text - right side */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 hidden md:flex">
            <BoldTextStrip />
          </div>

          {/* Scroll-driven loop figure */}
          <ScrollSkatingFigure
            figure="loop"
            sectionRef={sectionRef}
            right={70}
            top="10%"
            size={100}
            rotate={-45}
            scrollOffset={["start 60%", "end 60%"]}
            scrollRange={[0, 0.5]}
            className="hidden md:block"
          />

          <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
            <div className="relative flex flex-col gap-8 max-w-2xl">
              {/* Label */}
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-white/60">
                  {seasonLabel}
                </p>
              </div>

              {/* Heading + summary */}
              <div className="flex flex-col gap-4">
                <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
                  {heading}
                </h2>
                <p className="text-white text-lg font-light leading-relaxed">
                  {body}
                </p>
                {bodySecondary && (
                  <p className="text-white text-lg font-light leading-relaxed">
                    {bodySecondary}
                  </p>
                )}
              </div>

              {/* Schedule strip */}
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-white/80 text-sm font-light">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {scheduleDays}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 shrink-0" />
                  {scheduleTimes}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {locationName}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
                <Link href={ctaPrimaryUrl} className="w-full sm:w-auto">
                  <SpotlightButton
                    variant="white"
                    hoverColor="oklch(0.25 0.12 264)"
                    hoverTextColor="white"
                    className="w-full sm:w-auto px-10 py-4 text-base font-semibold rounded-full"
                  >
                    {ctaPrimaryLabel}
                  </SpotlightButton>
                </Link>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-4 h-auto text-base font-medium rounded-full !bg-transparent text-white border-white hover:!bg-white hover:text-black"
                  asChild
                >
                  <Link href={ctaSecondaryUrl}>{ctaSecondaryLabel}</Link>
                </Button>
              </div>

              {/* Prices link */}
              <Link
                href={pricesLinkUrl}
                className="group relative inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-current after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left w-fit"
              >
                {pricesLinkLabel}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
    </div>
  );
};

export default RegistrationSection;
