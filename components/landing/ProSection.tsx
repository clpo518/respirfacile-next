import Link from "next/link";

export function ProSection() {
  return (
    <section className="relative w-full bg-beige-300 py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-forest-800 hidden lg:block rounded-l-[4rem]" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: features */}
          <div className="relative z-10">
            <p className="text-copper-500 text-sm font-semibold uppercase tracking-widest mb-4">
              Pour les professionnels
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-forest-800 mb-6 text-balance leading-tight">
              L&apos;outil qu&apos;attendaient les orthophonistes
            </h2>
            <p className="text-lg text-forest-600 mb-8 leading-relaxed">
              Respirfacile est bâti sur 9 études cliniques. La méta-analyse Camacho 2015
              (n=120) montre -50% d&apos;IAH avec la thérapie myofonctionnelle.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Suivi d'observance en temps réel",
                "Bilan PDF exportable pour le médecin du sommeil",
                "30+ exercices validés cliniquement",
                "Essai 30 jours gratuit, sans carte bancaire",
                "Patients accèdent gratuitement via votre code",
                "Conformité RGPD · Hébergement France",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-forest-500/15 border border-forest-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-forest-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/auth?mode=signup&role=therapist"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-500 px-8 py-4 text-base font-semibold text-beige-100 hover:bg-forest-600 transition-colors shadow-forest group"
            >
              Commencer l&apos;essai gratuit
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right: stats card */}
          <div className="relative z-10 lg:pl-8">
            <div className="bg-beige-100 rounded-4xl border border-beige-300 shadow-forest-lg p-8 lg:p-10">
              <div className="space-y-6 mb-8">
                {[
                  {
                    label: "Résultat scientifique",
                    value: "-50% IAH en moyenne",
                    sub: "Camacho et al. 2015",
                    color: "bg-forest-500",
                  },
                  {
                    label: "Facilité d'utilisation",
                    value: "2 min pour prescrire",
                    sub: "Code généré automatiquement",
                    color: "bg-copper-500",
                  },
                  {
                    label: "Conformité",
                    value: "RGPD · Hébergement FR",
                    sub: "Données médicales protégées",
                    color: "bg-sage-400",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className={`w-1 self-stretch rounded-full ${item.color} flex-shrink-0`} />
                    <div>
                      <p className="text-xs font-semibold text-forest-500 uppercase tracking-wide mb-1">
                        {item.label}
                      </p>
                      <p className="text-xl font-bold text-forest-800">{item.value}</p>
                      <p className="text-sm text-forest-500 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing summary */}
              <div className="rounded-3xl bg-forest-800 p-6">
                <p className="text-sm font-semibold text-beige-300 mb-4">Tarifs simples</p>
                <div className="space-y-3">
                  {[
                    { plan: "Starter", desc: "5 patients", price: "15€/mois" },
                    { plan: "Pro", desc: "20 patients", price: "25€/mois" },
                    { plan: "Cabinet", desc: "Illimité", price: "49€/mois" },
                  ].map((t) => (
                    <div key={t.plan} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-beige-100">{t.plan}</span>
                        <span className="text-xs text-forest-400 ml-2">{t.desc}</span>
                      </div>
                      <span className="text-sm font-bold text-copper-400">{t.price}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-forest-400 mt-4 pt-4 border-t border-forest-700">
                  30 jours gratuits · Sans carte bancaire
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
