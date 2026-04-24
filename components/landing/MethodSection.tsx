export function MethodSection() {
  const steps = [
    {
      number: "01",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      title: "L'orthophoniste prescrit",
      description: "En 2 minutes, l'ortho crée le profil patient, choisit le programme adapté (SAOS léger, TMOF, mixte) et envoie le code d'accès.",
      detail: "30 jours gratuits · Sans CB",
    },
    {
      number: "02",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      title: "Le patient s'entraîne",
      description: "15-20 min/jour à domicile. Exercices guidés : Pause Contrôlée, cohérence cardiaque, myofonctionnel. Progression mesurée en temps réel.",
      detail: "Accès 100% gratuit via le code Pro",
    },
    {
      number: "03",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      title: "L'ortho suit et exporte",
      description: "Tableau de bord en temps réel. Bilan PDF exportable pour le médecin du sommeil. Courbes de progression par exercice.",
      detail: "Compatible HAS · RGPD · France",
    },
  ];

  const categories = [
    { label: "Pause Contrôlée", sub: "Tolérance CO₂", color: "bg-forest-500/10 border-forest-500/20 text-forest-700" },
    { label: "Cohérence cardiaque", sub: "5-5 · 4-6", color: "bg-copper-500/10 border-copper-500/20 text-copper-700" },
    { label: "Myofonctionnel", sub: "Langue · Palais", color: "bg-sage-400/20 border-sage-400/30 text-forest-700" },
    { label: "Respiration nasale", sub: "Rééducation", color: "bg-forest-500/10 border-forest-500/20 text-forest-700" },
    { label: "Diaphragmatique", sub: "Respiration abdominale", color: "bg-copper-500/10 border-copper-500/20 text-copper-700" },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-beige-200 bg-texture">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-copper-500 text-sm font-semibold uppercase tracking-widest mb-4">La méthode</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-forest-800 mb-4 text-balance">
            Pensé pour le parcours de soin
          </h2>
          <p className="text-lg text-forest-600 max-w-2xl mx-auto">
            Un outil médical, pas une app fitness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative">
          {/* Connecting dots (desktop) */}
          <div className="hidden md:flex absolute top-[3.25rem] left-[36%] right-[36%] items-center justify-center z-10">
            <div className="flex-1 h-px bg-gradient-to-r from-forest-300 to-forest-300" />
            <div className="w-2 h-2 rounded-full bg-forest-400 mx-1" />
            <div className="flex-1 h-px bg-gradient-to-r from-forest-300 to-forest-300" />
          </div>

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-beige-100 rounded-3xl border border-beige-300 p-8 shadow-beige hover:shadow-forest transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-forest-500 text-beige-100 flex items-center justify-center shadow-sm group-hover:bg-forest-600 transition-colors">
                  {step.icon}
                </div>
                <span className="text-sm font-bold text-forest-400">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-forest-800 mb-3">
                {step.title}
              </h3>
              <p className="text-forest-600 leading-relaxed mb-5 text-sm">
                {step.description}
              </p>
              <div className="rounded-xl bg-forest-500/8 border border-forest-500/15 px-4 py-2">
                <p className="text-xs font-medium text-forest-700">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Exercise preview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className={`rounded-2xl border ${cat.color} bg-opacity-60 p-4 text-center`}
            >
              <p className="text-sm font-semibold mb-1">{cat.label}</p>
              <p className="text-xs opacity-70">{cat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
