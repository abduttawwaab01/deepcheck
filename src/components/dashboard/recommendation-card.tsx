import { Lightbulb } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
}

export function RecommendationCard({ recommendations }: { recommendations: Recommendation[] }) {
  if (!recommendations.length) return null;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-warning" />
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">🎯 Recommended For You</h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((r, i) => (
          <div key={r.id} className="flex gap-3 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              {i + 1}
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-900 dark:text-white">{r.title}</div>
              <div className="mt-0.5 text-xs text-neutral-500">{r.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
