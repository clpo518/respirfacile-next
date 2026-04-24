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
      <main className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
        <p className="text-xl text-gray-600 mb-10">
          Une question, un partenariat, un retour terrain ? Écrivez-nous.
        </p>
        <div className="space-y-6">
          <div className="rounded-2xl bg-teal-50 border border-teal-200 p-6">
            <p className="font-semibold text-teal-800 mb-1">Email</p>
            <a
              href="mailto:clement@respirfacile.fr"
              className="text-teal-600 hover:underline"
            >
              clement@respirfacile.fr
            </a>
          </div>
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6">
            <p className="font-semibold text-gray-800 mb-2">
              Orthophonistes & kinésithérapeutes
            </p>
            <p className="text-gray-600 text-sm">
              Vous souhaitez tester Respirfacile avec vos patients ? Commencez
              l&apos;essai gratuit 30 jours directement — aucune démarche administrative.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
