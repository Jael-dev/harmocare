"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import type { Dictionary, Locale } from "@/dictionaries";

interface NavbarProps {
  dict: Dictionary;
  lang: Locale;
}

const navLinks = [
  { key: "blog" as const, href: "#features" },
  { key: "community" as const, href: "#features" },
  { key: "insights" as const, href: "#features" },
  { key: "testimonials" as const, href: "#features" },
];

export function Navbar({ dict, lang }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <Image src="/logo.png" alt="Harmocare" width={32} height={32} />
          <span className="text-lg font-bold text-foreground">Harmocare</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {dict.nav[link.key]}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-sm transition-all hover:bg-muted hover:text-foreground"
            >
              <Globe className="size-4" />
              <span className="sr-only">{dict.nav.language}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/fr" className={lang === "fr" ? "font-bold" : ""}>
                  Fran\u00e7ais
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/en" className={lang === "en" ? "font-bold" : ""}>
                  English
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          {/* Desktop CTA */}
          <Link
            href="#waitlist"
            className={cn(
              buttonVariants(),
              "hidden md:inline-flex bg-gradient-to-r from-brand to-lavender text-white hover:opacity-90 font-semibold rounded-full"
            )}
          >
            {dict.nav.cta}
          </Link>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {dict.nav[link.key]}
              </Link>
            ))}
            <Link
              href="#waitlist"
              className={cn(
                buttonVariants(),
                "mt-2 bg-gradient-to-r from-brand to-lavender text-white hover:opacity-90 font-semibold rounded-full"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {dict.nav.cta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
