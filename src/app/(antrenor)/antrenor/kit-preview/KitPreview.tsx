"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Checkbox from "@/components/ui/checkbox";
import Dialog from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/form-field";
import Link from "@/components/ui/link";
import { Select } from "@/components/ui/select";
import type { NavItem } from "@/app/_portal/lib/nav";
import { CalendarLegend } from "@/app/_portal/ui/CalendarLegend";
import { CompetitionCard } from "@/app/_portal/ui/CompetitionCard";
import { ContactButton } from "@/app/_portal/ui/ContactButton";
import { CopyButton } from "@/app/_portal/ui/CopyButton";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { EndBlock } from "@/app/_portal/ui/EndBlock";
import { GoogleButton, OrLine } from "@/app/_portal/ui/AuthBits";
import { IndividualTag } from "@/app/_portal/ui/IndividualTag";
import { KeyValueCard } from "@/app/_portal/ui/KeyValueCard";
import { ListCard, PortalCard } from "@/app/_portal/ui/PortalCard";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { MotionDemo } from "./MotionDemo";
import { MonthGrid, type DayMarks } from "@/app/_portal/ui/MonthGrid";
import { MonthPicker } from "@/app/_portal/ui/MonthPicker";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { PortalLink } from "@/app/_portal/ui/PortalLink";
import { PortalShell } from "@/app/_portal/ui/PortalShell";
import { SaveBar } from "@/app/_portal/ui/SaveBar";
import { Section, SectionHeading } from "@/app/_portal/ui/SectionHeading";
import { Segmented } from "@/app/_portal/ui/Segmented";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { StatCard } from "@/app/_portal/ui/StatCard";
import { StatusBlock } from "@/app/_portal/ui/StatusBlock";
import { ChoiceRow } from "@/app/_portal/ui/ChoiceRow";
import { DaySquares } from "@/app/_portal/ui/DaySquares";
import { SummaryBand } from "@/app/_portal/ui/SummaryBand";
import type { DayKey } from "@/lib/portal/api-types";
import { KIT } from "@/lib/portal/copy-shared";
import { monthTitle, shiftMonth } from "@/lib/portal/month-grid";

const NAV: NavItem[] = [
  { href: "/kit-preview", label: "Azi", icon: "portal-azi" },
  { href: "/kit-preview#grupe", label: "Grupe", icon: "portal-grupe" },
  { href: "/kit-preview#concursuri", label: "Concursuri", icon: "portal-concursuri" },
  { href: "/kit-preview#istoric", label: "Istoric", icon: "portal-istoric" },
  { href: "/kit-preview#profil", label: "Profil", icon: "portal-profil" },
];
const ACCOUNT = { label: "Alina", href: "/kit-preview#profil" };

const MARKS: Record<string, DayMarks> = {
  "2026-11-03": ["grup", "grup"],
  "2026-11-04": ["grup"],
  "2026-11-09": ["individual"],
  "2026-11-10": ["grup", "grup"],
  "2026-11-12": ["grup", "grup", "individual"],
  "2026-11-19": ["grup", "anulata"],
};

const DURATIONS = [
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
];

function Kit({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section data-kit={name} className="flex flex-col gap-3">
      {children}
    </section>
  );
}

