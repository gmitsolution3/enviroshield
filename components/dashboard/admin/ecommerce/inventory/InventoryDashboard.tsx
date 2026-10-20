"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Boxes,
  CalendarClock,
  CheckCircle2,
  LoaderCircle,
  Package,
  RotateCcw,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useFetch } from "@/hooks/swr/useFetch";
import { axiosInstance } from "@/lib/axios";
import type {
  InventoryMovement,
  InventoryMovementsResponse,
  InventoryProduct,
  InventoryStatsResponse,
  LowStockResponse,
} from "@/types/admin/inventory.type";

const PAGE_SIZE = 10;

function SummaryCard({
  title,
  value,
  description,
  icon,
  iconClass,
  loading,
}: {
  title: string;
  value: number | undefined;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
  loading: boolean;
}) {
  return (
    <Card className="gap-0 rounded-2xl border-0 bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-navy">
            {loading || value === undefined
              ? "—"
              : value.toLocaleString("en-BD")}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{description}</p>
    </Card>
  );
}

function ProductThumbnail({ product }: { product: InventoryProduct }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
      {product.primaryImage?.url && !failed ? (
        <Image
          src={product.primaryImage.url}
          alt={product.primaryImage.alt || product.name}
          fill
          sizes="44px"
          unoptimized
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Package className="h-5 w-5" />
      )}
    </div>
  );
}

