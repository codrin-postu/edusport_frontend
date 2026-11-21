import Link from "@/components/ui/link";
import type { GhidPage } from "@/lib/ghid/types";

const BTN = "flex min-w-0 flex-col border-card border-card-line bg-surface-raised px-4 py-3 text-primary no-underline";

export function PrevNext({ prev, next }: { prev?: GhidPage; next?: GhidPage }) {
  return (
    <nav className="flex max-w-(--portal-narrow-860) justify-between gap-3 border-t border-line-subtle pt-4">
      {prev && (
        <Link href={`/ghid/${prev.slug}`} tone="plain" className={BTN}>
          <small className="text-(length:--portal-text-12) text-muted">Înapoi</small>
          {prev.title}
        </Link>
      )}
      {next && (
        <Link href={`/ghid/${next.slug}`} tone="plain" className={`${BTN} ml-auto text-right`}>
          <small className="text-(length:--portal-text-12) text-muted">Înainte</small>
          {next.title}
        </Link>
      )}
    </nav>
  );
}
