export function ProblemSection() {
  return (
    <section className="py-24 px-4 bg-forest-900 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-forest-400 mb-3">Le vrai problème</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Vous connaissez cette situation.</h2>
          <p className="text-xl text-forest-400 max-w-xl mx-auto font-light">Les exercices prescrits par votre praticien ne servent à rien si vous ne les faites pas régulièrement.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {[
            {
              emoji: "😴",
              title: "Vous ronflez, vous vous réveillez épuisé",
              desc: "Malgré une nuit complète, vous êtes fatigué. Votre entourage se plaint. Vous savez que quelque chose ne va pas.",
            },
            {
              emoji: "😕",
              title: "On vous a dit de faire des exercices... mais lesquels ?",
              desc: "Votre médecin ou orthophoniste vous a donné des conseils, mais sans suivi quotidien, c'est difficile de s'y tenir.",
            },
            {
              emoji: "🤷",
              title: "Vous ne savez pas si ça avance",
              desc: "Pas de retour, pas de progression visible. Difficile de rester motivé quand on ne voit pas les résultats.",
            },
            {
              emoji: "⏰",
              title: "Pas le temps, pas la régularité",
              desc: "La vie quotidienne reprend le dessus. Les exercices passent à la trappe. Et les problèmes restent.",
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
          <p className="text-2xl font-bold mb-3">Respirfacile change ça.</p>
          <p className="text-white/75 text-lg max-w-2xl mx-auto leading-relaxed">
            Des exercices guidés chaque jour · Votre progression en temps réel · <strong className="text-white">Des résultats visibles en 8 semaines</strong>
          </p>
        </div>
      </div>
    </section>
  )
}
