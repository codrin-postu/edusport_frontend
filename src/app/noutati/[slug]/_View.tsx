import { cn } from "@/utils/cn";
import { ARTICLES, CATEGORY_LABELS, type Article } from "../_data";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, ChevronRight, Tag } from "lucide-react";
import { notFound } from "next/navigation";

// ---------------------------------------------------------------------------
// Data access — will be replaced by Strapi fetch
// ---------------------------------------------------------------------------

function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface Props {
  slug: string;
}

const ArticleDetailPage: React.FC<Props> = ({ slug }) => {
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className={cn("min-h-screen", "bg-white")}>
      {/* Top bar — breadcrumb + back (pt-8 accounts for HeaderTop bar) */}
      <div className="bg-white border-b border-gray-100 pt-8">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-gray-400">
            <Link href="/noutati" className="hover:text-gray-600 transition-colors">Noutăți</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-gray-600 truncate max-w-[200px] sm:max-w-none">{article.title}</span>
          </nav>

        </div>
      </div>

      {/* Cover image — capped height on desktop */}
      <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[400px] bg-gray-100 overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Article body */}
      <article className="bg-white pt-12 pb-40 md:pt-16 md:pb-56">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
            {/* Main content */}
            <div>
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-medium text-edusport-blue">
                  {CATEGORY_LABELS[article.category]}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400 font-light">
                  {formatDate(article.date)}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 leading-snug tracking-tight mb-8">
                {article.title}
              </h1>

              {/* Body — rendered from mock HTML */}
              <div
                className="prose prose-gray prose-base max-w-none font-light leading-relaxed
                  prose-headings:font-semibold prose-headings:text-gray-900 prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-600 prose-p:mb-5
                  prose-a:text-edusport-blue prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-800
                  prose-blockquote:border-l-edusport-blue prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                  prose-table:text-sm
                  prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2.5 prose-th:text-left prose-th:font-semibold prose-th:text-gray-700
                  prose-td:px-4 prose-td:py-2.5 prose-td:border-t prose-td:border-gray-100
                  prose-ul:text-gray-600 prose-li:text-gray-600"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
              <div className="border border-gray-100 p-6 flex flex-col gap-4">
                <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
                  Detalii articol
                </p>
                <div className="flex flex-col gap-3 text-sm text-gray-600 font-light">
                  <span className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
                    {formatDate(article.date)}
                  </span>
                  <span className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-edusport-blue/60 shrink-0 mt-0.5" />
                    {CATEGORY_LABELS[article.category]}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
