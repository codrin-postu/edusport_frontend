"use client";

import React from "react";
import Button from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DOWNLOAD_LABELS, documentUrl, signingSentence, type DocumentKind } from "./_rules";

/**
 * After submit (spec 3.4, mockup form-steps-v4 "După trimitere"): the
 * registration number, the signing sentence, a download per PDF while the
 * 24-hour token lasts, and the WhatsApp channel when Setări site has one.
 */
const SuccessScreen: React.FC<{
  registrationNumber: string;
  downloadToken: string | null;
  documents: DocumentKind[];
  /** Documents the registration has, for the sentence when the PDFs cannot be offered here. */
  expectedCount: number;
  apiBase: string;
  whatsappUrl?: string;
  onRestart: () => void;
}> = ({ registrationNumber, downloadToken, documents, expectedCount, apiBase, whatsappUrl, onRestart }) => {
  const downloads = downloadToken ? documents : [];
  const count = downloads.length || expectedCount;
  const intro =
    downloads.length > 1
      ? "Puteți descărca de mai jos documentele completate de dvs."
      : "Puteți descărca de mai jos formularul completat de dvs.";
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center gap-4">
      <div className="w-16 h-16 bg-surface-dark flex items-center justify-center">
        <Icon name="circle-check" size="md" className="text-mustard" />
      </div>
      <h3 className="text-title text-primary">Înscriere trimisă!</h3>
      <p className="text-body-sm text-secondary max-w-sm">
        Nr. înscriere <b className="text-primary">{registrationNumber}</b>.{" "}
        {downloads.length > 0 && `${intro} `}
        {signingSentence(count)}
      </p>
      {downloads.map((kind) => (
        <Button key={kind} face="black" href={documentUrl(apiBase, downloadToken ?? "", kind)} external>
          {DOWNLOAD_LABELS[kind]}
        </Button>
      ))}
      {whatsappUrl && (
        <Button variant="secondary" href={whatsappUrl} external>
          <Icon name="whatsapp" />
          Canalul WhatsApp
        </Button>
      )}
      <button type="button" onClick={onRestart} className="text-body-sm mt-2 link text-accent">
        Fă o altă înscriere
      </button>
    </div>
  );
};

export default SuccessScreen;
