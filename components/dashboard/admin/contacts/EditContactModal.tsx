"use client";

import { Check, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { usePatch } from "@/hooks/swr/usePatch";

import type { IContact, TContactStatus } from "@/types";

import DashboardButton from "../../DashboardButton";

type EditContactModalProps = {
  contact: IContact | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
};

type FormValues = {
  status: TContactStatus;
  adminNotes: string;
};

const statusOptions: {
  value: TContactStatus;
  label: string;
}[] = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "contacted",
    label: "Contacted",
  },
  {
    value: "qualified",
    label: "Qualified",
  },
  {
    value: "site-visit",
    label: "Site Visit",
  },
  {
    value: "proposal-sent",
    label: "Proposal Sent",
  },
  {
    value: "won",
    label: "Won",
  },
  {
    value: "lost",
    label: "Lost",
  },
];

const defaultValues: FormValues = {
  status: "new",
  adminNotes: "",
};

export default function EditContactModal({
  contact,
  open,
  revalidateKey,
  onClose,
}: EditContactModalProps) {
  const { mutate: updateContact, isLoading } = usePatch("/contact", {
    revalidateKey,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (!open || !contact) return;

    reset({
      status: contact.status,
      adminNotes: contact.adminNotes ?? "",
    });
  }, [open, contact, reset]);

  const handleClose = () => {
    if (isLoading) return;

    onClose();

    reset(defaultValues);
  };

  const onSubmit = async (values: FormValues) => {
    if (!contact) return;

    try {
      await updateContact({
        id: contact._id,

        data: {
          status: values.status,
          adminNotes: values.adminNotes,
        },
      });

      toast.success("Contact updated successfully.");

      onClose();

      reset(defaultValues);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update contact.";

      toast.error(message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !isLoading) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-xl rounded-2xl border-0 p-0 shadow-2xl">
        <DialogHeader className="border-b px-6 py-5 text-left sm:px-7">
          <DialogTitle className="text-xl font-bold text-navy">
            Update Contact
          </DialogTitle>

          <DialogDescription className="text-sm leading-6">
            Update the status and internal notes for{" "}
            <span className="font-semibold text-foreground">
              {contact?.fullName ?? "this contact"}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 px-6 py-6 sm:px-7">
            {/* Status */}

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy">
                Contact Status
              </Label>

              <Controller
                control={control}
                name="status"
                rules={{
                  required: "Status is required",
                }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 w-full rounded-xl">
                      <SelectValue placeholder="Select contact status" />
                    </SelectTrigger>

                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem
                          key={status.value}
                          value={status.value}
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}

              <p className="text-xs leading-5 text-muted-foreground">
                Select the current stage of this contact inquiry.
              </p>
            </div>

            {/* Admin Notes */}

            <div className="space-y-2">
              <Label
                htmlFor="contact-admin-notes"
                className="text-sm font-semibold text-navy"
              >
                Admin Notes
              </Label>

              <Controller
                control={control}
                name="adminNotes"
                render={({ field }) => (
                  <Textarea
                    id="contact-admin-notes"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                    placeholder="Add internal notes about this contact..."
                    className="min-h-36 resize-none rounded-xl"
                  />
                )}
              />

              <p className="text-xs leading-5 text-muted-foreground">
                These notes are internal and are not shown to the customer.
              </p>
            </div>
          </div>

          {/* Footer */}

          <div className="flex items-center justify-end gap-3 border-t bg-muted/10 px-6 py-4 sm:px-7">
            <DashboardButton
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="h-10 rounded-xl px-5 text-xs font-bold"
            >
              Cancel
            </DashboardButton>

            <DashboardButton
              type="submit"
              disabled={isLoading}
              icon={
                isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )
              }
            >
              {isLoading ? "Updating..." : "Update Contact"}
            </DashboardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}