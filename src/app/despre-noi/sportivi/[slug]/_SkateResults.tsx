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
import { cn } from "@/utils/cn";
import AccordionItem, { AccordionGroup } from "@/components/ui/accordion";
import { Pagination } from "@/components/Pagination";
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
  if (p === 2) return "text-secondary";
  if (p === 3) return "text-[#a5622f]";
  return "text-secondary";
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
      <div className="text-label uppercase text-accent">
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
    <div className="text-caption flex items-baseline justify-between gap-4">
      <dt className={cn(muted ? "text-muted" : "text-secondary")} title={title}>
        {k}
      </dt>
      <dd
        className={cn(
          "tabular-nums text-primary",
          strong ? "font-bold" : "font-medium",
        )}
      >
        {v}
      </dd>
    </div>
  );
}

export default function SkateResults({ results }: { results: SkateResult[] }) {
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
      {/* AccordionGroup is `single`: only one competition's detail is open at
          a time, same as before. Keying on the page number resets it (no
          row from the previous page stays "open" underneath) instead of the
          old explicit setOpen(null) on page change. */}
      <AccordionGroup single key={safePage}>
        {rows.map((r, idx) => {
          const key = `${r.event_id}-${r.category}`;
          const hasDetail = (r.segments?.length ?? 0) > 0;
          const row = (
            <div className="relative flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-center sm:gap-x-6">
              <div className="relative min-w-0">
                <h4 className="text-title text-primary">{r.event_name}</h4>
                <div className="text-caption mt-1 flex flex-wrap items-center gap-2 text-secondary">
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
                  className="text-caption tabular-nums text-secondary sm:min-w-[3.25rem] sm:text-right"
                  title="Program scurt"
                >
                  {r.short_score != null ? fmt(r.short_score) : ""}
                </span>
                <span
                  className="text-caption tabular-nums text-secondary sm:min-w-[3.25rem] sm:text-right"
                  title="Program liber"
                >
                  {r.free_score != null ? fmt(r.free_score) : ""}
                </span>
                <span className="text-caption tabular-nums text-primary sm:min-w-[3.5rem] sm:text-right">
                  {fmt(r.total_score)}
                </span>
                <span className="flex items-center gap-2 sm:min-w-[3.5rem] sm:justify-end">
                  {r.placement != null && (
                    <span
                      className={cn(
                        "text-caption tabular-nums",
                        placementClass(r.placement),
                      )}
                      title="Loc"
                    >
                      #{r.placement}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
          return (
            <div
              key={key}
              className={cn(
                idx < rows.length - 1 && "border-b border-line-subtle",
              )}
            >
              {hasDetail ? (
                <AccordionItem look="row" headingAs="div" triggerClassName="border-b-0 py-4" title={row}>
                  <div className="grid gap-6 pb-6 sm:grid-cols-2">
                    {[...(r.segments ?? [])]
                      .sort((a, b) => Number(b.is_short) - Number(a.is_short))
                      .map((seg, i) => (
                        <Segment key={i} seg={seg} />
                      ))}
                  </div>
                </AccordionItem>
              ) : (
                <div className="py-4">{row}</div>
              )}
            </div>
          );
        })}
      </AccordionGroup>
      {/* Page state is client-side only (no URL involved), so this uses
          Pagination's onPageChange mode rather than its default href/Link
          navigation. Pagination is 1-indexed; `page`/`safePage` here are
          0-indexed, so the conversion happens at this boundary only. */}
      <Pagination
        currentPage={safePage + 1}
        totalPages={totalPages}
        ariaLabel="Paginare competiții"
        onPageChange={(p) => setPage(p - 1)}
      />
    </div>
  );
}
