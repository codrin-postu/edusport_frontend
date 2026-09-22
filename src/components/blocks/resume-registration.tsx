"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { loadDraft } from "@/app/inscrieri/_draft";

/**
 * Offers the way back into a registration that is already under way.
 *
 * The client's report: someone leaves the form to check the schedule, and on a
 * phone getting back is the hard part, which is where they drop out. Roughly
 * nine in ten registrations are started on a phone, so the return has to be on
 * the page they are reading, not behind the back button.
 *
 * Shown only when a saved draft exists, and never on the registration page
 * itself. Dismissing hides it for the rest of the visit, everywhere: they said
 * "not now" once and should not be asked again on every page. It comes back on
 * a later visit while the draft is still saved, and dismissing never touches
 * the saved answers.
 */

const DISMISS_KEY = "edusport.inscrieri.resume-dismissed";
const FORM_PATH = "/inscrieri";

const ResumeRegistration: React.FC = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pathname === FORM_PATH) {
      setShow(false);
      return;
    }
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      /* private mode: treat as not dismissed */
    }
    setShow(!dismissed && loadDraft() !== null);
  }, [pathname]);

  if (!show) return null;

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* the bar still goes away for this page load */
    }
    setShow(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] bg-navy px-4 py-3 text-retro-cream shadow-[0_-4px_16px_rgb(14_26_60_/_0.25)] md:inset-x-auto md:right-6 md:bottom-6 md:w-auto md:px-5 md:shadow-[6px_6px_0_rgb(14_26_60_/_0.3)]"
      role="region"
      aria-label="Înscriere în curs"
    >
      {/* One row on desktop. On a phone the label is too long to sit beside the
          text, and a full width target is easier to hit with a thumb. */}
      <div className="flex items-start gap-3 md:items-center">
        {/* Names the form, because the volunteer form saves too and
            "formularul" no longer says which. States the status rather than
            the saving: "salvat" can be read as "sent". */}
        <p className="flex-1 text-sm font-semibold leading-snug md:flex-none">
          Înscriere nefinalizată
        </p>
        <Link
          href={FORM_PATH}
          className="hidden bg-retro-cream px-4 py-2 text-sm font-bold text-navy transition-colors hover:bg-white md:inline-block"
        >
          Continuă înscrierea
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Închide"
          className="-mt-1 px-1 text-lg leading-none text-retro-cream/60 transition-colors hover:text-retro-cream md:mt-0"
        >
          ✕
        </button>
      </div>
      <Link
        href={FORM_PATH}
        className="mt-3 block bg-retro-cream py-2.5 text-center text-sm font-bold text-navy transition-colors hover:bg-white md:hidden"
      >
        Continuă înscrierea
      </Link>
    </div>
  );
};

export default ResumeRegistration;
