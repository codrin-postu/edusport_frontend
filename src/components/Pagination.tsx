import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
 */

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
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
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  scrollAnchor,
  extraQuery,
  paramName,
  ariaLabel,
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
    return `${basePath}${qs ? `?${qs}` : ""}${hash}`;
  };

  const arrowClass =
    "flex h-9 w-9 items-center justify-center border-[1.5px] border-navy text-navy transition-colors hover:bg-navy hover:text-retro-cream";
  const arrowDisabled = cn(arrowClass, "pointer-events-none opacity-30");

  return (
    <nav
      aria-label={ariaLabel ?? "Paginare"}
      className="flex items-center justify-center gap-1.5 pt-12"
    >
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          aria-label="Pagina anterioară"
          scroll={scrollToAnchor}
          className={arrowClass}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span aria-hidden className={arrowDisabled}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === currentPage ? "page" : undefined}
          scroll={scrollToAnchor}
          className={cn(
            "flex h-9 w-9 items-center justify-center border-[1.5px] text-sm font-bold transition-colors",
            p === currentPage
              ? "border-navy bg-navy text-retro-cream"
              : "border-transparent text-navy/60 hover:bg-navy/10 hover:text-navy",
          )}
        >
          {p}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          aria-label="Pagina următoare"
          scroll={scrollToAnchor}
          className={arrowClass}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span aria-hidden className={arrowDisabled}>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

export default Pagination;
