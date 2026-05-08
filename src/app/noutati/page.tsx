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
        {/* Featured article streams independently — its skeleton holds the
            whole section so the Toolbar below can render immediately. */}
        <Suspense fallback={<FeaturedSectionSkeleton />}>
          <FeaturedAsync />
        </Suspense>

        <Section className="bg-gray-50 pt-12 pb-40 md:pt-16 md:pb-56">
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
