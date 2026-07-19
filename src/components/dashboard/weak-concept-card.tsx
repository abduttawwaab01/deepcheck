import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Concept {
  id: string;
  name: string;
  score: number;
}

export function WeakConceptCard({ concepts }: { concepts: Concept[] }) {
  if (!concepts.length) return null;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">⚠️ Weak Concepts (Focus Here)</h3>
        <span className="text-xs text-neutral-400">{concepts.length} concepts</span>
      </div>

      <div className="space-y-3">
        {concepts.map((c) => (
          <div key={c.id} className="group cursor-pointer rounded-xl border border-neutral-100 p-3 transition-colors hover:border-error/20 hover:bg-error/5 dark:border-neutral-800 dark:hover:border-error/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-900 dark:text-white">{c.name}</span>
              <span className="text-sm font-bold text-error">{c.score}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div className="h-full rounded-full bg-error transition-all duration-500" style={{ width: `${c.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      <Link href="/student/plans" className="mt-4 block">
        <Button variant="ghost" size="sm" className="w-full text-error">View Full Plan →</Button>
      </Link>
    </div>
  );
}
