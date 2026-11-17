"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/icon";
import { isActive, type NavItem } from "@/app/_portal/lib/nav";
import { cn } from "@/utils/cn";

/** Phone floating nav: navy bar, the current page as an ice tile. Hidden from the desktop breakpoint. */
export function BottomNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={label}
      data-bottom-nav
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      className="fixed inset-x-0 bottom-0 z-sticky mx-(--portal-nav-margin) mb-(--portal-nav-margin) grid rounded-(--portal-nav-radius) bg-surface-dark p-(--portal-nav-pad) portal:hidden"
    >
      {items.map((item) => {
        const on = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={on ? "page" : undefined}
            className={cn(
              "flex min-h-(--portal-nav-item-h) flex-col items-center justify-center gap-(--portal-nav-item-gap) text-(length:--portal-nav-label) no-underline outline-none hover:no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ice",
              on ? "rounded-(--portal-nav-item-radius) bg-ice font-bold text-primary" : "font-semibold text-secondary-on-dark",
            )}
          >
            <Icon name={item.icon} size="20" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
