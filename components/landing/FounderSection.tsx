export function FounderSection() {
  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-beige-200 bg-texture">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-4xl bg-beige-100 border border-beige-300 shadow-beige p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-forest-500 flex items-center justify-center text-beige-100 text-3xl font-bold shadow-forest">
                C
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-copper-500 uppercase tracking-widest mb-4">
                L&apos;histoire derrière Respirfacile
              </p>
              <blockquote className="font-display text-xl text-forest-700 leading-relaxed mb-6 italic">
                &quot;J&apos;ai construit parlermoinsvite.fr pour aider les bredouilleurs
                à mieux parler. Quand j&apos;ai découvert que les mêmes exercices
                myofonctionnels pouvaient réduire l&apos;apnée du sommeil de 50%,
                j&apos;ai su que je devais créer Respirfacile. Un outil conçu par
                quelqu&apos;un qui comprend ce que c&apos;est de chercher une solution
                que personne n&apos;a encore construite.&quot;
              </blockquote>
              <div>
                <p className="font-semibold text-forest-800">Clément Pontegnier</p>
                <p className="text-sm text-forest-500">Fondateur · Annecy, France</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-beige-300 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-5 h-5 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Terrain validé",
                desc: "Mathilde, orthophoniste (Grenoble) — utilisatrice et co-conceptrice",
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                ),
                title: "Basé sur la science",
                desc: "9 études cliniques. Pas d'exercices inventés.",
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12a8.96 8.96 0 00.713 3.453" />
                  </svg>
                ),
                title: "100% français",
                desc: "Hébergement France · RGPD · Interface en français",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-forest-500/10 border border-forest-500/20 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-forest-800 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-forest-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
