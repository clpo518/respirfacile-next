"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { EXERCISES } from "@/lib/data/exercises";

interface Prescription {
  exercise_id: string;
  frequency_per_day: number;
  frequency_label: string;
  notes: string;
}

interface ProgramFormProps {
  patientId: string;
  therapistId: string;
  patientName: string;
  initialPrescriptions: Array<{
    id: string;
    exercise_id: string;
    frequency_per_day: number;
    frequency_label: string;
    notes: string | null;
  }>;
}

const FREQUENCY_OPTIONS = [
  { value: 1, label: "1× par jour" },
  { value: 2, label: "2× par jour" },
  { value: 3, label: "3× par jour" },
  { value: 0, label: "Tous les 2 jours" },
];

const CATEGORY_LABELS: Record<string, string> = {
  pause_controlee: "🫁 Pause contrôlée",
  coherence_cardiaque: "💚 Cohérence cardiaque",
  respiration_nasale: "👃 Respiration nasale",
  myofonctionnel: "💪 Bouche & langue",
  diaphragmatique: "🌊 Respiration abdominale",
  relaxation: "🧘 Relaxation",
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Débutant",
  2: "Intermédiaire",
  3: "Avancé",
};

export function ProgramForm({ patientId, therapistId, patientName, initialPrescriptions }: ProgramFormProps) {
  const [prescriptions, setPrescriptions] = useState<Map<string, Prescription>>(
    () => {
      const map = new Map<string, Prescription>();
      initialPrescriptions.forEach((p) => {
        map.set(p.exercise_id, {
          exercise_id: p.exercise_id,
          frequency_per_day: p.frequency_per_day,
          frequency_label: p.frequency_label,
          notes: p.notes || "",
        });
      });
      return map;
    }
  );
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggleExercise = (exerciseId: string) => {
    setPrescriptions((prev) => {
      const next = new Map(prev);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.set(exerciseId, {
          exercise_id: exerciseId,
          frequency_per_day: 1,
          frequency_label: "1× par jour",
          notes: "",
        });
        setExpandedExercise(exerciseId);
      }
      return next;
    });
  };

  const updatePrescription = (exerciseId: string, field: keyof Prescription, value: string | number) => {
    setPrescriptions((prev) => {
      const next = new Map(prev);
      const current = next.get(exerciseId);
      if (current) {
        next.set(exerciseId, { ...current, [field]: value });
      }
      return next;
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      // 1. Désactiver toutes les prescriptions existantes
      await supabase
        .from("prescriptions")
        .update({ is_active: false })
        .eq("patient_id", patientId)
        .eq("therapist_id", therapistId);

      // 2. Insérer les nouvelles prescriptions
      const toInsert = Array.from(prescriptions.values()).map((p) => ({
        therapist_id: therapistId,
        patient_id: patientId,
        exercise_id: p.exercise_id,
        frequency_per_day: p.frequency_per_day,
        frequency_label: p.frequency_label,
        notes: p.notes || null,
        is_active: true,
      }));

      if (toInsert.length > 0) {
        const { error: insertErr } = await supabase.from("prescriptions").insert(toInsert);
        if (insertErr) {
          setError("Erreur lors de l'enregistrement : " + insertErr.message);
          return;
        }

        // 3. Notifier le patient par email (Edge Function)
        try {
          const exercisesForEmail = Array.from(prescriptions.values()).map((p) => {
            const ex = EXERCISES.find((e) => e.id === p.exercise_id);
            return {
              name: ex?.name_fr || p.exercise_id,
              frequency: p.frequency_label,
              note: p.notes || undefined,
            };
          });
          await supabase.functions.invoke("notify-prescription", {
            body: {
              patient_id: patientId,
              therapist_id: therapistId,
              exercises: exercisesForEmail,
            },
          });
        } catch {
          // Ne pas bloquer si l'email échoue
          console.warn("Email notification failed (non-blocking)");
        }
      }

      setSuccess(true);
      setTimeout(() => router.push(`/therapist/patients/${patientId}`), 1500);
    } catch (err) {
      setError("Erreur inattendue.");
    } finally {
      setIsLoading(false);
    }
  };

  // Grouper les exercices par catégorie
  const byCategory = EXERCISES.reduce((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = [];
    acc[ex.category].push(ex);
    return acc;
  }, {} as Record<string, typeof EXERCISES>);

  const selectedCount = prescriptions.size;

  return (
    <div className="space-y-6">

      {/* Résumé programme actuel */}
      {selectedCount > 0 && (
        <div className="bg-forest-500/10 border border-forest-500/20 rounded-2xl p-4">
          <p className="text-sm font-semibold text-forest-700 mb-2">
            ✓ {selectedCount} exercice{selectedCount > 1 ? "s" : ""} prescrit{selectedCount > 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(prescriptions.values()).map((p) => {
              const ex = EXERCISES.find((e) => e.id === p.exercise_id);
              return ex ? (
                <span key={p.exercise_id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-forest-500/20 text-forest-700 text-xs font-medium">
                  {ex.emoji} {ex.name_fr} — {p.frequency_label}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Exercices par catégorie */}
      {Object.entries(byCategory).map(([category, exercises]) => (
        <div key={category} className="bg-white rounded-3xl border border-beige-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-beige-100 bg-beige-50">
            <h2 className="font-semibold text-forest-800">{CATEGORY_LABELS[category] || category}</h2>
          </div>
          <div className="divide-y divide-beige-100">
            {exercises.map((ex) => {
              const isSelected = prescriptions.has(ex.id);
              const prescription = prescriptions.get(ex.id);
              const isExpanded = expandedExercise === ex.id && isSelected;

              return (
                <div key={ex.id} className={`transition-colors ${isSelected ? "bg-forest-500/5" : ""}`}>
                  {/* Ligne principale */}
                  <div className="flex items-center gap-4 px-6 py-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleExercise(ex.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? "bg-forest-500 border-forest-500 text-white"
                          : "border-beige-300 hover:border-forest-400"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Emoji + info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl">{ex.emoji}</span>
                        <span className="font-medium text-forest-800 text-sm">{ex.name_fr}</span>
                        <span className="text-xs text-forest-400 bg-beige-100 px-2 py-0.5 rounded-full">
                          {DIFFICULTY_LABELS[ex.difficulty]}
                        </span>
                        <span className="text-xs text-forest-400">
                          {Math.floor(ex.duration_seconds / 60)}min
                        </span>
                      </div>
                      <p className="text-xs text-forest-500 mt-0.5 line-clamp-1">{ex.description_fr}</p>
                    </div>

                    {/* Fréquence rapide si sélectionné */}
                    {isSelected && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select
                          value={prescription?.frequency_per_day}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const opt = FREQUENCY_OPTIONS.find((o) => o.value === val);
                            updatePrescription(ex.id, "frequency_per_day", val);
                            updatePrescription(ex.id, "frequency_label", opt?.label || val + "× par jour");
                          }}
                          className="text-xs border border-beige-300 rounded-lg px-2 py-1 bg-white text-forest-700 focus:outline-none focus:ring-1 focus:ring-forest-500"
                        >
                          {FREQUENCY_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setExpandedExercise(isExpanded ? null : ex.id)}
                          className="text-xs text-forest-500 hover:text-forest-700 underline whitespace-nowrap"
                        >
                          {isExpanded ? "Fermer" : "+ Note"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Note personnalisée expandée */}
                  {isExpanded && isSelected && (
                    <div className="px-6 pb-4">
                      <textarea
                        value={prescription?.notes || ""}
                        onChange={(e) => updatePrescription(ex.id, "notes", e.target.value)}
                        placeholder="Conseil personnalisé pour cet exercice (optionnel)..."
                        rows={2}
                        className="w-full text-sm px-3 py-2 rounded-xl border border-beige-300 bg-beige-50 text-forest-800 placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-500/30 resize-none"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Message d'erreur/succès */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-green-700 font-medium">Programme enregistré ! Le patient verra ses exercices immédiatement.</p>
        </div>
      )}

      {/* Bouton save sticky */}
      <div className="sticky bottom-4 pt-2">
        <button
          onClick={handleSave}
          disabled={isLoading || success || selectedCount === 0}
          className="w-full py-4 rounded-2xl bg-forest-500 hover:bg-forest-600 disabled:bg-beige-300 disabled:cursor-not-allowed text-white font-semibold transition-colors shadow-lg"
        >
          {isLoading
            ? "Enregistrement..."
            : success
            ? "✓ Programme enregistré"
            : selectedCount === 0
            ? "Sélectionnez au moins un exercice"
            : `Prescrire ${selectedCount} exercice${selectedCount > 1 ? "s" : ""} à ${patientName}`}
        </button>
      </div>
    </div>
  );
}
