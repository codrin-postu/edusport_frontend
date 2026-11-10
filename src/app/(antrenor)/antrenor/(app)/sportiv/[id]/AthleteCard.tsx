"use client";

import { useSearchParams } from "next/navigation";
import { CARD, COMPETITIONS, GRUPE, GROUP } from "@/lib/portal/copy";
import { dayMonthShort, dayMonthYear, phoneLinks, pointsText, shortWhen } from "@/lib/portal/format";
import type { CoachAthleteCard } from "@/lib/portal/api-types";
import { usePortal } from "../../../_lib/use-portal";
import { ContactButton } from "@/app/_portal/ui/ContactButton";
import { CopyButton } from "@/app/_portal/ui/CopyButton";
import { KeyValueCard } from "@/app/_portal/ui/KeyValueCard";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { ListCard, PortalCard } from "@/app/_portal/ui/PortalCard";
import { PlaceBlock } from "@/app/_portal/ui/PlaceBlock";
import { PointsCell } from "@/app/_portal/ui/PointsCell";
import { Section } from "@/app/_portal/ui/SectionHeading";
import { Spinner } from "@/app/_portal/ui/Spinner";

type Comp = Extract<CoachAthleteCard["competitions"], { available: true }>;

/** Contact data: the backend sends `contact` only for an athlete of the coach's own groups, so a null here renders no Contact section at all. */
function ContactSection({ contact }: { contact: { name: string | null; phone: string | null } }) {
  const phone = contact.phone;
  if (!phone) return null;
  const links = phoneLinks(phone);
  return (
    <Section title={CARD.contact}>
      <PortalCard pad="card" className="gap-(--portal-gap-14)">
        <div className="flex flex-col gap-1">
          <span className="text-(length:--portal-text-13) text-muted">{CARD.parent}</span>
          {contact.name && <span className="text-(length:--portal-text-15) font-bold">{contact.name}</span>}
          <div className="flex items-center gap-1">
            <span className="font-display font-extrabold text-(length:--portal-text-24) tracking-(--portal-tracking-phone)">{phone}</span>
            <CopyButton text={phone} label={CARD.copy} copied={CARD.copied} failed={CARD.copyFailed} />
          </div>
        </div>
        {links && (
          <div className="grid grid-cols-2 gap-2">
            <ContactButton href={links.tel} icon="portal-phone" label={CARD.call} primary />
            <ContactButton href={links.wa} icon="portal-whatsapp" label={CARD.whatsapp} external />
          </div>
        )}
      </PortalCard>
    </Section>
  );
}

function CompetitionsSection({ competitions }: { competitions: CoachAthleteCard["competitions"] }) {
  if (!competitions.available) {
    return (
      <Section title={CARD.competitions}>
        <p className="text-(length:--portal-text-14) text-muted">{COMPETITIONS.unavailable}</p>
      </Section>
    );
  }
  if (competitions.count === 0) return null;
  const c: Comp = competitions;
  return (
    <Section title={CARD.competitions} link={{ href: "/concursuri", label: CARD.all }}>
      <PortalCard className="divide-y divide-line-subtle">
        <div className="flex items-center justify-between gap-3 bg-ice-light px-(--portal-card-pad) py-(--portal-gap-14)">
          <span className="flex flex-col gap-0.5">
            <span className="text-(length:--portal-text-12) text-muted">{CARD.category(c.season)}</span>
            {c.category && <span className="text-(length:--portal-text-15) font-extrabold">{c.category}</span>}
          </span>
          <span className="flex gap-4 text-right">
            <span className="flex flex-col">
              <b className="font-display font-extrabold text-(length:--portal-text-18)">{c.count}</b>
              <span className="text-(length:--portal-text-11) text-muted">{CARD.count}</span>
            </span>
            <span className="flex flex-col">
              <b className="font-display font-extrabold text-(length:--portal-text-18)">{c.podiums}</b>
              <span className="text-(length:--portal-text-11) text-muted">{CARD.podiums}</span>
            </span>
          </span>
        </div>
        {c.recent.slice(0, 3).map((r) => (
          <ListRow
            key={`${r.eventName}:${r.date}`}
            lead={<PlaceBlock placement={r.placement} />}
            title={r.eventName}
            sub={[r.date ? dayMonthYear(r.date) : null, r.location].filter((p): p is string => !!p).join(", ")}
            end={r.total === null ? null : <PointsCell points={pointsText(r.total)} />}
          />
        ))}
      </PortalCard>
    </Section>
  );
}

export function AthleteCard({ id }: { id: string }) {
  const card = usePortal<CoachAthleteCard>(`coach/athletes/${encodeURIComponent(id)}`);
  const from = useSearchParams().get("grupa");
  if (card.state === "loading") return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  const a = card.data;
  if (a === null) return <PageBody><LoadError onRetry={card.reload} /></PageBody>;
  const origin = a.groupRows.find((g) => g.groupId === from);
  const back = origin ? { href: `/grupe/${encodeURIComponent(origin.groupId)}`, label: origin.name } : { href: "/grupe", label: GRUPE.title };
  const sub = a.age === null ? (a.sectionName ?? undefined) : CARD.ageSection(GROUP.age(a.age), a.sectionName);
  const ab = a.abonament;
  const presenceRows = [
    { key: CARD.inSeason, value: CARD.presences(a.presence.season) },
    { key: CARD.lessons, value: CARD.lessonsValue(a.presence.lessons) },
    ...(a.presence.last ? [{ key: CARD.last, value: shortWhen(a.presence.last) }] : []),
    { key: CARD.missed, value: String(a.presence.missedThisMonth) },
  ];
  return (
    <>
      <PageHeader back={back} title={a.name} sub={sub} />
      <PageBody>
        <Columns>
          <Column grow={1} basis={380} className="contents portal:flex">
            {a.contact?.phone && <div className="order-1 portal:order-none"><ContactSection contact={a.contact} /></div>}
            <div className="order-2 portal:order-none">
              <Section title={CARD.presence}>
                <KeyValueCard rows={presenceRows} />
              </Section>
            </div>
            {a.groupRows.length > 0 && (
              <div className="order-4 portal:order-none">
                <Section title={CARD.groups}>
                  <ListCard>
                    {a.groupRows.map((g) => (
                      <ListRow key={g.groupId} href={`/grupe/${encodeURIComponent(g.groupId)}`} title={g.name} sub={g.program.join(", ")} />
                    ))}
                  </ListCard>
                </Section>
              </div>
            )}
          </Column>
          <Column grow={1} basis={380} className="contents portal:flex">
            <div className="order-3 portal:order-none"><CompetitionsSection competitions={a.competitions} /></div>
            {ab && (
              <div className="order-5 portal:order-none">
                <Section title={CARD.school}>
                  <KeyValueCard
                    rows={[
                      { key: CARD.abonament, value: ab.code ? `${ab.code}, ${CARD.session(ab.next, ab.slots)}` : CARD.session(ab.next, ab.slots) },
                      { key: CARD.validUntil, value: dayMonthShort(ab.validUntil) },
                      ...(ab.location ? [{ key: CARD.location, value: ab.location }] : []),
                    ]}
                  />
                </Section>
              </div>
            )}
          </Column>
        </Columns>
      </PageBody>
    </>
  );
}
