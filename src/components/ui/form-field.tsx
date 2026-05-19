import { cn } from "@/utils/cn";
import React from "react";

/** Base class string for form inputs on light (white) page backgrounds */
export const inputBase =
  "w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-edusport-blue focus:bg-white transition-colors placeholder:text-gray-400";

/** Variant for inputs inside card/panel containers (already grey-tinted) */
export const inputBaseOnCard =
  "w-full px-4 py-3 text-sm bg-white border border-gray-200 outline-none focus:border-edusport-blue focus:ring-1 focus:ring-edusport-blue/20 focus:-translate-y-px transition-all placeholder:text-gray-400";

export const FieldLabel: React.FC<{
  htmlFor: string;
  children: React.ReactNode;
}> = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
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

