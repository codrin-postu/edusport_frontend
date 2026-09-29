import type { ReactNode } from "react";

/**
 * The site does not gate any content behind cookie consent for now (no
 * cookie banner is shown, see layout.tsx). This is a passthrough so every
 * call site keeps working unchanged; the original gate (behind
 * vanilla-cookieconsent, see useConsent.ts) can come back later without
 * touching callers.
 */
export default function ConsentGate({
  children,
}: {
  category: string;
  children: ReactNode;
  /** Provider name shown in the default notice, e.g. "YouTube". */
  label?: string;
  placeholder?: ReactNode;
  className?: string;
}) {
  return <>{children}</>;
}
