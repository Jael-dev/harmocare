import Link from "next/link";
import { ArrowRight, CalendarDays, UserPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface BlogHeroProps {
  title: string;
  description: string;
  author: string;
  date: string;
  cta?: { label: string; href: string };
}

export function BlogHero({ title, description, author, date, cta }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-lavender/10 via-rose/5 to-brand/5">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UserPen className="size-4" />
            {author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            <time dateTime={date}>{date}</time>
          </span>
        </div>
        {cta && (
          <Link
            href={cta.href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 bg-gradient-to-r from-brand to-lavender text-white hover:opacity-90 font-semibold rounded-full shadow-md shadow-brand/20"
            )}
          >
            {cta.label}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        )}
      </div>
      <div className="pointer-events-none absolute -top-20 right-0 h-[300px] w-[300px] rounded-full bg-lavender/8 blur-3xl" />
    </section>
  );
}
