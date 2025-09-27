import Link from "@/components/ui/link";
import { cn } from "@/utils/cn";
import React from "react";

interface ArticleCardProps {
  title: string;
  date: string;
  excerpt?: string;
  href?: string;
  imagePlaceholder?: string;
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  detailed?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  date,
  excerpt,
  href = "#",
  imagePlaceholder = "Imagine Articol",
  className,
  imageClassName,
  contentClassName,
  detailed = false,
}) => {
  const showExcerpt = detailed && excerpt;

  return (
    <Link
      href={href}
      className={cn(
        "block",
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "overflow-hidden",
        "hover:shadow-lg",
        "transition-shadow",
        "cursor-pointer",
        className,
      )}
    >
      <div className={cn(detailed && "md:flex")}>
        <div className={cn(detailed ? "md:w-2/5" : "w-full")}>
          <div
            className={cn(
              "bg-gray-200",
              "flex",
              "items-center",
              "justify-center",
              detailed ? "h-48 md:h-full" : "h-32",
              imageClassName,
            )}
          >
            <p className={cn("text-gray-500", detailed ? "text-base" : "text-sm")}>
              {imagePlaceholder}
            </p>
          </div>
        </div>
        <div
          className={cn(
            detailed ? "md:w-3/5 p-6" : "p-4",
            contentClassName,
          )}
        >
          <div
            className={cn(
              "text-edusport-blue",
              "mb-2",
              detailed ? "text-sm" : "text-xs",
            )}
          >
            {date}
          </div>
          <h3
            className={cn(
              "font-bold",
              "text-gray-800",
              "mb-3",
              detailed ? "text-xl" : "text-sm",
              !showExcerpt && "leading-tight",
            )}
          >
            {title}
          </h3>
          {showExcerpt && (
            <p className={cn("text-gray-600", "text-sm", detailed && "mb-4")}>
              {excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;