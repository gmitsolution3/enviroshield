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
import { useState, type ReactNode } from "react";
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
import { usePost } from "@/hooks/swr/usePost";
import type { IService } from "@/types";
import { generateSlug } from "@/utils/generateSlug";

import DashboardButton from "../../DashboardButton";

const imageSchema = z.object({
  url: z.string().min(1, "Image is required"),
  alt: z.string().min(1, "Image alt text is required"),
  caption: z.string().min(1, "Image caption is required"),
});

const galleryItemSchema = z.object({
  url: z.string().min(1, "Gallery image is required"),
  alt: z.string().min(1, "Gallery image alt text is required"),
});

const locationSchema = z.object({
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  country: z.string().min(1, "Country is required"),
});

const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  description: z.string().min(1, "Client description is required"),
  logo: z.object({
    url: z.string().min(1, "Client logo is required"),
    alt: z.string().min(1, "Client logo alt text is required"),
  }),
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

  noIndex: z.boolean(),
});

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Project title is required")
    .max(150, "Project title must be 150 characters or less"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  primaryImage: imageSchema,

  description: z.string().min(1, "Description is required"),

  location: locationSchema,

  completionDate: z.string().min(1, "Completion date is required"),

  gallery: z
    .array(galleryItemSchema)
    .min(1, "At least one gallery image is required"),

  client: clientSchema,

  serviceId: z.string().min(1, "Service is required"),

  status: z.enum(["draft", "published"]),

  isFeatured: z.boolean(),

  seo: seoSchema,
});

type FormValues = z.infer<typeof formSchema>;

type CreateProjectModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccess?: () => void;
  services: IService[];
  servicesLoading?: boolean;
  servicesError?: boolean;
};

const defaultValues: FormValues = {
  title: "",
  slug: "",

  primaryImage: {
    url: "",
    alt: "",
    caption: "",
  },

  description: "",

  location: {
    city: "",
    area: "",
    country: "",
  },

  completionDate: "",

  gallery: [
    {
      url: "",
      alt: "",
    },
  ],

  client: {
    name: "",
    description: "",
    logo: {
      url: "",
      alt: "",
    },
  },

  serviceId: "",

  status: "draft",

  isFeatured: false,

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
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
    description: "Project details and primary image",
  },
  {
    number: "02",
    title: "Location & Service",
    shortTitle: "Location",
    description: "Project location and associated service",
  },
  {
    number: "03",
    title: "Client",
    shortTitle: "Client",
    description: "Client information and logo",
  },
  {
    number: "04",
    title: "Gallery",
    shortTitle: "Gallery",
    description: "Project gallery images",
  },
  {
    number: "05",
    title: "SEO",
    shortTitle: "SEO",
    description: "Search and social sharing settings",
  },
];

