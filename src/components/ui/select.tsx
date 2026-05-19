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
      ? "bg-gray-50 px-3 py-2.5 text-sm"
      : "bg-white px-4 py-3 text-sm";

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
              "border border-gray-200 outline-none transition-all",
              "focus:border-edusport-blue focus:ring-1 focus:ring-edusport-blue/20",
              "data-[state=open]:border-edusport-blue data-[state=open]:ring-1 data-[state=open]:ring-edusport-blue/20",
              !selected && "text-gray-400",
              selected && "text-gray-900",
              disabled && "opacity-60 cursor-not-allowed",
              className,
            )}
          >
            <span className="truncate flex-1">
              {selected?.label ?? placeholder}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                open && "rotate-180 text-edusport-blue",
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
              "rounded-xl border border-gray-200 bg-white shadow-lg",
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
                    "relative flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md",
                    "cursor-pointer select-none outline-none transition-colors",
                    "data-[highlighted]:bg-edusport-blue/5 data-[highlighted]:text-edusport-blue",
                    "data-[state=checked]:text-edusport-blue data-[state=checked]:font-medium",
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
