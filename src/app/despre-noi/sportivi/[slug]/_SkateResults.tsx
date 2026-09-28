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
import { Icon } from "@/components/ui/icon";
import { Medal, MedalTotals, type MedalPlace } from "@/components/ui/medal";
import { Pagination } from "@/components/Pagination";
import type { SkateResult, SkateSegment } from "@/lib/skate-results";

const PER_PAGE = 12;

// Name / Scurt / Liber / Total / Loc / chevron. Shared by the header row and
// every list row (plain or expandable) so their columns line up exactly.
const GRID_COLS =
  "sm:grid-cols-[minmax(0,1fr)_3.25rem_3.25rem_3.5rem_3.5rem_1.75rem]";

const COMPONENT_LABELS: Record<string, string> = {
  SS: "Aptitudini de patinaj",
  SK: "Aptitudini de patinaj",
  SKATINGSKILLS: "Aptitudini de patinaj",
  TR: "Tranziții",
  TRANSITIONS: "Tranziții",
  PE: "Execuție",
  PERFORMANCE: "Execuție",
  EXECUTION: "Execuție",
  CO: "Compoziție",
  COMPOSITION: "Compoziție",
  IN: "Interpretare",
  INTERPRETATION: "Interpretare",
  INTERPRETATIONOFTHEMUSIC: "Interpretare",
  PR: "Prezentare",
  PRESENTATION: "Prezentare",
  TI: "Sincronizare",
  TIMING: "Sincronizare",
};

/** Uppercases and strips spaces/underscores so "Skating Skills", "SKATING_SKILLS"
 * and "SK" all normalise to keys COMPONENT_LABELS recognises. */
function normalizeComponentKey(key: string): string {
  return key.toUpperCase().replace(/[\s_]/g, "");
}

/** Long Romanian label for a program-component code or English name.
 * Falls back to the raw key when it is not one of the known codes/names. */
function componentLabel(key: string): string {
  return COMPONENT_LABELS[normalizeComponentKey(key)] ?? key;
}

