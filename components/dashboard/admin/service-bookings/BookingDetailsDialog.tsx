"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import DashboardButton from "@/components/dashboard/DashboardButton";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  cancelBooking,
  getBooking,
  getBookingApiError,
  updateBookingManagement,
  updateBookingPrice,
  updateBookingStatus,
} from "@/lib/api/bookings";
import type { Booking, BookingStatus } from "@/types/admin/booking.type";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  formatBookingAmount,
  formatBookingDate,
  formatBookingStatus,
  getBookingStatusClass,
} from "./bookingUtils";

type BookingDetailsDialogProps = {
  bookingId: string | null;
  open: boolean;
  onClose: () => void;
  onMutationSuccess: (message: string) => void;
};

const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
  "rejected",
];

const canCancelBooking = (status: BookingStatus) =>
  status === "pending" || status === "confirmed" || status === "in-progress";

function toDateTimeInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", getBookingStatusClass(status))}
    >
      {formatBookingStatus(status)}
    </Badge>
  );
}

function Information({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-border/60 bg-muted/20 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-1.5 break-words text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  );
}

export default function BookingDetailsDialog({
  bookingId,
  open,
  onClose,
  onMutationSuccess,
}: BookingDetailsDialogProps) {
  const detailKey = bookingId ? `/booking/${encodeURIComponent(bookingId)}` : null;
  const {
    data: bookingData,
    error,
    isLoading,
    mutate: revalidateDetail,
  } = useSWR(detailKey, () => getBooking(bookingId!), {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    shouldRetryOnError: false,
    onSuccess: (result) => {
      if (result._id !== bookingId) return;
      setPriceDraft(String(result.finalPrice));
      setStatusDraft(result.status);
      setSiteVisitDraft(result.isSiteVisit);
      setSiteVisitDateDraft(toDateTimeInput(result.siteVisitDate));
      setNotesDraft(result.adminNotes ?? "");
      setCancelConfirmationOpen(false);
    },
  });
  const [submitting, setSubmitting] = useState<
    "price" | "status" | "management" | "cancel" | null
  >(null);
  const [priceDraft, setPriceDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<BookingStatus>("pending");
  const [siteVisitDraft, setSiteVisitDraft] = useState(false);
  const [siteVisitDateDraft, setSiteVisitDateDraft] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false);

  const booking = bookingData?._id === bookingId ? bookingData : null;

  async function finishMutation(updated: Booking, message: string) {
    await revalidateDetail(updated, { revalidate: false });
    onMutationSuccess(message);
  }

  async function savePrice() {
    if (!booking || submitting) return;
    const parsedPrice = Number(priceDraft);
    if (priceDraft.trim() === "" || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      toast.error("Enter a valid non-negative final price.");
      return;
    }

    setSubmitting("price");
    try {
      const result = await updateBookingPrice(booking._id, parsedPrice);
      await finishMutation(result.data, result.message || "Booking price updated successfully.");
    } catch (mutationError: unknown) {
      toast.error(getBookingApiError(mutationError, "Failed to update the booking price."));
    } finally {
      setSubmitting(null);
    }
  }

  async function saveStatus() {
    if (!booking || submitting || statusDraft === booking.status) return;
    if (statusDraft === "cancelled") {
      if (!canCancelBooking(booking.status)) {
        toast.error("This booking is not eligible for cancellation.");
        return;
      }
      setCancelConfirmationOpen(true);
      return;
    }

    setSubmitting("status");
    try {
      const result = await updateBookingStatus(booking._id, statusDraft);
      await finishMutation(result.data, result.message || "Booking status updated successfully.");
    } catch (mutationError: unknown) {
      toast.error(getBookingApiError(mutationError, "Failed to update booking status."));
    } finally {
      setSubmitting(null);
    }
  }

  async function saveManagement() {
    if (!booking || submitting) return;
    const changes: {
      isSiteVisit?: boolean;
      siteVisitDate?: string;
      adminNotes?: string;
    } = {};

    if (siteVisitDraft !== booking.isSiteVisit) {
      changes.isSiteVisit = siteVisitDraft;
    }

    const originalSiteDate = toDateTimeInput(booking.siteVisitDate);
    if (siteVisitDraft && siteVisitDateDraft !== originalSiteDate) {
      if (!siteVisitDateDraft && booking.siteVisitDate) {
        toast.error("Disable the site visit to clear its scheduled date.");
        return;
      }
      if (siteVisitDateDraft) {
        const parsedDate = new Date(siteVisitDateDraft);
        if (Number.isNaN(parsedDate.getTime())) {
          toast.error("Enter a valid site-visit date and time.");
          return;
        }
        changes.siteVisitDate = parsedDate.toISOString();
      }
    }

    if (notesDraft !== (booking.adminNotes ?? "")) {
      if (notesDraft.length > 2000) {
        toast.error("Admin notes must be 2,000 characters or fewer.");
        return;
      }
      changes.adminNotes = notesDraft;
    }

    if (Object.keys(changes).length === 0) {
      toast.error("Update at least one booking management field.");
      return;
    }

    setSubmitting("management");
    try {
      const result = await updateBookingManagement(booking._id, changes);
      await finishMutation(result.data, result.message || "Booking details updated successfully.");
    } catch (mutationError: unknown) {
      toast.error(getBookingApiError(mutationError, "Failed to update booking details."));
    } finally {
      setSubmitting(null);
    }
  }

  async function confirmCancellation() {
    if (!booking || submitting || !canCancelBooking(booking.status)) return;
    setSubmitting("cancel");
    try {
      const result = await cancelBooking(booking._id);
      setCancelConfirmationOpen(false);
      setStatusDraft(result.data.status);
      await finishMutation(result.data, result.message || "Booking cancelled successfully.");
    } catch (mutationError: unknown) {
      toast.error(getBookingApiError(mutationError, "Failed to cancel this booking."));
      if (typeof mutationError === "object" && mutationError !== null && "statusCode" in mutationError) {
        const statusCode = mutationError.statusCode;
        if (statusCode === 404 || statusCode === 409) void revalidateDetail();
      }
    } finally {
      setSubmitting(null);
    }
  }

  const user = booking && typeof booking.userId === "object" ? booking.userId : null;
  const service = booking && typeof booking.serviceId === "object" ? booking.serviceId : null;
  const detailsLoading = isLoading || Boolean(bookingId && !booking && !error);

  return (
    <>
      <Dialog
        open={open && Boolean(bookingId)}
        onOpenChange={(value) => {
          if (!value && !submitting) onClose();
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl sm:max-w-4xl">
          <div className="space-y-5 p-5 sm:p-7">
            <DialogHeader className="pr-10 text-left">
              <DialogTitle className="font-display text-xl font-bold text-navy dark:text-foreground">
                Booking Details
              </DialogTitle>
              <DialogDescription>
                {booking?.bookingNumber ?? "Load the latest booking information and manage this request."}
              </DialogDescription>
            </DialogHeader>

            {detailsLoading && <DashboardLoading />}
            {!detailsLoading && error && (
              <div className="space-y-3">
                <p className="text-sm text-destructive">
                  {getBookingApiError(error, "Could not load this booking.")}
                </p>
                <DashboardButton
                  variant="outline"
                  className="h-9 rounded-xl px-4"
                  onClick={() => void revalidateDetail()}
                >
                  Retry
                </DashboardButton>
              </div>
            )}

            {!detailsLoading && !error && booking && (
              <div className="space-y-6">
                <section className="space-y-3" aria-labelledby="booking-information-heading">
                  <h3 id="booking-information-heading" className="text-sm font-semibold text-foreground">
                    Booking and customer
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Information label="Booking number" value={booking.bookingNumber} />
                    <Information label="Status" value={<BookingStatusBadge status={booking.status} />} />
                    <Information label="Created" value={formatBookingDate(booking.createdAt)} />
                    <Information label="Last updated" value={formatBookingDate(booking.updatedAt)} />
                    <Information label="Customer" value={user?.name || "Customer name unavailable"} />
                    <Information label="Email" value={user?.email || "Not provided"} />
                    <Information label="Phone" value={user?.phone || "Not provided"} />
                    <Information label="Service" value={service?.name || "Service unavailable"} />
                    <Information label="Service reference" value={service?._id || (typeof booking.serviceId === "string" ? booking.serviceId : "Unavailable")} />
                    <Information label="Service price" value={service ? formatBookingAmount(service.price) : "Unavailable"} />
                    <Information label="Final booking price" value={formatBookingAmount(booking.finalPrice)} />
                    <Information label="Project location" value={booking.project?.location || "Not provided"} />
                    <Information label="Area size" value={booking.project?.areaSize != null ? `${booking.project.areaSize}${booking.project.areaUnit ? ` ${booking.project.areaUnit}` : ""}` : "Not provided"} />
                    <Information label="Site visit" value={booking.isSiteVisit ? "Enabled" : "Not requested"} />
                    <Information label="Site-visit date" value={booking.siteVisitDate ? formatBookingDate(booking.siteVisitDate) : "Not scheduled"} />
                  </div>
                  <Information label="Customer message" value={booking.project?.message || "No message provided."} />
                  <Information label="Admin notes" value={booking.adminNotes || "No notes added."} />
                </section>

                <section className="grid gap-5 border-t border-border/60 pt-5 lg:grid-cols-2" aria-label="Booking management">
                  <div className="space-y-3 rounded-2xl border border-border/60 p-4 sm:p-5">
                    <div>
                      <h3 className="text-sm font-semibold">Final price</h3>
                      <p className="mt-1 text-xs text-muted-foreground">This changes the price for this booking only.</p>
                    </div>
                    <Label htmlFor="booking-final-price">Final booking price</Label>
                    <Input
                      id="booking-final-price"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={priceDraft}
                      onChange={(event) => setPriceDraft(event.target.value)}
                      disabled={Boolean(submitting)}
                    />
                    <DashboardButton
                      className="min-h-10 rounded-xl px-5"
                      disabled={Boolean(submitting) || priceDraft.trim() === "" || !Number.isFinite(Number(priceDraft)) || Number(priceDraft) < 0 || Number(priceDraft) === booking.finalPrice}
                      onClick={() => void savePrice()}
                      icon={submitting === "price" ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                    >
                      Save price
                    </DashboardButton>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-border/60 p-4 sm:p-5">
                    <div>
                      <h3 className="text-sm font-semibold">Booking status</h3>
                      <p className="mt-1 text-xs text-muted-foreground">Choose the appropriate next stage. Cancellation uses the dedicated confirmation flow.</p>
                    </div>
                    <Label htmlFor="booking-status">Status</Label>
                    <Select
                      value={statusDraft}
                      onValueChange={(value) => {
                        const nextStatus = BOOKING_STATUSES.find((item) => item === value);
                        if (nextStatus) setStatusDraft(nextStatus);
                      }}
                      disabled={Boolean(submitting)}
                    >
                      <SelectTrigger id="booking-status" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BOOKING_STATUSES.map((value) => (
                          <SelectItem
                            key={value}
                            value={value}
                            disabled={value === "cancelled" && !canCancelBooking(booking.status)}
                          >
                            {formatBookingStatus(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      <DashboardButton
                        className="min-h-10 rounded-xl px-5"
                        disabled={Boolean(submitting) || statusDraft === booking.status}
                        onClick={() => void saveStatus()}
                        icon={submitting === "status" ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                      >
                        Save status
                      </DashboardButton>
                      {canCancelBooking(booking.status) && (
                        <DashboardButton
                          variant="outline"
                          className="min-h-10 rounded-xl border-destructive/30 px-5 text-destructive hover:bg-destructive/10"
                          disabled={Boolean(submitting)}
                          onClick={() => setCancelConfirmationOpen(true)}
                        >
                          Cancel booking
                        </DashboardButton>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-border/60 p-4 sm:col-span-2 sm:p-5">
                    <div>
                      <h3 className="text-sm font-semibold">Site visit and admin notes</h3>
                      <p className="mt-1 text-xs text-muted-foreground">Disabling a site visit clears its scheduled date on the server.</p>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/30 p-3">
                      <Label htmlFor="booking-site-visit">Enable site visit</Label>
                      <Switch
                        id="booking-site-visit"
                        checked={siteVisitDraft}
                        onCheckedChange={setSiteVisitDraft}
                        disabled={Boolean(submitting)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="booking-site-visit-date">Site-visit date and time (optional)</Label>
                      <Input
                        id="booking-site-visit-date"
                        type="datetime-local"
                        value={siteVisitDateDraft}
                        onChange={(event) => setSiteVisitDateDraft(event.target.value)}
                        disabled={!siteVisitDraft || Boolean(submitting)}
                      />
                      {!siteVisitDraft && (
                        <p className="text-xs text-muted-foreground">Enable the site visit before assigning a date.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="booking-admin-notes">Admin notes</Label>
                        <span className="text-xs text-muted-foreground">{notesDraft.length}/2000</span>
                      </div>
                      <Textarea
                        id="booking-admin-notes"
                        value={notesDraft}
                        onChange={(event) => setNotesDraft(event.target.value)}
                        maxLength={2000}
                        rows={4}
                        disabled={Boolean(submitting)}
                        placeholder="Add internal notes about this booking..."
                      />
                    </div>
                    <DashboardButton
                      className="min-h-10 rounded-xl px-5"
                      disabled={Boolean(submitting) || (siteVisitDraft === booking.isSiteVisit && siteVisitDateDraft === toDateTimeInput(booking.siteVisitDate) && notesDraft === (booking.adminNotes ?? ""))}
                      onClick={() => void saveManagement()}
                      icon={submitting === "management" ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                    >
                      Save management details
                    </DashboardButton>
                  </div>
                </section>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={cancelConfirmationOpen}
        onOpenChange={(value) => {
          if (!submitting) setCancelConfirmationOpen(value);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia><AlertTriangle className="text-destructive" /></AlertDialogMedia>
            <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
            <AlertDialogDescription>
              {booking ? `Cancel booking ${booking.bookingNumber}? The record will remain in the system with Cancelled status.` : "Cancel this booking?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(submitting)}>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={Boolean(submitting)}
              onClick={(event) => {
                event.preventDefault();
                void confirmCancellation();
              }}
            >
              {submitting === "cancel" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
