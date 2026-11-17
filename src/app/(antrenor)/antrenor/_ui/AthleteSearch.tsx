"use client";

import { useEffect, useId, useState } from "react";
import { ADD_ATHLETE } from "@/lib/portal/copy";
import type { CoachSearchRow } from "@/lib/portal/api-types";
import { Input } from "@/components/ui/form-field";
import Icon from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import { portalApi } from "@/app/_portal/lib/api";

type AthleteSearchProps = {
  group?: string;
  multiple: boolean;
  selected: string[];
  onToggle: (row: CoachSearchRow) => void;
};

const MIN_LETTERS = 3;
const DEBOUNCE_MS = 250;
const MAX_ROWS = 8;

type Found = { query: string; rows: CoachSearchRow[] };

export function AthleteSearch({ group, multiple, selected, onToggle }: AthleteSearchProps) {
  const id = useId();
  const [q, setQ] = useState("");
  const [found, setFound] = useState<Found | null>(null);
  const term = q.trim();
  const query = term.length >= MIN_LETTERS ? `${term}|${group ?? ""}` : null;

  useEffect(() => {
    if (query === null) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      const path = `coach/athletes/search?q=${encodeURIComponent(term)}${group ? `&group=${encodeURIComponent(group)}` : ""}`;
      void portalApi<CoachSearchRow[]>("GET", path).then((r) => {
        if (!cancelled) setFound({ query, rows: r.ok ? r.data.slice(0, MAX_ROWS) : [] });
      });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, term, group]);

  const rows = query !== null && found?.query === query ? found.rows : [];
  return (
    <div>
      <label htmlFor={id} className="text-field-label text-label-ink block mb-(--field-gap)">{ADD_ATHLETE.search}</label>
      <Input id={id} type="search" value={q} autoComplete="off" surface="card" onChange={(e) => setQ(e.target.value)} />
      {rows.length > 0 && (
        <ul className="mt-2 border border-card-line bg-surface-raised divide-y divide-line-subtle">
          {rows.map((row) => {
            const on = selected.includes(row.athleteId);
            return (
              <li key={row.athleteId}>
                <button
                  type="button"
                  aria-pressed={multiple ? on : undefined}
                  onClick={() => onToggle(row)}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 min-h-(--portal-tap) p-4 text-left text-(length:--portal-text-15) font-bold outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
                    on ? "bg-surface-highlight text-primary" : "text-primary",
                  )}
                >
                  <span>{row.age === null ? row.name : ADD_ATHLETE.row(row.name, row.age)}</span>
                  {on && <Icon name="check" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
