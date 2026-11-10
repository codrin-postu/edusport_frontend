import { cn } from "@/utils/cn";

/** The page container: width, side padding and section gap from tokens. `narrow` is a single-column page: centred at 640px on the desktop. */
export function PageBody({ children, narrow }: { children: React.ReactNode; narrow?: boolean | number }) {
  return (
    <main
      data-page-body
      className="mx-auto flex w-full max-w-(--portal-container) flex-col gap-(--portal-section-gap) px-(--portal-page-x) pt-(--portal-body-pt) pb-(--portal-body-pb)"
    >
      {narrow ? <div className="mx-auto flex w-full max-w-(--portal-narrow-640) flex-col gap-(--portal-section-gap)">{children}</div> : children}
    </main>
  );
}

/** Phone: one column. Desktop: a fixed 3:2 grid (main left, summary or side right). */
export function Columns({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-(--portal-cols-gap) portal:grid portal:grid-cols-(--portal-cols) portal:items-start", className)}>{children}</div>;
}

/** `grow` 2 is the main part (left on the desktop), 1 the side part (right). `className` lets a page flatten a column on the phone (`contents portal:flex`) to reorder its blocks with `order-*`. */
export function Column({ children, grow, className }: { children: React.ReactNode; grow?: 1 | 2; className?: string }) {
  return <div className={cn("flex min-w-0 flex-col gap-(--portal-section-gap)", grow === 2 && "portal:-order-1", className)}>{children}</div>;
}
