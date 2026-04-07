"use client";

import { useState } from "react";
import { Share2, Link, Check, Twitter, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  slug: string;
  locale: string;
  title: string;
}

const baseUrl = "https://harmocares.com";

export function ShareButton({ slug, locale, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const url = `${baseUrl}/${locale}/blog/${slug}`;

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Share2 className="size-4" />
        <span>{locale === "fr" ? "Partager cet article" : "Share this article"}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={copyLink}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-all",
            "hover:border-brand/50 hover:bg-brand/5",
            copied
              ? "border-green bg-green/10 text-green"
              : "border-border text-muted-foreground"
          )}
        >
          {copied ? <Check className="size-4" /> : <Link className="size-4" />}
          {copied
            ? locale === "fr" ? "Copié !" : "Copied!"
            : locale === "fr" ? "Copier le lien" : "Copy link"}
        </button>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-brand/50 hover:bg-brand/5 hover:text-foreground"
          aria-label="Share on X"
        >
          <Twitter className="size-4" />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-brand/50 hover:bg-brand/5 hover:text-foreground"
          aria-label="Share on Facebook"
        >
          <Facebook className="size-4" />
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-full border border-border px-3 py-2 text-sm text-muted-foreground transition-all hover:border-brand/50 hover:bg-brand/5 hover:text-foreground"
          aria-label="Share on WhatsApp"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
