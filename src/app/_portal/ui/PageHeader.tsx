import Link from "@/components/ui/link";
import { BrandBlock } from "@/app/_portal/ui/BrandBlock";

type PageHeaderProps = {
  title: string;
  back?: { href: string; label: string };
  kicker?: string;
  sub?: string;
  brand?: boolean;
  aside?: React.ReactNode;
  actions?: React.ReactNode;
};

/**
 * One header for both layouts. Phone: plain, brand row or back link above the title block.
 * From `portal:` it is the ice top band (the sidebar carries the brand).
 */
export function PageHeader({ title, back, kicker, sub, brand, aside, actions }: PageHeaderProps) {
  return (
    <header data-page-header className="portal:sticky portal:top-0 portal:z-sticky portal:border-b portal:border-line-subtle portal:bg-ice-light">
      <div className="mx-auto flex w-full max-w-(--portal-container) flex-col gap-(--portal-head-gap) px-(--portal-page-x) pt-(--portal-head-pt) pb-(--portal-head-pb) portal:gap-2 portal:py-(--portal-band-pad-y)">
        {back ? (
          <Link
            href={back.href}
            tone="plain"
            className="inline-flex min-h-(--portal-tap) items-center gap-1 self-start text-(length:--portal-text-15) font-bold text-primary no-underline"
          >
            ‹ {back.label}
          </Link>
        ) : (
          brand && (
            <div className="flex min-h-(--portal-tap) items-center justify-between portal:hidden">
              <BrandBlock href="/" />
            </div>
          )
        )}
        <div className="flex flex-wrap items-end justify-between gap-3 portal:gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            {kicker && <span className="text-(length:--portal-kicker-size) text-muted">{kicker}</span>}
            <h1 className="font-display font-extrabold text-(length:--portal-h1-size) leading-(--portal-leading-h1)">{title}</h1>
            {sub && <span className="text-(length:--portal-sub-size) text-muted">{sub}</span>}
          </div>
          {(aside || actions) && (
            <div className="flex items-center gap-(--portal-actions-gap)">
              {aside}
              {actions && <div className="hidden items-center gap-3 portal:flex">{actions}</div>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
