import Link from "next/link";
import { PatientNavbar } from "@/components/layout/PatientNavbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ressources — Comprendre votre traitement",
  description: "Tout ce que vous devez savoir sur la rééducation respiratoire, le SAOS et les exercices myofonctionnels.",
};

const faqs = [
  {
    q: "Puis-je faire les exercices si j'ai un rhume ?",
    a: "Oui, mais réduisez l'intensité. Évitez les exercices de pause contrôlée si vous êtes très congestionné. La cohérence cardiaque et les exercices myofonctionnels restent adaptés.",
  },
  {
    q: "Combien de temps avant de voir des résultats ?",
    a: "La plupart des patients constatent une amélioration du sommeil dès 2-3 semaines de pratique régulière. Les résultats sur les ronflements apparaissent généralement après 4-6 semaines.",
  },
  {
    q: "Dois-je arrêter mes exercices si j'utilise un CPAP ?",
    a: "Non, au contraire ! Respirfacile est conçu comme complément au CPAP, pas en remplacement. La rééducation musculaire améliore l'efficacité du traitement sur le long terme.",
  },
  {
    q: "Que faire si une séance me rend fatigué(e) ?",
    a: "C'est normal au début — c'est un signe que vos muscles respiratoires travaillent. Réduisez la durée à 10 minutes et augmentez progressivement. Signalez-le à votre orthophoniste.",
  },
  {
    q: "Puis-je faire les exercices le soir avant de dormir ?",
    a: "Oui, c'est même recommandé ! La cohérence cardiaque et la langue au palais sont particulièrement bénéfiques 30 minutes avant le coucher.",
  },
  {
    q: "Y a-t-il des contre-indications ?",
    a: "Consultez votre orthophoniste si vous souffrez d'asthme sévère, de troubles cardiaques ou si vous êtes enceinte. Certains exercices de pause contrôlée ne sont pas adaptés à toutes les situations.",
  },
  {
    q: "Puis-je faire les exercices au travail ?",
    a: "Tout à fait ! La cohérence cardiaque et la langue au palais sont totalement discrets. Vous pouvez les pratiquer assis à votre bureau sans que personne ne s'en aperçoive.",
  },
  {
    q: "Je n'ai que 5 minutes par jour. Est-ce suffisant ?",
    a: "5 minutes par jour de pratique régulière est bien meilleur qu'une heure par semaine. Commencez par la cohérence cardiaque (5 min) et augmentez progressivement. La régularité prime sur la durée.",
  },
];

const explainers = [
  {
    icon: "😴",
    title: "Qu'est-ce que le SAOS ?",
    content: "Le Syndrome d'Apnées Obstructives du Sommeil (SAOS) est une interruption répétée de la respiration pendant le sommeil. Elle est causée par un relâchement des muscles de la gorge qui obstrue les voies aériennes. Conséquences : ronflement, fatigue diurne, maux de tête matinaux.",
  },
  {
    icon: "👃",
    title: "Pourquoi la respiration nasale ?",
    content: "Le nez filtre, humidifie et réchauffe l'air. Il produit aussi du monoxyde d'azote qui dilate les vaisseaux sanguins et améliore l'oxygénation. Respirer par la bouche court-circuite tous ces mécanismes et aggrave le SAOS.",
  },
  {
    icon: "🫁",
    title: "Comment fonctionne la pause contrôlée ?",
    content: "La pause contrôlée (ou test CO2) mesure votre tolérance au CO2. Un score faible indique une hyperventilation chronique. En pratiquant régulièrement, vous entraînez votre corps à mieux tolérer le CO2, ce qui améliore naturellement votre respiration.",
  },
  {
    icon: "💊",
    title: "CPAP + rééducation : le duo gagnant",
    content: "Le CPAP traite les symptômes (apnées pendant le sommeil). La rééducation myofonctionnelle renforce les muscles qui causent le problème. Combinés, ils offrent les meilleurs résultats à long terme — certains patients réduisent leur pression CPAP après 6 mois de rééducation.",
  },
];

export default function RessourcesPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 md:pb-0">
      <div className="bg-[#2D5016] text-white px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Comprendre votre traitement 📚</h1>
        <p className="text-white/80 max-w-xl mx-auto">Tout ce que vous devez savoir pour progresser avec confiance</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">

        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-4">🔬 Comprendre votre traitement</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {explainers.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#2D5016] rounded-3xl p-6 text-white text-center">
          <p className="text-lg font-semibold mb-2">Prêt à pratiquer ?</p>
          <p className="text-white/80 text-sm mb-4">Accédez à tous vos exercices guidés</p>
          <Link href="/exercises" className="inline-block bg-white text-[#2D5016] px-6 py-3 rounded-xl font-semibold hover:bg-[#F5F0E8] transition-colors">
            Voir mes exercices →
          </Link>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-4">❓ Questions fréquentes</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-white rounded-2xl shadow-sm group">
                <summary className="p-5 font-medium text-stone-800 cursor-pointer flex items-center justify-between list-none">
                  {faq.q}
                  <span className="text-[#2D5016] text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
          <p className="text-amber-800 font-medium">Une question spécifique à votre situation ?</p>
          <p className="text-amber-700 text-sm mt-1">Contactez directement votre orthophoniste via votre espace patient.</p>
          <Link href="/dashboard" className="mt-3 inline-block text-[#2D5016] font-medium underline text-sm">
            Retour au tableau de bord
          </Link>
        </section>

      </div>
    </main>
  );
}
