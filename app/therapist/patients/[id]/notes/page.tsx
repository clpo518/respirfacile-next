import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NotesForm } from "./NotesForm";

interface Props {
  params: Promise<{ id: string }>;
}

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
  const { data: existingNotes } = await supabase
    .from("session_notes")
    .select("id, content, created_at, visible_to_patient")
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

        <NotesForm
          patientId={id}
          therapistId={user.id}
          patientName={patient.full_name || patient.email}
          initialNotes={existingNotes || []}
        />
      </main>
    </div>
  );
}
