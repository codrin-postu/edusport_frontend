"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { trackPath, type TrackPortal } from "@/lib/portal/track-path";

type UmamiPayload = Record<string, unknown>;
type UmamiWindow = Window & { umami?: { track: (fn: (p: UmamiPayload) => UmamiPayload) => void } };

/**
 * Page views for a portal, with nothing personal: auto tracking is off, and every view is sent with the
 * route pattern as the URL and an empty title and referrer. No custom events. No website id: no script.
 */
export function PortalUmami({ portal, websiteId }: { portal: TrackPortal; websiteId: string | undefined }) {
  const pathname = usePathname();
  const send = useCallback(() => {
    const url = trackPath(portal, pathname);
    (window as UmamiWindow).umami?.track((p) => ({ ...p, url, title: "", referrer: "" }));
  }, [portal, pathname]);
  // Runs on every path change; the first view goes out from onLoad once the script exists.
  useEffect(send, [send]);
  if (!websiteId) return null;
  return (
    <Script
      src={process.env.NEXT_PUBLIC_UMAMI_URL ?? "https://analytics.umami.is/script.js"}
      data-website-id={websiteId}
      data-auto-track="false"
      data-exclude-search="true"
      data-exclude-hash="true"
      strategy="afterInteractive"
      onLoad={send}
    />
  );
}
