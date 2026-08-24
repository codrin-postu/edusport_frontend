import PageHeroSection from "@/components/blocks/page-hero-section";

// Streamed by Next.js while page.tsx awaits Strapi. Mirrors the layout shell
// so the footer doesn't snap up against the hero before content arrives.

function CurrentEventSkeleton() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-3 w-40 bg-gray-200 rounded mb-10 animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center animate-pulse">
          <div className="relative aspect-[16/9] rounded-2xl bg-gray-200" />
          <div className="flex flex-col gap-5">
            <div className="h-9 w-4/5 bg-gray-200 rounded" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-56 bg-gray-200 rounded" />
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-11/12 bg-gray-200 rounded" />
              <div className="h-3 w-2/3 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PastEventsSkeleton() {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-3 w-44 bg-gray-200 rounded mb-10 animate-pulse" />
        <div className="flex flex-col divide-y divide-gray-200 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid sm:grid-cols-[128px_1fr] gap-5 sm:gap-8 py-7 items-start"
            >
              <div className="relative w-full sm:w-32 aspect-video sm:aspect-square rounded-xl bg-gray-200" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-32 bg-gray-200 rounded" />
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PageHeroSection
        title={["EVENIMENTE"]}
        breadcrumb={[
          { label: "Cursuri", href: "/cursuri" },
          { label: "Evenimente" },
        ]}
      >
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Evenimente
        </h1>
        <p className="text-retro-cream/70 text-base">
          Spectacole, competiții și momente speciale organizate de Școala de
          Patinaj EduSport de-a lungul sezonului.
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-white flex-1">
        <CurrentEventSkeleton />
        <PastEventsSkeleton />
      </div>
    </div>
  );
}
