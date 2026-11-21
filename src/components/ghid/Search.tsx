"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/icon";
import Link from "@/components/ui/link";
import { searchDocs, type SearchDoc } from "@/lib/ghid/search";
import { cn } from "@/utils/cn";

type Props = {
  docs: SearchDoc[];
  /** bar: on the navy top bar (desktop). phone: beside the Cuprins button. */
  variant: "bar" | "phone";
};

/** Search field with a result list. "/" focuses the visible field when no input has focus. */
export function Search({ docs, variant }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = useMemo(() => searchDocs(docs, query), [docs, query]);
  const typed = query.trim() !== "";

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = document.activeElement;
      if (el instanceof HTMLElement && (el.matches("input, textarea, select") || el.isContentEditable)) return;
      const field = input.current;
      if (!field || field.offsetParent === null) return; // the other variant is the visible one
      e.preventDefault();
      field.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(slug: string) {
    setOpen(false);
    setQuery("");
    input.current?.blur();
    router.push(`/ghid/${slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      input.current?.blur();
    } else if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActive((active + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((active - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].slug);
    }
  }

  return (
    <div className={cn("relative", variant === "bar" ? "ml-auto hidden w-full max-w-(--portal-narrow-360) portal:block" : "min-w-0 flex-1 portal:hidden")}>
      <label
        className={cn(
          "flex h-9 items-center gap-2 border-input px-3 text-(length:--portal-text-13)",
          variant === "bar"
            ? "border-bar-field-line bg-bar-field text-nav-on-dark focus-within:outline-2 focus-within:outline-offset-(--focus-offset) focus-within:outline-ice"
            : "h-(--portal-tap) border-input-line bg-surface-raised text-primary focus-within:outline-2 focus-within:outline-offset-(--focus-offset) focus-within:outline-focus",
        )}
      >
        <Icon name="search" />
        <input
          ref={input}
          type="search"
          role="combobox"
          aria-expanded={open && typed}
          aria-controls={`ghid-results-${variant}`}
          aria-label="Caută în ghid"
          placeholder="Caută în ghid"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-inherit"
        />
        {variant === "bar" && <kbd className="border-input border-bar-field-line px-1 font-sans text-(length:--portal-text-11) font-medium">/</kbd>}
      </label>
      {open && typed && (
        <ul
          id={`ghid-results-${variant}`}
          role="listbox"
          className="absolute top-full right-0 left-0 z-menu mt-1 border-card border-card-line bg-surface-raised text-primary shadow-retro-sm"
        >
          {results.length === 0 && <li className="px-3 py-3 text-(length:--portal-text-14)">Niciun rezultat.</li>}
          {results.map((r, i) => (
            <li key={r.slug} role="option" aria-selected={i === active}>
              <Link
                href={`/ghid/${r.slug}`}
                tone="plain"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(r.slug)}
                className={cn("block px-3 py-2", i === active && "bg-surface-subtle")}
              >
                <span className="block text-(length:--portal-text-14) font-bold">{r.title}</span>
                <span className="block text-(length:--portal-text-12) text-muted">{r.group}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
