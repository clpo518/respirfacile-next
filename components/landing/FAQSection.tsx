const faqs = [
  {
    q: "Est-ce gratuit pour les patients ?",
    a: "Oui, totalement. Le patient accède à l'application gratuitement via le code Pro de son orthophoniste. Seul l'orthophoniste paie un abonnement.",
  },
  {
    q: "Respirfacile remplace-t-il le CPAP ?",
    a: "Non. Respirfacile est un complément de traitement. Pour les SAOS sévères, le CPAP reste indispensable. La thérapie myofonctionnelle renforce les muscles des voies aériennes supérieures et améliore l'efficacité du traitement global.",
  },
  {
    q: "Quelles études scientifiques valident l'approche ?",
    a: "L'approche est basée sur 9 études cliniques, dont la méta-analyse de référence Camacho et al. 2015 (Stanford University, n=120). Elle démontre une réduction de l'IAH de 50% en moyenne après 8 semaines de thérapie myofonctionnelle.",
  },
  {
    q: "Les données médicales sont-elles sécurisées ?",
    a: "Toutes les données sont hébergées en France, conformes au RGPD. Chaque patient ne voit que ses propres données. Les orthophonistes voient uniquement les données de leurs patients.",
  },
  {
    q: "Combien de temps par jour ?",
    a: "15 à 20 minutes par jour maximum. Au-delà, c'est contre-productif. Les exercices sont conçus pour s'intégrer dans la routine quotidienne.",
  },
  {
    q: "Comment fonctionne l'essai gratuit ?",
    a: "L'orthophoniste bénéficie de 30 jours d'essai complet sans carte bancaire. À la fin de l'essai, il peut choisir son plan (Starter 15€, Pro 25€, Cabinet 49€).",
  },
];

export function FAQSection() {
  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-beige-300">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-copper-500 text-sm font-semibold uppercase tracking-widest mb-4">FAQ</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-forest-800">
            Questions fréquentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="rounded-3xl bg-beige-100 border border-beige-300 p-6 shadow-beige hover:shadow-forest transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-xs font-bold text-copper-400 mt-1 flex-shrink-0 font-display">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-forest-800 mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-forest-600 leading-relaxed text-sm">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
