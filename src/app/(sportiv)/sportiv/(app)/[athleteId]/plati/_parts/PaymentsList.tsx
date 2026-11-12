import { MONEY } from "@/lib/portal/copy-sportiv";
import { shortDate } from "@/lib/portal/format";
import { ron } from "@/lib/portal/sportiv-format";
import type { SportivPayments } from "@/lib/portal/sportiv-types";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { Pager } from "@/app/_portal/ui/Pager";
import { ListCard } from "@/app/_portal/ui/PortalCard";

/** The payments, 20 to a page (the backend pages); the pager shows only when there is more than a page. */
export function PaymentsList({ payments, onPage }: { payments: SportivPayments; onPage: (page: number) => void }) {
  const from = (payments.page - 1) * payments.pageSize + 1;
  const to = from + payments.rows.length - 1;
  return (
    <>
      <ListCard>
        {payments.rows.map((r, i) => (
          <ListRow
            key={`${r.paidOn}:${r.what}:${i}`}
            title={r.what}
            sub={`${shortDate(r.paidOn)}, ${MONEY.payments.method[r.method]}`}
            end={<span className="flex shrink-0 items-center px-(--portal-row-pad-x) text-(length:--portal-row-title) font-bold">{ron(r.amount)}</span>}
          />
        ))}
      </ListCard>
      {payments.total > payments.pageSize && (
        <Pager
          from={from}
          to={to}
          total={payments.total}
          onPrev={() => onPage(payments.page - 1)}
          onNext={() => onPage(payments.page + 1)}
          prevDisabled={payments.page <= 1}
          nextDisabled={to >= payments.total}
        />
      )}
    </>
  );
}
