"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { NAV, PROFILE } from "@/lib/portal/copy";
import { cn } from "@/utils/cn";
import { portalApi } from "../_lib/api";
import { useMe } from "../_lib/me-context";

export const NAV_ITEMS = [
  { href: "/", label: NAV.today },
  { href: "/grupe", label: NAV.groups },
  { href: "/istoric", label: NAV.history },
  { href: "/profil", label: NAV.profile },
] as const;

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Top menu from lg: Azi, Grupe, Istoric. */
export function TopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Meniu" className="flex gap-2">
      {NAV_ITEMS.slice(0, 3).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          className={cn(
            "h-10 px-4 flex items-center text-button outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-on-dark",
            isActive(pathname, item.href) ? "bg-surface-raised text-primary" : "text-primary-on-dark hover:text-accent-on-dark",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** Name menu from lg: Profil and "Ieși din cont". */
export function ProfileMenu() {
  const me = useMe();
  const router = useRouter();
  const item = "block w-full text-left px-4 py-3 text-body-sm text-primary outline-none data-[highlighted]:bg-surface-subtle cursor-pointer";
  async function logout() {
    await portalApi("POST", "auth/logout");
    window.location.assign("/intrare");
  }
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="h-10 px-4 flex items-center text-button text-primary-on-dark border-retro border-line-on-dark outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-on-dark">
        {me?.name ?? NAV.profile}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={4} className="z-menu min-w-48 bg-surface-raised border-retro border-line shadow-retro-sm">
          <DropdownMenu.Item className={item} onSelect={() => router.push("/profil")}>{NAV.profile}</DropdownMenu.Item>
          <DropdownMenu.Item className={item} onSelect={() => void logout()}>{PROFILE.logout}</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
