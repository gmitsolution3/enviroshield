"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FolderTree, Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePatch } from "@/hooks/swr/usePatch";
import type { ICategory } from "@/types";
import { generateSlug } from "@/utils/generateSlug";

import DashboardButton from "@/components/dashboard/DashboardButton";

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name must be 100 characters or less"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),
});

type FormValues = z.infer<typeof categorySchema>;

type UpdateCategoryModalProps = {
  category: ICategory | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
};

const defaultValues: FormValues = {
  name: "",
  slug: "",
};

export default function UpdateCategoryModal({
  category,
  open,
  revalidateKey,
  onClose,
}: UpdateCategoryModalProps) {
  const { mutate: updateCategory, isLoading } = usePatch(
    "/category",
    {
      revalidateKey,
    },
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open || !category) return;

    reset({
      name: category.name ?? "",
      slug: category.slug ?? "",
    });
  }, [open, category, reset]);

  const handleClose = () => {
    if (isLoading) return;

    onClose();
    reset(defaultValues);
  };

  const onSubmit = async (values: FormValues) => {
    if (!category) return;

    try {
      const response = await updateCategory({
        id: category._id,
        data: {
          name: values.name.trim(),
          slug: values.slug.trim(),
        },
      });

      if (response?.success === false) {
        toast.error(response.message || "Failed to update category.");
        return;
      }

      toast.success(
        response?.message || "Category updated successfully.",
      );
      onClose();
      reset(defaultValues);
    } catch (error: unknown) {
      const responseError = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };

      toast.error(
        responseError.response?.data?.message ||
          responseError.response?.data?.error ||
          responseError.message ||
          "Failed to update category.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) handleClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-blue/10 text-blue">
            <FolderTree className="h-5 w-5" />
          </div>

          <DialogTitle className="text-xl font-bold text-navy">
            Update Category
          </DialogTitle>

          <DialogDescription className="text-sm leading-6">
            Update the name and slug for{" "}
            <span className="font-semibold text-foreground">
              {category?.name ?? "this category"}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div className="space-y-2">
              <Label
                htmlFor="update-category-name"
                className="font-semibold text-navy"
              >
                Category Name
              </Label>

              <Input
                id="update-category-name"
                placeholder="e.g. Waterproofing Solutions"
                autoComplete="off"
                {...register("name", {
                  onChange: (event) => {
                    setValue(
                      "slug",
                      generateSlug(event.target.value),
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  },
                })}
              />

              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="update-category-slug"
                className="font-semibold text-navy"
              >
                Slug
              </Label>

              <Input
                id="update-category-slug"
                placeholder="waterproofing-solutions"
                autoComplete="off"
                {...register("slug")}
              />

              <p className="text-xs leading-5 text-muted-foreground">
                Automatically generated from the category name. You
                can edit it.
              </p>

              {errors.slug && (
                <p className="text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
            <DashboardButton
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="min-h-10 rounded-xl px-5"
            >
              Cancel
            </DashboardButton>

            <DashboardButton
              type="submit"
              disabled={isLoading || !category}
              icon={
                isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )
              }
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </DashboardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
