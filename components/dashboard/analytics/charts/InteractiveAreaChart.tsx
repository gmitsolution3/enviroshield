"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  date?: string;
}

interface InteractiveAreaChartProps {
  data: DataPoint[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  showSecondary?: boolean;
  className?: string;
}

export function InteractiveAreaChart({
  data,
  height = 240,
  valuePrefix = "",
  valueSuffix = "",
  primaryLabel = "Value",
  secondaryLabel = "Secondary",
  showSecondary = false,
  className,
}: InteractiveAreaChartProps) {
  const chartId = useId().replace(/:/g, "-");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const padding = { top: 20, right: 16, bottom: 32, left: 48 };
  const width = 800;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const { maxValue, points, secondaryPoints, yAxisTicks } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        maxValue: 100,
        points: [],
        secondaryPoints: [],
        yAxisTicks: [0, 50, 100],
      };
    }

    const maxPrimary = Math.max(...data.map((d) => d.value), 0);
    const maxSec = showSecondary
      ? Math.max(...data.map((d) => d.secondaryValue || 0), 0)
      : 0;
    const computedMax = Math.max(maxPrimary, maxSec);

    // Nice round max for Y axis
    const magnitude = computedMax > 0 ? Math.pow(10, Math.floor(Math.log10(computedMax))) : 10;
    const roundedMax =
      computedMax === 0
        ? 100
        : Math.ceil(computedMax / magnitude) * magnitude || 100;

    const count = data.length;
    const xStep = count > 1 ? innerWidth / (count - 1) : 0;

    const primaryPts = data.map((d, i) => {
      const x = padding.left + (count > 1 ? i * xStep : innerWidth / 2);
      const y = padding.top + innerHeight - (d.value / roundedMax) * innerHeight;
      return { x, y, ...d };
    });

    const secPts = showSecondary
      ? data.map((d, i) => {
          const x = padding.left + (count > 1 ? i * xStep : innerWidth / 2);
          const val = d.secondaryValue || 0;
          const y = padding.top + innerHeight - (val / roundedMax) * innerHeight;
          return { x, y, value: val };
        })
      : [];

    const yTicks = [
      0,
      Math.round(roundedMax * 0.25),
      Math.round(roundedMax * 0.5),
      Math.round(roundedMax * 0.75),
      roundedMax,
    ];

    return {
      maxValue: roundedMax,
      points: primaryPts,
      secondaryPoints: secPts,
      yAxisTicks: yTicks,
    };
  }, [data, innerHeight, innerWidth, padding.left, padding.top, showSecondary]);

  // Construct SVG paths
  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const first = points[0];
    const last = points[points.length - 1];

    let path = `M ${first.x} ${first.y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      path += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const bottomY = padding.top + innerHeight;
    path += ` L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
    return path;
  }, [points, padding.top, innerHeight]);

  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      path += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return path;
  }, [points]);

  const secondaryLinePath = useMemo(() => {
    if (!showSecondary || secondaryPoints.length === 0) return "";
    let path = `M ${secondaryPoints[0].x} ${secondaryPoints[0].y}`;
    for (let i = 1; i < secondaryPoints.length; i++) {
      const prev = secondaryPoints[i - 1];
      const curr = secondaryPoints[i];
      const cx = (prev.x + curr.x) / 2;
      path += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return path;
  }, [secondaryPoints, showSecondary]);

  const formatYValue = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
    return num.toString();
  };

  const activePoint = activeIndex !== null ? points[activeIndex] : null;
  const activeSecPoint =
    activeIndex !== null && showSecondary ? secondaryPoints[activeIndex] : null;

  const isAllZero = points.every((p) => p.value === 0);

  return (
    <div className={cn("relative w-full select-none", className)}>
      {/* Tooltip Float */}
      {activePoint && (
        <div
          className="pointer-events-none absolute z-20 flex flex-col gap-1 rounded-xl border border-border/80 bg-background/95 px-3 py-2 text-xs shadow-md backdrop-blur-sm transition-all duration-75"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${Math.max(10, activePoint.y - 65)}px`,
            transform:
              activePoint.x > width * 0.7
                ? "translateX(-100%)"
                : activePoint.x < width * 0.3
                  ? "translateX(0)"
                  : "translateX(-50%)",
          }}
        >
          <span className="font-semibold text-foreground">
            {activePoint.label}
          </span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-blue" />
            <span>{primaryLabel}:</span>
            <span className="font-semibold text-foreground">
              {valuePrefix}
              {activePoint.value.toLocaleString()}
              {valueSuffix}
            </span>
          </div>
          {showSecondary && activeSecPoint && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>{secondaryLabel}:</span>
              <span className="font-semibold text-foreground">
                {valuePrefix}
                {activeSecPoint.value.toLocaleString()}
                {valueSuffix}
              </span>
            </div>
          )}
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        style={{ height }}
      >
        <defs>
          <linearGradient
            id={`area-gradient-${chartId}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#016edc" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#016edc" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yAxisTicks.map((tick, i) => {
          const y =
            padding.top + innerHeight - (tick / maxValue) * innerHeight;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                className="text-border/40"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {formatYValue(tick)}
              </text>
            </g>
          );
        })}

        {/* Primary Area & Line */}
        {areaPath && (
          <path
            d={areaPath}
            fill={`url(#area-gradient-${chartId})`}
            className="transition-all duration-300"
          />
        )}

        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#016edc"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Secondary Line */}
        {secondaryLinePath && (
          <path
            d={secondaryLinePath}
            fill="none"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Interactive Hover Vertical Line */}
        {activePoint && (
          <line
            x1={activePoint.x}
            y1={padding.top}
            x2={activePoint.x}
            y2={padding.top + innerHeight}
            stroke="currentColor"
            className="text-foreground/30"
            strokeDasharray="3 3"
            strokeWidth={1.5}
          />
        )}

        {/* Interactive Point Marker */}
        {activePoint && (
          <g>
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r={5}
              fill="#016edc"
              stroke="#ffffff"
              strokeWidth={2}
            />
            {activeSecPoint && (
              <circle
                cx={activeSecPoint.x}
                cy={activeSecPoint.y}
                r={4}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
          </g>
        )}

        {/* X Axis Labels */}
        {points.map((p, i) => {
          // Downsample labels so they don't overlap if many points (e.g. 30d or 90d)
          const total = points.length;
          const stride = total > 40 ? 10 : total > 15 ? 4 : total > 7 ? 2 : 1;
          const isVisible = i % stride === 0 || i === total - 1;

          if (!isVisible) return null;

          return (
            <text
              key={i}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {p.label}
            </text>
          );
        })}

        {/* Transparent Interactive Columns for Hover */}
        {points.map((p, i) => {
          const colWidth = innerWidth / Math.max(1, points.length);
          return (
            <rect
              key={i}
              x={p.x - colWidth / 2}
              y={padding.top}
              width={colWidth}
              height={innerHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onTouchStart={() => setActiveIndex(i)}
            />
          );
        })}
      </svg>

      {/* Empty State Banner if all values are 0 */}
      {isAllZero && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="rounded-lg bg-background/80 px-3 py-1.5 text-xs text-muted-foreground border border-border/40 shadow-xs">
            No activity recorded for this period
          </p>
        </div>
      )}
    </div>
  );
}

