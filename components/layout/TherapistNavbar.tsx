import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function TherapistNavbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, subscription_status, trial_ends_at")
    .eq("id", user?.id ?? "")
    .single();

  const isTrialing = profile?.subscription_status === "trialing";
  let daysLeft = 0;
  if (isTrialing && profile?.trial_ends_at) {
    daysLeft = Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  }

  return (
    <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <Link href="/therapist" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-full bg-forest-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-beige-100" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
                <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-base text-forest-800">
              Respir<span className="text-copper-500">facile</span>
            </span>
            <span className="hidden md:inline text-forest-400 text-xs ml-1">· Espace professionnel</span>
          </Link>

          <div className="flex items-center gap-3">
            {isTrialing && daysLeft > 0 && (
              <Link
                href="/pricing"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-copper-500/10 border border-copper-500/30 text-copper-700 px-3 py-1.5 rounded-full hover:bg-copper-500/20 transition-colors"
              >
                ⏳ Essai — {daysLeft}j restants
              </Link>
            )}
            <Link
              href="/therapist/invite"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-forest-500 text-beige-100 px-4 py-2 rounded-full hover:bg-forest-600 transition-colors"
            >
              ➕ Ajouter un patient
            </Link>
            <Link href="/settings" className="text-sm text-forest-500 hover:text-forest-700 transition-colors hidden md:block">
              Paramètres
            </Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm text-forest-500 hover:text-forest-700 transition-colors">
                Déconnexion
              </button>
            </form>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex gap-1 border-t border-beige-300 pt-3">
          <Link
            href="/therapist"
            className="text-sm font-medium text-forest-700 hover:text-forest-900 px-3 pb-2 border-b-2 border-transparent hover:border-forest-500 transition-colors"
          >
            📊 Tableau de bord
          </Link>
          <Link
            href="/therapist/invite"
            className="text-sm font-medium text-forest-700 hover:text-forest-900 px-3 pb-2 border-b-2 border-transparent hover:border-forest-500 transition-colors"
          >
            👥 Ajouter un patient
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-forest-700 hover:text-forest-900 px-3 pb-2 border-b-2 border-transparent hover:border-forest-500 transition-colors md:hidden"
          >
            💳 Abonnement
          </Link>
        </nav>
      </div>
    </header>
  );
}
