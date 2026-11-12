"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ACCOUNT } from "@/lib/portal/copy-sportiv";
import { logout } from "@/app/_portal/lib/logout";
import type { AccountMenuItem } from "@/app/_portal/ui/Sidebar";
import { PortalShell } from "@/app/_portal/ui/PortalShell";
import { athleteIdOf, useAthletes } from "../_lib/athletes-context";
import { sportivNav } from "../_lib/nav";

/**
 * The kit shell with the nav of the athlete in the URL. On `/` and `/setari` (no athlete; neither has the phone nav) the nav stays on the
 * last athlete seen in this tab, else the first listed one; the picker itself has no phone nav.
 */
export function SportivShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { athletes, picker, current } = useAthletes();
  const fromUrl = athleteIdOf(pathname);
  const [last, setLast] = useState<string | null>(null);
  if (fromUrl !== null && fromUrl !== last) setLast(fromUrl);
  const navId = fromUrl ?? last ?? picker[0]?.id ?? null;
  const performance = athletes.find((a) => a.id === navId)?.performance ?? false;
  const nav = useMemo(() => (navId === null ? [] : sportivNav(navId, performance)), [navId, performance]);

  // The same page of another athlete: the URL's athlete segment swapped.
  const rest = fromUrl !== null ? pathname.slice(fromUrl.length + 1) : "";
  const menu = useMemo<AccountMenuItem[]>(() => [
    ...picker.filter((a) => a.id !== current?.id).map((a): AccountMenuItem => ({ label: a.name, icon: "user", href: `/${a.id}${rest}` })),
    { label: ACCOUNT.menu.settingsAccount, icon: "portal-settings", href: "/setari" },
    { label: ACCOUNT.menu.logout, icon: "portal-logout", onSelect: () => void logout() },
  ], [picker, current, rest]);

  return (
    <PortalShell
      nav={nav}
      account={{ label: current?.firstName ?? ACCOUNT.sheet.settings, href: "/setari", menu }}
      brandHref="/"
      phoneNav={pathname !== "/" && !pathname.startsWith("/setari") && nav.length > 0}
    >
      {children}
    </PortalShell>
  );
}
