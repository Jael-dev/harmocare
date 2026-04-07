"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/dictionaries";

interface HeroProps {
  dict: Dictionary;
}

export function Hero({ dict }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 py-24 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:py-36">
        {/* Left content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <Badge
            variant="secondary"
            className="mb-6 border-brand/30 bg-brand/10 text-brand"
          >
            {dict.hero.badge}
          </Badge>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {dict.hero.headline.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {dict.hero.description}
          </p>

          <Link
            href="#waitlist"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 bg-gradient-to-r from-brand to-lavender text-white hover:opacity-90 font-semibold text-base px-8 rounded-full shadow-md shadow-brand/20"
            )}
          >
            {dict.hero.cta}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>

        {/* Right image */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative aspect-square w-full max-w-md rounded-2xl bg-gradient-to-br from-lavender/20 via-rose/15 to-blush/10 p-8">
            <div className="flex h-full items-center justify-center rounded-xl border border-border/30 bg-card/60 backdrop-blur-sm shadow-lg shadow-lavender/5">
              <Image
                src="/logo.svg"
                alt="Harmocare"
                width={160}
                height={160}
                className="opacity-60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-lavender/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-rose/10 blur-3xl" />
    </section>
  );
}
