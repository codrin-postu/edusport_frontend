import {
  CardGridSkeleton,
  HeroSkeleton,
} from "@/components/skeletons/PageSkeleton";
import Section from "@/components/ui/section";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeroSkeleton
        title={["SCOALA", "DE", "PATINAJ"]}
        blurb="Cursuri de patinaj artistic pentru toate vârstele și nivelurile."
      />
      <div className="relative z-10 bg-white flex-1">
        <Section className="py-16 md:py-20">
          <div className="h-3 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="h-9 w-2/3 bg-gray-200 rounded mb-12 animate-pulse" />
          <CardGridSkeleton count={3} cols={3} />
        </Section>
        <Section className="bg-gray-50 py-16 md:py-20">
          <div className="h-3 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="h-9 w-2/3 bg-gray-200 rounded mb-12 animate-pulse" />
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-4">
                <div className="h-6 w-1/2 bg-gray-200 rounded" />
                <div className="h-px bg-gray-100" />
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 w-full bg-gray-200 rounded" />
                ))}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
