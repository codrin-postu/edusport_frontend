"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface SlidingPillToggleProps<T extends string> {
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
}

function SlidingPillToggle<T extends string>({
  options,
  value,
  onChange,
  className,
  disabled,
}: SlidingPillToggleProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeIndex = options.findIndex((o) => o.value === value);
    const buttons = container.querySelectorAll<HTMLButtonElement>("button");
    const activeBtn = buttons[activeIndex];
    if (!activeBtn) return;
    // Use fractional rects (not offsetWidth/offsetLeft) so the indicator covers
    // the button exactly — integer truncation left a ~1px cream sliver.
    const cRect = container.getBoundingClientRect();
    const bRect = activeBtn.getBoundingClientRect();
    setIndicatorStyle({
      width: bRect.width,
      transform: `translateX(${bRect.left - cRect.left}px)`,
    });
    setReady(true);
  }, [value, options]);

  const handleChange = disabled ? () => {} : onChange;

  return (
    <div
      aria-disabled={disabled || undefined}
      className={cn(
        "relative inline-flex border-[1.5px] border-navy bg-retro-cream",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Sliding indicator — snappy tight ease */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 bottom-0 left-0 bg-navy transition-all duration-200 ease-[cubic-bezier(0.85,0,0.15,1)]"
        style={indicatorStyle}
      />

      {/* Buttons */}
      <div ref={containerRef} className="relative flex gap-0">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleChange(option.value)}
            className={cn(
              "relative z-10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.04em] transition-colors duration-200 select-none",
              !ready
                ? "text-navy"
                : value === option.value
                  ? "text-retro-cream"
                  : "text-navy/70 hover:text-navy",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SlidingPillToggle;
