import { getDictionary, type Locale } from "@/dictionaries";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar dict={dict} lang={lang} />
      <main className="flex-1">
        <Hero dict={dict} />
        <FeatureCards dict={dict} />
        <Waitlist dict={dict} />
      </main>
      <Footer dict={dict} lang={lang} />
    </div>
  );
}
