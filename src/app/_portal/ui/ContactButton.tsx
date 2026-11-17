import Link from "@/components/ui/link";
import Icon from "@/components/ui/icon";
import { cn } from "@/utils/cn";

export function ContactButton({
  href,
  icon,
  label,
  primary,
  external,
}: {
  href: string;
  icon: "portal-phone" | "portal-whatsapp";
  label: string;
  primary?: boolean;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      tone="plain"
      external={external}
      className={cn(
        "flex min-h-12 items-center justify-center gap-2 border-control border-line px-(--portal-contact-pad-x) text-(length:--portal-text-14) font-bold no-underline outline-none hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus",
        primary ? "bg-surface-dark text-white" : "bg-surface-raised text-primary",
      )}
    >
      <Icon name={icon} size="18" />
      {label}
    </Link>
  );
}
