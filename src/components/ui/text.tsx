import React from "react";
import { cn } from "@/utils/cn";

type Variant = "body" | "heading" | "caption" | "branding";

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  body: "text-base text-primary",
  heading: "text-title text-primary",
  caption: "text-xs text-secondary",
  branding: "text-base text-branding-font text-primary-on-dark",
};

export const Text: React.FC<TextProps> = ({
  variant = "body",
  children,
  className = "",
  ...props
}) => (
  <span className={cn(variantClasses[variant], className)} {...props}>
    {children}
  </span>
);
