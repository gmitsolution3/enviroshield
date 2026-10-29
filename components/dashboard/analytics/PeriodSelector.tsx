"use client";

import { AnalyticsPeriod } from "@/types/admin/analytics.type";
import { cn } from "@/lib/utils";

interface PeriodSelectorProps {
  value: AnalyticsPeriod;
  onChange: (period: AnalyticsPeriod) => void;
  className?: string;
  disabled?: boolean;
}

const PERIOD_OPTIONS: Array<{ value: AnalyticsPeriod; label: string }> = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "12m", label: "12 Months" },
];

export function PeriodSelector({
  value,
  onChange,
  className,
  disabled,
}: PeriodSelectorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl bg-muted/80 p-1 border border-border/60 text-xs font-medium",
        className,
      )}
      role="group"
      aria-label="Select analytics time period"
    >
      {PERIOD_OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
              isSelected
                ? "bg-background text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            aria-pressed={isSelected}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

