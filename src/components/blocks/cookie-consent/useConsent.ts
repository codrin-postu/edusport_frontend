"use client";

import { useEffect, useState } from "react";
import * as CC from "vanilla-cookieconsent";

/**
 * Tracks whether a consent category is currently accepted.
 *
 * Starts false so nothing loads before a decision exists, then re-reads on the
 * library's own events. `cc:onConsent` fires on first choice and on every page
 * load once a decision is stored; `cc:onChange` fires when the visitor edits
 * their choice later, which is how a withdrawal takes effect without a reload.
 */
export function useConsent(category: string): boolean {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const read = () => setAccepted(CC.acceptedCategory(category));
    read();
    window.addEventListener("cc:onConsent", read);
    window.addEventListener("cc:onChange", read);
    return () => {
      window.removeEventListener("cc:onConsent", read);
      window.removeEventListener("cc:onChange", read);
    };
  }, [category]);

  return accepted;
}
