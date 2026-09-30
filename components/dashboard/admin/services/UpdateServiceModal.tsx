"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePatch } from "@/hooks/swr/usePatch";
import type { IService } from "@/types";
import { generateSlug } from "@/utils/generateSlug";

import DashboardButton from "../../DashboardButton";

type UpdateServiceModalProps = {
  service: IService | null;
  open: boolean;
  onClose: () => void;
};

const imageSchema = z.object({
  url: z.string().min(1, "Image is required"),
  alt: z.string().min(1, "Image alt text is required"),
  caption: z.string().min(1, "Image caption is required"),
});

const contentItemSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z.string().min(1, "Description is required"),
});

const contentSectionSchema = z.object({
  image: imageSchema,
  items: z
    .array(contentItemSchema)
    .min(1, "At least one item is required"),
});

const seoSchema = z.object({
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  keywords: z
    .array(z.string().min(1, "Keyword cannot be empty"))
    .min(1, "At least one keyword is required"),
  canonicalUrl: z
    .string()
    .min(1, "Canonical URL is required")
    .url("Enter a valid canonical URL"),
  ogTitle: z.string().min(1, "OG title is required"),
  ogDescription: z.string().min(1, "OG description is required"),
  ogImage: z
    .string()
    .min(1, "OG image is required")
    .url("Enter a valid OG image URL"),
  noIndex: z.boolean(),
});

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Service name is required")
    .max(100, "Service name must be 100 characters or less"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  isFeatured: z.boolean(),

  primaryImage: imageSchema,

  detailHeading: z.string().min(1, "Detail heading is required"),

  description: z.string().min(1, "Description is required"),

  whyEnviroshield: contentSectionSchema,

  process: contentSectionSchema,

  benefits: contentSectionSchema,

  status: z.enum(["draft", "published"]),

  seo: seoSchema,
});

type FormValues = z.infer<typeof formSchema>;

const createDefaultContentSection = () => ({
  image: {
    url: "",
    alt: "",
    caption: "",
  },
  items: [
    {
      title: "",
      description: "",
    },
  ],
});

const defaultValues: FormValues = {
  name: "",
  slug: "",
  isFeatured: false,

  primaryImage: {
    url: "",
    alt: "",
    caption: "",
  },

  detailHeading: "",
  description: "",

  whyEnviroshield: createDefaultContentSection(),
  process: createDefaultContentSection(),
  benefits: createDefaultContentSection(),

  status: "draft",

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    noIndex: false,
  },
};

const steps = [
  {
    number: "01",
    title: "Basic Information",
    shortTitle: "Basic",
    description: "Service details and primary image",
  },
  {
    number: "02",
    title: "Why Enviroshield",
    shortTitle: "Why Us",
    description: "Why customers should choose Enviroshield",
  },
  {
    number: "03",
    title: "Process",
    shortTitle: "Process",
    description: "How this service is delivered",
  },
  {
    number: "04",
    title: "Benefits",
    shortTitle: "Benefits",
    description: "Key benefits customers receive",
  },
  {
    number: "05",
    title: "SEO",
    shortTitle: "SEO",
    description: "Search and social sharing settings",
  },
];

