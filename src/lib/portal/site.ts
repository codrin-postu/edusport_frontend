// Which portal app a request belongs to. Pure: loaded by Node tests.
import { siteForHost } from "./host.ts";

export type PortalSite = "antrenor" | "sportiv";

/** The portal site for a Host header, or null on any other host. Same rule as the middleware. */
export function siteOf(host: string | null): PortalSite | null {
  const site = siteForHost(host, { antrenor: process.env.PORTAL_HOST_ANTRENOR, sportiv: process.env.PORTAL_HOST_SPORTIV });
  return site === "site" ? null : site;
}
