"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { PortalShell } from "@/app/_portal/ui/PortalShell";
import { NAV } from "@/lib/portal/copy";
import { useMe } from "../_lib/me-context";
import { coachNav, hasPhoneNav } from "../_lib/nav";

/** The kit shell with the coach nav; the account button shows the coach's first name once it is loaded. */
export function CoachShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const me = useMe();
  const nav = useMemo(coachNav, []);
  return (
    <PortalShell nav={nav} account={{ label: me?.firstName ?? NAV.profile, href: "/profil", ariaLabel: NAV.profile }} brandHref="/" phoneNav={hasPhoneNav(pathname)}>
      {children}
    </PortalShell>
  );
}
