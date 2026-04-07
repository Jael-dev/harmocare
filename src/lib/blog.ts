import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/dictionaries";

export interface BlogMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  featured: boolean;
  image?: string;
}

const contentDir = path.join(process.cwd(), "src/content/blogs");

export function getBlogSlugs(locale: Locale): string[] {
  const dir = path.join(contentDir, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getBlogBySlug(
  slug: string,
  locale: Locale
): BlogMeta {
  const filePath = path.join(contentDir, locale, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(source);

  return {
    title: data.title,
    slug: data.slug ?? slug,
    description: data.description,
    date: data.date,
    author: data.author,
    featured: data.featured ?? false,
    image: data.image,
  };
}

export function getAllBlogs(locale: Locale): BlogMeta[] {
  const slugs = getBlogSlugs(locale);
  return slugs
    .map((slug) => getBlogBySlug(slug, locale))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedBlogs(locale: Locale): BlogMeta[] {
  return getAllBlogs(locale).filter((blog) => blog.featured);
}
