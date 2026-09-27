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
    <div className="min-h-screen bg-surface">
      <PageHeroSection title={["REGULAMENT"]} breadcrumb={[{ label: "Cursuri", href: "/cursuri" }, { label: "Regulament" }]}>
        <h1 className="text-display text-primary-on-dark">
          Regulament Cursuri
        </h1>
        <p className="text-body text-secondary-on-dark">
          Condițiile de participare, regulile de conduită pe gheață și
          informațiile esențiale pentru o experiență sigură și plăcută la
          cursurile Școlii de Patinaj EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-surface section">
        <div className="w-full max-w-content mx-auto gutter">
          <div className="flex flex-col gap-3 mb-16">
            <span className="text-label uppercase text-accent">Regulament</span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-heading text-primary max-w-narrow">
                Regulament Școala de Patinaj EduSport
              </h2>
              <p className="text-body-sm text-secondary md:text-right md:max-w-aside">
                Vă rugăm să citiți cu atenție înainte de prima ședință.
              </p>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-body text-secondary">
                Regulamentul nu este disponibil momentan
              </p>
              <p className="text-body-sm text-secondary mt-2">Reveniți în curând.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {categories.map((category, catIndex) => {
                const isOpen = openSections.has(category.title);
                const ruleOffset = categories
                  .slice(0, catIndex)
                  .reduce((sum, c) => sum + c.rules.length, 0);
                return (
                  <div key={category.title} className="border-t-retro border-line-subtle">
                    <button
                      onClick={() => toggle(category.title)}
                      className="w-full flex items-center gap-3 py-4 text-left hover:opacity-70 transition-opacity"
                    >
                      <span className="w-8 h-8 flex items-center justify-center shrink-0 text-accent">
                        {ICON_MAP[category.icon] ?? <Layers className="w-5 h-5" />}
                      </span>
                      <h3 className="text-label uppercase text-primary">
                        {category.title}
                      </h3>
                      <span className="text-caption ml-auto text-secondary tabular-nums mr-3">
                        {category.rules.length}{" "}
                        {category.rules.length === 1 ? "regulă" : "reguli"}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-primary shrink-0 transition-transform duration-200",
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
                              className="flex gap-4 items-start bg-surface-dark -mx-4 px-4 py-4 my-2"
                            >
                              <span
                                className="text-heading w-9 shrink-0 text-mustard tabular-nums select-none"
                                aria-hidden
                              >
                                {num}
                              </span>
                              <p className="text-body-sm text-primary-on-dark pt-1">
                                {rule.text}
                              </p>
                            </div>
                          ) : (
                            <div
                              key={ruleIndex}
                              className={cn(
                                "flex gap-4 items-start py-4",
                                showRule && "border-t border-line-subtle",
                              )}
                            >
                              <span
                                className="text-heading w-9 shrink-0 text-line-subtle tabular-nums select-none"
                                aria-hidden
                              >
                                {num}
                              </span>
                              <p className="text-body-sm text-secondary pt-1">
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
          <div className="mt-12 bg-surface border-retro border-line shadow-retro p-8 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="text-label uppercase text-accent">Acceptare</p>
              <p className="text-body text-primary mt-2">
                Prin înscrierea la cursurile Școlii de Patinaj EduSport,
                părinții/tutorii confirmă că au citit, înțeles și acceptat în
                totalitate prezentul regulament.
              </p>
            </div>
            <SpotlightButton
              layers
              layersFace="black"
              href="/inscrieri"
              className="text-caption shrink-0"
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
