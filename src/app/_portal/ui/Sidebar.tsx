"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/icon";
import { BrandBlock } from "@/app/_portal/ui/BrandBlock";
import { isActive, type NavItem } from "@/app/_portal/lib/nav";
import { cn } from "@/utils/cn";

const FOCUS = "outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ice";

/** Desktop navy sidebar: brand, the links, and the account button (it links to Profil). Hidden below the desktop breakpoint. */
export function Sidebar({
  items,
  account,
  label,
  brandHref,
}: {
  items: NavItem[];
  account: { label: string; href: string; ariaLabel?: string };
  label: string;
  brandHref: string;
}) {
  const pathname = usePathname();
  return (
    <aside
      data-sidebar
      className="sticky top-0 hidden h-svh w-(--portal-sidebar-w) shrink-0 flex-col gap-8 bg-surface-dark px-4 pt-(--portal-sidebar-pad-top) pb-6 text-surface-raised portal:flex"
    >
      <div className="px-(--portal-sidebar-pad-x)">
        <BrandBlock dark href={brandHref} />
      </div>
      <nav aria-label={label} className="flex flex-col gap-(--portal-gap-6)">
        {items
          .filter((item) => item.href !== account.href)
          .map((item) => {
            const on = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex min-h-(--portal-sidebar-link-h) items-center gap-3 px-(--portal-sidebar-pad-x) text-(length:--portal-sidebar-link-size) no-underline hover:no-underline",
                  FOCUS,
                  on ? "bg-ice font-bold text-primary" : "font-semibold text-nav-on-dark hover:bg-surface-subtle-on-dark",
                )}
              >
                <Icon name={item.icon} size="20" />
                {item.label}
              </Link>
            );
          })}
      </nav>
      <Link
        href={account.href}
        data-sidebar-account
        aria-label={account.ariaLabel}
        className={cn(
          "mt-auto flex min-h-(--portal-sidebar-link-h) items-center justify-between gap-2 border border-(--portal-band-on-dark-line) px-(--portal-sidebar-pad-x) text-(length:--portal-text-15) font-bold text-surface-raised no-underline hover:no-underline",
          FOCUS,
        )}
      >
        {account.label}
        <Icon name="portal-chevron-right" size="sm" />
      </Link>
    </aside>
  );
}
