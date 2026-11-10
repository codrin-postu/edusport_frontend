"use client";

import { useState } from "react";
import { Field } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { COMPETITIONS } from "@/lib/portal/copy";
import { monthShort, pointsText } from "@/lib/portal/format";
import type { CoachCompetitions } from "@/lib/portal/api-types";
import { CompetitionCard } from "@/app/_portal/ui/CompetitionCard";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Segmented } from "@/app/_portal/ui/Segmented";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { usePortal } from "../../_lib/use-portal";

type Scope = "all" | "mine";
type Available = Extract<CoachCompetitions, { available: true }>;

export function CompetitionsView() {
  const [scope, setScope] = useState<Scope>("all");
  const [season, setSeason] = useState<string | null>(null);
  const query = [scope === "mine" ? "scope=mine" : null, season ? `season=${encodeURIComponent(season)}` : null].filter(Boolean).join("&");
  const result = usePortal<CoachCompetitions>(`coach/competitions${query === "" ? "" : `?${query}`}`);
  // The controls stay on screen while the next answer loads: keep the last available answer.
  const [seen, setSeen] = useState<Available | null>(null);
  const data = result.data;
  if (data && data.available && seen !== data) setSeen(data);

  const onScope = (next: Scope) => {
    setScope(next);
    if (seen) setSeason(seen.season);
  };

  return (
    <>
      <PageHeader brand title={COMPETITIONS.title} sub={COMPETITIONS.sub} />
      <PageBody>
        {seen && (
          <div className="flex flex-col gap-(--portal-gap-12) portal:flex-row portal:flex-wrap portal:items-end portal:gap-4">
            <div className="flex">
              <Segmented
                label={COMPETITIONS.filter}
                value={scope}
                onChange={onScope}
                options={[{ value: "all", label: COMPETITIONS.all }, { value: "mine", label: COMPETITIONS.mine }]}
              />
            </div>
            <div className="w-full portal:w-(--portal-season-w)">
              <Field label={COMPETITIONS.season}>
                <Select
                  value={season ?? seen.season}
                  onValueChange={setSeason}
                  options={seen.seasons.map((s) => ({ value: s, label: s }))}
                  chevron="portal-chevron-down"
                />
              </Field>
            </div>
          </div>
        )}
        {result.state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
        {result.state === "error" && <LoadError />}
        {result.state === "ready" && data && !data.available && <p className="text-body">{COMPETITIONS.unavailable}</p>}
        {result.state === "ready" && data && data.available && (
          data.events.length === 0 ? (
            <p className="text-body">{COMPETITIONS.empty}</p>
          ) : (
            <div className="flex w-full flex-col gap-(--portal-gap-14) portal:max-w-(--portal-narrow-860)">
              {data.events.map((e, i) => (
                <CompetitionCard
                  key={e.eventId}
                  month={e.date ? monthShort(e.date) : ""}
                  day={e.date ? String(Number(e.date.slice(8))) : "-"}
                  name={e.name}
                  place={e.location ?? ""}
                  count={e.members.length}
                  countLabel={COMPETITIONS.athletes}
                  defaultOpen={i === 0}
                  members={e.members.map((m) => ({
                    href: `/sportiv/${encodeURIComponent(m.athleteId)}`,
                    name: m.name,
                    category: m.category,
                    placement: m.placement,
                    points: m.total === null ? "" : pointsText(m.total),
                  }))}
                />
              ))}
            </div>
          )
        )}
      </PageBody>
    </>
  );
}
