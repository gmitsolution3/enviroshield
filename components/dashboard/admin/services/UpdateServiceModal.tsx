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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePatch } from "@/hooks/swr/usePatch";
import type { IService } from "@/types";
import { generateSlug } from "@/utils/generateSlug";

import DashboardButton from "../../DashboardButton";

type UpdateServiceModalProps = {
  service: IService | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
};

/**
 * Keep publicId as a string without requiring it to be non-empty so older
 * records that predate publicId tracking can still be edited. New uploads
 * populate publicId through ImageUploader.
 */
const imageSchema = z.object({
  url: z.string().min(1, "Image is required"),
  publicId: z.string(),
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
  items: z.array(contentItemSchema).min(1, "At least one item is required"),
});

const seoSchema = z.object({
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  keywords: z
    .array(z.string().min(1, "Keyword cannot be empty"))
    .min(1, "At least one keyword is required"),
  ogTitle: z.string().min(1, "OG title is required"),
  ogDescription: z.string().min(1, "OG description is required"),
  ogImage: z
    .string()
    .min(1, "OG image is required")
    .url("Enter a valid OG image URL"),
  ogImagePublicId: z.string(),
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
type ImagePath =
  | "primaryImage"
  | "whyEnviroshield.image"
  | "process.image"
  | "benefits.image";
type ContentSectionName = "whyEnviroshield" | "process" | "benefits";

const createDefaultContentSection = () => ({
  image: { url: "", publicId: "", alt: "", caption: "" },
  items: [{ title: "", description: "" }],
});

const defaultValues: FormValues = {
  name: "",
  price: 0,
  slug: "",
  isFeatured: false,
  primaryImage: { url: "", publicId: "", alt: "", caption: "" },
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

const mapImage = (image?: {
  url?: string;
  publicId?: string;
  alt?: string;
  caption?: string;
}) => ({
  url: image?.url ?? "",
  publicId: image?.publicId ?? "",
  alt: image?.alt ?? "",
  caption: image?.caption ?? "",
});

const mapContentSection = (section?: {
  image?: { url?: string; publicId?: string; alt?: string; caption?: string };
  items?: { title?: string; description?: string }[];
}) => ({
  image: mapImage(section?.image),
  items:
    section?.items?.length
      ? section.items.map((item) => ({
          title: item.title ?? "",
          description: item.description ?? "",
        }))
      : [{ title: "", description: "" }],
});

const getServiceFormValues = (service: IService): FormValues => ({
  name: service.name ?? "",
  price: service.price ?? 0,
  slug: service.slug ?? "",
  isFeatured: service.isFeatured ?? false,
  primaryImage: mapImage(service.primaryImage),
  detailHeading: service.detailHeading ?? "",
  description: service.description ?? "",
  whyEnviroshield: mapContentSection(service.whyEnviroshield),
  process: mapContentSection(service.process),
  benefits: mapContentSection(service.benefits),
  status:
    service.status === "published" || service.status === "draft"
      ? service.status
      : "draft",
  seo: {
    metaTitle: service.seo?.metaTitle ?? "",
    metaDescription: service.seo?.metaDescription ?? "",
    keywords: service.seo?.keywords ?? [],
    ogTitle: service.seo?.ogTitle ?? "",
    ogDescription: service.seo?.ogDescription ?? "",
    ogImage: service.seo?.ogImage ?? "",
    ogImagePublicId: service.seo?.ogImagePublicId ?? "",
    noIndex: service.seo?.noIndex ?? false,
  },
});

export default function UpdateServiceModal({
  service,
  open,
  revalidateKey,
  onClose,
}: UpdateServiceModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  const { mutate: updateService, isLoading } = usePatch("/service", {
    revalidateKey,
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
  const processItems = useFieldArray({ control, name: "process.items" });
  const benefitsItems = useFieldArray({ control, name: "benefits.items" });

  const currentKeywords = watch("seo.keywords") ?? [];

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

  useEffect(() => {
    if (!open || !service) return;

    const values = getServiceFormValues(service);
    reset(values);
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

  const handleNextStep = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const valid = await trigger(stepFields[currentStep]);
    if (valid) setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handlePreviousStep = () =>
    setCurrentStep((step) => Math.max(step - 1, 0));

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep) setCurrentStep(stepIndex);
  };


  const addKeyword = () => {
    const keyword = seoKeywordInput.trim();
    if (!keyword) return;

    if (currentKeywords.includes(keyword)) {
      toast.error("This keyword already exists.");
      return;
    }

    setValue("seo.keywords", [...currentKeywords, keyword], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setSeoKeywordInput("");
  };

  const removeKeyword = (index: number) => {
    setValue(
      "seo.keywords",
      currentKeywords.filter((_, keywordIndex) => keywordIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const onSubmit = async (values: FormValues) => {
    if (!service) return;

    try {
      await updateService({
        id: service._id,
        data: {
          name: values.name,
          price: Number(values.price) || 0,
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
        if (!value && !isLoading) handleClose();
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
                      disabled={index >= currentStep || isLoading}
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
                        {isCompleted ? <Check className="h-4 w-4" /> : step.number}
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
              {currentStep === 0 && (
                <FormSection
                  title="Basic Information"
                  description="Configure the basic information for this service."
                >
                  <div className="grid gap-5 md:grid-cols-3">
                    <Field label="Service Name" error={errors.name?.message}>
                      <Input
                        {...register("name", {
                          onChange: (event) => {
                            setValue("slug", generateSlug(event.target.value), {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          },
                        })}
                        placeholder="e.g. Roof Waterproofing"
                      />
                    </Field>
                    <Field label="Slug" error={errors.slug?.message}>
                      <Input {...register("slug")} placeholder="roof-waterproofing" />
                    </Field>
                    <Field label="Starting Price (BDT)" error={errors.price?.message}>
                      <Input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 12000"
                        {...register("price", { valueAsNumber: true })}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Detail Heading"
                    error={errors.detailHeading?.message}
                  >
                    <Input
                      {...register("detailHeading")}
                      placeholder="Professional roof waterproofing services"
                    />
                  </Field>

                  <Field label="Description" error={errors.description?.message}>
                    <Textarea
                      {...register("description")}
                      placeholder="Describe this service..."
                      className="min-h-32 resize-none"
                    />
                  </Field>

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
                        <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
                          <div>
                            <Label className="font-semibold text-navy">
                              Publish Service
                            </Label>

                            <p className="mt-1 text-sm text-muted-foreground">
                              Turn on to publish this service. Turn off to save it as a draft.
                            </p>
                          </div>

                          <Switch
                            checked={field.value === "published"}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? "published" : "draft")
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

              {currentStep === 2 && (
                <ContentSection
                  title="Process"
                  description="Describe the process customers can expect when using this service."
                  sectionName="process"
                  control={control}
                  register={register}
                  errors={errors}
                  fields={processItems}
                  setValue={setValue}
                  watch={watch}
                />
              )}

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

              {currentStep === 4 && (
                <FormSection
                  title="SEO"
                  description="Configure search engine and social sharing information for this service."
                >
                  <div className="space-y-2">
                    <Label htmlFor="seo-meta-title">Meta Title</Label>
                    <Input
                      id="seo-meta-title"
                      placeholder="Roof Waterproofing Services in Bangladesh | Enviroshield"
                      {...register("seo.metaTitle")}
                    />
                    {errors.seo?.metaTitle && (
                      <p className="text-sm text-destructive">
                        {errors.seo.metaTitle.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo-meta-description">Meta Description</Label>
                    <Textarea
                      id="seo-meta-description"
                      rows={3}
                      placeholder="Professional roof waterproofing solutions..."
                      {...register("seo.metaDescription")}
                    />
                    {errors.seo?.metaDescription && (
                      <p className="text-sm text-destructive">
                        {errors.seo.metaDescription.message}
                      </p>
                    )}
                  </div>

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
                        onChange={(event) => setSeoKeywordInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addKeyword();
                          }
                        }}
                        placeholder="e.g. roof waterproofing"
                      />
                      <DashboardButton
                        type="button"
                        variant="outline"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={addKeyword}
                        className="h-10 shrink-0 rounded-full border-blue/30 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:bg-blue/10 hover:text-blue"
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
                            onClick={() => removeKeyword(index)}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                            aria-label={`Remove ${keyword}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {errors.seo?.keywords?.root?.message && (
                      <p className="text-sm text-destructive">
                        {errors.seo.keywords.root.message}
                      </p>
                    )}
                    {errors.seo?.keywords?.map?.((error, index) =>
                      error ? (
                        <p key={index} className="text-sm text-destructive">
                          {error.message}
                        </p>
                      ) : null,
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
                            imagePublicId={watch("seo.ogImagePublicId")}
                            onChange={(url, publicId) => {
                              field.onChange(url);

                              setValue("seo.ogImagePublicId", publicId, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
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
                    <Label htmlFor="seo-og-description">OG Description</Label>
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
                          <Label className="font-semibold text-navy">No Index</Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Prevent search engines from indexing this service.
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

type ImageFieldsProps = {
  title: string;
  urlName: string;
  publicIdName: string;
  altName: string;
  captionName: string;
  control: any;
  register: any;
  errors: any;
  setValue: any;
  watch: any;
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
}: ImageFieldsProps) {
  const rootName = urlName.split(".")[0];
  const imageErrors =
    rootName === "primaryImage"
      ? errors?.primaryImage
      : errors?.[rootName]?.image;

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
            <Label className="text-sm font-semibold text-navy">Image</Label>
            <ImageUploader
              value={field.value}
              imagePublicId={watch(publicIdName)}
              onChange={(url, publicId) => {
                field.onChange(url);
                setValue(publicIdName, publicId, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
            {imageErrors?.url?.message && (
              <p className="text-xs text-red-600">{imageErrors.url.message}</p>
            )}
          </div>
        )}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-navy">Alt Text</Label>
          <Input placeholder="Describe the image" {...register(altName)} />
          {imageErrors?.alt?.message && (
            <p className="text-xs text-red-600">{imageErrors.alt.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-navy">Caption</Label>
          <Input placeholder="Image caption" {...register(captionName)} />
          {imageErrors?.caption?.message && (
            <p className="text-xs text-red-600">{imageErrors.caption.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

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
  const sectionErrors = errors?.[sectionName];

  return (
    <FormSection title={title} description={description}>
      <ImageFields
        title={`${title} Image`}
        urlName={`${sectionName}.image.url`}
        publicIdName={`${sectionName}.image.publicId`}
        altName={`${sectionName}.image.alt`}
        captionName={`${sectionName}.image.caption`}
        control={control}
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
      />

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-navy">Content Items</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Add the points you want to highlight in this section.
            </p>
          </div>
          <DashboardButton
            type="button"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => fields.append({ title: "", description: "" })}
            className="min-h-9 rounded-xl bg-blue px-4 text-xs font-bold text-white hover:bg-[#005cb9]"
          >
            Add Item
          </DashboardButton>
        </div>

        <div className="space-y-4">
          {fields.fields.map((field: { id: string }, index: number) => (
            <div key={field.id} className="rounded-2xl border bg-muted/10 p-5">
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
                <Field
                  label="Title"
                  error={sectionErrors?.items?.[index]?.title?.message}
                >
                  <Input
                    {...register(`${sectionName}.items.${index}.title`)}
                    placeholder="Content item title"
                  />
                </Field>
                <Field
                  label="Description"
                  error={sectionErrors?.items?.[index]?.description?.message}
                >
                  <Textarea
                    {...register(`${sectionName}.items.${index}.description`)}
                    placeholder="Describe this point..."
                    className="min-h-28 resize-none"
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>

        {sectionErrors?.items?.message && (
          <p className="text-xs text-red-600">{sectionErrors.items.message}</p>
        )}
      </div>
    </FormSection>
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
      <Label className="text-sm font-semibold text-navy">{label}</Label>
      {children}
      {error && <p className="text-xs leading-5 text-red-600">{error}</p>}
    </div>
  );
}
