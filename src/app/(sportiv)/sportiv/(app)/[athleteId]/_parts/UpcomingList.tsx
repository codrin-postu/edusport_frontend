import { HOME } from "@/lib/portal/copy-sportiv";
import type { CalendarItem } from "@/lib/portal/sportiv-types";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { SectionHeading } from "@/app/_portal/ui/SectionHeading";
import { SessionRow } from "@/app/_portal/ui/SessionRow";

/** The next sessions of the athlete, with the link to the calendar. */
export function UpcomingList({ items, calendarHref }: { items: CalendarItem[]; calendarHref: string }) {
  return (
    <div className="flex flex-col gap-3">
      <SectionHeading title={HOME.upcoming} link={{ href: calendarHref, label: HOME.calendarLink.replace(" ›", "") }} />
      <ListCard>
        {items.map((item) => <SessionRow key={`${item.date}${item.startTime}${item.title}`} item={item} />)}
      </ListCard>
    </div>
  );
}
