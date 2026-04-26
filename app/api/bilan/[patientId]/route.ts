import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getExerciseById, CATEGORY_LABELS } from "@/lib/data/exercises";

interface Params {
  params: Promise<{ patientId: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { patientId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: therapistProfile } = await supabase
    .from("profiles").select("role, full_name, therapist_code").eq("id", user.id).single();

  const isTherapist = therapistProfile?.role === "therapist" || therapistProfile?.role === "kine";
  if (!isTherapist) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { data: link } = await supabase
    .from("therapist_patients").select("id")
    .eq("therapist_id", user.id).eq("patient_id", patientId).single();

  if (!link) return NextResponse.json({ error: "Patient non trouvé" }, { status: 404 });

  const { data: patient } = await supabase
    .from("profiles").select("*").eq("id", patientId).single();

  const { data: sessions } = await supabase
    .from("sessions").select("*").eq("user_id", patientId)
    .order("created_at", { ascending: false }).limit(100);

  const sessionList = sessions ?? [];

  // Stats
  const monthStart = new Date();
  monthStart.setDate(monthStart.getDate() - 30);
  const sessionsMonth = sessionList.filter(s => new Date(s.created_at) >= monthStart);
  const observancePct = Math.min(Math.round((sessionsMonth.length / 20) * 100), 100);

  const pauseSessions = sessionList.filter(s => s.exercise_id?.startsWith("pause_") && s.score !== null).reverse();
  const firstPauseScore = pauseSessions[0]?.score ?? null;
  const lastPauseScore = pauseSessions[pauseSessions.length - 1]?.score ?? null;
  const pauseProgression = lastPauseScore !== null && firstPauseScore !== null && pauseSessions.length > 1
    ? lastPauseScore - firstPauseScore : null;

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const patientName = patient?.full_name || patient?.email || patientId;
  const therapistName = therapistProfile?.full_name || user.email;

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  }

  const sessionsRows = sessionList.slice(0, 30).map(s => {
    const ex = getExerciseById(s.exercise_id);
    const unit = s.exercise_id?.includes("decouverte") ? "pas" : s.exercise_id?.startsWith("pause_") ? "s" : "";
    const dur = s.duration_seconds ? `${Math.floor(s.duration_seconds / 60)}min ${s.duration_seconds % 60}s` : "—";
    return `
      <tr>
        <td>${ex?.emoji || "🫁"} ${ex?.name_fr || s.exercise_id}</td>
        <td>${fmtDate(s.created_at)}</td>
        <td>${dur}</td>
        <td>${s.score !== null && s.score !== undefined ? `${s.score} ${unit}` : "—"}</td>
      </tr>
    `;
  }).join("");

