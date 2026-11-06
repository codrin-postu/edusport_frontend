"use client";

import { cn } from "@/utils/cn";

type SegmentedProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <div role="group" className="flex border-retro border-line divide-x divide-line">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 h-12 text-button outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary-on-dark",
            o.value === value ? "bg-surface-dark text-primary-on-dark" : "bg-surface-raised text-primary",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
