"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface RankedItem {
  id: string;
  name: string;
  subLabel?: string;
  count: number;
  revenue?: number;
}

interface TopBarChartProps {
  title?: string;
  items: RankedItem[];
  countLabel?: string;
  showRevenue?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function TopBarChart({
  title,
  items,
  countLabel = "Sold",
  showRevenue = true,
  emptyMessage = "No items recorded in this period",
  className,
}: TopBarChartProps) {
  const maxCount = useMemo(() => {
    return Math.max(...items.map((i) => i.count), 1);
  }, [items]);

  return (
    <div className={cn("flex flex-col gap-4 p-4", className)}>
      {title && (
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      )}

      {items.length === 0 ? (
        <div className="flex h-36 items-center justify-center text-xs text-muted-foreground border border-dashed rounded-xl">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const barPercentage = Math.round((item.count / maxCount) * 100);
            return (
              <div key={item.id || index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground truncate">
                      {item.name}
                    </span>
                    {item.subLabel && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        ({item.subLabel})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-foreground">
                      {item.count}{" "}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {countLabel}
                      </span>
                    </span>
                    {showRevenue && item.revenue !== undefined && (
                      <span className="text-muted-foreground text-[11px]">
                        • ৳{item.revenue.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full bg-blue transition-all duration-500"
                    style={{ width: `${barPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

