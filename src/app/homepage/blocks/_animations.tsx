"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";
import { ScrollSkatingFigure } from "@/components/ui/skating-figure";

/* ------------------------------------------------------------------ */
/* RevealOnScroll - thin wrapper around motion.div whileInView         */
/* ------------------------------------------------------------------ */

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  margin?: string;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  y = 24,
  once = true,
  margin = "-80px",
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration, ease: "easeOut", delay }}
    viewport={{ once, margin }}
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* BoldTextStripClient - ghost branding words sliding in               */
/* ------------------------------------------------------------------ */

export const BoldTextStripClient: React.FC = () => {
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
/* RegistrationScrollFrame - owns sectionRef + ScrollSkatingFigure     */
/* Wraps server-rendered children. Preserves exact original animation. */
/* ------------------------------------------------------------------ */

interface RegistrationScrollFrameProps {
  children: React.ReactNode;
}

export const RegistrationScrollFrame: React.FC<RegistrationScrollFrameProps> = ({
  children,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      className="relative h-full flex flex-col justify-start md:justify-center pt-20 pb-8 bg-edusport-blue"
    >
      {/* Ghost branding text - right side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 hidden md:flex">
        <BoldTextStripClient />
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

      {children}
    </div>
  );
};
