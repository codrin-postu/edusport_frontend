"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "@/components/ui/link";
import { PATHS } from "@/components/ui/skating-figure";

const NOTEBOOK_LINES = 12;

type LineStyle = "normal" | "strikethrough" | "scratched";

interface NotebookLine {
  text: string;
  style: LineStyle;
  indent?: boolean;
  dim?: boolean;
  replacement?: string; // text written to the right after a scratch
}

const NOTEBOOK_CONTENT: NotebookLine[] = [
  { text: "Plan", style: "normal" },
  { text: "", style: "normal" },
  { text: "Muzică:", style: "normal", dim: true },
  { text: "Swan Lake — Tchaikovsky", style: "strikethrough", indent: true },
  {
    text: "Clair de Lune — Debussy",
    style: "scratched",
    indent: true,
    replacement: "Comptine d'un autre été",
  },
  { text: "", style: "normal" },
  { text: "Elemente:", style: "normal", dim: true },
  { text: "Axel simplu", style: "normal", indent: true },
  { text: "Lutz + toe loop", style: "normal", indent: true },
  {
    text: "Piruetă combinată",
    style: "scratched",
    indent: true,
    replacement: "Camel spin",
  },
  { text: "Step sequence nivel 2", style: "normal", indent: true },
  { text: "Spiral sequence", style: "normal", indent: true },
];

const AboutUsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0.05, 0.4], [30, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.05, 0.4], [0, 1]);

  const notebookY = useTransform(scrollYProgress, [0.1, 0.5], [50, 0]);
  const notebookOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const notebookRotate = useTransform(scrollYProgress, [0.1, 0.5], [3, 0]);

  return (
    <section ref={sectionRef} className="py-16 bg-white overflow-hidden">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Text — first on mobile, second on desktop */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="md:order-last"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-edusport-blue mb-4">
              Cine suntem
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-['League_Spartan'] leading-tight">
              Asociație non-profit
              <br /> pentru sport și educație
            </h2>
            <p className="text-base text-gray-400 leading-relaxed mb-10">
              Fondată în 2012, EduSport este o asociație non-profit dedicată
              dezvoltării sportive și educative a tinerilor — de la primii pași
              pe gheață până la podiumuri naționale.
            </p>
            <Link
              href="/about-us"
              className="group relative inline-flex items-center gap-1 text-base text-edusport-blue after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-edusport-blue after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
            >
              Despre noi
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Notebook — second on mobile, first on desktop */}
          <motion.div
            style={{
              y: notebookY,
              opacity: notebookOpacity,
              rotate: notebookRotate,
            }}
            className="relative md:order-first"
          >
            {/* Stacked pages behind */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-sm bg-gray-100 border border-gray-200/60" />
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-sm bg-gray-50 border border-gray-200/80" />

            {/* Main notebook page */}
            <div className="relative rounded-sm bg-white border border-gray-200 shadow-lg overflow-hidden">
              {/* Spiral binding holes */}
              <div className="absolute top-0 bottom-0 left-0 w-10 bg-gray-50 border-r border-gray-200 flex flex-col justify-around items-center py-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white shadow-inner"
                  />
                ))}
              </div>

              {/* Margin line */}
              <div className="absolute top-0 bottom-0 left-16 w-px bg-gray-200" />

              {/* Static skate path overlay — three-turn combo, bottom-center diagonal */}
              <svg
                aria-hidden
                viewBox="0 0 100 200"
                className="absolute pointer-events-none"
                style={{
                  width: 60,
                  height: 160,
                  bottom: -40,
                  left: "70%",
                  transform: "translateY(-40%) rotate(-35deg)",
                }}
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d={PATHS["3-turn-combo"]}
                  stroke="#000"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Ruled lines */}
              <div className="pl-10">
                <div className="pt-8 pb-4">
                  {Array.from({ length: NOTEBOOK_LINES }).map((_, i) => (
                    <div key={i} className="h-9 border-b border-gray-100" />
                  ))}
                </div>
              </div>

              {/* Text content overlaid on lines */}
              <div className="absolute inset-0 pt-8 pb-4 pl-[4.5rem] pr-5 flex flex-col pointer-events-none">
                {NOTEBOOK_CONTENT.map((line, i) => (
                  <div key={i} className="h-9 flex items-center relative">
                    {line.text && (
                      <span
                        className={[
                          "flex items-center gap-2 min-w-0",
                          line.indent ? "pl-3" : "",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "leading-none select-none relative shrink-0",
                            line.dim
                              ? "text-gray-400 text-sm font-handwriting mt-1"
                              : "text-base font-handwriting",
                            !line.dim && line.style === "normal"
                              ? "text-gray-700"
                              : "",
                            line.style === "strikethrough"
                              ? "text-gray-300 line-through decoration-gray-300"
                              : "",
                            line.style === "scratched" ? "text-gray-300" : "",
                          ].join(" ")}
                        >
                          {line.text}
                          {line.style === "scratched" && (
                            <svg
                              aria-hidden
                              viewBox="0 0 300 16"
                              preserveAspectRatio="none"
                              className="absolute inset-0 w-full h-full pointer-events-none"
                            >
                              <path
                                d="M0,6 Q40,3 80,7 Q140,11 200,6 Q250,3 300,7"
                                stroke="#9ca3af"
                                strokeWidth="1.5"
                                fill="none"
                                strokeLinecap="round"
                              />
                              <path
                                d="M0,10 Q60,13 120,9 Q180,6 240,11 Q270,13 300,9"
                                stroke="#9ca3af"
                                strokeWidth="1"
                                fill="none"
                                strokeLinecap="round"
                                opacity="0.6"
                              />
                            </svg>
                          )}
                        </span>
                        {line.replacement && (
                          <span className="text-base font-handwriting text-gray-700 leading-none select-none">
                            {line.replacement}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
