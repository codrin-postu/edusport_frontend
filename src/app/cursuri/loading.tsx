import {
  CardGridSkeleton,
  HeroSkeleton,
} from "@/components/skeletons/PageSkeleton";
import Section from "@/components/ui/section";

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-raised flex flex-col">
      <HeroSkeleton
        title={["SCOALA", "DE", "PATINAJ"]}
        blurb="Cursuri de patinaj artistic pentru toate vârstele și nivelurile."
      />
      <div className="relative z-10 bg-surface-raised flex-1">
        <Section className="py-16 md:py-24">
          <div className="h-3 w-32 bg-surface-subtle mb-6 animate-pulse" />
          <div className="h-9 w-2/3 bg-surface-subtle mb-12 animate-pulse" />
          <CardGridSkeleton count={3} cols={3} />
        </Section>
        <Section className="bg-surface-subtle py-16 md:py-24">
          <div className="h-3 w-32 bg-surface-subtle mb-6 animate-pulse" />
          <div className="h-9 w-2/3 bg-surface-subtle mb-12 animate-pulse" />
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-surface-raised border border-line-subtle p-8 flex flex-col gap-4">
                <div className="h-6 w-1/2 bg-surface-subtle" />
                <div className="h-px bg-surface-subtle" />
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 w-full bg-surface-subtle" />
                ))}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
