import NextLink from "next/link";
import Icon from "@/components/ui/icon";
import { cn } from "@/utils/cn";

type ListRowProps = {
  href?: string;
  onClick?: () => void;
  lead?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  extra?: React.ReactNode;
  end?: React.ReactNode;
  dim?: boolean;
  label?: string;
  /** Marks the row as a target for programmatic focus after "Arată mai multe". */
  focusable?: boolean;
};

const ROW =
  "group flex w-full min-h-(--portal-row-min-h) items-stretch text-left text-primary no-underline outline-none hover:no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus";

/** Link and button rows only: ice light on hover, a slightly darker ice while pressed (tokens in the portal theme). */
const ROW_LIVE = "transition-colors duration-(--motion-fast) ease-(--motion-ease) hover:bg-row-hover active:bg-row-press";

/** One list row: the whole row is one link (or button, or plain without either), lead block, two text lines, an end block (`null` for none) or a chevron. */
export function ListRow({ href, onClick, lead, title, sub, extra, end, dim, label, focusable }: ListRowProps) {
  const body = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-(--portal-row-gap) px-(--portal-row-pad-x) py-(--portal-row-pad-y)">
        {lead}
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className={cn("text-(length:--portal-row-title) font-bold", dim && "text-muted-on-dark")}>{title}</span>
          {sub && <span className="text-(length:--portal-row-sub) text-muted">{sub}</span>}
          {extra}
        </span>
      </span>
      {end !== undefined ? end : (
        <span className="flex w-(--portal-trail-w) shrink-0 items-center justify-center text-secondary">
          <span data-row-chevron className="flex transition-transform duration-(--motion-fast) ease-(--motion-ease) group-hover:translate-x-(--motion-nudge)">
            <Icon name="portal-chevron-right" size="sm" />
          </span>
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <NextLink href={href} aria-label={label} className={cn(ROW, ROW_LIVE)} {...(focusable ? { "data-more-row": "" } : {})}>
        {body}
      </NextLink>
    );
  }
  if (!onClick) return <div className={ROW}>{body}</div>;
  return (
    <button type="button" onClick={onClick} aria-label={label} className={cn(ROW, ROW_LIVE)}>
      {body}
    </button>
  );
}
