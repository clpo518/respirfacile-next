export function MethodSection() {
  const steps = [
    {
      number: "01",
      icon: "🩺",
      title: "L'orthophoniste prescrit",
      description:
        "En 2 minutes, l'ortho crée le profil patient, choisit le programme adapté (SAOS léger, TMOF, mixte) et envoie le code d'accès.",
      detail: "Starter · Pro · Cabinet — 30 jours gratuits sans CB",
    },
    {
      number: "02",
      icon: "🏠",
      title: "Le patient s'entraîne",
      description:
        "15-20 minutes par jour à domicile. Exercices guidés : Pause Contrôlée, cohérence cardiaque, myofonctionnel. Progression mesurée en temps réel.",
      detail: "Accès 100% gratuit via le code Pro de l'ortho",
    },
    {
      number: "03",
      icon: "📊",
      title: "L'ortho suit et exporte",
      description:
        "Tableau de bord en temps réel. Bilan PDF exportable pour le médecin du sommeil. Courbes de progression par exercice.",
      detail: "Compatible HAS · RGPD · Hébergement France",
    },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment ça fonctionne
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un outil pensé pour le parcours de soin — pas une app fitness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200" />

          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-teal-300 hover:shadow-lg transition-all h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {step.description}
                </p>
                <div className="rounded-lg bg-teal-50 px-4 py-2">
                  <p className="text-xs font-medium text-teal-700">{step.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exercise preview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: "🫁", label: "Pause Contrôlée", desc: "Tolérance CO₂" },
            { icon: "💓", label: "Cohérence cardiaque", desc: "5-5 · 4-6" },
            { icon: "👅", label: "Myofonctionnel", desc: "Langue · Palais" },
            { icon: "👃", label: "Respiration nasale", desc: "Rééducation" },
            { icon: "🫁", label: "Diaphragmatique", desc: "Respiration abdominale" },
          ].map((cat) => (
            <div
              key={cat.label}
              className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-sm font-semibold text-gray-800">{cat.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
