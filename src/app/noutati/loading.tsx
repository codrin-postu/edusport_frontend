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
    <div className="min-h-screen bg-retro-cream">
      <PageHeroSection title={["NOUTĂȚI"]}>
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Noutăți
        </h1>
        <p className="text-retro-cream/70 text-base">
          Rămâneți la curent cu cele mai recente articole, evenimente și
          anunțuri din Școala de Patinaj EduSport.
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-retro-cream">
        <FeaturedSectionSkeleton />

        <Section className="bg-retro-cream border-t-[1.5px] border-navy/15 pt-12 pb-24 md:pt-16 md:pb-32">
          <ToolbarSkeleton />
          <ArticleListSkeleton />
        </Section>
      </div>
    </div>
  );
}
