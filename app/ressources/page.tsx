import Link from "next/link";
import { PatientNavbar } from "@/components/layout/PatientNavbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ressources — Vos questions, nos réponses",
  description: "Tout ce que vous devez savoir pour pratiquer vos exercices avec confiance.",
};

const faqs = [
  {
    q: "Puis-je faire les exercices si j'ai un rhume ?",
    a: "Oui, mais allez-y doucement. Si vous êtes très congestionné, évitez les exercices de rétention de souffle. La respiration rythmée et les exercices de bouche restent tout à fait adaptés.",
  },
  {
    q: "Combien de temps avant de voir des résultats ?",
    a: "La plupart des personnes remarquent une amélioration du sommeil et une réduction du ronflement après 2 à 4 semaines de pratique régulière. La régularité est la clé — même 10 minutes par jour font une vraie différence.",
  },
  {
    q: "Je dors avec un appareil la nuit. Est-ce que je dois quand même faire les exercices ?",
    a: "Oui, et c'est même très recommandé ! Les exercices renforcent les muscles de votre gorge et de votre bouche, ce qui améliore l'efficacité de votre appareil sur le long terme. Les deux se complètent.",
  },
  {
    q: "Que faire si une séance me rend fatigué(e) ?",
    a: "C'est tout à fait normal les premiers jours — vos muscles travaillent. Réduisez la durée à 5-10 minutes et augmentez progressivement. Si la fatigue persiste, signalez-le à votre praticien.",
  },
  {
    q: "Puis-je faire les exercices le soir avant de dormir ?",
    a: "Oui, c'est même le meilleur moment ! Les exercices de respiration rythmée et l'exercice de langue sont particulièrement efficaces 30 minutes avant le coucher.",
  },
  {
    q: "Y a-t-il des situations où il vaut mieux ne pas pratiquer ?",
    a: "Si vous avez de l'asthme sévère, des problèmes cardiaques, ou si vous êtes enceinte, parlez-en d'abord à votre médecin ou à votre praticien avant de commencer. En cas de doute, demandez conseil.",
  },
  {
    q: "Puis-je faire les exercices au travail ou dans les transports ?",
    a: "Tout à fait ! La respiration rythmée et l'exercice de langue sont invisibles — vous pouvez les pratiquer assis à votre bureau ou dans les transports sans que personne ne s'en aperçoive.",
  },
  {
    q: "Je n'ai que 5 minutes par jour. Est-ce suffisant ?",
    a: "5 minutes chaque jour vaut bien mieux qu'une heure le week-end. Commencez par la respiration rythmée (5 min) et ajoutez progressivement d'autres exercices. La régularité prime toujours sur la durée.",
  },
];

const explainers = [
  {
    icon: "😴",
    title: "Pourquoi est-ce que je ronfle ou j'ai des apnées ?",
    content: "Pendant le sommeil, les muscles de la gorge se relâchent et rétrécissent les voies respiratoires. L'air passe difficilement, ce qui provoque des ronflements — ou s'arrête complètement (apnée). Le résultat : un sommeil moins récupérateur, de la fatigue et souvent des maux de tête le matin.",
  },
  {
    icon: "👃",
    title: "Pourquoi respirer par le nez et non par la bouche ?",
    content: "Le nez filtre, humidifie et réchauffe l'air avant qu'il arrive dans vos poumons. Il produit aussi une substance qui détend naturellement les vaisseaux sanguins. Respirer par la bouche court-circuite tous ces mécanismes et aggrave les troubles du sommeil.",
  },
  {
    icon: "🫁",
    title: "C'est quoi la « pause contrôlée » ?",
    content: "C'est un exercice simple : vous expirez doucement, puis vous retenez votre souffle aussi longtemps que vous le pouvez confortablement. Le nombre de secondes (ou de pas si vous marchez) mesure votre tolérance. Plus ce score augmente, mieux vous respirez — même pendant votre sommeil.",
  },
  {
    icon: "💪",
    title: "À quoi servent les exercices de bouche et de langue ?",
    content: "Votre langue, vos lèvres et les muscles de votre gorge peuvent être renforcés, comme n'importe quel muscle. Des muscles plus toniques maintiennent les voies respiratoires ouvertes pendant le sommeil, ce qui réduit les ronflements et les apnées. Votre praticien a choisi ces exercices spécifiquement pour vous.",
  },
];

export default function RessourcesPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 md:pb-0">
      <div className="bg-[#2D5016] text-white px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Vos questions, nos réponses 📚</h1>
        <p className="text-white/80 max-w-xl mx-auto">Tout ce que vous devez savoir pour pratiquer avec confiance</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">

        <section>
          <h2 className="text-xl font-bold text-forest-800 mb-4">💡 Comprendre vos exercices</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {explainers.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-forest-800 mb-2">{item.title}</h3>
                <p className="text-sm text-forest-700 leading-relaxed">{item.content}</p>
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
          <h2 className="text-xl font-bold text-forest-800 mb-4">❓ Questions fréquentes</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-white rounded-2xl shadow-sm group">
                <summary className="p-5 font-medium text-forest-800 cursor-pointer flex items-center justify-between list-none">
                  {faq.q}
                  <span className="text-[#2D5016] text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-forest-700 text-sm leading-relaxed border-t border-beige-200 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
          <p className="text-amber-800 font-medium">Une question spécifique à votre situation ?</p>
          <p className="text-amber-700 text-sm mt-1">Votre orthophoniste ou kiné est la meilleure personne pour y répondre.</p>
          <Link href="/dashboard" className="mt-3 inline-block text-[#2D5016] font-medium underline text-sm">
            Retour à mon tableau de bord
          </Link>
        </section>

      </div>
    </main>
  );
}
