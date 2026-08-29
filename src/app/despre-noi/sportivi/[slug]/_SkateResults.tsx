"use client";

/**
 * Detailed competition results for an athlete linked to skate-results.
 *
 * Rendered in place of the manual "Istoric competițional" section when the
 * sportsperson has a `skateResultsSlug`. Each row is a competition with
 * placement + segment totals (scurt / liber / total) and an expandable
 * technical breakdown (TSS / TES / PCS + program components). The list is
 * capped to the most recent competitions for a tidy page; skate-results holds
 * the full history.
 */

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import type { SkateResult, SkateSegment } from "@/lib/skate-results";

const PER_PAGE = 12;

const COMPONENT_LABELS: Record<string, string> = {
  SS: "Aptitudini de patinaj",
  TR: "Tranziții",
  PE: "Execuție",
  CO: "Compoziție",
  IN: "Interpretare",
  SK: "Aptitudini de patinaj",
  PR: "Prezentare",
  TI: "Sincronizare",
};

function fmt(v: number | null | undefined): string {
  return typeof v === "number" ? v.toFixed(2) : "—";
}

function placementClass(p: number | null): string {
  if (p === 1) return "text-[#b7860b]";
  if (p === 2) return "text-navy/50";
  if (p === 3) return "text-[#a5622f]";
  return "text-navy/40";
}

function ro_date(v: string | null): string {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Segment({ seg }: { seg: SkateSegment }) {
  const comps = Object.entries(seg.components ?? {}).filter(
    ([, v]) => v != null,
  );
  return (
    <div className="min-w-0">
      <div className="text-2xs font-bold uppercase tracking-[0.16em] text-rust">
        {seg.is_short ? "Program scurt" : "Program liber"}
      </div>
      <dl className="mt-2 space-y-1">
        <Row k="TSS" v={fmt(seg.tss)} strong title="Scor total segment" />
        <Row k="TES" v={fmt(seg.tes)} title="Scor elemente tehnice" />
        <Row k="PCS" v={fmt(seg.pcs)} title="Scor componente program" />
        {comps.map(([code, v]) => (
          <Row
            key={code}
            k={code}
            v={fmt(v)}
            muted
            title={COMPONENT_LABELS[code.toUpperCase()]}
          />
        ))}
        {seg.deductions != null && seg.deductions !== 0 && (
          <Row k="Penalizări" v={`-${fmt(seg.deductions)}`} />
        )}
      </dl>
    </div>
  );
}

function Row({
  k,
  v,
  strong,
  muted,
  title,
}: {
  k: string;
  v: string;
  strong?: boolean;
  muted?: boolean;
  title?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-xs">
      <dt className={cn(muted ? "text-navy/45" : "text-navy/70")} title={title}>
        {k}
      </dt>
      <dd
        className={cn(
          "tabular-nums text-navy",
          strong ? "font-bold" : "font-medium",
        )}
      >
        {v}
      </dd>
    </div>
  );
}

export default function SkateResults({ results }: { results: SkateResult[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // Most recent first. Dates are "YYYY-MM-DD" so a string compare is
  // chronological; entries without a date (some official imports) sort last.
  const sorted = useMemo(
    () =>
      [...results].sort((a, b) =>
        (b.event_date ?? "").localeCompare(a.event_date ?? ""),
      ),
    [results],
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const rows = sorted.slice(safePage * PER_PAGE, (safePage + 1) * PER_PAGE);

  return (
    <div className="mt-8 flex flex-col">
      {rows.map((r, idx) => {
        const key = `${r.event_id}-${r.category}`;
        const hasDetail = (r.segments?.length ?? 0) > 0;
        const isOpen = open === key;
        return (
          <div
            key={key}
            className={cn(
              idx < rows.length - 1 && "border-b border-navy/10",
            )}
          >
            <div
              className={cn(
                "relative flex flex-col gap-2 py-[18px] sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-center sm:gap-x-6",
                hasDetail && "cursor-pointer",
              )}
              onClick={hasDetail ? () => setOpen(isOpen ? null : key) : undefined}
            >
              <div className="relative min-w-0">
                <h4 className="text-sm font-bold text-navy">{r.event_name}</h4>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-2xs font-light tracking-[0.04em] text-navy/50">
                  {r.event_date && <span>{ro_date(r.event_date)}</span>}
                  {r.event_location && (
                    <>
                      {r.event_date && <span>·</span>}
                      <span>{r.event_location}</span>
                    </>
                  )}
                  {r.category && (
                    <>
                      {(r.event_date || r.event_location) && <span>·</span>}
                      <span>{r.category}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-baseline gap-4 sm:contents">
                <span
                  className="text-xs font-medium tabular-nums text-navy/60 sm:min-w-[3.25rem] sm:text-right"
                  title="Program scurt"
                >
                  {r.short_score != null ? fmt(r.short_score) : ""}
                </span>
                <span
                  className="text-xs font-medium tabular-nums text-navy/60 sm:min-w-[3.25rem] sm:text-right"
                  title="Program liber"
                >
                  {r.free_score != null ? fmt(r.free_score) : ""}
                </span>
                <span className="text-xs font-semibold tabular-nums text-navy sm:min-w-[3.5rem] sm:text-right">
                  {fmt(r.total_score)}
                </span>
                <span className="flex items-center gap-2 sm:min-w-[3.5rem] sm:justify-end">
                  {r.placement != null && (
                    <span
                      className={cn(
                        "text-2xs font-extrabold tabular-nums",
                        placementClass(r.placement),
                      )}
                      title="Loc"
                    >
                      #{r.placement}
                    </span>
                  )}
                  {hasDetail && (
                    <span className="text-navy/30">{isOpen ? "▾" : "▸"}</span>
                  )}
                </span>
              </div>
            </div>
            {isOpen && hasDetail && (
              <div className="grid gap-6 pb-5 sm:grid-cols-2">
                {[...(r.segments ?? [])]
                  .sort((a, b) => Number(b.is_short) - Number(a.is_short))
                  .map((seg, i) => (
                    <Segment key={i} seg={seg} />
                  ))}
              </div>
            )}
          </div>
        );
      })}
      {totalPages > 1 && (
        <nav
          aria-label="Paginare competiții"
          className="flex items-center justify-center gap-1.5 pt-10"
        >
          <button
            type="button"
            aria-label="Pagina anterioară"
            onClick={() => {
              setOpen(null);
              setPage((p) => Math.max(0, p - 1));
            }}
            disabled={safePage === 0}
            className="flex h-9 w-9 items-center justify-center border-[1.5px] border-navy text-navy transition-colors hover:bg-navy hover:text-retro-cream disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
            <button
              key={p}
              type="button"
              aria-current={p === safePage ? "page" : undefined}
              onClick={() => {
                setOpen(null);
                setPage(p);
              }}
              className={cn(
                "flex h-9 w-9 items-center justify-center border-[1.5px] text-sm font-bold transition-colors",
                p === safePage
                  ? "border-navy bg-navy text-retro-cream"
                  : "border-transparent text-navy/60 hover:bg-navy/10 hover:text-navy",
              )}
            >
              {p + 1}
            </button>
          ))}

          <button
            type="button"
            aria-label="Pagina următoare"
            onClick={() => {
              setOpen(null);
              setPage((p) => Math.min(totalPages - 1, p + 1));
            }}
            disabled={safePage >= totalPages - 1}
            className="flex h-9 w-9 items-center justify-center border-[1.5px] border-navy text-navy transition-colors hover:bg-navy hover:text-retro-cream disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