function StockBadge({ product }: { product: InventoryProduct }) {
  const status =
    product.stockQuantity <= 0
      ? "Out of Stock"
      : product.stockQuantity <= product.lowStockThreshold
        ? "Low Stock"
        : "In Stock";
  const style =
    status === "Out of Stock"
      ? "border-red-200 bg-red-50 text-red-700"
      : status === "Low Stock"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <Badge variant="outline" className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style}`}>
      {status === "In Stock" ? (
        <CheckCircle2 />
      ) : status === "Low Stock" ? (
        <AlertTriangle />
      ) : (
        <TrendingDown />
      )}
      {status}
    </Badge>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <span>{total.toLocaleString("en-BD")} total records</span>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span>
          Page {page} of {Math.max(1, totalPages)}
        </span>
        <div className="flex gap-2">
          <DashboardButton
            variant="outline"
            ariaLabel="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="h-8 w-8 rounded-full p-0"
            icon={<ArrowLeft className="h-4 w-4" />}
          />
          <DashboardButton
            variant="outline"
            ariaLabel="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="h-8 w-8 rounded-full p-0"
            icon={<ArrowRight className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
}

function SectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
      <p className="text-sm text-slate-500">
        We couldn&apos;t load this inventory data.
      </p>
      <DashboardButton
        variant="outline"
        onClick={onRetry}
        icon={<RotateCcw className="h-4 w-4" />}
      >
        Try again
      </DashboardButton>
    </div>
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

function getExportErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return "The CSV export could not be downloaded. Please try again.";
}

function getDownloadFilename(
  contentDisposition: string | undefined,
  fallback: string,
) {
  if (!contentDisposition) return fallback;

  const encodedFilename = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encodedFilename) {
    try {
      return decodeURIComponent(encodedFilename.replace(/^"|"$/g, ""));
    } catch {
      return fallback;
    }
  }

  return (
    contentDisposition.match(/filename="?([^";]+)"?/i)?.[1] ?? fallback
  );
}

export default function InventoryDashboard() {
  const [lowStockPage, setLowStockPage] = useState(1);
  const [movementsPage, setMovementsPage] = useState(1);
  const [isExportingStock, setIsExportingStock] = useState(false);
  const [isExportingMovements, setIsExportingMovements] = useState(false);

  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useFetch<InventoryStatsResponse>("/inventory/stats");
  const {
    data: lowStockResponse,
    isLoading: isLowStockLoading,
    isError: lowStockError,
    refetch: refetchLowStock,
  } = useFetch<LowStockResponse>(
    `/inventory/low-stock?page=${lowStockPage}&limit=${PAGE_SIZE}`,
  );
  const {
    data: movementsResponse,
    isLoading: isMovementsLoading,
    isError: movementsError,
    refetch: refetchMovements,
  } = useFetch<InventoryMovementsResponse>(
    `/inventory/movements?page=${movementsPage}&limit=${PAGE_SIZE}`,
  );

  const stats = statsResponse?.data;
  const lowStockData = lowStockResponse?.data;
  const lowStockProducts = lowStockData?.products ?? [];
  const lowStockPagination = lowStockData?.pagination;
  const movementsData = movementsResponse?.data;
  const movements = movementsData?.movements ?? [];
  const movementsPagination = movementsData?.pagination;

  const exportCsv = async (
    endpoint: string,
    fallbackFilename: string,
    setLoading: (loading: boolean) => void,
  ) => {
    setLoading(true);

    try {
      const response = await axiosInstance.get<Blob>(endpoint, {
        responseType: "blob",
      });
      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: "text/csv;charset=utf-8" });
      const filename = getDownloadFilename(
        response.headers["content-disposition"],
        fallbackFilename,
      );
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error: unknown) {
      toast.error(getExportErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-5 py-8 lg:px-0">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Inventory Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor stock levels and review inventory movements.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <DashboardButton
            disabled={isExportingStock}
            onClick={() =>
              void exportCsv(
                "/inventory/export/stock",
                "enviroshield-stock.csv",
                setIsExportingStock,
              )
            }
            icon={
              isExportingStock ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowDownToLine className="h-4 w-4" />
              )
            }
          >
            {isExportingStock ? "Exporting stock..." : "Export Stock CSV"}
          </DashboardButton>
          <DashboardButton
            disabled={isExportingMovements}
            onClick={() =>
              void exportCsv(
                "/inventory/export/movements",
                "enviroshield-inventory-movements.csv",
                setIsExportingMovements,
              )
            }
            icon={
              isExportingMovements ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowDownToLine className="h-4 w-4" />
              )
            }
          >
            {isExportingMovements
              ? "Exporting movements..."
              : "Export Movements CSV"}
          </DashboardButton>
        </div>
      </div>

      {statsError && !stats ? (
        <Card className="mb-6 rounded-2xl border-red-200 bg-white shadow-sm">
          <SectionError onRetry={() => void refetchStats()} />
        </Card>
      ) : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Products"
          value={stats?.totalProducts}
          description="Products tracked in the inventory"
          icon={<Package className="h-5 w-5" />}
          iconClass="bg-blue/10 text-blue"
          loading={isStatsLoading && !stats}
        />
        <SummaryCard
          title="Low Stock Products"
          value={stats?.lowStockProducts}
          description="Products at or below their threshold"
          icon={<AlertTriangle className="h-5 w-5" />}
          iconClass="bg-amber-50 text-amber-600"
          loading={isStatsLoading && !stats}
        />
        <SummaryCard
          title="Out of Stock"
          value={stats?.outOfStockProducts}
          description="Products with zero units available"
          icon={<TrendingDown className="h-5 w-5" />}
          iconClass="bg-red-50 text-red-600"
          loading={isStatsLoading && !stats}
        />
        <SummaryCard
          title="Total Units in Stock"
          value={stats?.totalUnitsInStock}
          description="Combined units across all products"
          icon={<Boxes className="h-5 w-5" />}
          iconClass="bg-violet-50 text-violet-600"
          loading={isStatsLoading && !stats}
        />
      </div>

      <Card className="mb-8 gap-0 overflow-hidden rounded-2xl border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200/80">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy">Low Stock Products</h2>
              <p className="mt-1 text-sm text-slate-500">
                Products that need replenishment.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {lowStockPagination?.total ?? 0} products
            </span>
          </div>
        </div>

        {isLowStockLoading && !lowStockResponse ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((row) => (
              <div key={row} className="h-14 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : lowStockError && !lowStockResponse ? (
          <SectionError onRetry={() => void refetchLowStock()} />
        ) : lowStockProducts.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
            <p className="mt-3 text-sm font-semibold text-navy">
              No low-stock products
            </p>
            <p className="mt-1 text-sm text-slate-500">
              There are no products needing replenishment right now.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    {[
                      "Product",
                      "Stock Quantity",
                      "Low-Stock Threshold",
                      "Stock Status",
                      "Product Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 first:pl-6 last:pr-6"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lowStockProducts.map((product) => (
                    <tr key={product._id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProductThumbnail product={product} />
                          <div className="min-w-0">
                            <p className="max-w-[280px] truncate text-sm font-semibold text-navy">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-sm font-bold ${product.stockQuantity === 0 ? "text-red-600" : "text-amber-700"}`}>
                          {product.stockQuantity.toLocaleString("en-BD")} units
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {product.lowStockThreshold.toLocaleString("en-BD")} units
                      </td>
                      <td className="px-5 py-4">
                        <StockBadge product={product} />
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className="rounded-full px-2.5 py-1 text-[11px] capitalize text-slate-600">
                          {product.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={lowStockPagination?.page ?? lowStockPage}
              totalPages={lowStockPagination?.totalPages ?? 1}
              total={lowStockPagination?.total ?? 0}
              onPageChange={setLowStockPage}
            />
          </>
        )}
      </Card>

      <Card className="gap-0 overflow-hidden rounded-2xl border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200/80">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy">Inventory Movement History</h2>
              <p className="mt-1 text-sm text-slate-500">
                Review stock changes and the users who recorded them.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {movementsPagination?.total ?? 0} movements
            </span>
          </div>
        </div>

        {isMovementsLoading && !movementsResponse ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((row) => (
              <div key={row} className="h-14 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : movementsError && !movementsResponse ? (
          <SectionError onRetry={() => void refetchMovements()} />
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
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    {[
                      "Movement Date and Time",
                      "Product ID",
                      "Movement Type",
                      "Quantity Changed",
                      "Previous Stock",
                      "Resulting Stock",
                      "Reason",
                      "Performed By",
                    ].map((heading) => (
                      <th key={heading} className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 first:pl-6 last:pr-6">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {movements.map((movement) => (
                    <MovementRow key={movement._id} movement={movement} />
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={movementsPagination?.page ?? movementsPage}
              totalPages={movementsPagination?.totalPages ?? 1}
              total={movementsPagination?.total ?? 0}
              onPageChange={setMovementsPage}
            />
          </>
        )}
      </Card>
    </section>
  );
}

function MovementRow({ movement }: { movement: InventoryMovement }) {
  const isIncrease = movement.movementType === "increase";
  const movementStyle = isIncrease
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-red-200 bg-red-50 text-red-700";

  return (
    <tr className="transition-colors hover:bg-slate-50/70">
      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
        {formatMovementDate(movement.createdAt)}
      </td>
      <td className="px-5 py-4 font-mono text-xs text-slate-600">{movement.productId || "Unavailable"}</td>
      <td className="px-5 py-4">
        <Badge variant="outline" className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${movementStyle}`}>
          {isIncrease ? <ArrowUp /> : <ArrowDown />}
          {movement.movementType}
        </Badge>
      </td>
      <td className={`px-5 py-4 text-sm font-bold ${isIncrease ? "text-emerald-700" : "text-red-700"}`}>
        {isIncrease ? "+" : "−"}{movement.quantity.toLocaleString("en-BD")} units
      </td>
      <td className="px-5 py-4 text-sm text-slate-600">{movement.previousStock.toLocaleString("en-BD")}</td>
      <td className="px-5 py-4 text-sm font-semibold text-navy">{movement.resultingStock.toLocaleString("en-BD")}</td>
      <td className="max-w-[240px] px-5 py-4 text-sm text-slate-600">{movement.reason || "No reason provided"}</td>
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
