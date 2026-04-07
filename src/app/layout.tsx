import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harmocare — Ton compagnon de bien-\u00eatre hormonal",
  description:
    "Harmocare est une app mobile gamifi\u00e9e qui aide les femmes \u00e0 comprendre leur \u00e9quilibre hormonal gr\u00e2ce au micro-apprentissage et au suivi personnalis\u00e9.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
