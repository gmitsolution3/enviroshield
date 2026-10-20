"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarClock,
  RotateCcw,
} from "lucide-react";

import DashboardButton from "@/components/dashboard/DashboardButton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type {
  InventoryMovement,
  InventoryPagination,
} from "@/types/admin/inventory.type";

type InventoryMovementTableProps = {
  title: string;
  description: string;
  movements: InventoryMovement[];
  pagination?: InventoryPagination;
  page: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  showProductId?: boolean;
};

export default function InventoryMovementTable({
  title,
  description,
  movements,
  pagination,
  page,
  isLoading,
  isError,
  onRetry,
  onPageChange,
  showProductId = false,
}: InventoryMovementTableProps) {
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200/80">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {pagination?.total ?? 0} movements
          </span>
        </div>
      </div>

      {isLoading && movements.length === 0 ? (
        <div className="space-y-3 p-6">
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              className="h-14 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      ) : isError && movements.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
          <p className="text-sm text-slate-500">
            We couldn&apos;t load this movement history.
          </p>
          <DashboardButton
            variant="outline"
            onClick={onRetry}
            icon={<RotateCcw className="h-4 w-4" />}
          >
            Try again
          </DashboardButton>
        </div>
      ) : movements.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-navy">
            No inventory movements
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Movement history will appear here when stock changes are recorded.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`w-full ${showProductId ? "min-w-[1200px]" : "min-w-[1050px]"}`}>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="whitespace-nowrap px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Movement Date and Time
                </th>
                {showProductId && (
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Product ID
                  </th>
                )}
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Movement Type
                </th>
                <th className="whitespace-nowrap px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quantity Changed
                </th>
                <th className="whitespace-nowrap px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Previous Stock
                </th>
                <th className="whitespace-nowrap px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Resulting Stock
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Reason
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Performed By
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((movement) => (
                <MovementRow
                  key={movement._id}
                  movement={movement}
                  showProductId={showProductId}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {movements.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>{(pagination?.total ?? 0).toLocaleString("en-BD")} total movements</span>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span>
              Page {pagination?.page ?? page} of {Math.max(1, totalPages)}
            </span>
            <div className="flex gap-2">
              <DashboardButton
                variant="outline"
                ariaLabel="Previous page"
                disabled={page <= 1 || isLoading}
                onClick={() => onPageChange(page - 1)}
                className="h-8 w-8 rounded-full p-0"
                icon={<ArrowLeft className="h-4 w-4" />}
              />
              <DashboardButton
                variant="outline"
                ariaLabel="Next page"
                disabled={page >= totalPages || isLoading}
                onClick={() => onPageChange(page + 1)}
                className="h-8 w-8 rounded-full p-0"
                icon={<ArrowRight className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function MovementRow({
  movement,
  showProductId,
}: {
  movement: InventoryMovement;
  showProductId: boolean;
}) {
  const isIncrease = movement.movementType === "increase";
  const movementStyle = isIncrease
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-red-200 bg-red-50 text-red-700";

  return (
    <tr className="transition-colors hover:bg-slate-50/70">
      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
        {formatMovementDate(movement.createdAt)}
      </td>
      {showProductId && (
        <td className="px-5 py-4 font-mono text-xs text-slate-600">
          {movement.productId || "Unavailable"}
        </td>
      )}
      <td className="px-5 py-4">
        <Badge
          variant="outline"
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${movementStyle}`}
        >
          {isIncrease ? <ArrowUp /> : <ArrowDown />}
          {movement.movementType}
        </Badge>
      </td>
      <td
        className={`whitespace-nowrap px-5 py-4 text-sm font-bold ${isIncrease ? "text-emerald-700" : "text-red-700"}`}
      >
        {isIncrease ? "+" : "−"}
        {movement.quantity.toLocaleString("en-BD")} units
      </td>
      <td className="px-5 py-4 text-sm text-slate-600">
        {movement.previousStock.toLocaleString("en-BD")}
      </td>
      <td className="px-5 py-4 text-sm font-semibold text-navy">
        {movement.resultingStock.toLocaleString("en-BD")}
      </td>
      <td className="max-w-[240px] px-5 py-4 text-sm text-slate-600">
        {movement.reason || "No reason provided"}
      </td>
      <td className="px-5 py-4">
        <p className="whitespace-nowrap text-sm font-semibold text-navy">
          {movement.performedBy?.name || "Unknown user"}
        </p>
        {movement.performedBy?.email && (
          <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
            {movement.performedBy.email}
          </p>
        )}
      </td>
    </tr>
  );
}

function formatMovementDate(value: string | null | undefined) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
