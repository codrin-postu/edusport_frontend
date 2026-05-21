"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import {
  Users,
  CalendarCheck,
  Layers,
  ShieldAlert,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

import type { RegulationCategory } from "./_types";

type RuleCategory = RegulationCategory;

interface Props {
  categories: RuleCategory[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users className="w-4 h-4" />,
  CalendarCheck: <CalendarCheck className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  MessageCircle: <MessageCircle className="w-4 h-4" />,
};

const ICON_BG_MAP: Record<string, string> = {
  Users: "bg-blue-50 text-edusport-blue",
  CalendarCheck: "bg-amber-50 text-amber-600",
  Layers: "bg-purple-50 text-purple-600",
  ShieldAlert: "bg-sky-50 text-sky-600",
  MessageCircle: "bg-rose-50 text-rose-500",
};

const RegulamentPage: React.FC<Props> = ({ categories }) => {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(categories.length > 0 ? [categories[0].title] : []),
  );

  const toggle = (title: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });

  return (
    <div className={cn("min-h-screen", "bg-white")}>
      <PageHeroSection title={["REGULAMENT"]} breadcrumb={[{ label: "Cursuri", href: "/cursuri" }, { label: "Regulament" }]}>
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Regulament Cursuri
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          Condițiile de participare, regulile de conduită pe gheață și
          informațiile esențiale pentru o experiență sigură și plăcută la
          cursurile Școlii de Patinaj EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-white py-16 md:py-24">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Regulament
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 max-w-lg">
                Regulament Scoala de Patinaj EduSport
              </h2>
              <p className="text-sm text-gray-400 font-light md:text-right md:max-w-xs">
                Vă rugăm să citiți cu atenție înainte de prima ședință.
              </p>
            </div>
          </div>

          {/* Category blocks */}
          {categories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-gray-300">
                Regulamentul nu este disponibil momentan
              </p>
              <p className="text-sm text-gray-400 mt-2 font-light">
                Reveniți în curând.
              </p>
            </div>
          ) : (
          <div className="flex flex-col gap-4">
            {categories.map((category, catIndex) => {
              const isOpen = openSections.has(category.title);
              const ruleOffset = categories
                .slice(0, catIndex)
                .reduce((sum, c) => sum + c.rules.length, 0);
              return (
                <div key={category.title}>
                  {/* Category header - clickable toggle */}
                  <button
                    onClick={() => toggle(category.title)}
                    className="w-full flex items-center gap-3 py-4 text-left hover:opacity-70 transition-opacity"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                        ICON_BG_MAP[category.icon] ?? "bg-gray-50 text-gray-500",
                      )}
                    >
                      {ICON_MAP[category.icon] ?? <Layers className="w-4 h-4" />}
                    </div>
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-700">
                      {category.title}
                    </h2>
                    <span className="ml-auto text-xs text-gray-400 font-light tabular-nums mr-3">
                      {category.rules.length}{" "}
                      {category.rules.length === 1 ? "regulă" : "reguli"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {/* Rules list */}
                  {isOpen && (
                    <div className="flex flex-col divide-y divide-gray-100 border-l-2 border-l-edusport-blue/10 ml-4 mb-6">
                      {category.rules.map((rule, ruleIndex) =>
                        rule.highlight ? (
                          <div
                            key={ruleIndex}
                            className="flex gap-5 items-start py-4 pl-5 pr-4 rounded-xl bg-amber-50/60 border border-amber-100 my-1 -ml-px"
                          >
                            <span
                              className="text-3xl font-bold text-amber-200 tabular-nums w-10 shrink-0 leading-none select-none"
                              aria-hidden
                            >
                              {String(ruleOffset + ruleIndex + 1).padStart(2, "0")}
                            </span>
                            <p className="text-sm text-gray-700 font-normal leading-relaxed pt-1">
                              {rule.text}
                            </p>
                          </div>
                        ) : (
                          <div
                            key={ruleIndex}
                            className="flex gap-5 items-start py-5 pl-6"
                          >
                            <span
                              className="text-3xl font-bold text-gray-100 tabular-nums w-10 shrink-0 leading-none select-none"
                              aria-hidden
                            >
                              {String(ruleOffset + ruleIndex + 1).padStart(2, "0")}
                            </span>
                            <p className="text-sm text-gray-600 font-light leading-relaxed pt-1">
                              {rule.text}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}

          {/* Acceptance gradient card */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div
              className="relative overflow-hidden rounded-3xl px-8 py-10 md:px-14 md:py-12 flex flex-col md:flex-row md:items-center gap-8"
              style={{
                background:
                  "linear-gradient(145deg, oklch(0.25 0.12 264) 0%, oklch(0.421 0.2593 264.52) 60%, oklch(0.55 0.18 230) 100%)",
              }}
            >
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-10 bg-white" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-5 bg-white" />

              {/* Text */}
              <div className="flex flex-col gap-3 flex-1 relative">
                <p className="text-xs font-semibold tracking-widest uppercase text-white/50">
                  Acceptare
                </p>
                <p className="text-white text-base md:text-lg font-light leading-relaxed">
                  Prin înscrierea la cursurile Școlii de Patinaj EduSport,
                  părinții/tutorii confirmă că au citit, înțeles și acceptat în
                  totalitate prezentul regulament.
                </p>
              </div>

              {/* Vertical divider on desktop */}
              <div className="hidden md:block w-px self-stretch bg-white/15" />

              {/* CTA */}
              <div className="relative shrink-0">
                <a
                  href="/inscrieri"
                  className="inline-flex items-center text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-full px-6 py-3 transition-colors"
                >
                  Înscrie-te acum
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegulamentPage;
