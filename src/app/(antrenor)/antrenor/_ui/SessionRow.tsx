import { AZI, CALENDAR } from "@/lib/portal/copy";
import { roCount } from "@/lib/ro-plural";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { IndividualTag } from "@/app/_portal/ui/IndividualTag";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { StatusBlock } from "@/app/_portal/ui/StatusBlock";

/** What a today or calendar row needs; both answers map onto it. */
export type SessionRowData = {
  kind: "grup" | "individual";
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

export const presenceHref = (r: { sessionId: string | null; occurrenceKey: string | null }): string =>
  r.sessionId ? `/prezenta?id=${encodeURIComponent(r.sessionId)}` : `/prezenta?occurrence=${encodeURIComponent(r.occurrenceKey ?? "")}`;

const hrefOf = (r: SessionRowData): string =>
  r.kind === "individual" ? `/lectie/${encodeURIComponent(r.lessonId ?? "")}` : presenceHref(r);

/** One row of the today and day lists: time block, title, sub line, and the Grup or Individual status block. `now` is HH:mm; earlier rows are dimmed. */
export function SessionRow({ row, now }: { row: SessionRowData; now?: string }) {
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
      href={cancelled ? undefined : hrefOf(row)}
      lead={<DateBlock big={row.startTime} dim={dim} />}
      title={row.title}
      sub={cancelled ? CALENDAR.legendCancelled : sub}
      dim={dim}
      end={cancelled ? null : <StatusBlock kind={row.kind === "grup" ? "Grup" : "Individual"} done={row.done} />}
    />
  );
}
