"use client";

import {
  CalendarDays,
  CreditCard,
  Hash,
  MapPin,
  Package,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import DashboardError from "@/components/dashboard/DashboardError";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import OrderDetailsModal from "@/components/dashboard/admin/ecommerce/orders/OrderDetailsModal";
import CancelMyOrderModal from "./CancelMyOrderModal";
import {
  formatOrderAmount,
  formatOrderDate,
  prettyOrderStatus,
} from "@/components/dashboard/admin/ecommerce/orders/orderActionUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/swr/useFetch";
import type { AdminOrder, OrdersResponse } from "@/types";
import {
  UserDashboardMetric,
  UserListPagination,
  UserStatusBadge,
} from "./UserDashboardUI";

type OrderStatusFilter = "all" | AdminOrder["status"];
type PaymentStatusFilter = "all" | AdminOrder["paymentStatus"];
const PAGE_SIZE = 10;

export default function MyOrdersDashboard({
  userId,
}: {
  userId: string;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<OrderStatusFilter>("all");
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusFilter>("all");
  const [orderNumber, setOrderNumber] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);
  const [orderToCancel, setOrderToCancel] =
    useState<AdminOrder | null>(null);

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(search.trim()),
      2000,
    );
    return () => clearTimeout(timeout);
  }, [search]);

  const endpoint = useMemo(() => {
    if (!userId) return null;

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    if (status !== "all") params.set("status", status);
    if (paymentStatus !== "all") {
      params.set("paymentStatus", paymentStatus);
    }
    if (orderNumber.trim())
      params.set("orderNumber", orderNumber.trim());
    if (debouncedSearch) params.set("search", debouncedSearch);
    return `/order/mine?${params.toString()}`;
  }, [
    debouncedSearch,
    orderNumber,
    page,
    paymentStatus,
    status,
    userId,
  ]);

  const { data, isLoading, isError, refetch } =
    useFetch<OrdersResponse>(endpoint);
  const orders = data?.data ?? [];
  const meta = data?.meta;
  const hasActiveFilters =
    Boolean(search.trim()) ||
    status !== "all" ||
    paymentStatus !== "all" ||
    Boolean(orderNumber.trim());
  const isSearchPending = search.trim() !== debouncedSearch;
  const hasCompleteUnfilteredHistory =
    !hasActiveFilters &&
    meta !== undefined &&
    meta.total === orders.length;
  const totalSpent = hasCompleteUnfilteredHistory
    ? orders
        .filter((order) => order.status !== "cancelled")
        .reduce((total, order) => total + order.totalAmount, 0)
    : null;
  const summaryCurrency = orders[0]?.currency ?? "BDT";
  const activeOrders = hasCompleteUnfilteredHistory
    ? orders.filter(
        (order) =>
          order.status === "processing" || order.status === "shipped",
      ).length
    : null;
  const completedOrders = hasCompleteUnfilteredHistory
    ? orders.filter((order) => order.status === "delivered").length
    : null;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const start =
    orders.length && meta ? (meta.page - 1) * meta.limit + 1 : 0;
  const end =
    orders.length && meta
      ? Math.min(start + orders.length - 1, meta.total)
      : 0;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateOrderNumber(value: string) {
    setOrderNumber(value);
    setPage(1);
  }

  function updateStatus(value: string | null) {
    if (
      value === "all" ||
      value === "pending" ||
      value === "confirmed" ||
      value === "processing" ||
      value === "shipped" ||
      value === "delivered" ||
      value === "cancelled"
    ) {
      setStatus(value);
      setPage(1);
    }
  }

  function updatePaymentStatus(value: string | null) {
    if (
      value === "all" ||
      value === "pending" ||
      value === "paid" ||
      value === "failed" ||
      value === "refunded"
    ) {
      setPaymentStatus(value);
      setPage(1);
    }
  }

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setStatus("all");
    setPaymentStatus("all");
    setOrderNumber("");
    setPage(1);
  }

  if (isLoading && !data) return <DashboardLoading />;
  if (isError && !data)
    return <DashboardError onRetry={() => void refetch()} />;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 p-6 sm:p-8 lg:p-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo">
            Your account
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Keep track of your purchases, check delivery progress, and
            review your order history.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit rounded-full border-blue/20 bg-blue/5 px-3 py-1.5 text-sm font-semibold text-blue"
        >
          {meta?.total ?? 0}{" "}
          {hasActiveFilters ? "matching orders" : "orders total"}
        </Badge>
      </section>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Order summaries"
      >
        <UserDashboardMetric
          title="Total Spent"
          value={
            totalSpent === null
              ? "—"
              : formatOrderAmount(totalSpent, summaryCurrency)
          }
          description={
            totalSpent === null
              ? "Unavailable for filtered or paginated history"
              : "Across non-cancelled orders"
          }
          icon={CreditCard}
          tone="blue"
        />
        <UserDashboardMetric
          title="Active Orders"
          value={activeOrders === null ? "—" : String(activeOrders)}
          description={
            activeOrders === null
              ? "Unavailable for filtered or paginated history"
              : "Processing or on the way"
          }
          icon={Truck}
          tone="amber"
        />
        <UserDashboardMetric
          title="Completed Orders"
          value={
            completedOrders === null ? "—" : String(completedOrders)
          }
          description={
            completedOrders === null
              ? "Unavailable for filtered or paginated history"
              : "Successfully delivered"
          }
          icon={PackageCheck}
          tone="teal"
        />
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Order history
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse and filter your recent purchases.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-1.5">
              <label
                htmlFor="orders-search"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Search Orders
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="orders-search"
                  value={search}
                  onChange={(event) =>
                    updateSearch(event.target.value)
                  }
                  placeholder="Search order number, customer, email, or order ID..."
                  className="h-9 rounded-full border-blue/30 bg-muted/30 pl-9 text-xs shadow-sm transition-all duration-200 focus:border-blue/40 focus:ring-2 focus:ring-blue/10"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="order-number-filter"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
              >
                <Hash className="h-4 w-4" aria-hidden="true" />
                Order Number
              </label>
              <Input
                id="order-number-filter"
                value={orderNumber}
                onChange={(event) =>
                  updateOrderNumber(event.target.value)
                }
                placeholder="Filter by order number..."
                className="h-9 rounded-full border-blue/30 bg-muted/30 px-4 text-xs shadow-sm transition-all duration-200 focus:border-blue/40 focus:ring-2 focus:ring-blue/10"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="order-status-filter"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
              >
                <Package className="h-4 w-4" aria-hidden="true" />
                Order Status
              </label>
              <Select value={status} onValueChange={updateStatus}>
                <SelectTrigger
                  id="order-status-filter"
                  className="h-9 w-full rounded-full border-blue/30 bg-muted/30 px-3 text-xs font-semibold text-navy"
                >
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">
                    Processing
                  </SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="payment-status-filter"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Payment Status
              </label>
              <Select
                value={paymentStatus}
                onValueChange={updatePaymentStatus}
              >
                <SelectTrigger
                  id="payment-status-filter"
                  className="h-9 w-full rounded-full border-blue/30 bg-muted/30 px-3 text-xs font-semibold text-navy"
                >
                  <SelectValue placeholder="All Payment Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Payment Statuses
                  </SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-full px-4 text-xs"
                onClick={clearFilters}
              >
                <X className="mr-2 h-4 w-4" aria-hidden="true" />
                Clear Filters
              </Button>
            </div>
          )}

          {isSearchPending ? (
            <div
              className="space-y-4 rounded-2xl border border-border/70 p-5"
              aria-label="Loading matching orders"
              aria-busy="true"
            >
              {[1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="h-16 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-navy">
                {hasActiveFilters
                  ? "No matching orders"
                  : "No orders found"}
              </h2>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Try another order number, customer, or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border/70">
              {orders.map((order, index) => (
                <article
                  key={order._id}
                  className={`p-5 transition-colors hover:bg-muted/20 sm:p-6 ${index > 0 ? "border-t border-border/60" : ""}`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-base font-bold tracking-tight text-navy">
                          {order.orderNumber}
                        </h2>
                        <UserStatusBadge
                          status={prettyOrderStatus(order.status)}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="flex min-w-0 items-start gap-2.5">
                          <ShoppingBag
                            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">
                              Items ·{" "}
                              {order.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0,
                              )}
                            </p>
                            <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                              {order.items
                                .map((item) => item.name)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CalendarDays
                            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Order date
                            </p>
                            <p className="mt-1 text-sm font-medium text-foreground">
                              {formatOrderDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex min-w-0 items-start gap-2.5 sm:col-span-2 xl:col-span-1">
                          <MapPin
                            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">
                              Delivery location
                            </p>
                            <p className="mt-1 truncate text-sm font-medium text-foreground">
                              {[
                                order.deliveryAddress.area,
                                order.deliveryAddress.city,
                                order.deliveryAddress.district,
                              ]
                                .filter(Boolean)
                                .join(", ") ||
                                order.deliveryAddress.addressLine}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 lg:min-w-[200px] lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                      <div className="space-y-1 lg:text-right">
                        <p className="text-xs font-medium text-muted-foreground">
                          Order total
                        </p>
                        <p className="font-display text-xl font-bold text-navy">
                          {formatOrderAmount(
                            order.totalAmount,
                            order.currency,
                          )}
                        </p>
                        <UserStatusBadge
                          status={prettyOrderStatus(
                            order.paymentStatus,
                          )}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View details
                        </Button>
                        {order.status === "pending" && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="rounded-full"
                            onClick={() => setOrderToCancel(order)}
                          >
                            <XCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>

        {orders.length > 0 && meta && (
          <UserListPagination
            page={meta.page}
            totalPages={totalPages}
            start={start}
            end={end}
            total={meta.total}
            onPageChange={setPage}
          />
        )}
      </Card>

      <OrderDetailsModal
        order={selectedOrder}
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
      <CancelMyOrderModal
        key={orderToCancel?._id ?? "closed"}
        order={orderToCancel}
        open={Boolean(orderToCancel)}
        revalidateKey={endpoint ?? "/order/mine?page=1&limit=10"}
        onClose={() => setOrderToCancel(null)}
        onSuccess={() => setOrderToCancel(null)}
      />
    </div>
  );
}
