import PageHeroSection from "@/components/blocks/page-hero-section";

// Streamed by Next.js while page.tsx awaits Strapi. Mirrors the layout shell
// so the footer doesn't snap up against the hero before content arrives.

function CurrentEventSkeleton() {
  return (
    <section className="bg-surface-raised py-16 md:py-24">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-3 w-40 bg-surface-subtle mb-12 animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center animate-pulse">
          <div className="relative aspect-[16/9] bg-surface-subtle" />
          <div className="flex flex-col gap-6">
            <div className="h-9 w-4/5 bg-surface-subtle" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-40 bg-surface-subtle" />
              <div className="h-3 w-24 bg-surface-subtle" />
              <div className="h-3 w-56 bg-surface-subtle" />
            </div>
            <div className="h-px bg-surface-subtle" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-full bg-surface-subtle" />
              <div className="h-3 w-11/12 bg-surface-subtle" />
              <div className="h-3 w-2/3 bg-surface-subtle" />
            </div>
            <div className="h-4 w-32 bg-surface-subtle" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PastEventsSkeleton() {
  return (
    <section className="bg-surface-subtle py-16 md:py-24">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-3 w-44 bg-surface-subtle mb-12 animate-pulse" />
        <div className="flex flex-col divide-y divide-line-subtle animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid sm:grid-cols-[128px_1fr] gap-6 sm:gap-8 py-8 items-start"
            >
              <div className="relative w-full sm:w-32 aspect-video sm:aspect-square bg-surface-subtle" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-32 bg-surface-subtle" />
                <div className="h-5 w-3/4 bg-surface-subtle" />
                <div className="h-3 w-full bg-surface-subtle" />
                <div className="h-3 w-2/3 bg-surface-subtle" />
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
    <div className="min-h-screen bg-surface-raised flex flex-col">
      <PageHeroSection
        title={["EVENIMENTE"]}
        breadcrumb={[
          { label: "Cursuri", href: "/cursuri" },
          { label: "Evenimente" },
        ]}
      >
        <h1 className="text-display text-primary-on-dark">
          Evenimente
        </h1>
        <p className="text-body text-secondary-on-dark">
          Spectacole, competiții și momente speciale organizate de Școala de
          Patinaj EduSport de-a lungul sezonului.
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-surface-raised flex-1">
        <CurrentEventSkeleton />
        <PastEventsSkeleton />
      </div>
    </div>
  );
}
