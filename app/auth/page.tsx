import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthForm } from "@/components/auth/AuthForm"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Connexion — Respirfacile",
  description: "Connectez-vous à votre espace Respirfacile",
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-beige-100 flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-[#2D5016]/5 blur-3xl" />
        <div className="absolute -bottom-20 left-0 w-60 h-60 rounded-full bg-[#8B4513]/5 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#2D5016] flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
              <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-semibold text-lg text-forest-800">
            Respir<span className="text-copper-500">facile</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          <Suspense fallback={
            <div className="bg-beige-100 rounded-3xl border border-beige-300 p-10 animate-pulse">
              <div className="h-8 bg-beige-300 rounded-xl mb-4 w-3/4" />
              <div className="h-4 bg-beige-300 rounded mb-8 w-1/2" />
              <div className="space-y-4">
                <div className="h-12 bg-beige-300 rounded-xl" />
                <div className="h-12 bg-beige-300 rounded-xl" />
                <div className="h-12 bg-beige-300 rounded-xl" />
              </div>
            </div>
          }>
            <AuthForm />
          </Suspense>
        </div>
      </div>

      {/* Footer */}
      <footer className="pb-6 text-center text-sm text-forest-400 relative z-10">
        © {new Date().getFullYear()} Respirfacile ·{" "}
        <Link href="/mentions-legales" className="hover:text-forest-600 transition-colors">
          Mentions légales
        </Link>
      </footer>
    </div>
  )
}
