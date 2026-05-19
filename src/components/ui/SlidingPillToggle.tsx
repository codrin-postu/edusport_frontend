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
    setIndicatorStyle({
      width: activeBtn.offsetWidth,
      transform: `translateX(${activeBtn.offsetLeft}px)`,
    });
    setReady(true);
  }, [value, options]);

  const handleChange = disabled ? () => {} : onChange;

  return (
    <div
      aria-disabled={disabled || undefined}
      className={cn(
        "relative inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {/* Sliding indicator */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-full bg-edusport-blue transition-all duration-200 ease-in-out"
        style={indicatorStyle}
      />

      {/* Buttons */}
      <div ref={containerRef} className="relative flex gap-0">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleChange(option.value)}
            className={cn(
              "relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full select-none",
              !ready
                ? "text-gray-500"
                : value === option.value
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-700",
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
