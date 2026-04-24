import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Tarifs — Respirfacile",
  description:
    "Starter 15€/mois · Pro 25€/mois · Cabinet 49€/mois. 30 jours d'essai gratuit sans carte bancaire. Patients accèdent gratuitement.",
};

const plans = [
  {
    name: "Starter",
    price: 15,
    priceAnnual: 12,
    patients: "5 patients",
    description: "Pour démarrer la pratique OMT dans votre cabinet",
    features: [
      "5 patients actifs",
      "Tous les exercices (15 exercices)",
      "Suivi d'observance",
      "Bilan PDF basique",
      "Support email",
    ],
    cta: "Commencer l'essai",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 25,
    priceAnnual: 20,
    patients: "20 patients",
    description: "Pour les orthophonistes avec une patientèle SAOS active",
    features: [
      "20 patients actifs",
      "Tous les exercices",
      "Suivi d'observance en temps réel",
      "Bilan PDF complet exportable",
      "Graphiques de progression",
      "Support prioritaire",
    ],
    cta: "Commencer l'essai",
    highlighted: true,
  },
  {
    name: "Cabinet",
    price: 49,
    priceAnnual: 39,
    patients: "Illimité",
    description: "Pour les cabinets multi-praticiens",
    features: [
      "Patients illimités",
      "Plusieurs praticiens",
      "Tous les exercices",
      "Bilan PDF complet",
      "Intégration agenda (bientôt)",
      "Support dédié",
    ],
    cta: "Commencer l'essai",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="w-full">
      <Navbar />
      <main className="w-full">
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tarifs transparents
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              30 jours d&apos;essai gratuit · Sans carte bancaire · Annulable à tout moment
            </p>
            <p className="text-teal-600 font-semibold">
              Les patients accèdent toujours gratuitement via votre code Pro
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 border-2 ${
                  plan.highlighted
                    ? "border-teal-500 bg-teal-50 shadow-xl shadow-teal-100"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block rounded-full bg-teal-600 px-4 py-1 text-sm font-semibold text-white mb-4">
                    Le plus populaire
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {plan.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}€
                  </span>
                  <span className="text-gray-500">/mois</span>
                  <p className="text-sm text-teal-600 mt-1">
                    ou {plan.priceAnnual}€/mois en annuel
                  </p>
                </div>
                <div className="rounded-xl bg-gray-100 px-4 py-2 text-center mb-6">
                  <span className="font-semibold text-gray-700">
                    {plan.patients}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-teal-500 font-bold mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/auth?mode=signup&role=therapist&plan=${plan.name.toLowerCase()}`}
                  className={`block w-full text-center rounded-full py-3 font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "bg-gray-900 text-white hover:bg-gray-700"
                  }`}
                >
                  {plan.cta}
                </Link>
                <p className="text-center text-xs text-gray-400 mt-3">
                  30 jours gratuits · Sans CB
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Des questions sur les tarifs ?
            </h2>
            <p className="text-gray-600 mb-6">
              Vous avez un grand cabinet, une structure hospitalière ou des
              besoins spécifiques ? Contactez-nous.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border-2 border-teal-600 px-8 py-3 text-teal-600 font-semibold hover:bg-teal-50 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
