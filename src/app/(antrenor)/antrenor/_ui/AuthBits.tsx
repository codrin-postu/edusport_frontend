"use client";

import { useEffect, useState } from "react";
import Link from "@/components/ui/link";
import { portalApi } from "../_lib/api";

/** The `role="alert"` line of the auth cards; always in the DOM so a message is announced. */
export function AlertLine({ message }: { message: string | null }) {
  return <p role="alert" className="text-body-sm text-accent min-h-6">{message}</p>;
}

/** Reads (and so clears) the one-shot flash message of a Google round trip, once on mount. */
export function useFlash(): [string | null, (m: string | null) => void] {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    void portalApi<{ message: string | null }>("GET", "auth/flash", undefined, { stay401: true }).then((r) => {
      if (!cancelled && r.ok && r.data.message) setMessage(r.data.message);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return [message, setMessage];
}

/** Link-styled "Continuă cu Google" and the "sau" divider. */
export function GoogleBlock({ href, label, or, orFirst }: { href: string; label: string; or: string; orFirst?: boolean }) {
  const divider = (
    <div className="flex items-center gap-4 my-4" aria-hidden>
      <span className="flex-1 border-t border-line-subtle" />
      <span className="text-label text-secondary">{or}</span>
      <span className="flex-1 border-t border-line-subtle" />
    </div>
  );
  const link = (
    <a
      href={href}
      className="text-button inline-flex w-full items-center justify-center h-12 px-6 border-retro border-line text-primary hover-layer outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
    >
      {label}
    </a>
  );
  return orFirst ? <>{divider}{link}</> : <>{link}{divider}</>;
}

export function BackLink({ href, children }: { href: string; children: string }) {
  return <Link href={href} className="text-body-sm">{children}</Link>;
}
