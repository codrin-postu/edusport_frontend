"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { X } from "lucide-react";

import type { Announcement } from "@/lib/strapi-announcement";
import { renderMarkdown } from "@/utils/markdown";

import { useAnnouncement } from "./useAnnouncement";

interface AnnouncementCardProps {
  announcement: Announcement;
}

/**
 * Corner treatment: a retro card pinned bottom-right (full width above the
 * bottom edge on phones). It is not modal — it must never steal focus or trap
 * it, so it announces itself politely via `role="status"` and otherwise stays
 * out of the way.
 */
export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const { visible, dismiss, onCtaClick, reducedMotion } = useAnnouncement(announcement);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="status"
          aria-live="polite"
          className="fixed z-[900] left-[14px] right-[14px] bottom-[14px] sm:left-auto sm:right-[22px] sm:bottom-[22px] sm:w-[310px] bg-retro-cream border-[1.5px] border-navy shadow-[8px_8px_0_rgba(14,26,60,0.16)] px-[17px] pt-4 pb-[15px]"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-start justify-between gap-2.5">
            {announcement.eyebrow ? (
              <p className="text-3xs font-extrabold uppercase tracking-[0.14em] text-rust">
                {announcement.eyebrow}
              </p>
            ) : (
              <span aria-hidden="true" />
            )}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Închide anunțul"
              className="-mt-0.5 -mr-1 shrink-0 p-1 text-gray-500 hover:text-navy transition-colors"
            >
              <X className="w-[15px] h-[15px]" aria-hidden="true" />
            </button>
          </div>

          <h2 className="font-display font-extrabold text-[19px] leading-[1.1] text-navy mt-[7px] mb-1.5">
            {announcement.title}
          </h2>

          <div className="text-[12.5px] leading-[1.55] text-[#3b4257] space-y-2 [&_a]:underline [&_a]:underline-offset-2">
            {renderMarkdown(announcement.message)}
          </div>

          {announcement.ctaLabel && announcement.ctaUrl && (
            <Link
              href={announcement.ctaUrl}
              onClick={onCtaClick}
              className="inline-block mt-[13px] px-[15px] py-2 text-[11px] font-extrabold uppercase tracking-[0.06em] text-navy bg-mustard border-[1.5px] border-navy shadow-[4px_4px_0_var(--color-rust)] transition-transform hover:-translate-y-px"
            >
              {announcement.ctaLabel}
            </Link>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