export default function CreateProjectModal({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
  services,
  servicesLoading = false,
  servicesError = false,
}: CreateProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  const { mutate: postProject, isLoading } = usePost("/project", {
    revalidateKey: "/project",
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

  const galleryItems = useFieldArray({
    control,
    name: "gallery",
  });

  const currentKeywords = watch("seo.keywords");

  const handleClose = () => {
    if (isLoading) return;

    setIsModalOpen(false);
    reset(defaultValues);
    setSeoKeywordInput("");
    setCurrentStep(0);
  };

  const handleNextStep = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = await trigger([
          "title",
          "slug",
          "primaryImage",
          "description",
          "status",
          "isFeatured",
        ]);
        break;

      case 1:
        isValid = await trigger([
          "location",
          "completionDate",
          "serviceId",
        ]);
        break;

      case 2:
        isValid = await trigger("client");
        break;

      case 3:
        isValid = await trigger("gallery");
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
      shouldDirty: true,
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
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        title: data.title,
        slug: data.slug,

        primaryImage: {
          url: data.primaryImage.url,
          alt: data.primaryImage.alt,
          caption: data.primaryImage.caption,
        },

        description: data.description,

        location: {
          city: data.location.city,
          area: data.location.area,
          country: data.location.country,
        },

        completionDate: data.completionDate,

        gallery: data.gallery.map((item) => ({
          url: item.url,
          alt: item.alt,
        })),

        client: {
          name: data.client.name,
          description: data.client.description,
          logo: {
            url: data.client.logo.url,
            alt: data.client.logo.alt,
          },
        },

        serviceId: data.serviceId,

        status: data.status,

        isFeatured: data.isFeatured,

        seo: {
          metaTitle: data.seo.metaTitle,
          metaDescription: data.seo.metaDescription,
          keywords: data.seo.keywords,
          ogTitle: data.seo.ogTitle,
          ogDescription: data.seo.ogDescription,
          ogImage: data.seo.ogImage,
          noIndex: data.seo.noIndex,
        },
      };

      const response = await postProject(payload);

      if (response?.success) {
        toast.success(response.message);

        setIsModalOpen(false);
        reset(defaultValues);
        setSeoKeywordInput("");
        setCurrentStep(0);

        onSuccess?.();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create project.";

      toast.error(message);

      console.error("Failed to create project:", message);
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
      <DialogContent className="max-h-[92vh] !max-w-5xl overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Add Project
            </DialogTitle>

            <DialogDescription className="text-sm leading-6">
              Create a new Enviroshield project and configure all
              project, client, gallery, and SEO information.
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
              {/* STEP 1 — BASIC INFORMATION */}
              {currentStep === 0 && (
                <FormSection
                  title="Basic Information"
                  description="Set the main information customers will see for this project."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Project Title"
                      error={errors.title?.message}
                    >
                      <Input
                        {...register("title", {
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
                        placeholder="e.g. Industrial Roof Waterproofing Project"
                      />
                    </Field>

                    <Field label="Slug" error={errors.slug?.message}>
                      <Input
                        {...register("slug")}
                        placeholder="industrial-roof-waterproofing-project"
                      />
                    </Field>
                  </div>

                  <Field
                    label="Description"
                    error={errors.description?.message}
                  >
                    <Textarea
                      {...register("description")}
                      placeholder="Describe this project..."
                      className="min-h-32 resize-none"
                    />
                  </Field>

                  <ImageFields
                    control={control}
                    register={register}
                    errors={errors.primaryImage}
                    name="primaryImage"
                    title="Primary Image"
                    showCaption
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <Controller
                      control={control}
                      name="isFeatured"
                      render={({ field }) => (
                        <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
                          <div className="pr-4">
                            <Label className="font-semibold text-navy">
                              Featured Project
                            </Label>

                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              Highlight this project on the website.
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
                            <SelectTrigger className="w-full">
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

              {/* STEP 2 — LOCATION & SERVICE */}
              {currentStep === 1 && (
                <FormSection
                  title="Location & Service"
                  description="Set where the project was completed and associate it with an Enviroshield service."
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="City"
                      error={errors.location?.city?.message}
                    >
                      <Input
                        {...register("location.city")}
                        placeholder="e.g. Dhaka"
                      />
                    </Field>

                    <Field
                      label="Area"
                      error={errors.location?.area?.message}
                    >
                      <Input
                        {...register("location.area")}
                        placeholder="e.g. Tejgaon"
                      />
                    </Field>
                  </div>

                  <Field
                    label="Country"
                    error={errors.location?.country?.message}
                  >
                    <Input
                      {...register("location.country")}
                      placeholder="e.g. Bangladesh"
                    />
                  </Field>

                  <Field
                    label="Completion Date"
                    error={errors.completionDate?.message}
                  >
                    <Input
                      type="date"
                      {...register("completionDate")}
                    />
                  </Field>

                  <Controller
                    control={control}
                    name="serviceId"
                    render={({ field }) => (
                      <Field
                        label="Service"
                        error={errors.serviceId?.message}
                      >
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={
                            servicesLoading ||
                            servicesError ||
                            services.length === 0
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                servicesLoading
                                  ? "Loading services..."
                                  : servicesError
                                    ? "Unable to load services"
                                    : services.length === 0
                                      ? "No services available"
                                      : "Select a service"
                              }
                            />
                          </SelectTrigger>

                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem
                                key={service._id}
                                value={service._id}
                              >
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {servicesError && (
                          <p className="text-sm text-destructive">
                            Failed to load services. Please try again.
                          </p>
                        )}

                        {!servicesError &&
                          !servicesLoading &&
                          services.length === 0 && (
                            <p className="text-sm text-destructive">
                              No services are available. Create a
                              service before creating a project.
                            </p>
                          )}
                      </Field>
                    )}
                  />
                </FormSection>
              )}

              {/* STEP 3 — CLIENT */}
              {currentStep === 2 && (
                <FormSection
                  title="Client Information"
                  description="Provide the client information associated with this project."
                >
                  <Field
                    label="Client Name"
                    error={errors.client?.name?.message}
                  >
                    <Input
                      {...register("client.name")}
                      placeholder="e.g. Example Industries Ltd."
                    />
                  </Field>

                  <Field
                    label="Client Description"
                    error={errors.client?.description?.message}
                  >
                    <Textarea
                      {...register("client.description")}
                      placeholder="Describe the client..."
                      className="min-h-28 resize-none"
                    />
                  </Field>

                  <ImageFields
                    control={control}
                    register={register}
                    errors={errors.client?.logo}
                    name="client.logo"
                    title="Client Logo"
                  />
                </FormSection>
              )}

              {/* STEP 4 — GALLERY */}
              {currentStep === 3 && (
                <FormSection
                  title="Project Gallery"
                  description="Add the images that showcase the completed project."
                >
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-navy">
                        Gallery Images
                      </h4>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Add at least one gallery image.
                      </p>
                    </div>

                    <DashboardButton
                      type="button"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() =>
                        galleryItems.append({
                          url: "",
                          alt: "",
                        })
                      }
                      className="min-h-9 rounded-xl bg-blue px-4 text-xs font-bold text-white hover:bg-[#005cb9]"
                    >
                      Add Image
                    </DashboardButton>
                  </div>

                  <div className="space-y-4">
                    {galleryItems.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="rounded-2xl border bg-muted/10 p-5"
                      >
                        <div className="mb-5 flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue">
                            Image {String(index + 1).padStart(2, "0")}
                          </p>

                          {galleryItems.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                galleryItems.remove(index)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                              aria-label={`Remove image ${index + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-5">
                          <Controller
                            control={control}
                            name={`gallery.${index}.url`}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold">
                                  Image
                                </Label>

                                <ImageUploader
                                  value={field.value}
                                  onChange={(url) =>
                                    field.onChange(url)
                                  }
                                />

                                {errors.gallery?.[index]?.url && (
                                  <p className="text-xs text-red-600">
                                    {
                                      errors.gallery[index].url
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                            )}
                          />

                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-navy">
                              Alt Text
                            </Label>

                            <Input
                              {...register(`gallery.${index}.alt`)}
                              placeholder="Describe the gallery image"
                            />

                            {errors.gallery?.[index]?.alt && (
                              <p className="text-xs text-red-600">
                                {errors.gallery[index].alt?.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.gallery?.root && (
                    <p className="text-sm text-destructive">
                      {errors.gallery.root.message}
                    </p>
                  )}
                </FormSection>
              )}

              {/* STEP 5 — SEO */}
              {currentStep === 4 && (
                <FormSection
                  title="SEO"
                  description="Configure search engine and social sharing information for this project."
                >
                  <Field
                    label="Meta Title"
                    error={errors.seo?.metaTitle?.message}
                  >
                    <Input
                      {...register("seo.metaTitle")}
                      placeholder="Industrial Roof Waterproofing Project"
                    />
                  </Field>

                  <Field
                    label="Meta Description"
                    error={errors.seo?.metaDescription?.message}
                  >
                    <Textarea
                      {...register("seo.metaDescription")}
                      placeholder="Industrial roof waterproofing project completed by Enviroshield."
                      className="min-h-28 resize-none"
                    />
                  </Field>

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
                        onClick={addKeyword}
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
                            onClick={() => removeKeyword(index)}
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
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="OG Title"
                      error={errors.seo?.ogTitle?.message}
                    >
                      <Input
                        {...register("seo.ogTitle")}
                        placeholder="Industrial Roof Waterproofing"
                      />
                    </Field>

                    <Field
                      label="OG Image URL"
                      error={errors.seo?.ogImage?.message}
                    >
                      <Input
                        type="url"
                        {...register("seo.ogImage")}
                        placeholder="https://example.com/projects/roof-main.jpg"
                      />
                    </Field>
                  </div>

                  <Field
                    label="OG Description"
                    error={errors.seo?.ogDescription?.message}
                  >
                    <Textarea
                      {...register("seo.ogDescription")}
                      placeholder="A completed industrial waterproofing project."
                      className="min-h-28 resize-none"
                    />
                  </Field>

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
                            Prevent search engines from indexing this
                            project.
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
                      {isLoading ? "Creating..." : "Create Project"}
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

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-navy">
        {label}
      </Label>

      {children}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

type ImageFieldsProps = {
  control: any;
  register: any;
  errors: any;
  name: string;
  title: string;
  showCaption?: boolean;
};

function ImageFields({
  control,
  register,
  errors,
  name,
  title,
  showCaption = false,
}: ImageFieldsProps) {
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
        name={`${name}.url`}
        render={({ field }) => (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Image</Label>

            <ImageUploader
              value={field.value}
              onChange={(url) => field.onChange(url)}
            />

            {errors?.url && (
              <p className="text-xs text-red-600">
                {errors.url.message}
              </p>
            )}
          </div>
        )}
      />

      <div
        className={[
          "grid gap-5",
          showCaption ? "md:grid-cols-2" : "md:grid-cols-1",
        ].join(" ")}
      >
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-navy">
            Alt Text
          </Label>

          <Input
            {...register(`${name}.alt`)}
            placeholder="Describe the image"
          />

          {errors?.alt && (
            <p className="text-xs text-red-600">
              {errors.alt.message}
            </p>
          )}
        </div>

        {showCaption && (
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-navy">
              Caption
            </Label>

            <Input
              {...register(`${name}.caption`)}
              placeholder="Image caption"
            />

            {errors?.caption && (
              <p className="text-xs text-red-600">
                {errors.caption.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
