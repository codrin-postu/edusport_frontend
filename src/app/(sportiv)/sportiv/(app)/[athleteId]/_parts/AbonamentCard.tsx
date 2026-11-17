import { HOME } from "@/lib/portal/copy-sportiv";
import { shortDate } from "@/lib/portal/format";
import type { AbonamentShort } from "@/lib/portal/sportiv-types";
import Link from "@/components/ui/link";
import { PortalCard } from "@/app/_portal/ui/PortalCard";

/** The running abonament: which session is next, its code and last day, and the link to the payments page. */
export function AbonamentCard({ abonament, detailsHref }: { abonament: AbonamentShort; detailsHref: string }) {
  const until = HOME.abonament.validUntil(shortDate(abonament.validUntil));
  return (
    <PortalCard as="section" tone="subtle" pad="card" className="flex-row items-center justify-between gap-3">
      <div className="flex flex-col gap-1">
        <span className="font-display font-extrabold text-(length:--portal-text-26) leading-none">{HOME.abonament.session(abonament.next, abonament.slots)}</span>
        <span className="text-(length:--portal-sub-size) text-muted">{abonament.code ? `${abonament.code}, ${until}` : until}</span>
      </div>
      <Link href={detailsHref} tone="plain" className="inline-flex min-h-(--portal-tap) items-center whitespace-nowrap text-(length:--portal-text-14) font-bold text-primary no-underline">
        {HOME.abonament.details}
      </Link>
    </PortalCard>
  );
}
