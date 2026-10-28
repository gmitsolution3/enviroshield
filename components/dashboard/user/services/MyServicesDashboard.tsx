"use client";

import {
  CalendarDays,
  ClipboardList,
  Clock3,
  Eye,
  MapPin,
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
import DashboardError from "@/components/dashboard/DashboardError";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
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
import {
  buildMyBookingListUrl,
  getBookingApiError,
} from "@/lib/api/bookings";
import type {
  Booking,
  BookingListResponse,
  BookingStatus,
} from "@/types/admin/booking.type";
import {
  UserDashboardMetric,
  UserListPagination,
  UserStatusBadge,
} from "../orders/UserDashboardUI";
import CancelMyBookingDialog from "./CancelMyBookingDialog";
import MyBookingDetailsDialog from "./MyBookingDetailsDialog";

const PAGE_SIZE = 10;
const CANCELLABLE_STATUSES: Booking["status"][] = ["pending"];
const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
  "rejected",
];

function isBookingStatus(value: string): value is BookingStatus {
  return BOOKING_STATUSES.some(
    (bookingStatus) => bookingStatus === value,
  );
}

export default function MyServicesDashboard() {
  const [search, setSearch] = useState("");
  const [debouncedBookingNumber, setDebouncedBookingNumber] =
    useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState<
    string | null
  >(null);
  const [bookingToCancel, setBookingToCancel] =
    useState<Booking | null>(null);
  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedBookingNumber(search.trim()),
      350,
    );
    return () => clearTimeout(timeout);
  }, [search]);
  const endpoint = useMemo(
    () =>
      buildMyBookingListUrl({
        page,
        limit: PAGE_SIZE,
        status: status === "all" ? undefined : status,
        bookingNumber: debouncedBookingNumber || undefined,
      }),
    [debouncedBookingNumber, page, status],
  );
  const { data, isLoading, isError, refetch } =
    useFetch<BookingListResponse>(endpoint, {
      keepPreviousData: true,
    });
  const bookings = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const hasActiveFilters = Boolean(search.trim()) || status !== "all";
  const isSearchPending = search.trim() !== debouncedBookingNumber;
  const isRefreshing = isLoading && Boolean(data);

  function clearFilters() {
    setSearch("");
    setDebouncedBookingNumber("");
    setStatus("all");
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
            My Service Bookings
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Review your service bookings, see their details, and
            manage eligible cancellations.
          </p>
        </div>
      </section>

      <section
        className="grid gap-4 sm:max-w-sm"
        aria-label="Booking summary"
      >
        <UserDashboardMetric
          title={
            hasActiveFilters ? "Matching Bookings" : "Total Bookings"
          }
          value={String(meta?.total ?? 0)}
          description={
            hasActiveFilters
              ? "Matches the active filters"
              : "All service bookings on your account"
          }
          icon={ClipboardList}
          tone="blue"
        />
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
              <Wrench className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Service bookings
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Your service requests and their latest status.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_210px]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search booking number..."
                aria-label="Filter bookings by booking number"
                className="h-11 rounded-xl pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                if (
                  value === "all" ||
                  (value !== null && isBookingStatus(value))
                ) {
                  setStatus(value);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger
                className="h-11 w-full rounded-xl"
                aria-label="Filter bookings by status"
              >
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {BOOKING_STATUSES.map((bookingStatus) => (
                  <SelectItem
                    key={bookingStatus}
                    value={bookingStatus}
                  >
                    {formatBookingStatus(bookingStatus)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          {(isSearchPending || isRefreshing) && (
            <div
              className="space-y-4 rounded-2xl border border-border/70 p-5"
              aria-label="Loading matching bookings"
              aria-busy="true"
            >
              {[1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="h-20 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          )}
          {isError && data && !isSearchPending && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm"
            >
              <span>
                {getBookingApiError(
                  isError,
                  "Could not refresh your bookings.",
                )}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
              >
                Retry
              </Button>
            </div>
          )}
          {!isSearchPending &&
          !isRefreshing &&
          bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-5 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ClipboardList
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-navy">
                {hasActiveFilters
                  ? "No matching bookings"
                  : "No service bookings found"}
              </h2>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {hasActiveFilters
                  ? "Try a different booking number or status."
                  : "Bookings you submit will appear here with their latest status."}
              </p>
            </div>
          ) : (
            !isSearchPending &&
            !isRefreshing && (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const service =
                    typeof booking.serviceId === "object"
                      ? booking.serviceId
                      : null;
                  const canCancel = CANCELLABLE_STATUSES.includes(
                    booking.status,
                  );
                  return (
                    <article
                      key={booking._id}
                      className="rounded-2xl border border-border/70 p-5 transition-colors hover:border-blue/25 hover:bg-muted/10 sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold tracking-wide text-muted-foreground">
                              {booking.bookingNumber}
                            </span>
                            <UserStatusBadge
                              status={formatBookingStatus(
                                booking.status,
                              )}
                            />
                          </div>
                          <h2 className="mt-3 font-display text-lg font-bold tracking-tight text-navy">
                            {service?.name ||
                              "Service information unavailable"}
                          </h2>
                          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                            {booking.project?.message ||
                              "No project message provided."}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() =>
                              setSelectedBookingId(booking._id)
                            }
                            aria-label={`View details for booking ${booking.bookingNumber}`}
                          >
                            <Eye
                              className="mr-1.5 h-4 w-4"
                              aria-hidden="true"
                            />
                            View details
                          </Button>
                          {canCancel && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="rounded-full"
                              onClick={() =>
                                setBookingToCancel(booking)
                              }
                              aria-label={`Cancel booking ${booking.bookingNumber}`}
                            >
                              <XCircle
                                className="mr-1.5 h-4 w-4"
                                aria-hidden="true"
                              />
                              Cancel booking
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-5 flex flex-col gap-3 border-t border-border/60 pt-4 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarDays
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            Submitted{" "}
                            <span className="font-medium text-foreground">
                              {formatBookingDate(booking.createdAt)}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {booking.project?.location ||
                              "Location not provided"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock3
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            {booking.isSiteVisit
                              ? `Site visit ${booking.siteVisitDate ? formatBookingDate(booking.siteVisitDate) : "requested"}`
                              : "No site visit"}
                          </span>
                        </div>
                        {booking.finalPrice != null && (
                          <p className="font-semibold text-foreground">
                            Final price:{" "}
                            {formatBookingAmount(booking.finalPrice)}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )
          )}
        </CardContent>
        {bookings.length > 0 &&
          meta &&
          !isSearchPending &&
          !isRefreshing && (
            <UserListPagination
              page={meta.page}
              totalPages={totalPages}
              start={(meta.page - 1) * meta.limit + 1}
              end={Math.min(meta.page * meta.limit, meta.total)}
              total={meta.total}
              onPageChange={(nextPage) =>
                setPage(Math.max(1, Math.min(totalPages, nextPage)))
              }
            />
          )}
      </Card>

      <MyBookingDetailsDialog
        bookingId={selectedBookingId}
        open={Boolean(selectedBookingId)}
        onClose={() => setSelectedBookingId(null)}
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
