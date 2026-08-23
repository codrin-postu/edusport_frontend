import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";

// Shared skeletons used both by `loading.tsx` (top-level route fallback) and
// the per-section <Suspense> fallbacks inside `page.tsx`.

export function FeaturedArticleBlockSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center animate-pulse">
      <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[300px] bg-navy/10" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 bg-navy/10 rounded" />
          <div className="h-3 w-16 bg-navy/10 rounded" />
        </div>
        <div className="h-8 w-4/5 bg-navy/10 rounded" />
        <div className="h-px bg-navy/10" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full bg-navy/10 rounded" />
          <div className="h-3 w-11/12 bg-navy/10 rounded" />
          <div className="h-3 w-2/3 bg-navy/10 rounded" />
        </div>
        <div className="h-4 w-32 bg-navy/10 rounded" />
      </div>
    </div>
  );
}

export function FeaturedSectionSkeleton() {
  return (
    <Section className="py-16 md:py-20">
      <SectionHeader
        eyebrow="Cel mai recent articol"
        title="Noutăți"
        className="mb-10"
        eyebrowClassName="text-eyebrow font-bold uppercase text-rust"
        titleClassName="font-display text-display-sm font-extrabold text-navy tracking-[-0.4px]"
      />
      <FeaturedArticleBlockSkeleton />
    </Section>
  );
}

export function ArticleListSkeleton() {
  return (
    <>
      <div className="h-3 w-32 bg-navy/10 rounded mb-8 animate-pulse" />
      <div className="flex flex-col divide-y divide-navy/10 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid sm:grid-cols-[96px_1fr] gap-4 py-6 items-start"
          >
            <div className="hidden sm:block w-24 aspect-video border-[1.5px] border-navy/20 bg-navy/10" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-24 bg-navy/10 rounded" />
              <div className="h-4 w-3/4 bg-navy/10 rounded" />
              <div className="h-3 w-full bg-navy/10 rounded" />
              <div className="h-3 w-2/3 bg-navy/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10 animate-pulse">
      <div className="h-11 w-full max-w-md bg-navy/10" />
      <div className="h-11 w-[180px] bg-navy/10" />
    </div>
  );
}
