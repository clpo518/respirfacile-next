export function MethodSection() {
  const steps = [
    {
      num: "01",
      emoji: "📋",
      title: "Votre praticien vous prescrit un programme",
      desc: "Votre orthophoniste ou kinésithérapeute configure votre programme personnalisé et vous envoie un code d'accès. C'est gratuit pour vous.",
      color: "#2D5016",
    },
    {
      num: "02",
      emoji: "🫁",
      title: "Vous pratiquez 15 min par jour",
      desc: "L'application vous guide étape par étape. Un timer, des instructions claires, un retour immédiat. Vous savez exactement quoi faire et comment.",
      color: "#8B4513",
    },
    {
      num: "03",
      emoji: "📊",
      title: "Vous voyez votre progression",
      desc: "Chaque séance est enregistrée. Votre praticien suit votre évolution à distance et ajuste votre programme. Vous voyez vos progrès semaine après semaine.",
      color: "#2D5016",
    },
  ]
  return (
    <section id="methode" className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-copper-500 mb-3">Comment ça marche</p>
          <h2 className="text-4xl md:text-5xl font-bold text-forest-800 mb-4">Simple à utiliser.<br/>Efficace dès la première semaine.</h2>
          <p className="text-xl text-forest-500 max-w-xl mx-auto font-light">Pas besoin de matériel, pas besoin d'expérience. Juste 15 minutes par jour.</p>
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
            <p className="text-white font-bold text-xl mb-1">Des résultats concrets en 8 semaines</p>
            <p className="text-white/70 text-sm max-w-xl">Des études scientifiques montrent qu&apos;une rééducation régulière de la respiration peut réduire les apnées de moitié. Respirfacile vous aide à rester régulier.</p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            {[
              { val: "−50%", lab: "d'apnées en moyenne" },
              { val: "89%", lab: "des patients restent réguliers" },
              { val: "8 sem.", lab: "pour les premiers effets" },
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
