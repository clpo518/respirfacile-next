import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Paramètres — Respirfacile",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isTherapist = profile?.role === "therapist" || profile?.role === "kine";
  const backHref = isTherapist ? "/therapist" : "/dashboard";

  return (
    <div className="min-h-screen bg-beige-200 bg-texture">
      {/* Header */}
      <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link href={backHref} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-forest-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-beige-100" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
                  <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-semibold text-base text-forest-800">
                Respir<span className="text-copper-500">facile</span>
              </span>
            </Link>
          </div>
          <Link href={backHref} className="text-sm text-forest-500 hover:text-forest-700 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-forest-800 mb-8">Paramètres</h1>

        {/* Profil */}
        <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-beige p-8 mb-4">
          <h2 className="font-semibold text-lg text-forest-800 mb-4">Mon profil</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-forest-400 uppercase tracking-wider mb-1">Nom</p>
              <p className="text-forest-800 font-medium">{profile?.full_name || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-forest-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-forest-800">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-forest-400 uppercase tracking-wider mb-1">Rôle</p>
              <p className="text-forest-800 capitalize">{profile?.role || "—"}</p>
            </div>
            {isTherapist && profile?.therapist_code && (
              <div>
                <p className="text-xs font-semibold text-forest-400 uppercase tracking-wider mb-1">Code Pro</p>
                <p className="font-mono font-bold text-forest-800 bg-forest-500/10 px-3 py-1 rounded-lg inline-block">
                  {profile.therapist_code}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Abonnement */}
        {isTherapist && (
          <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-beige p-8 mb-4">
            <h2 className="font-semibold text-lg text-forest-800 mb-4">Abonnement</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-forest-700 font-medium capitalize">
                  {profile?.subscription_tier || "Essai gratuit"}
                </p>
                <p className="text-sm text-forest-500 mt-1">
                  Statut : <span className="font-medium text-forest-700">{profile?.subscription_status || "trialing"}</span>
                </p>
              </div>
              <Link
                href="/pricing"
                className="text-sm font-semibold text-copper-500 hover:text-copper-600 transition-colors"
              >
                Voir les tarifs →
              </Link>
            </div>
          </div>
        )}

        {/* Déconnexion */}
        <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-beige p-8">
          <h2 className="font-semibold text-lg text-forest-800 mb-4">Compte</h2>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full border-2 border-forest-300 px-6 py-2.5 text-sm font-semibold text-forest-600 hover:bg-forest-500 hover:text-beige-100 hover:border-forest-500 transition-colors"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
