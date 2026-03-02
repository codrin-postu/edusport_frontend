"use client";

import Link from "@/components/ui/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar, Clock, MapPin } from "lucide-react";
import { motion } from "motion/react";
import React, { useRef } from "react";
import { ScrollSkatingFigure } from "@/components/ui/skating-figure";

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
/* Cross-square transition strip                                        */
/* ------------------------------------------------------------------ */

const SQUARE_SIZE = 36;
const ROWS = 2;

// Stable style objects — computed once from module-level constants
const CROSS_ROW_STYLE_EVEN: React.CSSProperties = {
  height: SQUARE_SIZE,
  backgroundImage: `repeating-linear-gradient(
    90deg,
    white 0px,
    white ${SQUARE_SIZE}px,
    transparent ${SQUARE_SIZE}px,
    transparent ${SQUARE_SIZE * 2}px
  )`,
  backgroundSize: `${SQUARE_SIZE * 2}px ${SQUARE_SIZE}px`,
};

const CROSS_ROW_STYLE_ODD: React.CSSProperties = {
  height: SQUARE_SIZE,
  backgroundImage: `repeating-linear-gradient(
    90deg,
    transparent 0px,
    transparent ${SQUARE_SIZE}px,
    white ${SQUARE_SIZE}px,
    white ${SQUARE_SIZE * 2}px
  )`,
  backgroundSize: `${SQUARE_SIZE * 2}px ${SQUARE_SIZE}px`,
};

const CrossTransition: React.FC = () => (
  <div
    aria-hidden
    className="absolute bottom-0 left-0 w-full pointer-events-none"
    style={{ height: SQUARE_SIZE * ROWS }}
  >
    <div style={CROSS_ROW_STYLE_EVEN} />
    <div style={CROSS_ROW_STYLE_ODD} />
  </div>
);

/* ------------------------------------------------------------------ */
/* Main section                                                        */
/* ------------------------------------------------------------------ */

const RegistrationSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-white">
      <div className="w-full">
        {/* Banner */}
        <div
          ref={sectionRef}
          className="relative overflow-hidden py-16 md:py-20 bg-edusport-blue"
          style={{
            paddingBottom: `calc(4rem + ${SQUARE_SIZE * ROWS}px)`,
          }}
        >
          {/* Ghost branding text — right side */}
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

          {/* Cross-square seam at the bottom */}
          <CrossTransition />

          <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
            <div className="relative flex flex-col gap-8 max-w-2xl">
              {/* Label */}
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-white/60">
                  Sezonul 2025–2026
                </p>
              </div>

              {/* Heading + summary */}
              <div className="flex flex-col gap-4">
                <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
                  Sezonul a început!
                </h2>
                <p className="text-white text-lg font-light leading-relaxed">
                  Visezi să aluneci grațios pe gheață? La Școala de Patinaj
                  EduSport te așteptăm într-un mediu prietenos și plin de
                  energie, indiferent dacă ești la primii pași sau vrei să îți
                  perfecționezi tehnica.
                </p>
                <p className="text-white text-base font-light leading-relaxed">
                  Cursurile sunt deschise pentru toate nivelurile —{" "}
                  <span className="font-medium">
                    începători, intermediari și avansați
                  </span>{" "}
                  — cu antrenori foști sportivi de performanță. Ne vedem sâmbăta
                  și duminica,{" "}
                  <span className="font-medium">4 octombrie 2025</span>, la
                  patinoarul Cotroceni On Ice din AFI Cotroceni.
                </p>
              </div>

              {/* Schedule strip */}
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-white/80 text-sm font-light">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 shrink-0" />
                  Sâmbătă &amp; Duminică
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 shrink-0" />
                  10:00–10:50 &amp; 11:00–11:50
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 shrink-0" />
                  AFI Cotroceni
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
                <Link href="#" className="w-full sm:w-auto">
                  <SpotlightButton
                    variant="white"
                    hoverColor="oklch(0.25 0.12 264)"
                    hoverTextColor="white"
                    className="w-full sm:w-auto px-10 py-4 text-base font-semibold rounded-full"
                  >
                    Înscrie-te
                  </SpotlightButton>
                </Link>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-4 h-auto text-base font-medium rounded-full !bg-transparent text-white border-white hover:!bg-white hover:text-black"
                  asChild
                >
                  <Link href="/inscrieri">Află mai mult</Link>
                </Button>
              </div>

              {/* Prices link */}
              <Link
                href="/inscrieri#preturi"
                className="group relative inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-current after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left w-fit"
              >
                Vezi prețurile
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
