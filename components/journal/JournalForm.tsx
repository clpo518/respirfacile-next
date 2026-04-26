"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface JournalFormProps {
  userId: string;
}

export function JournalForm({ userId }: JournalFormProps) {
  const router = useRouter();
  const [wellbeing, setWellbeing] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [exerciseCompleted, setExerciseCompleted] = useState(true);
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [nasalBreathing, setNasalBreathing] = useState(5);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emojiScale = (value: number) => {
    if (value <= 2) return "😔";
    if (value <= 4) return "😐";
    if (value <= 6) return "🙂";
    if (value <= 8) return "😊";
    return "😄";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error: err } = await supabase.from("journal_entries").insert([
        {
          user_id: userId,
          wellbeing_score: wellbeing,
          sleep_score: sleep,
          exercise_completed: exerciseCompleted,
          anxiety_level: anxietyLevel,
          nasal_breathing: nasalBreathing,
          notes: notes.trim() || null,
          created_at: new Date().toISOString(),
        },
      ]);

      if (err) throw err;

      // Reset form
      setWellbeing(5);
      setSleep(5);
      setExerciseCompleted(true);
      setAnxietyLevel(5);
      setNasalBreathing(5);
      setNotes("");

      // Refresh
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  const ScaleControl = ({
    label,
    value,
    onChange,
    icon,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    icon?: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-forest-800">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emojiScale(value)}</span>
          <span className="text-sm font-bold text-forest-700 w-6 text-right">{value}</span>
        </div>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-beige-300 rounded-lg appearance-none cursor-pointer accent-forest-500"
      />
      <div className="flex justify-between text-xs text-forest-400 px-1">
        <span>Très mal</span>
        <span>Très bien</span>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Well-being scores */}
      <div className="space-y-6">
        <ScaleControl
          label="🫁 Comment te sens-tu globalement ?"
          value={wellbeing}
          onChange={setWellbeing}
        />
        <ScaleControl label="😴 Qualité de ton sommeil cette nuit" value={sleep} onChange={setSleep} />
        <ScaleControl
          label="😰 Niveau d'anxiété"
          value={anxietyLevel}
          onChange={setAnxietyLevel}
        />
        <ScaleControl
          label="👃 Respiration nasale"
          value={nasalBreathing}
          onChange={setNasalBreathing}
        />
      </div>

      {/* Exercises */}
      <div className="border-t border-beige-300 pt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={exerciseCompleted}
            onChange={(e) => setExerciseCompleted(e.target.checked)}
            className="w-5 h-5 rounded border border-forest-500 accent-forest-500 cursor-pointer"
          />
          <span className="font-semibold text-forest-800">
            ✓ J'ai réalisé mes exercices aujourd'hui
          </span>
        </label>
      </div>

      {/* Notes */}
      <div className="border-t border-beige-300 pt-6">
        <label htmlFor="notes" className="block text-sm font-semibold text-forest-800 mb-3">
          📝 Notes personnelles (optionnel)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Cette semaine j'ai remarqué que... je ressens..."
          rows={4}
          className="w-full px-4 py-3 rounded-2xl border border-beige-300 bg-beige-50 text-forest-800 placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 resize-none"
          disabled={isLoading}
        />
        <p className="text-xs text-forest-500 mt-2">
          Tes notes seront visibles par ton orthophoniste pour adapter ton programme
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300">
          <p className="text-sm font-medium text-red-800">Oups, quelque chose s'est mal passé</p>
          <p className="text-xs text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 rounded-2xl bg-forest-500 hover:bg-forest-600 disabled:opacity-50 text-beige-100 font-semibold transition-colors disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-colors"
      >
        {isLoading ? 'Enregistrement…' : 'Enregistrer mon journal'}
      </button>
    </form>
  )
}
