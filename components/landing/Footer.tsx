import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-forest-900 text-forest-300/70 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
                  <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-semibold text-white">Respirfacile</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">Rééducation respiratoire guidée pour SAOS et thérapie myofonctionnelle. Complément aux soins — ne remplace pas un suivi médical.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Connexion</Link></li>
              <li><Link href="/auth?mode=signup" className="hover:text-white transition-colors">Inscription</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
              <li><a href="mailto:contact@respirfacile.fr" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-forest-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Respirfacile — Annecy, France</p>
          <p className="text-xs">Dispositif d&apos;accompagnement — non substituable à un avis médical</p>
        </div>
      </div>
    </footer>
  )
}
