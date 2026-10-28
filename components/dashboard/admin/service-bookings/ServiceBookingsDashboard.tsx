"use client";

import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import DashboardButton from "@/components/dashboard/DashboardButton";
import DashboardEmpty from "@/components/dashboard/DashboardEmpty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookingStatus, ServiceBooking } from "./serviceBookingData";
import { serviceBookings } from "./serviceBookingData";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const STATUS_OPTIONS: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const statusStyles: Record<BookingStatus, string> = {
  Pending:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
  Confirmed:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300",
  Completed:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  Cancelled:
    "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

function formatDate(value: string, withTime = false) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeZone: "Asia/Dhaka",
    ...(withTime ? { timeStyle: "short" as const } : {}),
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge
      variant="outline"
      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[status]}`}
    >
      {status}
    </Badge>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
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
          {value.toLocaleString("en-BD")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function DetailItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-border/60 bg-muted/20 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-1.5 break-words text-sm font-medium text-foreground">
        {children}
      </div>
    </div>
  );
}

export default function ServiceBookingsDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedBooking, setSelectedBooking] =
    useState<ServiceBooking | null>(null);

  const metrics = useMemo(
    () => ({
      total: serviceBookings.length,
      pending: serviceBookings.filter((booking) => booking.status === "Pending")
        .length,
      confirmed: serviceBookings.filter(
        (booking) => booking.status === "Confirmed",
      ).length,
      completed: serviceBookings.filter(
        (booking) => booking.status === "Completed",
      ).length,
    }),
    [],
  );

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return serviceBookings.filter((booking) => {
      const matchesStatus = status === "all" || booking.status === status;
      const matchesSearch =
        !query ||
        [
          booking.id,
          booking.customerName,
          booking.email,
          booking.phone,
          booking.service,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const pageBookings = filteredBookings.slice((page - 1) * pageSize, page * pageSize);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatus(value: string | null) {
    setStatus(value ?? "all");
    setPage(1);
  }

  function updatePageSize(value: string | null) {
    if (!value) return;
    setPageSize(Number(value));
    setPage(1);
  }

  function changePage(nextPage: number) {
    setPage(Math.min(totalPages, Math.max(1, nextPage)));
  }

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
        </div>
        <Badge
          variant="outline"
          className="w-fit rounded-full border-blue/20 bg-blue/5 px-3 py-1.5 text-sm font-semibold text-blue"
        >
          UI preview · sample bookings
        </Badge>
      </section>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Booking summaries"
      >
        <MetricCard
          title="Total Bookings"
          value={metrics.total}
          description="Sample booking requests in this preview."
          icon={CalendarDays}
          tone="blue"
        />
        <MetricCard
          title="Pending Review"
          value={metrics.pending}
          description="Requests awaiting an initial review."
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          title="Confirmed"
          value={metrics.confirmed}
          description="Bookings with a confirmed appointment."
          icon={Users}
          tone="teal"
        />
        <MetricCard
          title="Completed"
          value={metrics.completed}
          description="Appointments marked as completed."
          icon={CheckCircle2}
          tone="green"
        />
      </section>

      <section className="space-y-4" aria-label="Booking list">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search booking, customer, contact, or service..."
              aria-label="Search service bookings"
              className="h-10 rounded-full border-blue/20 bg-background pl-9 shadow-sm focus-visible:ring-blue/20"
            />
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
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
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {pageBookings.length === 0 ? (
          <DashboardEmpty
            title="No bookings found"
            description="Try another search term or choose a different booking status."
            icon={<CalendarDays className="h-6 w-6 text-muted-foreground" />}
          />
        ) : (
          <Card className="overflow-hidden rounded-2xl border-border/70 p-0 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px]">
                <thead className="border-b bg-muted/50">
                  <tr>
                    {[
                      "Booking ID",
                      "Customer",
                      "Contact Information",
                      "Service",
                      "Requested Date",
                      "Booking Status",
                      "Date Submitted",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-5 py-3 text-left text-sm font-medium text-muted-foreground"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-navy dark:text-foreground">
                        {booking.id}
                      </td>
                      <td className="px-5 py-4">
                        <p className="whitespace-nowrap text-sm font-medium text-foreground">
                          {booking.customerName}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={`mailto:${booking.email}`}
                          className="block max-w-[220px] truncate text-sm text-muted-foreground hover:text-blue"
                        >
                          {booking.email}
                        </a>
                        <a
                          href={`tel:${booking.phone.replace(/[^+\d]/g, "")}`}
                          className="mt-1 block whitespace-nowrap text-xs text-muted-foreground hover:text-blue"
                        >
                          {booking.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-foreground">
                        {booking.service}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                        {formatDate(booking.requestedDate, true)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                        {formatDate(booking.submittedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-full border-blue/30 bg-muted/30 px-3 text-navy shadow-sm hover:bg-blue/10 hover:text-blue"
                          onClick={() => setSelectedBooking(booking)}
                          aria-label={`View details for booking ${booking.id}`}
                        >
                          <Eye className="mr-1.5 h-4 w-4" aria-hidden="true" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {filteredBookings.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              <Select value={String(pageSize)} onValueChange={updatePageSize}>
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
                disabled={page <= 1}
                onClick={() => changePage(page - 1)}
                icon={<ChevronLeft className="h-4 w-4" />}
                className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
                ariaLabel="Previous page"
              />
              <span className="text-sm text-muted-foreground" aria-live="polite">
                Page {page} of {totalPages}
              </span>
              <DashboardButton
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => changePage(page + 1)}
                icon={<ChevronRight className="h-4 w-4" />}
                className="h-8 w-8 rounded-full border-blue bg-blue p-0 text-white shadow-[0_3px_10px_rgba(1,110,220,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-[#005cb9] hover:text-white hover:shadow-[0_4px_12px_rgba(1,110,220,0.24)] disabled:pointer-events-none disabled:opacity-50"
                ariaLabel="Next page"
              />
            </div>
          </div>
        )}
      </section>

      <Dialog
        open={Boolean(selectedBooking)}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold">
                  Booking Details
                </DialogTitle>
                <DialogDescription>
                  Request {selectedBooking.id} · submitted {formatDate(selectedBooking.submittedAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem label="Booking ID">{selectedBooking.id}</DetailItem>
                <DetailItem label="Current status">
                  <StatusBadge status={selectedBooking.status} />
                </DetailItem>
                <DetailItem label="Customer">
                  {selectedBooking.customerName}
                </DetailItem>
                <DetailItem label="Service requested">
                  {selectedBooking.service}
                </DetailItem>
                <DetailItem label="Email">
                  <a
                    className="hover:text-blue"
                    href={`mailto:${selectedBooking.email}`}
                  >
                    {selectedBooking.email}
                  </a>
                </DetailItem>
                <DetailItem label="Phone">
                  <a
                    className="hover:text-blue"
                    href={`tel:${selectedBooking.phone.replace(/[^+\d]/g, "")}`}
                  >
                    {selectedBooking.phone}
                  </a>
                </DetailItem>
                <DetailItem label="Requested appointment">
                  {formatDate(selectedBooking.requestedDate, true)}
                </DetailItem>
                <DetailItem label="Date submitted">
                  {formatDate(selectedBooking.submittedAt, true)}
                </DetailItem>
                <div className="sm:col-span-2">
                  <DetailItem label="Property address">
                    {selectedBooking.propertyAddress}
                  </DetailItem>
                </div>
                <div className="sm:col-span-2">
                  <DetailItem label="Request notes">
                    {selectedBooking.notes}
                  </DetailItem>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