const getServiceFormValues = (service: IService): FormValues => ({
  name: service.name ?? "",
  slug: service.slug ?? "",
  isFeatured: service.isFeatured ?? false,

  primaryImage: {
    url: service.primaryImage?.url ?? "",
    alt: service.primaryImage?.alt ?? "",
    caption: service.primaryImage?.caption ?? "",
  },

  detailHeading: service.detailHeading ?? "",
  description: service.description ?? "",

  whyEnviroshield: {
    image: {
      url: service.whyEnviroshield?.image?.url ?? "",
      alt: service.whyEnviroshield?.image?.alt ?? "",
      caption: service.whyEnviroshield?.image?.caption ?? "",
    },
    items:
      service.whyEnviroshield?.items?.length > 0
        ? service.whyEnviroshield.items.map((item) => ({
            title: item.title ?? "",
            description: item.description ?? "",
          }))
        : [
            {
              title: "",
              description: "",
            },
          ],
  },

  process: {
    image: {
      url: service.process?.image?.url ?? "",
      alt: service.process?.image?.alt ?? "",
      caption: service.process?.image?.caption ?? "",
    },
    items:
      service.process?.items?.length > 0
        ? service.process.items.map((item) => ({
            title: item.title ?? "",
            description: item.description ?? "",
          }))
        : [
            {
              title: "",
              description: "",
            },
          ],
  },

  benefits: {
    image: {
      url: service.benefits?.image?.url ?? "",
      alt: service.benefits?.image?.alt ?? "",
      caption: service.benefits?.image?.caption ?? "",
    },
    items:
      service.benefits?.items?.length > 0
        ? service.benefits.items.map((item) => ({
            title: item.title ?? "",
            description: item.description ?? "",
          }))
        : [
            {
              title: "",
              description: "",
            },
          ],
  },

  status:
    service.status === "published" || service.status === "draft"
      ? service.status
      : "draft",

  seo: {
    metaTitle: service.seo?.metaTitle ?? "",
    metaDescription: service.seo?.metaDescription ?? "",
    keywords: service.seo?.keywords ?? [],
    canonicalUrl: service.seo?.canonicalUrl ?? "",
    ogTitle: service.seo?.ogTitle ?? "",
    ogDescription: service.seo?.ogDescription ?? "",
    ogImage: service.seo?.ogImage ?? "",
    noIndex: service.seo?.noIndex ?? false,
  },
});

