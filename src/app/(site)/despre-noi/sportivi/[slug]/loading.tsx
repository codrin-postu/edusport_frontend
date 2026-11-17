import { LongformSkeleton } from "@/components/skeletons/PageSkeleton";

// Athlete page placeholder: the navy hero band with blank bars where the
// name and stats go. Without this file the parent /despre-noi loading screen
// (with its "Despre noi" title) would show while an athlete loads.
export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <section className="bg-surface-dark text-primary-on-dark">
        <div className="w-full max-w-content mx-auto gutter pt-12 pb-16 flex flex-col gap-6 animate-pulse">
          <div className="h-3 w-40 bg-surface-subtle-on-dark" />
          <div className="h-14 w-3/4 max-w-xl bg-surface-subtle-on-dark" />
          <div className="h-14 w-1/2 max-w-md bg-surface-subtle-on-dark" />
          <div className="flex gap-8 pt-4">
            <div className="h-10 w-24 bg-surface-subtle-on-dark" />
            <div className="h-10 w-24 bg-surface-subtle-on-dark" />
            <div className="h-10 w-24 bg-surface-subtle-on-dark" />
          </div>
        </div>
      </section>
      <div className="relative z-raised bg-surface flex-1">
        <LongformSkeleton />
      </div>
    </div>
  );
}
