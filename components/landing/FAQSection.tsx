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
    a: "15 à 20 minutes par jour maximum. Au-delà, c'est contre-productif (risque d'hyperventilation compensatoire). Les exercices sont conçus pour s'intégrer dans la routine quotidienne.",
  },
  {
    q: "Comment fonctionne l'essai gratuit ?",
    a: "L'orthophoniste bénéficie de 30 jours d'essai complet sans carte bancaire. À la fin de l'essai, il peut choisir son plan (Starter 15€, Pro 25€, Cabinet 49€) et saisir sa carte.",
  },
];

export function FAQSection() {
  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl bg-white border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.q}
              </h3>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
