"use server";

import { z } from "zod/v4";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const markAsReadSchema = z.object({
  email: z.email(),
  slug: z.string().min(1),
  locale: z.string().min(1),
});

export type ReadResult =
  | { success: true; totalRead: number }
  | { success: false; error: string };

export async function markAsRead(formData: FormData): Promise<ReadResult> {
  const parsed = markAsReadSchema.safeParse({
    email: formData.get("email"),
    slug: formData.get("slug"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { email, slug, locale } = parsed.data;

  // Upsert reader
  const { data: reader, error: readerError } = await supabase
    .from("readers")
    .upsert({ email }, { onConflict: "email" })
    .select("id")
    .single();

  if (readerError || !reader) {
    return { success: false, error: readerError?.message ?? "Failed to save reader" };
  }

  // Insert reading history (ignore duplicate)
  const { error: historyError } = await supabase
    .from("reading_history")
    .upsert(
      { reader_id: reader.id, slug, locale },
      { onConflict: "reader_id,slug,locale" }
    );

  if (historyError) {
    return { success: false, error: historyError.message };
  }

  // Get total articles read
  const { count } = await supabase
    .from("reading_history")
    .select("*", { count: "exact", head: true })
    .eq("reader_id", reader.id);

  return { success: true, totalRead: count ?? 1 };
}

export async function getReaderStats(
  email: string
): Promise<{ totalRead: number; readSlugs: string[] }> {
  const { data: reader } = await supabase
    .from("readers")
    .select("id")
    .eq("email", email)
    .single();

  if (!reader) return { totalRead: 0, readSlugs: [] };

  const { data: history, count } = await supabase
    .from("reading_history")
    .select("slug", { count: "exact" })
    .eq("reader_id", reader.id);

  return {
    totalRead: count ?? 0,
    readSlugs: history?.map((h) => h.slug) ?? [],
  };
}
