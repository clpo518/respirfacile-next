import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-forest-900 text-forest-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-beige-100" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
                  <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-semibold text-lg text-beige-200">
                Respir<span className="text-copper-400">facile</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-forest-500">
              Rééducation respiratoire pour l&apos;apnée du sommeil. Basé sur la
              science, prescrit par les orthophonistes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-beige-300 mb-4 text-sm">Produit</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/pricing" className="hover:text-beige-200 transition-colors">Tarifs</Link></li>
              <li><Link href="/about" className="hover:text-beige-200 transition-colors">Notre approche</Link></li>
              <li><Link href="/auth?mode=signup&role=therapist" className="hover:text-beige-200 transition-colors">Essai gratuit</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-beige-300 mb-4 text-sm">Ressources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/blog" className="hover:text-beige-200 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-beige-200 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-beige-300 mb-4 text-sm">Légal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-beige-200 transition-colors">Confidentialité</Link></li>
              <li><Link href="/terms" className="hover:text-beige-200 transition-colors">CGU</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-forest-600">
          <p>© 2026 Respirfacile · Fait avec soin à Annecy, France 🇫🇷</p>
          <p>
            Complément de traitement — ne remplace pas l&apos;avis médical.
            RGPD · Hébergement France.
          </p>
        </div>
      </div>
    </footer>
  );
}
