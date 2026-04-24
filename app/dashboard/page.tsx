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
  const firstName = profile?.full_name?.split(" ")[0] || "vous";

  return (
    <div className="min-h-screen bg-beige-200 bg-texture">
      {/* Header */}
      <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-sm text-forest-500 hover:text-forest-700 transition-colors">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-forest-800 mb-1">
            Bonjour, {firstName}
          </h1>
          <p className="text-forest-500">
            Voici votre programme de rééducation respiratoire du jour.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Séances cette semaine",
              value: "0/5",
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              ),
            },
            {
              label: "Score Pause Contrôlée",
              value: "—",
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" />
                </svg>
              ),
            },
            {
              label: "Jours consécutifs",
              value: "0",
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
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

        {/* Exercises */}
        <div className="bg-beige-100 rounded-3xl border border-beige-300 p-8 shadow-beige">
          <h2 className="font-semibold text-xl text-forest-800 mb-6">
            Exercices du jour
          </h2>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-forest-500/10 border border-forest-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M9 11h6" />
              </svg>
            </div>
            <p className="font-semibold text-forest-700 mb-2">Programme en cours de configuration</p>
            <p className="text-sm text-forest-500 max-w-xs mx-auto leading-relaxed">
              Votre orthophoniste vous assignera un programme adapté à votre profil SAOS.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
