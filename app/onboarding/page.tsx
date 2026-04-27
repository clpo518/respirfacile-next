"use client";

import { LogoIcon } from "@/components/ui/Logo"
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
}

const PROFILE_OPTIONS = [
  {
    value: "adult_saos_mild",
    label: "Je ronfle ou j'ai des apnées",
    icon: "🌙",
    desc: "Mon médecin a détecté de l'apnée du sommeil. Je ne porte pas de masque la nuit.",
  },
  {
    value: "adult_saos_severe",
    label: "J'ai des apnées et je porte un masque la nuit",
    icon: "😴",
    desc: "Je dors avec un appareil (CPAP). Mon praticien veut compléter avec des exercices.",
  },
  {
    value: "adult_tmof",
    label: "On m'a prescrit des exercices de bouche ou de langue",
    icon: "👅",
    desc: "Mon orthophoniste ou kiné m'a prescrit une rééducation. Pas forcément lié à l'apnée.",
  },
  {
    value: "adult_mixed",
    label: "J'ai les deux à la fois",
    icon: "🎯",
    desc: "J'ai de l'apnée du sommeil et des exercices de rééducation prescrits.",
  },
];

const OBJECTIVE_OPTIONS = [
  { value: "better_sleep", label: "Mieux dormir", icon: "💤" },
  { value: "reduce_snoring", label: "Arrêter de ronfler", icon: "🔇" },
  { value: "improve_breathing", label: "Mieux respirer au quotidien", icon: "👃" },
  { value: "prepare_surgery", label: "Préparer une opération", icon: "🏥" },
  { value: "recover", label: "Compléter mon traitement", icon: "✨" },
  { value: "other", label: "Autre", icon: "🎯" },
];

