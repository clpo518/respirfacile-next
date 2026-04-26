interface DashboardStatsProps {
  totalSessions: number;
  thisWeekSessions: number;
  currentStreak?: number;
}

export function DashboardStats({
  totalSessions,
  thisWeekSessions,
  currentStreak = 0,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-beige-300">
        <p className="text-3xl font-bold text-forest">{thisWeekSessions}</p>
        <p className="text-sm text-stone-500 mt-1">Séances cette semaine</p>
      </div>
      <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-beige-300">
        <p className="text-3xl font-bold text-copper">{totalSessions}</p>
        <p className="text-sm text-stone-500 mt-1">Séances au total</p>
      </div>
      <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-beige-300">
        <p className="text-3xl font-bold text-forest">{currentStreak}🔥</p>
        <p className="text-sm text-stone-500 mt-1">Jours consécutifs</p>
      </div>
    </div>
  );
}
