import { cn } from "@/utils/cn";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { SHIMMER_DATA_URL } from "@/lib/blurDataUrl";

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
        "group grid sm:grid-cols-[128px_1fr] gap-5 sm:gap-8 py-7 items-start hover:opacity-75 transition-opacity outline-none",
        className,
      )}
    >
      {/* Thumbnail */}
      {image ? (
        <div className="relative w-full sm:w-32 aspect-video sm:aspect-square overflow-hidden bg-gray-100 shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 128px"
            placeholder="blur"
            blurDataURL={SHIMMER_DATA_URL}
          />
        </div>
      ) : (
        <div className="hidden sm:flex w-32 aspect-square bg-gray-100 items-center justify-center shrink-0">
          <div className="w-8 h-8 bg-gray-200 rounded" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          {category && (
            <span className="text-xs font-medium text-edusport-blue">
              {category}
            </span>
          )}
          {category && (
            <span className="text-gray-300">·</span>
          )}
          <span className="text-xs text-gray-400 font-light">
            {date}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-edusport-blue mt-1">
          Citește mai mult <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
};

export default ArticleCard;
