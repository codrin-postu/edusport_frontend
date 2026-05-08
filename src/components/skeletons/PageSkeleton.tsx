import PageHeroSection from "@/components/blocks/page-hero-section";
import Section from "@/components/ui/section";

// Reusable skeleton primitives for `loading.tsx` files. Each one matches the
// vertical rhythm of a real page section so the swap-in to the rendered page
// causes minimal layout shift.

export function HeroSkeleton({
  title,
  breadcrumb,
  blurb,
}: {
  title: string[];
  breadcrumb?: { label: string; href?: string }[];
  blurb?: string;
}) {
  return (
    <PageHeroSection title={title} breadcrumb={breadcrumb}>
      <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
        {title.map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ")}
      </h1>
      {blurb && (
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          {blurb}
        </p>
      )}
    </PageHeroSection>
  );
}

export function TextBlockSkeleton({
  lines = 4,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gray-200 rounded"
          style={{ width: `${75 + ((i * 13) % 25)}%` }}
        />
      ))}
    </div>
  );
}

export function HeadingSkeleton({ width = "60%" }: { width?: string }) {
  return (
    <div className="h-8 bg-gray-200 rounded animate-pulse" style={{ width }} />
  );
}

export function CardGridSkeleton({
  count = 6,
  cols = 3,
}: {
  count?: number;
  cols?: 2 | 3 | 4;
}) {
  const colClass =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-6 md:gap-8 animate-pulse`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-[4/3] bg-gray-200 rounded-xl" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-2/3 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function LongformSkeleton() {
  return (
    <Section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-pulse">
        <HeadingSkeleton width="50%" />
        <TextBlockSkeleton lines={6} />
        <HeadingSkeleton width="40%" />
        <TextBlockSkeleton lines={8} />
        <HeadingSkeleton width="55%" />
        <TextBlockSkeleton lines={5} />
      </div>
    </Section>
  );
}

export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <Section className="py-12 md:py-16">
      <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-pulse">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-11 w-full bg-gray-200 rounded" />
          </div>
        ))}
        <div className="h-12 w-40 bg-gray-200 rounded mt-2" />
      </div>
    </Section>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <>
      <div className="bg-white border-b border-gray-100 pt-8">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12 py-4">
          <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[400px] bg-gray-200 animate-pulse" />
      <article className="bg-white pt-12 pb-40 md:pt-16 md:pb-56">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start animate-pulse">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-8 w-4/5 bg-gray-200 rounded" />
              <div className="h-px bg-gray-100" />
              <div className="flex flex-col gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 bg-gray-200 rounded"
                    style={{ width: `${70 + ((i * 17) % 30)}%` }}
                  />
                ))}
              </div>
            </div>
            <aside className="hidden lg:flex flex-col gap-3 border border-gray-100 p-6">
              <div className="h-3 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-36 bg-gray-200 rounded" />
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
