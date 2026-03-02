import { LinkVariants } from "@/utils/constants";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import React from "react";

type LinkType = "internal" | "external" | "phone" | "email";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  href?: string;
  variant?: LinkVariants;
  linkType?: LinkType;
}

const variantClasses: Record<LinkVariants, string> = {
  header: "text-[#282828] hover:text-blue-800",
  footer: "text-white hover:text-gray-300",
  footerAnimated:
    "text-white relative inline-flex items-center gap-1 group transition-colors",
  default: "text-blue-600 hover:text-blue-800",
};

const linkTypeIcons: Record<LinkType, React.FC<{ className?: string }> | null> = {
  internal: null,
  external: ArrowUpRight,
  phone: Phone,
  email: Mail,
};

const Link: React.FC<LinkProps> = ({
  className = "",
  href = "#",
  children,
  variant = LinkVariants.DEFAULT,
  linkType = "external",
  ...rest
}) => {
  const classes = `${variantClasses[variant]} transition-colors ${className}`;

  if (variant === LinkVariants.FOOTER_ANIMATED) {
    const Icon = linkTypeIcons[linkType];
    return (
      <a className={classes} href={href} {...rest}>
        <span className="link-underline-animate">{children}</span>
        {Icon && (
          <Icon className="w-4 h-4 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0" />
        )}
      </a>
    );
  }

  return (
    <a className={classes} href={href} {...rest}>
      {children}
    </a>
  );
};

export default Link;
