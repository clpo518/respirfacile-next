import Link from "next/link"

export function ProSection() {
  const features = [
    {
      emoji: "📋",
      title: "Programmes personnalisés",
      desc: "4 profils patients prêts à l'emploi : SAOS léger, sévère sous CPAP, TMOF, mixte. Prescription en 2 minutes.",
    },
    {
      emoji: "📓",
      title: "Journal de bord patient",
      desc: "Bien-être, qualité du sommeil, difficulté perçue. Vous voyez les alertes : anxiété, abandon, douleur signalée.",
    },
    {
      emoji: "📈",
      title: "Graphiques de progression",
      desc: "Scores pause contrôlée, cohérence cardiaque, nasale — semaine par semaine. La progression visible motive.",
    },
    {
      emoji: "📄",
      title: "Export PDF bilan",
      desc: "Rapport complet et professionnel en un clic, prêt pour le médecin du sommeil ou votre compte-rendu.",
    },
    {
      emoji: "🔔",
      title: "Alertes inactivité",
      desc: "Notification automatique si un patient n'a pas pratiqué depuis 5 jours. Vous intervenez au bon moment.",
    },
    {
      emoji: "🔒",
      title: "RGPD & secret médical",
      desc: "Hébergement Europe, chiffrement de bout en bout, accès par rôle strict. Vos patients ne voient que leurs données.",
    },
  ]
  return (
    <section id="fonctionnalites" className="py-24 px-4 bg-[#F5F0E8]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8B4513] mb-3">Fonctionnalités</p>
          <h2 className="text-4xl md:text-5xl font-bold text-forest-800 mb-4">Tout ce dont vous avez besoin</h2>
          <p className="text-xl text-forest-500 max-w-2xl mx-auto font-light">Conçu avec des orthophonistes spécialisées SAOS. Rien de superflu, rien de manquant.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {features.map((f) => (
            <div key={f.title} className="bg-beige-100 rounded-3xl p-7 border border-beige-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-3xl mb-4">{f.emoji}</div>
              <h3 className="font-bold text-forest-800 text-lg mb-2">{f.title}</h3>
              <p className="text-forest-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/auth?mode=signup&role=therapist"
            className="inline-flex items-center gap-2 bg-[#2D5016] hover:bg-[#1e3a0f] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Commencer mon essai gratuit
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>
          <p className="text-sm text-forest-400 mt-3">30 jours gratuits · Sans carte bancaire · Résiliable à tout moment</p>
        </div>
      </div>
    </section>
  )
}
