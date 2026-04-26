"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type OnboardingStep = 1 | 2 | 3 | 4;
type ProfileType = "adult_saos_mild" | "adult_saos_severe" | "adult_tmof" | "adult_mixed" | null;

interface OnboardingData {
  full_name: string;
  age: number | null;
  profileType: ProfileType;
  objective: string;
  availability: string;
  exerciseStarted: boolean;
}

const PROFILE_OPTIONS = [
  { value: "adult_saos_mild", label: "SAOS léger/modéré", icon: "🌙", desc: "Apnée du sommeil légère ou modérée" },
  { value: "adult_saos_severe", label: "SAOS sévère", icon: "😴", desc: "Apnée sévère, sous appareillage (CPAP)" },
  { value: "adult_tmof", label: "Rééducation oro-faciale", icon: "👅", desc: "Rééducation myofonctionnelle (TMOF)" },
  { value: "adult_mixed", label: "SAOS + TMOF", icon: "🎯", desc: "Combinaison SAOS et rééducation" },
];

const OBJECTIVE_OPTIONS = [
  { value: "better_sleep", label: "Mieux dormir", icon: "💤" },
  { value: "reduce_snoring", label: "Réduire les ronflements", icon: "🚫" },
  { value: "improve_breathing", label: "Améliorer ma respiration nasale", icon: "👃" },
  { value: "prepare_surgery", label: "Préparer une opération", icon: "🏥" },
  { value: "recover", label: "Récupération après appareillage", icon: "✨" },
  { value: "other", label: "Autre objectif", icon: "🎯" },
];

