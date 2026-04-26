"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { PatientProfileType } from "@/lib/data/exercises";

interface ProgramFormProps {
  patientId: string;
  therapistId: string;
  initialProgram: {
    id: string;
    profile_type: PatientProfileType;
    week_number: number;
    custom_notes: string | null;
  } | null;
}

const PROFILE_OPTIONS: Array<{
  id: PatientProfileType;
  label: string;
  description: string;
}> = [
  {
    id: "adult_saos_mild",
    label: "SAOS léger / modéré",
    description: "Appareillage partiel ou absent. Programme complet.",
  },
  {
    id: "adult_saos_severe",
    label: "SAOS sévère",
    description: "Sous CPAP. Exercices complémentaires validés.",
  },
  {
    id: "adult_tmof",
    label: "TMOF pure",
    description: "Dysfonction myofonctionnelle, sans SAOS diagnostiqué.",
  },
  {
    id: "adult_mixed",
    label: "SAOS + TMOF",
    description: "Profil mixte, le plus fréquent.",
  },
];

export function ProgramForm({
  patientId,
  therapistId,
  initialProgram,
}: ProgramFormProps) {
  const [selectedProfile, setSelectedProfile] = useState<PatientProfileType>(
    initialProgram?.profile_type ?? "adult_mixed"
  );
  const [weekNumber, setWeekNumber] = useState(initialProgram?.week_number ?? 1);
  const [customNotes, setCustomNotes] = useState(initialProgram?.custom_notes ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        patient_id: patientId,
        therapist_id: therapistId,
        profile_type: selectedProfile,
        week_number: weekNumber,
        custom_notes: customNotes || null,
        is_active: true,
      };

      const { error: err } = await supabase
        .from("patient_programs")
        .upsert(payload, {
          onConflict: "patient_id",
        });

      if (err) {
        setError(err.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/patient/${patientId}`);
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profil patient */}
      <div className="bg-beige-100 rounded-3xl border border-beige-300 p-6 shadow-beige">
        <h2 className="font-semibold text-lg text-forest-800 mb-3">Quel est le profil du patient ?</h2>
        <p className="text-sm text-forest-500 mb-4">Cela déterminera les exercices recommandés et la progression du programme.</p>
        <div className="space-y-3">
          {PROFILE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedProfile === option.id
                  ? "border-forest-500 bg-forest-500/5"
                  : "border-beige-300 hover:border-forest-300"
              }`}
            >
              <input
                type="radio"
                name="profile"
                value={option.id}
                checked={selectedProfile === option.id}
                onChange={(e) => setSelectedProfile(e.target.value as PatientProfileType)}
                className="mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="font-medium text-forest-800">{option.label}</p>
                <p className="text-sm text-forest-500 mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Semaine de programme */}
      <div className="bg-beige-100 rounded-3xl border border-beige-300 p-6 shadow-beige">
        <label className="block mb-4">
          <span className="font-semibold text-lg text-forest-800">À quelle semaine commence-t-il ?</span>
          <p className="text-sm text-forest-500 mt-1">Le programme s'étend sur 12 semaines. Sélectionnez le point de départ adapté.</p>
        </label>
        <input
          type="number"
          min="1"
          max="12"
          value={weekNumber}
          onChange={(e) => setWeekNumber(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full max-w-xs px-4 py-3 rounded-2xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white"
        />
        <p className="text-xs text-forest-400 mt-2">Semaines 1-12</p>
      </div>

      {/* Message personnalisé */}
      <div className="bg-beige-100 rounded-3xl border border-beige-300 p-6 shadow-beige">
        <label className="block mb-4">
          <span className="font-semibold text-lg text-forest-800">📝 Votre message pour le patient</span>
          <p className="text-sm text-forest-500 mt-1">Personnalisez ses instructions (optionnel, max 300 caractères)</p>
        </label>
        <textarea
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value.slice(0, 300))}
          placeholder="Ex: Commencez par 2 séances par jour, augmentez progressivement..."
          className="w-full px-4 py-3 rounded-2xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white resize-none"
          rows={4}
        />
        <p className="text-xs text-forest-400 mt-2">
          {customNotes.length}/300 caractères
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-forest-500/10 border border-forest-500/20 rounded-2xl px-5 py-3 text-sm text-forest-700 font-medium">
          Programme activé avec succès ! Redirection en cours...
        </div>
      )}

      {/* Bouton */}
      <button
        type="submit"
        disabled={isLoading || success}
        className="w-full px-6 py-4 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-400 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-colors"
      >
        {isLoading ? "Enregistrement…" : success ? "✓ Programme enregistré" : "Enregistrer le programme"}
      </button>
    </form>
  )
}
