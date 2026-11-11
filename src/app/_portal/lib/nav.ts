import type { IconName } from "@/components/ui/icon";

export type NavItem = { href: string; label: string; icon: IconName; match?: string[] };

/** True when `pathname` is the item's page, below it, or under one of its `match` prefixes. */
export function isActive(pathname: string, item: NavItem): boolean {
  if (pathname === item.href) return true;
  if (item.href !== "/" && pathname.startsWith(`${item.href}/`)) return true;
  return (item.match ?? []).some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}
