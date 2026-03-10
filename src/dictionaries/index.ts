import fr from "./fr";
import en from "./en";

export interface Dictionary {
  nav: {
    home: string;
    blog: string;
    community: string;
    insights: string;
    testimonials: string;
    cta: string;
    language: string;
  };
  hero: {
    badge: string;
    headline: string;
    description: string;
    cta: string;
  };
  features: {
    title: string;
    cards: readonly { title: string; description: string }[];
  };
  waitlist: {
    headline: string;
    description: string;
    placeholder: string;
    cta: string;
    success: string;
    followUs: string;
  };
  footer: {
    tagline: string;
    legal: string;
    legalLinks: string;
  };
}

const dictionaries: Record<string, Dictionary> = { fr, en };

export type Locale = "fr" | "en";

export const locales: Locale[] = ["fr", "en"];
export const defaultLocale: Locale = "fr";

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang] ?? dictionaries[defaultLocale];
}
