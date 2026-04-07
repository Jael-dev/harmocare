"use client";

import { useEffect, useState, useTransition } from "react";
import { BookCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { markAsRead, getReaderStats } from "@/app/actions/reading";

const COOKIE_KEY = "harmocare_reader_email";

function getStoredEmail(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function storeEmail(email: string) {
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(email)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

interface ReadTrackerProps {
  slug: string;
  locale: string;
}

export function ReadTracker({ slug, locale }: ReadTrackerProps) {
  const [email, setEmail] = useState("");
  const [storedEmail, setStoredEmail] = useState<string | null>(null);
  const [alreadyRead, setAlreadyRead] = useState(false);
  const [totalRead, setTotalRead] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = getStoredEmail();
    if (saved) {
      setStoredEmail(saved);
      setEmail(saved);
      getReaderStats(saved).then((stats) => {
        setTotalRead(stats.totalRead);
        if (stats.readSlugs.includes(slug)) {
          setAlreadyRead(true);
          setDone(true);
        }
        setLoaded(true);
      });
    } else {
      setLoaded(true);
    }
  }, [slug]);

  function handleSubmit() {
    const submitEmail = storedEmail || email;
    if (!submitEmail) return;

    setError(null);
    const formData = new FormData();
    formData.set("email", submitEmail);
    formData.set("slug", slug);
    formData.set("locale", locale);

    startTransition(async () => {
      const result = await markAsRead(formData);
      if (result.success) {
        storeEmail(submitEmail);
        setStoredEmail(submitEmail);
        setTotalRead(result.totalRead);
        setDone(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (!loaded) return null;

  // Already marked or just marked
  if (done) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-4 text-sm text-muted-foreground">
        <BookCheck className="size-5 text-lavender" />
        <span>
          {alreadyRead ? (
            locale === "fr" ? (
              <>Vous avez déjà lu cet article. <strong>{totalRead} article{totalRead > 1 ? "s" : ""} lu{totalRead > 1 ? "s" : ""}</strong> au total.</>
            ) : (
              <>You&apos;ve already read this article. <strong>{totalRead} article{totalRead > 1 ? "s" : ""} read</strong> so far.</>
            )
          ) : (
            locale === "fr" ? (
              <>Enregistré ! <strong>{totalRead} article{totalRead > 1 ? "s" : ""} lu{totalRead > 1 ? "s" : ""}</strong> au total.</>
            ) : (
              <>Saved! <strong>{totalRead} article{totalRead > 1 ? "s" : ""} read</strong> so far.</>
            )
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card px-6 py-6">
      <p className="mb-4 text-center text-sm font-medium text-foreground">
        {locale === "fr"
          ? "Cet article vous a plu ? Suivez votre parcours de lecture."
          : "Enjoyed this? Track your reading journey."}
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {!storedEmail && (
          <div className="relative w-full max-w-xs">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isPending || (!storedEmail && !email)}
          className="bg-gradient-to-r from-brand to-lavender text-white hover:opacity-90 rounded-full font-semibold"
        >
          <BookCheck className="mr-2 size-4" />
          {locale === "fr" ? "J'ai lu cet article" : "Mark as read"}
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
