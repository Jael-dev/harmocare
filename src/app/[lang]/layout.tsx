import { ThemeProvider } from "next-themes";
import { locales, type Locale } from "@/dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div lang={lang}>{children}</div>
    </ThemeProvider>
  );
}
