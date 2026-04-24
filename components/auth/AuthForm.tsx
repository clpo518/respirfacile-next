"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const role = searchParams.get("role") || "therapist";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [proCode, setProCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSignup, setIsSignup] = useState(mode === "signup");

  useEffect(() => {
    setIsSignup(mode === "signup");
  }, [mode]);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: proCode ? "patient" : role,
              pro_code: proCode || null,
            },
          },
        });
        if (error) throw error;
        setSuccess(
          "Vérifiez votre email pour confirmer votre compte."
        );
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Redirect based on role
        const userRole = data.user?.user_metadata?.role;
        if (userRole === "therapist" || userRole === "kine") {
          router.push("/therapist");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue";
      // Translate common Supabase error messages to French
      if (msg.includes("Invalid login credentials")) {
        setError("Email ou mot de passe incorrect.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Confirmez d'abord votre email (vérifiez votre boîte mail).");
      } else if (msg.includes("User already registered")) {
        setError("Un compte existe déjà avec cet email. Connectez-vous.");
      } else if (msg.includes("Password should be at least")) {
        setError("Le mot de passe doit faire au moins 6 caractères.");
      } else if (msg.includes("Unable to validate email")) {
        setError("Adresse email invalide.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const isTherapistSignup = isSignup && role === "therapist";

  return (
    <div className="bg-beige-100 rounded-4xl shadow-forest-lg border border-beige-300 p-8 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-forest-500 hover:text-forest-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Accueil</span>
        </Link>

        <h1 className="font-display text-3xl font-bold text-forest-800 mb-2">
          {isSignup
            ? isTherapistSignup
              ? "Créer un compte orthophoniste"
              : "Rejoindre avec un code Pro"
            : "Connexion"}
        </h1>
        <p className="text-forest-500 text-sm">
          {isTherapistSignup
            ? "30 jours gratuits · Sans carte bancaire"
            : isSignup
            ? "Votre orthophoniste vous a transmis un code"
            : "Bienvenue sur Respirfacile"}
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-2xl bg-forest-500/10 border border-forest-500/20 p-4 text-sm text-forest-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignup && (
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1.5">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-beige-400 bg-beige-50 px-4 py-3 text-sm text-forest-800 placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 transition-colors"
              placeholder="Dr. Marie Martin"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-beige-400 bg-beige-50 px-4 py-3 text-sm text-forest-800 placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 transition-colors"
            placeholder="vous@exemple.fr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-1.5">
            Mot de passe
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-beige-400 bg-beige-50 px-4 py-3 text-sm text-forest-800 placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        {isSignup && !isTherapistSignup && (
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1.5">
              Code Pro de votre orthophoniste
            </label>
            <input
              type="text"
              value={proCode}
              onChange={(e) => setProCode(e.target.value.toUpperCase())}
              className="w-full rounded-2xl border border-beige-400 bg-beige-50 px-4 py-3 text-sm font-mono text-forest-800 placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 transition-colors"
              placeholder="PRO-XXXXXX"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-forest-500 py-4 text-sm font-semibold text-beige-100 hover:bg-forest-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-forest mt-2"
        >
          {loading
            ? "Chargement..."
            : isSignup
            ? "Créer mon compte"
            : "Se connecter"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="text-sm text-forest-500 hover:text-forest-700 transition-colors"
        >
          {isSignup
            ? "Déjà un compte ? Se connecter"
            : "Pas encore de compte ? S'inscrire"}
        </button>
      </div>

      {isTherapistSignup && (
        <div className="mt-6 pt-6 border-t border-beige-300 text-center">
          <p className="text-xs text-forest-400">
            Sans carte bancaire · Annulable à tout moment · RGPD
          </p>
        </div>
      )}
    </div>
  );
}
