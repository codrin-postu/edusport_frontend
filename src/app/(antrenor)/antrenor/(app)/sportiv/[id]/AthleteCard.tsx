"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import IconButton from "@/components/ui/icon-button";
import { A11Y, CARD, GROUP } from "@/lib/portal/copy";
import type { CoachAthleteCard } from "@/lib/portal/api-types";
import { usePortal } from "../../../_lib/use-portal";
import { LoadError } from "../../../_ui/LoadError";
import { Spinner } from "../../../_ui/Spinner";

export function AthleteCard({ id }: { id: string }) {
  const router = useRouter();
  const card = usePortal<CoachAthleteCard>(`coach/athletes/${encodeURIComponent(id)}`);
  if (card.state === "loading") return <div className="py-6 flex justify-center"><Spinner /></div>;
  const a = card.data;
  if (a === null) return <LoadError />;
  const phone = a.contact?.phone ?? null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <IconButton icon="chevron-left" label={A11Y.back} onClick={() => router.back()} className="-ml-3" />
        <h1 className="text-title text-primary">{a.name}</h1>
      </div>
      {a.age !== null && <p className="text-body-sm text-secondary mb-6">{GROUP.age(a.age)}</p>}
      <dl className="flex flex-col gap-4 mb-6">
        <div>
          <dt className="text-label text-secondary">{CARD.groups}</dt>
          <dd className="text-body text-primary">{a.groups.join(", ")}</dd>
        </div>
        {a.school && (
          <div>
            <dt className="text-label text-secondary">{CARD.school}</dt>
            <dd className="text-body text-primary">{a.school}</dd>
          </div>
        )}
      </dl>
      {a.contact && (
        <Card surface="raised" shadow="sm" padding="sm">
          <h2 className="text-label text-secondary mb-2">{CARD.contact}</h2>
          {a.contact.name && <p className="text-body text-primary">{a.contact.name}</p>}
          {phone && (
            <>
              <p className="text-body text-primary mb-4">{phone}</p>
              <Button href={`tel:${phone.replace(/\s+/g, "")}`}>{CARD.call}</Button>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
