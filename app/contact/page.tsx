import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Contact — Respirfacile",
};

export default function ContactPage() {
  return (
    <div className="w-full">
      <Navbar />
      <main className="w-full">
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-beige-200 bg-texture">
          <div className="max-w-2xl mx-auto">
            <p className="text-copper-500 text-sm font-semibold uppercase tracking-widest mb-4">Contact</p>
            <h1 className="font-display text-5xl font-bold text-forest-800 mb-4">On vous répond.</h1>
            <p className="text-lg text-forest-600">
              Une question, un partenariat, un retour terrain ? Écrivez-nous.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-beige-300">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-beige p-8">
              <p className="text-xs font-semibold text-copper-500 uppercase tracking-widest mb-2">Email</p>
              <a
                href="mailto:clement@respirfacile.fr"
                className="text-forest-700 hover:text-forest-900 font-semibold text-lg transition-colors"
              >
                clement@respirfacile.fr
              </a>
            </div>
            <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-beige p-8">
              <p className="font-semibold text-forest-800 mb-2">
                Orthophonistes & kinésithérapeutes
              </p>
              <p className="text-forest-600 text-sm leading-relaxed">
                Vous souhaitez tester Respirfacile avec vos patients ? Commencez
                l&apos;essai gratuit 30 jours directement — aucune démarche administrative.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
