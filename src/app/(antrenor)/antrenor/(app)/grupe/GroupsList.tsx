"use client";

import { useState } from "react";
import { GRUPE } from "@/lib/portal/copy";
import type { CoachGroups } from "@/lib/portal/api-types";
import Icon from "@/components/ui/icon";
import { usePortal } from "../../_lib/use-portal";
import { ListCard } from "../../_ui/ListCard";
import { LoadError } from "../../_ui/LoadError";
import { Row } from "../../_ui/Row";
import { Spinner } from "../../_ui/Spinner";

export function GroupsList({ selected }: { selected: string | null }) {
  const groups = usePortal<CoachGroups>("coach/groups");
  const [open, setOpen] = useState(false);
  if (groups.state === "loading") return <div className="py-6 flex justify-center"><Spinner /></div>;
  if (groups.state === "error" || !groups.data) return <LoadError />;
  const { mine, others } = groups.data;
  const mark = (id: string): string => (id === selected ? "bg-surface-subtle" : "");
  return (
    <div>
      <h1 className="text-title text-primary mb-4">{GRUPE.title}</h1>
      <ListCard>
        {mine.map((g) => (
          <div key={g.groupId} className={mark(g.groupId)}>
            <Row href={`/grupe/${encodeURIComponent(g.groupId)}`} title={g.name} sub={GRUPE.line(g.program.join(", "), g.children)} />
          </div>
        ))}
      </ListCard>
      {others.length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-4 h-12 text-button text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
          >
            {GRUPE.others}
            <Icon name="chevron-down" className={open ? "rotate-180" : ""} />
          </button>
          {open && (
            <ListCard>
              {others.map((g) => (
                <div key={g.groupId} className={mark(g.groupId)}>
                  <Row href={`/grupe/${encodeURIComponent(g.groupId)}`} title={g.name} sub={g.coaches.length > 0 ? GRUPE.coaches(g.coaches.join(", ")) : undefined} />
                </div>
              ))}
            </ListCard>
          )}
        </div>
      )}
    </div>
  );
}
