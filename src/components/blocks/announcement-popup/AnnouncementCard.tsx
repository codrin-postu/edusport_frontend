"use client";

import { AnimatePresence, motion } from "motion/react";
import { DURATION, EASE } from "@/lib/motion";
import Link from "next/link";
import IconButton from "@/components/ui/icon-button";

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
          className="fixed z-popup left-4 right-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[310px] bg-surface border-retro border-line shadow-retro px-4 pt-4 pb-4"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: reducedMotion ? DURATION.fast : DURATION.slow, ease: EASE.out }}
        >
          <div className="flex items-start justify-between gap-3">
            {announcement.eyebrow ? (
              <p className="text-label uppercase text-accent">
                {announcement.eyebrow}
              </p>
            ) : (
              <span aria-hidden="true" />
            )}
            <IconButton
              icon="close"
              onClick={dismiss}
              label="Închide anunțul"
              className="-mt-2 -mr-2 text-secondary"
            />
          </div>

          <h2 className="text-title text-primary mt-2 mb-2">
            {announcement.title}
          </h2>

          <div className="text-caption text-[#3b4257] space-y-2 [&_a]:underline [&_a]:underline-offset-2">
            {renderMarkdown(announcement.message)}
          </div>

          {announcement.ctaLabel && announcement.ctaUrl && (
            <Link
              href={announcement.ctaUrl}
              onClick={onCtaClick}
              className="text-label inline-block mt-3 px-4 py-2 uppercase text-primary bg-mustard border-retro border-line shadow-[4px_4px_0_var(--color-rust)] transition-transform hover:-translate-y-px"
            >
              {announcement.ctaLabel}
            </Link>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
