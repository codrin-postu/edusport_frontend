import { cn } from "@/utils/cn";

const KIND = {
  todo: "bg-surface-dark text-surface-raised",
  group: "bg-surface-dark text-surface-raised",
  done: "bg-ice-light text-primary",
  soft: "bg-ice-light text-primary",
  lesson: "bg-ice-blue text-surface-raised",
} as const;

/** The full-height block at the end of a row: an action ("Fă prezența"), a state or a group tag. */
export function EndBlock({ kind, children }: { kind: keyof typeof KIND; children: string }) {
  return (
    <span
      data-end-block
      className={cn(
        "flex w-(--portal-endblock-w) shrink-0 items-center justify-center p-(--portal-endblock-pad) text-center text-(length:--portal-text-11) font-extrabold leading-tight",
        KIND[kind],
      )}
    >
      {children}
    </span>
  );
}
