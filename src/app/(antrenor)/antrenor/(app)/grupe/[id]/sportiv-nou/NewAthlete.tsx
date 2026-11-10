"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { AlertLine } from "@/app/_portal/ui/AuthBits";
import DatePickerField from "@/components/ui/date-picker-field";
import { Input } from "@/components/ui/form-field";
import { ADD_ATHLETE, NEW_ATHLETE } from "@/lib/portal/copy";
import type { CoachGroupPage, CoachNewAthleteBody } from "@/lib/portal/api-types";
import { portalApi } from "@/app/_portal/lib/api";
import { useNoAccess, usePortal } from "../../../../_lib/use-portal";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";

function Field({ label, optional, children }: { label: string; optional?: boolean; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-field-label text-label-ink mb-(--field-gap) block">
        {label}
        {optional && <span className="ml-2 font-normal">({NEW_ATHLETE.optional})</span>}
      </label>
      {children(id)}
    </div>
  );
}

export function NewAthlete({ id }: { id: string }) {
  const router = useRouter();
  const toast = useToast();
  const noAccess = useNoAccess();
  const group = usePortal<CoachGroupPage>(`coach/groups/${encodeURIComponent(id)}`);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [parent, setParent] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (group.state === "loading") return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
  if (group.data === null) return <PageBody><LoadError /></PageBody>;
  const back = `/grupe/${encodeURIComponent(id)}`;

  async function submit() {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const body: CoachNewAthleteBody = { groupId: id, name: name.trim() };
    // The backend reads the picked birth date as ZZ.LL.AAAA only; the picker holds YYYY-MM-DD.
    if (birthDate) body.birthDate = birthDate.split("-").reverse().join(".");
    if (parent.trim()) body.contactName = parent.trim();
    if (phone.trim()) body.phone = phone.trim();
    if (email.trim()) body.email = email.trim();
    const r = await portalApi<{ athleteId: string; toast: string }>("POST", "coach/athletes", body);
    if (noAccess(r)) {
      setBusy(false);
      return;
    }
    if (!r.ok) {
      setBusy(false);
      setMessage(r.message);
      return;
    }
    // busy stays true on success: the button must not come back before the route changes.
    toast.show(r.data.toast);
    router.push(back);
  }

  return (
    <>
      <PageHeader back={{ href: `${back}/adauga`, label: ADD_ATHLETE.title(group.data.name) }} title={NEW_ATHLETE.title} />
      <PageBody narrow={520}>
        <Field label={NEW_ATHLETE.name}>
          {(fid) => <Input id={fid} value={name} autoComplete="off" onChange={(e) => setName(e.target.value)} surface="card" />}
        </Field>
        <DatePickerField id="new-birth" label={`${NEW_ATHLETE.birthDate} (${NEW_ATHLETE.optional})`} value={birthDate} onChange={setBirthDate} variant="card" />
        <Field label={NEW_ATHLETE.parent} optional>
          {(fid) => <Input id={fid} value={parent} autoComplete="off" onChange={(e) => setParent(e.target.value)} surface="card" />}
        </Field>
        <Field label={NEW_ATHLETE.phone} optional>
          {(fid) => <Input id={fid} type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} surface="card" />}
        </Field>
        <Field label={NEW_ATHLETE.email} optional>
          {(fid) => <Input id={fid} type="email" value={email} onChange={(e) => setEmail(e.target.value)} surface="card" />}
        </Field>
        <AlertLine message={message} reserve />
        <Button onClick={() => void submit()} disabled={busy || name.trim() === ""} className="w-full">{NEW_ATHLETE.submit(group.data.name)}</Button>
      </PageBody>
    </>
  );
}
