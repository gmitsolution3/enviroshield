"use client";

import { FormSection } from "../common/FormSection";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import { usePost } from "@/hooks/swr/usePost";
import { generateSlug } from "@/utils/generateSlug";
import { toast } from "sonner";
import DashboardButton from "../../DashboardButton";

import { usePersistentFormDraft } from "@/hooks/usePersistentFormDraft";

const imageSchema = z.object({
  url: z.string().min(1, "Image is required"),
  publicId: z.string().min(1, "Image public ID is required"),
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
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string().min(1, "Keyword cannot be empty")),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Enter a valid OG image URL",
    ),
  ogImagePublicId: z.string().optional(),
  noIndex: z.boolean(),
});

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Service name is required")
    .max(100, "Service name must be 100 characters or less"),
  price: z.number().min(0, "Price must be 0 or positive"),
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

type CreateServiceModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccess?: () => void;
};

const createDefaultContentSection = () => ({
  image: {
    url: "",
    publicId: "",
    alt: "",
    caption: "",
  },
  items: [{ title: "", description: "" }],
});

const defaultValues: FormValues = {
  name: "",
  price: 0,
  slug: "",
  isFeatured: false,
  primaryImage: {
    url: "",
    alt: "",
    publicId: "",
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
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogImagePublicId: "",
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

export default function CreateServiceModal({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}: CreateServiceModalProps) {
  const [seoKeywordInput, setSeoKeywordInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  // Once the user chooses a custom OG image, do not replace it
  // automatically when the primary image changes.
  const [ogImageCustomized, setOgImageCustomized] = useState(false);

  const { mutate: postService, isLoading } = usePost("/service", {
    revalidateKey: "/service",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { clearDraft } = usePersistentFormDraft<FormValues>({
    storageKey: "enviroshield:draft:create-service",
    watch,
    reset,
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

  const currentKeywords = watch("seo.keywords") ?? [];

  const currentMetaTitle = watch("seo.metaTitle");
  const currentOgTitle = watch("seo.ogTitle");
  const currentMetaDescription = watch("seo.metaDescription");
  const currentOgDescription = watch("seo.ogDescription");

  const stepFields = [
    [
      "name",
      "price",
      "slug",
      "isFeatured",
      "primaryImage",
      "detailHeading",
      "description",
      "status",
    ],
    ["whyEnviroshield"],
    ["process"],
    ["benefits"],
    ["seo"],
  ] as const;

  const handleClose = () => {
    if (isLoading) return;

    setIsModalOpen(false);
    setSeoKeywordInput("");
    setCurrentStep(0);
    setOgImageCustomized(false);
  };

  const handleNextStep = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const isValid = await trigger(stepFields[currentStep]);

    if (!isValid) return;

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handlePreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex >= currentStep) return;
    setCurrentStep(stepIndex);
  };

  // Keep OG image in sync with the primary image until customized.
  const syncOgImageWithPrimary = (url: string, publicId: string) => {
    if (ogImageCustomized) return;

    setValue("seo.ogImage", url, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("seo.ogImagePublicId", publicId, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        name: data.name,
        price: Number(data.price) || 0,
        slug: data.slug,
        isFeatured: data.isFeatured,

        primaryImage: {
          url: data.primaryImage.url,
          publicId: data.primaryImage.publicId,
          alt: data.primaryImage.alt,
          caption: data.primaryImage.caption,
        },

        detailHeading: data.detailHeading,
        description: data.description,

        whyEnviroshield: {
          image: {
            url: data.whyEnviroshield.image.url,
            publicId: data.whyEnviroshield.image.publicId,
            alt: data.whyEnviroshield.image.alt,
            caption: data.whyEnviroshield.image.caption,
          },
          items: data.whyEnviroshield.items,
        },

        process: {
          image: {
            url: data.process.image.url,
            publicId: data.process.image.publicId,
            alt: data.process.image.alt,
            caption: data.process.image.caption,
          },
          items: data.process.items,
        },

        benefits: {
          image: {
            url: data.benefits.image.url,
            publicId: data.benefits.image.publicId,
            alt: data.benefits.image.alt,
            caption: data.benefits.image.caption,
          },
          items: data.benefits.items,
        },

        status: data.status,

        seo: {
          metaTitle: data.seo?.metaTitle?.trim() || undefined,
          metaDescription: data.seo?.metaDescription?.trim() || undefined,
          keywords: data.seo?.keywords?.filter(Boolean) || [],
          ogTitle: data.seo?.ogTitle?.trim() || undefined,
          ogDescription: data.seo?.ogDescription?.trim() || undefined,
          ogImage: data.seo?.ogImage?.trim() || undefined,
          ogImagePublicId: data.seo?.ogImagePublicId?.trim() || undefined,
          noIndex: Boolean(data.seo?.noIndex),
        },
      };

      const response = await postService(payload);

      if (response?.success) {
        toast.success(response.message);

        clearDraft();
        setIsModalOpen(false);
        setSeoKeywordInput("");
        setCurrentStep(0);
        setOgImageCustomized(false);
        onSuccess?.();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create service.";

      toast.error(message);
      console.error("Failed to create service:", message);
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-h-[92vh] !max-w-5xl overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Add Service
            </DialogTitle>

            <DialogDescription className="text-sm leading-6">
              Create a new Enviroshield service and configure all
              service, content, and SEO information.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <div className="space-y-8 px-6 py-7 sm:px-8">
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

              {/* Step 1 — Basic Information */}
              {currentStep === 0 && (
                <FormSection
                  title="Basic Information"
                  description="Configure the basic information for this service."
                >
                  <div className="grid gap-5 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label
                        className="text-sm font-semibold text-navy"
                        htmlFor="service-name"
                      >
                        Service Name
                      </Label>

                      <Input
                        id="service-name"
                        placeholder="e.g. Roof Waterproofing"
                        {...register("name")}
                        onChange={(event) => {
                          const value = event.target.value;

                          setValue("name", value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });

                          setValue("slug", generateSlug(value), {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                      />

                      {errors.name && (
                        <p className="text-sm text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        className="text-sm font-semibold text-navy"
                        htmlFor="service-slug"
                      >
                        Slug
                      </Label>

                      <Input
                        id="service-slug"
                        placeholder="roof-waterproofing"
                        {...register("slug")}
                      />

                      {errors.slug && (
                        <p className="text-sm text-destructive">
                          {errors.slug.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        className="text-sm font-semibold text-navy"
                        htmlFor="service-price"
                      >
                        Starting Price (BDT)
                      </Label>

                      <Input
                        id="service-price"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 12000"
                        {...register("price", { valueAsNumber: true })}
                      />

                      {errors.price && (
                        <p className="text-sm text-destructive">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      className="text-sm font-semibold text-navy"
                      htmlFor="detail-heading"
                    >
                      Detail Heading
                    </Label>

                    <Input
                      id="detail-heading"
                      placeholder="Professional Roof Waterproofing Solutions"
                      {...register("detailHeading")}
                    />

                    {errors.detailHeading && (
                      <p className="text-sm text-destructive">
                        {errors.detailHeading.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      className="text-sm font-semibold text-navy"
                      htmlFor="service-description"
                    >
                      Description
                    </Label>

                    <Textarea
                      id="service-description"
                      placeholder="Describe the service..."
                      className="min-h-32 resize-none"
                      {...register("description")}
                    />

                    {errors.description && (
                      <p className="text-sm text-destructive">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <ImageFields
                    title="Primary Image"
                    urlName="primaryImage.url"
                    publicIdName="primaryImage.publicId"
                    altName="primaryImage.alt"
                    captionName="primaryImage.caption"
                    control={control}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    onImageChange={syncOgImageWithPrimary}
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <Controller
                      control={control}
                      name="isFeatured"
                      render={({ field }) => (
                        <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
                          <div>
                            <Label className="font-semibold text-navy">
                              Featured Service
                            </Label>

                            <p className="mt-1 text-sm text-muted-foreground">
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
                        <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
                          <div>
                            <Label className="font-semibold text-navy">
                              Publish Service
                            </Label>

                            <p className="mt-1 text-sm text-muted-foreground">
                              Turn on to publish this service. Turn
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
                </FormSection>
              )}

              {/* Step 2 — Why Enviroshield */}
              {currentStep === 1 && (
                <ContentSection
                  title="Why Enviroshield"
                  description="Explain why customers should choose Enviroshield for this service."
                  sectionName="whyEnviroshield"
                  control={control}
                  register={register}
                  errors={errors}
                  fields={whyEnviroshieldItems}
                  setValue={setValue}
                  watch={watch}
                />
              )}

              {/* Step 3 — Process */}
              {currentStep === 2 && (
                <ContentSection
                  title="Process"
                  description="Describe the process involved in delivering this service."
                  sectionName="process"
                  control={control}
                  register={register}
                  errors={errors}
                  fields={processItems}
                  setValue={setValue}
                  watch={watch}
                />
              )}

              {/* Step 4 — Benefits */}
              {currentStep === 3 && (
                <ContentSection
                  title="Benefits"
                  description="Highlight the main benefits customers receive from this service."
                  sectionName="benefits"
                  control={control}
                  register={register}
                  errors={errors}
                  fields={benefitsItems}
                  setValue={setValue}
                  watch={watch}
                />
              )}

              {/* Step 5 — SEO */}
              {currentStep === 4 && (
                <FormSection
                  title="SEO"
                  description="Configure search engine and social sharing information for this service."
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="seo-meta-title">
                        Meta Title
                      </Label>

                      <Input
                        id="seo-meta-title"
                        placeholder="Roof Waterproofing Services in Bangladesh | Enviroshield"
                        {...register("seo.metaTitle", {
                          onChange: (event) => {
                            const nextValue = event.target.value;

                            if (
                              !currentOgTitle ||
                              currentOgTitle === currentMetaTitle
                            ) {
                              setValue("seo.ogTitle", nextValue, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }
                          },
                        })}
                      />

                      {errors.seo?.metaTitle && (
                        <p className="text-sm text-destructive">
                          {errors.seo.metaTitle.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seo-meta-description">
                        Meta Description
                      </Label>

                      <Textarea
                        id="seo-meta-description"
                        rows={3}
                        placeholder="Professional roof waterproofing solutions..."
                        {...register("seo.metaDescription", {
                          onChange: (event) => {
                            const nextValue = event.target.value;

                            if (
                              !currentOgDescription ||
                              currentOgDescription ===
                                currentMetaDescription
                            ) {
                              setValue(
                                "seo.ogDescription",
                                nextValue,
                                {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                },
                              );
                            }
                          },
                        })}
                      />

                      {errors.seo?.metaDescription && (
                        <p className="text-sm text-destructive">
                          {errors.seo.metaDescription.message}
                        </p>
                      )}
                    </div>

                    {/* Keywords */}
                    <div className="space-y-3">
                      <div>
                        <Label>Keywords</Label>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Add at least one SEO keyword.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Input
                          value={seoKeywordInput}
                          onChange={(event) =>
                            setSeoKeywordInput(event.target.value)
                          }
                          placeholder="e.g. roof waterproofing"
                        />

                        <DashboardButton
                          type="button"
                          variant="outline"
                          icon={<Plus className="h-4 w-4" />}
                          onClick={() => {
                            const keyword = seoKeywordInput.trim();

                            if (!keyword) return;
                            if (currentKeywords.includes(keyword))
                              return;

                            setValue(
                              "seo.keywords",
                              [...currentKeywords, keyword],
                              {
                                shouldDirty: true,
                                shouldValidate: true,
                              },
                            );

                            setSeoKeywordInput("");
                          }}
                          className="h-10 shrink-0 rounded-full border-blue/30 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
                        >
                          Add
                        </DashboardButton>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {currentKeywords.map((keyword, index) => (
                          <div
                            key={`${keyword}-${index}`}
                            className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm"
                          >
                            <span>{keyword}</span>

                            <button
                              type="button"
                              onClick={() => {
                                const updatedKeywords =
                                  currentKeywords.filter(
                                    (_, keywordIndex) =>
                                      keywordIndex !== index,
                                  );

                                setValue(
                                  "seo.keywords",
                                  updatedKeywords,
                                  {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  },
                                );
                              }}
                              className="text-muted-foreground transition-colors hover:text-destructive"
                              aria-label={`Remove ${keyword}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {errors.seo?.keywords?.root && (
                        <p className="text-sm text-destructive">
                          {errors.seo.keywords.root.message}
                        </p>
                      )}

                      {errors.seo?.keywords?.map?.(
                        (error, index) =>
                          error && (
                            <p
                              key={index}
                              className="text-sm text-destructive"
                            >
                              {error.message}
                            </p>
                          ),
                      )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="seo-og-title">OG Title</Label>

                        <Input
                          id="seo-og-title"
                          placeholder="Roof Waterproofing Services | Enviroshield"
                          {...register("seo.ogTitle")}
                        />

                        {errors.seo?.ogTitle && (
                          <p className="text-sm text-destructive">
                            {errors.seo.ogTitle.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>OG Image</Label>

                        <Controller
                          control={control}
                          name="seo.ogImage"
                          render={({ field }) => (
                            <ImageUploader
                              value={field.value}
                              imagePublicId={watch(
                                "seo.ogImagePublicId",
                              )}
                              onChange={(url, publicId) => {
                                // A manual OG upload opts out of
                                // automatic primary-image syncing.
                                setOgImageCustomized(true);
                                field.onChange(url);

                                setValue(
                                  "seo.ogImagePublicId",
                                  publicId,
                                  {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  },
                                );
                              }}
                            />
                          )}
                        />

                        {errors.seo?.ogImage && (
                          <p className="text-sm text-destructive">
                            {errors.seo.ogImage.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seo-og-description">
                        OG Description
                      </Label>

                      <Textarea
                        id="seo-og-description"
                        rows={3}
                        placeholder="Professional roof waterproofing solutions for long-lasting building protection."
                        {...register("seo.ogDescription")}
                      />

                      {errors.seo?.ogDescription && (
                        <p className="text-sm text-destructive">
                          {errors.seo.ogDescription.message}
                        </p>
                      )}
                    </div>

                    <Controller
                      control={control}
                      name="seo.noIndex"
                      render={({ field }) => (
                        <div className="flex items-center justify-between rounded-xl border p-4">
                          <div>
                            <Label className="font-semibold text-navy">
                              No Index
                            </Label>

                            <p className="mt-1 text-sm text-muted-foreground">
                              Prevent search engines from indexing
                              this service.
                            </p>
                          </div>

                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      )}
                    />
                  </div>
                </FormSection>
              )}

              {/* Navigation */}
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
                      disabled={isLoading}
                      icon={
                        isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )
                      }
                    >
                      {isLoading ? "Creating..." : "Create Service"}
                    </DashboardButton>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ImageFieldsProps = {
  title: string;
  urlName: any;
  publicIdName: any;
  altName: any;
  captionName: any;
  control: any;
  register: any;
  errors: any;
  setValue: any;
  watch: any;
  onImageChange?: (url: string, publicId: string) => void;
};

function ImageFields({
  title,
  urlName,
  publicIdName,
  altName,
  captionName,
  control,
  register,
  errors,
  setValue,
  watch,
  onImageChange,
}: ImageFieldsProps) {
  const fieldName = urlName.split(".")[0];
  const imageErrors = errors?.[fieldName];

  return (
    <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
      <div>
        <h4 className="text-sm font-bold text-navy">{title}</h4>

        <p className="mt-1 text-xs text-muted-foreground">
          Upload the image and provide accessible metadata.
        </p>
      </div>

      <Controller
        control={control}
        name={urlName}
        render={({ field }: any) => (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Image</Label>

            <ImageUploader
              value={field.value}
              imagePublicId={watch(publicIdName)}
              onChange={(url, publicId) => {
                field.onChange(url);

                setValue(publicIdName, publicId, {
                  shouldDirty: true,
                  shouldValidate: true,
                });

                onImageChange?.(url, publicId);
              }}
            />

            {imageErrors?.url && (
              <p className="text-xs text-red-600">
                {imageErrors.url.message}
              </p>
            )}
          </div>
        )}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-navy">
            Alt Text
          </Label>

          <Input
            placeholder="Describe the image"
            {...register(altName)}
          />

          {imageErrors?.alt && (
            <p className="text-xs text-red-600">
              {imageErrors.alt.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-navy">
            Caption
          </Label>

          <Input
            placeholder="Image caption"
            {...register(captionName)}
          />

          {imageErrors?.caption && (
            <p className="text-xs text-red-600">
              {imageErrors.caption.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type ContentSectionName = "whyEnviroshield" | "process" | "benefits";

type ContentSectionProps = {
  title: string;
  description: string;
  sectionName: ContentSectionName;
  control: any;
  register: any;
  errors: any;
  fields: any;
  setValue: any;
  watch: any;
};

function ContentSection({
  title,
  description,
  sectionName,
  control,
  register,
  errors,
  fields,
  setValue,
  watch,
}: ContentSectionProps) {
  return (
    <FormSection title={title} description={description}>
      <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
        <div>
          <h4 className="text-sm font-bold text-navy">
            Section Image
          </h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Upload the image and provide accessible metadata.
          </p>
        </div>

        <Controller
          control={control}
          name={`${sectionName}.image.url`}
          render={({ field }: any) => (
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Image</Label>

              <ImageUploader
                value={field.value}
                imagePublicId={watch(`${sectionName}.image.publicId`)}
                onChange={(url, publicId) => {
                  field.onChange(url);

                  setValue(
                    `${sectionName}.image.publicId`,
                    publicId,
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                }}
              />

              {errors?.[sectionName]?.image?.url && (
                <p className="text-xs text-red-600">
                  {errors[sectionName].image.url.message}
                </p>
              )}
            </div>
          )}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-navy">
              Alt Text
            </Label>

            <Input
              {...register(`${sectionName}.image.alt`)}
              placeholder="Describe the image"
            />

            {errors?.[sectionName]?.image?.alt && (
              <p className="text-xs text-red-600">
                {errors[sectionName].image.alt.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-navy">
              Caption
            </Label>

            <Input
              {...register(`${sectionName}.image.caption`)}
              placeholder="Image caption"
            />

            {errors?.[sectionName]?.image?.caption && (
              <p className="text-xs text-red-600">
                {errors[sectionName].image.caption.message}
              </p>
            )}
          </div>
        </div>
      </div>

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
              fields.append({ title: "", description: "" })
            }
            className="min-h-9 rounded-xl bg-blue px-4 text-xs font-bold text-white hover:bg-[#005cb9]"
          >
            Add Item
          </DashboardButton>
        </div>

        <div className="space-y-4">
          {fields.fields.map(
            (field: { id: string }, index: number) => (
              <div
                key={field.id}
                className="rounded-2xl border bg-muted/10 p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue">
                    Item {String(index + 1).padStart(2, "0")}
                  </p>

                  {fields.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => fields.remove(index)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-navy">
                      Title
                    </Label>

                    <Input
                      {...register(
                        `${sectionName}.items.${index}.title`,
                      )}
                      placeholder="Content item title"
                    />

                    {errors?.[sectionName]?.items?.[index]?.title && (
                      <p className="text-xs text-red-600">
                        {
                          errors[sectionName].items[index].title
                            .message
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-navy">
                      Description
                    </Label>

                    <Textarea
                      {...register(
                        `${sectionName}.items.${index}.description`,
                      )}
                      placeholder="Describe this point..."
                      className="min-h-28 resize-none"
                    />

                    {errors?.[sectionName]?.items?.[index]
                      ?.description && (
                      <p className="text-xs text-red-600">
                        {
                          errors[sectionName].items[index].description
                            .message
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </FormSection>
  );
}
