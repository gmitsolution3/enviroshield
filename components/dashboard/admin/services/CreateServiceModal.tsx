"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { usePost } from "@/hooks/swr/usePost";

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
import { Textarea } from "@/components/ui/textarea";
import DashboardButton from "../../DashboardButton";

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

type CreateServiceModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccess?: () => void;
};

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

export default function CreateServiceModal({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}: CreateServiceModalProps) {
  const [seoKeywordInput, setSeoKeywordInput] = useState("");

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

  const handleClose = () => {
    if (isLoading) return;

    setIsModalOpen(false);
    reset(defaultValues);
    setSeoKeywordInput("");
  };

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        isFeatured: data.isFeatured,

        primaryImage: {
          url: data.primaryImage.url,
          alt: data.primaryImage.alt,
          caption: data.primaryImage.caption,
        },

        detailHeading: data.detailHeading,
        description: data.description,

        whyEnviroshield: {
          image: {
            url: data.whyEnviroshield.image.url,
            alt: data.whyEnviroshield.image.alt,
            caption: data.whyEnviroshield.image.caption,
          },
          items: data.whyEnviroshield.items,
        },

        process: {
          image: {
            url: data.process.image.url,
            alt: data.process.image.alt,
            caption: data.process.image.caption,
          },
          items: data.process.items,
        },

        benefits: {
          image: {
            url: data.benefits.image.url,
            alt: data.benefits.image.alt,
            caption: data.benefits.image.caption,
          },
          items: data.benefits.items,
        },

        status: data.status,

        seo: {
          metaTitle: data.seo.metaTitle,
          metaDescription: data.seo.metaDescription,
          keywords: data.seo.keywords,
          canonicalUrl: data.seo.canonicalUrl,
          ogTitle: data.seo.ogTitle,
          ogDescription: data.seo.ogDescription,
          ogImage: data.seo.ogImage,
          noIndex: data.seo.noIndex,
        },
      };

      const response = await postService(payload);

      if (response?.success) {
        setIsModalOpen(false);
        reset(defaultValues);
        setSeoKeywordInput("");
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to create service:", error);
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
      <DialogContent className="max-h-[90vh] !max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Service</DialogTitle>

          <DialogDescription>
            Create a new Enviroshield service and configure all
            service, content, and SEO information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-5 rounded-xl border bg-muted/20 p-5">
            <div>
              <h3 className="text-base font-semibold text-navy">
                Basic Information
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Configure the basic information for this service.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-name">Service Name</Label>

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
                <Label htmlFor="service-slug">Slug</Label>

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
            </div>

            <div className="space-y-2">
              <Label htmlFor="detail-heading">Detail Heading</Label>

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
              <Label htmlFor="service-description">Description</Label>

              <Textarea
                id="service-description"
                placeholder="Describe the service..."
                rows={4}
                {...register("description")}
              />

              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Primary Image */}
            <ImageFields
              title="Primary Image"
              urlName="primaryImage.url"
              altName="primaryImage.alt"
              captionName="primaryImage.caption"
              control={control}
              register={register}
              errors={errors}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>

                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>

                        <SelectItem value="published">
                          Published
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.status && (
                  <p className="text-sm text-destructive">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-blue"
                    {...register("isFeatured")}
                  />

                  <span className="text-sm font-medium">
                    Feature this service
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Why Enviroshield */}
          <ContentSection
            title="Why Enviroshield"
            description="Explain why customers should choose Enviroshield for this service."
            sectionName="whyEnviroshield"
            control={control}
            register={register}
            errors={errors}
            fields={whyEnviroshieldItems}
          />

          {/* Process */}
          <ContentSection
            title="Process"
            description="Describe the process involved in delivering this service."
            sectionName="process"
            control={control}
            register={register}
            errors={errors}
            fields={processItems}
          />

          {/* Benefits */}
          <ContentSection
            title="Benefits"
            description="Highlight the main benefits customers receive from this service."
            sectionName="benefits"
            control={control}
            register={register}
            errors={errors}
            fields={benefitsItems}
          />

          {/* SEO */}
          <div className="space-y-5 rounded-xl border bg-muted/20 p-5">
            <div>
              <h3 className="text-base font-semibold text-navy">
                SEO
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Configure search engine and social sharing information
                for this service.
              </p>
            </div>

            <div className="space-y-5">
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
                <Label htmlFor="seo-meta-description">
                  Meta Description
                </Label>

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

              {/* Keywords */}
              <div className="space-y-3">
                <div>
                  <Label>Keywords</Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Add at least one SEO keyword.
                  </p>
                </div>

                {/* Add keyword */}
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

                      if (currentKeywords.includes(keyword)) {
                        return;
                      }

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

                {/* Added keywords */}
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

                          setValue("seo.keywords", updatedKeywords, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remove ${keyword}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Validation error */}
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

              <div className="space-y-2">
                <Label htmlFor="seo-canonical-url">
                  Canonical URL
                </Label>

                <Input
                  id="seo-canonical-url"
                  type="url"
                  placeholder="https://enviroshield.com/services/roof-waterproofing"
                  {...register("seo.canonicalUrl")}
                />

                {errors.seo?.canonicalUrl && (
                  <p className="text-sm text-destructive">
                    {errors.seo.canonicalUrl.message}
                  </p>
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
                  <Label htmlFor="seo-og-image">OG Image URL</Label>

                  <Input
                    id="seo-og-image"
                    type="url"
                    placeholder="https://example.com/services/roof-waterproofing.jpg"
                    {...register("seo.ogImage")}
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

              <div className="rounded-lg border bg-background p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-blue"
                    {...register("seo.noIndex")}
                  />

                  <div>
                    <p className="text-sm font-medium">No Index</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Prevent search engines from indexing this
                      service page.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <DashboardButton
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="h-10 rounded-full border-blue/30 bg-muted/30 px-5 text-sm font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
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
              {isLoading ? "Creating..." : "Create Service"}
            </DashboardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type ImageFieldsProps = {
  title: string;
  urlName: any;
  altName: any;
  captionName: any;
  control: any;
  register: any;
  errors: any;
};

function ImageFields({
  title,
  urlName,
  altName,
  captionName,
  control,
  register,
  errors,
}: ImageFieldsProps) {
  const fieldName = urlName.split(".")[0];

  const imageErrors = errors?.[fieldName];

  return (
    <div className="space-y-4">
      <div>
        <Label>{title}</Label>
      </div>

      <Controller
        control={control}
        name={urlName}
        render={({ field }: any) => (
          <ImageUploader
            value={field.value}
            onChange={(url) => field.onChange(url)}
          />
        )}
      />

      {imageErrors?.url && (
        <p className="text-sm text-destructive">
          {imageErrors.url.message}
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Alt Text</Label>

          <Input
            placeholder="Describe the image"
            {...register(altName)}
          />

          {imageErrors?.alt && (
            <p className="text-sm text-destructive">
              {imageErrors.alt.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Caption</Label>

          <Input
            placeholder="Image caption"
            {...register(captionName)}
          />

          {imageErrors?.caption && (
            <p className="text-sm text-destructive">
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
};

function ContentSection({
  title,
  description,
  sectionName,
  control,
  register,
  errors,
  fields,
}: ContentSectionProps) {
  return (
    <div className="space-y-5 rounded-xl border bg-muted/20 p-5">
      <div>
        <h3 className="text-base font-semibold text-navy">{title}</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Section Image */}
      <div className="space-y-4">
        <Label>Section Image</Label>

        <Controller
          control={control}
          name={`${sectionName}.image.url`}
          render={({ field }: any) => (
            <ImageUploader
              value={field.value}
              onChange={(url) => field.onChange(url)}
            />
          )}
        />

        {errors?.[sectionName]?.image?.url && (
          <p className="text-sm text-destructive">
            {errors[sectionName].image.url.message}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Image Alt Text</Label>

            <Input
              placeholder="Describe the image"
              {...register(`${sectionName}.image.alt`)}
            />

            {errors?.[sectionName]?.image?.alt && (
              <p className="text-sm text-destructive">
                {errors[sectionName].image.alt.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Image Caption</Label>

            <Input
              placeholder="Image caption"
              {...register(`${sectionName}.image.caption`)}
            />

            {errors?.[sectionName]?.image?.caption && (
              <p className="text-sm text-destructive">
                {errors[sectionName].image.caption.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content Items */}
      <div className="space-y-4 border-t pt-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">Content Items</h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Add the points you want to show in this section.
            </p>
          </div>

          <DashboardButton
            type="button"
            variant="outline"
            icon={<Plus className="h-4 w-4" />}
            onClick={() =>
              fields.append({
                title: "",
                description: "",
              })
            }
            className="h-9 rounded-full border-blue/30 bg-muted/30 px-4 text-xs font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
          >
            Add Item
          </DashboardButton>
        </div>

        {fields.fields.map((field: { id: string }, index: number) => (
          <div
            key={field.id}
            className="relative space-y-4 rounded-lg border bg-background p-4"
          >
            {fields.fields.length > 1 && (
              <DashboardButton
                type="button"
                variant="outline"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => fields.remove(index)}
                ariaLabel={`Remove item ${index + 1}`}
                className="absolute right-3 top-3 h-8 w-8 rounded-lg border-red-200 bg-red-50 p-0 text-red-500 shadow-none hover:border-red-300 hover:bg-red-100 hover:text-red-600"
              />
            )}

            <div className="space-y-2 pr-10">
              <Label>Item Title</Label>

              <Input
                placeholder="e.g. Experienced Professionals"
                {...register(`${sectionName}.items.${index}.title`)}
              />

              {errors?.[sectionName]?.items?.[index]?.title && (
                <p className="text-sm text-destructive">
                  {errors[sectionName].items[index].title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Item Description</Label>

              <Textarea
                placeholder="Describe this point..."
                rows={3}
                {...register(
                  `${sectionName}.items.${index}.description`,
                )}
              />

              {errors?.[sectionName]?.items?.[index]?.description && (
                <p className="text-sm text-destructive">
                  {
                    errors[sectionName].items[index].description
                      .message
                  }
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
