export function ProblemSection() {
  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Le SAOS ne se traite pas uniquement avec le CPAP
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            50% des patients abandonnent leur CPAP dans la première année. La
            rééducation myofonctionnelle est la seule approche qui traite la cause.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "😴",
              stat: "50%",
              title: "Abandon du CPAP",
              description:
                "La moitié des patients ne tolèrent pas le masque CPAP à long terme. Inconfort, bruit, claustrophobie — les raisons sont multiples.",
              color: "bg-red-50 border-red-200",
              statColor: "text-red-600",
            },
            {
              icon: "🏥",
              stat: "93%",
              title: "Des orthos sans outil numérique",
              description:
                "Les orthophonistes prescrivent des exercices OMT sans outil de suivi. L'observance est impossible à mesurer.",
              color: "bg-orange-50 border-orange-200",
              statColor: "text-orange-600",
            },
            {
              icon: "📉",
              stat: "0",
              title: "Solution OMT en France",
              description:
                "Aucune application française dédiée à la rééducation respiratoire pour SAOS. Le marché est inexploité.",
              color: "bg-blue-50 border-blue-200",
              statColor: "text-blue-600",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border-2 p-8 ${item.color}`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <p className={`text-4xl font-bold mb-2 ${item.statColor}`}>
                {item.stat}
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-r from-teal-600 to-blue-600 p-8 md:p-12 text-white text-center">
          <p className="text-2xl md:text-3xl font-bold mb-4">
            La méta-analyse Camacho et al. 2015 (n=120)
          </p>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Démontre que la thérapie myofonctionnelle réduit l&apos;IAH de{" "}
            <strong>50% en moyenne</strong> chez l&apos;adulte, et améliore la
            saturation en oxygène, la somnolence diurne et la qualité du sommeil.
          </p>
        </div>
      </div>
    </section>
  );
}
