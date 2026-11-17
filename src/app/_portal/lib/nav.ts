import type { IconName } from "@/components/ui/icon";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  match?: string[];
  /** Active on its own path only, not below it (a home page whose sub pages have their own items). */
  exact?: boolean;
};

/** True when `pathname` is the item's page, below it, or under one of its `match` prefixes. */
export function isActive(pathname: string, item: NavItem): boolean {
  if (pathname === item.href) return true;
  if (item.href !== "/" && !item.exact && pathname.startsWith(`${item.href}/`)) return true;
  return (item.match ?? []).some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}
