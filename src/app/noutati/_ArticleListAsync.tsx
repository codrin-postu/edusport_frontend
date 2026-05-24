import ArticleCard from "@/components/blocks/article-card";
import { Pagination } from "@/components/Pagination";
import { fetchArticlesPaginated } from "@/lib/strapi-article";
import { CATEGORY_LABELS, type CategoryKey } from "./_data";
import { PAGE_SIZE, formatDate, mapStrapiArticle } from "./_helpers";

interface ArticleListAsyncProps {
  page: number;
  category: CategoryKey | "toate";
  search: string;
}

// Server Component (async). Fetches the paginated list and renders the
// result-count line + cards/empty-state + pagination.
export default async function ArticleListAsync({
  page,
  category,
  search,
}: ArticleListAsyncProps) {
  let articles: ReturnType<typeof mapStrapiArticle>[] = [];
  let total = 0;
  let pageCount = 1;

  try {
    const result = await fetchArticlesPaginated({
      page,
      pageSize: PAGE_SIZE,
      category,
      search,
    });
    articles = result.articles.map(mapStrapiArticle);
    total = result.total;
    pageCount = result.pageCount;
  } catch {
    articles = [];
    total = 0;
    pageCount = 1;
  }

  return (
    <>
      <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8">
        {total} {total === 1 ? "articol" : "articole"} găsite
      </p>

      {articles.length > 0 ? (
        <div className="flex flex-col divide-y divide-gray-200">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              title={article.title}
              date={formatDate(article.date)}
              excerpt={article.description}
              image={article.coverImage}
              href={`/noutati/${article.slug}`}
              category={CATEGORY_LABELS[article.category]}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-gray-300">
            Niciun articol găsit
          </p>
          <p className="text-sm text-gray-400 mt-2 max-w-sm">
            Încercați să modificați criteriile de căutare sau să selectați o
            altă categorie.
          </p>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={pageCount}
        basePath="/noutati"
        ariaLabel="Paginare articole"
        extraQuery={{
          ...(category !== "toate" ? { category } : {}),
          ...(search ? { search } : {}),
        }}
      />
    </>
  );
}
