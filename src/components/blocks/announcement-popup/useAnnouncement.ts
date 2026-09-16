"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import type { Announcement } from "@/lib/strapi-announcement";

// ---------------------------------------------------------------------------
// Dismissal storage
//
// One localStorage key holds a map of slug -> ISO timestamp of the moment the
// visitor closed that announcement:
//
//   localStorage["announcement-dismissed"]
//     = { "inscrieri-2026": "2026-09-13T08:31:02.115Z" }
//
// Every access is wrapped in try/catch: Safari private mode throws on both
// read and write, and a corrupt value must never break rendering.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "announcement-dismissed";
const DAY_MS = 86_400_000;
const PRUNE_AFTER_MS = 365 * DAY_MS;

type DismissalMap = Record<string, string>;

function readDismissals(): DismissalMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: DismissalMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string") out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

/** Drop entries older than a year so the object cannot grow without bound. */
function prune(map: DismissalMap, now: number): DismissalMap {
  const out: DismissalMap = {};
  for (const [key, value] of Object.entries(map)) {
    const at = Date.parse(value);
    if (Number.isFinite(at) && now - at < PRUNE_AFTER_MS) out[key] = value;
  }
  return out;
}

function writeDismissals(map: DismissalMap): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Private mode / quota exceeded: the announcement simply reappears later.
  }
}

/**
 * Should this announcement be shown, given what the visitor dismissed before?
 *
 * - no stored entry            -> show
 * - unparseable stored entry   -> show (treat as never dismissed)
 * - dismissDays === 0          -> never show again once dismissed
 * - otherwise                  -> show again once dismissDays have elapsed
 */
function shouldShow(slug: string, dismissDays: number, now: number): boolean {
  const stored = readDismissals()[slug];
  if (!stored) return true;

  const at = Date.parse(stored);
  if (!Number.isFinite(at)) return true;
  if (dismissDays === 0) return false;

  return now - at >= dismissDays * DAY_MS;
}

// ---------------------------------------------------------------------------
// Shared behaviour for both announcement formats
// ---------------------------------------------------------------------------

export interface UseAnnouncementResult {
  /** `false` on the server and on the first client render — no hydration gap. */
  visible: boolean;
  /** Close, persist the dismissal and fire `announcement.dismiss` once. */
  dismiss: () => void;
  /** Attach to the CTA; fires `announcement.click`. */
  onCtaClick: () => void;
  /** True when the visitor asked for reduced motion. */
  reducedMotion: boolean;
}

/**
 * Visibility, dismissal persistence and the three Umami events, shared by
 * `AnnouncementCard` and `AnnouncementModal` so the two files only describe
 * their own markup.
 *
 * Visibility is decided in an effect rather than during render: the server has
 * no localStorage, so deciding earlier would guarantee a hydration mismatch.
 */
export function useAnnouncement(announcement: Announcement): UseAnnouncementResult {
  // Depend on primitives, never on the object: the server component hands down
  // a freshly allocated `announcement` on every RSC render, so an object
  // dependency would re-run the effect and re-fire `announcement.view`.
  const { slug, dismissDays } = announcement;
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const dismissTracked = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    // A different announcement means a fresh decision and fresh tracking.
    dismissTracked.current = false;

    // Suppressed by a live dismissal: no view event, because nothing was seen.
    if (!shouldShow(slug, dismissDays, Date.now())) {
      setVisible(false);
      return;
    }

    setVisible(true);
    track("announcement.view", { id: slug });
  }, [slug, dismissDays]);

  const dismiss = useCallback(() => {
    setVisible(false);

    const now = Date.now();
    writeDismissals({
      ...prune(readDismissals(), now),
      [slug]: new Date(now).toISOString(),
    });

    // Guarded so the modal's several close affordances (backdrop click,
    // "Mai târziu", Escape) can never double-count a single dismissal.
    if (dismissTracked.current) return;
    dismissTracked.current = true;
    track("announcement.dismiss", { id: slug });
  }, [slug]);

  const onCtaClick = useCallback(() => {
    track("announcement.click", { id: slug });
  }, [slug]);

  return { visible, dismiss, onCtaClick, reducedMotion };
}
