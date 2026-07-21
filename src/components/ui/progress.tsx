import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, color, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const barColor = color || (pct < 40 ? "bg-red-500" : pct < 60 ? "bg-yellow-500" : pct < 80 ? "bg-blue-500" : "bg-green-500");

    return (
      <div
        ref={ref}
        className={cn("h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800", className)}
        {...props}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";
