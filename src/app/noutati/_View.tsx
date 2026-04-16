"use client";

import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import ArticleCard from "@/components/blocks/article-card";
import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, ChevronDown, ArrowRight } from "lucide-react";
import { CATEGORY_LABELS, type CategoryKey } from "./_data";
import type { Article } from "./_data";

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

interface CategoryOption {
  key: CategoryKey | "toate";
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { key: "toate", label: "Toate" },
  { key: "evenimente", label: "Evenimente" },
  { key: "anunturi", label: "Anunțuri" },
  { key: "general", label: "General" },
  { key: "competitii", label: "Competiții" },
  { key: "tips", label: "Tips" },
];

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

function buildUrl(params: { page: number; category: string; search: string }) {
  const q = new URLSearchParams();
  if (params.page > 1) q.set("page", String(params.page));
  if (params.category && params.category !== "toate") q.set("category", params.category);
  if (params.search) q.set("search", params.search);
  const qs = q.toString();
  return `/noutati${qs ? `?${qs}` : ""}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SearchBar({
  value,
  category,
  navigate,
}: {
  value: string;
  category: string;
  navigate: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const search = inputRef.current?.value ?? "";
    navigate(buildUrl({ page: 1, category, search }));
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md flex">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        name="search"
        placeholder="Caută articole..."
        defaultValue={value}
        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-edusport-blue transition-colors"
      />
    </form>
  );
}

function CategoryFilter({
  active,
  search,
  navigate,
}: {
  active: string;
  search: string;
  navigate: (url: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isFiltered = active !== "toate";
  const activeLabel = CATEGORIES.find((c) => c.key === active)?.label;

  React.useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 min-w-[180px] pl-3 pr-8 py-2.5 text-sm border border-gray-200 bg-gray-50 text-gray-600 outline-none cursor-pointer transition-colors relative"
        >
          {activeLabel}
          <ChevronDown
            className={cn(
              "absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-px min-w-full w-max bg-white border border-gray-200 shadow-lg z-20">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setOpen(false);
                  navigate(buildUrl({ page: 1, category: cat.key, search }));
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors",
                  active === cat.key
                    ? "bg-edusport-blue/5 text-edusport-blue font-medium"
                    : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isFiltered && (
        <button
          onClick={() => navigate(buildUrl({ page: 1, category: "toate", search }))}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Resetează
        </button>
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  pageCount,
  category,
  search,
  navigate,
}: {
  currentPage: number;
  pageCount: number;
  category: string;
  search: string;
  navigate: (url: string) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 pt-12">
      <button
        onClick={() => navigate(buildUrl({ page: currentPage - 1, category, search }))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => navigate(buildUrl({ page: p, category, search }))}
          className={cn(
            "w-9 h-9 rounded-lg text-sm font-medium transition-colors flex items-center justify-center",
            p === currentPage
              ? "bg-edusport-blue text-white"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => navigate(buildUrl({ page: currentPage + 1, category, search }))}
        disabled={currentPage === pageCount}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-gray-200 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid sm:grid-cols-[96px_1fr] gap-4 py-6 items-start">
          <div className="hidden sm:block w-24 aspect-video rounded-lg bg-gray-200" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface NoutatiPageProps {
  articles: Article[];
  featuredArticle: Article | null;
  total: number;
  pageCount: number;
  currentPage: number;
  currentCategory: CategoryKey | "toate";
  currentSearch: string;
}

const NoutatiPage: React.FC<NoutatiPageProps> = ({
  articles,
  featuredArticle,
  total,
  pageCount,
  currentPage,
  currentCategory,
  currentSearch,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(url: string) {
    startTransition(() => {
      router.push(url, { scroll: false });
    });
  }

  return (
    <div className={cn("min-h-screen", "bg-white")}>
      <PageHeroSection title={["NOUTĂȚI"]}>
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Noutăți
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          Rămâneți la curent cu cele mai recente articole, evenimente și anunțuri
          din Școala de Patinaj EduSport.
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-white">
        {/* Featured article — always the globally newest */}
        {featuredArticle && (
          <Section className="py-16 md:py-20">
              <SectionHeader eyebrow="Cel mai recent articol" title="Noutăți" className="mb-10" />

              <a
                href={`/noutati/${featuredArticle.slug}`}
                className="group grid lg:grid-cols-2 gap-10 lg:gap-16 items-center outline-none"
              >
                <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[300px] overflow-hidden bg-gray-100">
                  <Image
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-edusport-blue">
                      {CATEGORY_LABELS[featuredArticle.category]}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400 font-light">
                      {formatDate(featuredArticle.date)}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug group-hover:text-edusport-blue transition-colors">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-gray-500 text-base font-light leading-relaxed border-t border-gray-100 pt-4">
                    {featuredArticle.description}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-edusport-blue group-hover:gap-3 transition-all w-fit">
                    Citește mai mult
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
          </Section>
        )}

        {/* Articles list */}
        <Section className="bg-gray-50 pt-12 pb-40 md:pt-16 md:pb-56">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
              <SearchBar value={currentSearch} category={currentCategory} navigate={navigate} />
              <CategoryFilter active={currentCategory} search={currentSearch} navigate={navigate} />
            </div>

            {/* Results count */}
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8">
              {total} {total === 1 ? "articol" : "articole"} găsite
            </p>

            {/* Articles */}
            <div className={cn("transition-opacity duration-200", isPending && "opacity-40 pointer-events-none")}>
              {isPending ? (
                <ArticleSkeleton />
              ) : articles.length > 0 ? (
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
                    Încercați să modificați criteriile de căutare sau să selectați
                    o altă categorie.
                  </p>
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              category={currentCategory}
              search={currentSearch}
              navigate={navigate}
            />
        </Section>
      </div>
    </div>
  );
};

export default NoutatiPage;
