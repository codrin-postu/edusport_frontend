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
        className="text-label h-[34px] inline-flex items-center gap-2 border-retro border-line bg-transparent px-3 uppercase text-primary"
      >
        {current.label}
        <span
          aria-hidden
          className={cn("text-caption transition-transform duration-fast", open && "rotate-180")}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="absolute right-0 max-[520px]:right-auto max-[520px]:left-0 z-raised mt-1 min-w-[150px] border-retro border-line bg-surface shadow-retro-sm">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={cn(
                "text-label block w-full text-left px-3 py-3 uppercase",
                o.value === value
                  ? "bg-surface-dark text-primary-on-dark"
                  : "text-primary hover-layer",
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
