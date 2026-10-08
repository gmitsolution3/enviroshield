"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDelete } from "@/hooks/swr/useDelete";
import type { IContact } from "@/types";

type DeleteContactDialogProps = {
  contact: IContact | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
};

export default function DeleteContactDialog({
  contact,
  open,
  revalidateKey,
  onClose,
}: DeleteContactDialogProps) {
  const { mutate: deleteContact, isLoading: isDeleting } = useDelete(
    "/contact",
    {
      revalidateKey,
    },
  );

  const handleDelete = async () => {
    if (!contact) return;

    try {
      await deleteContact(contact._id);

      toast.success("Contact deleted successfully.");

      onClose();
    } catch {
      toast.error("Failed to delete contact.");
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !isDeleting) {
          onClose();
        }
      }}
    >
      <AlertDialogContent className="max-w-md overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="p-6">
          <AlertDialogHeader className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-navy">
                Delete contact?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
                This action cannot be undone. The contact{" "}
                {contact?.fullName ? (
                  <span className="font-semibold text-foreground">
                    “{contact.fullName}”
                  </span>
                ) : (
                  "will"
                )}{" "}
                will be permanently deleted.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 gap-3 sm:justify-end">
            <AlertDialogCancel
              disabled={isDeleting}
              className="min-h-10 rounded-xl px-5"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting || !contact}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              className="min-h-10 rounded-xl bg-red-600 px-5 font-semibold text-white shadow-sm hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Contact
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}