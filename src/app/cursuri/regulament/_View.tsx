"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import SpotlightButton from "@/components/ui/spotlight-button";
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
  Users: <Users className="w-5 h-5" />,
  CalendarCheck: <CalendarCheck className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  MessageCircle: <MessageCircle className="w-5 h-5" />,
};

const RegulamentPage: React.FC<Props> = ({ categories }) => {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(categories.map((c) => c.title)),
  );

  const toggle = (title: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });

  return (
    <div className="min-h-screen bg-retro-cream">
      <PageHeroSection title={["REGULAMENT"]} breadcrumb={[{ label: "Cursuri", href: "/cursuri" }, { label: "Regulament" }]}>
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Regulament Cursuri
        </h1>
        <p className="text-retro-cream/70 text-base">
          Condițiile de participare, regulile de conduită pe gheață și
          informațiile esențiale pentru o experiență sigură și plăcută la
          cursurile Școlii de Patinaj EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-retro-cream py-16 md:py-24">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col gap-3 mb-14">
            <span className="text-eyebrow font-bold uppercase text-rust">Regulament</span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px] max-w-lg">
                Regulament Școala de Patinaj EduSport
              </h2>
              <p className="text-sm text-navy/50 md:text-right md:max-w-xs">
                Vă rugăm să citiți cu atenție înainte de prima ședință.
              </p>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-navy/30">
                Regulamentul nu este disponibil momentan
              </p>
              <p className="text-sm text-navy/50 mt-2">Reveniți în curând.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {categories.map((category, catIndex) => {
                const isOpen = openSections.has(category.title);
                const ruleOffset = categories
                  .slice(0, catIndex)
                  .reduce((sum, c) => sum + c.rules.length, 0);
                return (
                  <div key={category.title} className="border-t-[1.5px] border-navy/15">
                    <button
                      onClick={() => toggle(category.title)}
                      className="w-full flex items-center gap-3 py-[18px] text-left hover:opacity-70 transition-opacity"
                    >
                      <span className="w-8 h-8 flex items-center justify-center shrink-0 text-rust">
                        {ICON_MAP[category.icon] ?? <Layers className="w-5 h-5" />}
                      </span>
                      <h3 className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-navy">
                        {category.title}
                      </h3>
                      <span className="ml-auto text-xs text-navy/45 font-semibold tabular-nums mr-3">
                        {category.rules.length}{" "}
                        {category.rules.length === 1 ? "regulă" : "reguli"}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-navy shrink-0 transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div className="flex flex-col pb-4">
                        {category.rules.map((rule, ruleIndex) => {
                          const num = String(ruleOffset + ruleIndex + 1).padStart(2, "0");
                          // No divider line directly under a highlighted (navy) rule.
                          const showRule =
                            ruleIndex > 0 && !category.rules[ruleIndex - 1].highlight;
                          return rule.highlight ? (
                            <div
                              key={ruleIndex}
                              className="flex gap-4 items-start bg-navy -mx-4 px-4 py-4 my-1.5"
                            >
                              <span
                                className="font-display font-extrabold text-[28px] leading-none w-9 shrink-0 text-mustard tabular-nums select-none"
                                aria-hidden
                              >
                                {num}
                              </span>
                              <p className="text-sm text-retro-cream leading-relaxed pt-1">
                                {rule.text}
                              </p>
                            </div>
                          ) : (
                            <div
                              key={ruleIndex}
                              className={cn(
                                "flex gap-4 items-start py-3.5",
                                showRule && "border-t border-navy/[0.08]",
                              )}
                            >
                              <span
                                className="font-display font-extrabold text-[28px] leading-none w-9 shrink-0 text-navy/15 tabular-nums select-none"
                                aria-hidden
                              >
                                {num}
                              </span>
                              <p className="text-sm text-navy/70 leading-relaxed pt-1">
                                {rule.text}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Acceptance card */}
          <div className="mt-12 bg-retro-cream border-[1.5px] border-navy shadow-[8px_8px_0_rgba(14,26,60,0.16)] p-8 md:p-9 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="text-eyebrow font-bold uppercase text-rust">Acceptare</p>
              <p className="text-navy text-base leading-relaxed mt-2">
                Prin înscrierea la cursurile Școlii de Patinaj EduSport,
                părinții/tutorii confirmă că au citit, înțeles și acceptat în
                totalitate prezentul regulament.
              </p>
            </div>
            <SpotlightButton
              layers
              layersFace="black"
              href="/inscrieri"
              className="text-xs shrink-0"
            >
              Înscrie-te acum
            </SpotlightButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegulamentPage;
