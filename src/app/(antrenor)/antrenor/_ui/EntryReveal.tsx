"use client";

import { useEffect, useState } from "react";
import { ENTRY_FLAG } from "../_lib/entry-transition";

const REVEAL_MS = 1000;

/** The incoming half of the sign-in transition: navy and mark over the app, then fading away. Renders nothing without the flag. */
export function EntryReveal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let flagged = false;
    try {
      flagged = window.sessionStorage.getItem(ENTRY_FLAG) !== null;
      window.sessionStorage.removeItem(ENTRY_FLAG);
    } catch {
      // Storage blocked: no reveal.
    }
    if (!flagged) return;
    setShow(true);
    const t = window.setTimeout(() => setShow(false), REVEAL_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (!show) return null;
  return (
    <div className="entry-overlay" data-entry-reveal="" aria-hidden="true">
      <div className="entry-mark">
        <p className="entry-mark-k">Clubul Sportiv</p>
        <p className="entry-mark-w">EDUSPORT</p>
      </div>
    </div>
  );
}
