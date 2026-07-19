import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export function StatsCard({ label, value, icon: Icon, color, bg }: StatsCardProps) {
  return (
    <div className="glass rounded-2xl p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bg)}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</div>
          <div className="text-xs text-neutral-500">{label}</div>
        </div>
      </div>
    </div>
  );
}
