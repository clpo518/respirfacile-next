import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — Respirfacile",
};

export default function TermsPage() {
  return (
    <div className="w-full">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Conditions générales d&apos;utilisation
        </h1>
        <p className="text-gray-500 mb-10">Dernière mise à jour : avril 2026</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              1. Objet du service
            </h2>
            <p>
              Respirfacile est une application de rééducation respiratoire à
              destination des patients souffrant d&apos;apnée du sommeil (SAOS) et de
              troubles myofonctionnels orofaciaux (TMOF). Le service est prescrit
              par des professionnels de santé (orthophonistes, kinésithérapeutes).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              2. Avertissement médical
            </h2>
            <p>
              Respirfacile est un outil de rééducation complémentaire. Il ne
              remplace pas le diagnostic médical, la consultation d&apos;un médecin du
              sommeil ou le traitement CPAP prescrit. Toute modification de
              traitement doit être discutée avec votre médecin.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              3. Abonnement et résiliation
            </h2>
            <p>
              L&apos;abonnement orthophoniste est mensuel ou annuel. La résiliation est
              possible à tout moment depuis l&apos;espace paramètres. Aucun
              remboursement partiel du mois en cours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              4. Contact
            </h2>
            <p>
              Respirfacile — Clément Pontegnier, Annecy, France.{" "}
              <a href="mailto:clement@respirfacile.fr" className="text-teal-600 hover:underline">
                clement@respirfacile.fr
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