export default function UpdateServiceModal({
  service,
  open,
  onClose,
}: UpdateServiceModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  const { mutate: updateService, isLoading } = usePatch("/service", {
    revalidateKey: "/service",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const whyEnviroshieldItems = useFieldArray({
    control,
    name: "whyEnviroshield.items",
  });

  const processItems = useFieldArray({
    control,
    name: "process.items",
  });

  const benefitsItems = useFieldArray({
    control,
    name: "benefits.items",
  });

  const currentKeywords = watch("seo.keywords");

  useEffect(() => {
    if (!open || !service) return;

    reset(getServiceFormValues(service));
    setCurrentStep(0);
    setSeoKeywordInput("");
  }, [open, service, reset]);

  const handleClose = () => {
    if (isLoading) return;

    onClose();
    reset(defaultValues);
    setCurrentStep(0);
    setSeoKeywordInput("");
  };

  const handleNextStep = async () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = await trigger([
          "name",
          "slug",
          "isFeatured",
          "primaryImage",
          "detailHeading",
          "description",
          "status",
        ]);
        break;

      case 1:
        isValid = await trigger("whyEnviroshield");
        break;

      case 2:
        isValid = await trigger("process");
        break;

      case 3:
        isValid = await trigger("benefits");
        break;

      case 4:
        isValid = await trigger("seo");
        break;
    }

    if (!isValid) return;

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handlePreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex >= currentStep) return;

    setCurrentStep(stepIndex);
  };

  const addKeyword = () => {
    const keyword = seoKeywordInput.trim();

    if (!keyword) return;

    if (currentKeywords.includes(keyword)) {
      toast.error("This keyword already exists.");
      return;
    }

    setValue("seo.keywords", [...currentKeywords, keyword], {
      shouldValidate: true,
    });

    setSeoKeywordInput("");
  };

  const removeKeyword = (index: number) => {
    setValue(
      "seo.keywords",
      currentKeywords.filter(
        (_, keywordIndex) => keywordIndex !== index,
      ),
      {
        shouldValidate: true,
      },
    );
  };

  const onSubmit = async (values: FormValues) => {
    if (!service) return;

    try {
      await updateService({
        id: service._id,
        data: {
          name: values.name,
          slug: values.slug,
          isFeatured: values.isFeatured,
          primaryImage: values.primaryImage,
          detailHeading: values.detailHeading,
          description: values.description,
          whyEnviroshield: values.whyEnviroshield,
          process: values.process,
          benefits: values.benefits,
          status: values.status,
          seo: values.seo,
        },
      });

      toast.success("Service updated successfully.");

      onClose();
      reset(defaultValues);
      setCurrentStep(0);
      setSeoKeywordInput("");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update service.";

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
      <DialogContent className="max-h-[92vh] !max-w-5xl overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Update Service
            </DialogTitle>

            <DialogDescription className="text-sm leading-6">
              Update the details, content, and SEO settings for{" "}
              <span className="font-semibold text-foreground">
                {service?.name ?? "this service"}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          {/* Step Timeline */}
          <div className="border-b bg-muted/20 px-5 py-5 sm:px-8">
            <div className="relative">
              <div className="absolute left-[7%] right-[7%] top-5 hidden h-px bg-border md:block" />

              <div className="relative grid grid-cols-5 gap-2">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isActive = index === currentStep;

                  return (
                    <button
                      key={step.number}
                      type="button"
                      disabled={index >= currentStep}
                      onClick={() => handleStepClick(index)}
                      className="group flex flex-col items-center text-center disabled:cursor-default"
                    >
                      <div
                        className={[
                          "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200",
                          isCompleted
                            ? "border-blue bg-blue text-white shadow-md shadow-blue/20"
                            : isActive
                              ? "border-blue bg-white text-blue shadow-md shadow-blue/15"
                              : "border-border bg-white text-muted-foreground",
                        ].join(" ")}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          step.number
                        )}
                      </div>

                      <div className="mt-3 hidden md:block">
                        <p
                          className={[
                            "text-xs font-bold",
                            isActive || isCompleted
                              ? "text-navy"
                              : "text-muted-foreground",
                          ].join(" ")}
                        >
                          {step.title}
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      <p
                        className={[
                          "mt-2 text-[10px] font-bold md:hidden",
                          isActive || isCompleted
                            ? "text-blue"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {step.shortTitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <div className="space-y-8 px-6 py-7 sm:px-8">
              {/* STEP 1 */}
              {currentStep === 0 && (
                <FormSection
                  title="Basic Information"
                  description="Set the main information customers will see for this service."
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <Field
                      label="Service Name"
                      error={errors.name?.message}
                    >
                      <Input
                        {...register("name", {
                          onChange: (event) => {
                            setValue(
                              "slug",
                              generateSlug(event.target.value),
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              },
                            );
                          },
                        })}
                        placeholder="e.g. Interior Painting"
                      />
                    </Field>

                    <Field label="Slug" error={errors.slug?.message}>
                      <Input
                        {...register("slug")}
                        placeholder="interior-painting"
                      />
                    </Field>
                  </div>

                  <Field
                    label="Detail Heading"
                    error={errors.detailHeading?.message}
                  >
                    <Input
                      {...register("detailHeading")}
                      placeholder="Professional interior painting services"
                    />
                  </Field>

                  <Field
                    label="Description"
                    error={errors.description?.message}
                  >
                    <Textarea
                      {...register("description")}
                      placeholder="Describe this service..."
                      className="min-h-32 resize-none"
                    />
                  </Field>

                  <ImageFields
                    control={control}
                    register={register}
                    setValue={setValue}
                    name="primaryImage"
                    label="Primary Image"
                    errors={errors.primaryImage}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <Controller
                      control={control}
                      name="isFeatured"
                      render={({ field }) => (
                        <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
                          <div className="pr-4">
                            <Label className="font-semibold text-navy">
                              Featured Service
                            </Label>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              Highlight this service on the website.
                            </p>
                          </div>

                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      )}
                    />

                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Field
                          label="Status"
                          error={errors.status?.message}
                        >
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="draft">
                                Draft
                              </SelectItem>
                              <SelectItem value="published">
                                Published
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                  </div>
                </FormSection>
              )}

              {/* STEP 2 */}
              {currentStep === 1 && (
                <ContentSection
                  title="Why Enviroshield"
                  description="Explain why customers should choose Enviroshield for this service."
                  control={control}
                  setValue={setValue}
                  register={register}
                  errors={errors}
                  imageName="whyEnviroshield.image"
                  items={whyEnviroshieldItems}
                  itemName="whyEnviroshield.items"
                />
              )}

              {/* STEP 3 */}
              {currentStep === 2 && (
                <ContentSection
                  title="Process"
                  description="Describe the process customers can expect when using this service."
                  control={control}
                  setValue={setValue}
                  register={register}
                  errors={errors}
                  imageName="process.image"
                  items={processItems}
                  itemName="process.items"
                />
              )}

              {/* STEP 4 */}
              {currentStep === 3 && (
                <ContentSection
                  title="Benefits"
                  description="Highlight the main benefits customers receive from this service."
                  control={control}
                  setValue={setValue}
                  register={register}
                  errors={errors}
                  imageName="benefits.image"
                  items={benefitsItems}
                  itemName="benefits.items"
                />
              )}

              {/* STEP 5 */}
              {currentStep === 4 && (
                <FormSection
                  title="SEO & Social"
                  description="Configure how this service appears in search engines and social sharing."
                >
                  <Field
                    label="Meta Title"
                    error={errors.seo?.metaTitle?.message}
                  >
                    <Input
                      {...register("seo.metaTitle")}
                      placeholder="Service meta title"
                    />
                  </Field>

                  <Field
                    label="Meta Description"
                    error={errors.seo?.metaDescription?.message}
                  >
                    <Textarea
                      {...register("seo.metaDescription")}
                      placeholder="Service meta description"
                      className="min-h-28 resize-none"
                    />
                  </Field>

                  <div className="space-y-3">
                    <Label>Keywords</Label>

                    <div className="flex gap-2">
                      <Input
                        value={seoKeywordInput}
                        onChange={(event) =>
                          setSeoKeywordInput(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addKeyword();
                          }
                        }}
                        placeholder="Add a keyword"
                      />

                      <DashboardButton
                        type="button"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={addKeyword}
                        className="min-h-10 shrink-0 rounded-xl bg-blue px-4 text-xs font-bold text-white hover:bg-[#005cb9]"
                      >
                        Add
                      </DashboardButton>
                    </div>

                    {currentKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentKeywords.map((keyword, index) => (
                          <div
                            key={`${keyword}-${index}`}
                            className="flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1.5 text-xs font-medium"
                          >
                            <span>{keyword}</span>

                            <button
                              type="button"
                              onClick={() => removeKeyword(index)}
                              className="text-muted-foreground transition-colors hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.seo?.keywords?.message && (
                      <p className="text-xs text-red-600">
                        {errors.seo.keywords.message}
                      </p>
                    )}
                  </div>

                  <Field
                    label="Canonical URL"
                    error={errors.seo?.canonicalUrl?.message}
                  >
                    <Input
                      {...register("seo.canonicalUrl")}
                      placeholder="https://example.com/service"
                    />
                  </Field>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Field
                      label="OG Title"
                      error={errors.seo?.ogTitle?.message}
                    >
                      <Input
                        {...register("seo.ogTitle")}
                        placeholder="Social sharing title"
                      />
                    </Field>

                    <Field
                      label="OG Image"
                      error={errors.seo?.ogImage?.message}
                    >
                      <Input
                        {...register("seo.ogImage")}
                        placeholder="https://..."
                      />
                    </Field>
                  </div>

                  <Field
                    label="OG Description"
                    error={errors.seo?.ogDescription?.message}
                  >
                    <Textarea
                      {...register("seo.ogDescription")}
                      placeholder="Social sharing description"
                      className="min-h-28 resize-none"
                    />
                  </Field>

                  <Controller
                    control={control}
                    name="seo.noIndex"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
                        <div className="pr-4">
                          <Label className="font-semibold text-navy">
                            No Index
                          </Label>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Prevent search engines from indexing this
                            service.
                          </p>
                        </div>

                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </FormSection>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-between border-t bg-background px-6 py-4 sm:px-8">
              <div>
                {currentStep > 0 ? (
                  <DashboardButton
                    type="button"
                    variant="outline"
                    icon={<ChevronLeft className="h-4 w-4" />}
                    onClick={handlePreviousStep}
                    disabled={isLoading}
                    className="min-h-10 rounded-xl px-4 text-xs font-bold"
                  >
                    Back
                  </DashboardButton>
                ) : (
                  <DashboardButton
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="min-h-10 rounded-xl px-4 text-xs font-bold"
                  >
                    Cancel
                  </DashboardButton>
                )}
              </div>

              <div>
                {currentStep < steps.length - 1 ? (
                  <DashboardButton
                    type="button"
                    icon={<ChevronRight className="h-4 w-4" />}
                    onClick={handleNextStep}
                    disabled={isLoading}
                  >
                    Continue
                  </DashboardButton>
                ) : (
                  <DashboardButton
                    type="submit"
                    disabled={isLoading || !service}
                    icon={
                      isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )
                    }
                    className="min-h-10 rounded-xl px-5 text-xs font-bold"
                  >
                    {isLoading ? "Updating..." : "Update Service"}
                  </DashboardButton>
                )}
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-navy">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-navy">
        {label}
      </Label>

      {children}

      {error && (
        <p className="text-xs leading-5 text-red-600">{error}</p>
      )}
    </div>
  );
}

function ImageFields({
  control,
  register,
  setValue,
  name,
  label,
  errors,
}: {
  control: any;
  register: any;
  setValue: any;
  name:
    | "primaryImage"
    | "whyEnviroshield.image"
    | "process.image"
    | "benefits.image";
  label: string;
  errors?: any;
}) {
  return (
    <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
      <div>
        <h4 className="text-sm font-bold text-navy">{label}</h4>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload the image and provide accessible metadata.
        </p>
      </div>

      <Controller
        control={control}
        name={`${name}.url`}
        render={({ field }) => (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Image</Label>

            <ImageUploader
              value={field.value}
              onChange={(url) => {
                setValue(`${name}.url`, url, {
                  shouldValidate: true,
                });
              }}
            />

            {errors?.url?.message && (
              <p className="text-xs text-red-600">
                {errors.url.message}
              </p>
            )}
          </div>
        )}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Alt Text" error={errors?.alt?.message}>
          <Input
            {...register(`${name}.alt`)}
            placeholder="Describe the image"
          />
        </Field>

        <Field label="Caption" error={errors?.caption?.message}>
          <Input
            {...register(`${name}.caption`)}
            placeholder="Image caption"
          />
        </Field>
      </div>
    </div>
  );
}

function ContentSection({
  title,
  description,
  control,
  setValue,
  register,
  errors,
  imageName,
  items,
  itemName,
}: {
  title: string;
  description: string;
  control: any;
  setValue: any;
  register: any;
  errors: any;
  imageName:
    | "whyEnviroshield.image"
    | "process.image"
    | "benefits.image";
  items: any;
  itemName:
    | "whyEnviroshield.items"
    | "process.items"
    | "benefits.items";
}) {
  const sectionError = errors?.[imageName.split(".")[0]];

  return (
    <FormSection title={title} description={description}>
      <ImageFields
        control={control}
        register={register}
        setValue={setValue}
        name={imageName}
        label={`${title} Image`}
        errors={sectionError?.image}
      />

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-navy">
              Content Items
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Add the points you want to highlight in this section.
            </p>
          </div>

          <DashboardButton
            type="button"
            icon={<Plus className="h-4 w-4" />}
            onClick={() =>
              items.append({
                title: "",
                description: "",
              })
            }
            className="min-h-9 rounded-xl bg-blue px-4 text-xs font-bold text-white hover:bg-[#005cb9]"
          >
            Add Item
          </DashboardButton>
        </div>

        <div className="space-y-4">
          {items.fields.map((item: any, index: number) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-muted/10 p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue">
                    Item {String(index + 1).padStart(2, "0")}
                  </p>
                </div>

                {items.fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => items.remove(index)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <Field
                  label="Title"
                  error={
                    errors?.[itemName.split(".")[0]]?.items?.[index]
                      ?.title?.message
                  }
                >
                  <Input
                    {...register(`${itemName}.${index}.title`)}
                    placeholder="Content item title"
                  />
                </Field>

                <Field
                  label="Description"
                  error={
                    errors?.[itemName.split(".")[0]]?.items?.[index]
                      ?.description?.message
                  }
                >
                  <Textarea
                    {...register(`${itemName}.${index}.description`)}
                    placeholder="Describe this point..."
                    className="min-h-28 resize-none"
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>

        {sectionError?.items?.message && (
          <p className="text-xs text-red-600">
            {sectionError.items.message}
          </p>
        )}
      </div>
    </FormSection>
  );
}
