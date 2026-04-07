import { getDictionary, type Locale } from "@/dictionaries";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { WaitlistProvider } from "@/components/landing/WaitlistContext";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = getDictionary(lang);

  return (
    <WaitlistProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar dict={dict} lang={lang} />
        <main className="flex-1">{children}</main>
        <Footer dict={dict} lang={lang} />
      </div>
    </WaitlistProvider>
  );
}
