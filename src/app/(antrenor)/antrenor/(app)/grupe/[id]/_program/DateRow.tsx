import { AZI, PROGRAM } from "@/lib/portal/copy";
import { capitalize, longDay, weekdayLong, weekdayShort } from "@/lib/portal/format";
import { dateState, occurrenceMinutes, type DateState } from "@/lib/portal/program";
import type { Occurrence } from "@/lib/portal/api-types";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { EndBlock } from "@/app/_portal/ui/EndBlock";
import { ListRow } from "@/app/_portal/ui/ListRow";

/** "mutată din marți, 17 noiembrie": the series date a moved class came from, in lowercase. */
const movedFrom = (o: Occurrence): string => PROGRAM.movedFromSub(longDay(o.originalDate ?? o.date).toLowerCase());

function sub(o: Occurrence, state: DateState): string | null {
  if (state === "pause") return PROGRAM.breakNotice(o.note ?? "");
  if (state === "moved") return movedFrom(o);
  const min = occurrenceMinutes(o);
  return min === null ? null : AZI.minutes(min);
}

type DateRowProps = { occurrence: Occurrence; today: string; /** Set when the date is open and the group editable: the row opens the date sheet. */ onOpen?: (o: Occurrence) => void };

/** One date of the group: date block, "Marți, 17:30", length or note, "Anulată" or "Mutată" at the end. */
export function DateRow({ occurrence: o, today, onOpen }: DateRowProps) {
  const state = dateState(o, today);
  const end = state === "cancelled" ? <EndBlock kind="soft">{PROGRAM.cancelled}</EndBlock> : state === "moved" ? <EndBlock kind="soft">{PROGRAM.moved}</EndBlock> : onOpen ? undefined : null;
  return (
    <ListRow
      lead={<DateBlock word={weekdayShort(o.date)} day={String(Number(o.date.slice(8)))} time={o.startTime ?? undefined} />}
      title={PROGRAM.ruleTitle(capitalize(weekdayLong(o.date)), o.startTime ?? "")}
      sub={sub(o, state)}
      end={end}
      onClick={onOpen ? () => onOpen(o) : undefined}
    />
  );
}
