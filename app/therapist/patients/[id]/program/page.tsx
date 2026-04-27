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

  const { data: therapistProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isTherapist = therapistProfile?.role === "therapist" || therapistProfile?.role === "kine";
  if (!isTherapist) redirect("/dashboard");

  const { data: link } = await supabase
    .from("therapist_patients")
    .select("id")
    .eq("therapist_id", user.id)
    .eq("patient_id", id)
    .single();

  if (!link) notFound();

  const { data: patient } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", id)
    .single();

  if (!patient) notFound();

  const patientName = patient.full_name || patient.email || "ce patient";

  // Récupérer les prescriptions actives
  const { data: prescriptions } = await supabase
    .from("prescriptions")
    .select("id, exercise_id, frequency_per_day, frequency_label, notes")
    .eq("patient_id", id)
    .eq("therapist_id", user.id)
    .eq("is_active", true);

  return (
    <div className="min-h-screen bg-beige-200 bg-texture pb-24">
      <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={`/therapist/patients/${id}`}
            className="flex items-center gap-2 text-forest-500 hover:text-forest-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Retour au patient</span>
          </Link>
          <div className="text-sm text-forest-600 font-medium">{patientName}</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-forest-800 mb-2">
            💊 Prescrire des exercices
          </h1>
          <p className="text-forest-500">
            Choisissez les exercices et la fréquence pour{" "}
            <span className="font-semibold text-forest-800">{patientName}</span>.
            Le patient les verra immédiatement dans son application.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm">
          <p className="font-semibold text-amber-800 mb-1">Comment ça fonctionne :</p>
          <ul className="space-y-1 text-amber-700">
            <li>✓ Cochez les exercices à prescrire et choisissez la fréquence</li>
            <li>✓ Le patient voit son programme personnalisé dans son application</li>
            <li>✓ Chaque séance réalisée apparaît dans votre tableau de bord</li>
            <li>✓ Vous pouvez modifier le programme à tout moment</li>
          </ul>
        </div>

        <ProgramForm
          patientId={id}
          therapistId={user.id}
          patientName={patientName}
          initialPrescriptions={prescriptions || []}
        />
      </main>
    </div>
  );
}
