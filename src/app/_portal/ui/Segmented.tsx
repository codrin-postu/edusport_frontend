"use client";

import { cn } from "@/utils/cn";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex self-start border-control border-line">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex min-h-(--portal-tap) items-center px-4 transition-colors duration-(--motion-fast) ease-(--motion-ease) text-(length:--portal-text-14) font-bold outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
            o.value === value ? "bg-surface-dark text-surface-raised" : "bg-surface-raised text-primary",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