export function KitPreview() {
  const [dialog, setDialog] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [duration, setDuration] = useState("45");
  const [who, setWho] = useState<"all" | "mine">("all");
  const [month, setMonth] = useState("2026-11");
  const [selected, setSelected] = useState<string | null>("2026-11-12");
  const [checked, setChecked] = useState(true);
  const [unchecked, setUnchecked] = useState(false);
  const [days, setDays] = useState<DayKey[]>(["tue", "thu"]);
  const [choice, setChoice] = useState<"cancel" | "move" | "remove">("cancel");

  return (
    <PortalShell nav={NAV} account={ACCOUNT} brandHref="/kit-preview">
      <div data-kit="PageHeader">
        <PageHeader
          brand
          kicker="Bună, Alina"
          title="Azi"
          actions={<Button variant="secondary">Lecție individuală</Button>}
        />
      </div>
      <PageBody>
        <Columns>
          <Column grow={1}>
            <Kit name="Field">
              <Field label="E-mail" hint="Folosește adresa de cont.">
                <Input type="email" defaultValue="alina@example.invalid" />
              </Field>
            </Kit>
            <Kit name="Field, invalid">
              <Field label="Telefon" error="Numărul nu este valid.">
                <Input defaultValue="12" />
              </Field>
            </Kit>
            <Kit name="Select">
              <Field label="Durată">
                <Select value={duration} onValueChange={setDuration} options={DURATIONS} chevron="portal-chevron-down" />
              </Field>
            </Kit>
            <Kit name="Checkbox">
              <Checkbox label="Prezent" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
              <Checkbox label="Absent" checked={unchecked} onChange={(e) => setUnchecked(e.target.checked)} />
            </Kit>
            <Kit name="Button">
              <div className="flex flex-wrap gap-4">
                <Button>Salvează</Button>
                <Button variant="secondary">Renunță</Button>
              </div>
            </Kit>
            <Kit name="Link">
              <div>
                <Link href="/kit-preview#forgot">Am uitat parola</Link>
              </div>
              <div>
                <PortalLink href="/kit-preview#portal-link">Vezi tot</PortalLink>
              </div>
            </Kit>
            <Kit name="Card">
              <Card padding="md">Un card comun.</Card>
              <PortalCard pad="card" tone="subtle">Card de informații.</PortalCard>
            </Kit>
            <Kit name="Dialog">
              <div>
                <Button variant="secondary" onClick={() => setDialog(true)}>Deschide dialogul</Button>
              </div>
              <span className="text-label">ETICHETĂ</span>
              <Dialog open={dialog} onOpenChange={setDialog} title="Scoți sportivul din grupă?">
                <p className="mt-2 text-body-sm">Prezențele de până acum rămân.</p>
              </Dialog>
            </Kit>
            <Kit name="Sheet">
              <div>
                <Button variant="secondary" onClick={() => setSheet(true)}>Deschide foaia</Button>
              </div>
              <Sheet open={sheet} onOpenChange={setSheet} title="Alege durata" description="Durata lecției individuale.">
                <Button onClick={() => setSheet(false)}>Gata</Button>
              </Sheet>
            </Kit>
            <Kit name="GoogleButton">
              <GoogleButton href="/kit-preview#google" label="Continuă cu Google" />
              <OrLine text="sau" />
            </Kit>
            <Kit name="ContactButton">
              <ContactRow />
            </Kit>
            <Kit name="Segmented">
              <Segmented
                label="Sportivi"
                value={who}
                onChange={setWho}
                options={[
                  { value: "all", label: "Toți sportivii" },
                  { value: "mine", label: "Grupele mele" },
                ]}
              />
            </Kit>
            <Kit name="DaySquares">
              <DaySquares label="Zile" value={days} onChange={setDays} />
            </Kit>
            <Kit name="ChoiceRow">
              <div role="radiogroup" aria-label="Ce faci" className="flex flex-col gap-3">
                <ChoiceRow label="Anulează" sub="Părinții văd data anulată și nota." checked={choice === "cancel"} onSelect={() => setChoice("cancel")} />
                <ChoiceRow label="Mută" sub="Alegi altă zi sau oră pentru această dată." checked={choice === "move"} onSelect={() => setChoice("move")} />
                <ChoiceRow label="Șterge" sub="Data dispare din program, fără notă." checked={choice === "remove"} onSelect={() => setChoice("remove")} />
              </div>
            </Kit>
            <Kit name="SummaryBand">
              <SummaryBand>Marți și joi, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului.</SummaryBand>
            </Kit>
            <Kit name="Motion">
              <SectionHeading title="Mișcare" />
              <MotionDemo />
            </Kit>
            <Kit name="SaveBar">
              <SaveBar count="6 prezenți" action={<Button>Salvează</Button>} />
            </Kit>
          </Column>
          <Column grow={2}>
            <Kit name="StatCard">
              <StatCard big="4" label="antrenamente azi" side={[{ value: "1", label: "completat" }]} />
            </Kit>
            <Kit name="ListCard">
              <SectionHeading title="Antrenamente azi" link={{ href: "/kit-preview#calendar", label: "Calendar" }} />
              <ListCard>
                <ListRow
                  href="/kit-preview#r1"
                  lead={<DateBlock word="Mar" day="10" time="16:00" />}
                  title="Intermediari Bronze"
                  sub="grup, 14 copii, AFI Cotroceni"
                />
                <ListRow
                  href="/kit-preview#r2"
                  lead={<DateBlock word="Mar" day="10" time="17:30" />}
                  title="Inițiere A"
                  sub="grup, 8 prezenți"
                  end={<EndBlock kind="todo">Fă prezența</EndBlock>}
                />
                <ListRow
                  href="/kit-preview#r3"
                  lead={<DateBlock word="Mar" day="10" time="18:30" />}
                  title="Maria Ionescu"
                  sub={<><IndividualTag />45 min</>}
                  end={<StatusBlock kind="Individual" done />}
                />
                <ListRow
                  href="/kit-preview#r4"
                  lead={<DateBlock word="Mar" day="10" time="15:00" dim />}
                  title="Luca Stan"
                  sub="grup, 8 prezenți"
                  dim
                  end={<StatusBlock kind="Grup" done={false} />}
                />
              </ListCard>
            </Kit>
            <Kit name="KeyValueCard">
              <Section title="Școala">
                <KeyValueCard
                  rows={[
                    { key: "Abonament", value: "A-0124, Ședința 5/8" },
                    { key: "Valabil până la", value: "30 noi" },
                  ]}
                />
              </Section>
            </Kit>
            <Kit name="MonthGrid">
              <MonthPicker
                title={monthTitle(month)}
                onPrev={() => setMonth(shiftMonth(month, -1))}
                onNext={() => setMonth(shiftMonth(month, 1))}
                prevLabel="Luna anterioară"
                nextLabel="Luna următoare"
              />
              <MonthGrid month="2026-11" marks={MARKS} selected={selected} today="2026-11-10" onSelect={setSelected} label="Calendar" />
              <CalendarLegend />
            </Kit>
            <Kit name="CompetitionCard">
              <CompetitionCard
                defaultOpen
                month="Oct"
                day="26"
                name="Cupa României"
                place="Brașov"
                count={2}
                countLabel="sportivi"
                members={[
                  { href: "/kit-preview#m1", name: "Ioana Marin", category: "Adv. Novice Girls", placement: 2, points: "98,42" },
                  { href: "/kit-preview#m2", name: "Ana Popescu", category: "Basic Novice Girls", placement: null, points: "74,10" },
                ]}
              />
            </Kit>
          </Column>
        </Columns>
      </PageBody>
    </PortalShell>
  );
}

function ContactRow() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        <span className="font-display font-extrabold text-(length:--portal-text-22)">0722 123 456</span>
        <CopyButton text="0722 123 456" label="Copiază numărul" copied={KIT.copied} failed={KIT.copyFailed} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <ContactButton href="tel:+40722123456" icon="portal-phone" label="Sună" primary />
        <ContactButton href="https://wa.me/40722123456" icon="portal-whatsapp" label="WhatsApp" external />
      </div>
    </div>
  );
}
