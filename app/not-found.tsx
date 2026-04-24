import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-beige-200 bg-texture flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-forest-500/10 border border-forest-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M9 11h6" />
          </svg>
        </div>
        <p className="text-copper-500 text-sm font-semibold uppercase tracking-widest mb-3">404</p>
        <h1 className="font-display text-4xl font-bold text-forest-800 mb-4">
          Page introuvable
        </h1>
        <p className="text-forest-600 text-lg max-w-sm mx-auto leading-relaxed">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-forest-500 text-beige-100 px-8 py-3.5 text-sm font-semibold hover:bg-forest-600 transition-colors shadow-forest"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
