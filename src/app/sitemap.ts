import type { MetadataRoute } from "next";
import { fetchArticles } from "@/lib/strapi-article";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edusport.vercel.app";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/cursuri`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/cursuri/program`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/cursuri/regulament`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/cursuri/evenimente`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/inscrieri`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/noutati`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/despre-noi/echipa`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/despre-noi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/despre-noi/realizari`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/voluntariat`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/parteneri`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/protectia-datelor`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic article routes
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await fetchArticles();
    articleRoutes = articles.map((article) => ({
      url: article.category === "evenimente"
        ? `${siteUrl}/cursuri/evenimente/${article.slug}`
        : `${siteUrl}/noutati/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // If Strapi is unavailable, return only static routes
  }

  return [...staticRoutes, ...articleRoutes];
}
