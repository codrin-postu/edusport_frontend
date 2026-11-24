"use client";

import { createContext, useContext, useMemo } from "react";
import { notFound } from "next/navigation";
import type { CoachMe } from "@/lib/portal/api-types";
import { portalFeatures, type PortalFeatures } from "@/lib/portal/features";
import { usePortal } from "./use-portal";

const MeContext = createContext<CoachMe | null>(null);

/** One `coach/me` load per shell mount. */
export function MeProvider({ children }: { children: React.ReactNode }) {
  const me = usePortal<CoachMe>("coach/me");
  return <MeContext.Provider value={me.data}>{children}</MeContext.Provider>;
}

export function useMe(): CoachMe | null {
  return useContext(MeContext);
}

/** The club switches of `coach/me`; all on until it is loaded (a switched-off feature's own calls answer 404, which is the not-found page). */
export function useFeatures(): PortalFeatures {
  const me = useMe();
  return useMemo(() => portalFeatures(me), [me]);
}

/** Wraps a page of one feature: the not-found page when that feature is off. */
export function FeatureGate({ feature, children }: { feature: keyof PortalFeatures; children: React.ReactNode }) {
  if (!useFeatures()[feature]) notFound();
  return <>{children}</>;
}
