import type { NavItem } from "@/app/_portal/lib/nav";
// Relative `.ts` imports: Node tests load this file through type stripping, which does not know the `@/` alias.
import { ALL_FEATURES, type PortalFeatures } from "../../../../../lib/portal/features.ts";
import { NAV_SPORTIV } from "../../../../../lib/portal/copy-sportiv.ts";

/** The sportiv nav of one athlete: Acasă (with the calendar it opens), Istoric, Concursuri (performance athletes only), Parcurs, Plăți. Istoric goes with Prezență, Plăți with Abonamente, Parcurs with Parcurs. */
export function sportivNav(athleteId: string, performance: boolean, features: PortalFeatures = ALL_FEATURES): NavItem[] {
  const base = `/${athleteId}`;
  return [
    { href: base, label: NAV_SPORTIV.home, icon: "portal-azi", exact: true, match: [`${base}/calendar`] },
    ...(features.prezenta ? [{ href: `${base}/istoric`, label: NAV_SPORTIV.history, icon: "portal-istoric" as const }] : []),
    ...(performance ? [{ href: `${base}/concursuri`, label: NAV_SPORTIV.competitions, icon: "portal-concursuri" as const }] : []),
    ...(features.parcurs ? [{ href: `${base}/parcurs`, label: NAV_SPORTIV.path, icon: "portal-parcurs" as const }] : []),
    ...(features.abonamente ? [{ href: `${base}/plati`, label: NAV_SPORTIV.money, icon: "portal-plati" as const }] : []),
  ];
}
