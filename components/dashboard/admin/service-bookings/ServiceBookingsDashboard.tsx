"use client";

import {
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  BadgeCheck,
  Ban,
  Calendar,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import DashboardButton from "@/components/dashboard/DashboardButton";
import DashboardEmpty from "@/components/dashboard/DashboardEmpty";
import DashboardError from "@/components/dashboard/DashboardError";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import CancelBookingDialog from "./CancelBookingDialog";
import UpdateBookingManagementModal from "./UpdateBookingManagementModal";
import UpdateBookingPriceModal from "./UpdateBookingPriceModal";
import UpdateBookingStatusModal from "./UpdateBookingStatusModal";
import ViewBookingModal from "./ViewBookingModal";

const features = tableFeatures({});

const STATUS_OPTIONS: BookingStatus[] = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
  "rejected",
];

export default function ServiceBookingsDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const endpoint = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(limit));
    if (filterStatus) params.set("status", filterStatus);
    if (debouncedSearch) params.set("bookingNumber", debouncedSearch);
    return `/booking?${params.toString()}`;
  }, [currentPage, limit, filterStatus, debouncedSearch]);

  const { data, isLoading, isError, refetch } =
    useFetch<BookingListResponse>(endpoint);

  const bookings = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const currentPageNum = meta?.page ?? currentPage;
  const hasActiveFilters = Boolean(search.trim()) || Boolean(filterStatus);
  const isSearchPending = search.trim() !== debouncedSearch;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string | null) => {
    setFilterStatus(value === "all" || value === null ? "" : value);
    setCurrentPage(1);
  };

  const handleLimitChange = (newLimit: string | null) => {
    if (!newLimit) return;
    setLimit(Number(newLimit));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setFilterStatus("");
    setCurrentPage(1);
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsStatusModalOpen(true);
  };

  const handleUpdatePrice = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsPriceModalOpen(true);
  };

  const handleUpdateManagement = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsManagementModalOpen(true);
  };

  const handleCancel = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const columns: ColumnDef<typeof features, Booking>[] = [
    {
      accessorKey: "bookingNumber",
      header: "Booking ID",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <button
            type="button"
            onClick={() => handleView(booking)}
            className="text-left font-semibold text-navy transition-colors hover:text-blue hover:underline dark:text-foreground dark:hover:text-blue"
          >
            #{booking.bookingNumber}
          </button>
        );
      },
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const user =
          typeof row.original.userId === "object" && row.original.userId
            ? row.original.userId
            : null;
        return (
          <div className="min-w-[150px] space-y-0.5">
            <div className="font-semibold text-slate-900 dark:text-foreground">
              {user?.name || "Customer name unavailable"}
            </div>
            <div className="text-xs text-muted-foreground">
              {user?.phone || user?.email || "No contact info"}
            </div>
          </div>
        );
      },
    },
    {
      id: "service",
      header: "Service",
      cell: ({ row }) => {
        const service =
          typeof row.original.serviceId === "object" && row.original.serviceId
            ? row.original.serviceId
            : null;
        return (
          <div className="min-w-[180px] space-y-0.5">
            <div className="font-semibold text-slate-800 dark:text-foreground">
              {service?.name || "Service info unavailable"}
            </div>
            {row.original.project?.location && (
              <div className="truncate text-xs text-muted-foreground">
                {row.original.project.location}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "siteVisit",
      header: "Site Visit",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="min-w-[120px] text-xs">
            {booking.isSiteVisit ? (
              <span className="font-medium text-blue">
                {booking.siteVisitDate
                  ? formatBookingDate(booking.siteVisitDate)
                  : "Requested"}
              </span>
            ) : (
              <span className="text-muted-foreground">Not requested</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "finalPrice",
      header: "Final Price",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="min-w-[110px] font-semibold text-slate-800 dark:text-foreground">
            {booking.finalPrice != null
              ? `BDT ${formatBookingAmount(booking.finalPrice)}`
              : "Quote Pending"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <Badge
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getBookingStatusClass(
              booking.status,
            )}`}
          >
            {formatBookingStatus(booking.status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
      cell: ({ row }) => (
        <div className="min-w-[140px] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{formatBookingDate(row.original.createdAt)}</span>
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const booking = row.original;
        const canCancel =
          booking.status === "pending" ||
          booking.status === "confirmed" ||
          booking.status === "in-progress";

        return (
          <div className="flex items-center gap-1.5">
            <DashboardButton
              variant="outline"
              className="h-8 w-8 rounded-lg border-blue/30 bg-muted/30 p-0 text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
              icon={<Eye className="h-4 w-4" />}
              onClick={() => handleView(booking)}
              ariaLabel={`View booking ${booking.bookingNumber}`}
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
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Booking Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleUpdateStatus(booking)}
                  >
                    <BadgeCheck className="mr-2 h-4 w-4 text-blue" />
                    Update Status
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleUpdatePrice(booking)}
                  >
                    <DollarSign className="mr-2 h-4 w-4 text-emerald-600" />
                    Update Price
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleUpdateManagement(booking)}
                  >
                    <CalendarClock className="mr-2 h-4 w-4 text-amber-600" />
                    Manage Site Visit / Notes
                  </DropdownMenuItem>

                  {canCancel && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => handleCancel(booking)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Cancel Booking
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useTable({
    features,
    columns,
    data: bookings,
  });

  if (isLoading && !data) {
    return <DashboardLoading />;
  }

  if (isError && !data) {
    return <DashboardError onRetry={() => void refetch()} />;
  }

  return (
    <section className="container mx-auto px-5 py-8 lg:px-0">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Bookings Management</h1>
          <p className="mt-1 text-muted-foreground">
            Manage customer service booking requests, inspection schedules, and
            progress.
          </p>
          {meta && !isSearchPending && (
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {bookings.length} of {meta.total} bookings
            </p>
          )}
        </div>
      </header>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64 sm:shrink-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by booking number..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-9 rounded-full border-blue/30 bg-muted/30 pl-9 text-xs shadow-sm transition-all duration-200 focus:border-blue/40 focus:ring-2 focus:ring-blue/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:ml-auto sm:justify-end">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={filterStatus || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="h-9 w-[160px] rounded-full border-blue/30 bg-muted/30 px-3 text-xs font-semibold text-navy">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {formatBookingStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

      {/* Table & Empty States */}
      {bookings.length === 0 ? (
        <DashboardEmpty
          title="No bookings found"
          description="There are no service bookings matching your current filter criteria."
          icon={<CalendarDays className="h-6 w-6" />}
        />
      ) : (
        <Card className="overflow-hidden border p-0 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-sm font-medium text-muted-foreground"
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
                      <td key={cell.id} className="px-6 py-4">
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination Footer */}
      {bookings.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={String(limit)}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="h-8 w-20 rounded-full border-blue/30 bg-muted/30 px-4 text-xs !text-navy font-semibold shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/5 focus:border-blue/40 focus:ring-2 focus:ring-blue/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <DashboardButton
              variant="outline"
              disabled={currentPageNum <= 1 || isSearchPending}
              onClick={() => handlePageChange(currentPageNum - 1)}
              icon={<ChevronLeft className="h-4 w-4" />}
              className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
              ariaLabel="Previous page"
            />
            <span className="text-sm text-muted-foreground">
              Page {currentPageNum} of {totalPages}
            </span>
            <DashboardButton
              variant="outline"
              disabled={currentPageNum >= totalPages || isSearchPending}
              onClick={() => handlePageChange(currentPageNum + 1)}
              icon={<ChevronRight className="h-4 w-4" />}
              className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
              ariaLabel="Next page"
            />
          </div>
        </div>
      )}

      {/* Dedicated Modals & Dialogs */}
      <ViewBookingModal
        isModalOpen={isViewModalOpen}
        setIsModalOpen={(open) => {
          setIsViewModalOpen(open);
          if (!open) setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />

      <UpdateBookingStatusModal
        booking={selectedBooking}
        open={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedBooking(null);
        }}
        onSuccess={() => void refetch()}
      />

      <UpdateBookingPriceModal
        booking={selectedBooking}
        open={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false);
          setSelectedBooking(null);
        }}
        onSuccess={() => void refetch()}
      />

      <UpdateBookingManagementModal
        booking={selectedBooking}
        open={isManagementModalOpen}
        onClose={() => {
          setIsManagementModalOpen(false);
          setSelectedBooking(null);
        }}
        onSuccess={() => void refetch()}
      />

      <CancelBookingDialog
        booking={selectedBooking}
        open={isCancelDialogOpen}
        onClose={() => {
          setIsCancelDialogOpen(false);
          setSelectedBooking(null);
        }}
        onSuccess={() => void refetch()}
      />
    </section>
  );
}
