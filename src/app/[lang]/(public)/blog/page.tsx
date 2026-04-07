import Link from "next/link";
import { getAllBlogs } from "@/lib/blog";
import { type Locale } from "@/dictionaries";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const blogs = getAllBlogs(lang);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {lang === "fr"
            ? "Découvrez nos derniers articles sur le bien-être et la santé mentale."
            : "Discover our latest articles on well-being and mental health."}
        </p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-muted-foreground">
          {lang === "fr" ? "Aucun article pour le moment." : "No articles yet."}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {blogs.map((blog) => (
            <Link key={blog.slug} href={`/${lang}/blog/${blog.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />
                    <time dateTime={blog.date}>
                      {new Date(blog.date).toLocaleDateString(lang, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {blog.featured && (
                      <Badge
                        variant="secondary"
                        className="ml-auto border-lavender/30 bg-lavender/10 text-lavender"
                      >
                        {lang === "fr" ? "À la une" : "Featured"}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2 text-xl">{blog.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {blog.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
