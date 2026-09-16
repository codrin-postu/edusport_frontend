"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";

import type { Announcement } from "@/lib/strapi-announcement";
import { renderMarkdown } from "@/utils/markdown";

import { useAnnouncement } from "./useAnnouncement";

interface AnnouncementModalProps {
  announcement: Announcement;
}

const FOCUSABLE =
  "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

/**
 * Centre treatment: a true modal dialog. Because it blocks the page it carries
 * the full accessibility contract — labelled dialog role, Escape to close,
 * focus moved in on open and returned on close, focus trapped while open, and
 * background scroll locked.
 */
export function AnnouncementModal({ announcement }: AnnouncementModalProps) {
  const { visible, dismiss, onCtaClick, reducedMotion } = useAnnouncement(announcement);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  // `dismiss` is stable per slug, but keeping it in a ref lets the key handler
  // below be installed exactly once per open rather than on every re-render.
  const dismissRef = useRef(dismiss);
  dismissRef.current = dismiss;

  useEffect(() => {
    if (!visible) return;

    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus into the dialog: the first interactive control, or the
    // dialog itself (it carries tabIndex={-1}) when there is none.
    const first = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialog)?.focus();

    // Lock background scroll.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismissRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === firstEl || active === dialog)) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && active === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center">
          <motion.div
            aria-hidden="true"
            onClick={dismiss}
            className="absolute inset-0 bg-[rgba(14,26,60,0.55)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.25 }}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative w-[calc(100%-28px)] sm:w-[390px] max-h-[85vh] overflow-y-auto bg-retro-cream border-[1.5px] border-navy shadow-[10px_10px_0_rgba(14,26,60,0.28)] px-6 pt-6 pb-5 outline-none"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {announcement.eyebrow && (
              <p className="text-3xs font-extrabold uppercase tracking-[0.16em] text-rust mb-[9px]">
                {announcement.eyebrow}
              </p>
            )}

            <h2
              id={titleId}
              className="font-display font-extrabold text-[22px] sm:text-[27px] leading-[1.05] text-navy mb-2.5"
            >
              {announcement.title}
            </h2>

            <div className="text-[13px] leading-[1.6] text-[#3b4257] space-y-2 [&_a]:underline [&_a]:underline-offset-2">
              {renderMarkdown(announcement.message)}
            </div>

            <div className="flex flex-wrap items-center gap-3.5 mt-[18px]">
              {announcement.ctaLabel && announcement.ctaUrl && (
                <Link
                  href={announcement.ctaUrl}
                  onClick={onCtaClick}
                  className="px-[18px] py-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.06em] text-navy bg-mustard border-[1.5px] border-navy shadow-[4px_4px_0_var(--color-rust)] transition-transform hover:-translate-y-px"
                >
                  {announcement.ctaLabel}
                </Link>
              )}
              <button
                type="button"
                onClick={dismiss}
                className="text-xs font-semibold text-gray-500 underline underline-offset-[3px] hover:text-navy transition-colors"
              >
                Mai târziu
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
