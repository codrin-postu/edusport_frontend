"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import Icon from "@/components/ui/icon";
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
  /** The trigger sits on a dark (navy) panel. */
  onDark?: boolean;
  className?: string;
  contentClassName?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
  "aria-required"?: boolean | "true" | "false";
  "aria-labelledby"?: string;
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
  onDark = false,
  className,
  contentClassName,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  "aria-required": ariaRequired,
  "aria-labelledby": ariaLabelledby,
}) => {
  const [open, setOpen] = useState(false);
  const items = options.filter((o) => o.value !== "");
  const selected = items.find((o) => o.value === value);
  const triggerSizeClasses = cn(
    onDark ? "bg-surface-subtle-on-dark" : "bg-surface",
    size === "compact" ? "min-h-10 px-3" : "h-12 px-4",
    "text-body-sm",
  );

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
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedby}
            aria-required={ariaRequired}
            aria-labelledby={ariaLabelledby}
            className={cn(
              "w-full flex items-center justify-between gap-2 text-left",
              triggerSizeClasses,
              "border-retro outline-none transition-all",
              onDark ? "border-line-on-dark" : "border-line",
              onDark
                ? "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-on-dark"
                : "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary",
              !selected && (onDark ? "text-secondary-on-dark" : "text-secondary"),
              selected && (onDark ? "text-primary-on-dark" : "text-primary"),
              disabled &&
                (onDark
                  ? "text-disabled border-line-subtle-on-dark"
                  : "text-disabled border-line-subtle"),
              disabled && "cursor-not-allowed",
              className,
            )}
          >
            <span className="truncate flex-1">
              {selected?.label ?? placeholder}
            </span>
            <Icon
              name="chevron-down"
              className={cn(
                "text-secondary transition-transform duration-fast",
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
              "z-sticky max-h-72 overflow-auto p-1",
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
                    <Icon name="check" />
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
