import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";
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

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  options: SelectOption[];
  wrapperClassName?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  options,
  wrapperClassName,
  className,
  value,
  ...props
}) => (
  <div className={wrapperClassName}>
    {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
    <div className="relative">
      <select
        id={id}
        value={value}
        className={cn(
          inputBase,
          "appearance-none pr-10 cursor-pointer",
          !value && "text-gray-400",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            disabled={opt.value === ""}
          >
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  </div>
);
