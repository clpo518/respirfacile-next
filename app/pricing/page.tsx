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
        {/* Hero pricing */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-beige-200 bg-texture">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-copper-500 text-sm font-semibold uppercase tracking-widest mb-4">Tarifs</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-forest-800 mb-6 text-balance">
              Simple et transparent
            </h1>
            <p className="text-lg text-forest-600 mb-3 max-w-xl mx-auto">
              30 jours d&apos;essai gratuit · Sans carte bancaire · Annulable à tout moment
            </p>
            <p className="text-sm font-semibold text-forest-700 bg-forest-500/10 border border-forest-500/20 inline-block rounded-full px-4 py-1.5">
              Les patients accèdent toujours gratuitement via votre code Pro
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-beige-300">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-4xl p-8 border-2 relative overflow-hidden transition-transform hover:-translate-y-1 duration-200 ${
                  plan.highlighted
                    ? "border-forest-500 bg-beige-100 shadow-forest-lg"
                    : "border-beige-300 bg-beige-100 shadow-beige"
                }`}
              >
                {/* Top accent bar */}
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-400 to-copper-400" />
                )}

                {plan.highlighted && (
                  <div className="inline-block rounded-full bg-forest-500 px-4 py-1 text-xs font-semibold text-beige-100 mb-4">
                    Le plus populaire
                  </div>
                )}

                <h2 className="font-display text-2xl font-bold text-forest-800 mb-1">
                  {plan.name}
                </h2>
                <p className="text-forest-500 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="font-display text-5xl font-bold text-forest-800">
                    {plan.price}€
                  </span>
                  <span className="text-forest-500 text-sm">/mois</span>
                  <p className="text-xs text-copper-500 mt-1 font-medium">
                    ou {plan.priceAnnual}€/mois en annuel
                  </p>
                </div>

                <div className="rounded-2xl bg-forest-500/8 border border-forest-500/15 px-4 py-2.5 text-center mb-6">
                  <span className="font-semibold text-forest-700 text-sm">
                    {plan.patients}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-forest-700">
                      <div className="w-4 h-4 rounded-full bg-forest-500/15 border border-forest-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/auth?mode=signup&role=therapist&plan=${plan.name.toLowerCase()}`}
                  className={`block w-full text-center rounded-full py-3.5 text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-forest-500 text-beige-100 hover:bg-forest-600 shadow-forest"
                      : "bg-forest-800 text-beige-200 hover:bg-forest-700"
                  }`}
                >
                  {plan.cta}
                </Link>
                <p className="text-center text-xs text-forest-400 mt-3">
                  30 jours gratuits · Sans CB
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-beige-200">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold text-forest-800 mb-4">
              Des questions sur les tarifs ?
            </h2>
            <p className="text-forest-600 mb-6 text-sm">
              Grand cabinet, structure hospitalière ou besoins spécifiques ? Contactez-nous.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border-2 border-forest-500 px-8 py-3 text-forest-700 font-semibold hover:bg-forest-500 hover:text-beige-100 transition-colors text-sm"
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
