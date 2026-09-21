"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Tells the user the page is about to change, and that the form survives it.
 *
 * The client's report was that customers click a link from the form, most often
 * the schedule, and think the form is gone. The links that do this are the site
 * header and footer, which are on every page, so they cannot be reworked for
 * this one form. Intercepting the click is what is left.
 *
 * The message is reassurance, not a barrier: the draft is already saved by the
 * time this appears, so nothing is at stake. It exists to say the page moves
 * and the answers stay.
 *
 * Only in-app navigations are intercepted. A new tab, a download, an external
 * host or a modified click (cmd, ctrl, shift, middle button) all pass through
 * untouched, because none of them replace what the user is looking at.
 */

const LeaveNotice: React.FC<{ armed: boolean }> = ({ armed }) => {
  const router = useRouter();
  const [pending, setPending] = useState<{ href: string; label: string | null } | null>(null);
  const stayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!armed) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      // Let the browser do its own thing for new tabs and middle clicks.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.hasAttribute("download") || anchor.getAttribute("target") === "_blank") return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Staying on this page is not leaving it.
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();
      // Name the destination from the link the user actually clicked. The
      // wording was approved for the schedule, but this fires for every
      // internal link, and "Programul se deschide" on a privacy policy link
      // would simply be wrong.
      const text = (anchor.textContent || "").replace(/\s+/g, " ").trim();
      setPending({
        href: url.pathname + url.search + url.hash,
        label: text && text.length <= 40 ? text : null,
      });
    };

    // Capture phase, so the notice runs before Next's own link handling.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [armed]);

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
          {pending.label
            ? `${pending.label} se deschide în altă pagină`
            : "Pagina se schimbă"}
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
            onClick={() => {
              const to = pending.href;
              setPending(null);
              router.push(to);
            }}
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
