interface StreakDisplayProps {
  userId: string;
}

export function StreakDisplay({ userId }: StreakDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-copper-50 to-orange-50 border border-copper-200 rounded-2xl p-6 text-center">
      <div className="text-4xl font-bold text-copper-600">7</div>
      <p className="text-sm text-copper-600 mt-2">jours consécutifs</p>
    </div>
  );
}
