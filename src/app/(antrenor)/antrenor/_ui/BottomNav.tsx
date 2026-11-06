"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { NAV_ITEMS, isActive } from "./TopNav";

/** Phone bottom bar: Azi, Grupe, Istoric, Profil. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Meniu" className="lg:hidden fixed inset-x-0 bottom-0 z-sticky bg-surface-raised border-t border-line">
      <ul className="flex">
        {NAV_ITEMS.map((item) => (
          <li key={item.href} className="flex-1">
            <Link
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "h-16 flex items-center justify-center text-button outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary-on-dark",
                isActive(pathname, item.href) ? "bg-surface-dark text-primary-on-dark" : "text-primary",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
