"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FolderTree, Loader2, Plus } from "lucide-react";
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
import { usePost } from "@/hooks/swr/usePost";
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

type CreateCategoryModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  revalidateKey: string;
};

const defaultValues: FormValues = {
  name: "",
  slug: "",
};

export default function CreateCategoryModal({
  isModalOpen,
  setIsModalOpen,
  revalidateKey,
}: CreateCategoryModalProps) {
  const { mutate: createCategory, isLoading } = usePost("/category", {
    revalidateKey,
  });

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
    if (isModalOpen) reset(defaultValues);
  }, [isModalOpen, reset]);

  const handleClose = () => {
    if (isLoading) return;

    setIsModalOpen(false);
    reset(defaultValues);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await createCategory({
        name: values.name.trim(),
        slug: values.slug.trim(),
      });

      if (response?.success === false) {
        toast.error(response.message || "Failed to create category.");
        return;
      }

      toast.success(
        response?.message || "Category created successfully.",
      );
      setIsModalOpen(false);
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
          "Failed to create category.",
      );
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-blue/10 text-blue">
            <FolderTree className="h-5 w-5" />
          </div>

          <DialogTitle className="text-xl font-bold text-navy">
            Add Category
          </DialogTitle>

          <DialogDescription className="text-sm leading-6">
            Create a new product category for Enviroshield.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div className="space-y-2">
              <Label
                htmlFor="category-name"
                className="font-semibold text-navy"
              >
                Category Name
              </Label>

              <Input
                id="category-name"
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
                htmlFor="category-slug"
                className="font-semibold text-navy"
              >
                Slug
              </Label>

              <Input
                id="category-slug"
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
              disabled={isLoading}
              icon={
                isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )
              }
            >
              {isLoading ? "Creating..." : "Create Category"}
            </DashboardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
