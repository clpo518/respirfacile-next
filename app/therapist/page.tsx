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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🫁</span>
            <span className="font-bold text-lg text-gray-900">
              Respir<span className="text-teal-600">facile</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/settings" className="text-sm text-gray-500 hover:text-gray-700">
              Paramètres
            </Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm text-gray-500 hover:text-gray-700">
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tableau de bord
            </h1>
            <p className="text-gray-600 mt-1">
              Code Pro :{" "}
              <span className="font-mono font-bold text-teal-600">
                {profile?.therapist_code || "En cours de génération..."}
              </span>
            </p>
          </div>
          <div className="rounded-xl bg-teal-50 border border-teal-200 px-4 py-2 text-sm text-teal-700">
            {patients.length} patient{patients.length !== 1 ? "s" : ""} actif{patients.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Patients actifs", value: patients.length, icon: "👥" },
            { label: "Séances ce mois", value: "—", icon: "📊" },
            { label: "Observance moyenne", value: "—", icon: "✅" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Patients list */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Mes patients</h2>
          </div>

          {patients.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-4xl mb-3">👥</p>
              <p className="font-semibold text-gray-700 mb-2">
                Aucun patient encore
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Partagez votre code Pro à vos patients pour qu&apos;ils rejoignent.
              </p>
              <div className="inline-flex items-center gap-2 rounded-xl bg-teal-50 border border-teal-200 px-6 py-3">
                <span className="text-sm text-gray-600">Votre code :</span>
                <span className="font-mono font-bold text-teal-700 text-lg">
                  {profile?.therapist_code || "—"}
                </span>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {patients.map((patient: any) => (
                <li key={patient.id}>
                  <Link
                    href={`/patient/${patient.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.full_name || patient.email}
                      </p>
                      <p className="text-sm text-gray-500">{patient.email}</p>
                    </div>
                    <span className="text-gray-400 text-sm">→</span>
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
