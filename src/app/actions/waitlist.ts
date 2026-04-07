"use server";

import { z } from "zod/v4";
import { createClient } from "@supabase/supabase-js";

const waitlistSchema = z.object({
  email: z.email("Adresse email invalide"),
});

export type WaitlistResult =
  | { success: true; alreadyExisted?: boolean }
  | { success: false; error: string };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function joinWaitlist(formData: FormData): Promise<WaitlistResult> {
  const parsed = waitlistSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("waitlist")
    .insert({ email: parsed.data.email });

  if (error) {
    if (error.code === "23505") {
      return { success: true, alreadyExisted: true };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}
