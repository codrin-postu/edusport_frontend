import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeroSection from "@/components/blocks/page-hero-section";
import Section from "@/components/ui/section";
import type { CategoryKey } from "./_data";
import FeaturedAsync from "./_FeaturedAsync";
import ArticleListAsync from "./_ArticleListAsync";
import Toolbar from "./_Toolbar";
import {
  ArticleListSkeleton,
  FeaturedSectionSkeleton,
} from "./_skeletons";

export const metadata: Metadata = {
  title: "Noutăți",
  description:
    "Ultimele noutăți de la școala de patinaj EduSport. Anunțuri, evenimente, competiții și sfaturi utile.",
  alternates: { canonical: "/noutati" },
  openGraph: {
    title: "Noutăți | EduSport",
    description: "Ultimele noutăți de la școala de patinaj EduSport.",
    type: "website",
    locale: "ro_RO",
    images: [
      {
        url: "/images/courses_generated.png",
        width: 1200,
        height: 630,
        alt: "EduSport - Școala de Patinaj",
      },
    ],
  },
};

export const revalidate = 300;

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const {
    page: pageParam,
    category: categoryParam,
    search: searchParam,
  } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const category = (categoryParam ?? "toate") as CategoryKey | "toate";
  const search = searchParam ?? "";

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
        {/* Featured article streams independently — its skeleton holds the
            whole section so the Toolbar below can render immediately. */}
        <Suspense fallback={<FeaturedSectionSkeleton />}>
          <FeaturedAsync />
        </Suspense>

        <Section className="bg-retro-cream border-t-[1.5px] border-navy/15 pt-12 pb-24 md:pt-16 md:pb-32">
          {/* Toolbar is interactive immediately — no data dependency. */}
          <Toolbar currentCategory={category} currentSearch={search} />

          {/* List streams independently. Suspense lives inside the gray section
              so the toolbar stays visible above the skeleton. The `key`
              forces a clean re-suspend whenever the filters change, so we
              don't see stale results from a previous category/search. */}
          <Suspense
            key={`${page}-${category}-${search}`}
            fallback={<ArticleListSkeleton />}
          >
            <ArticleListAsync page={page} category={category} search={search} />
          </Suspense>
        </Section>
      </div>
    </div>
  );
}
