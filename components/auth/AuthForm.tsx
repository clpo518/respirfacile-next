"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
          "Vérifiez votre email pour confirmer votre compte. Vous serez redirigé automatiquement."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {isSignup
          ? role === "therapist"
            ? "Créer un compte orthophoniste"
            : "Rejoindre avec un code Pro"
          : "Connexion"}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {isSignup && role === "therapist"
          ? "30 jours gratuits · Sans carte bancaire"
          : isSignup
          ? "Votre orthophoniste vous a transmis un code"
          : "Bienvenue sur Respirfacile"}
      </p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl bg-teal-50 border border-teal-200 p-4 text-sm text-teal-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Dr. Marie Martin"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="vous@exemple.fr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        {isSignup && role !== "therapist" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code Pro de votre orthophoniste
            </label>
            <input
              type="text"
              value={proCode}
              onChange={(e) => setProCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="PRO-XXXXXX"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
        >
          {isSignup
            ? "Déjà un compte ? Se connecter"
            : "Pas encore de compte ? S'inscrire"}
        </button>
      </div>
    </div>
  );
}
