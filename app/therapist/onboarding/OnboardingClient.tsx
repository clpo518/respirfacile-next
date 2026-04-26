"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OnboardingClientProps {
  therapistCode: string;
  firstName: string;
}

export function OnboardingClient({ therapistCode, firstName }: OnboardingClientProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(therapistCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-beige-200 bg-texture flex flex-col">
      {/* Header */}
      <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-forest-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-beige-100" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
                <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-base text-forest-800">
              Respir<span className="text-copper-500">facile</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Steps visualizer */}
          <div className="flex items-center justify-center gap-3 mb-12">
            {/* Step 1 - Signup (completed) */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-forest-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-beige-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs font-medium text-forest-600">Inscription</span>
            </div>

            {/* Connector */}
            <div className="w-12 h-1 bg-forest-500" />

            {/* Step 2 - Onboarding (current) */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-forest-500 border-2 border-copper-500 flex items-center justify-center">
                <span className="text-lg font-bold text-forest-800">2</span>
              </div>
              <span className="text-xs font-medium text-copper-600">Inviter patients</span>
            </div>

            {/* Connector */}
            <div className="w-12 h-1 bg-beige-300" />

            {/* Step 3 - Dashboard (locked) */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-beige-300 flex items-center justify-center">
                <svg className="w-6 h-6 text-beige-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-beige-500">Tableau de bord</span>
            </div>
          </div>

          {/* Main content */}
          <div className="bg-beige-100 rounded-4xl border-2 border-beige-300 p-10 shadow-beige">
            <div className="text-center mb-10">
              {firstName && (
                <p className="text-sm text-forest-500 mb-3 font-medium">Bienvenue, {firstName} 👋</p>
              )}
              <h1 className="font-display text-4xl font-bold text-forest-800 mb-3">
                Invitez vos patients
              </h1>
              <p className="text-forest-600 max-w-lg mx-auto">
                Partagez ce code avec vos patients. Ils s&apos;inscrivent sur respirfacile.fr, entrent le code, et ils sont immédiatement liés à votre tableau de bord.
              </p>
            </div>

            {/* Code PRO in big display */}
            <div className="bg-forest-800 rounded-3xl p-8 mb-10 text-center">
              <p className="text-xs text-beige-300 uppercase tracking-widest font-semibold mb-4">Votre code Pro</p>
              <p className="font-mono font-bold text-beige-100 text-5xl tracking-widest mb-6 break-words">
                {therapistCode}
              </p>
              <button
                onClick={handleCopyCode}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  copied
                    ? "bg-forest-600 text-beige-100"
                    : "bg-copper-500 hover:bg-copper-600 text-beige-100"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copié !
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copier le code
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-4 mb-10">
              <h2 className="font-semibold text-forest-800 mb-3">Comment ça marche en 3 étapes :</h2>

              <ol className="space-y-3">
                <li className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-copper-500 text-beige-100 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-forest-800">Partagez votre code</p>
                    <p className="text-sm text-forest-600 mt-1">
                      Envoyez ce code Pro à vos patients par SMS, email, ou donnez-le en consultation.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-copper-500 text-beige-100 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-forest-800">Votre patient s&apos;inscrit</p>
                    <p className="text-sm text-forest-600 mt-1">
                      Il va sur <strong>respirfacile.fr</strong>, clique sur &quot;J&apos;ai un code Pro&quot;, entre votre code, et crée son compte en 2 minutes.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-copper-500 text-beige-100 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-forest-800">Il apparaît immédiatement</p>
                    <p className="text-sm text-forest-600 mt-1">
                      Votre patient est automatiquement lié à votre compte. Vous voyez son activité, sa progression, et exportez son bilan.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Info box */}
            <div className="bg-forest-500/8 border border-forest-500/20 rounded-2xl px-4 py-3 text-center text-sm text-forest-700 mb-10">
              <strong>Important :</strong> Vos patients accèdent gratuitement. Vous seul payez l&apos;abonnement.
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push("/therapist")}
              className="w-full bg-forest-500 hover:bg-forest-600 text-beige-100 py-4 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Aller sur mon tableau de bord
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
