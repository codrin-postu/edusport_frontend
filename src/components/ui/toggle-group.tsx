"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/utils/cn";

export interface PillOption<T extends string> {
  value: T;
  label: string;
}

export interface ToggleGroupProps<T extends string> {
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  className,
  disabled,
  "aria-label": ariaLabel,
}: ToggleGroupProps<T>) {
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
    // the button exactly, integer truncation left a ~1px cream sliver.
    const cRect = container.getBoundingClientRect();
    const bRect = activeBtn.getBoundingClientRect();
    setIndicatorStyle({
      width: bRect.width,
      transform: `translateX(${bRect.left - cRect.left}px)`,
    });
    setReady(true);
  }, [value, options]);

  const handleChange = useCallback(
    (next: T) => {
      if (disabled) return;
      onChange(next);
    },
    [disabled, onChange],
  );

  // Arrow-key navigation between radio options, wrapping at the ends, per the
  // native radiogroup keyboard pattern.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const activeIndex = options.findIndex((o) => o.value === value);
      let nextIndex: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextIndex = (activeIndex + 1) % options.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        nextIndex = (activeIndex - 1 + options.length) % options.length;
      }
      if (nextIndex === null) return;
      e.preventDefault();
      const next = options[nextIndex];
      handleChange(next.value);
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>("button");
      buttons?.[nextIndex]?.focus();
    },
    [disabled, options, value, handleChange],
  );

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative inline-flex border-[1.5px] border-line bg-surface",
        disabled && "pointer-events-none border-line-subtle",
        className,
      )}
    >
      {/* Sliding indicator, snappy tight ease */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 bottom-0 left-0 transition-all duration-fast ease-standard",
          disabled ? "bg-disabled" : "bg-surface-dark",
        )}
        style={indicatorStyle}
      />

      {/* Buttons */}
      <div ref={containerRef} className="relative flex gap-0">
        {options.map((option) => (
          <button
            key={option.value}
            role="radio"
            aria-checked={value === option.value}
            tabIndex={value === option.value ? 0 : -1}
            onClick={() => handleChange(option.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "text-label relative z-raised px-6 py-3 uppercase transition-colors duration-fast select-none",
              "outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary",
              disabled
                ? value === option.value ? "text-primary-on-dark" : "text-disabled"
                : !ready
                  ? "text-primary"
                  : value === option.value
                    ? "text-primary-on-dark"
                    : "text-secondary hover:text-primary",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ToggleGroup;
