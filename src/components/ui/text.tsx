import React from "react";

type Variant = "body" | "heading" | "caption" | "branding";

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  body: "text-base text-gray-800",
  heading: "text-2xl font-bold text-gray-900",
  caption: "text-xs text-gray-500",
  branding: "text-base text-branding-font text-white",
};

export const Text: React.FC<TextProps> = ({
  variant = "body",
  children,
  className = "",
  ...props
}) => (
  <span className={`${variantClasses[variant]} ${className}`} {...props}>
    {children}
  </span>
);
