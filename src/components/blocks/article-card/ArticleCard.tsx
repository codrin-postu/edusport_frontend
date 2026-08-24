import { cn } from "@/utils/cn";
import React from "react";
import { ArticleImage } from "./ArticleImage";

interface ArticleCardProps {
  title: string;
  date: string;
  excerpt?: string;
  href?: string;
  image?: string;
  className?: string;
  category?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  date,
  excerpt,
  href = "#",
  image,
  className,
  category,
}) => {
  return (
    <a
      href={href}
      className={cn(
        "group grid sm:grid-cols-[128px_1fr] gap-5 sm:gap-8 py-7 items-start outline-none",
        className,
      )}
    >
      {/* Thumbnail — square, navy border */}
      <div className="relative w-full sm:w-32 aspect-video sm:aspect-square overflow-hidden border-[1.5px] border-navy bg-navy/[0.03] shrink-0">
        <ArticleImage src={image} alt={title} sizes="(max-width: 640px) 100vw, 128px" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 mb-0.5 text-[11.5px]">
          {category && (
            <>
              <span className="font-bold uppercase tracking-[0.04em] text-rust">
                {category}
              </span>
              <span className="text-navy/30">·</span>
            </>
          )}
          <span className="text-navy/45">{date}</span>
        </div>
        <h3 className="text-lg font-bold text-navy leading-snug">{title}</h3>
        {excerpt && (
          <p className="text-sm text-navy/[0.62] leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        )}
        <span className="relative inline-block w-fit mt-1 pb-0.5 text-[11.5px] font-bold uppercase tracking-[0.03em] text-rust after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-rust after:transition-transform group-hover:after:scale-x-100">
          Citește mai mult
        </span>
      </div>
    </a>
  );
};

export default ArticleCard;
