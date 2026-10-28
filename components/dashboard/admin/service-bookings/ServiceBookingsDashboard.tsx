"use client";

import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  BadgeCheck,
  Ban,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  DollarSign,
  Eye,
  MoreHorizontal,
  Search,
  Settings2,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/types/admin/booking.type";
import {
  formatBookingAmount,
  formatBookingDate,
  formatBookingStatus,
  getBookingStatusClass,
} from "./bookingUtils";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const tableFeaturesConfig = tableFeatures({});
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
    amber:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    teal: "bg-teal/[0.08] text-teal",
    green:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
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
        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>
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

type BookingAction =
  | "details"
  | "price"
  | "status"
  | "management"
  | "cancel";

function BookingActions({
  booking,
  onAction,
}: {
  booking: Booking;
  onAction: (booking: Booking, action: BookingAction) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <DashboardButton
        variant="outline"
        className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
        icon={<Eye className="h-4 w-4" />}
        onClick={() => onAction(booking, "details")}
        ariaLabel={`View details for booking ${booking.bookingNumber}`}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DashboardButton
            variant="outline"
            className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
            icon={<MoreHorizontal className="h-4 w-4" />}
            ariaLabel={`Actions for booking ${booking.bookingNumber}`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onAction(booking, "price")}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Update Price
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onAction(booking, "status")}
            >
              <BadgeCheck className="mr-2 h-4 w-4" />
              Update Status
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onAction(booking, "management")}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Manage Site Visit / Notes
            </DropdownMenuItem>
            {(booking.status === "pending" ||
              booking.status === "confirmed" ||
              booking.status === "in-progress") && (
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => onAction(booking, "cancel")}
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancel Booking
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function ServiceBookingsDashboard() {
  const [bookingNumber, setBookingNumber] = useState("");
  const [debouncedBookingNumber, setDebouncedBookingNumber] =
    useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);
  const [activeAction, setActiveAction] = useState<
    "details" | "price" | "status" | "management" | "cancel" | null
  >(null);
  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedBookingNumber(bookingNumber.trim()),
      350,
    );
    return () => clearTimeout(timeout);
  }, [bookingNumber]);

  const endpoint = useMemo(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (debouncedBookingNumber) {
      params.set("bookingNumber", debouncedBookingNumber);
    }
    params.set("page", String(page));
    params.set("limit", String(Math.min(100, Math.max(1, pageSize))));
    return `/booking?${params.toString()}`;
  }, [debouncedBookingNumber, page, pageSize, status]);
  const summaryEndpoints = useMemo(() => {
    const totalParams = new URLSearchParams({
      page: "1",
      limit: "1",
    });
    const pendingParams = new URLSearchParams({
      page: "1",
      limit: "1",
      status: "pending",
    });
    const confirmedParams = new URLSearchParams({
      page: "1",
      limit: "1",
      status: "confirmed",
    });
    const completedParams = new URLSearchParams({
      page: "1",
      limit: "1",
      status: "completed",
    });
    return {
      total: `/booking?${totalParams.toString()}`,
      pending: `/booking?${pendingParams.toString()}`,
      confirmed: `/booking?${confirmedParams.toString()}`,
      completed: `/booking?${completedParams.toString()}`,
    };
  }, []);
  const {
    data: bookingList,
    isLoading: listLoading,
    isError: listError,
    refetch: revalidateList,
  } = useFetch<BookingListResponse>(endpoint);
  const {
    data: totalSummary,
    isError: totalSummaryError,
    refetch: refetchTotalSummary,
  } = useFetch<BookingListResponse>(summaryEndpoints.total);
  const {
    data: pendingSummary,
    isError: pendingSummaryError,
    refetch: refetchPendingSummary,
  } = useFetch<BookingListResponse>(summaryEndpoints.pending);
  const {
    data: confirmedSummary,
    isError: confirmedSummaryError,
    refetch: refetchConfirmedSummary,
  } = useFetch<BookingListResponse>(summaryEndpoints.confirmed);
  const {
    data: completedSummary,
    isError: completedSummaryError,
    refetch: refetchCompletedSummary,
  } = useFetch<BookingListResponse>(summaryEndpoints.completed);
  const revalidateKeys = [
    endpoint,
    summaryEndpoints.total,
    summaryEndpoints.pending,
    summaryEndpoints.confirmed,
    summaryEndpoints.completed,
  ];

  const bookings = bookingList?.data ?? [];
  const meta = bookingList?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const isSearchPending =
    bookingNumber.trim() !== debouncedBookingNumber;
  const hasActiveFilters =
    status !== "all" || Boolean(bookingNumber.trim());

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
    if (
      !Number.isInteger(nextLimit) ||
      nextLimit < 1 ||
      nextLimit > 100
    )
      return;
    setPageSize(nextLimit);
    setPage(1);
  }

  function openAction(booking: Booking, action: BookingAction) {
    setSelectedBooking(booking);
    setActiveAction(action);
  }

  function closeAction() {
    setActiveAction(null);
    setSelectedBooking(null);
  }

  function handleMutationSuccess(
    _updatedBooking: Booking,
    message: string,
  ) {
    toast.success(message);
    closeAction();
  }

  function refetchSummaries() {
    void refetchTotalSummary();
    void refetchPendingSummary();
    void refetchConfirmedSummary();
    void refetchCompletedSummary();
  }

  function handleCancellationConflict() {
    if (!selectedBooking) return;
    void revalidateList()
      .then((latestList) => {
        refetchSummaries();
        const latestBooking = latestList?.data?.find(
          (booking) => booking._id === selectedBooking._id,
        );
        if (!latestBooking) {
          closeAction();
          return;
        }
        setSelectedBooking(latestBooking);
        if (
          latestBooking.status !== "pending" &&
          latestBooking.status !== "confirmed" &&
          latestBooking.status !== "in-progress"
        ) {
          closeAction();
        }
      })
      .catch(() => {
        toast.error(
          "Could not refresh this booking. Please try again.",
        );
      });
  }

  const columns: ColumnDef<typeof tableFeaturesConfig, Booking>[] = [
    {
      accessorKey: "bookingNumber",
      header: "Booking ID",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-semibold text-navy dark:text-foreground">
          {row.original.bookingNumber}
        </span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground">
          {customerName(row.original)}
        </span>
      ),
    },
    {
      id: "service",
      header: "Service",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground">
          {serviceName(row.original)}
        </span>
      ),
    },
    {
      id: "siteVisit",
      header: "Site Visit",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {booking.isSiteVisit
              ? booking.siteVisitDate
                ? formatBookingDate(booking.siteVisitDate)
                : "Requested"
              : "Not requested"}
          </span>
        );
      },
    },
    {
      accessorKey: "finalPrice",
      header: "Final Price",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-foreground">
          {formatBookingAmount(row.original.finalPrice)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Booking Status",
      cell: ({ row }) => (
        <BookingStatusBadge status={row.original.status} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date Submitted",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatBookingDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <BookingActions
          booking={row.original}
          onAction={openAction}
        />
      ),
    },
  ];
  const table = useTable({
    features: tableFeaturesConfig,
    columns,
    data: bookings,
  });

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
            Manage customer service booking requests and track their
            progress.
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
          description={
            totalSummaryError
              ? "Could not load booking count."
              : "All bookings across every page."
          }
          icon={CalendarDays}
          tone="blue"
        />
        <MetricCard
          title="Pending Review"
          value={pendingSummary?.meta.total}
          description={
            pendingSummaryError
              ? "Could not load pending count."
              : "All bookings awaiting review."
          }
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          title="Confirmed"
          value={confirmedSummary?.meta.total}
          description={
            confirmedSummaryError
              ? "Could not load confirmed count."
              : "All confirmed bookings."
          }
          icon={Users}
          tone="teal"
        />
        <MetricCard
          title="Completed"
          value={completedSummary?.meta.total}
          description={
            completedSummaryError
              ? "Could not load completed count."
              : "All completed bookings."
          }
          icon={CheckCircle2}
          tone="green"
        />
      </section>

      {summaryError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
          <p role="status" className="text-sm text-muted-foreground">
            Some summary counts are unavailable. The booking list is
            still usable.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={refetchSummaries}
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
              onChange={(event) =>
                updateBookingNumber(event.target.value)
              }
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
          Booking-number filtering uses an exact match. Search the
          booking number (for example, ESB-20261028-A1B2C3D4).
        </p>
        {isSearchPending && (
          <p role="status" className="text-xs text-muted-foreground">
            Searching booking number…
          </p>
        )}

        {listError && bookingList && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm"
          >
            <span>Could not refresh bookings.</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void revalidateList()}
            >
              Retry
            </Button>
          </div>
        )}

        {bookings.length === 0 ? (
          <DashboardEmpty
            title="No bookings found"
            description={
              hasActiveFilters
                ? "Try another booking number or status filter."
                : "There are no service bookings yet."
            }
            icon={
              <CalendarDays className="h-6 w-6 text-muted-foreground" />
            }
          />
        ) : (
          <>
            <Card className="hidden overflow-hidden rounded-2xl border-border/70 p-0 shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1320px]">
                  <thead className="border-b bg-muted/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            scope="col"
                            className="px-5 py-3 text-left text-sm font-medium text-muted-foreground"
                          >
                            {header.isPlaceholder ? null : (
                              <table.FlexRender header={header} />
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b transition-colors last:border-0 hover:bg-muted/30"
                      >
                        {row.getAllCells().map((cell) => (
                          <td key={cell.id} className="px-5 py-4">
                            <table.FlexRender cell={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <div className="space-y-3 md:hidden">
              {bookings.map((booking) => (
                <article
                  key={booking._id}
                  className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-semibold tracking-wide text-muted-foreground">
                        {booking.bookingNumber}
                      </p>
                      <h2 className="mt-1 truncate font-semibold text-navy dark:text-foreground">
                        {customerName(booking)}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {serviceName(booking)}
                      </p>
                    </div>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/60 pt-4 text-sm">
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">
                        Location
                      </dt>
                      <dd className="mt-1 truncate font-medium text-foreground">
                        {booking.project?.location || "Unavailable"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Area
                      </dt>
                      <dd className="mt-1 font-medium text-foreground">
                        {booking.project?.areaSize != null
                          ? `${booking.project.areaSize}${booking.project.areaUnit ? ` ${booking.project.areaUnit}` : ""}`
                          : "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Site visit
                      </dt>
                      <dd className="mt-1 font-medium text-foreground">
                        {booking.isSiteVisit
                          ? booking.siteVisitDate
                            ? formatBookingDate(booking.siteVisitDate)
                            : "Requested"
                          : "Not requested"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Final price
                      </dt>
                      <dd className="mt-1 font-medium text-foreground">
                        {formatBookingAmount(booking.finalPrice)}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex justify-end border-t border-border/60 pt-3">
                    <BookingActions
                      booking={booking}
                      onAction={openAction}
                    />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {meta && meta.total > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={updatePageSize}
              >
                <SelectTrigger className="h-8 w-20 rounded-full border-blue/30 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/40 hover:bg-blue/5 focus:ring-2 focus:ring-blue/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <DashboardButton
                variant="outline"
                disabled={page <= 1 || listLoading || isSearchPending}
                onClick={() =>
                  setPage((value) => Math.max(1, value - 1))
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
                disabled={
                  page >= totalPages || listLoading || isSearchPending
                }
                onClick={() =>
                  setPage((value) => Math.min(totalPages, value + 1))
                }
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
          booking={selectedBooking}
          open
          onClose={closeAction}
        />
      )}
      {selectedBooking && activeAction === "price" && (
        <UpdateBookingPriceModal
          key={`price-${selectedBooking._id}-${selectedBooking.updatedAt}`}
          booking={selectedBooking}
          open
          revalidateKey={revalidateKeys}
          onClose={closeAction}
          onSuccess={handleMutationSuccess}
        />
      )}
      {selectedBooking && activeAction === "status" && (
        <UpdateBookingStatusModal
          key={`status-${selectedBooking._id}-${selectedBooking.updatedAt}`}
          booking={selectedBooking}
          open
          revalidateKey={revalidateKeys}
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
          revalidateKey={revalidateKeys}
          onClose={closeAction}
          onSuccess={handleMutationSuccess}
        />
      )}
      {selectedBooking && activeAction === "cancel" && (
        <CancelBookingDialog
          key={`cancel-${selectedBooking._id}-${selectedBooking.updatedAt}`}
          booking={selectedBooking}
          open
          revalidateKey={revalidateKeys}
          onClose={closeAction}
          onSuccess={handleMutationSuccess}
          onConflict={handleCancellationConflict}
        />
      )}
    </div>
  );
}
