import { useState } from "react";

/**
 * The last non-null `data` seen for this `scope`, so a paged list keeps showing its page (and its pager keeps the focus)
 * while the next page loads. A new scope (another athlete) starts empty.
 */
export function useKept<T>(data: T | null, scope: string): T | null {
  const [kept, setKept] = useState<{ scope: string; data: T } | null>(null);
  if (data !== null && (kept === null || kept.data !== data || kept.scope !== scope)) setKept({ scope, data });
  if (data !== null) return data;
  return kept !== null && kept.scope === scope ? kept.data : null;
}
