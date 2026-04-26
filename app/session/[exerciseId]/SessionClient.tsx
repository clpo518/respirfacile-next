"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageShell } from "@/components/layout/PageShell";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import SessionComplete from "@/components/SessionComplete";
import {
  type Exercise,
  CATEGORY_LABELS,
  formatDuration,
} from "@/lib/data/exercises";

// ─── ANIMATION KEYFRAMES ────────────────────────────────────────────────────
const animationStyles = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes colorPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  .animate-fade-in-scale {
    animation: fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .animate-color-pulse {
    animation: colorPulse 2s ease-in-out infinite;
  }
  .animate-bounce-slow {
    animation: bounce-slow 1.5s ease-in-out infinite;
  }
`;

// ─── BREATHING ANIMATION ─────────────────────────────────────────────────────

function BreathingCircle({
  phase,
  timeLeft,
  duration,
  category,
}: {
  phase: "inhale" | "hold" | "exhale" | "rest";
  timeLeft: number;
  duration: number;
  category: string;
}) {
  const progress = 1 - timeLeft / duration;

  const phaseConfig = {
    inhale: { label: "Inspirez", scale: 1 + progress * 0.4, opacity: 0.9 },
    hold: { label: "Pause", scale: 1.4, opacity: 1 },
    exhale: { label: "Expirez", scale: 1.4 - progress * 0.4, opacity: 0.7 },
    rest: { label: "Repos", scale: 1, opacity: 0.5 },
  };

  const config = phaseConfig[phase];
  const isCoherence = category === "coherence_cardiaque";

  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Outer glow ring */}
      <div className="relative flex items-center justify-center w-56 h-56">
        <div
          className="absolute inset-0 rounded-full bg-forest-500/10 transition-all duration-500"
          style={{
            transform: `scale(${config.scale * 1.15})`,
            opacity: config.opacity * 0.4,
          }}
        />
        {/* Main circle */}
        <div
          className="absolute inset-0 rounded-full bg-forest-500/20 border-2 border-forest-500/40 transition-all duration-1000 ease-in-out"
          style={{
            transform: `scale(${config.scale})`,
            opacity: config.opacity,
          }}
        />
        {/* Inner fill */}
        <div
          className="relative w-28 h-28 rounded-full bg-forest-500/30 border border-forest-500/50 flex items-center justify-center transition-all duration-1000 ease-in-out"
          style={{
            transform: `scale(${0.7 + (config.scale - 1) * 0.5})`,
          }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-forest-800 tabular-nums leading-none">
              {timeLeft}
            </p>
            <p className="text-xs text-forest-600 mt-0.5">sec</p>
          </div>
        </div>
      </div>

      {/* Phase label */}
      <div className="mt-6 text-center">
        <p className="font-display text-2xl font-bold text-forest-800">
          {config.label}
        </p>
        {isCoherence && (
          <p className="text-sm text-forest-500 mt-1">par le nez</p>
        )}
      </div>
    </div>
  );
}

// ─── TIMER HOOK ───────────────────────────────────────────────────────────────

function useCountdown(initialSeconds: number, onComplete: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            onCompleteRef.current();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback((s?: number) => {
    setRunning(false);
    setTimeLeft(s ?? initialSeconds);
  }, [initialSeconds]);

  return { timeLeft, running, start, pause, reset };
}

// ─── COHERENCE SEQUENCE ───────────────────────────────────────────────────────

type CoherencePhase = "inhale" | "exhale";

function CoherenceTimer({
  onComplete,
  totalSeconds,
}: {
  onComplete: (cycles: number) => void;
  totalSeconds: number;
}) {
  const [phase, setPhase] = useState<CoherencePhase>("inhale");
  const [phaseTime, setPhaseTime] = useState(5);
  const [cyclesRef] = useState({ count: 0 });
  const [cycles, setCycles] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setStarted(true);
    setPhase("inhale");
    setPhaseTime(5);
  };

  useEffect(() => {
    if (!started) return;

    intervalRef.current = setInterval(() => {
      setPhaseTime((t) => {
        if (t <= 1) {
          // Switch phase
          setPhase((p) => {
            if (p === "inhale") return "exhale";
            // completed one full cycle
            cyclesRef.count += 1;
            setCycles(cyclesRef.count);
            return "inhale";
          });
          return 5;
        }
        return t - 1;
      });
      setElapsed((e) => {
        const next = e + 1;
        if (next >= totalSeconds) {
          clearInterval(intervalRef.current!);
          onComplete(cyclesRef.count);
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started, totalSeconds, onComplete, cyclesRef]);

  const progressPct = Math.min((elapsed / totalSeconds) * 100, 100);
  const remaining = totalSeconds - elapsed;

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-6">
        <div className="text-6xl">💚</div>
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-forest-800 mb-1">
            Cohérence cardiaque 5-5
          </p>
          <p className="text-forest-500">5 minutes · Inspirez et expirez 5 secondes chacun</p>
        </div>
        <button
          onClick={start}
          className="px-8 py-4 bg-forest-500 hover:bg-forest-600 text-beige-100 font-semibold rounded-2xl text-lg transition-colors"
        >
          Commencer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <BreathingCircle
        phase={phase}
        timeLeft={phaseTime}
        duration={5}
        category="coherence_cardiaque"
      />
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-forest-500 mb-1.5">
          <span>{cycles} cycle{cycles > 1 ? "s" : ""}</span>
          <span>{formatDuration(remaining)}</span>
        </div>
        <div className="h-2 bg-beige-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-500 rounded-full transition-all duration-1000"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

type SessionState =
  | "intro"
  | "instructions"
  | "active"
  | "input"
  | "complete"
  | "saving";

interface PreviousSessionData {
  score: number | null;
  duration: number;
  date: string;
}

export default function SessionClient({
  exercise,
  userId,
}: {
  exercise: Exercise;
  userId: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<SessionState>("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [metricValue, setMetricValue] = useState<string>("");
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(() => Date.now());
  const [previousSession, setPreviousSession] = useState<PreviousSessionData | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [celebrationSubMessage, setCelebrationSubMessage] = useState<string | undefined>();
  const [showProgressComparison, setShowProgressComparison] = useState(false);

  const isCoherence = exercise.category === "coherence_cardiaque";

  // Fetch previous session data for comparison
  useEffect(() => {
    const fetchPreviousSession = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("sessions")
        .select("score, duration_seconds, created_at")
        .eq("user_id", userId)
        .eq("exercise_id", exercise.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setPreviousSession({
          score: data[0].score,
          duration: data[0].duration_seconds,
          date: new Date(data[0].created_at).toLocaleDateString("fr-FR"),
        });
      }
    };

    fetchPreviousSession();
  }, [exercise.id, userId]);

  // ─── Timer (pour exercices non-cohérence) ───────────────────────────────
  const { timeLeft, running, start: startTimer } = useCountdown(
    exercise.duration_seconds,
    () => {
      if (exercise.requiresInput) {
        setState("input");
      } else {
        setState("complete");
      }
    }
  );

  // ─── Progression des étapes ─────────────────────────────────────────────
  const goToNextStep = () => {
    if (currentStep < exercise.instructions_fr.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Toutes les étapes lues → lancer le timer
      setState("active");
      if (!isCoherence) startTimer();
    }
  };

  // ─── Sauvegarde Supabase ────────────────────────────────────────────────
  const saveSession = useCallback(async () => {
    setState("saving");
    setError(null);

    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    const metrics: Record<string, number | string> = {};
    if (exercise.requiresInput && metricValue) {
      const numVal = parseInt(metricValue, 10);
      exercise.metrics_tracked.forEach((key) => {
        metrics[key] = isNaN(numVal) ? metricValue : numVal;
      });
    }
    if (isCoherence) {
      metrics["cycles_completed"] = cyclesCompleted;
    }

    const supabase = createClient();
    const { error: dbError } = await supabase.from("sessions").insert({
      user_id: userId,
      exercise_id: exercise.id,
      exercise_category: exercise.category,
      duration_seconds: durationSeconds,
      metrics,
      score: exercise.requiresInput && metricValue ? parseInt(metricValue, 10) || null : null,
      completed: true,
    });

    if (dbError) {
      console.error("Save error:", dbError);
      setError("Hmm, on a un souci. Essaie de nouveau.");
      setState("complete");
      return;
    }

    // Check for new badges after successful save
    try {
      const badgeResponse = await fetch("/api/check-badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: exercise.id,
          score: exercise.requiresInput ? parseInt(metricValue, 10) || null : null,
        }),
      });

      const badgeData = badgeResponse.ok ? await badgeResponse.json() : { new_badges: [] };
      const newBadges = badgeData.new_badges || [];

      // Calculer le message de célébration avec badges
      if (newBadges.length > 0) {
        setCelebrationMessage("🏅 Nouveau badge débloqué !");
        const badgeNames: Record<string, string> = {
          first_session: "Premier souffle",
          week_1: "Semaine 1",
          pause_20: "Pause 20s",
          pause_25: "Pause 25s",
          nasale_master: "Nez libre",
          coherence_30: "Rythme parfait",
          month_1: "1 mois",
        };
        setCelebrationSubMessage(
          `"${badgeNames[newBadges[0]] || newBadges[0]}" ajouté à votre collection`
        );
      } else if (previousSession && metricValue) {
        const currentScore = parseInt(metricValue, 10);
        const previousScore = previousSession.score || 0;
        const improvement = currentScore - previousScore;
        if (improvement > 0) {
          setCelebrationMessage("Excellent ! Progression 🚀");
          setCelebrationSubMessage(`+${improvement} ${exercise.inputUnit} par rapport à la dernière fois`);
        } else {
          setCelebrationMessage("Bravo pour cette séance ! 💪");
          setCelebrationSubMessage(undefined);
        }
      } else {
        setCelebrationMessage("Bravo pour cette séance ! 💪");
        setCelebrationSubMessage(undefined);
      }
    } catch (error) {
      console.error("Error checking badges:", error);
      setCelebrationMessage("Bravo pour cette séance ! 💪");
      setCelebrationSubMessage(undefined);
    }

    setState("complete");
    setShowCelebration(true);

    // Auto-redirect after 3s
    setTimeout(() => {
      router.push("/dashboard?celebration=1");
    }, 3000);
  }, [exercise, metricValue, cyclesCompleted, userId, startTime, isCoherence, previousSession, router]);

  const progressPct = isCoherence
    ? 100
    : Math.min(
        ((exercise.duration_seconds - timeLeft) / exercise.duration_seconds) *
          100,
        100
      );

  // ─── ÉTAT : INTRO ────────────────────────────────────────────────────────
  if (state === "intro") {
    return (
      <PageShell exercise={exercise}>
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 gap-8 text-center">
          <div className="text-6xl">{exercise.emoji}</div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-forest-500 mb-2">
              {CATEGORY_LABELS[exercise.category]}
            </p>
            <h1 className="font-display text-3xl font-bold text-forest-800 mb-3">
              {exercise.name_fr}
            </h1>
            <p className="text-forest-500 leading-relaxed max-w-sm mx-auto">
              {exercise.description_fr}
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-forest-500">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
              {formatDuration(exercise.duration_seconds)}
            </div>
            {exercise.sets && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {exercise.sets} cycles
              </div>
            )}
          </div>

          {/* Sécurité médicale */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 max-w-sm text-sm text-amber-900 text-left">
            💛 Si tu ressens des vertiges, une gêne ou des palpitations, c'est normal d'arrêter. Ton bien-être vient toujours en premier.
          </div>

          <button
            onClick={() => setState("instructions")}
            className="w-full max-w-sm py-4 bg-forest-500 hover:bg-forest-600 text-beige-100 font-semibold rounded-2xl text-lg transition-colors"
          >
            Commencer
          </button>
        </div>
      </PageShell>
    );
  }

  // ─── ÉTAT : INSTRUCTIONS ─────────────────────────────────────────────────
  if (state === "instructions") {
    return (
      <PageShell exercise={exercise}>
        <style>{animationStyles}</style>
        <div className="flex flex-col flex-1 px-6 py-8 max-w-lg mx-auto w-full">
          {/* Progress bar with step counter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-forest-600">
                Étape {currentStep + 1} sur {exercise.instructions_fr.length}
              </p>
              <p className="text-xs text-forest-500 font-semibold">
                {Math.round(((currentStep + 1) / exercise.instructions_fr.length) * 100)}%
              </p>
            </div>
            <div className="h-2.5 bg-beige-300 rounded-full overflow-hidden shadow-sm">
              <div
                className="h-full bg-gradient-to-r from-forest-500 to-forest-600 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                style={{
                  width: `${((currentStep + 1) / exercise.instructions_fr.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center py-6">
            {/* Active instruction card with animation */}
            <div className="animate-fade-in-scale">
              <div className="bg-beige-100 rounded-3xl border-2 border-beige-300 p-8 shadow-beige text-center transform transition-all">
                {/* Step number badge */}
                <div className="w-16 h-16 rounded-full bg-forest-500/15 border-2 border-forest-500/30 flex items-center justify-center mx-auto mb-6 animate-color-pulse">
                  <span className="font-display font-bold text-3xl text-forest-700">
                    {currentStep + 1}
                  </span>
                </div>

                {/* Instruction text - larger and more prominent */}
                <p className="text-xl text-forest-800 leading-relaxed font-medium">
                  {exercise.instructions_fr[currentStep]}
                </p>
              </div>
            </div>

            {/* Additional hint for some steps */}
            {currentStep === 0 && (
              <div className="mt-4 text-center text-sm text-forest-500 animate-fade-in-scale" style={{ animationDelay: "0.2s" }}>
                📖 Prends ton temps — tu peux revenir en arrière si tu veux
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 space-y-2">
            <button
              onClick={goToNextStep}
              className="w-full py-4 bg-forest-500 hover:bg-forest-600 text-beige-100 font-semibold rounded-2xl text-lg transition-colors shadow-md hover:shadow-lg"
            >
              {currentStep < exercise.instructions_fr.length - 1
                ? "Étape suivante →"
                : "Commencer l'exercice →"}
            </button>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                className="w-full py-3 text-forest-500 hover:text-forest-700 text-sm border border-forest-500/30 rounded-2xl transition-colors"
              >
                ← Étape précédente
              </button>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // ─── ÉTAT : ACTIVE ───────────────────────────────────────────────────────
  if (state === "active") {
    return (
      <PageShell exercise={exercise}>
        <div className="flex flex-col flex-1 px-6 py-4 max-w-lg mx-auto w-full">
          {isCoherence ? (
            <CoherenceTimer
              totalSeconds={exercise.duration_seconds}
              onComplete={(cycles) => {
                setCyclesCompleted(cycles);
                setState("complete");
              }}
            />
          ) : (
            <>
              {/* Timer visuel pour les exercices de pause */}
              <div className="flex flex-col items-center gap-6 py-8">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* SVG ring progress */}
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-beige-300"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * (1 - progressPct / 100)}`}
                      strokeLinecap="round"
                      className="text-forest-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="text-center z-10">
                    <p className="font-display text-4xl font-bold text-forest-800 tabular-nums">
                      {timeLeft}
                    </p>
                    <p className="text-sm text-forest-500">secondes</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="font-semibold text-forest-700 text-lg">
                    {exercise.name_fr}
                  </p>
                  <p className="text-sm text-forest-500 mt-1">
                    {running ? "En cours…" : "Prêt"}
                  </p>
                </div>
              </div>

              {/* Instructions abrégées en bas */}
              <div className="bg-beige-100/80 rounded-2xl border border-beige-300 px-5 py-4 mb-4">
                <p className="text-sm text-forest-600 leading-relaxed text-center">
                  {exercise.instructions_fr[2] || exercise.instructions_fr[0]}
                </p>
              </div>
            </>
          )}

          {!isCoherence && (
            <button
              onClick={() => {
                if (exercise.requiresInput) setState("input");
                else setState("complete");
              }}
              className="w-full py-3 text-sm text-forest-500 hover:text-forest-700 border border-forest-500/30 rounded-2xl transition-colors"
            >
              Terminer manuellement
            </button>
          )}
        </div>
      </PageShell>
    );
  }

  // ─── ÉTAT : INPUT ────────────────────────────────────────────────────────
  if (state === "input") {
    const currentValue = metricValue ? parseInt(metricValue, 10) : null;
    const previousScore = previousSession?.score ?? null;
    const hasComparison = currentValue !== null && previousScore !== null;
    const scoreImprovement = hasComparison ? currentValue - previousScore : 0;
    const improvementPercent = hasComparison && previousScore > 0
      ? Math.round((scoreImprovement / previousScore) * 100)
      : 0;

    return (
      <PageShell exercise={exercise}>
        <style>{animationStyles}</style>
        <div className="flex flex-col flex-1 px-6 py-12 max-w-lg mx-auto w-full justify-center gap-8">
          {/* Header with celebration */}
          <div className="text-center animate-fade-in-scale">
            <div className="text-6xl mb-4 animate-bounce">{exercise.emoji}</div>
            <h2 className="font-display text-3xl font-bold text-forest-800 mb-2">
              Bravo ! C'est fait 💪
            </h2>
            <p className="text-forest-500">
              Partage ton score pour suivre ta progression.
            </p>
          </div>

          {/* Input card with live comparison */}
          <div className="bg-beige-100 rounded-3xl border border-beige-300 p-8 shadow-beige">
            <label className="block text-sm font-medium text-forest-700 mb-3">
              {exercise.inputLabel}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="9999"
                value={metricValue}
                onChange={(e) => {
                  setMetricValue(e.target.value);
                  if (e.target.value) {
                    setShowProgressComparison(true);
                  }
                }}
                placeholder="0"
                className="flex-1 text-center text-4xl font-bold text-forest-800 bg-beige-200 border-2 border-beige-300 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/30 rounded-2xl py-4 outline-none transition-colors"
                autoFocus
              />
              <span className="text-forest-500 font-medium text-lg">
                {exercise.inputUnit}
              </span>
            </div>

            {/* Real-time comparison with previous session */}
            {showProgressComparison && hasComparison && (
              <div className="mt-5 p-3 bg-forest-50 rounded-2xl border border-forest-200 animate-fade-in-scale">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-forest-600">Par rapport à la dernière fois</span>
                  <div className={`flex items-center gap-1 font-bold text-lg ${
                    scoreImprovement > 0 ? "text-green-600" : scoreImprovement < 0 ? "text-copper-500" : "text-forest-600"
                  }`}>
                    {scoreImprovement > 0 && "↑ Progrès !"}
                    {scoreImprovement < 0 && "↓"}
                    {scoreImprovement === 0 && "→ Stable"}
                    {Math.abs(scoreImprovement)} {exercise.inputUnit}
                    {improvementPercent > 0 && <span className="text-sm"> (+{improvementPercent}%)</span>}
                    {improvementPercent < 0 && <span className="text-sm"> ({improvementPercent}%)</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Guidance text */}
            {exercise.category === "pause_controlee" && (
              <div className="mt-4 text-xs text-forest-500 text-center leading-relaxed">
                🔍 Un score supérieur à 40 pas = bonne tolérance au CO₂.
                <br />
                Ne t&apos;inquiète pas si c&apos;est faible au départ — ça s&apos;améliore vite !
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              onClick={saveSession}
              disabled={!metricValue}
              className="w-full py-4 bg-forest-500 hover:bg-forest-600 disabled:opacity-50 disabled:cursor-not-allowed text-beige-100 font-semibold rounded-2xl text-lg transition-colors shadow-md hover:shadow-lg"
            >
              ✓ Valider ma séance
            </button>

            <button
              onClick={() => {
                setMetricValue("");
                saveSession();
              }}
              className="w-full py-3 text-sm text-forest-500 hover:text-forest-700 transition-colors"
            >
              Continuer sans score
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  // ─── ÉTAT : SAVING ───────────────────────────────────────────────────────

  
  // ─── ÉTAT : SAVING ─────────────────────────────────────────────────────────
  if (state === "saving") {
    return (
      <PageShell exercise={exercise}>
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2D5016] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-600 font-medium">Sauvegarde en cours…</p>
          </div>
        </div>
      </PageShell>
    )
  }

  return null
}
