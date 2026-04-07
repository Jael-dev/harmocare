import type { Locale } from "@/dictionaries";

const content = {
  fr: {
    title: "Politique de confidentialité",
    lastUpdated: "Dernière mise à jour : 7 avril 2026",
    sections: [
      {
        heading: "1. Introduction",
        body: "Harmocare (« nous », « notre ») s'engage à protéger la vie privée de ses utilisateurs. La présente politique décrit les données personnelles que nous collectons, comment nous les utilisons et les droits dont vous disposez.",
      },
      {
        heading: "2. Données collectées",
        body: "Nous collectons les données suivantes :",
        list: [
          "Adresse email — lorsque vous rejoignez la liste d'attente ou utilisez le suivi de lecture sur le blog.",
          "Historique de lecture — les articles que vous marquez comme lus, associés à votre adresse email.",
          "Réactions aux articles — un identifiant anonyme (cookie) est utilisé pour enregistrer vos réactions (cœur, pouce, etc.) sans collecter de données personnelles.",
          "Données techniques — adresse IP, type de navigateur, langue préférée, collectées automatiquement par notre hébergeur pour le bon fonctionnement du service.",
        ],
      },
      {
        heading: "3. Utilisation des données",
        body: "Vos données sont utilisées pour :",
        list: [
          "Vous envoyer des informations sur Harmocare si vous avez rejoint la liste d'attente.",
          "Suivre votre parcours de lecture et afficher votre progression.",
          "Afficher le nombre de réactions sur les articles.",
          "Améliorer nos contenus et notre service.",
        ],
      },
      {
        heading: "4. Stockage et sécurité",
        body: "Vos données sont stockées de manière sécurisée sur Supabase (hébergé par AWS dans l'Union européenne). Nous appliquons des politiques de sécurité au niveau des lignes (Row Level Security) pour protéger l'accès aux données. Les mots de passe ne sont jamais stockés en clair.",
      },
      {
        heading: "5. Cookies",
        body: "Nous utilisons des cookies strictement nécessaires au fonctionnement du service :",
        list: [
          "Cookie de lecteur — stocke votre adresse email pour éviter de la ressaisir à chaque visite (durée : 1 an).",
          "Identifiant visiteur — un identifiant aléatoire stocké dans le navigateur pour associer vos réactions aux articles (localStorage).",
          "Cookies d'authentification Supabase — gestion de la session utilisateur.",
        ],
      },
      {
        heading: "6. Partage des données",
        body: "Nous ne vendons, ne louons et ne partageons pas vos données personnelles avec des tiers à des fins commerciales. Vos données peuvent être partagées uniquement avec nos prestataires techniques (Supabase, Vercel) dans le cadre strict du fonctionnement du service.",
      },
      {
        heading: "7. Vos droits",
        body: "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :",
        list: [
          "Droit d'accès — obtenir une copie de vos données personnelles.",
          "Droit de rectification — corriger des données inexactes.",
          "Droit à l'effacement — demander la suppression de vos données.",
          "Droit à la portabilité — recevoir vos données dans un format structuré.",
          "Droit d'opposition — vous opposer au traitement de vos données.",
        ],
      },
      {
        heading: "8. Contact",
        body: "Pour exercer vos droits ou pour toute question relative à cette politique, contactez-nous à : contact@harmocare.com",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: April 7, 2026",
    sections: [
      {
        heading: "1. Introduction",
        body: 'Harmocare ("we", "our") is committed to protecting the privacy of its users. This policy describes the personal data we collect, how we use it, and your rights.',
      },
      {
        heading: "2. Data We Collect",
        body: "We collect the following data:",
        list: [
          "Email address — when you join the waitlist or use the reading tracker on the blog.",
          "Reading history — the articles you mark as read, linked to your email address.",
          "Article reactions — an anonymous identifier (cookie) is used to record your reactions (heart, thumbs up, etc.) without collecting personal data.",
          "Technical data — IP address, browser type, preferred language, automatically collected by our hosting provider for service operation.",
        ],
      },
      {
        heading: "3. How We Use Your Data",
        body: "Your data is used to:",
        list: [
          "Send you information about Harmocare if you joined the waitlist.",
          "Track your reading journey and display your progress.",
          "Display reaction counts on articles.",
          "Improve our content and service.",
        ],
      },
      {
        heading: "4. Storage and Security",
        body: "Your data is securely stored on Supabase (hosted by AWS in the European Union). We apply Row Level Security policies to protect data access. Passwords are never stored in plain text.",
      },
      {
        heading: "5. Cookies",
        body: "We use cookies strictly necessary for the service to function:",
        list: [
          "Reader cookie — stores your email address to avoid re-entering it on each visit (duration: 1 year).",
          "Visitor identifier — a random ID stored in the browser to link your reactions to articles (localStorage).",
          "Supabase authentication cookies — user session management.",
        ],
      },
      {
        heading: "6. Data Sharing",
        body: "We do not sell, rent, or share your personal data with third parties for commercial purposes. Your data may only be shared with our technical providers (Supabase, Vercel) strictly for service operation.",
      },
      {
        heading: "7. Your Rights",
        body: "Under the General Data Protection Regulation (GDPR), you have the following rights:",
        list: [
          "Right of access — obtain a copy of your personal data.",
          "Right to rectification — correct inaccurate data.",
          "Right to erasure — request deletion of your data.",
          "Right to portability — receive your data in a structured format.",
          "Right to object — object to the processing of your data.",
        ],
      },
      {
        heading: "8. Contact",
        body: "To exercise your rights or for any questions regarding this policy, contact us at: contact@harmocare.com",
      },
    ],
  },
} as const;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const t = content[lang] ?? content.fr;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{t.lastUpdated}</p>

      <div className="mt-10 space-y-8">
        {t.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-lg font-semibold text-foreground">
              {section.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </p>
            {"list" in section && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
