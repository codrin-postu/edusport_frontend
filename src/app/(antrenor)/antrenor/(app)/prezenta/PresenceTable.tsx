"use client";

import Checkbox from "@/components/ui/checkbox";
import Link from "@/components/ui/link";
import { GROUP, PRESENCE } from "@/lib/portal/copy";
import type { CoachPresenceRow, SectionKind } from "@/lib/portal/api-types";
import { useFlash } from "@/app/_portal/lib/use-flash";
import { PortalCard } from "@/app/_portal/ui/PortalCard";

export type TickMap = Map<string, { grup: boolean; uscat: boolean }>;

type PresenceTableProps = {
  rows: CoachPresenceRow[];
  kind: SectionKind;
  groupId: string;
  ticks: TickMap;
  disabled: boolean;
  onChange: (athleteId: string, key: "grup" | "uscat", value: boolean) => void;
};

const COL = "flex w-(--portal-tap) shrink-0 justify-center";

export function PresenceTable({ rows, kind, groupId, ticks, disabled, onChange }: PresenceTableProps) {
  const school = kind === "school";
  const { flashOf, flash } = useFlash();
  const toggle = (athleteId: string, key: "grup" | "uscat", value: boolean) => {
    flash(athleteId);
    onChange(athleteId, key, value);
  };
  const meta = (r: CoachPresenceRow): string =>
    [r.age === null ? null : GROUP.age(r.age), school ? r.abonament ?? PRESENCE.noSubscription : null].filter((p): p is string => p !== null).join(", ");
  return (
    <PortalCard>
      <div data-presence-head className="flex items-center gap-(--portal-gap-10) border-b border-line-subtle bg-surface-subtle px-(--portal-row-pad-x) py-(--portal-gap-10) text-(length:--portal-text-12) font-bold text-secondary">
        <span className="flex-1">{PRESENCE.athlete}</span>
        <span className={COL}>{PRESENCE.grup}</span>
        {!school && <span className={COL}>{PRESENCE.uscat}</span>}
      </div>
      <ul className="divide-y divide-line-subtle">
        {rows.map((r) => {
          const t = ticks.get(r.athleteId) ?? { grup: false, uscat: false };
          const sub = meta(r);
          return (
            <li key={r.athleteId} data-flash={flashOf(r.athleteId)} className="flex min-h-(--portal-presence-row-h) items-center gap-(--portal-gap-10) px-(--portal-row-pad-x) py-2">
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Link
                  href={`/sportiv/${encodeURIComponent(r.athleteId)}?grupa=${encodeURIComponent(groupId)}`}
                  tone="plain"
                  className="self-start text-(length:--portal-text-15) font-bold text-primary no-underline hover:underline"
                >
                  {r.name}
                </Link>
                {sub && <span className="text-(length:--portal-text-13) text-muted">{sub}</span>}
              </span>
              <span className={COL}>
                <Checkbox label={<span className="sr-only">{`${PRESENCE.grup}, ${r.name}`}</span>} checked={t.grup} disabled={disabled} onChange={(e) => toggle(r.athleteId, "grup", e.target.checked)} />
              </span>
              {!school && (
                <span className={COL}>
                  <Checkbox label={<span className="sr-only">{`${PRESENCE.uscat}, ${r.name}`}</span>} checked={t.uscat} disabled={disabled} onChange={(e) => toggle(r.athleteId, "uscat", e.target.checked)} />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </PortalCard>
  );
}
