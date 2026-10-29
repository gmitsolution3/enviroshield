"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface StatusSegment {
  label: string;
  count: number;
  color: string;
}

interface StatusDonutChartProps {
  title?: string;
  data: StatusSegment[];
  className?: string;
}

export function StatusDonutChart({
  title,
  data,
  className,
}: StatusDonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets for each segment
  const segments = useMemo(() => {
    if (total === 0) return [];

    let currentOffset = 0;
    return data.map((item, index) => {
      const percentage = (item.count / total) * 100;
      const strokeLength = (item.count / total) * circumference;
      const strokeDashoffset = -currentOffset;
      currentOffset += strokeLength;

      return {
        ...item,
        index,
        percentage: Math.round(percentage * 10) / 10,
        strokeLength,
        strokeDashoffset,
      };
    });
  }, [data, total, circumference]);

  const activeSegment =
    hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-6 p-4",
        className,
      )}
    >
      {title && (
        <h4 className="text-sm font-semibold text-foreground self-start">
          {title}
        </h4>
      )}

      {/* Donut and Center Text */}
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 select-none overflow-visible"
        >
          {/* Base Empty Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-muted/60"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {total > 0 &&
            segments.map((seg) => {
              const isHovered = hoveredIndex === seg.index;
              return (
                <circle
                  key={seg.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${seg.strokeLength} ${circumference}`}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(seg.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
          {activeSegment ? (
            <>
              <span className="font-display text-xl font-bold text-foreground">
                {activeSegment.count}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[100px]">
                {activeSegment.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                ({activeSegment.percentage}%)
              </span>
            </>
          ) : (
            <>
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                {total}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                Total
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="w-full grid grid-cols-2 gap-2 text-xs">
        {data.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          const percentage =
            total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "flex items-center justify-between rounded-lg p-1.5 transition-colors cursor-pointer",
                isHovered
                  ? "bg-muted/80 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/40",
              )}
            >
              <div className="flex items-center gap-2 truncate pr-1">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="capitalize truncate">{item.label}</span>
              </div>
              <span className="text-foreground font-semibold shrink-0">
                {item.count} <span className="text-muted-foreground text-[10px]">({percentage}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