const AVAILABILITY_OPTIONS = [
  { value: "morning", label: "Le matin, avant de commencer la journée", icon: "🌅" },
  { value: "afternoon", label: "L'après-midi", icon: "☀️" },
  { value: "evening", label: "Le soir, avant de dormir", icon: "🌙" },
  { value: "flexible", label: "Pas de créneau fixe — je m'adapte", icon: "🔄" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<OnboardingData>({
    full_name: "",
    age: null,
    profileType: null,
    objective: "",
    availability: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/auth");
        return;
      }
      setUser(currentUser);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, age")
        .eq("id", currentUser.id)
        .single();

      if (profile?.full_name) setData((prev) => ({ ...prev, full_name: profile.full_name }));
      if (profile?.age) setData((prev) => ({ ...prev, age: profile.age }));

      setLoading(false);
    };

    checkUser();
  }, []);

  const handleNext = async () => {
    if (step < 4) {
      setStep((step + 1) as OnboardingStep);
      return;
    }

    // Étape finale — sauvegarde
    setSaving(true);
    setSaveError(null);
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: data.full_name, age: data.age })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Tenter de créer le programme — ignorer si la table n'existe pas encore
      try {
        await supabase
          .from("patient_programs")
          .insert({
            patient_id: user.id,
            profile_type: data.profileType,
            week_number: 1,
            is_active: true,
          });
      } catch (_) { /* silencieux si table absente */ }

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erreur onboarding:", err);
      setSaveError("Une erreur est survenue. Réessaie ou passe cette étape.");
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as OnboardingStep);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-200 flex items-center justify-center">
        <div className="bg-beige-100 rounded-3xl border border-beige-300 p-10 animate-pulse">
          <div className="h-8 bg-beige-300 rounded-xl mb-4 w-48" />
          <div className="h-4 bg-beige-300 rounded-xl w-32" />
        </div>
      </div>
    );
  }

  const stepLabels = ["Toi", "Ta situation", "Ton objectif", "Ton rythme"];

  return (
    <div className="min-h-screen bg-beige-200 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-5 max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <LogoIcon size={28} />
          <span style={{ fontWeight: 600, color: "#2D5016", letterSpacing: "-0.01em" }}>
            Respir<span style={{ color: "#8B4513" }}>facile</span>
          </span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* Stepper */}
          <div className="flex items-center justify-between mb-10 px-1">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      s === step
                        ? "bg-forest-700 text-white ring-4 ring-forest-700/20"
                        : s < step
                        ? "bg-forest-500/20 text-forest-700"
                        : "bg-beige-300 text-beige-500"
                    }`}
                  >
                    {s < step ? "✓" : s}
                  </div>
                  <span className={`text-xs hidden sm:block ${s === step ? "text-forest-700 font-medium" : "text-beige-500"}`}>
                    {stepLabels[s - 1]}
                  </span>
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all ${s < step ? "bg-forest-500/40" : "bg-beige-300"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="bg-beige-100 rounded-4xl border border-beige-300 p-8 shadow-beige">
              <h2 className="font-display text-2xl font-bold text-forest-800 mb-1">👋 Bienvenue !</h2>
              <p className="text-forest-600 mb-8">On commence par faire connaissance. Ça prend 2 minutes.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-forest-700 mb-2">Ton prénom et nom</label>
                  <input
                    type="text"
                    value={data.full_name}
                    onChange={(e) => setData({ ...data, full_name: e.target.value })}
                    placeholder="ex : Sophie Martin"
                    className="w-full px-4 py-3 rounded-2xl border border-beige-300 bg-white text-forest-800 placeholder-forest-400 focus:outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-forest-700 mb-2">Ton âge</label>
                  <input
                    type="number"
                    value={data.age || ""}
                    onChange={(e) => setData({ ...data, age: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="ex : 45"
                    min="18"
                    max="120"
                    className="w-full px-4 py-3 rounded-2xl border border-beige-300 bg-white text-forest-800 placeholder-forest-400 focus:outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20"
                  />
                  <p className="text-xs text-forest-500 mt-1.5">L'âge permet d'adapter les objectifs à ta situation.</p>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!data.full_name.trim() || !data.age}
                className="w-full mt-8 px-6 py-4 rounded-2xl font-semibold transition-all bg-forest-700 text-white hover:bg-forest-800 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuer →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="bg-beige-100 rounded-4xl border border-beige-300 p-8 shadow-beige">
              <h2 className="font-display text-2xl font-bold text-forest-800 mb-1">🩺 Quelle est ta situation ?</h2>
              <p className="text-forest-600 mb-6">Choisis ce qui te correspond le mieux — ton praticien pourra affiner ensuite.</p>

              <div className="space-y-3 mb-8">
                {PROFILE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData({ ...data, profileType: option.value as ProfileType })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${
                      data.profileType === option.value
                        ? "border-forest-600 bg-forest-500/5"
                        : "border-beige-300 hover:border-forest-300 bg-white"
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0 mt-0.5">{option.icon}</span>
                    <div>
                      <p className="font-semibold text-forest-800 leading-snug">{option.label}</p>
                      <p className="text-sm text-forest-600 mt-0.5 leading-relaxed">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="px-5 py-3 rounded-2xl font-medium border-2 border-beige-300 text-forest-700 hover:border-forest-300 transition-all">
                  ← Retour
                </button>
                <button
                  onClick={handleNext}
                  disabled={!data.profileType}
                  className="flex-1 px-6 py-3 rounded-2xl font-semibold transition-all bg-forest-700 text-white hover:bg-forest-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="bg-beige-100 rounded-4xl border border-beige-300 p-8 shadow-beige">
              <h2 className="font-display text-2xl font-bold text-forest-800 mb-1">🎯 Qu'est-ce que tu veux améliorer ?</h2>
              <p className="text-forest-600 mb-6">C'est optionnel — mais ça nous aide à personnaliser tes exercices.</p>

              <div className="space-y-3 mb-8">
                {OBJECTIVE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData({ ...data, objective: option.value })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${
                      data.objective === option.value
                        ? "border-copper-500 bg-copper-500/5"
                        : "border-beige-300 hover:border-copper-300 bg-white"
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <p className="font-medium text-forest-800">{option.label}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="px-5 py-3 rounded-2xl font-medium border-2 border-beige-300 text-forest-700 hover:border-forest-300 transition-all">
                  ← Retour
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 rounded-2xl font-semibold transition-all bg-forest-700 text-white hover:bg-forest-800"
                >
                  {data.objective ? "Continuer →" : "Passer cette étape →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="bg-beige-100 rounded-4xl border border-beige-300 p-8 shadow-beige">
              <h2 className="font-display text-2xl font-bold text-forest-800 mb-1">⏰ Quand tu auras du temps pour pratiquer ?</h2>
              <p className="text-forest-600 mb-6">15 minutes suffisent. On te rappellera au bon moment.</p>

              <div className="space-y-3 mb-8">
                {AVAILABILITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setData({ ...data, availability: option.value })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${
                      data.availability === option.value
                        ? "border-forest-600 bg-forest-500/5"
                        : "border-beige-300 hover:border-forest-300 bg-white"
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <p className="font-medium text-forest-800">{option.label}</p>
                  </button>
                ))}
              </div>

              {saveError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                  {saveError}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={handleBack} className="px-5 py-3 rounded-2xl font-medium border-2 border-beige-300 text-forest-700 hover:border-forest-300 transition-all">
                  ← Retour
                </button>
                <button
                  onClick={handleNext}
                  disabled={saving}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold transition-all bg-forest-700 text-white hover:bg-forest-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    data.availability ? "Accéder à mon programme →" : "Terminer →"
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-forest-500 mt-4">
                Tu pourras faire ton premier exercice depuis ton tableau de bord, quand tu veux.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
