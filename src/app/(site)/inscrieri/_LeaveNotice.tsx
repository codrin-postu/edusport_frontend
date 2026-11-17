"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { Dialog, DialogActions } from "@/components/ui/dialog";

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

  const go = () => {
    if (!pending) return;
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
    <Dialog
      open={pending !== null}
      onOpenChange={(open) => {
        if (!open) close();
      }}
      title="Linkul se deschide într-o pagină nouă."
      description="Formularul rămâne salvat."
      width="sm"
    >
      <DialogActions>
        <Button variant="secondary" onClick={close}>
          Rămâi
        </Button>
        <Button variant="primary" face="black" onClick={go}>
          Continuă
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveNotice;