const AVAILABILITY_OPTIONS = [
  { value: "morning", label: "Matin (avant 12h)", icon: "🌅" },
  { value: "afternoon", label: "Après-midi (12h-18h)", icon: "☀️" },
  { value: "evening", label: "Soir (après 18h)", icon: "🌙" },
  { value: "flexible", label: "Variable / flexible", icon: "🔄" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<OnboardingData>({
    full_name: "",
    age: null,
    profileType: null,
    objective: "",
    availability: "",
    exerciseStarted: false,
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/auth");
        return;
      }
      setUser(currentUser);

      // Vérifier si l'utilisateur a déjà complété l'onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (profile?.full_name) {
        setData((prev) => ({ ...prev, full_name: profile.full_name }));
      }
      if (profile?.age) {
        setData((prev) => ({ ...prev, age: profile.age }));
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  const handleNext = async () => {
    if (step === 4) {
      // Final step - save and redirect
      setSaving(true);
      try {
        // Update profile
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: data.full_name,
            age: data.age,
          })
          .eq("id", user.id);

        if (profileError) throw profileError;

        // Create patient program
        const { error: programError } = await supabase
          .from("patient_programs")
          .insert({
            patient_id: user.id,
            profile_type: data.profileType,
            week_number: 1,
            is_active: true,
          });

        if (programError) throw programError;

        // Redirect to first session if they want to start immediately
        if (data.exerciseStarted) {
          router.push("/session/coherence_5_5");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        setSaving(false);
      }
    } else {
      setStep((step + 1) as OnboardingStep);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as OnboardingStep);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-200 bg-texture flex items-center justify-center">
        <div className="bg-beige-100 rounded-3xl border border-beige-300 p-10 animate-pulse">
          <div className="h-8 bg-beige-300 rounded-xl mb-4 w-3/4" />
          <div className="h-4 bg-beige-300 rounded-xl w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-200 bg-texture flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-5 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-beige-100" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
              <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-semibold text-lg text-forest-800">
            Respir<span className="text-copper-500">facile</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-12 px-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    s === step
                      ? "bg-forest-500 text-beige-100 ring-2 ring-forest-500/30"
                      : s < step
                      ? "bg-forest-500/20 text-forest-700"
                      : "bg-beige-300 text-beige-600"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-3 rounded-full transition-all ${
                      s < step ? "bg-forest-500/30" : "bg-beige-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Profil */}
          {step === 1 && (
            <div className="bg-beige-100 rounded-4xl border border-beige-300 p-8 shadow-beige">
              <h2 className="font-display text-2xl font-bold text-forest-800 mb-2">👋 Parlons de toi</h2>
              <p className="text-forest-500 mb-8">Étape 1 sur 4</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-forest-700 mb-2">Ton prénom et nom</label>
                  <input
                    type="text"
                    value={data.full_name}
                    onChange={(e) => setData({ ...data, full_name: e.target.value })}
                    placeholder="ex: Jean Dupont"
                    className="w-full px-4 py-3 rounded-2xl border border-beige-300 bg-beige-50 text-forest-800 placeholder-forest-400 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-forest-700 mb-2">Ton âge</label>
                  <input
                    type="number"
                    value={data.age || ""}
                    onChange={(e) => setData({ ...data, age: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="ex: 45"
                    min="18"
                    max="120"
                    className="w-full px-4 py-3 rounded-2xl border border-beige-300 bg-beige-50 text-forest-800 placeholder-forest-400 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={handleNext}
                  disabled={!data.full_name || !data.age}
                  className="flex-1 px-6 py-3 rounded-2xl font-semibold transition-all bg-forest-500 text-beige-100 hover:bg-forest-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Profil médical */}
          {step === 2 && (
            <div className="bg-beige-100 rounded-4xl border border-beige-300 p-8 shadow-beige">
              <h2 className="font-display text-2xl font-bold text-forest-800 mb-2">🩺 Ton diagnostic</h2>
              <p className="text-forest-500 mb-8">Étape 2 sur 4</p>

              <div className="space-y-3 mb-8">
                {PROFILE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData({ ...data, profileType: option.value as ProfileType })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${
                      data.profileType === option.value
                        ? "border-forest-500 bg-forest-500/5"
                        : "border-beige-300 hover:border-forest-300 bg-beige-50"
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0 mt-1">{option.icon}</span>
                    <div>
                      <p className="font-semibold text-forest-800">{option.label}</p>
                      <p className="text-sm text-forest-500 mt-0.5">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-2xl font-semibold transition-all border-2 border-beige-300 text-forest-700 hover:border-forest-300 hover:bg-beige-50"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleNext}
                  disabled={!data.profileType}
                  className="flex-1 px-6 py-3 rounded-2xl font-semibold transition-all bg-forest-500 text-beige-100 hover:bg-forest-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Objectif */}
          {step === 3 && (
            <div className="bg-beige-100 rounded-4xl border border-beige-300 p-8 shadow-beige">
              <h2 className="font-display text-2xl font-bold text-forest-800 mb-2">🎯 Ton objectif principal</h2>
              <p className="text-forest-500 mb-8">Étape 3 sur 4 — optionnel</p>

              <div className="space-y-3 mb-8">
                {OBJECTIVE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData({ ...data, objective: option.value })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${
                      data.objective === option.value
                        ? "border-copper-500 bg-copper-500/5"
                        : "border-beige-300 hover:border-copper-300 bg-beige-50"
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <p className="font-medium text-forest-800">{option.label}</p>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-2xl font-semibold transition-all border-2 border-beige-300 text-forest-700 hover:border-forest-300 hover:bg-beige-50"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 rounded-2xl font-semibold transition-all bg-forest-500 text-beige-100 hover:bg-forest-600 hover:shadow-md"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Disponibilité + Premier exercice */}
          {step === 4 && (
            <div className="bg-beige-100 rounded-4xl border border-beige-300 p-8 shadow-beige">
              <h2 className="font-display text-2xl font-bold text-forest-800 mb-2">⏰ Quand pratiquer ?</h2>
              <p className="text-forest-500 mb-8">Étape 4 sur 4 — dernière étape !</p>

              <div className="space-y-3 mb-8">
                {AVAILABILITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData({ ...data, availability: option.value })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${
                      data.availability === option.value
                        ? "border-forest-500 bg-forest-500/5"
                        : "border-beige-300 hover:border-forest-300 bg-beige-50"
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <p className="font-medium text-forest-800">{option.label}</p>
                  </button>
                ))}
              </div>

              {/* Checkbox pour commencer tout de suite */}
              <div className="bg-forest-500/5 border border-forest-500/20 rounded-2xl p-4 mb-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.exerciseStarted}
                    onChange={(e) => setData({ ...data, exerciseStarted: e.target.checked })}
                    className="w-5 h-5 rounded border-beige-300 text-forest-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-forest-700">
                    ✨ Commencer mon premier exercice tout de suite (Cohérence Cardiaque)
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-2xl font-semibold transition-all border-2 border-beige-300 text-forest-700 hover:border-forest-300 hover:bg-beige-50"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleNext}
                  disabled={!data.availability || saving}
                  className="flex-1 px-6 py-3 rounded-2xl font-semibold transition-all bg-forest-500 text-beige-100 hover:bg-forest-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-beige-100/30 border-t-beige-100 rounded-full animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      🚀 Commencer
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
