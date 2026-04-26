import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NotesForm } from "./NotesForm";

interface Props {
  params: Promise<{ id: string }>;
}

const formatDate = (iso: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
};

export default async function NotesPage({ params }: Props) {
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

  // Récupérer les notes existantes (si table existe)
  const { data: existingNotes = [] } = await supabase
    .from("session_notes")
    .select("*")
    .eq("patient_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 to-beige-100">
      {/* Header */}
      <header className="bg-white border-b border-beige-200 px-4 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/therapist"
            className="flex items-center gap-2 text-forest-600 hover:text-forest-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux patients
          </Link>
          <div className="text-sm text-forest-600 font-medium">
            {patient.full_name || patient.email}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-forest-800 mb-2">
            📝 Notes cliniques
          </h1>
          <p className="text-forest-600">
            Observations et suivi thérapeutique de <span className="font-semibold text-forest-800">{patient.full_name || patient.email}</span>
          </p>
        </div>

        {/* Formulaire en bas avec Notes précédentes en haut */}
        <div className="space-y-8">
          {/* Notes précédentes */}
          {existingNotes && existingNotes.length > 0 && (
            <div className="bg-white rounded-3xl border border-beige-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-forest-800 mb-6">Historique des notes</h2>
              <div className="space-y-4">
                {existingNotes.map((note: any) => (
                  <div
                    key={note.id}
                    className="p-6 rounded-2xl border border-beige-200 bg-beige-50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm font-semibold text-forest-800">
                        {formatDate(note.created_at)}
                      </p>
                      {note.visible_to_patient && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          👁️ Visible patient
                        </span>
                      )}
                    </div>
                    <p className="text-forest-700 whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulaire d'ajout de note */}
          <div className="bg-white rounded-3xl border border-beige-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-forest-800 mb-6">Ajouter une note</h2>
            <NotesForm patientId={id} therapistId={user.id} patientName={patient.full_name || patient.email} />
          </div>
        </div>
      </main>
    </div>
  );
}
