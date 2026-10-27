"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const statusStyles: Record<string, string> = {
  Processing: "border-amber-200 bg-amber-50 text-amber-800",
  Shipped: "border-blue-200 bg-blue-50 text-blue-800",
  Delivered: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Cancelled: "border-slate-200 bg-slate-100 text-slate-700",
  Paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Pending: "border-amber-200 bg-amber-50 text-amber-800",
  Refunded: "border-violet-200 bg-violet-50 text-violet-800",
  Submitted: "border-blue-200 bg-blue-50 text-blue-800",
  "Under Review": "border-violet-200 bg-violet-50 text-violet-800",
  "In Progress": "border-amber-200 bg-amber-50 text-amber-800",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Rejected: "border-red-200 bg-red-50 text-red-800",
};

export function UserStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`rounded-full px-2.5 py-1 font-semibold ${statusStyles[status] ?? "border-border bg-muted text-muted-foreground"}`}>
      {status}
    </Badge>
  );
}

export function UserDashboardMetric({
  title,
  value,
  description,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone: "blue" | "teal" | "amber";
}) {
  const toneStyles = {
    blue: "bg-blue/10 text-blue",
    teal: "bg-teal/10 text-teal",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-background shadow-none transition-colors hover:border-blue/25">
      <CardContent className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 truncate font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneStyles[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}

export function UserListPagination({
  page,
  totalPages,
  start,
  end,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  start: number;
  end: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Showing <span className="font-semibold text-foreground">{start}–{end}</span> of <span className="font-semibold text-foreground">{total}</span>
      </p>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-xs font-medium text-muted-foreground" aria-live="polite">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Previous</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Go to next page"
          >
            <span className="sr-only sm:not-sr-only">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
