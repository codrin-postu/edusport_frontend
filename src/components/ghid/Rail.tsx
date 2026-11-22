import Link from "@/components/ui/link";
import { cn } from "@/utils/cn";
import type { GhidGroup } from "@/lib/ghid/types";
import { RailGroup } from "./RailGroup";

const ITEM = "block py-2 pr-3 pl-8 text-(length:--portal-text-14) text-muted no-underline";

/** The contents list: one collapsible per group. The same list serves the side rail and the phone Cuprins. */
export function Rail({ groups, current }: { groups: GhidGroup[]; current: string }) {
  return (
    <nav aria-label="Cuprins" className="flex flex-col gap-1">
      {groups.map((g) => (
        <RailGroup key={g.title} title={g.title} count={g.pages.length} hasCurrent={g.pages.some((p) => p.slug === current)}>
          {g.pages.map((p) => (
            <Link
              key={p.slug}
              href={`/ghid/${p.slug}`}
              tone="plain"
              aria-current={p.slug === current ? "page" : undefined}
              className={cn(ITEM, p.slug === current && "bg-surface-subtle font-bold text-primary")}
            >
              {p.title}
            </Link>
          ))}
        </RailGroup>
      ))}
    </nav>
  );
}
