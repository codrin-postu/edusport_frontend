import PageHeroSection from "@/components/blocks/page-hero-section";
import Section from "@/components/ui/section";
import {
  ArticleListSkeleton,
  FeaturedSectionSkeleton,
  ToolbarSkeleton,
} from "./_skeletons";

// Top-level fallback rendered by Next.js while the page server component boots
// (e.g. during route transitions). Once `page.tsx` mounts, its inner
// <Suspense> boundaries take over per-section streaming.
export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeroSection title={["NOUTĂȚI"]}>
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Noutăți
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          Rămâneți la curent cu cele mai recente articole, evenimente și
          anunțuri din Școala de Patinaj EduSport.
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-white">
        <FeaturedSectionSkeleton />

        <Section className="bg-gray-50 pt-12 pb-40 md:pt-16 md:pb-56">
          <ToolbarSkeleton />
          <ArticleListSkeleton />
        </Section>
      </div>
    </div>
  );
}
