import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🫁</span>
            <span className="font-bold text-xl text-gray-900">
              Respir<span className="text-teal-600">facile</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Tarifs
            </Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Notre approche
            </Link>
            <Link href="/auth?mode=login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Connexion
            </Link>
            <Link
              href="/auth?mode=signup&role=therapist"
              className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
            >
              Essai gratuit 30 jours
            </Link>
          </nav>

          {/* Mobile CTA */}
          <Link
            href="/auth?mode=signup"
            className="md:hidden rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Essai gratuit
          </Link>
        </div>
      </div>
    </header>
  );
}
