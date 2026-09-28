"use client";

import type { ReactNode } from "react";
import * as CC from "vanilla-cookieconsent";
import { useConsent } from "./useConsent";

/**
 * Renders children only once the visitor has accepted `category`.
 *
 * Use this around anything that reaches a third party or writes to the device:
 * an embedded player, a map, a chat widget, a social feed. Nothing inside is
 * mounted before consent, so no request is made.
 *
 *   <ConsentGate category={COOKIE_CATEGORIES.functionality} label="YouTube">
 *     <iframe src={...} />
 *   </ConsentGate>
 *
 * Pass `placeholder` to replace the default notice entirely.
 */
export default function ConsentGate({
  category,
  children,
  label,
  placeholder,
  className,
}: {
  category: string;
  children: ReactNode;
  /** Provider name shown in the default notice, e.g. "YouTube". */
  label?: string;
  placeholder?: ReactNode;
  className?: string;
}) {
  const accepted = useConsent(category);

  if (accepted) return <>{children}</>;
  if (placeholder) return <>{placeholder}</>;

  return (
    <div
      className={
        className ??
        "absolute inset-0 flex items-center justify-center bg-surface-subtle border-retro border-line-subtle p-6"
      }
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <p className="text-body-sm text-secondary">
          {label
            ? `Acest conținut este încărcat de la ${label}.`
            : "Acest conținut este încărcat de la un alt furnizor."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => CC.acceptCategory(category)}
            className="text-label border-retro border-line bg-surface-dark px-4 py-2 uppercase text-primary-on-dark transition-colors hover-layer-on-dark"
          >
            Permite și afișează
          </button>
          <button
            type="button"
            onClick={() => CC.showPreferences()}
            className="text-label border-retro border-line px-4 py-2 uppercase text-primary transition-colors hover:bg-surface-dark hover:text-primary-on-dark"
          >
            Preferințe
          </button>
        </div>
      </div>
    </div>
  );
}
