"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MONEY } from "@/lib/portal/copy-sportiv";
import type { SportivMoney, SportivPayments, SportivSubscriptions } from "@/lib/portal/sportiv-types";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Section, SectionHeading } from "@/app/_portal/ui/SectionHeading";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useAthletes } from "../../_lib/athletes-context";
import { useKept } from "../../_lib/use-kept";
import { useSportiv } from "../../_lib/use-sportiv";
import { AccountButton } from "../../_ui/AccountSheet";
import { DocumentRow } from "./_parts/DocumentRow";
import { LeftCard } from "./_parts/LeftCard";
import { PaymentsList } from "./_parts/PaymentsList";

/** Abonament și plăți: three loads (money, payments by page, subscriptions); money is shown exactly as sent. */
export default function MoneyPage() {
  const { athleteId } = useParams<{ athleteId: string }>();
  const { current } = useAthletes();
  const [page, setPage] = useState(1);
  const money = useSportiv<SportivMoney>(`athletes/${athleteId}/money`);
  const payments = useSportiv<SportivPayments>(`athletes/${athleteId}/payments?page=${page}`);
  const subscriptions = useSportiv<SportivSubscriptions>(`athletes/${athleteId}/subscriptions`);
  const m = money.data;
  const paid = useKept(payments.data, athleteId);
  return (
    <>
      <PageHeader brand noTile title={MONEY.title} sub={current?.name} phoneEnd={<AccountButton />} />
      <PageBody>
        {money.state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
        {money.state === "error" && <LoadError onRetry={money.reload} />}
        {money.state === "ready" && m && (
          <>
            <Columns half className="portal:items-stretch">
              <LeftCard money={m} subscriptions={subscriptions} />
            </Columns>
            <Columns wide>
              <div className="flex min-w-0 flex-col gap-(--portal-section-gap)">
                {payments.state === "error" && <LoadError onRetry={payments.reload} />}
                {payments.state !== "error" && paid && paid.total > 0 && (
                  <Section title={MONEY.payments.title}>
                    <PaymentsList payments={paid} onPage={setPage} />
                  </Section>
                )}
              </div>
              {m.document && (
                <div className="flex min-w-0 flex-col gap-3">
                  <SectionHeading title={MONEY.documents} className="hidden portal:flex" />
                  <DocumentRow athleteId={athleteId} seasonLabel={m.document.seasonLabel} />
                </div>
              )}
            </Columns>
          </>
        )}
      </PageBody>
    </>
  );
}
