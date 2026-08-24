"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";

/**
 * URL-driven search input for the sportivi index.
 *
 * - Mounted as a client component above the grid (the page itself is a
 *   server component, so re-renders happen via App Router navigation).
 * - Pushes the typed value into `?search=...` after a short debounce so
 *   we don't fire a request on every keystroke.
 * - Clearing the input removes the query param entirely (URL stays clean).
 * - Resets pagination to page 1 implicitly by NOT carrying the `page`
 *   param across the search push — old paginated results aren't useful
 *   inside a new search context.
 * - `router.push(..., { scroll: false })` so typing doesn't scroll the
 *   page around as results re-render. The grid section's anchor is
 *   appended to the hash so the viewport lands on the results after
 *   the soft navigation completes.
 */

interface Props {
  initialValue?: string;
  /** Anchor id on the host page so the URL hash lands the viewport on
   *  the grid after the soft navigation. */
  scrollAnchor?: string;
}

/** Time to wait after the last keystroke before pushing the value into
 *  the URL (which triggers a server fetch). 350ms = no perceptible lag
 *  for the user but reliably collapses bursts of typing into one query.
 *  Lower than ~200ms starts firing per-key, higher than ~500ms feels
 *  unresponsive when you've finished typing. */
const DEBOUNCE_MS = 350;

export function SearchBar({ initialValue = "", scrollAnchor }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialValue);
  const [, startTransition] = useTransition();
  const lastPushed = useRef(initialValue);

  // Debounced URL sync. Effect re-arms a single timer whenever the typed
  // value changes; the cleanup clears the previous timer so only the
  // most-recent stable value gets pushed to the router.
  useEffect(() => {
    if (value === lastPushed.current) return;
    const handle = setTimeout(() => {
      lastPushed.current = value;
      const trimmed = value.trim();
      const params = new URLSearchParams();
      if (trimmed) params.set("search", trimmed);
      const qs = params.toString();
      const hash = scrollAnchor ? `#${scrollAnchor}` : "";
      const url = `${pathname}${qs ? `?${qs}` : ""}${hash}`;
      startTransition(() => router.push(url, { scroll: false }));
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [value, pathname, router, scrollAnchor]);

  // Keep input synced with URL when the user navigates back/forward
  // (e.g. browser history) — without this the input would lag behind
  // the actual server query.
  useEffect(() => {
    if (initialValue !== lastPushed.current) {
      lastPushed.current = initialValue;
      setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <div className="relative mx-auto mt-8 w-full max-w-md">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Caută sportiv după nume…"
        className="w-full border-[1.5px] border-navy bg-retro-cream py-3 pl-10 pr-10 text-sm text-navy placeholder:text-navy/40 focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/25"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Șterge căutarea"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-navy/40 transition-colors hover:bg-navy/10 hover:text-rust"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
