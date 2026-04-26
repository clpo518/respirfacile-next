"use client"

import { useState } from "react"
import Link from "next/link"

type Profile = "saos" | "tmof" | "both" | "unrelated" | null

const QUESTIONS = [
  { id: "snoring",    text: "Votre entourage vous signale que vous ronflez fort la nuit ?" },
  { id: "tired",      text: "Vous vous réveillez fatigué(e) même après une nuit complète ?" },
  { id: "mouth",      text: "Vous respirez majoritairement par la bouche (de jour ou de nuit) ?" },
  { id: "jaw",        text: "Vous avez des douleurs à la mâchoire, des serrements de dents ?" },
  { id: "children",   text: "Un professionnel a évoqué la rééducation oro-faciale ?" },
]

const RESULTS: Record<NonNullable<Profile>, { title: string; desc: string; cta: string; href: string }> = {
  saos: {
    title: "Profil SAOS — Respirfacile est fait pour vous",
    desc: "Vos réponses indiquent des signes caractéristiques du SAOS. Une rééducation respiratoire guidée peut réduire l'IAH de 50% sur les formes légères à modérées.",
    cta: "Commencer mon programme",
    href: "/auth?mode=signup",
  },
  tmof: {
    title: "Profil TMOF — Thérapie myofonctionnelle",
    desc: "Vos réponses pointent vers une dysfonction oro-faciale. Les exercices myofonctionnels de Respirfacile correspondent exactement à ce besoin.",
    cta: "Voir les exercices",
    href: "/auth?mode=signup",
  },
  both: {
    title: "Profil mixte SAOS + TMOF",
    desc: "Vous présentez des signes des deux pathologies. C'est le cas le plus fréquent. Le programme complet de Respirfacile couvre les deux.",
    cta: "Démarrer — 30j gratuits",
    href: "/auth?mode=signup",
  },
  unrelated: {
    title: "Respirfacile est peut-être moins adapté",
    desc: "Vos réponses n'indiquent pas clairement de SAOS ou TMOF. Consultez un professionnel de santé pour un bilan personnalisé.",
    cta: "En savoir plus quand même",
    href: "/pricing",
  },
}

function computeProfile(answers: Record<string, boolean>): NonNullable<Profile> {
  const saosScore = (answers.snoring ? 1 : 0) + (answers.tired ? 1 : 0)
  const tmofScore = (answers.mouth ? 1 : 0) + (answers.jaw ? 1 : 0) + (answers.children ? 1 : 0)
  if (saosScore >= 1 && tmofScore >= 1) return "both"
  if (saosScore >= 1) return "saos"
  if (tmofScore >= 1) return "tmof"
  return "unrelated"
}

export function ScreeningQuiz() {
  const [phase, setPhase] = useState<"quiz" | "result">("quiz")
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [profile, setProfile] = useState<Profile>(null)

  const handleAnswer = (yes: boolean) => {
    const newAnswers = { ...answers, [QUESTIONS[currentQ].id]: yes }
    setAnswers(newAnswers)
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setProfile(computeProfile(newAnswers))
      setPhase("result")
    }
  }

  const reset = () => {
    setAnswers({})
    setCurrentQ(0)
    setPhase("quiz")
    setProfile(null)
  }

  const progressPct = ((currentQ) / QUESTIONS.length) * 100
  const q = QUESTIONS[currentQ]

  if (phase === "result" && profile) {
    const result = RESULTS[profile]
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-sm overflow-hidden">
          <div className="bg-[#2D5016] p-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-white">{result.title}</h3>
          </div>
          <div className="p-8 text-center">
            <p className="text-forest-600 leading-relaxed mb-8">{result.desc}</p>
            <Link
              href={result.href}
              className="block w-full bg-[#2D5016] hover:bg-[#1e3a0f] text-white font-semibold py-4 rounded-2xl transition-colors mb-4"
            >
              {result.cta} →
            </Link>
            <button onClick={reset} className="text-sm text-forest-400 hover:text-forest-600 transition-colors">
              Recommencer le test
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-sm overflow-hidden">
        {/* Progress */}
        <div className="h-1.5 bg-beige-200">
          <div
            className="h-full bg-[#2D5016] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="p-8">
          <p className="text-xs text-forest-400 mb-6">Question {currentQ + 1} / {QUESTIONS.length}</p>
          <h3 className="text-xl font-semibold text-forest-800 mb-8 leading-snug">{q.text}</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-4 bg-[#2D5016] hover:bg-[#1e3a0f] text-white font-semibold rounded-2xl transition-colors text-sm"
            >
              Oui
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-4 bg-beige-200 hover:bg-beige-300 text-forest-700 font-semibold rounded-2xl transition-colors text-sm"
            >
              Non
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
