import { LinkVariants } from "@/utils/constants";
import React from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  href?: string;
  variant?: LinkVariants;
}

const variantClasses: Record<LinkVariants, string> = {
  header: "text-[#282828] hover:text-blue-800",
  default: "text-blue-600 hover:text-blue-800",
};

const Link: React.FC<LinkProps> = ({
  className = "",
  href = "#",
  children,
  variant = LinkVariants.DEFAULT,
  ...rest
}) => {
  const classes = `${variantClasses[variant]} transition-colors ${className}`;
  return (
    <a className={classes} href={href} {...rest}>
      {children}
    </a>
  );
};

export default Link;
