import Link from "next/link";
import { cn } from "@/utils/cn";

/** The public header brand: "CLUBUL SPORTIV" over the EDUSPORT wordmark. `dark` is for the navy sidebar. */
export function BrandBlock({ dark, href }: { dark?: boolean; href: string }) {
  return (
    <Link href={href} aria-label="Clubul Sportiv EduSport" className="inline-flex flex-col gap-px leading-none no-underline hover:no-underline">
      <span
        className={cn(
          "text-(length:--portal-brand-kicker) font-normal leading-none tracking-(--portal-brand-tracking)",
          dark ? "text-nav-on-dark" : "text-secondary",
        )}
      >
        CLUBUL SPORTIV
      </span>
      <span
        className={cn(
          "text-branding-font text-(length:--portal-brand-word) tracking-(--portal-brand-word-tracking) leading-none",
          dark ? "text-surface-raised" : "text-primary",
        )}
      >
        EDUSPORT
      </span>
    </Link>
  );
}
