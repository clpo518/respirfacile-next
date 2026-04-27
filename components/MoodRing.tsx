"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface MoodRingProps {
  compact?: boolean;
  userId?: string;
}

const MOODS = [
  { emoji: '😢', label: 'Très mal', value: 1 },
  { emoji: '😔', label: 'Pas bien', value: 2 },
  { emoji: '😐', label: 'Moyen', value: 3 },
  { emoji: '🙂', label: 'Bien', value: 4 },
  { emoji: '😄', label: 'Très bien', value: 5 },
];

export function MoodRing({ compact, userId }: MoodRingProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSelect = async (value: number) => {
    setSelected(value);
    if (!userId) return;
    try {
      const supabase = createClient();
      await supabase.from("mood_logs").insert({
        user_id: userId,
        mood_score: value,
        created_at: new Date().toISOString(),
      });
      setSaved(true);
    } catch (_) {
      // Silencieux si la table n'existe pas encore
      setSaved(true);
    }
  };

  return (
    <div className={`bg-beige-50 border border-beige-300 rounded-2xl ${compact ? 'p-4' : 'p-6'} text-center`}>
      {saved ? (
        <div className="py-2">
          <p className="text-sm font-medium text-forest-700">
            ✓ Merci, c'est noté pour aujourd'hui.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm font-semibold text-forest-700 mb-1">Comment vous sentez-vous aujourd'hui ?</p>
          <p className="text-xs text-forest-500 mb-3">Un mot suffit — ça aide à suivre votre évolution.</p>
          <div className="flex justify-center gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleSelect(mood.value)}
                title={mood.label}
                className={`text-2xl hover:scale-125 transition-all duration-150 rounded-full p-1 ${
                  selected === mood.value ? 'ring-2 ring-forest-500 scale-125' : ''
                }`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
