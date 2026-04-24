import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function TherapistDashboardPage() {
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

  // Fetch patients
  const { data: patientLinks } = await supabase
    .from("therapist_patients")
    .select("patient_id, profiles!therapist_patients_patient_id_fkey(id, full_name, email, created_at)")
    .eq("therapist_id", user.id)
    .eq("status", "active");

  const patients = patientLinks?.map((l: any) => l.profiles).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-beige-200 bg-texture">
      {/* Header */}
      <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            <span className="hidden md:inline text-forest-400 text-xs ml-2">· Espace orthophoniste</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/settings" className="text-sm text-forest-500 hover:text-forest-700 transition-colors">
              Paramètres
            </Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm text-forest-500 hover:text-forest-700 transition-colors">
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title + code */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-forest-800">
              Tableau de bord
            </h1>
            <p className="text-forest-500 mt-1 text-sm">
              Code Pro :{" "}
              <span className="font-mono font-bold text-forest-800 bg-forest-500/10 px-2 py-0.5 rounded-lg">
                {profile?.therapist_code || "En cours de génération..."}
              </span>
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-500/10 border border-forest-500/20 px-4 py-2 text-sm text-forest-700">
            <span className="w-2 h-2 rounded-full bg-forest-500" />
            {patients.length} patient{patients.length !== 1 ? "s" : ""} actif{patients.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Patients actifs",
              value: patients.length.toString(),
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              ),
            },
            {
              label: "Séances ce mois",
              value: "—",
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              ),
            },
            {
              label: "Observance moyenne",
              value: "—",
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-beige-100 rounded-3xl border border-beige-300 p-6 text-center shadow-beige">
              <div className="w-10 h-10 rounded-full bg-forest-500/10 border border-forest-500/20 flex items-center justify-center text-forest-600 mx-auto mb-3">
                {stat.icon}
              </div>
              <p className="font-display text-2xl font-bold text-forest-800">{stat.value}</p>
              <p className="text-xs text-forest-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Patients list */}
        <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-beige overflow-hidden">
          <div className="px-6 py-5 border-b border-beige-300">
            <h2 className="font-semibold text-lg text-forest-800">Mes patients</h2>
          </div>

          {patients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-forest-500/10 border border-forest-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className="font-semibold text-forest-700 mb-2">
                Aucun patient encore
              </p>
              <p className="text-sm text-forest-500 mb-6 max-w-xs mx-auto">
                Partagez votre code Pro à vos patients pour qu&apos;ils rejoignent.
              </p>
              <div className="inline-flex items-center gap-3 rounded-2xl bg-forest-500/10 border border-forest-500/20 px-6 py-3">
                <span className="text-sm text-forest-600">Votre code</span>
                <span className="font-mono font-bold text-forest-800 text-lg">
                  {profile?.therapist_code || "—"}
                </span>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-beige-300">
              {patients.map((patient: any) => (
                <li key={patient.id}>
                  <Link
                    href={`/patient/${patient.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-beige-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-forest-500/10 border border-forest-500/20 flex items-center justify-center text-forest-600 text-sm font-semibold">
                        {(patient.full_name || patient.email)?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-forest-800">
                          {patient.full_name || patient.email}
                        </p>
                        <p className="text-xs text-forest-500">{patient.email}</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-forest-400 group-hover:text-forest-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
