import type { NavItem } from "@/app/_portal/lib/nav";
import { NAV } from "@/lib/portal/copy";

/** The coach nav: Azi (with the pages it opens), Grupe (with the athlete card), Concursuri, Istoric, Profil. */
export function coachNav(): NavItem[] {
  return [
    { href: "/", label: NAV.today, icon: "portal-azi", match: ["/calendar", "/prezenta", "/lectie"] },
    { href: "/grupe", label: NAV.groups, icon: "portal-grupe", match: ["/sportiv"] },
    { href: "/concursuri", label: NAV.competitions, icon: "portal-concursuri" },
    { href: "/istoric", label: NAV.history, icon: "portal-istoric" },
    { href: "/profil", label: NAV.profile, icon: "portal-profil" },
  ];
}

/** Boards Prezența and Lecție have no bottom nav. */
export function hasPhoneNav(pathname: string): boolean {
  return !(pathname === "/prezenta" || pathname.startsWith("/prezenta/") || pathname === "/lectie" || pathname.startsWith("/lectie/"));
}
