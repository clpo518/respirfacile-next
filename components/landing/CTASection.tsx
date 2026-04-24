import Link from "next/link";

export function CTASection() {
  return (
    <section className="w-full py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-600 to-blue-700">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Prêt à prescrire la rééducation respiratoire ?
        </h2>
        <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
          Rejoignez les 40+ orthophonistes qui utilisent Respirfacile. Essai
          30 jours gratuit, sans carte bancaire. Annulable à tout moment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth?mode=signup&role=therapist"
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-bold text-teal-700 hover:bg-teal-50 transition-colors shadow-xl"
          >
            Commencer l&apos;essai gratuit →
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full border-2 border-white/50 px-10 py-4 text-base font-semibold text-white hover:border-white hover:bg-white/10 transition-colors"
          >
            Voir les tarifs
          </Link>
        </div>
        <p className="mt-6 text-sm text-teal-200">
          Sans CB · Sans engagement · Patients gratuits
        </p>
      </div>
    </section>
  );
}
