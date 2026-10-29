"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Package,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Wallet,
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
import { analyticsApi } from "@/lib/api/analytics";
import { AnalyticsPeriod } from "@/types/admin/analytics.type";
import { cn } from "@/lib/utils";

interface UserDashboardProps {
  name: string;
}

export default function UserDashboard({ name }: UserDashboardProps) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");

  // Fetch overview analytics for this user
  const {
    data: overview,
    error: overviewError,
    isLoading: isOverviewLoading,
    isValidating: isOverviewValidating,
    mutate: mutateOverview,
  } = useSWR(
    [`/analytics/user/overview`, period],
    () => analyticsApi.getUserOverview(period),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  // Fetch combined chronological activity for this user
  const {
    data: activityData,
    isLoading: isActivityLoading,
    mutate: mutateActivity,
  } = useSWR(
    [`/analytics/user/activity`, period],
    () => analyticsApi.getUserActivity(period),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  const handleRefresh = () => {
    mutateOverview();
    mutateActivity();
  };

  const getOrderStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "border-emerald-500/30 text-emerald-600 bg-emerald-50/50";
      case "shipped":
        return "border-indigo/30 text-indigo bg-indigo/5";
      case "processing":
      case "confirmed":
        return "border-blue/30 text-blue bg-blue/5";
      case "pending":
        return "border-amber-500/30 text-amber-600 bg-amber-50/50";
      case "cancelled":
        return "border-red-500/30 text-red-600 bg-red-50/50";
      default:
        return "border-muted text-muted-foreground";
    }
  };

  const getBookingStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "border-emerald-500/30 text-emerald-600 bg-emerald-50/50";
      case "in-progress":
      case "confirmed":
        return "border-blue/30 text-blue bg-blue/5";
      case "pending":
        return "border-amber-500/30 text-amber-600 bg-amber-50/50";
      case "cancelled":
      case "rejected":
        return "border-red-500/30 text-red-600 bg-red-50/50";
      default:
        return "border-muted text-muted-foreground";
    }
  };

  if (overviewError) {
    return (
      <div className="mx-auto w-full max-w-[1440px] p-6 sm:p-8 lg:p-10 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">
              Workspace
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {name}
            </h1>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>
        <DashboardError onRetry={handleRefresh} />
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
              Customer Account
            </span>
            {isOverviewValidating && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Updating...
              </span>
            )}
          </div>

          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Welcome back, {name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View your order history, service bookings, and account analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PeriodSelector
            value={period}
            onChange={setPeriod}
            disabled={isOverviewValidating}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isOverviewValidating}
            className="h-9 gap-1.5 rounded-xl border-border/70 text-xs"
            title="Refresh analytics data"
          >
            <RotateCcw
              className={cn("h-3.5 w-3.5", isOverviewValidating && "animate-spin")}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </section>

      {/* Customer Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Orders */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              My Orders
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 text-blue">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isOverviewLoading || !overview ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="font-display text-2xl font-bold tracking-tight">
                {overview.orders.totalOrders}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {overview ? (
                <>
                  <span className="font-medium text-foreground">
                    {overview.orders.activeOrders}
                  </span>{" "}
                  active •{" "}
                  <span className="font-medium text-foreground">
                    {overview.orders.deliveredOrders}
                  </span>{" "}
                  delivered
                </>
              ) : (
                "Loading orders..."
              )}
            </p>
            <Link
              href="/dashboard/my-orders"
              className="mt-2 inline-flex items-center text-[11px] font-medium text-blue hover:underline"
            >
              Order history <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Card 2: Bookings */}
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
            {isOverviewLoading || !overview ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="font-display text-2xl font-bold tracking-tight">
                {overview.bookings.totalBookings}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {overview ? (
                <>
                  <span className="font-medium text-foreground">
                    {overview.bookings.completedBookings}
                  </span>{" "}
                  completed services
                </>
              ) : (
                "Loading bookings..."
              )}
            </p>
            <Link
              href="/dashboard/my-services"
              className="mt-2 inline-flex items-center text-[11px] font-medium text-teal-600 hover:underline"
            >
              View bookings <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Card 3: Upcoming Site Visits */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Upcoming Site Visits
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <MapPin className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isOverviewLoading || !overview ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="font-display text-2xl font-bold tracking-tight">
                {overview.bookings.upcomingSiteVisits}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {overview ? (
                overview.bookings.upcomingSiteVisits > 0 ? (
                  <span className="text-amber-600 font-medium">
                    Scheduled site inspections
                  </span>
                ) : (
                  "No pending site visits"
                )
              ) : (
                "Loading..."
              )}
            </p>
            <Link
              href="/dashboard/my-services"
              className="mt-2 inline-flex items-center text-[11px] font-medium text-amber-600 hover:underline"
            >
              Schedule visit <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Card 4: Total Spending */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs hover:border-border transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Spending
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isOverviewLoading || !overview ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="font-display text-2xl font-bold tracking-tight text-foreground">
                ৳{overview.spending.totalOrderValue.toLocaleString()}
              </div>
            )}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {overview ? (
                <>
                  Paid amount:{" "}
                  <span className="font-semibold text-emerald-600">
                    ৳{overview.spending.paidOrderValue.toLocaleString()}
                  </span>
                </>
              ) : (
                "Loading spending..."
              )}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/80">
              Eligible product purchases
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Customer Spending & Order Activity Chart */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-xs">
        <CardHeader className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50">
          <div>
            <CardTitle className="text-base font-bold tracking-tight">
              My Spending Trends
            </CardTitle>
            <CardDescription className="text-xs">
              Order expenditure across the selected time period
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {isOverviewLoading || !overview ? (
            <div className="flex h-56 items-center justify-center">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ) : (
            <InteractiveAreaChart
              data={overview.timeline.map((item) => ({
                label: item.label,
                value: item.orderValue,
                secondaryValue: item.paidOrderValue,
                date: item.date,
              }))}
              valuePrefix="৳"
              primaryLabel="Order Value"
              secondaryLabel="Paid Amount"
              showSecondary={true}
              height={220}
            />
          )}

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue" />
              <span>Total Order Value</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Paid (Collected)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders & Bookings Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="rounded-2xl border-border/70 bg-background shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <div>
              <CardTitle className="text-base font-bold tracking-tight">
                My Recent Orders
              </CardTitle>
              <CardDescription className="text-xs">
                Your latest purchases and shipping status
              </CardDescription>
            </div>
            <Link
              href="/dashboard/my-orders"
              className="text-xs font-semibold text-blue hover:underline inline-flex items-center gap-1"
            >
              All orders <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>

          <CardContent className="pt-4">
            {isOverviewLoading || !overview ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : overview.recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-xl">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs font-medium text-foreground">
                  No orders yet
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                  Discover our protective coatings and industrial chemical solutions.
                </p>
                <Link
                  href="/products"
                  className="mt-3 text-xs font-semibold text-blue hover:underline inline-flex items-center gap-1"
                >
                  Browse products <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {overview.recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-xs"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          #{o.orderNumber}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          ({o.itemsCount} {o.itemsCount === 1 ? "item" : "items"})
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
                        className={cn(
                          "capitalize text-[10px] px-2 py-0.5 rounded-md",
                          getOrderStatusBadgeClass(o.status),
                        )}
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
                My Service Bookings
              </CardTitle>
              <CardDescription className="text-xs">
                Your service applications and site inspection schedules
              </CardDescription>
            </div>
            <Link
              href="/dashboard/my-services"
              className="text-xs font-semibold text-teal-600 hover:underline inline-flex items-center gap-1"
            >
              All bookings <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>

          <CardContent className="pt-4">
            {isOverviewLoading || !overview ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : overview.recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-xl">
                <CalendarCheck className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs font-medium text-foreground">
                  No service bookings yet
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                  Request an expert site inspection or customized environmental protection service.
                </p>
                <Link
                  href="/services"
                  className="mt-3 text-xs font-semibold text-teal-600 hover:underline inline-flex items-center gap-1"
                >
                  Explore services <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {overview.recentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-xs"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          #{b.bookingNumber}
                        </span>
                        <span className="text-muted-foreground truncate max-w-[140px]">
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
                        className={cn(
                          "capitalize text-[10px] px-2 py-0.5 rounded-md",
                          getBookingStatusBadgeClass(b.status),
                        )}
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

      {/* Chronological Account Activity Feed */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-xs">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-base font-bold tracking-tight">
            Account Activity History
          </CardTitle>
          <CardDescription className="text-xs">
            Combined chronological timeline of your orders and service requests
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {isActivityLoading || !activityData ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : activityData.activities.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-xs text-muted-foreground border border-dashed rounded-xl">
              No account activity during this period
            </div>
          ) : (
            <div className="relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60 space-y-6">
              {activityData.activities.map((act) => {
                const isOrder = act.type === "order";
                return (
                  <div key={act.id} className="relative flex items-start gap-4">
                    <div
                      className={cn(
                        "absolute -left-6 mt-1 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-background",
                        isOrder
                          ? "bg-blue text-white"
                          : "bg-teal-600 text-white",
                      )}
                    >
                      {isOrder ? (
                        <Package className="h-2.5 w-2.5" />
                      ) : (
                        <Calendar className="h-2.5 w-2.5" />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                      <div>
                        <p className="font-semibold text-foreground">
                          {act.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(act.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="font-semibold text-foreground">
                          ৳{act.amount.toLocaleString()}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize text-[10px] px-2 py-0.5 rounded-md",
                            isOrder
                              ? getOrderStatusBadgeClass(act.status)
                              : getBookingStatusBadgeClass(act.status),
                          )}
                        >
                          {act.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Shortcuts */}
      <section className="rounded-2xl border border-border/70 bg-muted/30 p-6">
        <h3 className="text-sm font-bold text-foreground">
          Explore Enviroshield
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Quick links to services, products, and support
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/products"
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3.5 transition-all hover:-translate-y-0.5 hover:border-blue hover:shadow-xs"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue/10 text-blue">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-foreground">Browse Store</p>
              <p className="text-[10px] text-muted-foreground truncate">
                Industrial coatings
              </p>
            </div>
          </Link>

          <Link
            href="/services"
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3.5 transition-all hover:-translate-y-0.5 hover:border-teal-600 hover:shadow-xs"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-foreground">Our Services</p>
              <p className="text-[10px] text-muted-foreground truncate">
                Consulting & application
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/my-orders"
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3.5 transition-all hover:-translate-y-0.5 hover:border-indigo hover:shadow-xs"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo/10 text-indigo">
              <Package className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-foreground">My Orders</p>
              <p className="text-[10px] text-muted-foreground truncate">
                Track shipments
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/my-services"
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3.5 transition-all hover:-translate-y-0.5 hover:border-amber-600 hover:shadow-xs"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-foreground">My Bookings</p>
              <p className="text-[10px] text-muted-foreground truncate">
                Schedule inspections
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
