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
        "absolute inset-0 flex items-center justify-center bg-navy/[0.04] border-[1.5px] border-navy/15 p-6"
      }
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <p className="text-sm text-navy/70 leading-relaxed">
          {label
            ? `Acest conținut este încărcat de la ${label}.`
            : "Acest conținut este încărcat de la un alt furnizor."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => CC.acceptCategory(category)}
            className="border-[1.5px] border-navy bg-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-retro-cream transition-colors hover:bg-edusport-blue hover:border-edusport-blue"
          >
            Permite și afișează
          </button>
          <button
            type="button"
            onClick={() => CC.showPreferences()}
            className="border-[1.5px] border-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-retro-cream"
          >
            Preferințe
          </button>
        </div>
      </div>
    </div>
  );
}
