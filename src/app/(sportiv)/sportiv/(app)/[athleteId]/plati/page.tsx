"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MONEY } from "@/lib/portal/copy-sportiv";
import type { SportivMoney, SportivPayments, SportivSubscriptions } from "@/lib/portal/sportiv-types";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Section, SectionHeading } from "@/app/_portal/ui/SectionHeading";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useAthletes } from "../../_lib/athletes-context";
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
  return (
    <>
      <PageHeader brand noTile title={MONEY.title} sub={current?.name} phoneEnd={<AccountButton />} />
      <PageBody>
        {money.state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
        {money.state === "error" && <LoadError onRetry={money.reload} />}
        {money.state === "ready" && m && (
          <Columns>
            <Column grow={1}>
              <LeftCard money={m} subscriptions={subscriptions} />
            </Column>
            <Column grow={2}>
              {payments.state === "error" && <LoadError onRetry={payments.reload} />}
              {payments.data && payments.data.total > 0 && (
                <Section title={MONEY.payments.title}>
                  <PaymentsList payments={payments.data} onPage={setPage} />
                </Section>
              )}
              {m.document && (
                <div className="flex flex-col gap-3">
                  <SectionHeading title={MONEY.documents} className="hidden portal:flex" />
                  <DocumentRow athleteId={athleteId} seasonLabel={m.document.seasonLabel} />
                </div>
              )}
            </Column>
          </Columns>
        )}
      </PageBody>
    </>
  );
}
