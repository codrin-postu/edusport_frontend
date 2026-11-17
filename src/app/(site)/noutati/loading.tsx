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
    <div className="min-h-screen bg-surface">
      <PageHeroSection title={["NOUTĂȚI"]}>
        <h1 className="text-display text-primary-on-dark">
          Noutăți
        </h1>
        <p className="text-body text-secondary-on-dark">
          Rămâneți la curent cu cele mai recente articole, evenimente și
          anunțuri din Școala de Patinaj EduSport.
        </p>
      </PageHeroSection>

      <div className="relative z-raised bg-surface">
        <FeaturedSectionSkeleton />

        <Section className="bg-surface border-t-retro border-line-subtle section">
          <ToolbarSkeleton />
          <ArticleListSkeleton />
        </Section>
      </div>
    </div>
  );
}
