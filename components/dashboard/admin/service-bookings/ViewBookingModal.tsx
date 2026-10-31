"use client";

import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Booking } from "@/types/booking.type";
import DashboardButton from "../../DashboardButton";
import {
  formatBookingAmount,
  formatBookingDate,
  formatBookingStatus,
  getBookingStatusClass,
} from "./bookingUtils";

type ViewBookingModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  booking: Booking | null;
};

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </p>
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {value || "—"}
      </div>
    </div>
  );
}

export default function ViewBookingModal({
  isModalOpen,
  setIsModalOpen,
  booking,
}: ViewBookingModalProps) {
  if (!booking) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const user =
    typeof booking.userId === "object" && booking.userId
      ? booking.userId
      : null;

  const service =
    typeof booking.serviceId === "object" && booking.serviceId
      ? booking.serviceId
      : null;

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-h-[92vh] !max-w-5xl overflow-y-auto border-0 bg-[#f8fafc] p-0 shadow-2xl dark:bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            View complete information for booking {booking.bookingNumber}.
          </DialogDescription>
        </DialogHeader>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-navy px-6 py-7 text-white sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
                  Booking #{booking.bookingNumber}
                </span>
                <Badge
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getBookingStatusClass(
                    booking.status,
                  )}`}
                >
                  {formatBookingStatus(booking.status)}
                </Badge>
              </div>

              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {service?.name || "Custom Service Request"}
              </h2>

              <p className="flex items-center gap-2 text-xs text-white/80">
                <Calendar className="h-3.5 w-3.5" />
                Submitted on {formatBookingDate(booking.createdAt)}
              </p>
            </div>

            <div className="flex flex-col items-start rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:items-end">
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                {booking.finalPrice != null ? "Final Agreed Price" : "Estimated Base Price"}
              </span>
              <span className="font-display text-2xl font-bold text-white">
                {booking.finalPrice != null
                  ? `BDT ${formatBookingAmount(booking.finalPrice)}`
                  : service?.price != null
                  ? `From BDT ${formatBookingAmount(service.price)}`
                  : "Quote Pending"}
              </span>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <div className="space-y-6 p-6 sm:p-8">
          {/* Customer & Service Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Details */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-border">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 text-blue">
                  <User className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-navy dark:text-foreground">
                  Customer Information
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Full Name"
                  value={user?.name || "Customer name unavailable"}
                />
                <DetailItem
                  label="Phone Number"
                  value={
                    user?.phone ? (
                      <a
                        href={`tel:${user.phone}`}
                        className="text-blue hover:underline"
                      >
                        {user.phone}
                      </a>
                    ) : (
                      "Not provided"
                    )
                  }
                  icon={Phone}
                />
                <DetailItem
                  label="Email Address"
                  value={
                    user?.email ? (
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue hover:underline"
                      >
                        {user.email}
                      </a>
                    ) : (
                      "Not provided"
                    )
                  }
                  icon={Mail}
                />
                <DetailItem
                  label="Customer ID"
                  value={user?.id || (typeof booking.userId === "string" ? booking.userId : "—")}
                />
              </div>
            </div>

            {/* Service Details */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-border">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo/10 text-indigo">
                  <Wrench className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-navy dark:text-foreground">
                  Service Details
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Selected Service"
                  value={service?.name || "Service info unavailable"}
                />
                <DetailItem
                  label="Service Catalog Slug"
                  value={service?.slug ? `/${service.slug}` : "—"}
                />
                <DetailItem
                  label="Catalog Starting Price"
                  value={
                    service?.price != null
                      ? `BDT ${formatBookingAmount(service.price)}`
                      : "Custom quote"
                  }
                  icon={DollarSign}
                />
                <DetailItem
                  label="Service Status"
                  value={service?.status ? service.status.toUpperCase() : "Active"}
                  icon={ShieldCheck}
                />
              </div>
            </div>
          </div>

          {/* Project Scope & Location */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-border">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10 text-teal">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-navy dark:text-foreground">
                Project & Scope
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <DetailItem
                label="Project Location / Address"
                value={booking.project?.location || "Not provided"}
                icon={MapPin}
              />
              <DetailItem
                label="Area Size"
                value={
                  booking.project?.areaSize != null
                    ? `${booking.project.areaSize} ${booking.project.areaUnit || "sq ft"}`
                    : "Not specified"
                }
                icon={Ruler}
              />
              <DetailItem
                label="Site Visit Inspection"
                value={
                  booking.isSiteVisit ? (
                    <span className="font-medium text-blue">
                      Site visit requested
                    </span>
                  ) : (
                    "No site visit requested"
                  )
                }
                icon={Clock}
              />
            </div>

            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-border/50 dark:bg-muted/30">
              <DetailItem
                label="Project Description / Customer Message"
                value={
                  <p className="whitespace-pre-wrap font-normal leading-relaxed text-slate-700 dark:text-slate-300">
                    {booking.project?.message || "No project message provided by customer."}
                  </p>
                }
                icon={FileText}
              />
            </div>
          </div>

          {/* Site Visit Scheduling & Admin Management */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-border">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Clock className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-navy dark:text-foreground">
                  Inspection Schedule
                </h3>
              </div>

              <div className="space-y-4">
                <DetailItem
                  label="Site Visit Status"
                  value={booking.isSiteVisit ? "Required / Enabled" : "Not Required"}
                />
                <DetailItem
                  label="Scheduled Inspection Date"
                  value={
                    booking.siteVisitDate
                      ? formatBookingDate(booking.siteVisitDate)
                      : "Not yet scheduled"
                  }
                  icon={Calendar}
                />
                <DetailItem
                  label="Last System Update"
                  value={formatBookingDate(booking.updatedAt)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-border">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-muted dark:text-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-navy dark:text-foreground">
                  Internal Admin Notes
                </h3>
              </div>

              <div className="min-h-[100px] rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-border/50 dark:bg-muted/30">
                <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                  {booking.adminNotes?.trim() || "No internal administration notes recorded."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-slate-200/80 bg-slate-50/70 px-6 py-4 dark:border-border dark:bg-muted/30">
          <DashboardButton
            variant="outline"
            onClick={handleClose}
            className="rounded-full px-6"
          >
            Close Details
          </DashboardButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
