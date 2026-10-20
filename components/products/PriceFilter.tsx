"use client";

import { useState } from "react";
import {Button} from "@/components/Button";
import { Slider } from "@/components/ui/slider";

type Props = {
  min?: number;
  max: number;
  initialMin?: number;
  initialMax?: number;
  currency?: string;
  /** Other active filters (e.g. categoryId), preserved in the Apply link */
  hidden?: Record<string, string>;
  /** Where "Reset" goes (keeps other filters, drops price) */
  resetHref?: string;
  isFiltered?: boolean;
};

export default function PriceFilter({
  min = 0,
  max,
  initialMin,
  initialMax,
  currency = "৳",
  hidden = {},
  resetHref = "/products",
  isFiltered = false,
}: Props) {
  const [range, setRange] = useState<number[]>([
    Math.max(min, initialMin ?? min),
    Math.min(max, initialMax ?? max),
  ]);
  const [lo, hi] = range;
  const step = Math.max(1, Math.round((max - min) / 200));

  // The site Button renders a link, so "Apply" is a link built from the slider values
  const qs = new URLSearchParams(hidden);
  if (lo > min) qs.set("minPrice", String(lo));
  if (hi < max) qs.set("maxPrice", String(hi));
  const applyHref = qs.toString() ? `/products?${qs.toString()}` : "/products";

  return (
    <div className="space-y-5">
      <Slider
        min={min}
        max={max}
        step={step}
        value={range}
        onValueChange={(v) => setRange(v as number[])}
        aria-label="Price range"
        className="[&_[data-slot=slider-range]]:bg-blue [&_[data-slot=slider-thumb]]:border-blue [&_[data-slot=slider-track]]:bg-line"
      />

      <p className="text-sm text-ink/70">
        Price:{" "}
        <span className="font-semibold text-navy">
          {currency}
          {lo.toLocaleString()} — {currency}
          {hi.toLocaleString()}
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-2 w-full">
        <Button href={applyHref} fullWidth>Apply</Button>
        {isFiltered && (
          <Button href={resetHref} variant="outline">
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}