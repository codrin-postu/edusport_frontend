"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import type { SportivMe } from "@/lib/portal/sportiv-types";
import { ALL_FEATURES, portalFeatures, type PortalFeatures } from "@/lib/portal/features";
import { portalApi } from "@/app/_portal/lib/api";

const FeaturesContext = createContext<PortalFeatures>(ALL_FEATURES);

/** One `sportiv/me` load per shell mount, for the club switches. A 404 (the portal itself was switched off) is the not-found page. */
export function FeaturesProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ features: PortalFeatures; gone: boolean }>({ features: ALL_FEATURES, gone: false });
  useEffect(() => {
    let cancelled = false;
    void portalApi<SportivMe>("GET", "sportiv/me").then((r) => {
      if (cancelled) return;
      if (r.ok) setState({ features: portalFeatures(r.data), gone: false });
      else if (r.status === 404) setState({ features: ALL_FEATURES, gone: true });
    });
    return () => {
      cancelled = true;
    };
  }, []);
  if (state.gone) notFound();
  return <FeaturesContext.Provider value={state.features}>{children}</FeaturesContext.Provider>;
}

export function useFeatures(): PortalFeatures {
  return useContext(FeaturesContext);
}

/** Wraps a page of one feature: the not-found page when that feature is off. */
export function FeatureGate({ feature, children }: { feature: keyof PortalFeatures; children: React.ReactNode }) {
  if (!useFeatures()[feature]) notFound();
  return <>{children}</>;
}
