interface MoodRingProps {
  compact?: boolean;
}

export function MoodRing({ compact }: MoodRingProps) {
  return (
    <div className={`bg-beige-50 border border-beige-300 rounded-2xl p-6 text-center ${compact ? 'p-4' : ''}`}>
      <p className="text-sm font-medium text-forest-700 mb-3">Comment te sens-tu ?</p>
      <div className="flex justify-center gap-2">
        {['😢', '😔', '😐', '🙂', '😄'].map((emoji, i) => (
          <button key={i} className="text-2xl hover:scale-110 transition-transform">
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
