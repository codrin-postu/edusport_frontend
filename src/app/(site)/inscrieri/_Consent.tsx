"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { FormQuestion } from "@/lib/strapi-forms";
import { splitOnLink } from "./_rules";

const LINK = "link font-semibold text-accent";

/**
 * A consent line as in the script form: "**Consimțământ GDPR:** Confirm citirea
 * documentului <Politica de Confidențialitate> și sunt de acord ...". Title,
 * text and link come from the CMS config. When an admin rewords the text so
 * it no longer contains the link label, the link follows the text.
 */
const ConsentCheckbox: React.FC<{
  question: FormQuestion;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ question, checked, onChange }) => {
  const label = question.label ?? "";
  const linkLabel = question.linkLabel ?? "";
  const parts = question.linkUrl ? splitOnLink(label, linkLabel) : null;
  const link = (text: string) => (
    <a href={question.linkUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
      {text}
    </a>
  );
  return (
    <Checkbox
      id={question.key}
      name={question.key}
      checked={checked}
      required={question.required === true}
      onChange={(e) => onChange(e.target.checked)}
      className="items-start"
      label={
        <span className="text-xs font-semibold text-primary">
          {question.title && <b>{question.title}:</b>} {parts ? <>{parts.before}{link(parts.link)}{parts.after}</> : label}
          {!parts && question.linkUrl && linkLabel && <> {link(linkLabel)}</>}
        </span>
      }
    />
  );
};

export default ConsentCheckbox;
