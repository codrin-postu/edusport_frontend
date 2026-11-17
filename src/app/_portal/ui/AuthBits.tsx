"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { PortalLink } from "@/app/_portal/ui/PortalLink";
import { portalApi } from "@/app/_portal/lib/api";

/** The `role="alert"` line of the auth cards; always in the DOM so a message is announced. */
export function AlertLine({ message, reserve }: { message: string | null; reserve?: boolean }) {
  return (
    <p role="alert" className={`text-body-sm text-alert-ink ${reserve ? "min-h-6" : "empty:-my-2"}`}>
      {message && (
        <span className="flex items-start gap-2">
          <Icon name="shield-alert" className="mt-0.5" />
          <span>{message}</span>
        </span>
      )}
    </p>
  );
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

export function GoogleButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex min-h-12 items-center justify-center gap-(--portal-gap-10) border-control border-line bg-surface-raised text-(length:--portal-text-15) font-bold text-primary no-underline outline-none hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus"
    >
      <svg aria-hidden="true" data-brand-mark width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
        <path fill="#4285F4" d="M45 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.2-3.9 6.5-9.6 6.5-16.1z" />
        <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z" />
        <path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.5C3 17.1 2 20.4 2 24s1 6.9 2.5 9.9l7.3-5.7z" />
        <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.5 2 8.1 6.9 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z" />
      </svg>
      {label}
    </a>
  );
}

export function OrLine({ text }: { text: string }) {
  return <p className="text-center text-(length:--portal-text-13) leading-none text-muted">{text}</p>;
}

/** "Continuă cu Google" and the "sau" line, before or after the form fields. */
export function GoogleBlock({ href, label, or, orFirst }: { href: string; label: string; or: string; orFirst?: boolean }) {
  const line = <OrLine text={or} />;
  const button = <GoogleButton href={href} label={label} />;
  return (
    <div className={`flex flex-col gap-4 ${orFirst ? "mt-4" : "mb-4"}`}>
      {orFirst ? <>{line}{button}</> : <>{button}{line}</>}
    </div>
  );
}

export function BackLink({ href, children }: { href: string; children: string }) {
  return <PortalLink href={href}>{children}</PortalLink>;
}
