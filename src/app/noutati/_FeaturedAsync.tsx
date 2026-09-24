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
    <Section className="py-16 md:py-20">
      <SectionHeader
        eyebrow="Cel mai recent articol"
        title="Noutăți"
        className="mb-10"
        eyebrowClassName="text-eyebrow font-bold uppercase text-accent"
        titleClassName="font-display text-display-sm font-extrabold text-primary tracking-[-0.4px]"
      />

      <a
        href={`/noutati/${featured.slug}`}
        className="group grid lg:grid-cols-2 gap-10 lg:gap-16 items-center outline-none"
      >
        <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[300px] overflow-hidden border-[1.5px] border-line bg-surface-subtle">
          <ArticleImage
            src={featured.coverImage}
            alt={featured.title}
            imgClassName="transition-transform duration-500 group-hover:scale-105"
          />
          <WarmStripe className="absolute inset-x-0 bottom-0 h-1.5 z-10" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[11.5px]">
            <span className="font-bold uppercase tracking-[0.04em] text-accent">
              {CATEGORY_LABELS[featured.category]}
            </span>
            <span className="text-line-subtle">·</span>
            <span className="text-secondary">
              {formatDate(featured.date)}
            </span>
          </div>

          <h2 className="font-display text-display-sm font-extrabold text-primary leading-[1.05] tracking-[-0.4px] group-hover:text-accent transition-colors">
            {featured.title}
          </h2>

          <p className="text-secondary text-base leading-relaxed border-t-[1.5px] border-line-subtle pt-4">
            {featured.description}
          </p>

          <span className="link-underline-rust text-accent font-semibold text-sm w-fit">
            Citește mai mult
          </span>
        </div>
      </a>
    </Section>
  );
}
