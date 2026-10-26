"use client";

import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Loader2, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { mutate } from "swr";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import type {
  InventoryAdjustmentResponse,
  InventoryMovementType,
} from "@/types/admin/inventory.type";
import type { IProduct, IProductResponse } from "@/types";

type StockAdjustmentModalProps = {
  product: IProduct | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
};

type AdjustmentField = "movementType" | "quantity" | "reason";
type AdjustmentErrors = Partial<Record<AdjustmentField, string>>;
type ErrorSource = { path: string; message: string };
type ApiErrorPayload = {
  message?: unknown;
  errorSources?: unknown;
  response?: { data?: unknown };
};

function readApiError(error: unknown) {
  const outer =
    error && typeof error === "object" ? (error as ApiErrorPayload) : null;
  const payload = outer?.response?.data ?? error;
  const details =
    payload && typeof payload === "object"
      ? (payload as ApiErrorPayload)
      : null;
  const message =
    typeof details?.message === "string" ? details.message : undefined;
  const sources = Array.isArray(details?.errorSources)
    ? details.errorSources.filter(
        (source): source is ErrorSource =>
          Boolean(source) &&
          typeof source === "object" &&
          "path" in source &&
          typeof source.path === "string" &&
          "message" in source &&
          typeof source.message === "string",
      )
    : [];

  return { message, sources };
}

function getAdjustmentField(path: string): AdjustmentField | undefined {
  const field = path.toLowerCase().split(".").at(-1);
  if (field === "quantity") return "quantity";
  if (field === "reason") return "reason";
  if (field === "movementtype") return "movementType";
  return undefined;
}

export default function StockAdjustmentModal({
  product,
  open,
  revalidateKey,
  onClose,
}: StockAdjustmentModalProps) {
  const [movementType, setMovementType] =
    useState<InventoryMovementType>("increase");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<AdjustmentErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setMovementType("increase");
    setQuantity("");
    setReason("");
    setErrors({});
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleApiError = (error: unknown) => {
    const { message, sources } = readApiError(error);
    const mappedErrors: AdjustmentErrors = {};
    let hasUnmappedError = false;

    for (const source of sources) {
      const field = getAdjustmentField(source.path);
      if (field) {
        mappedErrors[field] = source.message;
      } else {
        hasUnmappedError = true;
      }
    }

    if (Object.keys(mappedErrors).length > 0) {
      setErrors((current) => ({ ...current, ...mappedErrors }));
    }

    if (sources.length === 0 || hasUnmappedError) {
      toast.error(
        message || "The stock adjustment could not be completed.",
      );
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product || isSubmitting) return;

    const nextErrors: AdjustmentErrors = {};
    const quantityValue = Number(quantity);

    if (!quantity.trim() || !Number.isFinite(quantityValue) || quantityValue <= 0) {
      nextErrors.quantity = "Enter a quantity greater than zero.";
    }
    if (!reason.trim()) {
      nextErrors.reason = "Enter a reason for this stock adjustment.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post<InventoryAdjustmentResponse>(
        `/inventory/${encodeURIComponent(product._id)}/adjust`,
        {
          movementType,
          quantity: quantityValue,
          reason: reason.trim(),
        },
      );
      const result = response.data;

      if (!result.success) {
        handleApiError(result);
        return;
      }

      const updatedProduct = result.data.product;
      void mutate<IProductResponse>(
        revalidateKey,
        (current) =>
          current
            ? {
                ...current,
                data: current.data.map((item) =>
                  item._id === updatedProduct._id
                    ? { ...item, stockQuantity: updatedProduct.stockQuantity }
                    : item,
                ),
              }
            : current,
        { revalidate: false },
      );
      void mutate(revalidateKey);
      void mutate(
        (key) => typeof key === "string" && key.startsWith("/inventory/"),
      );

      toast.success(result.message || "Stock adjusted successfully.");
      resetForm();
      onClose();
    } catch (error: unknown) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const numericQuantity = Number(quantity);
  const hasQuantity =
    quantity.trim() !== "" &&
    Number.isFinite(numericQuantity) &&
    numericQuantity > 0;
  const projectedStock = product
    ? product.stockQuantity +
      (movementType === "increase" ? numericQuantity : -numericQuantity)
    : undefined;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-blue/10 text-blue">
            <PackagePlus className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-navy">
            Adjust Stock
          </DialogTitle>
          <DialogDescription className="text-sm leading-6">
            Record a stock increase or decrease for this product.
          </DialogDescription>
          <div className="pt-1">
            <p className="text-sm font-semibold text-navy">
              {product?.name ?? "Selected product"}
            </p>
            {product?.sku && (
              <p className="mt-1 text-xs text-slate-500">SKU: {product.sku}</p>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div className="rounded-xl border border-blue/15 bg-blue/[0.04] p-4">
              <p className="text-xs font-medium text-slate-500">Current stock</p>
              <p className="mt-1 text-lg font-bold text-navy">
                {product?.stockQuantity.toLocaleString("en-BD") ?? "—"} units
              </p>
              {hasQuantity && product && (
                <p className="mt-1 text-xs text-slate-500">
                  Expected stock after adjustment: {projectedStock?.toLocaleString("en-BD")} units
                  <span className="ml-1">(preview; server validation applies)</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-adjustment-type" className="font-semibold text-navy">
                Movement Type
              </Label>
              <Select
                value={movementType}
                onValueChange={(value) => {
                  setMovementType(value === "decrease" ? "decrease" : "increase");
                  setErrors((current) => ({ ...current, movementType: undefined }));
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="stock-adjustment-type"
                  className="h-10 rounded-xl border-slate-200 w-full"
                  aria-invalid={Boolean(errors.movementType)}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase Stock</SelectItem>
                  <SelectItem value="decrease">Decrease Stock</SelectItem>
                </SelectContent>
              </Select>
              {errors.movementType && (
                <p className="text-sm text-destructive">{errors.movementType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-adjustment-quantity" className="font-semibold text-navy">
                Quantity
              </Label>
              <Input
                id="stock-adjustment-quantity"
                type="number"
                min="0.01"
                step="any"
                inputMode="decimal"
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  setErrors((current) => ({ ...current, quantity: undefined }));
                }}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.quantity)}
                aria-describedby={errors.quantity ? "stock-quantity-error" : undefined}
                placeholder="Enter quantity"
                className="h-10 rounded-xl border-slate-200"
              />
              {errors.quantity && (
                <p id="stock-quantity-error" className="text-sm text-destructive">
                  {errors.quantity}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-adjustment-reason" className="font-semibold text-navy">
                Reason
              </Label>
              <Input
                id="stock-adjustment-reason"
                type="text"
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setErrors((current) => ({ ...current, reason: undefined }));
                }}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.reason)}
                aria-describedby={errors.reason ? "stock-reason-error" : undefined}
                placeholder="e.g. New stock received"
                className="h-10 rounded-xl border-slate-200"
              />
              {errors.reason && (
                <p id="stock-reason-error" className="text-sm text-destructive">
                  {errors.reason}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
            <DashboardButton
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="min-h-10 rounded-xl px-5"
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              type="submit"
              disabled={isSubmitting || !product}
              icon={
                isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : movementType === "increase" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )
              }
            >
              {isSubmitting ? "Adjusting..." : "Adjust Stock"}
            </DashboardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
