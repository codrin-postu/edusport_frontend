import Icon from "@/components/ui/icon";
import { KIT } from "@/lib/portal/copy-shared";
import { cn } from "@/utils/cn";

/** Type and state of a session: blue with a check when completed, navy with a clipboard when not. */
export function StatusBlock({ kind, done }: { kind: "Grup" | "Individual"; done: boolean }) {
  return (
    <span
      role="img"
      aria-label={`${kind}, ${done ? KIT.completat : KIT.necompletat}`}
      data-status-block
      className={cn("flex w-(--portal-typeblock-w) shrink-0 items-center justify-center text-white", done ? "bg-ice-blue" : "bg-surface-dark")}
    >
      <Icon name={done ? "portal-status-done" : "portal-status-todo"} size="26" />
    </span>
  );
}
