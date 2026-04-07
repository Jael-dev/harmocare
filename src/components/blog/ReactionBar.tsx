"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart, ThumbsUp, Smile, ThumbsDown, Frown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  toggleReaction,
  getReactionCounts,
  getVisitorReaction,
  type ReactionType,
  type ReactionCounts,
} from "@/app/actions/reactions";

const reactions: { type: ReactionType; icon: typeof Heart; label: string }[] = [
  { type: "heart", icon: Heart, label: "Love" },
  { type: "thumbs_up", icon: ThumbsUp, label: "Like" },
  { type: "smile", icon: Smile, label: "Happy" },
  { type: "thumbs_down", icon: ThumbsDown, label: "Dislike" },
  { type: "sad", icon: Frown, label: "Sad" },
];

function getVisitorId(): string {
  const key = "harmocare_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

interface ReactionBarProps {
  slug: string;
  locale: string;
}

export function ReactionBar({ slug, locale }: ReactionBarProps) {
  const [counts, setCounts] = useState<ReactionCounts>({
    heart: 0,
    thumbs_up: 0,
    smile: 0,
    thumbs_down: 0,
    sad: 0,
  });
  const [selected, setSelected] = useState<ReactionType | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const visitorId = getVisitorId();

    Promise.all([
      getReactionCounts(slug, locale),
      getVisitorReaction(slug, locale, visitorId),
    ]).then(([fetchedCounts, fetchedReaction]) => {
      setCounts(fetchedCounts);
      setSelected(fetchedReaction);
      setLoaded(true);
    });
  }, [slug, locale]);

  function handleReaction(reaction: ReactionType) {
    const visitorId = getVisitorId();
    const formData = new FormData();
    formData.set("slug", slug);
    formData.set("locale", locale);
    formData.set("reaction", reaction);
    formData.set("visitorId", visitorId);

    startTransition(async () => {
      const result = await toggleReaction(formData);
      if (result.success) {
        if (result.counts) setCounts(result.counts);
        setSelected(result.selected ?? null);
      }
    });
  }

  if (!loaded) {
    return (
      <div className="flex justify-center gap-3 py-6">
        {reactions.map(({ type }) => (
          <div
            key={type}
            className="h-10 w-16 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className="flex items-center gap-3">
        {reactions.map(({ type, icon: Icon, label }) => {
          const isSelected = selected === type;
          return (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              disabled={isPending}
              aria-label={label}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-all",
                "hover:border-lavender/50 hover:bg-lavender/5",
                "disabled:pointer-events-none disabled:opacity-50",
                isSelected
                  ? "border-lavender bg-lavender/10 text-lavender"
                  : "border-border text-muted-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  isSelected && type === "heart" && "fill-current"
                )}
              />
              {counts[type] > 0 && <span>{counts[type]}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
