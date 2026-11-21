import Link from "@/components/ui/link";
import { cn } from "@/utils/cn";
import type { GhidGroup } from "@/lib/ghid/types";

const ITEM = "block px-3 py-2 text-(length:--portal-text-14) text-primary no-underline";

/** The contents list. Topic entries link to their first page; a topic with one page has no sub-list. */
export function Rail({ groups, current }: { groups: GhidGroup[]; current: string }) {
  return (
    <nav aria-label="Cuprins" className="flex flex-col gap-1">
      {groups.map((g) => (
        <div key={g.title} className="flex flex-col gap-1">
          <span className="mx-3 mt-4 mb-1 text-(length:--portal-text-11) font-bold uppercase tracking-(--portal-tracking-month) text-muted">{g.title}</span>
          {g.topics.map((t) => {
            const first = t.pages[0];
            const multi = t.pages.length > 1;
            return (
              <div key={t.title} className="flex flex-col gap-1">
                <Link
                  href={`/ghid/${first.slug}`}
                  tone="plain"
                  aria-current={!multi && first.slug === current ? "page" : undefined}
                  className={cn(ITEM, !multi && first.slug === current && "bg-surface-subtle font-bold")}
                >
                  {t.title}
                </Link>
                {multi && t.pages.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/ghid/${p.slug}`}
                    tone="plain"
                    aria-current={p.slug === current ? "page" : undefined}
                    className={cn(ITEM, "pl-6 text-muted", p.slug === current && "bg-surface-subtle font-bold text-primary")}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
