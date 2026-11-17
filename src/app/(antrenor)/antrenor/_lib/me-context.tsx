"use client";

import { createContext, useContext } from "react";
import type { CoachMe } from "@/lib/portal/api-types";
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
