import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";
import { ArticleImage } from "@/components/blocks/article-card/ArticleImage";
import { WarmStripe } from "@/components/ui/warm-stripe";
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
    <Section className="section">
      <SectionHeader
        eyebrow="Cel mai recent articol"
        title="Noutăți"
        className="mb-12"
        eyebrowClassName="text-label text-accent"
        titleClassName="text-heading text-primary"
      />

      <a
        href={`/noutati/${featured.slug}`}
        className="group grid lg:grid-cols-2 gap-12 lg:gap-16 items-center outline-none"
      >
        <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[300px] overflow-hidden border-retro border-line bg-surface-subtle">
          <ArticleImage
            src={featured.coverImage}
            alt={featured.title}
            imgClassName="transition-transform duration-slow group-hover:scale-105"
          />
          <WarmStripe className="absolute inset-x-0 bottom-0 h-1.5 z-raised" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-caption flex flex-wrap items-center gap-2">
            <span className="text-label text-accent">
              {CATEGORY_LABELS[featured.category]}
            </span>
            <span className="text-line-subtle">·</span>
            <span className="text-secondary">
              {formatDate(featured.date)}
            </span>
          </div>

          <h2 className="text-heading text-primary group-hover:text-accent transition-colors">
            {featured.title}
          </h2>

          <p className="text-body text-secondary border-t-retro border-line-subtle pt-4">
            {featured.description}
          </p>

          <span className="text-body-sm link text-accent w-fit">
            Citește mai mult
          </span>
        </div>
      </a>
    </Section>
  );
}
