import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-beige-300 bg-beige-200/95 backdrop-blur supports-[backdrop-filter]:bg-beige-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 py-4 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-forest-500 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-beige-100" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
                <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-xl text-forest-800 tracking-tight">
              Respir<span className="text-copper-500">facile</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors">
              Tarifs
            </Link>
            <Link href="/about" className="text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors">
              Notre approche
            </Link>
            <Link href="/auth?mode=login" className="text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors">
              Connexion
            </Link>
            <Link
              href="/auth?mode=signup&role=therapist"
              className="rounded-full bg-forest-500 px-5 py-2.5 text-sm font-semibold text-beige-100 hover:bg-forest-600 transition-colors shadow-sm"
            >
              Essai gratuit 30 jours
            </Link>
          </nav>

          {/* Mobile CTA */}
          <Link
            href="/auth?mode=signup"
            className="md:hidden rounded-full bg-forest-500 px-4 py-2 text-sm font-semibold text-beige-100"
          >
            Essai gratuit
          </Link>
        </div>
      </div>
    </header>
  );
}
