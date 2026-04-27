"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Note {
  id: string;
  content: string;
  created_at: string;
  visible_to_patient?: boolean;
}

interface NotesFormProps {
  patientId: string;
  therapistId: string;
  patientName: string;
  initialNotes: Note[];
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export function NotesForm({ patientId, therapistId, patientName, initialNotes }: NotesFormProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notes, setNotes] = useState<Note[]>(initialNotes || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!content.trim()) {
      setError("Veuillez entrer une note.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data: newNote, error: err } = await supabase
        .from("session_notes")
        .insert([
          {
            therapist_id: therapistId,
            patient_id: patientId,
            content: content.trim(),
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (err) {
        console.error("Erreur Supabase:", err);
        setError("Impossible d'enregistrer la note. La table session_notes n'existe peut-être pas encore.");
      } else {
        // Ajouter la note au début de la liste sans recharger la page
        setNotes((prev) => [newNote, ...prev]);
        setContent("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err) {
      setError("Erreur inattendue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Liste des notes */}
      {notes.length > 0 ? (
        <div className="bg-white rounded-3xl border border-beige-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-forest-800 mb-6">
            Historique des notes ({notes.length})
          </h2>
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl border border-beige-200 bg-beige-50"
              >
                <p className="text-xs font-semibold text-forest-500 mb-2">
                  {formatDate(note.created_at)}
                </p>
                <p className="text-forest-800 whitespace-pre-wrap text-sm leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-beige-50 border border-beige-200 rounded-2xl p-6 text-center text-forest-500 text-sm">
          Aucune note pour ce patient. Ajoutez votre première observation ci-dessous.
        </div>
      )}

      {/* Formulaire d'ajout */}
      <div className="bg-white rounded-3xl border border-beige-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-forest-800 mb-6">Ajouter une note</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-forest-800 mb-2">
              Note thérapeutique
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Observations sur la progression de ${patientName}, recommandations, points à travailler...`}
              rows={6}
              className="w-full px-4 py-3 rounded-2xl border border-beige-300 bg-beige-100 text-forest-800 placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 resize-none"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-700 font-medium">Note enregistrée et visible ci-dessus ✓</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="w-full px-6 py-3 rounded-xl bg-forest-500 hover:bg-forest-600 disabled:bg-forest-300 text-beige-100 font-semibold transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? "Enregistrement en cours..." : "Enregistrer la note"}
          </button>
        </form>
      </div>
    </div>
  );
}
