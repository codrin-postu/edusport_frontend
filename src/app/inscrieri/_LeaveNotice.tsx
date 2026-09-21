"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Tells the visitor the page is about to change before it does.
 *
 * The client's report was that customers click a link from the form, most often
 * the schedule, and think the registration is gone. The links that do it are
 * the site header and footer, present on every page, so they cannot be reworked
 * for this one form. Intercepting the click is what is left.
 *
 * Every link out is covered, deliberately: another page, another site, and a
 * new tab. A new tab does not take the form away, but the client asked for the
 * warning there too, and someone who does not notice a tab opened behind the
 * current one is just as lost. The wording changes to match, since saying a
 * page "se deschide în altă pagină" would be wrong when this one stays.
 *
 * It does not wait for the form to have content. The confusion the client
 * described happens on the way in as much as half way through.
 */

interface Pending {
  href: string;
  label: string | null;
  /** The click asked for a new tab: target=_blank, a modifier, or middle click. */
  newTab: boolean;
}

const LeaveNotice: React.FC = () => {
  const router = useRouter();
  const [pending, setPending] = useState<Pending | null>(null);
  const stayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handle = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      // Right click opens a context menu, it navigates nothing.
      if (event.button !== 0 && event.button !== 1) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      // A download leaves the page exactly where it is.
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol)) return; // mailto:, tel:, ...

      const sameHost = url.origin === window.location.origin;
      const samePage = sameHost && url.pathname === window.location.pathname;
      if (samePage) return;

      const newTab =
        event.button === 1 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        anchor.getAttribute("target") === "_blank";

      event.preventDefault();
      const text = (anchor.textContent || "").replace(/\s+/g, " ").trim();
      setPending({
        href: sameHost ? url.pathname + url.search + url.hash : url.href,
        label: text && text.length <= 40 ? text : null,
        newTab,
      });
    };

    // Capture phase, so this runs before Next's own link handling. `auxclick`
    // is what a middle click fires; `click` never sees button 1.
    document.addEventListener("click", handle, true);
    document.addEventListener("auxclick", handle, true);
    return () => {
      document.removeEventListener("click", handle, true);
      document.removeEventListener("auxclick", handle, true);
    };
  }, []);

  const close = useCallback(() => setPending(null), []);

  useEffect(() => {
    if (!pending) return;
    stayRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pending, close]);

  if (!pending) return null;

  const where = pending.newTab ? "într-o filă nouă" : "în altă pagină";
  const title = pending.label
    ? `${pending.label} se deschide ${where}`
    : pending.newTab
      ? "Se deschide o filă nouă"
      : "Pagina se schimbă";

  const go = () => {
    const { href, newTab } = pending;
    setPending(null);
    if (newTab) {
      // Still inside the click on Continuă, so this counts as a user gesture
      // and is not treated as a pop-up.
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (href.startsWith("http")) {
      window.location.href = href;
      return;
    }
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-notice-title"
    >
      <div className="absolute inset-0 bg-navy/50" onClick={close} aria-hidden />
      <div className="relative w-full max-w-sm border-[1.5px] border-navy bg-retro-cream p-6 shadow-[8px_8px_0_rgb(14_26_60_/_0.28)]">
        <h2
          id="leave-notice-title"
          className="font-display text-lg font-extrabold leading-snug text-navy"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/70">
          Formularul rămâne salvat.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            ref={stayRef}
            type="button"
            onClick={close}
            className="border-[1.5px] border-navy px-4 py-2 text-sm font-bold text-navy transition-colors hover:bg-navy/5"
          >
            Rămâi
          </button>
          <button
            type="button"
            onClick={go}
            className="border-[1.5px] border-navy bg-navy px-4 py-2 text-sm font-bold text-retro-cream transition-colors hover:bg-navy/90"
          >
            Continuă
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveNotice;
