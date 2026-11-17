"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { setSavedFlag } from "@/app/_portal/lib/saved-flag";
import { useFlash } from "@/app/_portal/lib/use-flash";
import { CountSwap } from "@/app/_portal/ui/CountSwap";
import { DateBlock } from "@/app/_portal/ui/DateBlock";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { Segmented } from "@/app/_portal/ui/Segmented";
import { Sheet } from "@/app/_portal/ui/Sheet";
import { StatusBlock } from "@/app/_portal/ui/StatusBlock";
import { useToast } from "@/app/_portal/ui/Toast";

const NAMES = ["Ioana Marin", "Ana Popescu", "Luca Stan"];

/** The "Mișcare" section of the kit preview: every portal hover and micro animation in one place. */
export function MotionDemo() {
  const toast = useToast();
  const { flashOf, flash } = useFlash();
  const [ticked, setTicked] = useState<string[]>(["Ioana Marin"]);
  const [sheet, setSheet] = useState(false);
  const [view, setView] = useState<"a" | "b">("a");
  const [saves, setSaves] = useState(0);
  const toggle = (name: string, on: boolean) => {
    flash(name);
    setTicked((t) => (on ? [...t, name] : t.filter((n) => n !== name)));
  };
  const save = () => {
    setSavedFlag("demo-session");
    setSaves((n) => n + 1);
    toast.show("Prezența a fost salvată.");
  };
  return (
    <div className="flex flex-col gap-4">
      <div data-motion="row">
        <ListCard>
          <ListRow href="/kit-preview#motion-row" lead={<DateBlock word="Mar" day="10" time="16:00" />} title="Rând cu legătură" sub="Trece cu mouse-ul peste rând" />
        </ListCard>
      </div>
      <div data-motion="buttons" className="flex flex-wrap gap-4">
        <Button>Apasă</Button>
        <Button variant="secondary">Apasă</Button>
        <Button disabled>Inactiv</Button>
      </div>
      <div data-motion="presence" className="flex flex-col">
        {NAMES.map((n) => (
          <div key={n} data-flash={flashOf(n)} className="flex items-center justify-between px-(--portal-row-pad-x)">
            <span className="text-(length:--portal-text-15) font-bold">{n}</span>
            <Checkbox label={<span className="sr-only">{n}</span>} checked={ticked.includes(n)} onChange={(e) => toggle(n, e.target.checked)} />
          </div>
        ))}
        <CountSwap data-motion-count className="font-display font-extrabold text-(length:--portal-text-20)">{`${ticked.length} prezenți`}</CountSwap>
      </div>
      <div data-motion="save" className="flex items-center gap-4">
        <div className="flex h-16 w-(--portal-typeblock-w)">
          <StatusBlock key={saves} kind="Grup" done={saves > 0} popId="demo-session" />
        </div>
        <Button variant="secondary" onClick={save}>Salvează</Button>
      </div>
      <div data-motion="sheet">
        <Button variant="secondary" onClick={() => setSheet(true)}>Arată foaia</Button>
        <Sheet open={sheet} onOpenChange={setSheet} title="Foaie" description="Apare cu o ușoară alunecare.">
          <Button onClick={() => setSheet(false)}>Gata</Button>
        </Sheet>
      </div>
      <div data-motion="segmented">
        <Segmented
          label="Vedere"
          value={view}
          onChange={setView}
          options={[
            { value: "a", label: "Prima" },
            { value: "b", label: "A doua" },
          ]}
        />
      </div>
    </div>
  );
}
