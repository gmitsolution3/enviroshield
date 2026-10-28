"use client";

import {
  CalendarDays,
  Ban,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  MoreHorizontal,
  Search,
  Settings2,
  Users,
  X,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import BookingDetailsDialog from "@/components/dashboard/admin/service-bookings/BookingDetailsDialog";
import CancelBookingDialog from "@/components/dashboard/admin/service-bookings/CancelBookingDialog";
import UpdateBookingManagementModal from "@/components/dashboard/admin/service-bookings/UpdateBookingManagementModal";
import UpdateBookingPriceModal from "@/components/dashboard/admin/service-bookings/UpdateBookingPriceModal";
import UpdateBookingStatusModal from "@/components/dashboard/admin/service-bookings/UpdateBookingStatusModal";
import DashboardButton from "@/components/dashboard/DashboardButton";
import DashboardEmpty from "@/components/dashboard/DashboardEmpty";
import DashboardError from "@/components/dashboard/DashboardError";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  buildBookingListUrl,
  getBooking,
  getBookingApiError,
  listBookings,
} from "@/lib/api/bookings";
import type { Booking, BookingListQuery, BookingStatus } from "@/types/admin/booking.type";
import {
  formatBookingDate,
  formatBookingStatus,
  getBookingStatusClass,
} from "./bookingUtils";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const STATUS_OPTIONS: BookingStatus[] = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
  "rejected",
];
function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
}: {
  title: string;
  value?: number;
  description: string;
  icon: LucideIcon;
  tone: "blue" | "amber" | "teal" | "green";
}) {
  const toneStyles = {
    blue: "bg-indigo/[0.08] text-indigo",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    teal: "bg-teal/[0.08] text-teal",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  };

  return (
    <Card className="group rounded-2xl border-border/70 bg-background shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneStyles[tone]}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-display text-2xl font-bold tracking-tight">
          {value === undefined ? "—" : value.toLocaleString("en-BD")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge
      variant="outline"
      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getBookingStatusClass(status)}`}
    >
      {formatBookingStatus(status)}
    </Badge>
  );
}

function customerName(booking: Booking) {
  return typeof booking.userId === "object"
    ? booking.userId.name || "Name unavailable"
    : "Customer information unavailable";
}

function customerEmail(booking: Booking) {
  return typeof booking.userId === "object"
    ? booking.userId.email || "Email unavailable"
    : "Email unavailable";
}

function customerPhone(booking: Booking) {
  return typeof booking.userId === "object"
    ? booking.userId.phone || "Phone unavailable"
    : "Phone unavailable";
}

function serviceName(booking: Booking) {
  return typeof booking.serviceId === "object" && booking.serviceId
    ? booking.serviceId.name
    : "Service unavailable";
}

export default function ServiceBookingsDashboard() {
  const [bookingNumber, setBookingNumber] = useState("");
  const [debouncedBookingNumber, setDebouncedBookingNumber] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeAction, setActiveAction] = useState<
    "details" | "price" | "status" | "management" | "cancel" | null
  >(null);
  const { mutate: mutateCache } = useSWRConfig();

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedBookingNumber(bookingNumber.trim()),
      350,
    );
    return () => clearTimeout(timeout);
  }, [bookingNumber]);

  const listQuery = useMemo<BookingListQuery>(
    () => ({
      page,
      limit: Math.min(100, Math.max(1, pageSize)),
      ...(status === "all" ? {} : { status }),
      ...(debouncedBookingNumber
        ? { bookingNumber: debouncedBookingNumber }
        : {}),
    }),
    [debouncedBookingNumber, page, pageSize, status],
  );
  const listKey = useMemo(() => buildBookingListUrl(listQuery), [listQuery]);
  const {
    data: bookingList,
    error: listError,
    isLoading: listLoading,
    mutate: revalidateList,
  } = useSWR(listKey, () => listBookings(listQuery), {
    keepPreviousData: true,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    onSuccess: (result) => {
      if (page > Math.max(1, result.meta.totalPages)) {
        setPage(Math.max(1, result.meta.totalPages));
      }
    },
  });

  const unfilteredSummaryQuery = useMemo<BookingListQuery>(
    () => ({ page: 1, limit: 1 }),
    [],
  );
  const { data: totalSummary, error: totalSummaryError } = useSWR(
    buildBookingListUrl(unfilteredSummaryQuery),
    () => listBookings(unfilteredSummaryQuery),
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  const pendingQuery = useMemo<BookingListQuery>(
    () => ({ page: 1, limit: 1, status: "pending" }),
    [],
  );
  const confirmedQuery = useMemo<BookingListQuery>(
    () => ({ page: 1, limit: 1, status: "confirmed" }),
    [],
  );
  const completedQuery = useMemo<BookingListQuery>(
    () => ({ page: 1, limit: 1, status: "completed" }),
    [],
  );
  const { data: pendingSummary, error: pendingSummaryError } = useSWR(
    buildBookingListUrl(pendingQuery),
    () => listBookings(pendingQuery),
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  const { data: confirmedSummary, error: confirmedSummaryError } = useSWR(
    buildBookingListUrl(confirmedQuery),
    () => listBookings(confirmedQuery),
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  const { data: completedSummary, error: completedSummaryError } = useSWR(
    buildBookingListUrl(completedQuery),
    () => listBookings(completedQuery),
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );

  const bookings = bookingList?.data ?? [];
  const meta = bookingList?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const isSearchPending = bookingNumber.trim() !== debouncedBookingNumber;
  const hasActiveFilters = status !== "all" || Boolean(bookingNumber.trim());

  function updateBookingNumber(value: string) {
    setBookingNumber(value);
    setPage(1);
  }

  function updateStatus(value: string | null) {
    if (!value || value === "all") setStatus("all");
    else if (STATUS_OPTIONS.includes(value as BookingStatus)) {
      setStatus(value as BookingStatus);
    }
    setPage(1);
  }

  function clearFilters() {
    setBookingNumber("");
    setDebouncedBookingNumber("");
    setStatus("all");
    setPage(1);
  }

  function updatePageSize(value: string | null) {
    if (!value) return;
    const nextLimit = Number(value);
    if (!Number.isInteger(nextLimit) || nextLimit < 1 || nextLimit > 100) return;
    setPageSize(nextLimit);
    setPage(1);
  }

  function openAction(
    booking: Booking,
    action: "details" | "price" | "status" | "management" | "cancel",
  ) {
    setSelectedBooking(booking);
    setActiveAction(action);
  }

  function closeAction() {
    setActiveAction(null);
    setSelectedBooking(null);
  }

  function handleMutationSuccess(updatedBooking: Booking, message: string) {
    toast.success(message);
    void revalidateList(
      (current) =>
        current
          ? {
              ...current,
              data: current.data.map((booking) =>
                booking._id === updatedBooking._id ? updatedBooking : booking,
              ),
            }
          : current,
      { revalidate: true },
    );
    void mutateCache(
      (key) =>
        typeof key === "string" &&
        key.startsWith("/booking") &&
        key !== listKey,
    );
    closeAction();
  }

  function handleCancellationConflict() {
    void mutateCache(
      (key) => typeof key === "string" && key.startsWith("/booking"),
    );
    if (!selectedBooking) return;
    void getBooking(selectedBooking._id)
      .then((latestBooking) => {
        setSelectedBooking(latestBooking);
        if (
          latestBooking.status !== "pending" &&
          latestBooking.status !== "confirmed" &&
          latestBooking.status !== "in-progress"
        ) {
          closeAction();
        }
      })
      .catch((error: unknown) => {
        toast.error(getBookingApiError(error, "Could not refresh this booking."));
      });
  }

  if (listLoading && !bookingList) return <DashboardLoading />;
  if (listError && !bookingList) {
    return <DashboardError onRetry={() => void revalidateList()} />;
  }

  const summaryError =
    totalSummaryError ||
    pendingSummaryError ||
    confirmedSummaryError ||
    completedSummaryError;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 p-6 sm:p-8 lg:p-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo">
            Administration
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Service Booking
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Manage customer service booking requests and track their progress.
          </p>
          {meta && !isSearchPending && (
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {bookings.length} of {meta.total} bookings
            </p>
          )}
        </div>
        <Badge
          variant="outline"
          className="w-fit rounded-full border-blue/20 bg-blue/5 px-3 py-1.5 text-sm font-semibold text-blue"
        >
          {totalSummary?.meta.total ?? "—"} total bookings
        </Badge>
      </section>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Booking summaries"
      >
        <MetricCard
          title="Total Bookings"
          value={totalSummary?.meta.total}
          description={totalSummaryError ? "Could not load booking count." : "All bookings across every page."}
          icon={CalendarDays}
          tone="blue"
        />
        <MetricCard
          title="Pending Review"
          value={pendingSummary?.meta.total}
          description={pendingSummaryError ? "Could not load pending count." : "All bookings awaiting review."}
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          title="Confirmed"
          value={confirmedSummary?.meta.total}
          description={confirmedSummaryError ? "Could not load confirmed count." : "All confirmed bookings."}
          icon={Users}
          tone="teal"
        />
        <MetricCard
          title="Completed"
          value={completedSummary?.meta.total}
          description={completedSummaryError ? "Could not load completed count." : "All completed bookings."}
          icon={CheckCircle2}
          tone="green"
        />
      </section>

      {summaryError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
          <p role="status" className="text-sm text-muted-foreground">
            Some summary counts are unavailable. The booking list is still usable.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              void mutateCache(
                (key) => typeof key === "string" && key.startsWith("/booking"),
              )
            }
          >
            Retry summary counts
          </Button>
        </div>
      )}

      <section className="space-y-4" aria-label="Booking list">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={bookingNumber}
              onChange={(event) => updateBookingNumber(event.target.value)}
              placeholder="Enter exact booking number..."
              aria-label="Filter by exact booking number"
              className="h-10 rounded-full border-blue/20 bg-background pl-9 pr-10 shadow-sm focus-visible:ring-blue/20"
            />
            {bookingNumber && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground"
                onClick={() => updateBookingNumber("")}
                aria-label="Clear booking number filter"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span className="text-sm font-medium text-muted-foreground">
              Status:
            </span>
            <Select value={status} onValueChange={updateStatus}>
              <SelectTrigger className="h-9 w-[170px] rounded-full border-blue/30 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 focus:ring-2 focus:ring-blue/10">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {formatBookingStatus(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <DashboardButton
                variant="outline"
                onClick={clearFilters}
                className="h-9 rounded-full border-blue/60 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
              >
                Clear filters
              </DashboardButton>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Booking-number filtering uses an exact match. Search the booking number (for example, ESB-20261028-A1B2C3D4).
        </p>
        {isSearchPending && (
          <p role="status" className="text-xs text-muted-foreground">
            Searching booking number…
          </p>
        )}

        {listError && bookingList && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">
            <span>{getBookingApiError(listError, "Could not refresh bookings.")}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void revalidateList()}>
              Retry
            </Button>
          </div>
        )}

        {bookings.length === 0 ? (
          <DashboardEmpty
            title="No bookings found"
            description={hasActiveFilters ? "Try another booking number or status filter." : "There are no service bookings yet."}
            icon={<CalendarDays className="h-6 w-6 text-muted-foreground" />}
          />
        ) : (
          <Card className="overflow-hidden rounded-2xl border-border/70 p-0 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px]">
                <thead className="border-b bg-muted/50">
                  <tr>
                    {["Booking ID", "Customer", "Contact Information", "Service", "Booking Status", "Date Submitted", "Actions"].map((heading) => (
                      <th key={heading} scope="col" className="px-5 py-3 text-left text-sm font-medium text-muted-foreground">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b transition-colors last:border-0 hover:bg-muted/30">
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-navy dark:text-foreground">
                        {booking.bookingNumber}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-foreground">
                        {customerName(booking)}
                      </td>
                      <td className="px-5 py-4">
                        {customerEmail(booking) !== "Email unavailable" ? (
                          <a href={`mailto:${customerEmail(booking)}`} className="block max-w-[220px] truncate text-sm text-muted-foreground hover:text-blue">
                            {customerEmail(booking)}
                          </a>
                        ) : (
                          <span className="block text-sm text-muted-foreground">Email unavailable</span>
                        )}
                        {customerPhone(booking) !== "Phone unavailable" ? (
                          <a href={`tel:${customerPhone(booking)}`} className="mt-1 block whitespace-nowrap text-xs text-muted-foreground hover:text-blue">
                            {customerPhone(booking)}
                          </a>
                        ) : (
                          <span className="mt-1 block text-xs text-muted-foreground">Phone unavailable</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-foreground">{serviceName(booking)}</td>
                      <td className="px-5 py-4"><BookingStatusBadge status={booking.status} /></td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">{formatBookingDate(booking.createdAt)}</td>
                      <td className="px-5 py-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-full border-blue/30 bg-muted/30 px-3 text-navy shadow-sm hover:bg-blue/10 hover:text-blue"
                          onClick={() => openAction(booking, "details")}
                          aria-label={`View details for booking ${booking.bookingNumber}`}
                        >
                          <Eye className="mr-1.5 h-4 w-4" aria-hidden="true" />
                          View Details
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <DashboardButton
                              variant="outline"
                              className="ml-2 h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
                              icon={<MoreHorizontal className="h-4 w-4" />}
                              ariaLabel={`Actions for booking ${booking.bookingNumber}`}
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Booking actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openAction(booking, "price")}
                              >
                                <DollarSign className="mr-2 h-4 w-4" />
                                Update Price
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openAction(booking, "status")}
                              >
                                <BadgeCheck className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openAction(booking, "management")}
                              >
                                <Settings2 className="mr-2 h-4 w-4" />
                                Manage Site Visit / Notes
                              </DropdownMenuItem>
                              {(booking.status === "pending" ||
                                booking.status === "confirmed" ||
                                booking.status === "in-progress") && (
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                  onClick={() => openAction(booking, "cancel")}
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {meta && meta.total > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select value={String(pageSize)} onValueChange={updatePageSize}>
                <SelectTrigger className="h-8 w-20 rounded-full border-blue/30 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 focus:ring-2 focus:ring-blue/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <DashboardButton
                variant="outline"
                disabled={page <= 1 || listLoading || isSearchPending}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                icon={<ChevronLeft className="h-4 w-4" />}
                className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
                ariaLabel="Previous page"
              />
              <span className="text-sm text-muted-foreground" aria-live="polite">
                Page {meta.page} of {totalPages}
              </span>
              <DashboardButton
                variant="outline"
                disabled={page >= totalPages || listLoading || isSearchPending}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                icon={<ChevronRight className="h-4 w-4" />}
                className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
                ariaLabel="Next page"
              />
            </div>
          </div>
        )}
      </section>

      {selectedBooking && activeAction === "details" && (
        <BookingDetailsDialog
          key={`details-${selectedBooking._id}`}
          bookingId={selectedBooking._id}
          open
          onClose={closeAction}
        />
      )}
      {selectedBooking && activeAction === "price" && (
        <UpdateBookingPriceModal
          key={`price-${selectedBooking._id}-${selectedBooking.updatedAt}`}
          booking={selectedBooking}
          open
          onClose={closeAction}
          onSuccess={handleMutationSuccess}
        />
      )}
      {selectedBooking && activeAction === "status" && (
        <UpdateBookingStatusModal
          key={`status-${selectedBooking._id}-${selectedBooking.updatedAt}`}
          booking={selectedBooking}
          open
          onClose={closeAction}
          onSuccess={handleMutationSuccess}
          onRequestCancel={() => setActiveAction("cancel")}
        />
      )}
      {selectedBooking && activeAction === "management" && (
        <UpdateBookingManagementModal
          key={`management-${selectedBooking._id}-${selectedBooking.updatedAt}`}
          booking={selectedBooking}
          open
          onClose={closeAction}
          onSuccess={handleMutationSuccess}
        />
      )}
      {selectedBooking && activeAction === "cancel" && (
        <CancelBookingDialog
          key={`cancel-${selectedBooking._id}-${selectedBooking.updatedAt}`}
          booking={selectedBooking}
          open
          onClose={closeAction}
          onSuccess={handleMutationSuccess}
          onConflict={handleCancellationConflict}
        />
      )}
    </div>
  );
}
