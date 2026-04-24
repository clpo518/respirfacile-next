import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Connexion — Respirfacile",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🫁</span>
            <span className="font-bold text-2xl text-gray-900">
              Respir<span className="text-teal-600">facile</span>
            </span>
          </a>
        </div>
        <Suspense fallback={<div className="bg-white rounded-3xl p-8 text-center text-gray-400">Chargement...</div>}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
