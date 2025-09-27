import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ArticleCard } from "@/components/blocks";
import React from "react";

const LatestArticleSection: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: "Campionatul Național de Patinaj Artistic 2024",
      excerpt:
        "Sportivii noștri au obținut rezultate excepționale la Campionatul Național de Patinaj Artistic. Echipa EduSport a demonstrat încă o dată calitatea antrenamentelor și dedicarea...",
      date: "15 Martie 2024",
      featured: true,
    },
    {
      id: 2,
      title: "Noi cursuri pentru începători în aprilie",
      date: "8 Martie 2024",
      featured: false,
    },
    {
      id: 3,
      title: "Echipamentul de patinaj - ghid pentru părinți",
      date: "2 Martie 2024",
      featured: false,
    },
  ];

  return (
    <section className={cn("py-16", "bg-gray-50")}>
      <div
        className={cn(
          "w-full",
          "max-w-content",
          "mx-auto",
          "px-4",
          "md:px-8",
          "lg:px-12",
        )}
      >
        <div className={cn("max-w-6xl", "mx-auto")}>
          <div className={cn("grid", "md:grid-cols-3", "gap-8")}>
            {/* Featured Article */}
            <div className={cn("md:col-span-2")}>
              <ArticleCard
                title={articles[0].title}
                date={articles[0].date}
                excerpt={articles[0].excerpt}
                href="/news"
                detailed
                className="shadow-lg hover:shadow-xl"
              />
            </div>

            {/* Secondary Articles */}
            <div className={cn("space-y-6")}>
              {articles.slice(1).map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  date={article.date}
                  href="/news"
                  imagePlaceholder="Imagine"
                  detailed={false}
                />
              ))}

              {/* View More Button */}
              <Button
                asChild
                variant="outline"
                className={cn(
                  "w-full",
                  "border-edusport-blue",
                  "text-edusport-blue",
                  "hover:bg-edusport-blue/10",
                )}
              >
                <Link href="/news">Vezi Toate Articolele</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestArticleSection;
