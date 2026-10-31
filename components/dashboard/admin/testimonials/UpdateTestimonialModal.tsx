"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Star } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { usePatch } from "@/hooks/swr/usePatch";
import type { ITestimonial } from "@/types";

import DashboardButton from "../../DashboardButton";

type UpdateTestimonialModalProps = {
  testimonial: ITestimonial | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
};

const formSchema = z.object({
  clientName: z
    .string()
    .min(1, "Client name is required")
    .max(100, "Client name must be 100 characters or less"),

  clientImage: z
    .object({
      url: z.string().optional(),
      publicId: z.string().optional(),
      alt: z.string().optional(),
    })
    .optional()
    .superRefine((image, ctx) => {
      if (image?.url?.trim() && !image.alt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["alt"],
          message: "Image alt text is required",
        });
      }
    }),

  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),

  content: z
    .string()
    .min(1, "Testimonial content is required")
    .max(2000, "Testimonial content must be 2000 characters or less"),

  status: z.enum(["draft", "published"]),
});

type FormValues = z.infer<typeof formSchema>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(error: unknown) {
  if (isRecord(error)) {
    const response = isRecord(error.response) ? error.response : null;
    const data = response && isRecord(response.data) ? response.data : null;
    for (const candidate of [data?.message, data?.error, error.message]) {
      if (typeof candidate === "string" && candidate.trim()) return candidate;
    }
  }
  return "Failed to update testimonial.";
}

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

const getTestimonialFormValues = (
  testimonial: ITestimonial,
): FormValues => ({
  clientName: testimonial.clientName ?? "",

  clientImage: {
    url: testimonial.clientImage?.url ?? "",
    publicId: testimonial.clientImage?.publicId ?? "",
    alt: testimonial.clientImage?.alt ?? "",
  },

  rating: testimonial.rating ?? 5,

  content: testimonial.content ?? "",

  status:
    testimonial.status === "published" ||
    testimonial.status === "draft"
      ? testimonial.status
      : "draft",
});

export default function UpdateTestimonialModal({
  testimonial,
  open,
  revalidateKey,
  onClose,
}: UpdateTestimonialModalProps) {
  const { mutate: updateTestimonial, isLoading } = usePatch(
    "/testimonial",
    {
      revalidateKey,
    },
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open || !testimonial) return;

    reset(getTestimonialFormValues(testimonial));
  }, [open, testimonial, reset]);

  const handleClose = () => {
    if (isLoading) return;

    onClose();
    reset(defaultValues);
  };

  const onSubmit = async (values: FormValues) => {
    if (!testimonial) return;

    try {
      const payload = {
        clientName: values.clientName,

        ...(values.clientImage?.url
          ? {
              clientImage: {
                url: values.clientImage.url,
                publicId: values.clientImage.publicId,
                alt: values.clientImage.alt || "",
              },
            }
          : {}),

        rating: values.rating,
        content: values.content,
        status: values.status,
      };

      await updateTestimonial({
        id: testimonial._id,
        data: payload,
      });

      toast.success("Testimonial updated successfully.");

      onClose();
      reset(defaultValues);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
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
      <DialogContent className="max-h-[92vh] !max-w-3xl overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="flex max-h-[92vh] flex-col">
          {/* Header */}
          <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Update Testimonial
            </DialogTitle>

            <DialogDescription className="text-sm leading-6">
              Update the customer testimonial information, rating,
              image, and publication status.
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <div className="space-y-7 px-6 py-7 sm:px-8">
              {/* Intro */}
              <div className="rounded-2xl border border-blue/10 bg-blue/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                    <Star className="h-5 w-5 fill-current" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-navy">
                      Customer Testimonial
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Update the customer information, rating, review,
                      and publication status.
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
                    Update the customer&apos;s name and optional
                    profile image.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Client Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="testimonial-client-name"
                      className="text-sm font-semibold text-navy"
                    >
                      Client Name
                    </Label>

                    <Input
                      id="testimonial-client-name"
                      placeholder="e.g. Rahim Ahmed"
                      {...register("clientName")}
                    />

                    {errors.clientName && (
                      <p className="text-sm text-destructive">
                        {errors.clientName.message}
                      </p>
                    )}
                  </div>

                  {/* Publish / Draft Switch */}
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
                        <div className="pr-4">
                          <Label className="font-semibold text-navy">
                            Publish Testimonial
                          </Label>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Turn on to publish this testimonial. Turn
                            off to save it as a draft.
                          </p>
                        </div>

                        <Switch
                          checked={field.value === "published"}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked ? "published" : "draft",
                            )
                          }
                          disabled={isLoading}
                          aria-label="Publish testimonial"
                        />
                      </div>
                    )}
                  />

                  {errors.status && (
                    <p className="text-sm text-destructive">
                      {errors.status.message}
                    </p>
                  )}
                </div>

                {/* Client Image */}
                <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
                  <div>
                    <h4 className="text-sm font-bold text-navy">
                      Client Image
                    </h4>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Optional. Upload a profile image and provide
                      accessible alt text for the customer.
                    </p>
                  </div>

                  {/* Image Uploader */}
                  <Controller
                    control={control}
                    name="clientImage.url"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold">
                          Image
                        </Label>

                        <ImageUploader
                          value={field.value}
                          imagePublicId={watch(
                            "clientImage.publicId",
                          )}
                          onChange={(url, publicId) => {
                            field.onChange(url);

                            setValue(
                              "clientImage.publicId",
                              publicId,
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
                      Alt Text
                    </Label>

                    <Input
                      id="testimonial-image-alt"
                      placeholder="e.g. Rahim Ahmed"
                      aria-required={!!watch("clientImage.url")}
                      {...register("clientImage.alt")}
                    />

                    {errors.clientImage?.alt && (
                      <p
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {errors.clientImage.alt.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>
              {/* Testimonial */}
              <section className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-navy">
                    Testimonial
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Update the customer&apos;s rating and feedback.
                  </p>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-navy">
                    Rating
                  </Label>

                  <Controller
                    control={control}
                    name="rating"
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const rating = index + 1;
                          const isActive = rating <= field.value;

                          return (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => field.onChange(rating)}
                              disabled={isLoading}
                              className={[
                                "flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200",
                                isActive
                                  ? "border-amber-300 bg-amber-50 text-amber-500 shadow-sm"
                                  : "border-slate-200 bg-white text-slate-300 hover:border-amber-200 hover:bg-amber-50/50 hover:text-amber-400",
                              ].join(" ")}
                              aria-label={`${rating} star${
                                rating > 1 ? "s" : ""
                              }`}
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

                        <div className="ml-2 flex items-center text-sm font-semibold text-slate-500">
                          {field.value}/5
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

                {/* Content */}
                <div className="space-y-2">
                  <Label
                    htmlFor="testimonial-content"
                    className="text-sm font-semibold text-navy"
                  >
                    Testimonial Content
                  </Label>

                  <Textarea
                    id="testimonial-content"
                    placeholder="Write the customer's testimonial..."
                    className="min-h-40 resize-none"
                    disabled={isLoading}
                    {...register("content")}
                  />

                  {errors.content && (
                    <p className="text-sm text-destructive">
                      {errors.content.message}
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-between border-t bg-background px-6 py-4 sm:px-8">
              <DashboardButton
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="min-h-10 rounded-xl px-4 text-xs font-bold"
              >
                Cancel
              </DashboardButton>

              <DashboardButton
                type="submit"
                disabled={isLoading || !testimonial}
                icon={
                  isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )
                }
              >
                {isLoading ? "Updating..." : "Update Testimonial"}
              </DashboardButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
