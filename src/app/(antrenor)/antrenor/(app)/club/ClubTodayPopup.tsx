"use client";

import Button from "@/components/ui/button";
import { CLUB_TODAY } from "@/lib/portal/copy";
import { longDay, weekdayShort } from "@/lib/portal/format";
import type { ClubTodayRow, CoachClubToday } from "@/lib/portal/api-types";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { IndividualTag, SchoolTag } from "@/app/_portal/ui/IndividualTag";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { useMe } from "../../_lib/me-context";
import { usePortal } from "../../_lib/use-portal";

/** "Antrenamentele clubului azi": every session of the club today, as a popup over Azi (`?club=1`). */
export function ClubTodayPopup({ onClose }: { onClose: () => void }) {
  const me = useMe();
  const club = usePortal<CoachClubToday>("coach/today/club");
  const close = (o: boolean) => { if (!o) onClose(); };
  if (club.state === "error") return <Sheet open onOpenChange={close} title={CLUB_TODAY.title} popup={{ closeLabel: CLUB_TODAY.close }}><LoadError onRetry={club.reload} /></Sheet>;
  if (club.state === "loading" || !club.data) return null;
  const { date, rows } = club.data;

  function row(r: ClubTodayRow, i: number) {
    const lead = <DateBlock word={weekdayShort(date)} day={String(Number(date.slice(8)))} time={r.startTime} />;
    if (r.kind === "group") {
      const who = r.coaches.map((c) => (r.own && c === me?.name ? CLUB_TODAY.you(c) : c)).join(", ");
      return (
        <ListRow
          key={`g${r.groupId}${r.startTime}${i}`}
          href={`/grupe/${encodeURIComponent(r.groupId)}`}
          lead={lead}
          title={r.name}
          sub={<>{r.school && <SchoolTag />}{r.location ? `${who}, ${r.location}` : who}</>}
        />
      );
    }
    const sub = <><IndividualTag />{`${r.own ? CLUB_TODAY.you(r.coach) : r.coach}, ${r.durationMin} min`}</>;
    return (
      <ListRow
        key={`l${r.lessonId ?? ""}${r.startTime}${i}`}
        {...(r.own && r.lessonId ? { href: `/lectie/${encodeURIComponent(r.lessonId)}` } : { end: null })}
        lead={lead}
        title={CLUB_TODAY.lesson}
        sub={sub}
      />
    );
  }

  return (
    <Sheet
      open
      onOpenChange={close}
      title={CLUB_TODAY.title}
      description={CLUB_TODAY.hint(longDay(date))}
      popup={{ closeLabel: CLUB_TODAY.close }}
      footer={<Button variant="secondary" onClick={onClose} className="w-full portal:w-auto">{CLUB_TODAY.close}</Button>}
    >
      {rows.length === 0 ? <p className="text-body text-secondary">{CLUB_TODAY.none}</p> : <ListCard>{rows.map(row)}</ListCard>}
    </Sheet>
  );
}
