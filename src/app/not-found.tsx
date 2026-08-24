"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import SpotlightButton from "@/components/ui/spotlight-button";

const quickLinks = [
  { href: "/cursuri", label: "Cursuri" },
  { href: "/cursuri/program", label: "Program" },
  { href: "/despre-noi/echipa", label: "Despre noi" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-retro-cream text-navy flex items-center justify-center px-4 py-24">
      <div className="relative z-10 max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h1
            className="font-display text-9xl md:text-[11rem] font-black text-navy leading-none tracking-tight"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            404
          </motion.h1>

          <motion.h2
            className="font-display text-3xl md:text-4xl font-extrabold mt-2 tracking-[-0.4px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Ai patinat puțin prea departe
          </motion.h2>

          <motion.p
            className="text-navy/60 mt-3 text-base max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Pagina pe care o cauți nu există sau a fost mutată.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <SpotlightButton layers layersFace="black" href="/" className="text-sm">
            Înapoi la pagina principală
          </SpotlightButton>

          <div className="w-full">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {quickLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="link-underline-rust font-semibold text-rust"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
