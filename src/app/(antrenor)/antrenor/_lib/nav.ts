import type { NavItem } from "@/app/_portal/lib/nav";
// Relative `.ts` imports: Node tests load this file through type stripping, which does not know the `@/` alias.
import { NAV } from "../../../../lib/portal/copy.ts";
import { ALL_FEATURES, type PortalFeatures } from "../../../../lib/portal/features.ts";

/** The coach nav: Azi (with the pages it opens), Grupe (with the athlete card), Concursuri, Istoric, Profil. Without Prezență there is no Istoric, and Azi no longer opens Prezență or Lecție. */
export function coachNav(features: PortalFeatures = ALL_FEATURES): NavItem[] {
  const { prezenta } = features;
  return [
    { href: "/", label: NAV.today, icon: "portal-azi", match: prezenta ? ["/calendar", "/prezenta", "/lectie"] : ["/calendar"] },
    { href: "/grupe", label: NAV.groups, icon: "portal-grupe", match: ["/sportiv"] },
    { href: "/concursuri", label: NAV.competitions, icon: "portal-concursuri" },
    ...(prezenta ? [{ href: "/istoric", label: NAV.history, icon: "portal-istoric" as const }] : []),
    { href: "/profil", label: NAV.profile, icon: "portal-profil" },
  ];
}

/** Boards Prezența and Lecție have no bottom nav. */
export function hasPhoneNav(pathname: string): boolean {
  return !(pathname === "/prezenta" || pathname.startsWith("/prezenta/") || pathname === "/lectie" || pathname.startsWith("/lectie/"));
}
