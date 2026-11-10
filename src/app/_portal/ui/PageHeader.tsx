import Link from "@/components/ui/link";
import { BrandBlock } from "@/app/_portal/ui/BrandBlock";
import { NowTile } from "@/app/_portal/ui/NowTile";
import { HeaderHeight } from "@/app/_portal/ui/HeaderHeight";
import { cn } from "@/utils/cn";
import { PhoneBar } from "@/app/_portal/ui/PhoneBar";

type PageHeaderProps = {
  title: string;
  back?: { href: string; label: string };
  kicker?: string;
  sub?: string;
  brand?: boolean;
  /** Show the now tile on the phone too (Azi). It is always shown from the desktop breakpoint. */
  tileOnPhone?: boolean;
  actions?: React.ReactNode;
};

/**
 * One header for both layouts. Phone: plain, brand row or back link above the title block.
 * From `portal:` it is the ice top band (the sidebar carries the brand).
 */
export function PageHeader({ title, back, kicker, sub, brand, tileOnPhone, actions }: PageHeaderProps) {
  return (
    <>
    <PhoneBar title={title} back={back} brand={brand} />
    <header data-page-header className="portal:sticky portal:top-0 portal:z-sticky portal:border-b portal:border-line-subtle portal:bg-ice-light">
      <HeaderHeight />
      {/* Desktop: a fixed-height band. Grid rows: the reserved back/kicker line, then the title; the tile spans both rows, centred. */}
      <div className="mx-auto flex w-full max-w-(--portal-container) flex-col gap-(--portal-head-gap) px-(--portal-page-x) pt-(--portal-head-pt) pb-(--portal-head-pb) portal:grid portal:h-(--portal-band-h) portal:grid-cols-[auto_minmax(0,1fr)_auto] portal:grid-rows-[var(--portal-headline-h)_auto] portal:content-center portal:items-center portal:gap-x-0 portal:gap-y-(--portal-headline-gap) portal:py-0">
        {back ? (
          <Link
            href={back.href}
            tone="plain"
            className="inline-flex min-h-(--portal-tap) items-center gap-1 self-start text-(length:--portal-text-15) font-bold text-primary no-underline portal:col-start-1 portal:row-start-1 portal:min-h-0 portal:self-center"
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
        <div className="flex flex-wrap items-end justify-between gap-3 portal:contents">
          <div className="flex min-w-0 flex-col gap-2 portal:contents">
            {kicker && (
              <span className={cn("text-(length:--portal-kicker-size) text-muted portal:row-start-1 portal:truncate", back ? "portal:col-start-2 portal:ml-(--portal-headline-gap-x)" : "portal:col-span-2 portal:col-start-1")}>
                {kicker}
              </span>
            )}
            <h1 className="font-display font-extrabold text-(length:--portal-h1-size) leading-(--portal-leading-h1) portal:col-span-2 portal:col-start-1 portal:row-start-2 portal:truncate">{title}</h1>
            {sub && <span className="text-(length:--portal-sub-size) text-muted portal:hidden">{sub}</span>}
          </div>
          <div data-header-end className="flex items-stretch gap-(--portal-actions-gap) portal:col-start-3 portal:row-span-2 portal:row-start-1 portal:ml-4 portal:items-center">
            {/* Actions take the height of the now tile, so they line up as one row; the tile is the far right item on every page. */}
            {actions && <div className="hidden h-(--portal-nowtile-h) items-stretch gap-3 portal:flex">{actions}</div>}
            <NowTile className={tileOnPhone ? undefined : "hidden portal:flex"} />
          </div>
        </div>
      </div>
    </header>
    </>
  );
}

/** The desktop home of a page's sub line: first thing in the page body. The phone shows the sub line in the header instead. */
export function PageSub({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="hidden text-(length:--portal-sub-size) text-muted portal:block">{children}</p>;
}
