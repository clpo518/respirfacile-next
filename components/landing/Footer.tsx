import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🫁</span>
              <span className="font-bold text-white text-lg">
                Respir<span className="text-teal-400">facile</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Rééducation respiratoire pour l&apos;apnée du sommeil. Basé sur la
              science, prescrit par les orthophonistes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Notre approche</Link></li>
              <li><Link href="/auth?mode=signup&role=therapist" className="hover:text-white transition-colors">Essai gratuit</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">CGU</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2026 Respirfacile. Fait avec ❤️ à Annecy, France.</p>
          <p className="text-xs text-gray-500">
            Complément de traitement — ne remplace pas l&apos;avis médical.
            RGPD · HDS · Hébergement France.
          </p>
        </div>
      </div>
    </footer>
  );
}
