'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardStatCard from '@/components/therapist/DashboardStatCard';
import AlertsSection from '@/components/therapist/AlertsSection';
import PatientsTable from '@/components/therapist/PatientsTable';
import RecentJournalEntries from '@/components/therapist/RecentJournalEntries';
import { OnboardingChecklist } from '@/components/therapist/OnboardingChecklist';
import { DemoPatientBanner } from '@/components/therapist/DemoPatientBanner';
import Link from 'next/link';
import { getRetentionStatus, daysSince } from '@/lib/retention';

interface PatientData {
  id: string;
  full_name: string;
  email: string;
  profile_type?: string;
  lastSessionDate?: string;
  sessionsThisWeek?: number;
  sessionsTotal?: number;
  prescriptionsCount?: number;
  journalAlerts?: boolean;
}

interface TherapistJournalEntry {
  id: string;
  patient_id: string;
  patient_name: string;
  created_at: string;
  wellbeing_score?: number;
  anxiety_level?: number;
  notes?: string;
}

interface Alert {
  patientId: string;
  patientName: string;
  reason: string;
  details: string;
  daysInactive?: number;
}


export default function TherapistDashboardClient() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [journalEntries, setJournalEntries] = useState<TherapistJournalEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'slipping' | 'inactive'>('all');
  const [hasMessages, setHasMessages] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user);
        // Charger le profil depuis la table profiles
        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name, email, therapist_code')
          .eq('id', user.id)
          .single();
        setProfile(prof);
        // Calculer les jours restants du trial
        if (prof?.subscription_status === 'trialing' && prof?.trial_ends_at) {
          const endsAt = new Date(prof.trial_ends_at);
          const daysLeft = Math.ceil((endsAt.getTime() - Date.now()) / 86400000);
          setTrialDaysLeft(Math.max(0, daysLeft));
        }
        loadData(user.id, supabase);
      }
    });
  }, []);

  const loadData = async (therapistId: string, supabase: any) => {
    try {
      // Charger les patients
      const { data: therapistPatients, error: patientsError } = await supabase
        .from('therapist_patients')
        .select(
          `
          *,
          patient:profiles!therapist_patients_patient_id_fkey(*)
        `
        )
        .eq('therapist_id', therapistId);

      if (!patientsError && therapistPatients) {
        // Charger les données enrichies pour chaque patient
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneWeekAgoStr = oneWeekAgo.toISOString();

        const patientsWithSessions = await Promise.all(
          therapistPatients.map(async (tp: any) => {
            // Dernière séance
            const { data: lastSessions } = await supabase
              .from('sessions')
              .select('created_at')
              .eq('user_id', tp.patient_id)
              .order('created_at', { ascending: false })
              .limit(1);

            // Total séances
            const { count: totalCount } = await supabase
              .from('sessions')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', tp.patient_id);

            // Séances cette semaine
            const { count: weekCount } = await supabase
              .from('sessions')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', tp.patient_id)
              .gte('created_at', oneWeekAgoStr);

            // Prescriptions actives
            const { count: prescrCount } = await supabase
              .from('prescriptions')
              .select('id', { count: 'exact', head: true })
              .eq('patient_id', tp.patient_id)
              .eq('is_active', true);

            const lastSessionDate = lastSessions?.[0]?.created_at;
            return {
              id: tp.patient_id,
              full_name: tp.patient?.full_name || 'Sans nom',
              email: tp.patient?.email || '',
              profile_type: tp.patient?.profile_type,
              lastSessionDate,
              sessionsTotal: totalCount || 0,
              sessionsThisWeek: weekCount || 0,
              prescriptionsCount: prescrCount || 0,
              journalAlerts: false,
            };
          })
        );

        setPatients(patientsWithSessions);

        // Construire les alertes (inactifs depuis >5j = dropout)
        const newAlerts: Alert[] = [];
        patientsWithSessions.forEach((p) => {
          const d = daysSince(p.lastSessionDate);
          const status = getRetentionStatus(d, !!p.lastSessionDate);
          if (status === 'dropout') {
            newAlerts.push({
              patientId: p.id,
              patientName: p.full_name,
              reason: 'inactive',
              details: `Inactif depuis ${d} jours`,
              daysInactive: d,
            });
          } else if (status === 'slipping') {
            newAlerts.push({
              patientId: p.id,
              patientName: p.full_name,
              reason: 'slipping',
              details: `En baisse — dernière séance il y a ${d} jours`,
              daysInactive: d,
            });
          }
        });
        setAlerts(newAlerts);
      }

      // Vérifier si l'ortho a déjà envoyé au moins un message (pour l'onboarding)
      const { count: msgCount } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('therapist_id', therapistId)
        .eq('sender_role', 'therapist');
      setHasMessages((msgCount || 0) > 0);

      // Charger les entrées journal récentes
      const { data: entries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (entries) {
        // Enrichir avec le nom du patient
        const enrichedEntries = await Promise.all(
          entries.map(async (entry: any) => {
            const { data: patient } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', entry.user_id)
              .single();
            return {
              ...entry,
              patient_name: patient?.full_name || 'Anonyme',
            };
          })
        );
        setJournalEntries(enrichedEntries);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Chargement...</div>;

  const filteredPatients = patients.filter((p) => {
    if (filterStatus === 'all') return true;
    const d = daysSince(p.lastSessionDate);
    const status = getRetentionStatus(d, !!p.lastSessionDate);
    if (filterStatus === 'active') return status === 'active';
    if (filterStatus === 'slipping') return status === 'slipping';
    if (filterStatus === 'inactive') return status === 'dropout' || status === 'new';
    return true;
  });

  const activeCount = patients.filter((p) => {
    const d = daysSince(p.lastSessionDate);
    return getRetentionStatus(d, !!p.lastSessionDate) === 'active';
  }).length;
  const alertCount = alerts.length;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 lg:px-6">

        {/* Banner trial — visible si trialing et < 14j restants */}
        {trialDaysLeft !== null && trialDaysLeft <= 14 && (
          <div className={`mb-6 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 ${
            trialDaysLeft <= 3
              ? 'bg-red-50 border border-red-200'
              : trialDaysLeft <= 7
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-forest-50 border border-forest-200'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{trialDaysLeft <= 3 ? '⚠️' : '📅'}</span>
              <div>
                <p className={`text-sm font-semibold ${trialDaysLeft <= 3 ? 'text-red-800' : trialDaysLeft <= 7 ? 'text-amber-800' : 'text-forest-800'}`}>
                  {trialDaysLeft === 0
                    ? "Votre essai gratuit se termine aujourd'hui"
                    : `Votre essai gratuit : ${trialDaysLeft} jour${trialDaysLeft > 1 ? 's' : ''} restant${trialDaysLeft > 1 ? 's' : ''}`}
                </p>
                <p className={`text-xs mt-0.5 ${trialDaysLeft <= 3 ? 'text-red-600' : 'text-forest-500'}`}>
                  Activez votre abonnement pour conserver l&apos;accès à vos patients et leur programme.
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors ${
                trialDaysLeft <= 3 ? 'bg-red-600 hover:bg-red-700' : 'bg-forest-600 hover:bg-forest-700'
              }`}
            >
              Activer mon abonnement →
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-2">
            <div>
              <h1 className="text-4xl font-bold text-forest-800 mb-1">
                👋 Bonjour {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Dr'}
              </h1>
              <p className="text-forest-600">
                {new Intl.DateTimeFormat('fr-FR', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }).format(new Date())}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/therapist/invite"
                className="px-6 py-3 rounded-2xl bg-forest-600 text-white font-semibold hover:bg-forest-700 transition-colors shadow-md hover:shadow-lg"
              >
                ➕ Ajouter un patient
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-forest-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-forest-600 font-medium">Chargement du tableau de bord...</p>
          </div>
        ) : patients.length === 0 ? (
          /* Empty state avec onboarding */
          <div className="max-w-2xl mx-auto">
            <OnboardingChecklist
              hasPatients={false}
              hasPrescriptions={false}
              hasMessages={false}
              therapistCode={profile?.therapist_code || ''}
            />
            {user && <DemoPatientBanner therapistId={user.id} />}
            <div className="bg-white rounded-3xl border border-beige-200 p-12 shadow-sm text-center">
              <div className="text-6xl mb-4">🌿</div>
              <h2 className="text-2xl font-bold text-forest-800 mb-2">
                Bienvenue sur Respirfacile
              </h2>
              <p className="text-forest-600 mb-8 max-w-sm mx-auto leading-relaxed">
                Commencez par inviter votre premier patient. Il rejoint gratuitement avec votre code PRO en moins de 30 secondes.
              </p>
              <Link
                href="/therapist/invite"
                className="inline-block px-8 py-4 bg-forest-600 text-white font-semibold rounded-2xl hover:bg-forest-700 transition-colors"
              >
                ➕ Inviter mon premier patient
              </Link>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div className="space-y-8">
            {/* Onboarding checklist — disparaît une fois les 3 étapes faites */}
            {(!patients.length || !patients.some(p => (p.prescriptionsCount || 0) > 0) || !hasMessages) && (
              <OnboardingChecklist
                hasPatients={patients.length > 0}
                hasPrescriptions={patients.some(p => (p.prescriptionsCount || 0) > 0)}
                hasMessages={hasMessages}
                therapistCode={profile?.therapist_code || ''}
              />
            )}
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardStatCard
                value={patients.length}
                label="patients total"
                icon="👥"
              />
              <DashboardStatCard
                value={activeCount}
                label="actifs ce mois"
                icon="🟢"
                status="success"
              />
              <DashboardStatCard
                value={alertCount}
                label={alertCount > 0 ? 'alertes' : 'alertes'}
                icon="⚠️"
                status={alertCount > 0 ? 'alert' : 'success'}
              />
              <DashboardStatCard
                value={journalEntries.length}
                label="bilans cette semaine"
                icon="📓"
              />
            </div>

            {/* Alerts section */}
            <AlertsSection alerts={alerts} />

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Patients table - large */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-forest-800">📋 Mes patients</h2>
                  <p className="text-forest-600 text-sm mt-1">
                    Gestion et suivi de vos patients en un coup d'œil
                  </p>
                </div>
                <PatientsTable
                  patients={filteredPatients}
                  onFilterChange={setFilterStatus}
                  currentFilter={filterStatus}
                />
              </div>

              {/* Recent journal entries - sidebar */}
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-forest-800">📓 Derniers bilans</h2>
                  <p className="text-forest-600 text-sm mt-1">
                    Journal des patients (dernière semaine)
                  </p>
                </div>
                <RecentJournalEntries entries={journalEntries as any} />
              </div>
            </div>
          </div>
        )}
      </main>
  );
}