import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getExerciseById, CATEGORY_LABELS } from "@/lib/data/exercises";
import { WeeklyObservanceChart } from "@/components/therapist/WeeklyObservanceChart";

interface Props {
  params: Promise<{ id: string }>;
}

function formatDateFR(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeFR(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function daysSince(iso: string | null): string {
  if (!iso) return "jamais";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return "aujourd'hui";
  if (d === 1) return "hier";
  return `il y a ${d} j`;
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: therapistProfile } = await supabase
    .from("profiles")
    .select("role, full_name, therapist_code")
    .eq("id", user.id)
    .single();

  const isTherapist = therapistProfile?.role === "therapist" || therapistProfile?.role === "kine";
  if (!isTherapist) redirect("/dashboard");

  // Vérifier que ce patient appartient à cet ortho
  const { data: link } = await supabase
    .from("therapist_patients")
    .select("id")
    .eq("therapist_id", user.id)
    .eq("patient_id", id)
    .single();

  if (!link) notFound();

  // Profil patient
  const { data: patient } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!patient) notFound();

  // Toutes les séances du patient
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(100);

  const sessionList = sessions ?? [];

  // Stats
  const monthStart = new Date();
  monthStart.setDate(monthStart.getDate() - 30);
  const sessionsMonth = sessionList.filter(s => new Date(s.created_at) >= monthStart);
  const observancePct = Math.min(Math.round((sessionsMonth.length / 20) * 100), 100);
  const lastSession = sessionList[0];

  // Séances Pause Contrôlée pour voir la progression
  const pauseSessions = sessionList
    .filter(s => s.exercise_id?.startsWith("pause_") && s.score !== null)
    .reverse(); // ordre chronologique

  // Score le plus récent
  const lastPauseScore = pauseSessions[pauseSessions.length - 1]?.score ?? null;
  const firstPauseScore = pauseSessions[0]?.score ?? null;
  const pauseProgression = lastPauseScore !== null && firstPauseScore !== null && pauseSessions.length > 1
    ? lastPauseScore - firstPauseScore
    : null;

  // Grouper par exercice pour résumé
  const byExercise: Record<string, number> = {};
  for (const s of sessionList) {
    byExercise[s.exercise_id] = (byExercise[s.exercise_id] || 0) + 1;
  }

  // Calculer tendance 4 semaines
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  // Grouper par semaine
  const sessionsByWeek: Record<number, number> = {};
  for (const s of sessionList) {
    const sDate = new Date(s.created_at);
    if (sDate >= fourWeeksAgo) {
      const weekNum = Math.floor((Date.now() - sDate.getTime()) / (7 * 86400000));
      sessionsByWeek[weekNum] = (sessionsByWeek[weekNum] || 0) + 1;
    }
  }

  // Créer les données pour le chart (4 dernières semaines)
  const weeklyData = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - (i * 7));
    
    const count = sessionsByWeek[i] || 0;
    weeklyData.push({
      week: `S${i + 1}`,
      sessions: count,
      start: weekStart.toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
      end: weekEnd.toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
    });
  }

  // Déterminer la tendance
  const week4Sessions = weeklyData[3].sessions;
  const week1Sessions = weeklyData[0].sessions;
  const isProgressing = week1Sessions > week4Sessions;
  const trendIndicator = isProgressing ? "📈" : week1Sessions < week4Sessions ? "📉" : "➡️";

  // Prescriptions actives + complétion par exercice (7 derniers jours)
  const { data: prescriptions } = await supabase
    .from("prescriptions")
    .select("id, exercise_id, frequency_per_day, frequency_label, notes")
    .eq("patient_id", id)
    .eq("is_active", true);

  const prescriptionList = prescriptions ?? [];

  // Sessions par exercice prescrit sur les 7 derniers jours
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSessionsByExercise: Record<string, number> = {};
  sessionList
    .filter(s => new Date(s.created_at) >= sevenDaysAgo)
    .forEach(s => {
      recentSessionsByExercise[s.exercise_id] = (recentSessionsByExercise[s.exercise_id] || 0) + 1;
    });

  const prescriptionsWithCompletion = prescriptionList.map(p => {
    const ex = getExerciseById(p.exercise_id);
    const doneLastWeek = recentSessionsByExercise[p.exercise_id] || 0;
    const expectedLastWeek = (p.frequency_per_day || 1) * 7;
    const compliancePct = Math.min(Math.round((doneLastWeek / expectedLastWeek) * 100), 100);
    return { ...p, ex, doneLastWeek, expectedLastWeek, compliancePct };
  });

  return (
    <div className="min-h-screen bg-beige-200 bg-texture">
      {/* Header */}
      <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/therapist"
              className="flex items-center gap-2 text-forest-500 hover:text-forest-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Tableau de bord</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/therapist/patients/${id}/notes`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-beige-300 hover:bg-beige-400 text-forest-800 text-sm font-semibold rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Note thérapeutique
            </Link>
            <Link
              href={`/therapist/patients/${id}/program`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-copper-500 hover:bg-copper-600 text-beige-100 text-sm font-semibold rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6-6h6M6 12a6 6 0 1112 0 6 6 0 01-12 0z" />
              </svg>
              💊 Prescrire des exercices
            </Link>
            <a
              href={`/api/bilan/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest-500 hover:bg-forest-600 text-beige-100 text-sm font-semibold rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter bilan PDF
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Identité patient */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-forest-500/10 border-2 border-forest-500/20 flex items-center justify-center text-forest-700 text-xl font-bold">
            {(patient.full_name || patient.email || "?")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-forest-800">
              {patient.full_name || patient.email}
            </h1>
            <p className="text-forest-500 text-sm">{patient.email} · Inscrit le {formatDateFR(patient.created_at)}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-beige-100 rounded-3xl border border-beige-300 p-5 text-center shadow-beige">
            <p className="font-display text-2xl font-bold text-forest-800">{sessionList.length}</p>
            <p className="text-xs text-forest-500 mt-1">Séances totales</p>
          </div>
          <div className="bg-beige-100 rounded-3xl border border-beige-300 p-5 text-center shadow-beige">
            <p className="font-display text-2xl font-bold text-forest-800">{sessionsMonth.length}</p>
            <p className="text-xs text-forest-500 mt-1">Séances / 30 jours</p>
          </div>
          <div className="bg-beige-100 rounded-3xl border border-beige-300 p-5 text-center shadow-beige">
            <p className={`font-display text-2xl font-bold ${observancePct >= 70 ? "text-forest-700" : observancePct >= 40 ? "text-copper-600" : "text-red-500"}`}>
              {observancePct}%
            </p>
            <p className="text-xs text-forest-500 mt-1">Observance</p>
          </div>
          <div className="bg-beige-100 rounded-3xl border border-beige-300 p-5 text-center shadow-beige">
            <p className="font-display text-2xl font-bold text-forest-800 text-sm font-normal">
              {daysSince(lastSession?.created_at ?? null)}
            </p>
            <p className="text-xs text-forest-500 mt-1">Dernière séance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progression Pause Contrôlée */}
          <div className="lg:col-span-2 bg-beige-100 rounded-3xl border border-beige-300 p-6 shadow-beige">
            <h2 className="font-semibold text-forest-800 mb-4 flex items-center gap-2">
              🚶 Progression Pause Contrôlée
            </h2>
            {pauseSessions.length === 0 ? (
              <p className="text-sm text-forest-400 py-4 text-center">Pas encore de séance de Pause Contrôlée</p>
            ) : (
              <div>
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-forest-500 mb-1">Score initial</p>
                    <p className="font-display text-3xl font-bold text-forest-700">{firstPauseScore}<span className="text-base font-normal text-forest-400 ml-1">pas</span></p>
                  </div>
                  {pauseProgression !== null && (
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${pauseProgression >= 0 ? "text-forest-600" : "text-red-500"}`}>
                        {pauseProgression >= 0 ? "+" : ""}{pauseProgression} pas
                      </p>
                      <p className="text-xs text-forest-400">progression totale</p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-forest-500 mb-1">Score actuel</p>
                    <p className="font-display text-3xl font-bold text-forest-800">{lastPauseScore}<span className="text-base font-normal text-forest-400 ml-1">pas</span></p>
                  </div>
                </div>

                {/* Sparkline manuelle */}
                {pauseSessions.length > 1 && (
                  <div className="flex items-end gap-1 h-16 mt-4">
                    {pauseSessions.slice(-15).map((s, i) => {
                      const max = Math.max(...pauseSessions.map(x => x.score ?? 0));
                      const pct = max > 0 ? ((s.score ?? 0) / max) * 100 : 10;
                      return (
                        <div
                          key={i}
                          title={`${s.score} pas — ${formatDateFR(s.created_at)}`}
                          className="flex-1 bg-forest-500 rounded-t hover:bg-forest-600 transition-colors"
                          style={{ height: `${Math.max(pct, 8)}%` }}
                        />
                      );
                    })}
                  </div>
                )}

                <p className="text-xs text-forest-400 mt-2">
                  Objectif thérapeutique : ≥ 40 pas (bonne tolérance CO₂)
                </p>
              </div>
            )}
          </div>

          {/* Répartition exercices */}
          <div className="bg-beige-100 rounded-3xl border border-beige-300 p-6 shadow-beige">
            <h2 className="font-semibold text-forest-800 mb-4">Exercices pratiqués</h2>
            {Object.keys(byExercise).length === 0 ? (
              <p className="text-sm text-forest-400 py-4 text-center">Aucune séance</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(byExercise)
                  .sort((a, b) => b[1] - a[1])
                  .map(([exId, count]) => {
                    const ex = getExerciseById(exId);
                    const totalCount = Object.values(byExercise).reduce((a, b) => a + b, 0);
                    const pct = Math.round((count / totalCount) * 100);
                    return (
                      <div key={exId}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-forest-700 font-medium truncate">
                            {ex?.emoji} {ex?.name_fr || exId}
                          </span>
                          <span className="text-forest-500 flex-shrink-0 ml-2">{count}×</span>
                        </div>
                        <div className="h-1.5 bg-beige-300 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-forest-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Programme prescrit + taux de complétion */}
        {prescriptionsWithCompletion.length > 0 && (
          <div className="bg-beige-100 rounded-3xl border border-beige-300 p-6 shadow-beige mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-lg text-forest-800">💊 Programme prescrit</h2>
                <p className="text-xs text-forest-500 mt-1">Taux de complétion sur les 7 derniers jours</p>
              </div>
              <Link
                href={`/therapist/patients/${id}/program`}
                className="text-xs text-forest-600 hover:text-forest-800 border border-beige-300 hover:border-forest-300 px-3 py-1.5 rounded-full transition-colors"
              >
                Modifier le programme →
              </Link>
            </div>
            <div className="space-y-3">
              {prescriptionsWithCompletion.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl border border-beige-200 bg-white">
                  <span className="text-xl flex-shrink-0">{p.ex?.emoji || "🫁"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-forest-800 truncate">{p.ex?.name_fr || p.exercise_id}</span>
                      <span className={`text-xs font-bold flex-shrink-0 ${p.compliancePct >= 70 ? "text-green-600" : p.compliancePct >= 40 ? "text-amber-600" : "text-red-500"}`}>
                        {p.compliancePct}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-beige-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${p.compliancePct >= 70 ? "bg-green-500" : p.compliancePct >= 40 ? "bg-amber-400" : "bg-red-400"}`}
                        style={{ width: `${p.compliancePct}%` }}
                      />
                    </div>
                    <p className="text-xs text-forest-400 mt-1">
                      {p.doneLastWeek}/{p.expectedLastWeek} séances · {p.frequency_label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-forest-400 text-center mt-4">
              ≥ 70% = bonne observance · 40-69% = à encourager · &lt; 40% = à revoir en consultation
            </p>
          </div>
        )}

        {/* Observance 4 semaines */}
        <div className="bg-beige-100 rounded-3xl border border-beige-300 p-6 shadow-beige mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-lg text-forest-800">Observance - 4 dernières semaines</h2>
              <p className="text-xs text-forest-500 mt-1">Nombre de séances par semaine</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{trendIndicator}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                isProgressing 
                  ? "bg-forest-100 text-forest-700" 
                  : week1Sessions < week4Sessions 
                  ? "bg-copper-100 text-copper-700"
                  : "bg-beige-300 text-forest-700"
              }`}>
                {isProgressing ? "En progression" : week1Sessions < week4Sessions ? "Attention" : "Stable"}
              </span>
            </div>
          </div>
          
          <WeeklyObservanceChart data={weeklyData} />
        </div>

        {/* Historique des séances */}
        <div className="bg-beige-100 rounded-3xl border border-beige-300 shadow-beige overflow-hidden">
          <div className="px-6 py-5 border-b border-beige-300">
            <h2 className="font-semibold text-lg text-forest-800">Historique des séances</h2>
          </div>
          {sessionList.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-forest-500">Aucune séance réalisée pour l&apos;instant.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-beige-200/60 border-b border-beige-300 text-xs font-semibold text-forest-500 uppercase tracking-wide">
                <span>Exercice</span>
                <span>Date</span>
                <span>Durée</span>
                <span>Score</span>
              </div>
              <ul className="divide-y divide-beige-200">
                {sessionList.map((session) => {
                  const ex = getExerciseById(session.exercise_id);
                  const unit = session.exercise_id?.includes("decouverte") ? "pas"
                    : session.exercise_id?.startsWith("pause_") ? "s" : null;
                  const durMin = session.duration_seconds ? Math.floor(session.duration_seconds / 60) : null;
                  const durSec = session.duration_seconds ? session.duration_seconds % 60 : null;
                  return (
                    <li key={session.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-2 md:gap-4 items-center px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{ex?.emoji || "🫁"}</span>
                        <div>
                          <p className="text-sm font-medium text-forest-800">{ex?.name_fr || session.exercise_id}</p>
                          <p className="text-xs text-forest-400">{ex ? CATEGORY_LABELS[ex.category] : ""}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-forest-700">{formatDateFR(session.created_at)}</p>
                        <p className="text-xs text-forest-400">{formatTimeFR(session.created_at)}</p>
                      </div>
                      <p className="text-sm text-forest-600">
                        {durMin !== null ? `${durMin}min ${durSec}s` : "—"}
                      </p>
                      <p className="text-sm font-bold text-forest-800">
                        {session.score !== null && session.score !== undefined
                          ? `${session.score}${unit ? " " + unit : ""}`
                          : "—"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
