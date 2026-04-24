import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Respirfacile",
};

export default function PrivacyPage() {
  return (
    <div className="w-full">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Politique de confidentialité
        </h1>
        <p className="text-gray-500 mb-10">Dernière mise à jour : avril 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Données collectées
            </h2>
            <p>
              Respirfacile collecte les données nécessaires au fonctionnement du
              service : email, nom, rôle (patient/thérapeute), données de séances
              (métriques d&apos;exercices, durées, scores). Aucune donnée n&apos;est vendue
              à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Hébergement et sécurité
            </h2>
            <p>
              Toutes les données sont hébergées en France via Supabase (région
              EU West). Les données médicales sont protégées par Row Level
              Security — chaque patient ne voit que ses propres données.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Vos droits (RGPD)
            </h2>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
              rectification et de suppression de vos données. Contactez-nous à{" "}
              <a href="mailto:clement@respirfacile.fr" className="text-teal-600 hover:underline">
                clement@respirfacile.fr
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
