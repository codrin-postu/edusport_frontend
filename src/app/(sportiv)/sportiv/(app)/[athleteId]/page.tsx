"use client";

import { useParams } from "next/navigation";
import { HOME, INACTIVE } from "@/lib/portal/copy-sportiv";
import type { SportivHome } from "@/lib/portal/sportiv-types";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader, PageSub } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Section } from "@/app/_portal/ui/SectionHeading";
import { SessionRow } from "@/app/_portal/ui/SessionRow";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useSportiv } from "../_lib/use-sportiv";
import { AccountButton } from "../_ui/AccountSheet";

/** Acasă: the header and the next sessions. The cards (presences, abonament, last competition, promotion) arrive with the Acasă task. */
export default function HomePage() {
  const { athleteId } = useParams<{ athleteId: string }>();
  const home = useSportiv<SportivHome>(`athletes/${athleteId}/home`);
  if (home.state === "loading") return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (home.data === null) return <PageBody><LoadError onRetry={home.reload} /></PageBody>;
  const { athlete, level, upcoming } = home.data;
  const where = level ? [level.sectionName, level.location].filter(Boolean).join(", ") : "";
  const sub = athlete.inactive ? INACTIVE : [where, athlete.age === null ? "" : `${athlete.age} ani`].filter(Boolean).join(", ");
  return (
    <>
      <PageHeader brand noTile kicker={HOME.greeting(athlete.firstName)} title={level?.groupName ?? athlete.name} sub={sub} phoneEnd={<AccountButton />} />
      <PageBody>
        <PageSub>{sub}</PageSub>
        {upcoming.length > 0 && (
          <Section title={HOME.upcoming}>
            <ListCard>
              {upcoming.map((item) => <SessionRow key={`${item.date}${item.startTime}${item.title}`} item={item} />)}
            </ListCard>
          </Section>
        )}
      </PageBody>
    </>
  );
}
