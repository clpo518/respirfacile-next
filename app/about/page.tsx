import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Notre approche — Respirfacile",
  description:
    "La thérapie myofonctionnelle orofaciale (OMT) basée sur 9 études cliniques. Méta-analyse Camacho et al. 2015.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <Navbar />
      <main className="w-full">
        {/* Hero */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-beige-200 bg-texture">
          <div className="max-w-4xl mx-auto">
            <p className="text-copper-500 text-sm font-semibold uppercase tracking-widest mb-4">La science</p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-forest-800 mb-6 text-balance">
              Notre approche scientifique
            </h1>
            <p className="text-xl text-forest-600 leading-relaxed max-w-2xl">
              Respirfacile est construit sur une base scientifique solide. Pas
              d&apos;exercices inventés — chaque protocole est issu de la littérature
              clinique en thérapie myofonctionnelle orofaciale (OMT).
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-beige-300">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Key study */}
            <div className="rounded-4xl bg-forest-800 p-8 md:p-10">
              <p className="text-xs font-semibold text-copper-400 uppercase tracking-widest mb-3">Étude de référence</p>
              <p className="font-display text-2xl font-bold text-beige-100 mb-4">
                Camacho et al. 2015 — Stanford University
              </p>
              <p className="text-forest-200 leading-relaxed">
                Méta-analyse de 9 études randomisées contrôlées (n=120 adultes).
                Résultat : <strong className="text-beige-100">-50% d&apos;IAH en moyenne</strong> après un programme
                de thérapie myofonctionnelle de 8 semaines. Amélioration
                significative de la saturation en oxygène, de la somnolence diurne
                (Epworth) et du score de ronflement.
              </p>
            </div>

            {/* Sections */}
            {[
              {
                title: "Qu'est-ce que la thérapie myofonctionnelle ?",
                content: [
                  "La thérapie myofonctionnelle orofaciale (OMT) est une approche de rééducation qui cible les muscles des voies aériennes supérieures : langue, palais mou, lèvres, joues et musculature oro-faciale.",
                  "Chez les patients SAOS, ces muscles manquent de tonus, ce qui entraîne leur affaissement pendant le sommeil et l'obstruction des voies aériennes. La rééducation renforce ces structures et réduit cette obstruction.",
                ],
              },
              {
                title: "Pourquoi la Pause Contrôlée ?",
                content: [
                  "La Pause Contrôlée (ou Test de Tolérance CO₂) mesure la sensibilité du patient au dioxyde de carbone. Une faible tolérance au CO₂ est associée à une respiration buccale, une hyperventilation chronique et une aggravation du SAOS.",
                  "Nous mesurons le score en nombre de pas — plus intuitif que les secondes et directement corrélé à l'amélioration clinique.",
                ],
              },
            ].map((section) => (
              <div key={section.title} className="bg-beige-100 rounded-3xl border border-beige-300 shadow-beige p-8">
                <h2 className="font-display text-2xl font-bold text-forest-800 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.content.map((p, i) => (
                    <p key={i} className="text-forest-600 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Medical disclaimer */}
            <div className="rounded-3xl bg-copper-500/10 border border-copper-500/20 p-6">
              <p className="text-sm text-copper-800">
                <strong>Avertissement médical :</strong> Respirfacile est un
                complément de traitement, pas un substitut au diagnostic et au
                traitement médical du SAOS. Consultez toujours votre médecin et
                votre orthophoniste.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
