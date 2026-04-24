import Link from "next/link";

// Server Component — rendered at build/request time for SSR SEO
export function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-teal-50 via-white to-blue-50 py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-teal-100 opacity-40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-100 opacity-30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-medium text-teal-800 mb-6">
              <span>🔬</span>
              <span>Validé par 9 études cliniques · Méta-analyse Stanford 2015</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Rééduquez votre{" "}
              <span className="text-teal-600">respiration</span>{" "}
              pour mieux dormir
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Prescrit par votre orthophoniste. Pratiqué à domicile. La thérapie
              myofonctionnelle orofaciale (OMT) réduit l&apos;IAH de{" "}
              <strong>50% en moyenne</strong> chez les patients SAOS.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/auth?mode=signup&role=therapist"
                className="inline-flex items-center justify-center rounded-full bg-teal-600 px-8 py-4 text-base font-semibold text-white hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
              >
                Je suis orthophoniste — Essai 30j gratuit
              </Link>
              <Link
                href="/auth?mode=signup&role=patient"
                className="inline-flex items-center justify-center rounded-full border-2 border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 hover:border-teal-600 hover:text-teal-600 transition-colors"
              >
                J&apos;ai un code Pro
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "-50%", label: "IAH moyen", sub: "Camacho 2015" },
                { value: "250+", label: "Patients actifs", sub: "" },
                { value: "40+", label: "Orthophonistes", sub: "" },
                { value: "8 sem.", label: "Pour des résultats", sub: "" },
              ].map((stat) => (
                <div key={stat.value} className="text-center">
                  <p className="text-2xl font-bold text-teal-600">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                  {stat.sub && (
                    <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: animated breathing widget */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-teal-100 p-8 border border-gray-100">
              <div className="text-center mb-6">
                <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-2">
                  Pause Contrôlée
                </p>
                <p className="text-4xl font-bold text-gray-900">42 pas</p>
                <p className="text-sm text-gray-500 mt-1">Score du jour</p>
              </div>

              {/* Breathing circle */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-4xl">🫁</span>
                  <div className="absolute inset-0 rounded-full border-4 border-teal-300 opacity-50 animate-ping" />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Séances cette semaine", value: "5/7", color: "text-teal-600" },
                  { label: "Progression", value: "+18 pas", color: "text-green-600" },
                  { label: "Prochain objectif", value: "50 pas", color: "text-blue-600" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-teal-50 p-3 text-center">
                <p className="text-xs text-teal-700">
                  📊 Bilan PDF envoyé à votre orthophoniste
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
