"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface SubscriptionGateProps {
  children: React.ReactNode;
}

export function SubscriptionGate({ children }: SubscriptionGateProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);

  useEffect(() => {
    checkSubscription();
  }, []);

  async function checkSubscription() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, trial_ends_at")
        .eq("id", user.id)
        .single();

      if (profile) {
        setSubscriptionStatus(profile.subscription_status);
        setTrialEndsAt(profile.trial_ends_at);

        const isActive = profile.subscription_status === "active" || profile.subscription_status === "trialing";
        setHasActiveSubscription(isActive);

        // Check if trial expired
        if (profile.subscription_status === "trialing" && profile.trial_ends_at) {
          const trialEndDate = new Date(profile.trial_ends_at);
          const now = new Date();
          if (now > trialEndDate) {
            setHasActiveSubscription(false);
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-beige-200">Chargement...</div>;
  }

  if (!hasActiveSubscription && subscriptionStatus !== "trialing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-200 bg-texture px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-copper-500/10 border-2 border-copper-500 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-copper-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-forest-800 mb-3">
            Essai gratuit terminé
          </h1>
          <p className="text-forest-600 mb-8">
            Vous avez testé Respirfacile. Activez un abonnement pour continuer à accompagner vos patients.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-copper-500 hover:bg-copper-600 px-8 py-3 text-beige-100 font-semibold transition-colors shadow-copper"
          >
            Voir les plans
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-xs text-forest-400 mt-4">
            30 jours gratuits · Pas de CB requise
          </p>
        </div>
      </div>
    );
  }

  // If trialing but expired
  if (subscriptionStatus === "trialing" && trialEndsAt) {
    const trialEndDate = new Date(trialEndsAt);
    const now = new Date();
    if (now > trialEndDate) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-beige-200 bg-texture px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-copper-500/10 border-2 border-copper-500 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-copper-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-forest-800 mb-3">
              Essai gratuit terminé
            </h1>
            <p className="text-forest-600 mb-8">
              Vous avez testé Respirfacile. Activez un abonnement pour continuer à accompagner vos patients.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-copper-500 hover:bg-copper-600 px-8 py-3 text-beige-100 font-semibold transition-colors shadow-copper"
            >
              Activer un plan
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      );
    }
  }

  // Subscription is active or valid trial
  return <>{children}</>
}
