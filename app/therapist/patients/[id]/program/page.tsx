import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProgramForm } from "./ProgramForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProgramPage({ params }: Props) {
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

  // Récupérer le programme actif s'il existe
  const { data: activeProgram } = await supabase
    .from("patient_programs")
    .select("*")
    .eq("patient_id", id)
    .eq("is_active", true)
    .single();

  return (
    <div className="min-h-screen bg-beige-200 bg-texture">
      {/* Header */}
      <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Titre */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-forest-800 mb-2">
            Configurer le programme
          </h1>
          <p className="text-forest-500">
            Patient : <span className="font-semibold text-forest-800">{patient.full_name || patient.email}</span>
          </p>
        </div>

        {/* Formulaire */}
        <ProgramForm patientId={id} therapistId={user.id} initialProgram={activeProgram} />
      </main>
    </div>
  );
}
