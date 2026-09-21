"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

/**
 * Tells the visitor the page is about to change before it does.
 *
 * Scoped to links inside the form itself. The site header and footer are
 * deliberately left alone: someone reaching for the menu means to go
 * somewhere, while someone following a link placed in the middle of a question
 * is answering it, and does not expect to be moved.
 *
 * Every kind of link out is covered: another page, another site, and a new tab
 * via target, a modifier or a middle click. One sentence covers them all,
 * rather than naming the destination, which read badly on a long label.
 *
 * It does not wait for the form to have content, since the confusion happens
 * on the way in as much as half way through.
 *
 * NOTE: the form's questions come from the CMS and carry no links today, so
 * this is inert until one is added. It is wired to the form container, so a
 * link added in the CMS is covered with no code change.
 */

interface Pending {
  href: string;
  /** The click asked for a new tab: target=_blank, a modifier, or middle click. */
  newTab: boolean;
}

const LeaveNotice: React.FC<{ scope: React.RefObject<HTMLElement | null> }> = ({ scope }) => {
  const router = useRouter();
  const [pending, setPending] = useState<Pending | null>(null);
  const [mounted, setMounted] = useState(false);
  const stayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handle = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      // Right click opens a context menu, it navigates nothing.
      if (event.button !== 0 && event.button !== 1) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      // Only links that live inside the form. A click in the header or footer
      // is someone navigating on purpose.
      if (!scope.current?.contains(anchor)) return;

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
      setPending({
        href: sameHost ? url.pathname + url.search + url.hash : url.href,
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
  }, [scope]);

  const close = useCallback(() => setPending(null), []);

  useEffect(() => {
    if (!pending) return;
    // preventScroll, or the browser scrolls the page to bring the button into
    // view as it takes focus. The dialog is fixed and already on screen, so
    // the only visible effect was the page lurching down behind it.
    stayRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    // Freeze the page behind the dialog. Without this the form scrolls under
    // it, which reads as the page having moved already.
    //
    // Both elements, not just body: this page scrolls on the root element, so
    // hiding body's overflow alone left the wheel working (measured: 300 to
    // 1321 with the dialog open). The scrollbar gutter is reserved globally in
    // globals.css, so hiding the overflow does not shift the layout sideways.
    const root = document.documentElement;
    const previousRoot = root.style.overflow;
    const previousBody = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousRoot;
      document.body.style.overflow = previousBody;
    };
  }, [pending, close]);

  if (!pending) return null;

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

  if (!mounted) return null;

  // Rendered on <body>: main is `relative z-10`, which is a stacking context,
  // so a dialog inside it can never paint over the header at z-[100].
  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
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
          Linkul se deschide într-o pagină nouă.
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
    </div>,
    document.body,
  );
};

export default LeaveNotice;
