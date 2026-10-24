"use client";

import React, { useEffect, useRef } from "react";
import Button from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import { DOWNLOAD_LABELS, documentUrl, signingSentence, type DocumentKind } from "./_rules";

/** Phone only: a label that wraps to a second line gets room to breathe
 * instead of the fixed 48px height clipping it. Desktop is untouched. */
const PHONE_WRAP_FACE = "h-auto min-h-12 py-3 sm:h-12 sm:py-0";
/** Phone only: every button on the success screen goes full width. */
const PHONE_FULL_WIDTH = "w-full sm:w-auto";

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
  // The submit button is gone, so focus would fall to the page: announce the result instead.
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  const downloads = downloadToken ? documents : [];
  const count = downloads.length || expectedCount;
  const intro =
    downloads.length > 1
      ? "Puteți descărca de mai jos documentele completate de dvs."
      : "Puteți descărca de mai jos formularul completat de dvs.";
  return (
    // Phone only, while this screen is shown: the card around it (p-6) is
    // cancelled here and replaced with p-4, so the full-width buttons below
    // get more room. Desktop (sm+) is untouched, the card keeps its own padding.
    <div className="-m-6 p-4 sm:m-0 sm:p-0">
      <div className="flex flex-col items-center justify-center py-24 px-0 sm:px-8 text-center gap-4">
        <div className="w-16 h-16 bg-surface-dark flex items-center justify-center">
          <Icon name="circle-check" size="md" className="text-mustard" />
        </div>
        <h3 ref={headingRef} tabIndex={-1} className="text-title text-primary">
          Înscriere trimisă!
        </h3>
        <p className="text-body-sm text-secondary max-w-sm">
          Nr. înscriere <b className="text-primary">{registrationNumber}</b>.{" "}
          {downloads.length > 0 && `${intro} `}
          {signingSentence(count)}
        </p>
        {downloads.map((kind) => (
          <Button
            key={kind}
            face="black"
            href={documentUrl(apiBase, downloadToken ?? "", kind)}
            external
            className={PHONE_FULL_WIDTH}
            faceClassName={PHONE_WRAP_FACE}
          >
            {DOWNLOAD_LABELS[kind]}
          </Button>
        ))}
        {whatsappUrl && (
          <Button variant="secondary" href={whatsappUrl} external className={cn(PHONE_FULL_WIDTH, PHONE_WRAP_FACE)}>
            Canalul WhatsApp
          </Button>
        )}
        <button type="button" onClick={onRestart} className="text-body-sm mt-2 link text-accent">
          Fă o altă înscriere
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
