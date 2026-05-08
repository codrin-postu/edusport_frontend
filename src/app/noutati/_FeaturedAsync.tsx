import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";
import { fetchArticlesPaginated } from "@/lib/strapi-article";
import { CATEGORY_LABELS } from "./_data";
import { formatDate, mapStrapiArticle } from "./_helpers";

// Server Component (async). Fetches the globally-newest article and renders
// the entire featured section, or null if no article exists / fetch fails.
export default async function FeaturedAsync() {
  let featured = null;
  try {
    const result = await fetchArticlesPaginated({ page: 1, pageSize: 1 });
    featured = result.articles[0] ? mapStrapiArticle(result.articles[0]) : null;
  } catch {
    featured = null;
  }

  if (!featured) return null;

  return (
    <Section className="py-16 md:py-20">
      <SectionHeader
        eyebrow="Cel mai recent articol"
        title="Noutăți"
        className="mb-10"
      />

      <a
        href={`/noutati/${featured.slug}`}
        className="group grid lg:grid-cols-2 gap-10 lg:gap-16 items-center outline-none"
      >
        <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[300px] overflow-hidden bg-gray-100">
          <Image
            src={featured.coverImage}
            alt={featured.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-edusport-blue">
              {CATEGORY_LABELS[featured.category]}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400 font-light">
              {formatDate(featured.date)}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug group-hover:text-edusport-blue transition-colors">
            {featured.title}
          </h2>

          <p className="text-gray-500 text-base font-light leading-relaxed border-t border-gray-100 pt-4">
            {featured.description}
          </p>

          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-edusport-blue group-hover:gap-3 transition-all w-fit">
            Citește mai mult
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </a>
    </Section>
  );
}
