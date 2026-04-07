import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, BarChart3, MessageCircle } from "lucide-react";
import type { Dictionary, Locale } from "@/dictionaries";

interface FeatureCardsProps {
  dict: Dictionary;
  lang: Locale;
}

const icons = [BookOpen, Users, BarChart3, MessageCircle];
const colors = [
  "text-brand",
  "text-lavender",
  "text-rose",
  "text-amber",
];
const bgColors = [
  "bg-brand/10",
  "bg-lavender/10",
  "bg-rose/10",
  "bg-amber/10",
];

export function FeatureCards({ dict, lang }: FeatureCardsProps) {
  const badges = [
    null, // Blog is live — no badge
    { label: lang === "fr" ? "Bientôt" : "Soon" },
    { label: lang === "fr" ? "Bientôt" : "Soon" },
    { label: lang === "fr" ? "Bientôt" : "Soon" },
  ];

  const links = [
    `/${lang}/blog`,
    null,
    null,
    null,
  ];

  return (
    <section id="features" className="border-t border-border/40 bg-muted/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {dict.features.title}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.features.cards.map((card, i) => {
            const Icon = icons[i];
            const badge = badges[i];
            const href = links[i];

            const cardContent = (
              <Card
                key={i}
                className="group relative h-full overflow-hidden border-border bg-card transition-all hover:shadow-md hover:shadow-lavender/10 hover:-translate-y-0.5 rounded-xl"
              >
                <CardHeader className="pb-3">
                  <div
                    className={`mb-3 inline-flex size-11 items-center justify-center rounded-lg ${bgColors[i]}`}
                  >
                    <Icon className={`size-5 ${colors[i]}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {card.title}
                    </h3>
                    {badge && (
                      <Badge
                        variant="outline"
                        className="border-lavender/30 text-lavender text-[10px] px-1.5 py-0"
                      >
                        {badge.label}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );

            if (href) {
              return (
                <Link key={i} href={href} className="block">
                  {cardContent}
                </Link>
              );
            }

            return cardContent;
          })}
        </div>
      </div>
    </section>
  );
}
