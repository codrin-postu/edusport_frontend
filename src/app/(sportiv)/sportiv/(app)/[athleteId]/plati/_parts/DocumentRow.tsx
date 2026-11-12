import { MONEY } from "@/lib/portal/copy-sportiv";
import { PortalCard } from "@/app/_portal/ui/PortalCard";

/** The registration form PDF of the athlete in the URL (the BFF refuses any other id). */
export function DocumentRow({ athleteId, seasonLabel }: { athleteId: string; seasonLabel: string }) {
  return (
    <PortalCard as="section" pad="card" className="flex-row items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-(length:--portal-row-title) font-bold">{MONEY.document.title(seasonLabel)}</span>
        <span className="text-(length:--portal-row-sub) text-muted">{MONEY.document.pdf}</span>
      </div>
      <a
        href={`/api/portal/sportiv/athletes/${athleteId}/documents/acord`}
        download
        className="inline-flex min-h-(--portal-tap) items-center text-(length:--portal-text-14) font-bold text-primary no-underline"
      >
        {MONEY.document.download}
      </a>
    </PortalCard>
  );
}
