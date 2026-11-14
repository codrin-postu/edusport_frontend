import { weekdayShort } from "@/lib/portal/format";
import { SESSION } from "@/lib/portal/copy-sportiv";
import type { CalendarItem } from "@/lib/portal/sportiv-types";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { EndBlock } from "@/app/_portal/ui/EndBlock";
import { ListRow } from "@/app/_portal/ui/ListRow";

const END_KIND = { grupa: "group", individual: "lesson", concurs: "competition" } as const;
const END_TEXT = { individual: SESSION.lesson, concurs: SESSION.competition } as const;

/**
 * One session of the sportiv app (Acasă, the calendar day list): date block, place and an end block, with the
 * trainer and the full details in a native `<details>`. `now` is "YYYY-MM-DDTHH:mm"; earlier sessions are dimmed.
 */
export function SessionRow({ item, now }: { item: CalendarItem; now?: string }) {
  const start = item.startTime ?? "";
  const dim = item.cancelled || (now !== undefined && item.startTime !== null && `${item.date}T${item.startTime}` < now);
  const end = item.cancelled
    ? <EndBlock kind="cancelled">{SESSION.cancelled}</EndBlock>
    : <EndBlock kind={END_KIND[item.kind]}>{item.kind === "grupa" ? item.title : END_TEXT[item.kind]}</EndBlock>;
  return (
    <details className="group/session">
      <summary className="block cursor-pointer list-none outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
        <ListRow
          lead={<DateBlock word={weekdayShort(item.date)} day={String(Number(item.date.slice(8)))} time={start || undefined} dim={dim} />}
          title={item.location ?? item.title}
          dim={dim}
          end={end}
        />
      </summary>
      <div className="flex flex-col gap-1 border-t border-line-subtle bg-surface px-(--portal-row-pad-x) py-3 text-(length:--portal-text-13)">
        {item.coaches.length > 0 && <span>{SESSION.coaches(item.coaches.join(", "))}</span>}
        {item.startTime !== null && item.endTime !== null && <span>{SESSION.time(item.startTime, item.endTime)}</span>}
        {item.location !== null && <span>{SESSION.place(item.location)}</span>}
        {item.cancelled && <span>{SESSION.cancelled}</span>}
        {item.reason !== null && <span>{item.reason}</span>}
      </div>
    </details>
  );
}
