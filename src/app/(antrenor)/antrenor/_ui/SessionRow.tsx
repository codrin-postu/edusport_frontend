import { AZI, CALENDAR } from "@/lib/portal/copy";
import { withFrom, type PresenceFrom } from "@/lib/portal/presence";
import { roCount } from "@/lib/ro-plural";
import { weekdayShort } from "@/lib/portal/format";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { IndividualTag } from "@/app/_portal/ui/IndividualTag";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { StatusBlock } from "@/app/_portal/ui/StatusBlock";

/** What a today or calendar row needs; both answers map onto it. */
export type SessionRowData = {
  kind: "grup" | "individual";
  /** YYYY-MM-DD of the row, for its date square. */
  date: string;
  startTime: string;
  /** Group name, or the athlete's name for a lesson. */
  title: string;
  children: number | null;
  location: string | null;
  durationMin: number | null;
  done: boolean;
  cancelled?: boolean;
  sessionId: string | null;
  occurrenceKey: string | null;
  lessonId: string | null;
};

export const presenceHref = (r: { sessionId: string | null; occurrenceKey: string | null }, from: PresenceFrom | null = null): string =>
  withFrom(r.sessionId ? `/prezenta?id=${encodeURIComponent(r.sessionId)}` : `/prezenta?occurrence=${encodeURIComponent(r.occurrenceKey ?? "")}`, from);

const hrefOf = (r: SessionRowData, from: PresenceFrom | null): string =>
  r.kind === "individual" ? `/lectie/${encodeURIComponent(r.lessonId ?? "")}` : presenceHref(r, from);

/** One row of the today and day lists: date square (weekday, day, hour), title, sub line, and the Grup or Individual status block. `now` is HH:mm; earlier rows are dimmed. */
export function SessionRow({ row, now, from = null }: { row: SessionRowData; now?: string; from?: PresenceFrom | null }) {
  const cancelled = row.cancelled === true;
  const dim = cancelled || (now !== undefined && row.startTime < now);
  const sub =
    row.kind === "individual" ? (
      <>
        <IndividualTag />
        {AZI.minutes(row.durationMin ?? 0)}
      </>
    ) : (
      AZI.groupSub(roCount(row.children ?? 0, "copil", "copii"), row.location)
    );
  return (
    <ListRow
      href={cancelled ? undefined : hrefOf(row, from)}
      lead={<DateBlock word={weekdayShort(row.date)} day={String(Number(row.date.slice(8)))} time={row.startTime} dim={dim} />}
      title={row.title}
      sub={cancelled ? CALENDAR.legendCancelled : sub}
      dim={dim}
      end={cancelled ? null : <StatusBlock kind={row.kind === "grup" ? "Grup" : "Individual"} done={row.done} />}
    />
  );
}
