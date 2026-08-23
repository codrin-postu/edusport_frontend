import { cn } from "@/utils/cn";
import React from "react";

/** Base class string for form inputs on light (cream) page backgrounds */
export const inputBase =
  "w-full px-4 py-3 text-sm bg-retro-cream border-[1.5px] border-navy text-navy outline-none focus:border-rust focus:ring-2 focus:ring-rust/25 transition-[color,box-shadow,border-color] placeholder:text-navy/40";

/** Variant for inputs inside a light card/panel container */
export const inputBaseOnCard =
  "w-full px-4 py-3 text-sm bg-white border-[1.5px] border-navy text-navy outline-none focus:border-rust focus:ring-2 focus:ring-rust/25 transition-[color,box-shadow,border-color] placeholder:text-navy/40";

/** Variant for inputs inside a dark (navy) panel — cream text, mustard focus */
export const inputOnNavy =
  "w-full px-4 py-3 text-sm bg-white/[0.06] border-[1.5px] border-retro-cream/35 text-retro-cream outline-none focus:border-mustard focus:ring-2 focus:ring-mustard/25 transition-[color,box-shadow,border-color] placeholder:text-retro-cream/40";

export const FieldLabel: React.FC<{
  htmlFor: string;
  children: React.ReactNode;
  /** "dark" for use inside a navy panel (cream label) */
  tone?: "light" | "dark";
}> = ({ htmlFor, children, tone = "light" }) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      "block text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5",
      tone === "dark" ? "text-retro-cream/60" : "text-navy/55",
    )}
  >
    {children}
  </label>
);

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  wrapperClassName?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  wrapperClassName,
  className,
  ...props
}) => (
  <div className={wrapperClassName}>
    {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
    <input id={id} className={cn(inputBase, className)} {...props} />
  </div>
);

