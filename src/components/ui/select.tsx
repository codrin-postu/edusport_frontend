"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/utils/cn";

export interface SelectItemOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectItemOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  size?: "default" | "compact";
  className?: string;
  contentClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  id,
  name,
  value,
  onValueChange,
  options,
  placeholder = "Selectează...",
  required,
  disabled,
  size = "default",
  className,
  contentClassName,
}) => {
  const [open, setOpen] = useState(false);
  const items = options.filter((o) => o.value !== "");
  const selected = items.find((o) => o.value === value);
  const triggerSizeClasses =
    size === "compact"
      ? "bg-surface h-12 px-3 text-sm"
      : "bg-surface h-12 px-4 text-sm";

  return (
    <>
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
        />
      )}
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            id={id}
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            className={cn(
              "w-full flex items-center justify-between gap-2 text-left",
              triggerSizeClasses,
              "border-retro border-line outline-none transition-all",
              "focus:border-rust focus:ring-2 focus:ring-rust/25",
              "data-[state=open]:border-rust data-[state=open]:ring-2 data-[state=open]:ring-rust/25",
              !selected && "text-secondary",
              selected && "text-primary",
              disabled && "opacity-60 cursor-not-allowed",
              className,
            )}
          >
            <span className="truncate flex-1">
              {selected?.label ?? placeholder}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-secondary shrink-0 transition-transform duration-200",
                open && "rotate-180 text-accent",
              )}
            />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={6}
            className={cn(
              "z-50 max-h-72 overflow-auto p-1",
              "min-w-[var(--radix-dropdown-menu-trigger-width)]",
              "border-retro border-line bg-surface shadow-retro",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              contentClassName,
            )}
          >
            <DropdownMenu.RadioGroup
              value={value}
              onValueChange={onValueChange}
            >
              {items.map((opt) => (
                <DropdownMenu.RadioItem
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    "relative flex items-center justify-between gap-2 px-3 py-2 text-sm",
                    "cursor-pointer select-none outline-none transition-colors text-primary",
                    "data-[highlighted]:bg-surface-subtle data-[highlighted]:text-primary",
                    "data-[state=checked]:text-accent data-[state=checked]:font-semibold",
                  )}
                >
                  <span className="flex-1 truncate">{opt.label}</span>
                  <DropdownMenu.ItemIndicator>
                    <Check className="w-4 h-4 shrink-0" />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};
