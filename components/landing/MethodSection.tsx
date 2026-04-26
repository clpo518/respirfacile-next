export function MethodSection() {
  const steps = [
    {
      num: "01",
      emoji: "📋",
      title: "Vous prescrivez",
      desc: "Vous créez le programme en 2 minutes selon le profil : SAOS léger, sévère sous CPAP, TMOF, ou mixte. Vous envoyez un code à votre patient.",
      color: "#2D5016",
    },
    {
      num: "02",
      emoji: "🫁",
      title: "Le patient pratique",
      desc: "15–20 min/jour, guidé pas à pas. Timer intégré, instructions claires, score enregistré automatiquement. Zéro friction.",
      color: "#8B4513",
    },
    {
      num: "03",
      emoji: "📊",
      title: "Vous suivez à distance",
      desc: "Journal de bord hebdomadaire, alertes inactivité, graphiques de progression. Export PDF bilan en un clic pour le médecin du sommeil.",
      color: "#2D5016",
    },
  ]
  return (
    <section id="methode" className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-copper-500 mb-3">Comment ça marche</p>
          <h2 className="text-4xl md:text-5xl font-bold text-forest-800 mb-4">Simple pour vous.<br/>Efficace pour eux.</h2>
          <p className="text-xl text-forest-500 max-w-xl mx-auto font-light">Un workflow en 3 étapes, pensé pour s'intégrer dans votre pratique sans friction.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {steps.map((step) => (
            <div key={step.num} className="relative">
              <div className="bg-beige-100 rounded-3xl p-8 h-full border border-beige-300/50 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-4xl font-bold text-beige-400 leading-none">{step.num}</span>
                  <span className="text-3xl">{step.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-forest-800 mb-3">{step.title}</h3>
                <p className="text-forest-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-[#2D5016] rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-xl mb-1">Résultats typiques en 8 semaines</p>
            <p className="text-white/70 text-sm max-w-xl">Les études montrent −50% d&apos;IAH avec un protocole OMT rigoureux. Respirfacile structure cette pratique pour maximiser l&apos;observance.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            {[
              { val: "50%", lab: "réduction IAH" },
              { val: "89%", lab: "observance" },
              { val: "8 sem", lab: "premiers résultats" },
            ].map((s) => (
              <div key={s.lab} className="text-center">
                <p className="text-3xl font-bold text-white">{s.val}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.lab}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
