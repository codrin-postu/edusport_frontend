import { STATES } from "@/lib/portal/copy";

export function LoadError() {
  return <p className="text-body-sm text-secondary py-6">{STATES.loadFailed}</p>;
}
