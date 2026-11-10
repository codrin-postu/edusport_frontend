import Button from "@/components/ui/button";
import { STATES } from "@/lib/portal/copy";

export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4 py-6">
      <p className="text-body-sm text-secondary">{STATES.loadFailed}</p>
      <Button variant="secondary" onClick={onRetry}>{STATES.retry}</Button>
    </div>
  );
}
