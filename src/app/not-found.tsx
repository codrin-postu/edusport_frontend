"use client";

import Link from "next/link";
import React from "react";
import { motion } from "motion/react";
import { SkatingFigureLine } from "@/components/ui/skating-figure";
import { Link as AnimatedLink } from "@/components";
import { LinkVariants } from "@/utils/constants";
import SpotlightButton from "@/components/ui/spotlight-button";

const quickLinks = [
  { href: "/cursuri", label: "Cursuri" },
  { href: "/cursuri/program", label: "Program" },
  { href: "/despre-noi/echipa", label: "Despre noi" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <div className="relative min-h-screen -mb-24 md:-mb-32 pb-24 md:pb-32 overflow-hidden bg-edusport-blue text-white flex items-center justify-center px-4">
      {/* Decorative skating-figure lines */}
      <SkatingFigureLine
        figure="loop"
        size={140}
        top="6%"
        left="8%"
        rotate={-15}
        strokeOpacity={0.18}
        strokeWidth={1.6}
      />
      <SkatingFigureLine
        figure="3-turn"
        size={110}
        top="55%"
        right="6%"
        rotate={20}
        strokeOpacity={0.18}
        strokeWidth={1.6}
      />
      <SkatingFigureLine
        figure="s-step"
        size={90}
        bottom="8%"
        left="14%"
        rotate={-8}
        strokeOpacity={0.14}
        strokeWidth={1.4}
      />

      <div className="relative z-10 max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h1
            className="text-[8rem] md:text-[11rem] font-bold leading-none tracking-tight"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
              404
            </span>
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-3xl font-semibold mt-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Ai patinat puțin prea departe
          </motion.h2>

          <motion.p
            className="text-white/70 mt-3 text-base md:text-lg max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Pagina pe care o cauți nu există sau a fost mutată. Te ajutăm să te
            întorci pe gheață.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Link href="/" className="inline-block">
            <SpotlightButton
              variant="white"
              hoverColor="var(--color-edusport-blue)"
              hoverTextColor="#ffffff"
              animationDuration={0.7}
            >
              Înapoi la pagina principală
            </SpotlightButton>
          </Link>

          <div className="w-full">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
              Sau încearcă
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {quickLinks.map((l) => (
                <AnimatedLink
                  key={l.href}
                  href={l.href}
                  variant={LinkVariants.FOOTER_ANIMATED}
                  linkType="internal"
                >
                  {l.label}
                </AnimatedLink>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
