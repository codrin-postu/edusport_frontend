"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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

type Panel = {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
};

interface AboutUsSectionProps {
  cms?: {
    eyebrow?: string;
    heading?: string;
    body?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
}

const AboutUsSection: React.FC<AboutUsSectionProps> = ({ cms }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  const panels: Panel[] = [
    {
      eyebrow: cms?.eyebrow ?? "Cine suntem",
      heading: cms?.heading ?? "Asociație non-profit\npentru sport și educație",
      body:
        cms?.body ??
        "Fondată în 2012, EduSport este o asociație non-profit dedicată dezvoltării sportive și educative a tinerilor — de la primii pași pe gheață până la podiumuri naționale.",
      ctaLabel: cms?.ctaLabel ?? "Despre noi",
      ctaUrl: cms?.ctaUrl ?? "/despre-noi",
    },
    {
      eyebrow: "Echipa noastră",
      heading: "Antrenori dedicați,\ncursanți motivați",
      body: "Patru antrenori certificați FRPA, fiecare cu o poveste proprie pe gheață. Împreună ghidează peste 50 de cursanți în 6 grupe.",
      ctaLabel: "Cunoaște echipa",
      ctaUrl: "/despre-noi/echipa",
    },
    {
      eyebrow: "Realizările noastre",
      heading: "32 de medalii\nși tot înainte",
      body: "De la primul campionat național la competiții internaționale, cursanții EduSport au urcat pe podium de 32 de ori în 8 ani.",
      ctaLabel: "Vezi realizările",
      ctaUrl: "/despre-noi/realizari",
    },
  ];

  useEffect(() => {
    function handleScroll() {
      const el = sectionRef.current;
      if (!el) return;
      // Disable sticky scroll on mobile
      if (window.innerWidth < 768) {
        setStep(0);
        return;
      }
      const scrolled = -el.getBoundingClientRect().top;
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        setStep(0);
        return;
      }
      if (scrolled <= 0) {
        setStep(0);
        return;
      }
      if (scrolled >= scrollable) {
        setStep(2);
        return;
      }
      setStep(Math.min(2, Math.floor((scrolled / scrollable) * 3)));
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white overflow-hidden"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-100 z-10">
          <div
            className="h-full bg-blue-600 transition-[width] duration-500"
            style={{
              width: step === 0 ? "33%" : step === 1 ? "66%" : "100%",
              transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>

        <div className="w-full h-full flex items-center">
          <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 w-full">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* LEFT: Notebook */}
              <div className="relative md:order-first">
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
              </div>

              {/* RIGHT: Text panels */}
              <div className="relative min-h-[320px] md:order-last">
                {/* Ghost number */}
                <div
                  aria-hidden
                  className="absolute right-0 top-1/2 -translate-y-1/2 font-['League_Spartan'] text-[clamp(80px,12vw,160px)] font-black leading-none pointer-events-none select-none"
                  style={{ color: "rgba(0,0,0,0.03)" }}
                >
                  0{step + 1}
                </div>

                {panels.map((panel, i) => (
                  <div
                    key={i}
                    aria-hidden={i !== step}
                    style={{
                      position: i === step ? "relative" : "absolute",
                      inset: i !== step ? "0" : undefined,
                      opacity: i === step ? 1 : 0,
                      transform:
                        i === step
                          ? "translateY(0)"
                          : i < step
                            ? "translateY(-28px)"
                            : "translateY(28px)",
                      transition:
                        "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
                      pointerEvents: i === step ? "auto" : "none",
                    }}
                  >
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-3.5">
                      {panel.eyebrow}
                    </p>
                    <h2
                      className="font-['League_Spartan'] text-[clamp(28px,4vw,44px)] font-extrabold text-gray-900 leading-tight mb-5"
                      style={{ letterSpacing: "-0.5px" }}
                    >
                      {panel.heading.split("\n").map((line, j) => (
                        <React.Fragment key={j}>
                          {j > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                    </h2>
                    <p className="text-[15px] text-gray-400 leading-relaxed mb-7 max-w-sm">
                      {panel.body}
                    </p>
                    <Link
                      href={panel.ctaUrl}
                      className="inline-flex items-center gap-1 text-[15px] text-blue-600 font-medium hover:underline"
                    >
                      {panel.ctaLabel} <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    {/* Step counter — purely decorative, not clickable */}
                    <div className="flex items-center gap-2.5 mt-7">
                      <div className="w-5 h-px bg-gray-300" />
                      <span className="text-[10px] text-gray-300 uppercase tracking-[0.15em] select-none">
                        0{i + 1} / 03
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
