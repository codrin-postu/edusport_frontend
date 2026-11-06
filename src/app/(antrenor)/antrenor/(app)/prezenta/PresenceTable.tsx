"use client";

import Checkbox from "@/components/ui/checkbox";
import { PRESENCE } from "@/lib/portal/copy";
import type { CoachPresenceRow, SectionKind } from "@/lib/portal/api-types";

export type TickMap = Map<string, { grup: boolean; uscat: boolean }>;

type PresenceTableProps = {
  rows: CoachPresenceRow[];
  kind: SectionKind;
  ticks: TickMap;
  disabled: boolean;
  onChange: (athleteId: string, key: "grup" | "uscat", value: boolean) => void;
};

export function PresenceTable({ rows, kind, ticks, disabled, onChange }: PresenceTableProps) {
  const school = kind === "school";
  const cols = school ? "grid-cols-[1fr_4rem]" : "grid-cols-[1fr_4rem_4rem]";
  return (
    <div className="border-retro border-line bg-surface-raised">
      <div className={`grid ${cols} items-center gap-2 px-4 h-12 border-b border-line text-label text-secondary`}>
        <span>{PRESENCE.athlete}</span>
        <span className="text-center">{PRESENCE.grup}</span>
        {!school && <span className="text-center">{PRESENCE.uscat}</span>}
      </div>
      <ul className="divide-y divide-line-subtle">
        {rows.map((r) => {
          const t = ticks.get(r.athleteId) ?? { grup: false, uscat: false };
          return (
            <li key={r.athleteId} className={`grid ${cols} items-center gap-2 px-4 py-3`}>
              <span className="min-w-0">
                <span className="text-body text-primary block">{r.name}</span>
                {school && <span className="text-body-sm text-secondary block">{r.abonament ?? PRESENCE.noSubscription}</span>}
              </span>
              <span className="flex justify-center">
                <Checkbox label={<span className="sr-only">{`${r.name}, ${PRESENCE.grup}`}</span>} checked={t.grup} disabled={disabled} onChange={(e) => onChange(r.athleteId, "grup", e.target.checked)} />
              </span>
              {!school && (
                <span className="flex justify-center">
                  <Checkbox label={<span className="sr-only">{`${r.name}, ${PRESENCE.uscat}`}</span>} checked={t.uscat} disabled={disabled} onChange={(e) => onChange(r.athleteId, "uscat", e.target.checked)} />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
