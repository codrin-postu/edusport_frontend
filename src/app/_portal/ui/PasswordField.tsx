"use client";

import { useId, useState } from "react";
import { EYE } from "@/lib/portal/copy";
import { Input } from "@/components/ui/form-field";
import IconButton from "@/components/ui/icon-button";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
};

export function PasswordField({ label, value, onChange, autoComplete }: PasswordFieldProps) {
  const id = useId();
  const [shown, setShown] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="text-label text-secondary block mb-2">{label}</label>
      <div className="relative">
        <Input
          id={id}
          type={shown ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className="pr-12"
        />
        <IconButton
          icon={shown ? "eye-off" : "eye"}
          label={shown ? EYE.hide : EYE.show}
          onClick={() => setShown((s) => !s)}
          className="absolute top-1 right-1"
        />
      </div>
    </div>
  );
}
