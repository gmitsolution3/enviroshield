"use client";

import {
  BadgeCheck,
  Check,
  ClipboardList,
  PackageCheck,
  Wrench,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import {
  formatBookingAmount,
  formatBookingDate,
  formatBookingStatus,
} from "@/components/dashboard/admin/service-bookings/bookingUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Booking, BookingStatus } from "@/types/booking.type";
import { UserStatusBadge } from "../orders/UserDashboardUI";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="break-words font-medium text-foreground">
        {value || "—"}
      </p>
    </div>
  );
}

const bookingStages: {
  status: BookingStatus;
  label: string;
  Icon: LucideIcon;
}[] = [
  { status: "pending", label: "Submitted", Icon: ClipboardList },
  { status: "confirmed", label: "Confirmed", Icon: BadgeCheck },
  { status: "in-progress", label: "In Progress", Icon: Wrench },
  { status: "completed", label: "Completed", Icon: PackageCheck },
];

const SEGMENT_DURATION = 0.45;

function BookingTrackingTimeline({ booking }: { booking: Booking }) {
  const prefersReducedMotion = useReducedMotion();

  if (booking.status === "cancelled" || booking.status === "rejected") {
    const isCancelled = booking.status === "cancelled";
    return (
      <section
        aria-label="Booking cancellation status"
        className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30 sm:p-5"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
            <XCircle className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-red-900 dark:text-red-200">
              Booking {isCancelled ? "Cancelled" : "Rejected"}
            </h3>
            <p className="mt-1 text-sm leading-5 text-red-800/80 dark:text-red-200/80">
              {isCancelled
                ? "This service booking has been cancelled and is no longer active."
                : "This service booking was rejected. Please contact support or submit a new inquiry."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentIndex = Math.max(
    bookingStages.findIndex((stage) => stage.status === booking.status),
    0,
  );
  const lastIndex = bookingStages.length - 1;
  const isCompleted = booking.status === "completed";

  const reachTime = (index: number) =>
    prefersReducedMotion ? 0 : index * SEGMENT_DURATION;
  const totalFillTime = reachTime(currentIndex);

  return (
    <section
      aria-label="Service booking progress"
      className="rounded-2xl border bg-card p-4 text-card-foreground sm:p-5"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-navy dark:text-foreground">
          Service tracking
        </h3>
        <p className="text-xs text-muted-foreground">
          {formatBookingStatus(booking.status)}
        </p>
      </div>

      <ol
        key={`${booking.bookingNumber}-${booking.status}`}
        className="relative grid grid-cols-4 gap-1"
      >
        {bookingStages.map(({ status, label, Icon }, index) => {
          const isCurrent = index === currentIndex;
          const isComplete = index < currentIndex || isCompleted;
          const isReached = isCurrent || isComplete;
          const delay = reachTime(index);
          const nodeFade = {
            duration: prefersReducedMotion ? 0 : 0.3,
            delay,
            ease: "easeOut" as const,
          };

          return (
            <li
              key={status}
              className="relative flex min-w-0 flex-col items-center text-center"
              aria-current={isCurrent ? "step" : undefined}
            >
              {index === 0 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-4 z-0 h-1 w-[calc(300%+1rem)] -translate-y-1/2 overflow-hidden rounded-full bg-border sm:top-5"
                >
                  {currentIndex > 0 && (
                    <motion.span
                      initial={prefersReducedMotion ? false : { scaleX: 0 }}
                      animate={{ scaleX: currentIndex / lastIndex }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : totalFillTime,
                        ease: "linear",
                      }}
                      style={{ transformOrigin: "left center" }}
                      className="absolute inset-0 rounded-full bg-blue will-change-transform"
                    />
                  )}
                </span>
              )}

              {isCurrent && !prefersReducedMotion && (
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: totalFillTime,
                    ease: "easeOut",
                  }}
                  className="pointer-events-none absolute left-1/2 top-0 z-0 size-8 -translate-x-1/2 sm:size-10"
                >
                  <motion.span
                    className="absolute -inset-2 rounded-full bg-[radial-gradient(circle,rgba(1,110,220,0.55)_0%,rgba(1,110,220,0)_70%)]"
                    animate={{
                      opacity: [0.35, 0.9, 0.35],
                      scale: [0.95, 1.25, 0.95],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-blue"
                    animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                </motion.span>
              )}

              <span className="relative z-10 grid size-8 place-items-center rounded-full border border-border bg-muted text-muted-foreground sm:size-10">
                <Icon className="size-4 sm:size-[18px]" aria-hidden="true" />

                {isReached && (
                  <motion.span
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={nodeFade}
                    className="absolute inset-0 grid place-items-center rounded-full bg-blue text-white"
                  >
                    {isComplete ? (
                      <Check
                        className="size-4 stroke-[3] sm:size-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <Icon
                        className="size-4 sm:size-[18px]"
                        aria-hidden="true"
                      />
                    )}
                  </motion.span>
                )}
              </span>

              <span className="mt-2.5 flex flex-col items-center">
                <span
                  className={`text-xs font-semibold leading-tight ${
                    isReached ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function MyBookingDetailsDialog({
  booking,
  open,
  onClose,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}) {
  const service =
    booking && typeof booking.serviceId === "object"
      ? booking.serviceId
      : null;

  return (
    <Dialog
      open={open && Boolean(booking)}
      onOpenChange={(value) => !value && onClose()}
    >
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-3xl">
        <div className="flex max-h-[92vh] flex-col overflow-hidden">
          {booking && (
            <>
              <DialogHeader className="shrink-0 border-b px-6 py-5 pr-14 text-left sm:px-8">
                <DialogTitle className="text-xl font-bold text-navy">
                  Booking {booking.bookingNumber}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-2">
                  Submitted {formatBookingDate(booking.createdAt)}{" "}
                  <UserStatusBadge status={formatBookingStatus(booking.status)} />
                </DialogDescription>
              </DialogHeader>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">
                {/* Visual Tracking Progress */}
                <BookingTrackingTimeline booking={booking} />

                {/* Service Details Section */}
                <section className="rounded-2xl border bg-card p-5">
                  <h2 className="mb-4 font-semibold text-navy dark:text-foreground">
                    Service Information
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Detail
                      label="Service"
                      value={
                        service?.name || "Service information unavailable"
                      }
                    />
                    <Detail
                      label="Base / Starting Price"
                      value={
                        service?.price != null
                          ? `BDT ${formatBookingAmount(service.price)}`
                          : "Custom quote"
                      }
                    />
                  </div>
                </section>

                {/* Project Details Section */}
                <section className="rounded-2xl border bg-card p-5">
                  <h2 className="mb-4 font-semibold text-navy dark:text-foreground">
                    Project Details
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Detail
                      label="Location"
                      value={booking.project?.location || "Not provided"}
                    />
                    <Detail
                      label="Area size"
                      value={
                        booking.project?.areaSize != null
                          ? `${booking.project.areaSize} ${
                              booking.project.areaUnit || "sq ft"
                            }`
                          : "Not provided"
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <Detail
                      label="Project Description / Scope"
                      value={
                        booking.project?.message || "No message provided."
                      }
                    />
                  </div>
                </section>

                {/* Booking Scheduling & Pricing Information */}
                <section className="rounded-2xl border bg-card p-5">
                  <h2 className="mb-4 font-semibold text-navy dark:text-foreground">
                    Booking & Site Visit Information
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Detail
                      label="Site visit"
                      value={
                        booking.isSiteVisit ? "Requested" : "Not requested"
                      }
                    />
                    <Detail
                      label="Site-visit date"
                      value={
                        booking.siteVisitDate
                          ? formatBookingDate(booking.siteVisitDate)
                          : "Not scheduled"
                      }
                    />
                    <Detail
                      label="Final price"
                      value={
                        booking.finalPrice != null
                          ? `BDT ${formatBookingAmount(booking.finalPrice)}`
                          : "Pending assessment"
                      }
                    />
                    <Detail
                      label="Last updated"
                      value={formatBookingDate(booking.updatedAt)}
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
