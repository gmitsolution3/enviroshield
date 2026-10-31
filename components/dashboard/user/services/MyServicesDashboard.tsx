"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Eye,
  MapPin,
  PackageCheck,
  Search,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  formatBookingAmount,
  formatBookingDate,
  formatBookingStatus,
} from "@/components/dashboard/admin/service-bookings/bookingUtils";
import DashboardButton from "@/components/dashboard/DashboardButton";
import DashboardError from "@/components/dashboard/DashboardError";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
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
import type {
  Booking,
  BookingListResponse,
  BookingStatus,
} from "@/types/booking.type";
import {
  UserDashboardMetric,
  UserStatusBadge,
} from "../orders/UserDashboardUI";
import CancelMyBookingDialog from "./CancelMyBookingDialog";
import MyBookingDetailsDialog from "./MyBookingDetailsDialog";

type BookingStatusFilter = "all" | BookingStatus;
const PAGE_SIZE = 10;
const CANCELLABLE_STATUSES: BookingStatus[] = ["pending"];
const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
  "rejected",
];

export default function MyServicesDashboard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<BookingStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const endpoint = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    if (status !== "all") params.set("status", status);
    if (debouncedSearch) {
      params.set("bookingNumber", debouncedSearch);
    }
    return `/booking/mine?${params.toString()}`;
  }, [debouncedSearch, page, status]);

  const { data, isLoading, isError, refetch } = useFetch<BookingListResponse>(
    endpoint,
    { keepPreviousData: true },
  );

  const bookings = data?.data ?? [];
  const meta = data?.meta;
  const hasActiveFilters = Boolean(search.trim()) || status !== "all";
  const isSearchPending = search.trim() !== debouncedSearch;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);

  const hasCompleteUnfilteredHistory =
    !hasActiveFilters &&
    meta !== undefined &&
    meta.total === bookings.length;

  const activeBookings = hasCompleteUnfilteredHistory
    ? bookings.filter((b) =>
        ["pending", "confirmed", "in-progress"].includes(b.status),
      ).length
    : null;

  const completedBookings = hasCompleteUnfilteredHistory
    ? bookings.filter((b) => b.status === "completed").length
    : null;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatus(value: string | null) {
    if (
      value === "all" ||
      value === "pending" ||
      value === "confirmed" ||
      value === "in-progress" ||
      value === "completed" ||
      value === "cancelled" ||
      value === "rejected"
    ) {
      setStatus(value);
      setPage(1);
    }
  }

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setStatus("all");
    setPage(1);
  }

  if (isLoading && !data) return <DashboardLoading />;
  if (isError && !data)
    return <DashboardError onRetry={() => void refetch()} />;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 p-6 sm:p-8 lg:p-10">
      {/* Page Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo">
            Your account
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Service Bookings
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Review your service bookings, check inspection progress, and
            manage your scheduled services.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit rounded-full border-blue/20 bg-blue/5 px-3 py-1.5 text-sm font-semibold text-blue"
        >
          {meta?.total ?? 0}{" "}
          {hasActiveFilters ? "matching bookings" : "bookings total"}
        </Badge>
      </section>

      {/* Metrics Row */}
      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Booking summaries"
      >
        <UserDashboardMetric
          title="Total Bookings"
          value={String(meta?.total ?? 0)}
          description={
            hasActiveFilters
              ? "Matches the active filters"
              : "All service bookings on your account"
          }
          icon={ClipboardList}
          tone="blue"
        />
        <UserDashboardMetric
          title="Active Bookings"
          value={activeBookings === null ? "—" : String(activeBookings)}
          description={
            activeBookings === null
              ? "Unavailable for filtered or paginated history"
              : "In review, confirmed, or in progress"
          }
          icon={Wrench}
          tone="amber"
        />
        <UserDashboardMetric
          title="Completed Bookings"
          value={completedBookings === null ? "—" : String(completedBookings)}
          description={
            completedBookings === null
              ? "Unavailable for filtered or paginated history"
              : "Successfully serviced"
          }
          icon={PackageCheck}
          tone="teal"
        />
      </section>

      {/* Main Card */}
      <Card className="overflow-hidden rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
              <Wrench className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Booking history
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse and filter your service bookings.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5 sm:p-6">
          {/* Filters Bar */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label
                htmlFor="bookings-search"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Search Bookings
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="bookings-search"
                  value={search}
                  onChange={(event) => updateSearch(event.target.value)}
                  placeholder="Search by booking number..."
                  className="h-9 rounded-full border-blue/30 bg-muted/30 pl-9 text-xs shadow-sm transition-all duration-200 focus:border-blue/40 focus:ring-2 focus:ring-blue/10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="booking-status-filter"
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
              >
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                Booking Status
              </label>
              <Select value={status} onValueChange={updateStatus}>
                <SelectTrigger
                  id="booking-status-filter"
                  className="h-9 w-full rounded-full border-blue/30 bg-muted/30 px-3 text-xs font-semibold text-navy"
                >
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {BOOKING_STATUSES.map((bookingStatus) => (
                    <SelectItem key={bookingStatus} value={bookingStatus}>
                      {formatBookingStatus(bookingStatus)}
                    </SelectItem>
                  ))}
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

          {/* Loading Skeleton */}
          {isSearchPending ? (
            <div
              className="space-y-4 rounded-2xl border border-border/70 p-5"
              aria-label="Loading matching bookings"
              aria-busy="true"
            >
              {[1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="h-16 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ClipboardList className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-navy">
                {hasActiveFilters
                  ? "No matching bookings"
                  : "No service bookings found"}
              </h2>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {hasActiveFilters
                  ? "Try another booking number or status filter."
                  : "Bookings you submit will appear here with their latest status."}
              </p>
            </div>
          ) : (
            /* Unified Bookings List */
            <div className="overflow-hidden rounded-2xl border border-border/70">
              {bookings.map((booking, index) => {
                const service =
                  typeof booking.serviceId === "object"
                    ? booking.serviceId
                    : null;
                const canCancel = CANCELLABLE_STATUSES.includes(booking.status);

                return (
                  <article
                    key={booking._id}
                    className={`p-5 transition-colors hover:bg-muted/20 sm:p-6 ${
                      index > 0 ? "border-t border-border/60" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      {/* Left: Info & Details */}
                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-display text-base font-bold tracking-tight text-navy">
                            {booking.bookingNumber}
                          </h2>
                          <UserStatusBadge
                            status={formatBookingStatus(booking.status)}
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {/* Service Info */}
                          <div className="flex min-w-0 items-start gap-2.5">
                            <Wrench
                              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-muted-foreground">
                                Service
                              </p>
                              <p className="mt-1 truncate text-sm font-medium leading-relaxed text-foreground">
                                {service?.name || "Service info unavailable"}
                              </p>
                              {booking.project?.message && (
                                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                  {booking.project.message}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Date & Site Visit */}
                          <div className="flex items-start gap-2.5">
                            <CalendarDays
                              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                Booking date
                              </p>
                              <p className="mt-1 text-sm font-medium text-foreground">
                                {formatBookingDate(booking.createdAt)}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock3 className="h-3 w-3 shrink-0" />
                                {booking.isSiteVisit
                                  ? `Site visit: ${
                                      booking.siteVisitDate
                                        ? formatBookingDate(
                                            booking.siteVisitDate,
                                          )
                                        : "Requested"
                                    }`
                                  : "No site visit requested"}
                              </p>
                            </div>
                          </div>

                          {/* Location & Area */}
                          <div className="flex min-w-0 items-start gap-2.5 sm:col-span-2 xl:col-span-1">
                            <MapPin
                              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-muted-foreground">
                                Project location
                              </p>
                              <p className="mt-1 truncate text-sm font-medium text-foreground">
                                {booking.project?.location ||
                                  "Location not provided"}
                              </p>
                              {booking.project?.areaSize != null && (
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  Area: {booking.project.areaSize}{" "}
                                  {booking.project.areaUnit || "sq ft"}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Pricing & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 lg:min-w-[200px] lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                        <div className="space-y-1 lg:text-right">
                          <p className="text-xs font-medium text-muted-foreground">
                            {booking.finalPrice != null
                              ? "Final price"
                              : "Estimated starting"}
                          </p>
                          <p className="font-display text-xl font-bold text-navy">
                            {booking.finalPrice != null
                              ? `BDT ${formatBookingAmount(booking.finalPrice)}`
                              : service?.price != null
                                ? `From BDT ${formatBookingAmount(
                                    service.price,
                                  )}`
                                : "Quote Pending"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => setSelectedBooking(booking)}
                            aria-label={`View details for booking ${booking.bookingNumber}`}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            View details
                          </Button>

                          {canCancel && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="rounded-full"
                              onClick={() => setBookingToCancel(booking)}
                              aria-label={`Cancel booking ${booking.bookingNumber}`}
                            >
                              <XCircle
                                className="mr-1.5 h-4 w-4"
                                aria-hidden="true"
                              />
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination Bar */}
          {bookings.length > 0 && meta && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <span className="text-sm font-medium text-foreground">
                  {meta.limit}
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <DashboardButton
                  variant="outline"
                  disabled={meta.page <= 1 || isLoading}
                  onClick={() =>
                    setPage((currentPage) => Math.max(1, currentPage - 1))
                  }
                  icon={<ChevronLeft className="h-4 w-4" />}
                  className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
                  ariaLabel="Previous page"
                />
                <span
                  className="text-sm text-muted-foreground"
                  aria-live="polite"
                >
                  Page {meta.page} of {totalPages}
                </span>
                <DashboardButton
                  variant="outline"
                  disabled={meta.page >= totalPages || isLoading}
                  onClick={() =>
                    setPage((currentPage) =>
                      Math.min(totalPages, currentPage + 1),
                    )
                  }
                  icon={<ChevronRight className="h-4 w-4" />}
                  className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
                  ariaLabel="Next page"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals / Dialogs */}
      <MyBookingDetailsDialog
        booking={selectedBooking}
        open={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
      />
      <CancelMyBookingDialog
        booking={bookingToCancel}
        open={Boolean(bookingToCancel)}
        listKey={endpoint}
        onClose={() => setBookingToCancel(null)}
        onSuccess={() => setBookingToCancel(null)}
      />
    </div>
  );
}
