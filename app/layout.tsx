import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Respirfacile — Rééducation respiratoire pour l'apnée du sommeil",
  description:
    "Application de thérapie myofonctionnelle orofaciale (OMT) pour patients SAOS. Prescrite par les orthophonistes, pratiquée à domicile. Basée sur la méta-analyse Camacho 2015 (-50% IAH).",
  keywords: [
    "apnée du sommeil",
    "SAOS",
    "thérapie myofonctionnelle",
    "OMT",
    "orthophoniste",
    "rééducation respiratoire",
  ],
  openGraph: {
    title: "Respirfacile — Rééducation respiratoire pour l'apnée du sommeil",
    description:
      "Prescrite par votre orthophoniste. -50% IAH en moyenne (Camacho et al. 2015). Essai 30 jours gratuit.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
