import { HeroSkeleton } from "@/components/skeletons/PageSkeleton";
import Section from "@/components/ui/section";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeroSkeleton
        title={["REALIZARI"]}
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Realizări" },
        ]}
      />
      <div className="relative z-10 bg-white flex-1">
        <Section className="py-16 md:py-20">
          <div className="flex flex-col divide-y divide-gray-200 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid sm:grid-cols-[120px_1fr] gap-5 sm:gap-8 py-6 items-start"
              >
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
