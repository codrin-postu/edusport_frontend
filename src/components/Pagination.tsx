import React from "react";
import Link from "next/link";
import IconButton from "@/components/ui/icon-button";
import { cn } from "@/utils/cn";

/**
 * Server-rendered pagination control. No client JS — each control is a
 * plain `<Link>` that re-renders the page with a new query param.
 *
 * `basePath` is the canonical pathname (e.g. "/despre-noi/sportivi"); we
 * omit the page query on page 1 so the canonical URL stays clean.
 *
 * Scroll behaviour:
 * - With a `scrollAnchor`, the URL includes a `#<id>` hash; default Next
 *   `<Link>` scroll lets the browser focus that anchor on navigation.
 * - Without a `scrollAnchor`, scrolling is suppressed (`scroll={false}`)
 *   so the user keeps their current viewport position — preferred for
 *   long lists where the pagination control already sits below the
 *   visible cards.
 *
 * `onPageChange` mode: pass a callback instead of navigating via href, for a
 * host that keeps its own page state client-side (no URL involved). When
 * set, `basePath`/`scrollAnchor`/`extraQuery`/`paramName` are ignored.
 */

interface Props {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  /** Optional anchor appended to every page URL. The host page renders an
   *  element with this id so the browser scrolls to it on navigation. */
  scrollAnchor?: string;
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
  extraQuery,
  paramName,
  ariaLabel,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const hash = scrollAnchor ? `#${scrollAnchor}` : "";
  const pageKey = paramName ?? "page";
  const scrollToAnchor = Boolean(scrollAnchor);

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
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          label="Pagina anterioară"
        />
      ) : (
        <IconButton
          icon="chevron-left"
          href={currentPage > 1 ? href(currentPage - 1) : undefined}
          disabled={currentPage <= 1}
          scroll={scrollToAnchor}
          label="Pagina anterioară"
        />
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
        onPageChange ? (
          <button
            key={p}
            type="button"
            aria-current={p === currentPage ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={pageClassName(p)}
          >
            {p}
          </button>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === currentPage ? "page" : undefined}
            scroll={scrollToAnchor}
            className={pageClassName(p)}
          >
            {p}
          </Link>
        ),
      )}

      {onPageChange ? (
        <IconButton
          icon="chevron-right"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          label="Pagina următoare"
        />
      ) : (
        <IconButton
          icon="chevron-right"
          href={currentPage < totalPages ? href(currentPage + 1) : undefined}
          disabled={currentPage >= totalPages}
          scroll={scrollToAnchor}
          label="Pagina următoare"
        />
      )}
    </nav>
  );
}

export default Pagination;
