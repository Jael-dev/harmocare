import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin } from "lucide-react";
import type { Dictionary, Locale } from "@/dictionaries";

interface FooterProps {
  dict: Dictionary;
  lang: Locale;
}

export function Footer({ dict, lang }: FooterProps) {
  const links = [
    { label: dict.nav.blog, href: `/${lang}/blog` },
    { label: dict.nav.community, href: "#features" },
    { label: dict.nav.insights, href: "#features" },
    { label: dict.nav.testimonials, href: "#features" },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href={`/${lang}`} className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Harmocare" width={28} height={28} />
              <span className="font-bold text-foreground">Harmocare</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Instagram"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-5" />
            </a>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-8 flex flex-col items-center gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>{dict.footer.legal}</p>
          <Link href={`/${lang}/privacy`} className="hover:text-foreground">
            {dict.footer.privacyPolicy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
