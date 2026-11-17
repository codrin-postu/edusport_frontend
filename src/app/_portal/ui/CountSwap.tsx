"use client";

import { useState } from "react";

/** A text that fades and slides in (portal motion tokens) each time it changes; the first render stays still. */
export function CountSwap({ children, className, ...rest }: { children: string; className?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  const [seen, setSeen] = useState({ text: children, n: 0 });
  if (seen.text !== children) setSeen({ text: children, n: seen.n + 1 });
  return (
    <span key={seen.n} {...rest} className={seen.n > 0 ? `${className ?? ""} inline-block animate-(--motion-count)` : className}>
      {children}
    </span>
  );
}
