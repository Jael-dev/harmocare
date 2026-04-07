"use server";

import { z } from "zod/v4";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const reactionTypes = ["heart", "thumbs_up", "smile", "thumbs_down", "sad"] as const;
export type ReactionType = (typeof reactionTypes)[number];

const toggleSchema = z.object({
  slug: z.string().min(1),
  locale: z.string().min(1),
  reaction: z.enum(reactionTypes),
  visitorId: z.string().min(1),
});

export type ReactionCounts = Record<ReactionType, number>;

export async function toggleReaction(formData: FormData): Promise<{
  success: boolean;
  counts?: ReactionCounts;
  selected?: ReactionType | null;
}> {
  const parsed = toggleSchema.safeParse({
    slug: formData.get("slug"),
    locale: formData.get("locale"),
    reaction: formData.get("reaction"),
    visitorId: formData.get("visitorId"),
  });

  if (!parsed.success) {
    return { success: false };
  }

  const { slug, locale, reaction, visitorId } = parsed.data;

  // Check if visitor already reacted
  const { data: existing } = await supabase
    .from("article_reactions")
    .select("id, reaction")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("visitor_id", visitorId)
    .single();

  let selected: ReactionType | null = reaction;

  if (existing) {
    if (existing.reaction === reaction) {
      // Same reaction — remove it
      await supabase.from("article_reactions").delete().eq("id", existing.id);
      selected = null;
    } else {
      // Different reaction — update it
      await supabase
        .from("article_reactions")
        .update({ reaction })
        .eq("id", existing.id);
    }
  } else {
    // New reaction
    await supabase
      .from("article_reactions")
      .insert({ slug, locale, reaction, visitor_id: visitorId });
  }

  const counts = await getReactionCounts(slug, locale);
  return { success: true, counts, selected };
}

export async function getReactionCounts(
  slug: string,
  locale: string
): Promise<ReactionCounts> {
  const { data } = await supabase
    .from("article_reactions")
    .select("reaction")
    .eq("slug", slug)
    .eq("locale", locale);

  const counts: ReactionCounts = {
    heart: 0,
    thumbs_up: 0,
    smile: 0,
    thumbs_down: 0,
    sad: 0,
  };

  data?.forEach((row) => {
    const r = row.reaction as ReactionType;
    if (r in counts) counts[r]++;
  });

  return counts;
}

export async function getVisitorReaction(
  slug: string,
  locale: string,
  visitorId: string
): Promise<ReactionType | null> {
  const { data } = await supabase
    .from("article_reactions")
    .select("reaction")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("visitor_id", visitorId)
    .single();

  return (data?.reaction as ReactionType) ?? null;
}
