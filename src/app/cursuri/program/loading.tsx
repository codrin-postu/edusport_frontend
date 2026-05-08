import {
  HeroSkeleton,
} from "@/components/skeletons/PageSkeleton";
import Section from "@/components/ui/section";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeroSkeleton
        title={["PROGRAM"]}
        breadcrumb={[
          { label: "Cursuri", href: "/cursuri" },
          { label: "Program" },
        ]}
      />
      <div className="relative z-10 bg-white flex-1">
        <Section className="py-16 md:py-20">
          <div className="h-3 w-40 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="h-9 w-2/3 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="h-3 w-1/2 bg-gray-200 rounded mb-10 animate-pulse" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-px bg-gray-100" />
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-3 w-full bg-gray-200 rounded" />
                ))}
              </div>
            ))}
          </div>
        </Section>
        <Section className="bg-gray-50 py-12 md:py-16">
          <div className="h-3 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="h-9 w-1/3 bg-gray-200 rounded mb-10 animate-pulse" />
          <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
