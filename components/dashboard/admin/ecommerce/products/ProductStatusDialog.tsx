"use client";

import { EyeOff, Loader2, Send } from "lucide-react";
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
import { usePatch } from "@/hooks/swr/usePatch";
import type { IProduct } from "@/types/admin/product.type";

type ProductStatusDialogProps = {
  product: IProduct | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
};

export default function ProductStatusDialog({
  product,
  open,
  revalidateKey,
  onClose,
}: ProductStatusDialogProps) {
  const { mutate: updateProduct, isLoading } = usePatch("/product", {
    revalidateKey,
  });
  const isPublished = product?.status === "published";
  const action = isPublished ? "Unpublish" : "Publish";
  const nextStatus = isPublished ? "draft" : "published";

  const handleStatusChange = async () => {
    if (!product || isLoading) return;

    try {
      const response = await updateProduct({
        id: product._id,
        data: { status: nextStatus },
      });

      if (response?.success === false) {
        toast.error(
          response.message || `Failed to ${action.toLowerCase()} product.`,
        );
        return;
      }

      toast.success(
        response?.message ||
          `Product ${nextStatus === "published" ? "published" : "unpublished"} successfully.`,
      );
      onClose();
    } catch (error: unknown) {
      const responseError = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      toast.error(
        responseError.response?.data?.message ||
          responseError.response?.data?.error ||
          responseError.message ||
          `Failed to ${action.toLowerCase()} product.`,
      );
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !isLoading) onClose();
      }}
    >
      <AlertDialogContent className="max-w-md overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="p-6">
          <AlertDialogHeader className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue/10 text-blue">
              {isPublished ? (
                <EyeOff className="h-6 w-6" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-navy">
                {action} Product
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
                {isPublished ? "Unpublishing" : "Publishing"} will change the status of{" "}
                <span className="font-semibold text-foreground">
                  {product?.name ?? "this product"}
                </span>{" "}
                to {nextStatus}.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3 sm:justify-end">
            <AlertDialogCancel
              disabled={isLoading}
              className="min-h-10 rounded-xl px-5"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading || !product}
              onClick={(event) => {
                event.preventDefault();
                void handleStatusChange();
              }}
              className="min-h-10 rounded-xl bg-blue px-5 font-semibold text-white shadow-sm hover:bg-blue/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {action}ing...
                </>
              ) : (
                <>
                  {isPublished ? (
                    <EyeOff className="mr-2 h-4 w-4" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {action} Product
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
