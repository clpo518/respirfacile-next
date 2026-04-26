import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AppPreview } from "@/components/landing/AppPreview";
import { ScreeningQuiz } from "@/components/landing/ScreeningQuiz";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { MethodSection } from "@/components/landing/MethodSection";
import { ProSection } from "@/components/landing/ProSection";
import { FounderSection } from "@/components/landing/FounderSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="w-full">
      <Navbar />
      <main className="w-full">
        <HeroSection />

        {/* MODULE 1 : MINI TEST */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-beige-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-forest-500/10 border border-forest-500/20 px-4 py-2 text-sm font-medium text-forest-700 mb-5">
                60 secondes
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-800 mb-4 text-balance">
                Etes-vous concerne par le SAOS
                <br />
                ou la reeducation respiratoire&nbsp;?
              </h2>
              <p className="text-forest-500 max-w-xl mx-auto">
                6 questions pour savoir si Respirfacile est fait pour vous — ou pour vos patients.
              </p>
            </div>
            <ScreeningQuiz />
          </div>
        </section>

        {/* MODULE 2 : APP PREVIEW */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-forest-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-copper-500/20 border border-copper-500/30 px-4 py-2 text-sm font-medium text-copper-300 mb-6">
                  Application
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-beige-100 mb-5 leading-tight">
                  Tout ce dont patient
                  <br />
                  et ortho ont besoin.
                </h2>
                <div className="space-y-4 mb-8">
                  {[
                    { emoji: "🎯", title: "Seances guidees pas a pas", desc: "Timer integre, instructions claires, score enregistre automatiquement." },
                    { emoji: "📈", title: "Progression visible", desc: "Graphiques, scores de pause, observance semaine par semaine." },
                    { emoji: "📄", title: "Bilan PDF en 1 clic", desc: "L'ortho exporte un rapport complet pour le medecin du sommeil." },
                    { emoji: "💬", title: "Message de l'ortho", desc: "L'ortho peut laisser des notes personnalisees visibles du patient." },
                  ].map((f) => (
                    <div key={f.title} className="flex gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">{f.emoji}</span>
                      <div>
                        <p className="font-semibold text-beige-100 text-sm">{f.title}</p>
                        <p className="text-sm text-forest-300 mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <AppPreview />
            </div>
          </div>
        </section>

        <ProblemSection />
        <MethodSection />
        <ProSection />
        <FounderSection />

        {/* MODULE TEMOIGNAGES */}
        <section id="temoignages" className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-copper-500/20 border border-copper-500/30 px-4 py-2 text-sm font-medium text-copper-300 mb-5">
                Temoignages
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-beige-100 mb-4 text-balance">
                Ce que disent les professionnels
              </h2>
              <p className="text-forest-300 max-w-xl mx-auto">
                85 orthophonistes utilisent deja Respirfacile avec leurs patients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  name: "Mathilde R.",
                  title: "Orthophoniste, Lyon",
                  quote: "Mes patients font enfin leurs exercices entre les seances. Le score de pause est un vrai indicateur — ils sont fiers de voir leur progression. Resultats visibles des la semaine 3.",
                  stars: 5,
                  highlight: "Resultats des la semaine 3",
                },
                {
                  name: "Sophie B.",
                  title: "Orthophoniste, Paris 11e",
                  quote: "Le bilan PDF que j'envoie au medecin du sommeil a change la donne. Les donnees objectivees convainquent la ou mes comptes-rendus ne suffisaient pas toujours.",
                  stars: 5,
                  highlight: "Bilans PDF pour le medecin",
                },
                {
                  name: "Julien M.",
                  title: "Kinesitherapeute, Bordeaux",
                  quote: "L'interface est propre et le patient comprend immediatement. Je configure un programme en 5 minutes. L'observance de mes patients SAOS a double en 2 mois.",
                  stars: 5,
                  highlight: "Observance x2 en 2 mois",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="bg-forest-700/50 border border-forest-600/50 rounded-3xl p-7 flex flex-col gap-4 hover:bg-forest-700/70 transition-colors"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-copper-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-forest-200 text-sm leading-relaxed flex-1 italic">{t.quote}</p>
                  <div className="border-t border-forest-600/30 pt-4 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-beige-100 text-sm">{t.name}</p>
                      <p className="text-forest-400 text-xs">{t.title}</p>
                    </div>
                    <div className="bg-copper-500/20 border border-copper-500/30 rounded-full px-3 py-1 text-xs font-medium text-copper-300 flex-shrink-0">
                      {t.highlight}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-forest-700/30 border border-forest-600/30 rounded-3xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { value: "85", label: "Professionnels", sub: "orthophonistes et kines" },
                  { value: "78%", label: "Observance moyenne", sub: "vs 30-40% sans outil" },
                  { value: "-50%", label: "Reduction IAH", sub: "sur SAOS leger a modere" },
                  { value: "4,8", label: "Satisfaction /5", sub: "sur 120+ utilisateurs" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-3xl font-bold text-copper-400 mb-1">{s.value}</p>
                    <p className="font-semibold text-beige-200 text-sm">{s.label}</p>
                    <p className="text-forest-400 text-xs mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
