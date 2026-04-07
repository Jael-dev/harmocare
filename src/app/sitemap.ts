import type { MetadataRoute } from "next";
import { locales } from "@/dictionaries";
import { getBlogSlugs } from "@/lib/blog";

const baseUrl = "https://harmocares.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = locales.flatMap((locale) => [
    { url: `${baseUrl}/${locale}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/${locale}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/${locale}/privacy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ]);

  const blogPages = locales.flatMap((locale) =>
    getBlogSlugs(locale).map((slug) => ({
      url: `${baseUrl}/${locale}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...blogPages];
}
