import { cn } from "@/utils/cn";
import React from "react";
import Card, { CardTitle } from "@/components/ui/card";
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
    <Card
      href={href}
      shadow="none"
      padding="none"
      className={cn(
        "grid sm:grid-cols-[128px_1fr] gap-6 sm:gap-8 py-8 items-start border-none bg-transparent",
        className,
      )}
    >
      {/* Thumbnail — square, navy border */}
      <div className="relative w-full sm:w-32 aspect-video sm:aspect-square overflow-hidden border-retro border-line bg-surface-subtle shrink-0">
        <ArticleImage src={image} alt={title} sizes="(max-width: 640px) 100vw, 128px" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <div className="text-caption flex flex-wrap items-center gap-2 mb-0.5">
          {category && (
            <>
              <span className="text-label text-accent">
                {category}
              </span>
              <span className="text-line-subtle">·</span>
            </>
          )}
          <span className="text-secondary">{date}</span>
        </div>
        <CardTitle className="text-title text-primary">{title}</CardTitle>
        {excerpt && (
          <p className="text-body-sm text-secondary line-clamp-2">
            {excerpt}
          </p>
        )}
        <span className="text-label relative inline-block w-fit mt-1 pb-0.5 uppercase text-accent after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-rust after:transition-transform group-hover/card:after:scale-x-100">
          Citește mai mult
        </span>
      </div>
    </Card>
  );
};

export default ArticleCard;
