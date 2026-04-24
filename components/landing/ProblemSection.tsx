export function ProblemSection() {
  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-forest-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-copper-400 text-sm font-semibold uppercase tracking-widest mb-4">Le problème</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-beige-200 mb-6 text-balance">
            Le SAOS ne se traite pas uniquement avec le CPAP
          </h2>
          <p className="text-lg text-forest-200 max-w-2xl mx-auto leading-relaxed">
            50% des patients abandonnent leur CPAP dans la première année.
            La rééducation myofonctionnelle traite la <em>cause</em>, pas le symptôme.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              number: "50%",
              title: "Abandon du CPAP",
              description: "La moitié des patients ne tolèrent pas le masque CPAP à long terme. Inconfort, bruit, claustrophobie — les raisons sont nombreuses.",
              accent: "text-copper-400",
              border: "border-copper-500/30",
            },
            {
              number: "93%",
              title: "Des orthos sans outil numérique",
              description: "Les orthophonistes prescrivent des exercices OMT sans aucun outil de suivi. L'observance est impossible à mesurer.",
              accent: "text-sage-400",
              border: "border-sage-400/30",
            },
            {
              number: "0",
              title: "Solution OMT en France",
              description: "Aucune application française dédiée à la rééducation respiratoire pour le SAOS. Un marché inexploité.",
              accent: "text-beige-400",
              border: "border-beige-400/20",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-3xl border ${item.border} bg-forest-700/50 backdrop-blur p-8`}
            >
              <p className={`text-5xl font-bold mb-3 ${item.accent} font-display`}>
                {item.number}
              </p>
              <h3 className="text-xl font-semibold text-beige-100 mb-3">
                {item.title}
              </h3>
              <p className="text-forest-300 leading-relaxed text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Scientific proof */}
        <div className="rounded-4xl bg-beige-200 p-8 md:p-12 text-center border border-beige-300">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-500/10 border border-forest-500/20 px-4 py-1.5 text-xs font-semibold text-forest-700 mb-6">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Étude publiée — n=120 patients
          </div>
          <p className="font-display text-3xl md:text-4xl font-bold text-forest-800 mb-4 text-balance">
            Camacho et al. 2015 — Sleep Medicine Reviews
          </p>
          <p className="text-lg text-forest-600 max-w-3xl mx-auto leading-relaxed">
            La thérapie myofonctionnelle réduit l&apos;IAH de{" "}
            <strong className="text-forest-800">50% en moyenne</strong> chez l&apos;adulte,
            et améliore la saturation en oxygène, la somnolence diurne et la qualité du sommeil.
          </p>
        </div>
      </div>
    </section>
  );
}
