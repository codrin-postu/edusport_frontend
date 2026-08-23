"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

export type CalendarMode = "month" | "week";

const OPTIONS: { value: CalendarMode; label: string }[] = [
  { value: "month", label: "Lunar" },
  { value: "week", label: "Săptămânal" },
];

const ViewModeDropdown: React.FC<{
  value: CalendarMode;
  onChange: (v: CalendarMode) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-[34px] inline-flex items-center gap-2 border-[1.5px] border-navy bg-transparent px-3 text-[11px] font-bold uppercase tracking-[0.04em] text-navy"
      >
        {current.label}
        <span
          aria-hidden
          className={cn("text-[8px] leading-none transition-transform duration-200", open && "rotate-180")}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="absolute right-0 max-[520px]:right-auto max-[520px]:left-0 z-30 mt-1 min-w-[150px] border-[1.5px] border-navy bg-retro-cream shadow-[4px_4px_0_rgb(14_26_60_/_0.16)]">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={cn(
                "block w-full text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.04em]",
                o.value === value
                  ? "bg-navy text-retro-cream"
                  : "text-navy hover:bg-navy/[0.06]",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewModeDropdown;
