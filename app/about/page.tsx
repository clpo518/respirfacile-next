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
      <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Notre approche scientifique
        </h1>

        <div className="prose prose-gray prose-lg max-w-none">
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Respirfacile est construit sur une base scientifique solide. Pas
            d&apos;exercices inventés — chaque protocole est issu de la littérature
            clinique en thérapie myofonctionnelle orofaciale (OMT).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            La méta-analyse de référence
          </h2>
          <div className="rounded-2xl bg-teal-50 border border-teal-200 p-6 mb-6">
            <p className="font-semibold text-teal-800 mb-2">
              Camacho et al. 2015 — Stanford University
            </p>
            <p className="text-gray-700">
              Méta-analyse de 9 études randomisées contrôlées (n=120 adultes).
              Résultat : <strong>-50% d&apos;IAH en moyenne</strong> après un programme
              de thérapie myofonctionnelle de 8 semaines. Amélioration
              significative de la saturation en oxygène, de la somnolence diurne
              (Epworth) et du score de ronflement.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Qu&apos;est-ce que la thérapie myofonctionnelle ?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            La thérapie myofonctionnelle orofaciale (OMT) est une approche de
            rééducation qui cible les muscles des voies aériennes supérieures :
            langue, palais mou, lèvres, joues et musculature oro-faciale.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Chez les patients SAOS, ces muscles manquent de tonus, ce qui
            entraîne leur affaissement pendant le sommeil et l&apos;obstruction des
            voies aériennes. La rééducation renforce ces structures et réduit
            cette obstruction.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Pourquoi la Pause Contrôlée ?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            La Pause Contrôlée (ou Test de Tolérance CO₂) mesure la sensibilité
            du patient au dioxyde de carbone. Une faible tolérance au CO₂ est
            associée à une respiration buccale, une hyperventilation chronique
            et une aggravation du SAOS.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Nous mesurons le score en nombre de pas — plus intuitif que les
            secondes et directement corrélé à l&apos;amélioration clinique.
          </p>

          <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="text-sm text-amber-800">
              <strong>Avertissement médical :</strong> Respirfacile est un
              complément de traitement, pas un substitut au diagnostic et au
              traitement médical du SAOS. Consultez toujours votre médecin et
              votre orthophoniste.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
