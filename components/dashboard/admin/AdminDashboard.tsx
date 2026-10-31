"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  HelpCircle,
  Mail,
  Package,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardError from "@/components/dashboard/DashboardError";
import { PeriodSelector } from "@/components/dashboard/analytics/PeriodSelector";
import { InteractiveAreaChart } from "@/components/dashboard/analytics/charts/InteractiveAreaChart";
import { StatusDonutChart } from "@/components/dashboard/analytics/charts/StatusDonutChart";
import { analyticsApi } from "@/lib/api/analytics";
import { AnalyticsPeriod } from "@/types/analytics.type";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
  user: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [chartMetric, setChartMetric] = useState<"revenue" | "volume">("revenue");

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    [`/analytics/admin/overview`, period],
    () => analyticsApi.getAdminOverview(period),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "#10b981"; // emerald
      case "shipped":
        return "#6366f1"; // indigo
      case "processing":
        return "#8b5cf6"; // purple
      case "confirmed":
        return "#016edc"; // blue
      case "pending":
        return "#f59e0b"; // amber
      case "cancelled":
        return "#ef4444"; // red
      default:
        return "#64748b";
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in-progress":
        return "#8b5cf6";
      case "confirmed":
        return "#016edc";
      case "pending":
        return "#f59e0b";
      case "cancelled":
        return "#ef4444";
      case "rejected":
        return "#64748b";
      default:
        return "#94a3b8";
    }
  };

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1440px] p-6 sm:p-8 lg:p-10 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">
              Administration
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {user.name}
            </h1>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>
        <DashboardError onRetry={() => mutate()} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 p-6 sm:p-8 lg:p-10">
      {/* Header section with period selector & refresh */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue/10 px-2.5 py-0.5 text-xs font-semibold text-blue">
              Administrator
            </span>
            {isValidating && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Updating...
              </span>
            )}
          </div>

          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Welcome back, {user.name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Business and operational analytics overview for Enviroshield.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PeriodSelector
            value={period}
            onChange={setPeriod}
            disabled={isValidating}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => mutate()}
            disabled={isValidating}
            className="h-9 gap-1.5 rounded-xl border-border/70 text-xs"
            title="Refresh analytics data"
          >
            <RotateCcw
              className={cn("h-3.5 w-3.5", isValidating && "animate-spin")}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Card 1: Orders */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 text-blue">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="font-display text-2xl font-bold tracking-tight">
                {data.summary.orders.periodOrders.toLocaleString()}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {data ? (
                <>
                  <span className="font-medium text-foreground">
                    {data.summary.orders.deliveredOrders}
                  </span>{" "}
                  delivered •{" "}
                  <span className="font-medium text-foreground">
                    {data.summary.orders.totalOrders}
                  </span>{" "}
                  lifetime
                </>
              ) : (
                "Loading statistics..."
              )}
            </p>
            <Link
              href="/dashboard/ecommerce/orders"
              className="mt-2 inline-flex items-center text-[11px] font-medium text-blue hover:underline"
            >
              View orders <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Card 2: Paid Revenue (Explicitly Collected) */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              Paid Revenue
              <span
                title="Revenue collected from orders explicitly marked as paid. Cash on delivery orders remain pending until paid."
                className="cursor-help text-muted-foreground/60 hover:text-foreground"
              >
                <HelpCircle className="h-3 w-3" />
              </span>
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="font-display text-2xl font-bold tracking-tight text-emerald-600">
                ৳{data.summary.financials.paidOrderValue.toLocaleString()}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {data ? (
                <>
                  <span className="font-medium text-foreground">
                    {data.summary.financials.paidOrdersCount}
                  </span>{" "}
                  paid orders in period
                </>
              ) : (
                "Loading statistics..."
              )}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/80">
              Avg Order: ৳
              {data?.summary.financials.averageOrderValue.toLocaleString() ?? 0}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Total Order Value */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Order Value
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo/10 text-indigo">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="font-display text-2xl font-bold tracking-tight">
                ৳{data.summary.financials.orderValue.toLocaleString()}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {data ? (
                <>
                  Lifetime: ৳
                  {data.summary.financials.lifetimeOrderValue.toLocaleString()}
                </>
              ) : (
                "Loading statistics..."
              )}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/70">
              Excludes cancelled orders
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Service Bookings */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Service Bookings
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="font-display text-2xl font-bold tracking-tight">
                {data.summary.bookings.periodBookings.toLocaleString()}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {data ? (
                <>
                  <span className="font-medium text-foreground">
                    {data.summary.bookings.completedBookings}
                  </span>{" "}
                  completed •{" "}
                  <span className="font-medium text-foreground">
                    {data.summary.bookings.totalBookings}
                  </span>{" "}
                  lifetime
                </>
              ) : (
                "Loading statistics..."
              )}
            </p>
            <Link
              href="/dashboard/service-bookings"
              className="mt-2 inline-flex items-center text-[11px] font-medium text-teal-600 hover:underline"
            >
              Manage bookings <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Card 5: Registered Customers */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Customers
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="font-display text-2xl font-bold tracking-tight">
                {data.summary.customers.totalCustomers.toLocaleString()}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {data ? (
                <>
                  <span className="font-medium text-emerald-600">
                    +{data.summary.customers.newCustomersInPeriod}
                  </span>{" "}
                  registered in {period}
                </>
              ) : (
                "Loading statistics..."
              )}
            </p>
            <Link
              href="/dashboard/users"
              className="mt-2 inline-flex items-center text-[11px] font-medium text-purple-600 hover:underline"
            >
              View accounts <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Card 6: Inventory Status */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Inventory & Stock
            </CardTitle>
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                (data?.summary.products.lowStockProducts ?? 0) > 0
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-blue/10 text-blue",
              )}
            >
              <Boxes className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="font-display text-2xl font-bold tracking-tight">
                {data.summary.products.totalProducts.toLocaleString()}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {data ? (
                <>
                  <span
                    className={cn(
                      "font-semibold",
                      data.summary.products.lowStockProducts > 0
                        ? "text-amber-600"
                        : "text-foreground",
                    )}
                  >
                    {data.summary.products.lowStockProducts}
                  </span>{" "}
                  low stock •{" "}
                  <span className="font-medium text-foreground">
                    {data.summary.products.outOfStockProducts}
                  </span>{" "}
                  out of stock
                </>
              ) : (
                "Loading statistics..."
              )}
            </p>
            <Link
              href="/dashboard/ecommerce/inventory"
              className="mt-2 inline-flex items-center text-[11px] font-medium text-blue hover:underline"
            >
              Stock manager <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Main Timeline Chart (2 cols) */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50">
            <div>
              <CardTitle className="text-base font-bold tracking-tight">
                Performance Timeline
              </CardTitle>
              <CardDescription className="text-xs">
                {chartMetric === "revenue"
                  ? "Order Value vs Paid Revenue over time"
                  : "Order volume vs Booking volume over time"}
              </CardDescription>
            </div>

            {/* Toggle Metric View */}
            <div className="flex items-center gap-1 rounded-lg bg-muted/80 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setChartMetric("revenue")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-all",
                  chartMetric === "revenue"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Revenue (৳)
              </button>
              <button
                type="button"
                onClick={() => setChartMetric("volume")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-all",
                  chartMetric === "volume"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Activity Volume
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoading || !data ? (
              <div className="flex h-60 items-center justify-center">
                <Skeleton className="h-52 w-full rounded-xl" />
              </div>
            ) : chartMetric === "revenue" ? (
              <InteractiveAreaChart
                data={data.timeline.map((item) => ({
                  label: item.label,
                  value: item.orderValue,
                  secondaryValue: item.paidOrderValue,
                  date: item.date,
                }))}
                valuePrefix="৳"
                primaryLabel="Order Value"
                secondaryLabel="Paid Revenue"
                showSecondary={true}
                height={260}
              />
            ) : (
              <InteractiveAreaChart
                data={data.timeline.map((item) => ({
                  label: item.label,
                  value: item.ordersCount,
                  secondaryValue: item.bookingsCount,
                  date: item.date,
                }))}
                valuePrefix=""
                valueSuffix=" items"
                primaryLabel="Orders"
                secondaryLabel="Bookings"
                showSecondary={true}
                height={260}
              />
            )}

            {/* Chart Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              {chartMetric === "revenue" ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue" />
                    <span>Eligible Order Value (Gross)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Paid Revenue (Collected)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue" />
                    <span>Product Orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Service Bookings</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown Donut (1 col) */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs flex flex-col justify-between">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-base font-bold tracking-tight">
              Order Lifecycle Status
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution across active and completed states
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 flex-1 flex flex-col justify-center">
            {isLoading || !data ? (
              <div className="flex h-56 items-center justify-center">
                <Skeleton className="h-44 w-44 rounded-full" />
              </div>
            ) : (
              <StatusDonutChart
                data={Object.entries(data.distributions.orderStatus).map(
                  ([key, count]) => ({
                    label: key,
                    count,
                    color: getOrderStatusColor(key),
                  }),
                )}
              />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Operational Highlights & Recent Activity Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <div>
              <CardTitle className="text-base font-bold tracking-tight">
                Recent Orders
              </CardTitle>
              <CardDescription className="text-xs">
                Latest customer purchases across Enviroshield
              </CardDescription>
            </div>
            <Link
              href="/dashboard/ecommerce/orders"
              className="text-xs font-semibold text-blue hover:underline inline-flex items-center gap-1"
            >
              All orders <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>

          <CardContent className="pt-4">
            {isLoading || !data ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : data.recentActivity.orders.length === 0 ? (
              <div className="flex h-44 items-center justify-center text-xs text-muted-foreground border border-dashed rounded-xl">
                No orders placed yet
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {data.recentActivity.orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-xs"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          #{o.orderNumber}
                        </span>
                        <span className="text-muted-foreground truncate max-w-[150px]">
                          {o.customerName}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ৳{o.totalAmount.toLocaleString()}
                        </p>
                        <span
                          className={cn(
                            "text-[10px] uppercase font-bold",
                            o.paymentStatus === "paid"
                              ? "text-emerald-600"
                              : "text-amber-600",
                          )}
                        >
                          {o.paymentStatus}
                        </span>
                      </div>

                      <Badge
                        variant="outline"
                        className="capitalize text-[10px] px-2 py-0.5 rounded-md"
                        style={{
                          borderColor: `${getOrderStatusColor(o.status)}40`,
                          color: getOrderStatusColor(o.status),
                        }}
                      >
                        {o.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Service Bookings */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <div>
              <CardTitle className="text-base font-bold tracking-tight">
                Recent Bookings
              </CardTitle>
              <CardDescription className="text-xs">
                Latest service inquiries and scheduled visits
              </CardDescription>
            </div>
            <Link
              href="/dashboard/service-bookings"
              className="text-xs font-semibold text-teal-600 hover:underline inline-flex items-center gap-1"
            >
              All bookings <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>

          <CardContent className="pt-4">
            {isLoading || !data ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : data.recentActivity.bookings.length === 0 ? (
              <div className="flex h-44 items-center justify-center text-xs text-muted-foreground border border-dashed rounded-xl">
                No service bookings recorded yet
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {data.recentActivity.bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-xs"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          #{b.bookingNumber}
                        </span>
                        <span className="text-muted-foreground truncate max-w-[150px]">
                          {b.serviceName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>
                          {new Date(b.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {b.isSiteVisit && (
                          <span className="text-teal-600 font-medium">
                            • Site Visit
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ৳{b.finalPrice.toLocaleString()}
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className="capitalize text-[10px] px-2 py-0.5 rounded-md"
                        style={{
                          borderColor: `${getBookingStatusColor(b.status)}40`,
                          color: getBookingStatusColor(b.status),
                        }}
                      >
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Secondary Activity: Low Stock Alerts & Inquiries */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Alerts */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">
                  Stock Alerts
                </CardTitle>
                <CardDescription className="text-xs">
                  Products below re-order thresholds
                </CardDescription>
              </div>
            </div>
            <Link
              href="/dashboard/ecommerce/inventory"
              className="text-xs font-semibold text-blue hover:underline inline-flex items-center gap-1"
            >
              Inventory <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>

          <CardContent className="pt-4">
            {isLoading || !data ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
              </div>
            ) : data.recentActivity.lowStockProducts.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-xs text-emerald-600 gap-2 border border-dashed rounded-xl">
                <CheckCircle2 className="h-4 w-4" /> All inventory levels are healthy
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {data.recentActivity.lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-semibold text-foreground truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        SKU: {p.sku}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span
                          className={cn(
                            "font-bold",
                            p.stockQuantity === 0
                              ? "text-red-500"
                              : "text-amber-600",
                          )}
                        >
                          {p.stockQuantity} remaining
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          Min threshold: {p.lowStockThreshold}
                        </p>
                      </div>

                      <Badge
                        variant={p.stockQuantity === 0 ? "destructive" : "secondary"}
                        className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md"
                      >
                        {p.stockQuantity === 0 ? "Out of Stock" : "Low Stock"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Inquiries */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue/10 text-blue">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">
                  Contact Inquiries
                </CardTitle>
                <CardDescription className="text-xs">
                  {data?.summary.inquiries.newInquiries ?? 0} new or unresolved requests
                </CardDescription>
              </div>
            </div>
            <Link
              href="/dashboard/contacts"
              className="text-xs font-semibold text-blue hover:underline inline-flex items-center gap-1"
            >
              Inquiries <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>

          <CardContent className="pt-4">
            {isLoading || !data ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-xl" />
                ))}
              </div>
            ) : data.recentActivity.inquiries.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-xs text-muted-foreground border border-dashed rounded-xl">
                No recent contact inquiries
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {data.recentActivity.inquiries.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-semibold text-foreground truncate">
                        {c.fullName}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {c.email} • {c.phoneNumber}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={c.status === "new" ? "default" : "outline"}
                        className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md"
                      >
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Navigation Quick Links */}
      <section className="rounded-2xl border border-border/70 bg-muted/30 p-6">
        <h3 className="text-sm font-bold text-foreground">
          Quick Management Shortcuts
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Direct navigation to core management modules
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Link
            href="/dashboard/ecommerce/orders"
            className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-background p-3 text-center transition-all hover:-translate-y-0.5 hover:border-blue hover:shadow-xs"
          >
            <ShoppingCart className="h-4 w-4 text-blue mb-1.5" />
            <span className="text-xs font-semibold text-foreground">Orders</span>
          </Link>

          <Link
            href="/dashboard/service-bookings"
            className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-background p-3 text-center transition-all hover:-translate-y-0.5 hover:border-teal-600 hover:shadow-xs"
          >
            <CalendarCheck className="h-4 w-4 text-teal-600 mb-1.5" />
            <span className="text-xs font-semibold text-foreground">Bookings</span>
          </Link>

          <Link
            href="/dashboard/ecommerce/inventory"
            className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-background p-3 text-center transition-all hover:-translate-y-0.5 hover:border-amber-600 hover:shadow-xs"
          >
            <Boxes className="h-4 w-4 text-amber-600 mb-1.5" />
            <span className="text-xs font-semibold text-foreground">Inventory</span>
          </Link>

          <Link
            href="/dashboard/ecommerce/products"
            className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-background p-3 text-center transition-all hover:-translate-y-0.5 hover:border-purple-600 hover:shadow-xs"
          >
            <Package className="h-4 w-4 text-purple-600 mb-1.5" />
            <span className="text-xs font-semibold text-foreground">Products</span>
          </Link>

          <Link
            href="/dashboard/contacts"
            className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-background p-3 text-center transition-all hover:-translate-y-0.5 hover:border-blue hover:shadow-xs"
          >
            <Mail className="h-4 w-4 text-blue mb-1.5" />
            <span className="text-xs font-semibold text-foreground">Inquiries</span>
          </Link>

          <Link
            href="/dashboard/users"
            className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-background p-3 text-center transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-xs"
          >
            <Users className="h-4 w-4 text-foreground mb-1.5" />
            <span className="text-xs font-semibold text-foreground">Users</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
