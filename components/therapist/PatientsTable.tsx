'use client';

import Link from 'next/link';
import PatientStatusBadge from './PatientStatusBadge';

interface Patient {
  id: string;
  full_name: string;
  email: string;
  profile_type?: string;
  lastSessionDate?: string;
  sessionsThisWeek?: number;
  journalAlerts?: boolean;
}

interface PatientsTableProps {
  patients: Patient[];
  onFilterChange?: (filter: 'all' | 'active' | 'inactive') => void;
  currentFilter?: 'all' | 'active' | 'inactive';
}

const daysSinceDate = (dateStr?: string) => {
  if (!dateStr) return 999;
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const getInitials = (name?: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0].toUpperCase())
    .join('')
    .slice(0, 2);
};

export default function PatientsTable({
  patients,
  onFilterChange,
  currentFilter = 'all',
}: PatientsTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-beige-200 shadow-sm overflow-hidden">
      {onFilterChange && (
        <div className="border-b border-beige-200 px-8 py-4 flex gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentFilter === 'all'
                ? 'bg-forest-100 text-forest-700'
                : 'text-forest-600 hover:bg-beige-100'
            }`}
          >
            Tous ({patients.length})
          </button>
          <button
            onClick={() => onFilterChange('active')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentFilter === 'active'
                ? 'bg-green-100 text-green-700'
                : 'text-forest-600 hover:bg-beige-100'
            }`}
          >
            Actifs ({patients.filter((p) => daysSinceDate(p.lastSessionDate) <= 3).length})
          </button>
          <button
            onClick={() => onFilterChange('inactive')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentFilter === 'inactive'
                ? 'bg-amber-100 text-amber-700'
                : 'text-forest-600 hover:bg-beige-100'
            }`}
          >
            Inactifs ({patients.filter((p) => daysSinceDate(p.lastSessionDate) > 7).length})
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-beige-50 border-b border-beige-200">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-semibold text-forest-600 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-forest-600 uppercase tracking-wider">
                Profil
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-forest-600 uppercase tracking-wider">
                Dernière séance
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-forest-600 uppercase tracking-wider">
                Séances/semaine
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-forest-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-forest-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige-200">
            {patients.map((patient) => {
              const daysSince = daysSinceDate(patient.lastSessionDate);
              return (
                <tr
                  key={patient.id}
                  className="hover:bg-beige-50 transition-colors"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-sm font-semibold text-forest-700">
                        {getInitials(patient.full_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-forest-800">
                          {patient.full_name || 'Sans nom'}
                        </p>
                        <p className="text-xs text-forest-500">{patient.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-forest-700">
                      {patient.profile_type || '—'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-forest-700">
                      {patient.lastSessionDate
                        ? `${daysSince}j`
                        : 'Jamais'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-forest-800">
                      {patient.sessionsThisWeek || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <PatientStatusBadge
                      lastSessionDays={daysSince}
                      hasJournalAlert={patient.journalAlerts || false}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/therapist/patients/${patient.id}`}
                        className="px-3 py-2 rounded-lg hover:bg-beige-100 text-forest-600 font-medium text-sm transition-colors"
                        title="Voir le patient"
                      >
                        📊 Voir
                      </Link>
                      <Link
                        href={`/therapist/patients/${patient.id}/journal`}
                        className="px-3 py-2 rounded-lg hover:bg-beige-100 text-forest-600 font-medium text-sm transition-colors"
                        title="Journal du patient"
                      >
                        📓 Journal
                      </Link>
                      <Link
                        href={`/therapist/patients/${patient.id}/notes`}
                        className="px-3 py-2 rounded-lg hover:bg-beige-100 text-forest-600 font-medium text-sm transition-colors"
                        title="Ajouter une note"
                      >
                        ✏️ Note
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
