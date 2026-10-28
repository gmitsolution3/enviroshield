"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  getBookingApiError,
  updateBookingManagement,
} from "@/lib/api/bookings";
import type { Booking } from "@/types/admin/booking.type";

type UpdateBookingManagementModalProps = {
  booking: Booking;
  open: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking, message: string) => void;
};

function toDateTimeInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function UpdateBookingManagementModal({
  booking,
  open,
  onClose,
  onSuccess,
}: UpdateBookingManagementModalProps) {
  const [isSiteVisit, setIsSiteVisit] = useState(booking.isSiteVisit);
  const [siteVisitDate, setSiteVisitDate] = useState(
    toDateTimeInput(booking.siteVisitDate),
  );
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes ?? "");
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const originalSiteVisitDate = toDateTimeInput(booking.siteVisitDate);
  const hasChanges =
    isSiteVisit !== booking.isSiteVisit ||
    siteVisitDate !== originalSiteVisitDate ||
    adminNotes !== (booking.adminNotes ?? "");

  async function submit() {
    if (isLoading) return;
    setValidationError("");
    const changes: {
      isSiteVisit?: boolean;
      siteVisitDate?: string;
      adminNotes?: string;
    } = {};

    if (isSiteVisit !== booking.isSiteVisit) {
      changes.isSiteVisit = isSiteVisit;
    }

    if (isSiteVisit && siteVisitDate !== originalSiteVisitDate) {
      if (!siteVisitDate && booking.siteVisitDate) {
        setValidationError("To clear the scheduled date, disable the site visit.");
        return;
      }
      if (siteVisitDate) {
        const parsedDate = new Date(siteVisitDate);
        if (Number.isNaN(parsedDate.getTime())) {
          setValidationError("Enter a valid site-visit date and time.");
          return;
        }
        changes.siteVisitDate = parsedDate.toISOString();
      }
    }

    if (adminNotes !== (booking.adminNotes ?? "")) {
      if (adminNotes.length > 2000) {
        setValidationError("Admin notes must be 2,000 characters or fewer.");
        return;
      }
      changes.adminNotes = adminNotes;
    }

    if (Object.keys(changes).length === 0) {
      setValidationError("Change at least one field before saving.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateBookingManagement(booking._id, changes);
      onSuccess(response.data, response.message || "Booking management information updated.");
    } catch (error: unknown) {
      const message = getBookingApiError(error, "Failed to update booking management information.");
      setValidationError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !value && !isLoading && onClose()}
    >
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 pr-14 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Manage Booking Information
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Update the site visit and internal notes for{" "}
              <span className="font-semibold text-foreground">{booking.bookingNumber}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
            <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/20 p-4">
              <div className="space-y-1">
                <Label htmlFor="booking-management-site-visit" className="font-semibold text-navy">
                  Enable site visit
                </Label>
                <p className="text-xs leading-5 text-muted-foreground">
                  Disabling a site visit clears its scheduled date.
                </p>
              </div>
              <Switch
                id="booking-management-site-visit"
                checked={isSiteVisit}
                onCheckedChange={(checked) => {
                  setIsSiteVisit(checked);
                  setValidationError("");
                }}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-management-site-visit-date" className="font-semibold text-navy">
                Site-visit date and time (optional)
              </Label>
              <Input
                id="booking-management-site-visit-date"
                type="datetime-local"
                value={siteVisitDate}
                onChange={(event) => {
                  setSiteVisitDate(event.target.value);
                  setValidationError("");
                }}
                disabled={!isSiteVisit || isLoading}
              />
              {!isSiteVisit && (
                <p className="text-xs text-muted-foreground">
                  Enable the site visit before assigning a date.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="booking-management-admin-notes" className="font-semibold text-navy">
                  Admin notes
                </Label>
                <span className="text-xs text-muted-foreground">
                  {adminNotes.length}/2000
                </span>
              </div>
              <Textarea
                id="booking-management-admin-notes"
                value={adminNotes}
                onChange={(event) => {
                  setAdminNotes(event.target.value);
                  setValidationError("");
                }}
                maxLength={2000}
                rows={5}
                disabled={isLoading}
                aria-invalid={Boolean(validationError)}
                placeholder="Add internal notes about this booking..."
                className="resize-none"
              />
            </div>

            {validationError && (
              <p className="text-sm text-destructive" role="alert">
                {validationError}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
            <DashboardButton
              variant="outline"
              className="min-h-10 rounded-xl px-5"
              disabled={isLoading}
              onClick={onClose}
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              disabled={isLoading || !hasChanges}
              onClick={() => void submit()}
              icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </DashboardButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
