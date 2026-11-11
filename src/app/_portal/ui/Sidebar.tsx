"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/ui/icon";
import { BrandBlock } from "@/app/_portal/ui/BrandBlock";
import { isActive, type NavItem } from "@/app/_portal/lib/nav";
import { cn } from "@/utils/cn";

const FOCUS = "outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ice";

/** One row of the account menu: a link (`href`) or an action (`onSelect`). */
export type AccountMenuItem = { label: string; icon: IconName } & ({ href: string; onSelect?: never } | { onSelect: () => void; href?: never });
export type SidebarAccount = { label: string; href: string; ariaLabel?: string; menu?: AccountMenuItem[] };

const MENU_ITEM = "flex min-h-11 w-full items-center gap-3 px-(--portal-sidebar-pad-x) text-left text-(length:--portal-text-15) font-semibold text-primary no-underline hover:bg-ice-light hover:no-underline";

/** Desktop navy sidebar: brand, the links, and the account button (it links to Profil). Hidden below the desktop breakpoint. */
export function Sidebar({
  items,
  account,
  label,
  brandHref,
}: {
  items: NavItem[];
  account: SidebarAccount;
  label: string;
  brandHref: string;
}) {
  const pathname = usePathname();
  const [closed, setClosed] = useState(false);
  const accountRef = useRef<HTMLAnchorElement>(null);
  const skipFocus = useRef(false);
  const menu = account.menu;
  // Open = hover or focus inside; Escape forces it shut until the pointer leaves or focus comes back.
  const open = (on: string) => (closed ? "" : on);
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
      <div
        className="group/acct relative mt-auto"
        data-closed={closed ? "" : undefined}
        onMouseLeave={() => setClosed(false)}
        onFocus={() => { if (skipFocus.current) skipFocus.current = false; else setClosed(false); }}
        onKeyDown={(e) => {
          if (e.key !== "Escape" || !menu) return;
          setClosed(true);
          skipFocus.current = true;
          accountRef.current?.focus();
        }}
      >
        {menu && (
          <div
            role="menu"
            aria-label={account.label}
            className={cn(
              "invisible absolute inset-x-0 bottom-full translate-y-1 pb-2 opacity-0 transition-[opacity,transform,visibility] duration-(--motion-base) ease-(--motion-ease)",
              open("group-hover/acct:visible group-hover/acct:translate-y-0 group-hover/acct:opacity-100 group-focus-within/acct:visible group-focus-within/acct:translate-y-0 group-focus-within/acct:opacity-100"),
            )}
          >
            <div className="flex flex-col border border-line-subtle bg-surface-raised py-(--portal-account-menu-pad) shadow-(--portal-account-menu-shadow)">
              {menu.map((item, i) => (
                <div key={item.label}>
                  {i > 0 && <div role="separator" className="my-(--portal-account-menu-pad) h-px bg-line-subtle" />}
                  {item.href !== undefined ? (
                    <Link href={item.href} role="menuitem" className={cn(MENU_ITEM, FOCUS)}>
                      <Icon name={item.icon} size="18" />
                      {item.label}
                    </Link>
                  ) : (
                    <button type="button" role="menuitem" onClick={item.onSelect} className={cn(MENU_ITEM, "cursor-pointer", FOCUS)}>
                      <Icon name={item.icon} size="18" />
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <Link
          ref={accountRef}
          href={account.href}
          data-sidebar-account
          aria-label={account.ariaLabel}
          aria-haspopup={menu ? "menu" : undefined}
          className={cn(
            "flex min-h-(--portal-sidebar-link-h) items-center justify-between gap-2 px-(--portal-sidebar-pad-x) text-(length:--portal-text-15) font-bold text-surface-raised no-underline transition-colors duration-(--motion-base) ease-(--motion-ease) hover:no-underline",
            open("group-hover/acct:bg-surface-subtle-on-dark group-focus-within/acct:bg-surface-subtle-on-dark"),
            FOCUS,
          )}
        >
          {account.label}
          <Icon
            name="portal-chevron-right"
            size="sm"
            className={cn("transition-transform duration-(--motion-base) ease-(--motion-ease)", open("group-hover/acct:-rotate-90 group-focus-within/acct:-rotate-90"))}
          />
        </Link>
      </div>
    </aside>
  );
}
