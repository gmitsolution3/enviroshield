"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  Booking,
  BookingStatus,
} from "@/types/admin/booking.type";
import {
  formatBookingAmount,
  formatBookingDate,
  formatBookingStatus,
  getBookingStatusClass,
} from "./bookingUtils";

type BookingDetailsDialogProps = {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="break-words font-medium text-foreground whitespace-pre-wrap">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge
      variant="outline"
      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getBookingStatusClass(status)}`}
    >
      {formatBookingStatus(status)}
    </Badge>
  );
}

export default function BookingDetailsDialog({
  booking,
  open,
  onClose,
}: BookingDetailsDialogProps) {
  const selectedBooking = booking;
  const user =
    selectedBooking && typeof selectedBooking.userId === "object"
      ? selectedBooking.userId
      : null;
  const service =
    selectedBooking && typeof selectedBooking.serviceId === "object"
      ? selectedBooking.serviceId
      : null;

  return (
    <Dialog
      open={open && Boolean(booking)}
      onOpenChange={(value) => !value && onClose()}
    >
      <DialogContent className="max-h-[92vh] !max-w-5xl overflow-hidden border-0 bg-[#f8fafc] p-0 shadow-2xl dark:bg-background">
        <div className="flex max-h-[92vh] flex-col overflow-hidden">
          {selectedBooking && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  Read-only customer, service, project, and booking
                  information.
                </DialogDescription>
              </DialogHeader>
              <section className="relative shrink-0 overflow-hidden bg-navy px-6 py-6 text-white sm:px-8 sm:py-8">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />
                <div className="relative space-y-2 pr-8">
                  <p className="text-sm text-white/70">
                    Submitted{" "}
                    {formatBookingDate(selectedBooking.createdAt)}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold">
                      Booking {selectedBooking.bookingNumber}
                    </h2>
                    <StatusBadge status={selectedBooking.status} />
                  </div>
                </div>
              </section>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">
                <section className="rounded-2xl border bg-white p-5 dark:bg-card">
                  <h2 className="mb-4 font-semibold text-navy dark:text-foreground">
                    Customer
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Detail
                      label="Name"
                      value={user?.name || "Name unavailable"}
                    />
                    <Detail
                      label="Phone"
                      value={user?.phone || "Not provided"}
                    />
                    <Detail
                      label="Email"
                      value={user?.email || "Not provided"}
                    />
                  </div>
                </section>

                <section className="rounded-2xl border bg-white p-5 dark:bg-card">
                  <h2 className="mb-4 font-semibold text-navy dark:text-foreground">
                    Service
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Detail
                      label="Service"
                      value={service?.name || "Service unavailable"}
                    />
                    <Detail
                      label="Service reference"
                      value={
                        service?._id ||
                        (typeof selectedBooking.serviceId === "string"
                          ? selectedBooking.serviceId
                          : "Unavailable")
                      }
                    />
                    <Detail
                      label="Service price"
                      value={
                        service
                          ? formatBookingAmount(service.price)
                          : "Unavailable"
                      }
                    />
                  </div>
                </section>

                <section className="rounded-2xl border bg-white p-5 dark:bg-card">
                  <h2 className="mb-4 font-semibold text-navy dark:text-foreground">
                    Project
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Detail
                      label="Location"
                      value={
                        selectedBooking.project?.location ||
                        "Not provided"
                      }
                    />
                    <Detail
                      label="Area size"
                      value={
                        selectedBooking.project?.areaSize != null
                          ? `${selectedBooking.project.areaSize}${selectedBooking.project.areaUnit ? ` ${selectedBooking.project.areaUnit}` : ""}`
                          : "Not provided"
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <Detail
                      label="Customer message"
                      value={
                        selectedBooking.project?.message ||
                        "No message provided."
                      }
                    />
                  </div>
                </section>

                <section className="rounded-2xl border bg-white p-5 dark:bg-card">
                  <h2 className="mb-4 font-semibold text-navy dark:text-foreground">
                    Administration
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Detail
                      label="Final booking price"
                      value={formatBookingAmount(
                        selectedBooking.finalPrice,
                      )}
                    />
                    <Detail
                      label="Site visit"
                      value={
                        selectedBooking.isSiteVisit
                          ? "Enabled"
                          : "Not requested"
                      }
                    />
                    <Detail
                      label="Site-visit date"
                      value={
                        selectedBooking.siteVisitDate
                          ? formatBookingDate(
                              selectedBooking.siteVisitDate,
                            )
                          : "Not scheduled"
                      }
                    />
                    <Detail
                      label="Created"
                      value={formatBookingDate(
                        selectedBooking.createdAt,
                      )}
                    />
                    <Detail
                      label="Last updated"
                      value={formatBookingDate(
                        selectedBooking.updatedAt,
                      )}
                    />
                  </div>
                  <div className="mt-4">
                    <Detail
                      label="Admin notes"
                      value={
                        selectedBooking.adminNotes ||
                        "No notes added."
                      }
                    />
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