  const pauseRowsHtml = pauseSessions.slice(-10).map(s => `
    <tr>
      <td>${fmtDate(s.created_at)}</td>
      <td style="font-weight:bold;color:#2d5a3d">${s.score} pas</td>
      <td>${s.exercise_id?.includes("decouverte") ? "Découverte" : s.exercise_id?.includes("20") ? "Pause 20s" : "Pause 25s"}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Bilan — ${patientName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1a2e1a; background: #fff; font-size: 13px; line-height: 1.5; }
  .page { max-width: 800px; margin: 0 auto; padding: 40px 48px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2d5a3d; padding-bottom: 20px; margin-bottom: 28px; }
  .logo { font-size: 20px; font-weight: 700; color: #2d5a3d; }
  .logo span { color: #c47a2e; }
  .title { font-size: 22px; font-weight: 700; color: #1a2e1a; margin-bottom: 4px; }
  .subtitle { color: #557a55; font-size: 13px; }
  .meta { text-align: right; color: #557a55; font-size: 12px; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: #f5f0e8; border-radius: 12px; padding: 16px; text-align: center; }
  .stat-value { font-size: 26px; font-weight: 700; color: #1a2e1a; }
  .stat-label { font-size: 11px; color: #557a55; margin-top: 2px; }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 14px; font-weight: 700; color: #2d5a3d; border-bottom: 1px solid #e5ddd0; padding-bottom: 6px; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #f5f0e8; text-align: left; padding: 8px 10px; font-weight: 600; color: #557a55; border-bottom: 1px solid #e5ddd0; }
  td { padding: 7px 10px; border-bottom: 1px solid #f0ebe0; color: #1a2e1a; }
  tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 600; }
  .badge-good { background: #d4edda; color: #2d5a3d; }
  .badge-mid { background: #fde8cc; color: #c47a2e; }
  .badge-bad { background: #fde0dc; color: #c0392b; }
  .progress-bar-bg { background: #e5ddd0; border-radius: 4px; height: 8px; width: 100%; }
  .progress-bar-fill { border-radius: 4px; height: 8px; background: #2d5a3d; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5ddd0; color: #999; font-size: 11px; display: flex; justify-content: space-between; }
  .note { background: #fff8ed; border: 1px solid #f0d9a8; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #7a5a1e; margin-bottom: 20px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 20px 32px; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <div class="logo">Respir<span>facile</span></div>
      <div class="title" style="margin-top:10px">${patientName}</div>
      <div class="subtitle">${patient?.email || ""}</div>
    </div>
    <div class="meta">
      <div><strong>Bilan généré le</strong><br/>${today}</div>
      <div style="margin-top:8px"><strong>Prescripteur</strong><br/>${therapistName}</div>
      ${therapistProfile?.therapist_code ? `<div style="margin-top:4px;font-family:monospace">${therapistProfile.therapist_code}</div>` : ""}
    </div>
  </div>

  <div class="note">
    ⚕️ Ce bilan est un outil complémentaire de suivi. La thérapie myofonctionnelle est un traitement adjuvant — elle ne remplace pas le traitement principal du SAOS (CPAP, orthèse) mais améliore significativement l'observance et les résultats à long terme.
  </div>

  <div class="grid">
    <div class="stat-card">
      <div class="stat-value">${sessionList.length}</div>
      <div class="stat-label">Séances totales</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${sessionsMonth.length}</div>
      <div class="stat-label">Séances / 30 jours</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color:${observancePct >= 70 ? "#2d5a3d" : observancePct >= 40 ? "#c47a2e" : "#c0392b"}">${observancePct}%</div>
      <div class="stat-label">Observance</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${lastPauseScore !== null ? lastPauseScore + " pas" : "—"}</div>
      <div class="stat-label">Score Pause actuel</div>
    </div>
  </div>

  ${pauseSessions.length > 0 ? `
  <div class="section">
    <div class="section-title">🚶 Progression Pause Contrôlée (tolérance CO₂)</div>
    <div style="display:flex;gap:24px;align-items:center;margin-bottom:16px">
      <div>
        <div style="font-size:11px;color:#557a55">Score initial</div>
        <div style="font-size:24px;font-weight:700">${firstPauseScore} <span style="font-size:13px;font-weight:400;color:#557a55">pas</span></div>
      </div>
      ${pauseProgression !== null ? `
      <div style="text-align:center;flex:1">
        <div style="font-size:20px;font-weight:700;color:${pauseProgression >= 0 ? "#2d5a3d" : "#c0392b"}">${pauseProgression >= 0 ? "+" : ""}${pauseProgression} pas</div>
        <div style="font-size:11px;color:#557a55">évolution</div>
      </div>` : ""}
      <div style="text-align:right">
        <div style="font-size:11px;color:#557a55">Score actuel</div>
        <div style="font-size:24px;font-weight:700">${lastPauseScore} <span style="font-size:13px;font-weight:400;color:#557a55">pas</span></div>
      </div>
    </div>
    <div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:#557a55;margin-bottom:3px">
        <span>0 pas</span><span>Objectif : ≥ 40 pas</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width:${Math.min(((lastPauseScore ?? 0) / 60) * 100, 100)}%"></div>
      </div>
    </div>
    <table>
      <tr><th>Date</th><th>Score</th><th>Exercice</th></tr>
      ${pauseRowsHtml}
    </table>
  </div>
  ` : ""}

  <div class="section">
    <div class="section-title">📋 Historique des séances (30 dernières)</div>
    <table>
      <tr><th>Exercice</th><th>Date</th><th>Durée</th><th>Score</th></tr>
      ${sessionsRows || "<tr><td colspan='4' style='text-align:center;color:#999;padding:20px'>Aucune séance</td></tr>"}
    </table>
  </div>

  <div class="footer">
    <span>Respirfacile · respirfacile.fr · Traitement des données conforme RGPD</span>
    <span>Bilan ${today}</span>
  </div>
</div>

<script>
  // Auto-print si paramètre ?print=1
  if (new URLSearchParams(window.location.search).get('print') === '1') {
    window.onload = () => window.print();
  }
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