function fmt(v: number | null | undefined): string {
  return typeof v === "number" ? v.toFixed(2) : "—";
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
        <Row k="Scor total segment" v={fmt(seg.tss)} strong title="TSS" />
        <Row k="Scor elemente tehnice" v={fmt(seg.tes)} title="TES" />
        <Row k="Scor componente program" v={fmt(seg.pcs)} title="PCS" />
        {comps.map(([code, v]) => (
          <Row key={code} k={componentLabel(code)} v={fmt(v)} muted title={code} />
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
  // Three levels: the segment total (label and score bold), the two scores
  // that add up to it (semibold), and the program components (regular).
  const weight = strong ? "font-bold" : muted ? "font-normal" : "font-semibold";
  return (
    <div className="text-caption flex items-baseline justify-between gap-4">
      <dt
        className={cn("min-w-0", weight, strong ? "text-primary" : "text-secondary")}
        title={title}
      >
        {k}
      </dt>
      <dd className={cn("shrink-0 tabular-nums text-primary", weight)}>
        {v}
      </dd>
    </div>
  );
}

/** One score value, right-aligned under its header on sm+; on mobile it
 * carries its own small inline label since the columns stack there. */
function ScoreCell({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <span className="text-caption tabular-nums sm:text-right">
      <span className="text-secondary sm:hidden">{label} </span>
      <span className={emphasize ? "text-primary" : "text-secondary"}>{value}</span>
    </span>
  );
}

/** Placement: a medal for the podium, the plain number otherwise. Mobile
 * gets an inline "Loc" label to match the other score cells. */
function PlacementCell({ placement }: { placement: number | null }) {
  if (placement == null) {
    return <span aria-hidden className="sm:text-right" />;
  }
  if (placement <= 3) {
    return (
      <span className="flex items-center gap-2 sm:justify-end">
        <span className="text-caption text-secondary sm:hidden">Loc</span>
        <Medal place={placement as MedalPlace} />
      </span>
    );
  }
  return (
    <span className="text-caption tabular-nums text-secondary sm:text-right">
      <span className="sm:hidden">Loc </span>
      {placement}
    </span>
  );
}

function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <Icon
      name="chevron-down"
      className={cn(
        "shrink-0 text-secondary transition-transform duration-fast",
        open && "rotate-180",
        className,
      )}
    />
  );
}

export default function SkateResults({ results }: { results: SkateResult[] }) {
  const [page, setPage] = useState(0);
  // Single-open bookkeeping, equivalent to AccordionGroup's `single`
  // behaviour: at most one competition's detail is open, reset on page
  // change. Rows are rendered by hand (rather than via AccordionItem) so
  // the chevron can sit inside the shared column grid instead of after it.
  const [openKey, setOpenKey] = useState<string | null>(null);

  const changePage = (p: number) => {
    setOpenKey(null);
    setPage(p);
  };

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

  // Medal totals across every result, not only the current page.
  const medalTotals = useMemo(
    () =>
      results.reduce(
        (acc, r) => {
          if (r.placement === 1) acc.gold += 1;
          else if (r.placement === 2) acc.silver += 1;
          else if (r.placement === 3) acc.bronze += 1;
          return acc;
        },
        { gold: 0, silver: 0, bronze: 0 },
      ),
    [results],
  );

  return (
    <div className="mt-8 flex flex-col">
      <MedalTotals {...medalTotals} className="mb-6" />

      {/* Column header, sm+ only: on mobile the columns stack, so each score
          carries its own inline label instead. */}
      <div
        className={cn(
          "hidden text-label text-secondary sm:grid sm:items-center sm:gap-x-4 sm:border-b sm:border-line-subtle sm:pb-2",
          GRID_COLS,
        )}
      >
        <span>Competiție</span>
        <span className="text-right">Scurt</span>
        <span className="text-right">Liber</span>
        <span className="text-right">Total</span>
        <span className="text-right">Loc</span>
        <span aria-hidden />
      </div>

      {rows.map((r, idx) => {
        const key = `${r.event_id}-${r.category}`;
        const hasDetail = (r.segments?.length ?? 0) > 0;
        const isOpen = hasDetail && openKey === key;
        const panelId = `skate-result-${key}-panel`;

        // Detail rows render their name inside the row's own <h4> (the
        // button wrapper below), so the name here is a plain span to avoid
        // a block heading nested inside another heading. Rows with no
        // detail have no such wrapper, so they keep a real heading.
        const eventName = hasDetail ? (
          <span className="text-body font-semibold text-primary">{r.event_name}</span>
        ) : (
          <h4 className="text-body font-semibold text-primary">{r.event_name}</h4>
        );

        const nameBlock = (
          <div className="relative min-w-0">
            {eventName}
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
        );

        // On mobile the name and its (optional) chevron share a line; on
        // sm+ the chevron moves into its own grid column at the end, so it
        // is hidden here.
        const nameCell = (
          <div className="flex items-start justify-between gap-2 sm:block">
            {nameBlock}
            {hasDetail && <Chevron open={isOpen} className="mt-1 sm:hidden" />}
          </div>
        );

        // Scores + placement: grouped as one row on mobile (`flex`), then
        // unwrapped into individual grid cells on sm+ via `contents`.
        const scoresCell = (
          <div className="flex items-baseline gap-4 sm:contents">
            <ScoreCell
              label="Scurt"
              value={r.short_score != null ? fmt(r.short_score) : ""}
            />
            <ScoreCell
              label="Liber"
              value={r.free_score != null ? fmt(r.free_score) : ""}
            />
            <ScoreCell label="Total" value={fmt(r.total_score)} emphasize />
            <PlacementCell placement={r.placement} />
          </div>
        );

        const rowClass = cn(
          "relative flex w-full flex-col gap-2 text-left sm:grid sm:items-center sm:gap-x-4",
          GRID_COLS,
        );

        const detail = hasDetail && (
          <div id={panelId} hidden={!isOpen} className="grid gap-6 pb-6 sm:grid-cols-2">
            {[...(r.segments ?? [])]
              .sort((a, b) => Number(b.is_short) - Number(a.is_short))
              .map((seg, i) => (
                <Segment key={i} seg={seg} />
              ))}
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
              <h4>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenKey((cur) => (cur === key ? null : key))}
                  className={cn(
                    rowClass,
                    "py-4 outline-none transition-colors hover:text-accent",
                    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary",
                  )}
                >
                  {nameCell}
                  {scoresCell}
                  <span className="hidden sm:flex sm:items-center sm:justify-end">
                    <Chevron open={isOpen} />
                  </span>
                </button>
              </h4>
            ) : (
              <div className={cn(rowClass, "py-4")}>
                {nameCell}
                {scoresCell}
                <span aria-hidden className="hidden sm:block" />
              </div>
            )}
            {detail}
          </div>
        );
      })}

      {/* Page state is client-side only (no URL involved), so this uses
          Pagination's onPageChange mode rather than its default href/Link
          navigation. Pagination is 1-indexed; `page`/`safePage` here are
          0-indexed, so the conversion happens at this boundary only. */}
      <Pagination
        currentPage={safePage + 1}
        totalPages={totalPages}
        ariaLabel="Paginare competiții"
        onPageChange={(p) => changePage(p - 1)}
      />
    </div>
  );
}
