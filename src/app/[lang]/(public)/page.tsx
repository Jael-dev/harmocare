import { getDictionary, type Locale } from "@/dictionaries";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { Waitlist } from "@/components/landing/Waitlist";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = getDictionary(lang);

  return (
    <>
      <Hero dict={dict} />
      <FeatureCards dict={dict} />
      <Waitlist dict={dict} />
    </>
  );
}
