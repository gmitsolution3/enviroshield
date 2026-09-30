"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

import { Card } from "@/components/ui/card";

import DashboardButton from "./DashboardButton";

type DashboardErrorProps = {
  onRetry: () => void;
};

export default function DashboardError({
  onRetry,
}: DashboardErrorProps) {
  return (
    <section className="container mx-auto px-5 py-8 lg:px-0">
      <Card className="overflow-hidden border border-red-200/70 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          {/* Error Icon */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>

          {/* Content */}
          <div className="max-w-md mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-500">
              Something went wrong
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-navy">
              Failed to load data
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We couldn&apos;t retrieve the requested information.
              Please try again, and if the problem continues, check
              your connection or try again later.
            </p>
          </div>

          {/* Action */}
          <DashboardButton
            onClick={onRetry}
            icon={<RotateCcw className="h-4 w-4" />}
          >
            Try again
          </DashboardButton>
        </div>
      </Card>
    </section>
  );
}
