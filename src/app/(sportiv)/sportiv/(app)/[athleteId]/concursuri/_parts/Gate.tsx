"use client";

import { notFound } from "next/navigation";
import { useAthletes } from "../../../_lib/athletes-context";
import { Spinner } from "@/app/_portal/ui/Spinner";

/**
 * Concursuri exists for performance athletes only: any other athlete (or an id the account does not hold) is the 404 page,
 * decided from the athletes list before the screen asks for anything.
 */
export function PerformanceGate({ children }: { children: React.ReactNode }) {
  const { current, state } = useAthletes();
  if (state === "loading") return <div className="flex justify-center py-6"><Spinner /></div>;
  if (!current || !current.performance) notFound();
  return <>{children}</>;
}
