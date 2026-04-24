import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isTherapist = profile?.role === "therapist" || profile?.role === "kine";

  if (isTherapist) {
    redirect("/therapist");
  }

  // Patient dashboard — server rendered
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🫁</span>
            <span className="font-bold text-lg text-gray-900">
              Respir<span className="text-teal-600">facile</span>
            </span>
          </div>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-700">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bonjour {profile?.full_name?.split(" ")[0] || "!"} 👋
        </h1>
        <p className="text-gray-600 mb-8">
          Voici votre programme de rééducation respiratoire du jour.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Séances cette semaine", value: "0/5", icon: "📅" },
            { label: "Score Pause Contrôlée", value: "—", icon: "🫁" },
            { label: "Jours consécutifs", value: "0", icon: "🔥" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Exercices du jour
          </h2>
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-3">🏋️</p>
            <p className="font-medium">Votre programme est en cours de configuration</p>
            <p className="text-sm mt-1">
              Votre orthophoniste vous assignera un programme adapté à votre profil SAOS.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
