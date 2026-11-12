"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { INACTIVE, HOME } from "@/lib/portal/copy-sportiv";
import type { SportivHome } from "@/lib/portal/sportiv-types";
import { portalApi } from "@/app/_portal/lib/api";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader, PageSub } from "@/app/_portal/ui/PageHeader";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useSportiv } from "../_lib/use-sportiv";
import { AccountButton } from "../_ui/AccountSheet";
import { AbonamentCard } from "./_parts/AbonamentCard";
import { LastCompetitionCard } from "./_parts/LastCompetitionCard";
import { PresenceCard } from "./_parts/PresenceCard";
import { PromotionDialog } from "./_parts/PromotionDialog";
import { UpcomingList } from "./_parts/UpcomingList";

/** Acasă: presences, the last competition (performance athletes), the next sessions and the abonament; a promotion shows once on top. */
export default function HomePage() {
  const { athleteId } = useParams<{ athleteId: string }>();
  const home = useSportiv<SportivHome>(`athletes/${athleteId}/home`);
  const [seen, setSeen] = useState<string | null>(null);
  if (home.state === "loading") return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (home.data === null) return <PageBody><LoadError onRetry={home.reload} /></PageBody>;
  const { athlete, level, category, presences, upcoming, abonament, lastCompetition, promotion } = home.data;
  const where = [category ?? level?.sectionName, level?.location].filter(Boolean).join(", ");
  const sub = athlete.inactive ? INACTIVE : [where, athlete.age === null ? "" : `${athlete.age} ani`].filter(Boolean).join(", ");
  const promoKey = promotion ? `${athleteId}:${promotion.from}:${promotion.to}` : null;
  const markSeen = () => {
    setSeen(promoKey);
    void portalApi("POST", `sportiv/athletes/${athleteId}/promotion/seen`);
  };
  return (
    <>
      <PageHeader brand noTile kicker={HOME.greeting(athlete.firstName)} title={level?.groupName ?? athlete.name} sub={sub} phoneEnd={<AccountButton />} />
      <PageBody>
        <PageSub>{sub}</PageSub>
        <Columns>
          <Column grow={2} className="contents portal:flex">
            <div className="order-1 portal:order-none"><PresenceCard total={presences.total} months={presences.months} /></div>
            {lastCompetition !== null && <div className="order-2 portal:order-none"><LastCompetitionCard last={lastCompetition} allHref={`/${athleteId}/concursuri`} /></div>}
            {abonament !== null && <div className="order-4 portal:order-none"><AbonamentCard abonament={abonament} detailsHref={`/${athleteId}/plati`} /></div>}
          </Column>
          <Column grow={1} className="contents portal:flex">
            {upcoming.length > 0 && <div className="order-3 portal:order-none"><UpcomingList items={upcoming} calendarHref={`/${athleteId}/calendar`} /></div>}
          </Column>
        </Columns>
      </PageBody>
      {promotion !== null && promoKey !== seen && (
        <PromotionDialog key={promoKey} from={promotion.from} to={promotion.to} firstName={athlete.firstName} onDone={markSeen} />
      )}
    </>
  );
}
