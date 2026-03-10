"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Instagram, Linkedin, Loader2 } from "lucide-react";
import { joinWaitlist } from "@/app/actions/waitlist";
import type { Dictionary } from "@/dictionaries";

const schema = z.object({
  email: z.email("Adresse email invalide"),
});

type FormData = z.infer<typeof schema>;

interface WaitlistProps {
  dict: Dictionary;
}

export function Waitlist({ dict }: WaitlistProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const form = new FormData();
    form.set("email", data.email);

    const result = await joinWaitlist(form);

    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-[#2A2050] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {dict.waitlist.headline}
        </h2>
        <p className="mt-4 text-lg text-white/60 leading-relaxed">
          {dict.waitlist.description}
        </p>

        {submitted ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-brand">
            <CheckCircle className="size-5" />
            <span className="text-lg font-medium">{dict.waitlist.success}</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <div className="w-full max-w-sm">
              <Input
                type="email"
                placeholder={dict.waitlist.placeholder}
                className="h-12 rounded-full border-white/15 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-lavender"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-left text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
              {serverError && (
                <p className="mt-1 text-left text-sm text-red-400">
                  {serverError}
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-12 bg-gradient-to-r from-brand to-lavender text-white hover:opacity-90 font-semibold px-8 rounded-full disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                dict.waitlist.cta
              )}
            </Button>
          </form>
        )}

        {/* Social links */}
        <div className="mt-10">
          <p className="mb-3 text-sm text-white/50">{dict.waitlist.followUs}</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#"
              className="text-white/60 transition-colors hover:text-brand"
              aria-label="Instagram"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href="#"
              className="text-white/60 transition-colors hover:text-brand"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-20 -right-20 size-[300px] rounded-full bg-lavender/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-[300px] rounded-full bg-rose/10 blur-3xl" />
    </section>
  );
}
