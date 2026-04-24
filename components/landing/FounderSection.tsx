export function FounderSection() {
  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              C
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">
                L&apos;histoire derrière Respirfacile
              </p>
              <blockquote className="text-xl text-gray-700 leading-relaxed mb-6 italic">
                &quot;J&apos;ai construit parlermoinsvite.fr pour aider les bredouilleurs
                à mieux parler. Quand j&apos;ai découvert que les mêmes exercices
                myofonctionnels pouvaient réduire l&apos;apnée du sommeil de 50%,
                j&apos;ai su que je devais créer Respirfacile. Un outil conçu par
                quelqu&apos;un qui comprend ce que c&apos;est de chercher une solution
                que personne n&apos;a encore construite.&quot;
              </blockquote>
              <div>
                <p className="font-bold text-gray-900">Clément Pontegnier</p>
                <p className="text-sm text-gray-500">
                  Fondateur · Annecy, France
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-teal-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Terrain validé",
                desc: "Mathilde, orthophoniste (Grenoble) — utilisatrice et co-conceptrice",
              },
              {
                icon: "🔬",
                title: "Basé sur la science",
                desc: "9 études cliniques. Pas d'exercices inventés.",
              },
              {
                icon: "🇫🇷",
                title: "100% français",
                desc: "Hébergement France · RGPD · Interface en français",
              },
            ].map((item) => (
              <div key={item.title}>
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
