import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, BarChart3, MessageCircle } from "lucide-react";
import type { Dictionary } from "@/dictionaries";

interface FeatureCardsProps {
  dict: Dictionary;
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

export function FeatureCards({ dict }: FeatureCardsProps) {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {dict.features.title}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.features.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <Card
                key={i}
                className="group relative overflow-hidden border-border/40 bg-card transition-all hover:shadow-lg hover:shadow-lavender/5 hover:-translate-y-0.5 rounded-2xl"
              >
                <CardHeader className="pb-3">
                  <div
                    className={`mb-3 inline-flex size-11 items-center justify-center rounded-xl ${bgColors[i]}`}
                  >
                    <Icon className={`size-5 ${colors[i]}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-lavender/30 text-lavender text-[10px] px-1.5 py-0"
                    >
                      Bient\u00f4t
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
