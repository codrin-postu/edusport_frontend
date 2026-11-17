import type { NavItem } from "@/app/_portal/lib/nav";
import { NAV_SPORTIV } from "@/lib/portal/copy-sportiv";

/** The sportiv nav of one athlete: Acasă (with the calendar it opens), Istoric, Concursuri (performance athletes only), Parcurs, Plăți. */
export function sportivNav(athleteId: string, performance: boolean): NavItem[] {
  const base = `/${athleteId}`;
  return [
    { href: base, label: NAV_SPORTIV.home, icon: "portal-azi", exact: true, match: [`${base}/calendar`] },
    { href: `${base}/istoric`, label: NAV_SPORTIV.history, icon: "portal-istoric" },
    ...(performance ? [{ href: `${base}/concursuri`, label: NAV_SPORTIV.competitions, icon: "portal-concursuri" as const }] : []),
    { href: `${base}/parcurs`, label: NAV_SPORTIV.path, icon: "portal-parcurs" },
    { href: `${base}/plati`, label: NAV_SPORTIV.money, icon: "portal-plati" },
  ];
}
