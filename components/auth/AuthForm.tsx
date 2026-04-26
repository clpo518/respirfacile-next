'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type AuthMode = 'login' | 'signup';
type SignupRole = 'therapist' | 'patient';

export function AuthForm() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get('mode') === 'signup' ? 'signup' : 'login') as AuthMode;
  const initialRole = (searchParams.get('role') === 'therapist' ? 'therapist' : 'patient') as SignupRole;

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<SignupRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [proCode, setProCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // La redirection se fait côté serveur via middleware/dashboard
        router.push('/dashboard');
        router.refresh();
      } else {
        // Signup — vérifications
        if (!fullName.trim()) {
          throw new Error('Veuillez saisir votre nom complet.');
        }
        if (role === 'patient' && !proCode.trim()) {
          throw new Error('Le code PRO de votre orthophoniste est requis.');
        }

        // Vérifier le code Pro si patient
        let therapistId: string | null = null;
        if (role === 'patient' && proCode.trim()) {
          const { data: therapist } = await supabase
            .from('profiles')
            .select('id')
            .eq('therapist_code', proCode.trim().toUpperCase())
            .single();

          if (!therapist) {
            throw new Error('Code PRO invalide. Vérifiez avec votre orthophoniste.');
          }
          therapistId = therapist.id;
        }

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
            },
          },
        });
        if (signUpError) throw signUpError;

        if (authData.user) {
          // Créer le profil
          const profileData: Record<string, unknown> = {
            id: authData.user.id,
            email,
            full_name: fullName,
            role,
          };

          if (role === 'therapist') {
            // Générer un code PRO unique
            const code = 'PRO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            profileData.therapist_code = code;
            profileData.subscription_status = 'trialing';
            profileData.trial_ends_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          }

          await supabase.from('profiles').upsert(profileData);

          // Lier patient à son ortho
          if (role === 'patient' && therapistId) {
            await supabase.from('therapist_patients').insert({
              therapist_id: therapistId,
              patient_id: authData.user.id,
              status: 'active',
            });
          }

          if (role === 'therapist') {
            router.push('/therapist/onboarding');
          } else {
            router.push('/onboarding');
          }
          router.refresh();
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue';
      // Traduire les erreurs Supabase communes
      if (msg.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect.');
      } else if (msg.includes('Email already registered') || msg.includes('already been registered')) {
        setError('Cet email est déjà utilisé. Connectez-vous ou réinitialisez votre mot de passe.');
      } else if (msg.includes('Password should be')) {
        setError('Le mot de passe doit faire au moins 6 caractères.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Card */}
      <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-sm p-8 md:p-10">
        {/* Toggle login/signup */}
        <div className="flex bg-beige-200 rounded-2xl p-1 mb-8">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'login'
                ? 'bg-beige-100 text-forest-800 shadow-sm'
                : 'text-forest-500 hover:text-forest-700'
            }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'signup'
                ? 'bg-beige-100 text-forest-800 shadow-sm'
                : 'text-forest-500 hover:text-forest-700'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-forest-800 mb-1">
            {mode === 'login' ? 'Bon retour 👋' : 'Créer votre compte'}
          </h1>
          <p className="text-sm text-forest-500">
            {mode === 'login'
              ? 'Connectez-vous à votre espace Respirfacile.'
              : 'Rejoignez 85 professionnels et leurs patients.'}
          </p>
        </div>

        {/* Role selector (signup only) */}
        {mode === 'signup' && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setRole('therapist')}
              className={`flex-1 p-3 rounded-2xl border-2 text-sm font-semibold transition-all text-left ${
                role === 'therapist'
                  ? 'border-forest-500 bg-forest-500/5 text-forest-800'
                  : 'border-beige-300 text-forest-500 hover:border-forest-300'
              }`}
            >
              <div className="text-lg mb-1">🩺</div>
              Orthophoniste / Kiné
            </button>
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 p-3 rounded-2xl border-2 text-sm font-semibold transition-all text-left ${
                role === 'patient'
                  ? 'border-copper-500 bg-copper-500/5 text-forest-800'
                  : 'border-beige-300 text-forest-500 hover:border-forest-300'
              }`}
            >
              <div className="text-lg mb-1">🫁</div>
              Patient
            </button>
          </div>
        )}

        {/* Error / Success */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm mb-5">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 rounded-2xl bg-forest-500/10 border border-forest-500/20 text-forest-700 text-sm mb-5">
            {success}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {/* Full name (signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-forest-700 mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder={role === 'therapist' ? 'Dr. Marie Dupont' : 'Jean Martin'}
                className="w-full px-4 py-3 rounded-2xl border border-beige-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500 text-forest-800 placeholder-forest-400 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-forest-700 mb-1.5">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.fr"
              className="w-full px-4 py-3 rounded-2xl border border-beige-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500 text-forest-800 placeholder-forest-400 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-forest-700">
                Mot de passe
              </label>
              {mode === 'login' && (
                <Link href="/reset-password" className="text-xs text-forest-500 hover:text-forest-700 transition-colors">
                  Mot de passe oublié ?
                </Link>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-beige-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500 text-forest-800 placeholder-forest-400 transition-colors"
            />
          </div>

          {/* Code Pro (patient signup only) */}
          {mode === 'signup' && role === 'patient' && (
            <div>
              <label className="block text-sm font-semibold text-forest-700 mb-1.5">
                Code PRO de votre orthophoniste
              </label>
              <input
                type="text"
                value={proCode}
                onChange={(e) => setProCode(e.target.value.toUpperCase())}
                required
                placeholder="PRO-XXXXXX"
                maxLength={10}
                className="w-full px-4 py-3 rounded-2xl border border-beige-300 bg-white focus:outline-none focus:ring-2 focus:ring-copper-500/40 focus:border-copper-500 text-forest-800 placeholder-forest-400 font-mono uppercase transition-colors"
              />
              <p className="text-xs text-forest-400 mt-1.5">
                Demandez ce code à votre orthophoniste ou kinésithérapeute.
              </p>
            </div>
          )}

          {/* Therapist trial info */}
          {mode === 'signup' && role === 'therapist' && (
            <div className="bg-forest-500/5 border border-forest-500/20 rounded-2xl px-4 py-3 text-xs text-forest-600">
              ✓ 30 jours gratuits, sans carte bancaire · Annulable à tout moment
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-2xl font-bold text-beige-100 transition-all disabled:opacity-50 mt-2"
            style={{ background: loading ? '#5a7a3a' : '#2D5016' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Chargement...
              </span>
            ) : mode === 'login' ? (
              'Se connecter'
            ) : role === 'therapist' ? (
              'Créer mon espace pro gratuit'
            ) : (
              'Rejoindre mon programme'
            )}
          </button>
        </form>

        <p className="text-xs text-center text-forest-400 mt-6">
          {mode === 'login' ? (
            <>Pas encore de compte ?{' '}
              <button onClick={() => setMode('signup')} className="text-forest-600 font-semibold hover:underline">
                Créer un compte
              </button>
            </>
          ) : (
            <>Déjà un compte ?{' '}
              <button onClick={() => setMode('login')} className="text-forest-600 font-semibold hover:underline">
                Se connecter
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
