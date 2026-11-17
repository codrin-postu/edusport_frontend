import Icon from "@/components/ui/icon";
import { cn } from "@/utils/cn";

/** The header of every collapsible: the whole header is one button, a chevron sits at the right edge (down closed, up open). */
export function CollapseHeader({ open, onToggle, children, className, moreRow }: {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  /** Marks the header as a target for programmatic focus after "Arată mai multe". */
  moreRow?: boolean;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      {...(moreRow ? { "data-more-row": "" } : {})}
      className={cn(
        "group flex w-full min-h-(--portal-row-min-h) cursor-pointer items-stretch text-left text-primary outline-none transition-colors duration-(--motion-fast) ease-(--motion-ease) hover:bg-row-hover active:bg-row-press focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
        className,
      )}
    >
      {children}
      <span className="flex w-(--portal-trail-w) shrink-0 items-center justify-center text-secondary">
        <Icon name="portal-chevron-down" size="sm" className={cn("transition-transform duration-(--motion-fast) ease-(--motion-ease)", open && "rotate-180")} />
      </span>
    </button>
  );
}
