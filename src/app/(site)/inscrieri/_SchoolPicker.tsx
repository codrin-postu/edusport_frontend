"use client";

import React, { useRef, useState } from "react";
import Button from "@/components/ui/button";
import { cn } from "@/utils/cn";

type School = { name: string; slug: string };

/** Arrow keys move the choice through the list and wrap (WAI-ARIA radio group). */
const ARROW_STEP: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };

/** "Alege școala" (spec 3.3): shown only with 2 or more schools, or after an unknown `?scoala=`. */
export const SchoolPicker: React.FC<{
  schools: School[];
  unknownSlug: boolean;
  onChoose: (slug: string) => void;
}> = ({ schools, unknownSlug, onChoose }) => {
  const [picked, setPicked] = useState("");
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  // One tab stop: the chosen school, or the first one before any choice.
  const tabStop = Math.max(schools.findIndex((s) => s.slug === picked), 0);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const step = ARROW_STEP[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + schools.length) % schools.length;
    setPicked(schools[next].slug);
    radios.current[next]?.focus();
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-title text-primary">Alege școala</h3>
      {unknownSlug && <p className="text-caption text-accent">Școala nu a fost găsită.</p>}
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Alege școala">
        {schools.map((s, i) => (
          <button
            key={s.slug}
            ref={(el) => {
              radios.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={picked === s.slug}
            tabIndex={i === tabStop ? 0 : -1}
            onClick={() => setPicked(s.slug)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={cn(
              "border-retro p-4 text-left text-body-sm font-semibold text-primary transition-colors",
              picked === s.slug ? "border-rust bg-surface-raised" : "border-line bg-surface",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="flex justify-end pt-6 border-t-retro border-line-subtle">
        <Button face="black" onClick={() => onChoose(picked)} disabled={!picked}>
          Continuă
        </Button>
      </div>
    </div>
  );
};

/** The chosen school, pinned above every step when there was a choice. */
export const PinnedSchool: React.FC<{ name: string; onChange: () => void }> = ({ name, onChange }) => (
  <div className="flex items-baseline justify-between gap-3 mb-8 pb-4 border-b-retro border-line-subtle">
    <span className="text-body-sm text-primary">
      <span className="text-label uppercase text-secondary block mb-1">Școala</span>
      {name}
    </span>
    <button type="button" onClick={onChange} className="text-body-sm link text-accent">
      Schimbă
    </button>
  </div>
);
