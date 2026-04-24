import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full bg-beige-200 bg-texture py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Organic background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-forest-500/8 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-copper-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-sage-300/20 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-forest-500/10 border border-forest-500/20 px-4 py-2 text-sm font-medium text-forest-700 mb-8">
              <span className="w-2 h-2 rounded-full bg-copper-500 animate-pulse" />
              Validé — Méta-analyse Camacho 2015 · Stanford
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-forest-800 leading-[1.1] mb-6 text-balance">
              Respirez mieux.{" "}
              <span className="text-copper-500 italic">Dormez enfin.</span>
            </h1>

            <p className="text-lg md:text-xl text-forest-600 mb-10 leading-relaxed max-w-lg">
              La thérapie myofonctionnelle prescrite par votre orthophoniste, pratiquée
              à domicile. Réduit l&apos;IAH de{" "}
              <strong className="text-forest-800">50% en moyenne</strong> chez les patients SAOS.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Link
                href="/auth?mode=signup&role=therapist"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-500 px-8 py-4 text-base font-semibold text-beige-100 hover:bg-forest-600 transition-all duration-200 shadow-forest group"
              >
                Je suis orthophoniste
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/auth?mode=signup&role=patient"
                className="inline-flex items-center justify-center rounded-full border-2 border-forest-400 px-8 py-4 text-base font-semibold text-forest-700 hover:border-forest-600 hover:bg-forest-500/5 transition-all duration-200"
              >
                J&apos;ai un code Pro
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "-50%", label: "IAH moyen", sub: "Camacho 2015" },
                { value: "120+", label: "Patients actifs", sub: "" },
                { value: "85+", label: "Orthophonistes", sub: "" },
                { value: "8 sem.", label: "Pour des résultats", sub: "" },
              ].map((stat) => (
                <div key={stat.value} className="text-center">
                  <p className="text-2xl font-bold text-forest-700">{stat.value}</p>
                  <p className="text-sm font-medium text-forest-600 mt-0.5">{stat.label}</p>
                  {stat.sub && (
                    <p className="text-xs text-forest-400 mt-0.5">{stat.sub}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: breathing app mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Outer glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full bg-forest-500/8 blur-3xl animate-breathe-slow" />
            </div>

            <div className="relative w-full max-w-sm">
              {/* Main card */}
              <div className="bg-beige-100 rounded-4xl shadow-forest-lg border border-beige-300 p-8 relative overflow-hidden">
                {/* Card top decoration */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-400 via-copper-400 to-sage-400 rounded-t-4xl" />

                <div className="text-center mb-8">
                  <p className="text-xs font-semibold text-copper-500 uppercase tracking-widest mb-2">
                    Pause Contrôlée
                  </p>
                  <p className="font-display text-5xl font-bold text-forest-800">42 pas</p>
                  <p className="text-sm text-forest-500 mt-1">Score du jour</p>
                </div>

                {/* Breathing circle */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Outer rings */}
                    <div className="absolute inset-0 rounded-full bg-forest-500/10 animate-breathe scale-125" />
                    <div className="absolute inset-0 rounded-full bg-forest-500/6 animate-breathe-slow scale-150" />
                    {/* Main circle */}
                    <div className="relative w-28 h-28 rounded-full bg-forest-500 flex items-center justify-center shadow-forest-lg">
                      <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-beige-100" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
                        <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { label: "Séances cette semaine", value: "5/7", good: true },
                    { label: "Progression", value: "+18 pas", good: true },
                    { label: "Prochain objectif", value: "50 pas", good: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-beige-300 last:border-0">
                      <span className="text-sm text-forest-600">{item.label}</span>
                      <span className={`text-sm font-bold ${item.good ? "text-forest-700" : "text-copper-500"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-forest-500/8 border border-forest-500/15 px-4 py-3 text-center">
                  <p className="text-xs text-forest-700 font-medium">
                    Bilan PDF envoyé à votre orthophoniste
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-copper-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                Essai 30j gratuit
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
