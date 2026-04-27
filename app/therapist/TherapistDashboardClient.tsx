'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import DashboardStatCard from '@/components/therapist/DashboardStatCard';
import AlertsSection from '@/components/therapist/AlertsSection';
import PatientsTable from '@/components/therapist/PatientsTable';
import RecentJournalEntries from '@/components/therapist/RecentJournalEntries';
import Link from 'next/link';

interface PatientData {
  id: string;
  full_name: string;
  email: string;
  profile_type?: string;
  lastSessionDate?: string;
  sessionsThisWeek?: number;
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

const daysSinceDate = (dateStr?: string) => {
  if (!dateStr) return 999;
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export default function TherapistDashboardClient() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [journalEntries, setJournalEntries] = useState<TherapistJournalEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

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
        // Charger les sessions pour chaque patient
        const patientsWithSessions = await Promise.all(
          therapistPatients.map(async (tp: any) => {
            const { data: sessions } = await supabase
              .from('sessions')
              .select('created_at')
              .eq('user_id', tp.patient_id)
              .order('created_at', { ascending: false })
              .limit(1);

            const { data: entries } = await supabase
              .from('journal_entries')
              .select('anxiety_level')
              .eq('user_id', tp.patient_id)
              .eq('anxiety_level', '>=7')
              .single();

            const lastSessionDate = sessions?.[0]?.created_at;
            return {
              id: tp.patient_id,
              full_name: tp.patient?.full_name || 'Sans nom',
              email: tp.patient?.email || '',
              profile_type: tp.patient?.profile_type || '—',
              lastSessionDate,
              sessionsThisWeek: 0,
              journalAlerts: !!entries,
            };
          })
        );

        setPatients(patientsWithSessions);

        // Construire les alertes
        const newAlerts: Alert[] = [];
        patientsWithSessions.forEach((p) => {
          const daysSince = daysSinceDate(p.lastSessionDate);
          if (p.journalAlerts) {
            newAlerts.push({
              patientId: p.id,
              patientName: p.full_name,
              reason: 'anxiety',
              details: 'Anxiété signalée dans le journal',
            });
          } else if (daysSince > 7) {
            newAlerts.push({
              patientId: p.id,
              patientName: p.full_name,
              reason: 'inactive',
              details: `Inactif depuis ${daysSince} jours`,
              daysInactive: daysSince,
            });
          }
        });
        setAlerts(newAlerts);
      }

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
    const daysSince = daysSinceDate(p.lastSessionDate);
    if (filterStatus === 'active') return daysSince <= 3;
    if (filterStatus === 'inactive') return daysSince > 7;
    return true;
  });

  const activeCount = patients.filter((p) => daysSinceDate(p.lastSessionDate) <= 3).length;
  const alertCount = alerts.length;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
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
          /* Empty state */
          <div className="bg-white rounded-3xl border border-beige-200 p-12 shadow-sm text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-forest-800 mb-2">
              Commencez en ajoutant vos premiers patients
            </h2>
            <p className="text-forest-600 mb-8 max-w-xs mx-auto leading-relaxed">
              Partagez votre code PRO avec vos patients pour qu'ils accèdent gratuitement à Respirfacile.
              Vous pourrez ensuite suivre leur progression en temps réel.
            </p>
            <Link
              href="/therapist/invite"
              className="inline-block px-8 py-4 bg-forest-600 text-white font-semibold rounded-2xl hover:bg-forest-700 transition-colors"
            >
              ➕ Ajouter un patient
            </Link>
          </div>
        ) : (
          /* Dashboard */
          <div className="space-y-8">
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