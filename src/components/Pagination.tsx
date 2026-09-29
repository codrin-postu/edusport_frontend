"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import IconButton from "@/components/ui/icon-button";
import { cn } from "@/utils/cn";

/**
 * Pagination control. Each control is either a `<Link>` (re-renders the
 * page with a new query param) or, in `onPageChange` mode, a plain button
 * that updates client-side state.
 *
 * `basePath` is the canonical pathname (e.g. "/despre-noi/sportivi"); we
 * omit the page query on page 1 so the canonical URL stays clean.
 *
 * Scroll behaviour:
 * - Navigation never lets the browser jump the viewport on its own — Link
 *   mode always passes `scroll={false}`.
 * - When `scrollTargetId` is given, a page change (link navigation or
 *   `onPageChange`) smooth-scrolls that element into view afterwards, but
 *   only when it's the user clicking a control here — never on first load
 *   or a direct link to e.g. `?page=3`, and never when the target is
 *   already visible (the user hasn't scrolled past it).
 * - With a `scrollAnchor`, the URL also carries a `#<id>` hash (kept for
 *   shareable/no-JS links); it no longer drives the actual scroll.
 *
 * `onPageChange` mode: pass a callback instead of navigating via href, for a
 * host that keeps its own page state client-side (no URL involved). When
 * set, `basePath`/`scrollAnchor`/`extraQuery`/`paramName` are ignored.
 */

// Set right before a page-change is kicked off (click handler), consumed by
// the next Pagination mount/update's effect. Module-scoped rather than
// component state because some hosts (e.g. a Suspense boundary keyed on the
// page) remount the control on every page change, which would otherwise
// wipe out any "was this user-initiated" bookkeeping kept in local state.
let pendingScrollTargetId: string | null = null;

function scrollToTargetIfPending(currentTargetId: string | undefined) {
  if (!pendingScrollTargetId || pendingScrollTargetId !== currentTargetId) return;
  pendingScrollTargetId = null;

  const target = document.getElementById(currentTargetId!);
  if (!target) return;

  // Only move the viewport when the target has scrolled above it — if it's
  // still visible (or below), the user hasn't scrolled past it.
  const rect = target.getBoundingClientRect();
  if (rect.top >= 0) return;

  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

interface Props {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  /** Optional anchor appended to every page URL. Kept for shareable links;
   *  see `scrollTargetId` for the actual (smooth) scroll behaviour. */
  scrollAnchor?: string;
  /** Id of the list's top element. When set, a user-initiated page change
   *  (Link click or `onPageChange`) smooth-scrolls that element into view
   *  — never on first load or a direct link to a given page. */
  scrollTargetId?: string;
  /** Extra query params to carry across page navigation (e.g. an active
   *  `search` or `category` value so pagination inside a filtered list
   *  still works). Empty/falsy values are skipped. */
  extraQuery?: Record<string, string>;
  /** Query-string key used for the page number. Defaults to "page".
   *  Override when multiple paginations coexist on one route (e.g. the
   *  sportsperson profile uses `compPage` for its competition history). */
  paramName?: string;
  /** Accessible label for the nav landmark. */
  ariaLabel?: string;
  /** Client-side pagination: called with the target page instead of the
   *  control navigating anywhere. See "onPageChange mode" above. */
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  scrollAnchor,
  scrollTargetId,
  extraQuery,
  paramName,
  ariaLabel,
  onPageChange,
}: Props) {
  const scrollTargetIdRef = useRef(scrollTargetId);
  scrollTargetIdRef.current = scrollTargetId;

  // Runs after every render where `currentPage` changed, including a fresh
  // mount caused by a host remounting the list (e.g. a keyed Suspense
  // boundary) — `pendingScrollTargetId` is what tells it apart from a first
  // load / direct link, which never sets that flag.
  useEffect(() => {
    scrollToTargetIfPending(scrollTargetIdRef.current);
  }, [currentPage]);

  if (totalPages <= 1) return null;

  const requestScroll = () => {
    if (scrollTargetId) pendingScrollTargetId = scrollTargetId;
  };

  const hash = scrollAnchor ? `#${scrollAnchor}` : "";
  const pageKey = paramName ?? "page";

  const href = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set(pageKey, String(p));
    if (extraQuery) {
      for (const [k, v] of Object.entries(extraQuery)) {
        if (v) params.set(k, v);
      }
    }
    const qs = params.toString();
    return `${basePath ?? ""}${qs ? `?${qs}` : ""}${hash}`;
  };

  const pageClassName = (p: number) =>
    cn(
      "flex h-9 w-9 items-center justify-center border-retro text-sm font-bold transition-colors",
      p === currentPage
        ? "border-line bg-surface-dark text-primary-on-dark"
        : "border-transparent text-secondary hover-layer hover:text-primary",
    );

  return (
    <nav
      aria-label={ariaLabel ?? "Paginare"}
      className="flex items-center justify-center gap-2 pt-12"
    >
      {onPageChange ? (
        <IconButton
          icon="chevron-left"
          onClick={() => {
            requestScroll();
            onPageChange(currentPage - 1);
          }}
          disabled={currentPage <= 1}
          label="Pagina anterioară"
        />
      ) : (
        <IconButton
          icon="chevron-left"
          href={currentPage > 1 ? href(currentPage - 1) : undefined}
          disabled={currentPage <= 1}
          scroll={false}
          onClick={requestScroll}
          label="Pagina anterioară"
        />
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
        onPageChange ? (
          <button
            key={p}
            type="button"
            aria-current={p === currentPage ? "page" : undefined}
            onClick={() => {
              requestScroll();
              onPageChange(p);
            }}
            className={pageClassName(p)}
          >
            {p}
          </button>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === currentPage ? "page" : undefined}
            scroll={false}
            onClick={requestScroll}
            className={pageClassName(p)}
          >
            {p}
          </Link>
        ),
      )}

      {onPageChange ? (
        <IconButton
          icon="chevron-right"
          onClick={() => {
            requestScroll();
            onPageChange(currentPage + 1);
          }}
          disabled={currentPage >= totalPages}
          label="Pagina următoare"
        />
      ) : (
        <IconButton
          icon="chevron-right"
          href={currentPage < totalPages ? href(currentPage + 1) : undefined}
          disabled={currentPage >= totalPages}
          scroll={false}
          onClick={requestScroll}
          label="Pagina următoare"
        />
      )}
    </nav>
  );
}

export default Pagination;
