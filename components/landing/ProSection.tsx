import Link from "next/link";

export function ProSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-teal-400 font-semibold uppercase tracking-wider text-sm mb-4">
              Pour les professionnels
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pour les orthophonistes et kinésithérapeutes
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Respirfacile est basée sur 9 études cliniques — avec la
              méta-analyse Stanford 2015, n=120 participants. Une approche
              scientifiquement validée pour la rééducation myofonctionnelle.
            </p>
            <ul className="space-y-4 text-gray-200 mb-8">
              {[
                "Suivi d'observance en temps réel",
                "Bilan PDF exportable pour le médecin du sommeil",
                "30 exercices validés cliniquement",
                "Essai 30 jours gratuit, sans carte bancaire",
                "Patients accèdent gratuitement via votre code",
                "Conformité RGPD · Hébergement France",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-teal-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/auth?mode=signup&role=therapist"
              className="inline-flex items-center justify-center rounded-full bg-teal-500 px-8 py-4 text-base font-semibold text-white hover:bg-teal-400 transition-colors"
            >
              Commencer l&apos;essai gratuit →
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <div className="space-y-6">
              <div className="border-l-4 border-teal-500 pl-4">
                <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider">
                  Validé scientifiquement
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  -50% IAH en moyenne
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Méta-analyse Camacho et al. 2015
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                  Facile d&apos;utilisation
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  2 min pour prescrire
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Code généré automatiquement
                </p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4">
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                  Conformité
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  RGPD · Hébergement France
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Données médicales protégées
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Tarifs</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Starter (5 patients)</span>
                    <span className="font-bold">15€/mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pro (20 patients)</span>
                    <span className="font-bold">25€/mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cabinet (illimité)</span>
                    <span className="font-bold">49€/mois</span>
                  </div>
                </div>
                <p className="text-xs text-teal-600 mt-2 font-medium">
                  30 jours gratuits · Sans CB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
