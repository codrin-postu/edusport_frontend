"use client";

import { useParams } from "next/navigation";
import { SETARI } from "@/lib/portal/copy-sportiv";
import { dayMonthYear } from "@/lib/portal/format";
import type { SportivProfile } from "@/lib/portal/sportiv-types";
import { KeyValueCard } from "@/app/_portal/ui/KeyValueCard";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useSportiv } from "../../../_lib/use-sportiv";

const D = SETARI.athleteData;

/** Date sportiv: the athlete's data as the club holds it, read only. */
export default function AthleteDataPage() {
  const { athleteId } = useParams<{ athleteId: string }>();
  const profile = useSportiv<SportivProfile>(`athletes/${athleteId}/profile`);
  const p = profile.data;
  const rows = p
    ? [
        { key: D.name, value: p.name },
        { key: D.birthDate, value: p.birthDate ? dayMonthYear(p.birthDate) : "" },
        { key: D.age, value: p.age === null ? "" : String(p.age) },
        { key: D.contact, value: p.contactName ?? "" },
        { key: D.phone, value: p.phone ?? "" },
        { key: D.email, value: p.email ?? "" },
      ]
    : [];
  return (
    <>
      <PageHeader back={{ href: "/setari", label: SETARI.back }} title={D.title} sub={p?.name} />
      <PageBody narrow>
        {profile.state === "loading" && <div className="flex justify-center py-6"><Spinner /></div>}
        {profile.state === "error" && <LoadError onRetry={profile.reload} />}
        {p && (
          <>
            <KeyValueCard rows={rows} />
            <p className="text-(length:--portal-text-13) text-muted">{D.note}</p>
          </>
        )}
      </PageBody>
    </>
  );
}
