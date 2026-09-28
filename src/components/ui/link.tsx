import { LinkVariants } from "@/utils/constants";
import NextLink from "next/link";
import React from "react";
import Icon, { type IconName } from "@/components/ui/icon";
import { cn } from "@/utils/cn";

type LinkType = "internal" | "external" | "phone" | "email";

interface LinkProps extends React.ComponentPropsWithoutRef<typeof NextLink> {
  className?: string;
  href: string;
  variant?: LinkVariants;
  linkType?: LinkType;
}

const variantClasses: Record<LinkVariants, string> = {
  header: "text-primary hover:text-accent",
  footer: "",
  footerAnimated:
    "text-secondary-on-dark hover:text-primary-on-dark relative inline-flex items-center gap-1 group transition-colors",
  default: "text-primary",
};

const linkTypeIcons: Record<LinkType, IconName | null> = {
  internal: null,
  external: "arrow-up-right",
  phone: "phone",
  email: "mail",
};

const Link: React.FC<LinkProps> = ({
  className = "",
  href,
  children,
  variant = LinkVariants.DEFAULT,
  linkType = "external",
  ...rest
}) => {
  // A caller using a link utility (link, link-on-dark, link-footer) gets its
  // colours from that utility; the variant's hover colour would otherwise
  // override it, since both sit at the same specificity.
  const usesLinkUtility = /(^|\s)link(-on-dark|-footer)?(\s|$)/.test(className);
  // cn() so a colour passed by the caller replaces the variant colour instead
  // of both landing on the element and the stylesheet order picking one.
  const classes = cn(usesLinkUtility ? "" : variantClasses[variant], "transition-colors", className);

  if (variant === LinkVariants.FOOTER_ANIMATED) {
    const iconName = linkTypeIcons[linkType];
    return (
      <NextLink className={classes} href={href} {...rest}>
        <span className="link">{children}</span>
        {iconName && (
          <Icon
            name={iconName}
            className="opacity-0 translate-y-1 transition-all duration-base group-hover:opacity-100 group-hover:translate-y-0"
          />
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
