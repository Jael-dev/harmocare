import { getBlogSlugs, getBlogBySlug } from "@/lib/blog";
import { locales, type Locale } from "@/dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ReactionBar } from "@/components/blog/ReactionBar";
import { ReadTracker } from "@/components/blog/ReadTracker";
import { ShareButton } from "@/components/blog/ShareButton";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getBlogSlugs(locale).map((slug) => ({ lang: locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang as Locale;

  try {
    const blog = getBlogBySlug(slug, lang);
    return { title: blog.title, description: blog.description };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang as Locale;

  const slugs = getBlogSlugs(lang);
  if (!slugs.includes(slug)) notFound();

  const blog = getBlogBySlug(slug, lang);
  const { default: Content } = await import(
    `@/content/blogs/${lang}/${slug}.mdx`
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <Content />
      </article>
      <div className="mt-12 flex flex-col gap-6">
        <ShareButton slug={slug} locale={lang} title={blog.title} />
        <ReactionBar slug={slug} locale={lang} />
        <ReadTracker slug={slug} locale={lang} />
      </div>
    </div>
  );
}
