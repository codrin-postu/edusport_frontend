"use client";

import Link from "@/components/ui/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { ARTICLES, CATEGORY_LABELS, type CategoryKey } from "@/app/noutati/_data";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export interface LatestArticleData {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
  category?: CategoryKey;
}

const FALLBACK_ARTICLES: LatestArticleData[] = [...ARTICLES]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5)
  .map((a) => ({
    title: a.title,
    excerpt: a.description,
    date: new Date(a.date).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    image: a.coverImage,
    slug: a.slug,
    category: a.category,
  }));

/* ── Loop flourish SVG — left variant ── */
const LoopFlourish: React.FC = () => (
  <svg
    aria-hidden
    className="hidden lg:block absolute pointer-events-none"
    style={{
      left: "-0.75rem",
      transform: "translateX(-100%)",
      top: "5rem",
      width: 96,
      height: 67,
      overflow: "visible",
    }}
    viewBox="0 0 96 67"
    fill="none"
  >
    <path
      d="M4.21999 0.169617C-6.77992 30.6696 8.21994 44.1696 28.22 44.1696M28.22 44.1696C50.2199 46.1696 48.72 30.3884 43.72 26.1696C38.72 21.9509 24.7199 21.1696 28.22 44.1696ZM28.22 44.1696C29.7199 67.1696 70.2199 73.6696 94.7199 54.6696"
      stroke="var(--color-edusport-blue)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    />
  </svg>
);

/* ── Stacked date display ── */
interface DateStackProps {
  date: string;
  className?: string;
}

function parseDateParts(date: string): { day: string; mon: string; year: string } {
  const [day, rawMon, year = ""] = date.split(" ");
  return { day, mon: rawMon ?? "", year };
}

const DateStack: React.FC<DateStackProps> = ({ date, className }) => {
  const { day, mon, year } = parseDateParts(date);

  return (
    <div className={cn("flex flex-col items-center leading-none select-none", className)}>
      <span
        className="text-branding-font text-edusport-blue leading-none"
        style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
      >
        {day}
      </span>
      <span className="text-[10px] font-bold tracking-widest uppercase text-edusport-blue/70 mt-1">
        {mon}
      </span>
      <span className="text-[10px] font-bold tracking-widest text-edusport-blue/40">
        {year}
      </span>
    </div>
  );
};

/* ── Featured card ── */
const FeaturedCard: React.FC<LatestArticleData & { index: number }> = ({
  title,
  excerpt,
  date,
  image,
  slug,
  category,
  index,
}) => (
  <div className="relative w-full flex-[5]">
    {/* Number — desktop only */}
    <div className="hidden lg:flex absolute top-4 left-0 -translate-x-full pr-5 flex-col items-center leading-none select-none">
      <span
        className="text-branding-font text-edusport-blue leading-none"
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          transform: "rotate(-12deg)",
          display: "inline-block",
        }}
      >
        {String(index).padStart(2, "0")}
      </span>
    </div>

    <LoopFlourish />

    {/* Blue offset shadow + hover reveal */}
    <div className="group relative">
      <div
        aria-hidden
        className="absolute inset-0 bg-edusport-blue pointer-events-none transition-transform duration-300 ease-out group-hover:translate-x-4 group-hover:translate-y-4"
      />
      <Link href={`/noutati/${slug}`} className="relative block z-10">
        {/* Image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {/* Category badge */}
          {category && (
            <span className="absolute top-3 left-3 bg-edusport-blue text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full z-10">
              {CATEGORY_LABELS[category]}
            </span>
          )}
        </div>

        {/* Below image: title+excerpt | divider | date */}
        <div className="flex items-stretch py-5 pb-7 bg-white ring-1 ring-gray-100">
          <div className="flex-1 pl-4 pr-6 flex flex-col gap-2">
            <h3 className="text-base md:text-2xl font-bold text-gray-900 leading-tight">
              {title}
            </h3>
            {excerpt && (
              <p className="text-sm text-gray-500 line-clamp-2 hidden md:block">
                {excerpt}
              </p>
            )}
          </div>

          <div className="hidden md:block w-px bg-gray-200 self-stretch" />

          <div className="hidden md:flex flex-col items-center justify-center px-8 min-w-[130px]">
            <DateStack date={date} />
          </div>
        </div>
      </Link>
    </div>
  </div>
);

/* ── Article list item ── */
const ArticleListItem: React.FC<LatestArticleData & { index: number; isLast: boolean }> = ({
  title,
  date,
  slug,
  category,
  index,
  isLast,
}) => {
  const { day, mon } = parseDateParts(date);

  return (
    <Link
      href={`/noutati/${slug}`}
      className={cn(
        "group flex items-start gap-3 py-3",
        !isLast && "border-b border-gray-100",
      )}
    >
      {/* Number */}
      <span
        className="text-branding-font text-edusport-blue/20 text-xl flex-shrink-0 w-10 leading-none transition-colors duration-200 group-hover:text-edusport-blue/50"
        style={{ transform: "rotate(-8deg)", display: "inline-block" }}
      >
        {String(index).padStart(2, "0")}
      </span>

      {/* Text block */}
      <div className="flex flex-col gap-1 min-w-0">
        {/* Meta row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {category && (
            <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-edusport-blue">
              {CATEGORY_LABELS[category]}
            </span>
          )}
          {category && <span className="w-[3px] h-[3px] rounded-full bg-gray-300 flex-shrink-0" />}
          <span className="text-xs text-gray-400">
            {day} {mon}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-bold text-gray-900 leading-snug transition-colors duration-200 group-hover:text-edusport-blue">
          {title}
        </p>
      </div>
    </Link>
  );
};

/* ── Article list ── */
const ArticleList: React.FC<{ articles: LatestArticleData[] }> = ({ articles }) => (
  <div className="flex-[4] flex flex-col justify-between">
    <div>
      {articles.map((article, i) => (
        <motion.div
          key={article.slug}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 + i * 0.15 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <ArticleListItem
            {...article}
            index={i + 2}
            isLast={i === articles.length - 1}
          />
        </motion.div>
      ))}
    </div>
    <div className="mt-6 flex justify-end">
      <Link
        href="/noutati"
        className="inline-flex items-center gap-1 text-sm font-semibold text-edusport-blue hover:underline underline-offset-4"
      >
        Vezi toate articolele
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
);

/* ── Section ── */
interface LatestArticleSectionProps {
  articles?: LatestArticleData[];
}

const LatestArticleSection: React.FC<LatestArticleSectionProps> = ({ articles }) => {
  const displayArticles = articles && articles.length > 0 ? articles : FALLBACK_ARTICLES;
  const [hero, ...rest] = displayArticles;
  const listArticles = rest.slice(0, 4);

  return (
    <section className="relative mt-16 pt-20 pb-0 bg-[#eef2fb]">
      <div className="relative w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-24">
          {/* Eyebrow */}
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-edusport-blue mb-6">
            NOUTĂȚI
          </p>

          {/* Grid: featured left + list right */}
          <div className="flex gap-10 items-start flex-col lg:flex-row">
            <motion.div
              className="w-full flex-[5]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <FeaturedCard {...hero} index={1} />
            </motion.div>
            <ArticleList articles={listArticles} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestArticleSection;
