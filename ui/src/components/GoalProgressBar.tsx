import { useQuery } from "@tanstack/react-query";
import { goalsApi } from "../api/goals";
import { queryKeys } from "../lib/queryKeys";
import { cn } from "../lib/utils";

interface GoalProgressBarProps {
  goalId: string;
  className?: string;
  showLabel?: boolean;
}

export function GoalProgressBar({ goalId, className, showLabel = false }: GoalProgressBarProps) {
  const { data } = useQuery({
    queryKey: queryKeys.goals.progress(goalId),
    queryFn: () => goalsApi.getProgress(goalId),
    staleTime: 30_000,
  });

  if (!data || data.total === 0) return null;

  const active = data.total - data.cancelled;
  const pct = active > 0 ? Math.round((data.done / active) * 100) : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          {data.done}/{active}
        </span>
      )}
    </div>
  );
}
