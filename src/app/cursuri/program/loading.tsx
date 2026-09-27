import {
  HeroSkeleton,
} from "@/components/skeletons/PageSkeleton";
import Section from "@/components/ui/section";

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-raised flex flex-col">
      <HeroSkeleton
        title={["PROGRAM"]}
        breadcrumb={[
          { label: "Cursuri", href: "/cursuri" },
          { label: "Program" },
        ]}
      />
      <div className="relative z-raised bg-surface-raised flex-1">
        <Section className="section">
          <div className="h-3 w-40 bg-surface-subtle mb-3 animate-pulse" />
          <div className="h-9 w-2/3 bg-surface-subtle mb-3 animate-pulse" />
          <div className="h-3 w-1/2 bg-surface-subtle mb-12 animate-pulse" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-raised border border-line-subtle p-6 flex flex-col gap-4"
              >
                <div className="h-5 w-3/4 bg-surface-subtle" />
                <div className="h-px bg-surface-subtle" />
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-3 w-full bg-surface-subtle" />
                ))}
              </div>
            ))}
          </div>
        </Section>
        <Section className="bg-surface-subtle section-compact">
          <div className="h-3 w-32 bg-surface-subtle mb-3 animate-pulse" />
          <div className="h-9 w-1/3 bg-surface-subtle mb-12 animate-pulse" />
          <div className="bg-surface-raised border border-line-subtle p-6 animate-pulse">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="aspect-square bg-surface-subtle" />
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
