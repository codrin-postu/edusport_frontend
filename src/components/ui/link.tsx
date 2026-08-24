import { LinkVariants } from "@/utils/constants";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import NextLink from "next/link";
import React from "react";

type LinkType = "internal" | "external" | "phone" | "email";

interface LinkProps extends React.ComponentPropsWithoutRef<typeof NextLink> {
  className?: string;
  href: string;
  variant?: LinkVariants;
  linkType?: LinkType;
}

const variantClasses: Record<LinkVariants, string> = {
  header: "text-navy hover:text-edusport-blue",
  footer: "text-white hover:text-gray-300",
  footerAnimated:
    "text-white/[0.72] hover:text-white relative inline-flex items-center gap-1 group transition-colors",
  default: "text-edusport-blue hover:text-navy",
};

const linkTypeIcons: Record<LinkType, React.FC<{ className?: string }> | null> = {
  internal: null,
  external: ArrowUpRight,
  phone: Phone,
  email: Mail,
};

const Link: React.FC<LinkProps> = ({
  className = "",
  href,
  children,
  variant = LinkVariants.DEFAULT,
  linkType = "external",
  ...rest
}) => {
  const classes = `${variantClasses[variant]} transition-colors ${className}`;

  if (variant === LinkVariants.FOOTER_ANIMATED) {
    const Icon = linkTypeIcons[linkType];
    return (
      <NextLink className={classes} href={href} {...rest}>
        <span className="link-underline-animate">{children}</span>
        {Icon && (
          <Icon className="w-4 h-4 shrink-0 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0" />
        )}
      </NextLink>
    );
  }

  return (
    <NextLink className={classes} href={href} {...rest}>
      {children}
    </NextLink>
  );
};

export default Link;
