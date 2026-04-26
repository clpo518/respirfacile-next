"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CelebrationOverlay from "@/components/CelebrationOverlay";

interface SessionCompleteProps {
  exerciseId: string;
  score: number | null;
  previousScore: number | null;
  duration: number;
}

export default function SessionComplete({
  exerciseId,
  score,
  previousScore,
  duration,
}: SessionCompleteProps) {
  const router = useRouter();
  const [showCelebration, setShowCelebration] = useState(true);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBadges = async () => {
      try {
        const response = await fetch("/api/check-badges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exerciseId, score }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.new_badges?.length > 0) {
            setNewBadges(data.new_badges);
          }
        }
      } catch (error) {
        console.error("Error checking badges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBadges();
  }, [exerciseId, score]);

  const improvement =
    score != null && previousScore != null ? score - previousScore : null;

  const getMessage = () => {
    if (newBadges.length > 0) return `🏅 Nouveau badge débloqué !`;
    if (improvement != null && improvement > 0)
      return `+${improvement} pas ! Vous progressez 🚀`;
    if (score != null && score >= 25) return "Excellent score ! 25 pas 🏆";
    if (score != null && score >= 20) return "Très bien ! 20 pas atteints 💪";
    return "Séance complétée ! 🎉";
  };

  const getSubMessage = () => {
    if (newBadges.length > 0) {
      const badgeNames: Record<string, string> = {
        first_session: "Premier souffle",
        week_1: "Semaine 1",
        pause_20: "Pause 20s",
        pause_25: "Pause 25s",
        nasale_master: "Nez libre",
        coherence_30: "Rythme parfait",
        month_1: "1 mois",
      };
      return `"${badgeNames[newBadges[0]] || newBadges[0]}" ajouté à votre collection`;
    }
    if (improvement != null && improvement > 0)
      return `Score précédent : ${previousScore} pas → ${score} pas aujourd'hui`;
    return `${Math.round(duration / 60)} minutes de pratique enregistrées`;
  };

  if (isLoading) {
    return null;
  }

  return (
    <CelebrationOverlay
      show={showCelebration}
      message={getMessage()}
      subMessage={getSubMessage()}
      onClose={() => {
        setShowCelebration(false);
        router.push("/dashboard?celebration=1");
      }}
    />
  );
}
