"use client";

import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import ArticleCard from "@/components/blocks/article-card";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronDown, ArrowRight } from "lucide-react";
import { ARTICLES, CATEGORY_LABELS, type CategoryKey } from "./_data";

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

const ITEMS_PER_PAGE = 6;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Caută articole..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-edusport-blue transition-colors"
      />
    </div>
  );
}

function CategoryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isFiltered = active !== "toate";
  const activeLabel = CATEGORIES.find((c) => c.key === active)?.label;

  // Close on outside click
  useEffect(() => {
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
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-px min-w-full w-max bg-white border border-gray-200 shadow-lg z-20">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  onChange(cat.key);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors",
                  active === cat.key
                    ? "bg-edusport-blue/5 text-edusport-blue font-medium"
                    : "text-gray-600 hover:bg-gray-50"
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
          onClick={() => onChange("toate")}
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
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 pt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
            page === currentPage
              ? "bg-edusport-blue text-white"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const NoutatiPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("toate");
  const [currentPage, setCurrentPage] = useState(1);

  // Sort by newest first
  const sortedArticles = useMemo(
    () => [...ARTICLES].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []
  );

  // Filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return sortedArticles.filter((article) => {
      const matchesCategory =
        activeCategory === "toate" || article.category === activeCategory;
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [sortedArticles, search, activeCategory]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setCurrentPage(1);
  };
  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setCurrentPage(1);
  };

  return (
    <div className={cn("min-h-screen", "bg-white")}>
      <PageHeroSection
        title={["NOUTĂȚI"]}
      >
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Noutăți
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          Rămâneți la curent cu cele mai recente articole, evenimente și anunțuri
          din Școala de Patinaj EduSport.
        </p>
      </PageHeroSection>

      <div className="relative z-10 bg-white">
        {/* Latest article — featured */}
        {sortedArticles.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60 mb-10">
                Cel mai recent articol
              </p>

              <a
                href={`/noutati/${sortedArticles[0].slug}`}
                className="group grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[300px] overflow-hidden bg-gray-100">
                  <Image
                    src={sortedArticles[0].coverImage}
                    alt={sortedArticles[0].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-edusport-blue">
                      {CATEGORY_LABELS[sortedArticles[0].category]}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400 font-light">
                      {formatDate(sortedArticles[0].date)}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug group-hover:text-edusport-blue transition-colors">
                    {sortedArticles[0].title}
                  </h2>

                  <p className="text-gray-500 text-base font-light leading-relaxed border-t border-gray-100 pt-4">
                    {sortedArticles[0].description}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-edusport-blue group-hover:gap-3 transition-all w-fit">
                    Citește mai mult
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            </div>
          </section>
        )}

        {/* Rest of articles */}
        <section className="bg-gray-50 pt-12 pb-40 md:pt-16 md:pb-56">
          <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
              <SearchBar value={search} onChange={handleSearchChange} />
              <CategoryFilter
                active={activeCategory}
                onChange={handleCategoryChange}
              />
            </div>

            {/* Results count */}
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-8">
              {filtered.length}{" "}
              {filtered.length === 1 ? "articol" : "articole"} găsite
            </p>

            {/* Articles list */}
            {paged.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-200">
                {paged.map((article) => (
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

            {/* Pagination */}
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default NoutatiPage;
