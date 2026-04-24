import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isTherapist = profile?.role === "therapist" || profile?.role === "kine";
  if (!isTherapist) redirect("/dashboard");

  // Fetch patient
  const { data: patientProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!patientProfile) notFound();

  // Verify this patient belongs to this therapist
  const { data: link } = await supabase
    .from("therapist_patients")
    .select("id")
    .eq("therapist_id", user.id)
    .eq("patient_id", id)
    .eq("status", "active")
    .single();

  if (!link) redirect("/therapist");

  // Fetch sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  const sessionCount = sessions?.length ?? 0;

  return (
    <div className="min-h-screen bg-beige-200 bg-texture">
      {/* Header */}
      <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/therapist" className="flex items-center gap-2 text-forest-500 hover:text-forest-700 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Tableau de bord</span>
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-forest-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-beige-100" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
                <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-base text-forest-800">
              Respir<span className="text-copper-500">facile</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Patient header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-forest-500/10 border border-forest-500/20 flex items-center justify-center text-forest-700 text-2xl font-bold flex-shrink-0">
            {(patientProfile.full_name || patientProfile.email)?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-forest-800">
              {patientProfile.full_name || "Patient"}
            </h1>
            <p className="text-forest-500 text-sm mt-1">{patientProfile.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Séances réalisées", value: sessionCount.toString() },
            { label: "Dernière séance", value: sessions?.[0] ? new Date(sessions[0].created_at).toLocaleDateString("fr-FR") : "—" },
            { label: "Observance", value: sessionCount > 0 ? `${Math.min(100, Math.round((sessionCount / 20) * 100))}%` : "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-beige-100 rounded-3xl border border-beige-300 p-6 text-center shadow-beige">
              <p className="font-display text-3xl font-bold text-forest-800 mb-1">{stat.value}</p>
              <p className="text-xs text-forest-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sessions list */}
        <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-beige overflow-hidden">
          <div className="px-6 py-5 border-b border-beige-300 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-forest-800">Historique des séances</h2>
          </div>

          {sessionCount === 0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold text-forest-700 mb-2">Aucune séance encore</p>
              <p className="text-sm text-forest-500">
                Le patient n&apos;a pas encore réalisé de séance.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-beige-300">
              {sessions!.map((session: any) => (
                <li key={session.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-forest-800 text-sm">{session.exercise_id}</p>
                    <p className="text-xs text-forest-500 mt-0.5">
                      {new Date(session.created_at).toLocaleDateString("fr-FR", {
                        weekday: "long", day: "numeric", month: "long",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    {session.score != null && (
                      <p className="font-mono font-bold text-forest-800 text-sm">
                        {session.score} pts
                      </p>
                    )}
                    {session.duration_seconds && (
                      <p className="text-xs text-forest-500">
                        {Math.round(session.duration_seconds / 60)} min
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
