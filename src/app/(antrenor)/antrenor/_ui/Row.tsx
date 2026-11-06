import Link from "@/components/ui/link";
import Icon from "@/components/ui/icon";
import { SquareLabel } from "./SquareLabel";

type RowProps = {
  href: string;
  /** Start time only, shown on the left. */
  time?: string;
  title: string;
  sub?: string;
  label?: string;
  /** Date tile on the left (`dateTile` of format.ts). */
  tile?: { day: string; weekday: string };
};

/** A list row: the whole row is one link. */
export function Row({ href, time, title, sub, label, tile }: RowProps) {
  return (
    <Link
      href={href}
      tone="plain"
      className="flex items-center gap-4 p-4 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
    >
      {time && <span className="text-label text-secondary w-12 shrink-0">{time}</span>}
      {tile && (
        <span className="w-12 shrink-0 border-retro border-line text-center py-1">
          <span className="text-label block text-secondary">{tile.weekday}</span>
          <span className="text-body font-semibold block text-primary">{tile.day}</span>
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="text-body font-semibold text-primary block">{title}</span>
        {sub && <span className="text-body-sm text-secondary block">{sub}</span>}
      </span>
      {label && <SquareLabel>{label}</SquareLabel>}
      <Icon name="chevron-right" />
    </Link>
  );
}
