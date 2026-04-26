export function DailyTip() {
  const tips = [
    "Respirez par le nez autant que possible",
    "Faites une pause contrôlée chaque jour",
    "Restez régulier dans vos exercices",
    "Écoutez votre corps"
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return (
    <div className="bg-copper-50 border border-copper-200 rounded-2xl p-4">
      <p className="text-sm font-semibold text-copper-700">💡 Astuce du jour</p>
      <p className="text-sm text-copper-600 mt-2">{tip}</p>
    </div>
  );
}
