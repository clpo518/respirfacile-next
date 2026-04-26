export function ProblemSection() {
  return (
    <section className="py-24 px-4 bg-forest-900 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-forest-400 mb-3">Le vrai problème</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ce que vous connaissez bien.</h2>
          <p className="text-xl text-forest-400 max-w-xl mx-auto font-light">Entre les séances, vos patients livrent à eux-mêmes. Sans structure, les résultats ne viennent pas.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {[
            {
              emoji: "😤",
              title: "Entre les séances, rien",
              desc: "Vos patients oublient. Pas de rappel, pas de structure, pas de suivi. L'observance réelle tourne autour de 30%.",
            },
            {
              emoji: "📭",
              title: "Vous travaillez à l'aveugle",
              desc: "Vous ne savez pas si le patient a eu du mal cette semaine, s'il a arrêté, ou pourquoi. Vous l'apprenez à la prochaine séance.",
            },
            {
              emoji: "📝",
              title: "Comptes-rendus chronophages",
              desc: "Rédiger un bilan de rééducation prend du temps précieux entre deux patients. Et le médecin du sommeil l'attend.",
            },
            {
              emoji: "📉",
              title: "Résultats insuffisants",
              desc: "La littérature est claire : sans pratique quotidienne structurée, les bénéfices chutent de 60%. Le protocole OMT demande de la régularité.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-beige-100/5 border border-white/10 rounded-3xl p-7 hover:bg-beige-100/8 transition-colors">
              <div className="text-3xl mb-4">{item.emoji}</div>
              <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
              <p className="text-forest-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl p-8 md:p-10 text-center border border-[#2D5016]/40" style={{background: "linear-gradient(135deg, #2D5016 0%, #1e3a0f 100%)"}}>
          <p className="text-2xl font-bold mb-3">Respirfacile résout exactement ça.</p>
          <p className="text-white/75 text-lg max-w-2xl mx-auto leading-relaxed">
            Pratique guidée quotidienne · Suivi automatique · Bilan en un clic · <strong className="text-white">Résultats mesurables dès 8 semaines</strong>
          </p>
        </div>
      </div>
    </section>
  )
}
