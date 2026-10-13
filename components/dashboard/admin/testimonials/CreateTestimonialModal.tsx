"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Star, UserRound } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { usePost } from "@/hooks/swr/usePost";
import { usePersistentFormDraft } from "@/hooks/usePersistentFormDraft";

import { ImageUploader } from "@/components/image-uploader";
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

import DashboardButton from "../../DashboardButton";

const imageSchema = z.object({
  url: z.string().optional(),
  publicId: z.string().optional(),
  alt: z.string().optional(),
});

const formSchema = z
  .object({
    clientName: z
      .string()
      .trim()
      .min(1, "Client name is required")
      .max(100, "Client name must be 100 characters or less"),

    clientImage: imageSchema.optional(),

    rating: z
      .number()
      .int("Please select a whole-star rating")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),

    content: z
      .string()
      .trim()
      .min(1, "Testimonial content is required")
      .max(
        2000,
        "Testimonial content must be 2000 characters or less",
      ),

    status: z.enum(["draft", "published"]),
  })
  .superRefine((data, ctx) => {
    if (data.clientImage?.url?.trim()) {
      if (!data.clientImage.alt?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["clientImage", "alt"],
          message:
            "Image alt text is required when an image is uploaded",
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

type CreateTestimonialModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccess?: () => void;
};

const defaultValues: FormValues = {
  clientName: "",
  clientImage: {
    url: "",
    publicId: "",
    alt: "",
  },
  rating: 5,
  content: "",
  status: "draft",
};

export default function CreateTestimonialModal({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}: CreateTestimonialModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: postTestimonial, isLoading } = usePost(
    "/testimonial",
    {
      revalidateKey: "/testimonial",
    },
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur",
  });

  const { clearDraft } = usePersistentFormDraft<FormValues>({
    storageKey: "enviroshield:draft:create-testimonial",
    watch,
    reset,
    defaultValues,
  });

  const clientName = watch("clientName");
  const testimonialContent = watch("content");
  const clientImageUrl = watch("clientImage.url");
  const clientImagePublicId = watch("clientImage.publicId");
  const currentRating = watch("rating");
  const currentStatus = watch("status");

  const isBusy = isLoading || isSubmitting;

  const handleClose = () => {
    if (isBusy) return;

    // Preserve the draft when the user closes the modal.
    setIsModalOpen(false);
  };

  const onSubmit = async (data: FormValues) => {
    if (isBusy) return;

    setIsSubmitting(true);

    try {
      const payload = {
        clientName: data.clientName.trim(),

        ...(data.clientImage?.url?.trim()
          ? {
              clientImage: {
                url: data.clientImage.url,
                alt: data.clientImage.alt?.trim() || "",
                ...(data.clientImage.publicId
                  ? { publicId: data.clientImage.publicId }
                  : {}),
              },
            }
          : {}),

        rating: data.rating,
        content: data.content.trim(),
        status: data.status,
      };

      const response = await postTestimonial(payload);

      if (response?.success) {
        toast.success(
          response.message || "Testimonial created successfully.",
        );

        clearDraft();
        setIsModalOpen(false);

        onSuccess?.();
      } else {
        toast.error(
          response?.message || "Unable to create testimonial.",
        );
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };

      const message =
        apiError?.response?.data?.message ||
        apiError?.response?.data?.error ||
        apiError?.message ||
        "Failed to create testimonial.";

      toast.error(message);

      console.error("Failed to create testimonial:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-h-[92vh] !max-w-3xl overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="flex max-h-[92vh] flex-col">
          {/* Header */}
          <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                <Star className="h-5 w-5 fill-current" />
              </div>

              <div className="min-w-0">
                <DialogTitle className="text-xl font-bold text-navy">
                  Add Testimonial
                </DialogTitle>

                <DialogDescription className="mt-1 text-sm leading-6">
                  Add a customer review to showcase the Enviroshield
                  customer experience.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <div className="space-y-8 px-6 py-7 sm:px-8">
              {/* Intro */}
              <div className="rounded-2xl border border-blue/10 bg-blue/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-navy">
                      Customer Information
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Provide the customer's name, optional profile
                      image, review, rating, and publishing status.
                    </p>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <section className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-navy">
                    Client Information
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Add the details that identify the customer.
                  </p>
                </div>

                {/* Client Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="testimonial-client-name"
                    className="text-sm font-semibold text-navy"
                  >
                    Client Name{" "}
                    <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    id="testimonial-client-name"
                    placeholder="e.g. Rahim Ahmed"
                    maxLength={100}
                    autoComplete="name"
                    aria-invalid={!!errors.clientName}
                    {...register("clientName")}
                  />

                  <div className="flex items-start justify-between gap-3">
                    {errors.clientName ? (
                      <p className="text-sm text-destructive">
                        {errors.clientName.message}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Enter the name as it should appear on the
                        website.
                      </p>
                    )}

                    <span className="shrink-0 text-xs text-muted-foreground">
                      {clientName?.length ?? 0}/100
                    </span>
                  </div>
                </div>

                {/* Client Image */}
                <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
                  <div>
                    <h4 className="text-sm font-bold text-navy">
                      Client Image
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Optional. Upload a customer profile image.
                    </p>
                  </div>

                  <Controller
                    control={control}
                    name="clientImage.url"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold">
                          Profile Image
                        </Label>

                        <ImageUploader
                          value={field.value || ""}
                          imagePublicId={clientImagePublicId || ""}
                          onChange={(url, publicId) => {
                            field.onChange(url);

                            setValue(
                              "clientImage.publicId",
                              publicId || "",
                              {
                                shouldDirty: true,
                                shouldValidate: true,
                              },
                            );
                          }}
                        />

                        {errors.clientImage?.url && (
                          <p className="text-sm text-destructive">
                            {errors.clientImage.url.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <div className="space-y-2">
                    <Label
                      htmlFor="testimonial-image-alt"
                      className="text-sm font-semibold text-navy"
                    >
                      Image Alt Text
                      {clientImageUrl && (
                        <span className="ml-1 text-destructive">
                          *
                        </span>
                      )}
                    </Label>

                    <Input
                      id="testimonial-image-alt"
                      placeholder={
                        clientName || "Describe the client image"
                      }
                      aria-invalid={!!errors.clientImage?.alt}
                      {...register("clientImage.alt")}
                    />

                    <p className="text-xs leading-5 text-muted-foreground">
                      {clientImageUrl
                        ? "Required: describe the person shown in the uploaded image."
                        : "Upload a client image to make this field required."}
                    </p>

                    {errors.clientImage?.alt && (
                      <p className="text-sm text-destructive">
                        {errors.clientImage.alt.message}
                      </p>
                    )}
                  </div>

                  {clientImageUrl && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => {
                        setValue("clientImage.url", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });

                        setValue("clientImage.publicId", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });

                        setValue("clientImage.alt", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                      className="text-xs font-semibold text-destructive underline underline-offset-4 disabled:opacity-50"
                    >
                      Clear client image
                    </button>
                  )}
                </div>
              </section>

              {/* Testimonial Content */}
              <section className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-navy">
                    Testimonial
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Add the customer's feedback and choose a rating.
                  </p>
                </div>

                {/* Rating */}
                <div className="space-y-3 rounded-2xl border bg-muted/10 p-5">
                  <div>
                    <Label className="text-sm font-semibold text-navy">
                      Customer Rating{" "}
                      <span className="text-destructive">*</span>
                    </Label>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Select a rating from one to five stars.
                    </p>
                  </div>

                  <Controller
                    control={control}
                    name="rating"
                    render={({ field }) => (
                      <div
                        className="flex flex-wrap items-center gap-2"
                        role="group"
                        aria-label="Customer rating"
                      >
                        {Array.from({ length: 5 }).map((_, index) => {
                          const rating = index + 1;
                          const isActive = rating <= field.value;

                          return (
                            <button
                              key={rating}
                              type="button"
                              disabled={isBusy}
                              onClick={() => field.onChange(rating)}
                              className={[
                                "flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
                                isActive
                                  ? "border-amber-300 bg-amber-50 text-amber-500 shadow-sm"
                                  : "border-slate-200 bg-background text-slate-300 hover:border-amber-200 hover:bg-amber-50/50 hover:text-amber-400",
                                isBusy
                                  ? "cursor-not-allowed opacity-60"
                                  : "",
                              ].join(" ")}
                              aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
                              aria-pressed={field.value === rating}
                            >
                              <Star
                                className={[
                                  "h-5 w-5",
                                  isActive ? "fill-current" : "",
                                ].join(" ")}
                              />
                            </button>
                          );
                        })}

                        <div className="ml-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                          <span className="text-lg text-amber-500">
                            {currentRating}/5
                          </span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {currentRating === 5
                              ? "Excellent"
                              : currentRating === 4
                                ? "Very good"
                                : currentRating === 3
                                  ? "Good"
                                  : currentRating === 2
                                    ? "Fair"
                                    : "Poor"}
                          </span>
                        </div>
                      </div>
                    )}
                  />

                  {errors.rating && (
                    <p className="text-sm text-destructive">
                      {errors.rating.message}
                    </p>
                  )}
                </div>

                {/* Testimonial Text */}
                <div className="space-y-2">
                  <Label
                    htmlFor="testimonial-content"
                    className="text-sm font-semibold text-navy"
                  >
                    Testimonial Content{" "}
                    <span className="text-destructive">*</span>
                  </Label>

                  <Textarea
                    id="testimonial-content"
                    placeholder="Write the customer's testimonial..."
                    className="min-h-40 resize-y"
                    maxLength={2000}
                    aria-invalid={!!errors.content}
                    {...register("content")}
                  />

                  <div className="flex items-start justify-between gap-3">
                    {errors.content ? (
                      <p className="text-sm text-destructive">
                        {errors.content.message}
                      </p>
                    ) : (
                      <p className="text-xs leading-5 text-muted-foreground">
                        Keep the testimonial authentic, clear, and
                        concise.
                      </p>
                    )}

                    <span
                      className={[
                        "shrink-0 text-xs",
                        (testimonialContent?.length ?? 0) >= 2000
                          ? "font-semibold text-destructive"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {testimonialContent?.length ?? 0}/2000
                    </span>
                  </div>
                </div>
              </section>

              {/* Publishing */}
              <section className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-navy">
                    Publishing
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Choose whether the testimonial should be visible
                    on the website.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-6 rounded-2xl border bg-muted/10 p-5">
                  <div className="min-w-0 pr-2">
                    <Label
                      htmlFor="testimonial-status"
                      className="text-sm font-semibold text-navy"
                    >
                      Publish Testimonial
                    </Label>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {currentStatus === "published"
                        ? "This testimonial will be submitted as published."
                        : "This testimonial will be saved as a draft."}
                    </p>

                    <p
                      className={[
                        "mt-2 text-xs font-semibold",
                        currentStatus === "published"
                          ? "text-emerald-600"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {currentStatus === "published"
                        ? "Status: Published"
                        : "Status: Draft"}
                    </p>
                  </div>

                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Switch
                        id="testimonial-status"
                        checked={field.value === "published"}
                        onCheckedChange={(checked) => {
                          field.onChange(
                            checked ? "published" : "draft",
                          );
                        }}
                        disabled={isBusy}
                        aria-label="Publish testimonial"
                      />
                    )}
                  />
                </div>
              </section>

              {/* Draft Notice */}
              {isDirty && (
                <p className="text-xs leading-5 text-muted-foreground">
                  Your changes are saved locally as a draft while you
                  work. The draft is cleared after successful
                  creation.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t bg-background px-6 py-4 sm:px-8">
              <DashboardButton
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isBusy}
                className="min-h-10 rounded-xl px-4 text-xs font-bold"
              >
                Cancel
              </DashboardButton>

              <DashboardButton
                type="submit"
                disabled={isBusy}
                icon={
                  isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )
                }
              >
                {isBusy ? "Creating..." : "Create Testimonial"}
              </DashboardButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
