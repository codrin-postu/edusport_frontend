import Icon from "@/components/ui/icon";
import { NOTICES } from "@/lib/portal/copy-sportiv";
import { dayMonthShort, weekdayShort } from "@/lib/portal/format";
import type { SportivNotice } from "@/lib/portal/sportiv-types";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { PortalCard } from "@/app/_portal/ui/PortalCard";

/** One message: its date, the title, then the body (hand-written) or the rows (automatic), and a close button. */
export function NoticeCard({ notice, onDismiss }: { notice: SportivNotice; onDismiss: () => void }) {
  return (
    <div data-notice>
    <PortalCard pad="card" className="gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-(length:--portal-text-13) text-muted">{dayMonthShort(notice.date)}</span>
          <h3 className="text-(length:--portal-text-15) font-bold text-primary">{notice.title}</h3>
        </div>
        <button
          type="button"
          aria-label={NOTICES.close}
          onClick={onDismiss}
          className="-m-2 flex size-(--portal-tap) shrink-0 cursor-pointer items-center justify-center text-secondary outline-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus"
        >
          <Icon name="close" size="18" />
        </button>
      </div>
      {notice.body !== null && <p className="text-(length:--portal-text-14) text-secondary">{notice.body}</p>}
      {notice.rows.length > 0 && (
        <ul className="flex flex-col gap-3">
          {notice.rows.map((row, i) => (
            <li key={i} className="flex items-center gap-3">
              <DateBlock word={weekdayShort(row.date)} day={String(Number(row.date.slice(8)))} />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-(length:--portal-text-14) font-semibold text-primary">{row.text}</span>
                {row.reason !== null && <span className="text-(length:--portal-text-13) text-muted">{row.reason}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </PortalCard>
    </div>
  );
}
