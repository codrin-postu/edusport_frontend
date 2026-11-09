import { cn } from "@/utils/cn";

const NARROW = {
  520: "max-w-(--portal-narrow-520)",
  560: "max-w-(--portal-narrow-560)",
  640: "max-w-(--portal-narrow-640)",
  860: "max-w-(--portal-narrow-860)",
} as const;

/** The page container: width, side padding and section gap from tokens. */
export function PageBody({ children, narrow }: { children: React.ReactNode; narrow?: keyof typeof NARROW }) {
  return (
    <main
      data-page-body
      className="mx-auto flex w-full max-w-(--portal-container) flex-col gap-(--portal-section-gap) px-(--portal-page-x) pt-(--portal-body-pt) pb-(--portal-body-pb)"
    >
      {narrow ? <div className={cn("flex w-full flex-col gap-(--portal-section-gap)", NARROW[narrow])}>{children}</div> : children}
    </main>
  );
}

/** Phone: one column. Desktop: wrapping flex row of Column. */
export function Columns({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-(--portal-cols-gap) portal:flex-row portal:flex-wrap portal:items-start">{children}</div>;
}

const GROW = { 1: "1", 2: "2" } as const;
const BASIS = {
  280: "portal:flex-[var(--grow)_1_var(--portal-basis-280)]",
  300: "portal:flex-[var(--grow)_1_var(--portal-basis-300)]",
  380: "portal:flex-[var(--grow)_1_var(--portal-basis-380)]",
  420: "portal:flex-[var(--grow)_1_var(--portal-basis-420)]",
  480: "portal:flex-[var(--grow)_1_var(--portal-basis-480)]",
} as const;

export function Column({ children, grow, basis }: { children: React.ReactNode; grow: 1 | 2; basis: keyof typeof BASIS }) {
  return (
    <div
      style={{ "--grow": GROW[grow] } as React.CSSProperties}
      className={cn("flex min-w-0 flex-col gap-(--portal-section-gap)", BASIS[basis])}
    >
      {children}
    </div>
  );
}
