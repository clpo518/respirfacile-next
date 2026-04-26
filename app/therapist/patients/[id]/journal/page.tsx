import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function emojiScale(value: number) {
  if (value <= 2) return "😔";
  if (value <= 4) return "😐";
  if (value <= 6) return "🙂";
  if (value <= 8) return "😊";
  return "😄";
}

export default async function PatientJournalPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // Vérifier que l'utilisateur est thérapeute
  const { data: therapistProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isTherapist = therapistProfile?.role === "therapist" || therapistProfile?.role === "kine";
  if (!isTherapist) redirect("/dashboard");

  // Vérifier que ce patient appartient à cet ortho
  const { data: link } = await supabase
    .from("therapist_patients")
    .select("id")
    .eq("therapist_id", user.id)
    .eq("patient_id", id)
    .single();

  if (!link) notFound();

  // Récupérer le patient
  const { data: patient } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", id)
    .single();

  if (!patient) notFound();

  // Récupérer les entrées journal
  const { data: entries } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-beige-200 bg-texture">
      {/* Header */}
      <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/therapist/patients/${id}`}
              className="flex items-center gap-2 text-forest-500 hover:text-forest-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Retour au patient</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Titre */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-forest-800 mb-2">
            📓 Journal de bord
          </h1>
          <p className="text-forest-500">
            Patient : <span className="font-semibold text-forest-800">{patient.full_name || patient.email}</span>
          </p>
        </div>

        {/* Entrées */}
        {(!entries || entries.length === 0) ? (
          <div className="bg-beige-100 rounded-3xl border border-beige-300 p-12 shadow-beige text-center">
            <div className="text-4xl mb-4">📔</div>
            <p className="text-forest-600">Le patient commencera à remplir son journal dès sa première séance.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry: any) => (
              <div
                key={entry.id}
                className="bg-beige-100 rounded-3xl border border-beige-300 p-6 shadow-beige hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-beige-300">
                  <p className="text-sm font-semibold text-forest-800">{formatDate(entry.created_at)}</p>
                  <div className="flex items-center gap-3">
                    {entry.exercise_completed && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-forest-100 text-forest-700 text-xs font-medium">
                        ✓ Exercices complétés
                      </span>
                    )}
                    {entry.anxiety_level >= 7 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-copper-100 text-copper-700 text-xs font-medium">
                        ⚠️ Anxiété signalée
                      </span>
                    )}
                  </div>
                </div>

                {/* Scores grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl mb-1">{emojiScale(entry.wellbeing_score)}</div>
                    <p className="text-xs text-forest-500 mb-1">Bien-être</p>
                    <p className="font-bold text-forest-800">{entry.wellbeing_score}/10</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{emojiScale(entry.sleep_score)}</div>
                    <p className="text-xs text-forest-500 mb-1">Sommeil</p>
                    <p className="font-bold text-forest-800">{entry.sleep_score}/10</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{emojiScale(entry.anxiety_level)}</div>
                    <p className="text-xs text-forest-500 mb-1">Anxiété</p>
                    <p className="font-bold text-forest-800">{entry.anxiety_level}/10</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{emojiScale(entry.nasal_breathing)}</div>
                    <p className="text-xs text-forest-500 mb-1">Respiration nasale</p>
                    <p className="font-bold text-forest-800">{entry.nasal_breathing}/10</p>
                  </div>
                </div>

                {/* Notes */}
                {entry.notes && (
                  <div className="bg-beige-50 rounded-2xl p-4 border border-beige-200 mb-4">
                    <p className="text-sm text-forest-700 whitespace-pre-wrap">{entry.notes}</p>
                  </div>
                )}

                {/* Action */}
                <div className="pt-4 border-t border-beige-300">
                  <p className="text-xs text-forest-400 mb-3">Ajouter une observation clinique sur cette entrée (en développement)</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
