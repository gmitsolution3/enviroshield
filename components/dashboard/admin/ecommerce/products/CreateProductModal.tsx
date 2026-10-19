
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { JSONContent } from "@tiptap/react";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { usePost } from "@/hooks/swr/usePost";
import { useFetch } from "@/hooks/swr/useFetch";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ICategoryResponse } from "@/types/admin/category.type";
import { generateSlug } from "@/utils/generateSlug";

import DashboardButton from "@/components/dashboard/DashboardButton";
import BlogEditor from "../../blogs/BlogEditor";

const imageSchema = z.object({
  url: z.string().trim().min(1, "Image is required"),
  publicId: z.string().trim().min(1, "Image public ID is required"),
  alt: z.string().trim().min(1, "Image alt text is required"),
});

const seoSchema = z.object({
  metaTitle: z.string().trim().min(1, "Meta title is required"),
  metaDescription: z
    .string()
    .trim()
    .min(1, "Meta description is required"),
  keywords: z
    .array(z.string().trim().min(1))
    .min(1, "Add at least one SEO keyword"),
  ogTitle: z.string().trim().min(1, "OG title is required"),
  ogDescription: z
    .string()
    .trim()
    .min(1, "OG description is required"),
  ogImage: z.string().trim().url("Enter a valid OG image URL"),
  ogImagePublicId: z
    .string()
    .trim()
    .min(1, "OG image public ID is required"),
  noIndex: z.boolean(),
});

const formSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),
  sku: z.string().trim().min(1, "SKU is required"),
  categoryId: z.string().min(1, "Select a category"),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description is required"),
  description: z.any(),
  primaryImage: imageSchema,
  gallery: z.array(imageSchema).min(1, "Add at least one gallery image"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  costPrice: z.coerce.number().min(0, "Cost price cannot be negative"),
  weight: z.coerce.number().positive("Weight must be greater than zero"),
  tdsUrl: z.string().trim().url("Enter a valid TDS URL"),
  tdsPublicId: z.string().trim().min(1, "TDS public ID is required"),
  stockQuantity: z.coerce
    .number()
    .int()
    .min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce
    .number()
    .int()
    .min(0, "Low-stock threshold cannot be negative"),
  status: z.enum(["draft", "published"]),
  isFeatured: z.boolean(),
  seo: seoSchema,
});

type FormValues = z.infer<typeof formSchema>;

type CreateProductModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  revalidateKey: string;
  onSuccess?: () => void;
};

const emptyContent: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const defaultValues: FormValues = {
  name: "",
  slug: "",
  sku: "",
  categoryId: "",
  shortDescription: "",
  description: emptyContent,
  primaryImage: {
    url: "",
    publicId: "",
    alt: "",
  },
  gallery: [],
  price: 0,
  costPrice: 0,
  weight: 1,
  tdsUrl: "",
  tdsPublicId: "",
  stockQuantity: 0,
  lowStockThreshold: 5,
  status: "draft",
  isFeatured: false,
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
    description: "Name, SKU and category",
  },
  {
    number: "02",
    title: "Content & Images",
    shortTitle: "Content",
    description: "Description and product media",
  },
  {
    number: "03",
    title: "Pricing & Inventory",
    shortTitle: "Inventory",
    description: "Pricing, stock and TDS",
  },
  {
    number: "04",
    title: "SEO & Publishing",
    shortTitle: "SEO",
    description: "Metadata and publication",
  },
];

const stepFields = [
  ["name", "slug", "sku", "categoryId", "shortDescription"],
  ["description", "primaryImage", "gallery"],
  [
    "price",
    "costPrice",
    "weight",
    "stockQuantity",
    "lowStockThreshold",
    "tdsUrl",
    "tdsPublicId",
  ],
  ["status", "isFeatured", "seo"],
] as const;

export default function CreateProductModal({
  isModalOpen,
  setIsModalOpen,
  revalidateKey,
  onSuccess,
}: CreateProductModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [seoKeywordInput, setSeoKeywordInput] = useState("");
  const [galleryAlt, setGalleryAlt] = useState("");
  const [galleryImage, setGalleryImage] = useState({
    url: "",
    publicId: "",
  });

  const { data: categoryResponse, isLoading: isLoadingCategories } =
    useFetch<ICategoryResponse>("/category?page=1&limit=100");

  const categories = categoryResponse?.data ?? [];

  const { mutate: createProduct, isLoading } = usePost("/product", {
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

  const { clearDraft } = usePersistentFormDraft<FormValues>({
    storageKey: "enviroshield:draft:create-product",
    watch,
    reset,
    defaultValues,
  });

  const currentKeywords = watch("seo.keywords") ?? [];
  const currentGallery = watch("gallery") ?? [];
  const description = watch("description");

  const primaryImageUrl = watch("primaryImage.url");
  const primaryImagePublicId = watch("primaryImage.publicId");
  const ogImageUrl = watch("seo.ogImage");
  const ogImagePublicId = watch("seo.ogImagePublicId");

  const handleClose = () => {
    if (isLoading) return;

    // Keep the saved form draft when the modal is closed.
    setIsModalOpen(false);
    setCurrentStep(0);
    setSeoKeywordInput("");
    setGalleryAlt("");
    setGalleryImage({ url: "", publicId: "" });
  };

  const handleNextStep = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const isValid = await trigger(stepFields[currentStep]);

    if (!isValid) return;

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handlePreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const addKeyword = () => {
    const keyword = seoKeywordInput.trim();

    if (!keyword) return;

    if (currentKeywords.includes(keyword)) {
      setSeoKeywordInput("");
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
      currentKeywords.filter((_, i) => i !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const addGalleryImage = () => {
    const alt = galleryAlt.trim();

    if (!galleryImage.url || !galleryImage.publicId || !alt) {
      toast.error("Upload a gallery image and provide its alt text.");
      return;
    }

    setValue(
      "gallery",
      [...currentGallery, { ...galleryImage, alt }],
      { shouldDirty: true, shouldValidate: true },
    );

    setGalleryImage({ url: "", publicId: "" });
    setGalleryAlt("");
  };

  const removeGalleryImage = (index: number) => {
    setValue(
      "gallery",
      currentGallery.filter((_, i) => i !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const syncOgImageWithPrimary = (url: string, publicId: string) => {
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
        name: data.name.trim(),
        slug: data.slug.trim(),
        sku: data.sku.trim(),
        categoryId: data.categoryId,
        shortDescription: data.shortDescription.trim(),
        description: data.description,
        primaryImage: data.primaryImage,
        gallery: data.gallery,
        price: data.price,
        costPrice: data.costPrice,
        weight: data.weight,
        tdsUrl: data.tdsUrl.trim(),
        tdsPublicId: data.tdsPublicId.trim(),
        stockQuantity: data.stockQuantity,
        lowStockThreshold: data.lowStockThreshold,
        status: data.status,
        isFeatured: data.isFeatured,
        publishedAt:
          data.status === "published" ? new Date().toISOString() : null,
        seo: {
          metaTitle: data.seo.metaTitle.trim(),
          metaDescription: data.seo.metaDescription.trim(),
          keywords: data.seo.keywords,
          ogTitle: data.seo.ogTitle.trim(),
          ogDescription: data.seo.ogDescription.trim(),
          ogImage: data.seo.ogImage.trim(),
          ogImagePublicId: data.seo.ogImagePublicId.trim(),
          noIndex: data.seo.noIndex,
        },
      };

      const response = await createProduct(payload);

      if (response?.success === false) {
        toast.error(response.message || "Failed to create product.");
        return;
      }

      toast.success(response?.message || "Product created successfully.");

      clearDraft();
      setIsModalOpen(false);
      setCurrentStep(0);
      setSeoKeywordInput("");
      setGalleryAlt("");
      setGalleryImage({ url: "", publicId: "" });
      onSuccess?.();
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };

      toast.error(
        apiError.response?.data?.message ||
          apiError.response?.data?.error ||
          apiError.message ||
          "Failed to create product.",
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
      <DialogContent className="max-h-[92vh] !max-w-6xl overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Add Product
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Create a product with details, rich content, images,
              pricing, inventory and SEO settings.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            {/* Step timeline */}
            <div className="border-b bg-muted/20 px-5 py-5 sm:px-8">
              <div className="relative">
                <div className="absolute left-[8%] right-[8%] top-5 hidden h-px bg-border md:block" />

                <div className="relative grid grid-cols-4 gap-2">
                  {steps.map((step, index) => {
                    const completed = index < currentStep;
                    const active = index === currentStep;

                    return (
                      <button
                        key={step.number}
                        type="button"
                        disabled={index >= currentStep}
                        onClick={() => {
                          if (index < currentStep) setCurrentStep(index);
                        }}
                        className="group flex flex-col items-center text-center disabled:cursor-default"
                      >
                        <div
                          className={[
                            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200",
                            completed
                              ? "border-blue bg-blue text-white shadow-md shadow-blue/20"
                              : active
                                ? "border-blue bg-white text-blue shadow-md shadow-blue/15"
                                : "border-border bg-white text-muted-foreground",
                          ].join(" ")}
                        >
                          {completed ? "✓" : step.number}
                        </div>

                        <div className="mt-3 hidden md:block">
                          <p
                            className={[
                              "text-xs font-bold",
                              active || completed
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
                            active || completed
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

            <div className="space-y-8 px-6 py-7 sm:px-8">
              {/* STEP 1: BASIC INFORMATION */}
              {currentStep === 0 && (
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy">
                      Basic Information
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Set the product name, URL, SKU and category.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="product-name" className="font-semibold text-navy">
                        Product Name *
                      </Label>
                      <Input
                        id="product-name"
                        placeholder="e.g. Waterproofing Coating"
                        autoComplete="off"
                        {...register("name", {
                          onChange: (event) => {
                            setValue("slug", generateSlug(event.target.value), {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setValue("seo.metaTitle", event.target.value, {
                              shouldDirty: true,
                            });
                            setValue("seo.ogTitle", event.target.value, {
                              shouldDirty: true,
                            });
                          },
                        })}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-slug" className="font-semibold text-navy">
                        Slug *
                      </Label>
                      <Input id="product-slug" placeholder="waterproofing-coating" {...register("slug")} />
                      {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-sku" className="font-semibold text-navy">
                        SKU *
                      </Label>
                      <Input id="product-sku" placeholder="WS-001" {...register("sku")} />
                      {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="font-semibold text-navy">Category *</Label>
                      <Controller
                        control={control}
                        name="categoryId"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isLoadingCategories}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isLoadingCategories
                                    ? "Loading categories..."
                                    : "Select a category"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
                      {!isLoadingCategories && categories.length === 0 && (
                        <p className="text-sm text-destructive">
                          No categories found. Create a category before adding a product.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-short-description" className="font-semibold text-navy">
                      Short Description *
                    </Label>
                    <Textarea
                      id="product-short-description"
                      placeholder="Write a concise summary of the product..."
                      className="min-h-28 resize-none"
                      {...register("shortDescription")}
                    />
                    {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription.message}</p>}
                  </div>
                </section>
              )}

              {/* STEP 2: CONTENT & IMAGES */}
              {currentStep === 1 && (
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy">Content & Images</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Write the product description and add its images.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold text-navy">Product Description *</Label>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <BlogEditor
                          value={field.value}
                          onChange={(content) => field.onChange(content)}
                          disabled={isLoading}
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">
                        {String(errors.description.message || "Product description is required")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
                    <div>
                      <h4 className="text-sm font-bold text-navy">Primary Image *</h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Upload the main image used to represent this product.
                      </p>
                    </div>

                    <Controller
                      control={control}
                      name="primaryImage.url"
                      render={({ field }) => (
                        <ImageUploader
                          value={field.value}
                          imagePublicId={primaryImagePublicId}
                          onChange={(url, publicId) => {
                            field.onChange(url);
                            setValue("primaryImage.publicId", publicId, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            syncOgImageWithPrimary(url, publicId);
                          }}
                        />
                      )}
                    />
                    {errors.primaryImage?.url && <p className="text-sm text-destructive">{errors.primaryImage.url.message}</p>}

                    <div className="space-y-2">
                      <Label htmlFor="primary-image-alt" className="font-semibold text-navy">
                        Primary Image Alt Text *
                      </Label>
                      <Input id="primary-image-alt" placeholder="Waterproofing coating container" {...register("primaryImage.alt")} />
                      {errors.primaryImage?.alt && <p className="text-sm text-destructive">{errors.primaryImage.alt.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
                    <div>
                      <h4 className="text-sm font-bold text-navy">Product Gallery *</h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Add at least one additional product image.
                      </p>
                    </div>

                    <ImageUploader
                      value={galleryImage.url}
                      imagePublicId={galleryImage.publicId}
                      onChange={(url, publicId) => {
                        setGalleryImage({ url, publicId });
                      }}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        value={galleryAlt}
                        onChange={(event) => setGalleryAlt(event.target.value)}
                        placeholder="Gallery image alt text"
                        aria-label="Gallery image alt text"
                      />
                      <DashboardButton
                        type="button"
                        variant="outline"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={addGalleryImage}
                        className="shrink-0"
                      >
                        Add Image
                      </DashboardButton>
                    </div>

                    {errors.gallery && (
                      <p className="text-sm text-destructive">
                        {errors.gallery.message || "Check the gallery images"}
                      </p>
                    )}

                    <div className="space-y-2">
                      {currentGallery.map((image, index) => (
                        <div
                          key={`${image.publicId}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border bg-background p-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{image.alt}</p>
                            <p className="truncate text-xs text-muted-foreground">{image.publicId}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                            aria-label={`Remove gallery image ${index + 1}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* STEP 3: PRICING, INVENTORY & TDS */}
              {currentStep === 2 && (
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy">Pricing & Inventory</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Enter pricing, stock levels, product weight and technical data sheet details.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="product-price" className="font-semibold text-navy">Selling Price *</Label>
                      <Input id="product-price" type="number" min="0.01" step="0.01" {...register("price")} />
                      {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-cost-price" className="font-semibold text-navy">Cost Price *</Label>
                      <Input id="product-cost-price" type="number" min="0" step="0.01" {...register("costPrice")} />
                      {errors.costPrice && <p className="text-sm text-destructive">{errors.costPrice.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-weight" className="font-semibold text-navy">Weight *</Label>
                      <Input id="product-weight" type="number" min="0.01" step="0.01" {...register("weight")} />
                      {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-stock" className="font-semibold text-navy">Stock Quantity *</Label>
                      <Input id="product-stock" type="number" min="0" step="1" {...register("stockQuantity")} />
                      {errors.stockQuantity && <p className="text-sm text-destructive">{errors.stockQuantity.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-low-stock" className="font-semibold text-navy">Low Stock Threshold *</Label>
                      <Input id="product-low-stock" type="number" min="0" step="1" {...register("lowStockThreshold")} />
                      {errors.lowStockThreshold && <p className="text-sm text-destructive">{errors.lowStockThreshold.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
                    <div>
                      <h4 className="text-sm font-bold text-navy">Technical Data Sheet (TDS)</h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Enter the document URL and public ID manually for now.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-tds-url" className="font-semibold text-navy">TDS URL *</Label>
                      <Input id="product-tds-url" type="url" placeholder="https://example.com/product-tds.pdf" {...register("tdsUrl")} />
                      {errors.tdsUrl && <p className="text-sm text-destructive">{errors.tdsUrl.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-tds-public-id" className="font-semibold text-navy">TDS Public ID *</Label>
                      <Input id="product-tds-public-id" placeholder="enviroshield/products/product-tds" {...register("tdsPublicId")} />
                      {errors.tdsPublicId && <p className="text-sm text-destructive">{errors.tdsPublicId.message}</p>}
                    </div>
                  </div>
                </section>
              )}

              {/* STEP 4: SEO & PUBLISHING */}
              {currentStep === 3 && (
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy">SEO & Publishing</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Complete the required search metadata and publishing settings.
                    </p>
                  </div>

                  <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
                    <div className="space-y-2">
                      <Label htmlFor="product-meta-title" className="font-semibold text-navy">Meta Title *</Label>
                      <Input id="product-meta-title" {...register("seo.metaTitle")} />
                      {errors.seo?.metaTitle && <p className="text-sm text-destructive">{errors.seo.metaTitle.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-meta-description" className="font-semibold text-navy">Meta Description *</Label>
                      <Textarea id="product-meta-description" className="min-h-24 resize-none" {...register("seo.metaDescription")} />
                      {errors.seo?.metaDescription && <p className="text-sm text-destructive">{errors.seo.metaDescription.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="font-semibold text-navy">SEO Keywords *</Label>
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
                          placeholder="e.g. waterproofing"
                        />
                        <DashboardButton
                          type="button"
                          variant="outline"
                          icon={<Plus className="h-4 w-4" />}
                          onClick={addKeyword}
                          className="shrink-0"
                        >
                          Add
                        </DashboardButton>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {currentKeywords.map((keyword, index) => (
                          <div key={`${keyword}-${index}`} className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm">
                            <span>{keyword}</span>
                            <button
                              type="button"
                              onClick={() => removeKeyword(index)}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label={`Remove keyword ${keyword}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {errors.seo?.keywords && <p className="text-sm text-destructive">{errors.seo.keywords.message}</p>}
                    </div>

                    <div className="space-y-5 border-t pt-5">
                      <div>
                        <h4 className="text-sm font-bold text-navy">Open Graph</h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Metadata and image displayed when this product is shared.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product-og-title" className="font-semibold text-navy">OG Title *</Label>
                        <Input id="product-og-title" {...register("seo.ogTitle")} />
                        {errors.seo?.ogTitle && <p className="text-sm text-destructive">{errors.seo.ogTitle.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product-og-description" className="font-semibold text-navy">OG Description *</Label>
                        <Textarea id="product-og-description" className="min-h-24 resize-none" {...register("seo.ogDescription")} />
                        {errors.seo?.ogDescription && <p className="text-sm text-destructive">{errors.seo.ogDescription.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label className="font-semibold text-navy">OG Image *</Label>
                        <ImageUploader
                          value={ogImageUrl}
                          imagePublicId={ogImagePublicId}
                          onChange={(url, publicId) => {
                            setValue("seo.ogImage", url, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setValue("seo.ogImagePublicId", publicId, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                        />
                        {errors.seo?.ogImage && <p className="text-sm text-destructive">{errors.seo.ogImage.message}</p>}
                        {errors.seo?.ogImagePublicId && <p className="text-sm text-destructive">{errors.seo.ogImagePublicId.message}</p>}
                        <p className="text-xs text-muted-foreground">
                          Initially synced with the primary image. Upload another image here to customize it.
                        </p>
                      </div>
                    </div>

                    <Controller
                      control={control}
                      name="seo.noIndex"
                      render={({ field }) => (
                        <div className="flex items-center justify-between rounded-xl border bg-background p-4">
                          <div className="pr-4">
                            <Label className="font-semibold text-navy">No Index</Label>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              Ask search engines not to index this product.
                            </p>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                            aria-label="Prevent search engine indexing"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      control={control}
                      name="isFeatured"
                      render={({ field }) => (
                        <div className="flex items-center justify-between rounded-xl border bg-background p-4">
                          <div className="pr-4">
                            <Label className="font-semibold text-navy">Featured Product</Label>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              Highlight this product in featured product areas.
                            </p>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                            aria-label="Mark product as featured"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <div className="flex items-center justify-between rounded-xl border bg-background p-4">
                          <div className="pr-4">
                            <Label className="font-semibold text-navy">Publish Product</Label>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              Turn on to publish now; otherwise save as a draft.
                            </p>
                          </div>
                          <Switch
                            checked={field.value === "published"}
                            onCheckedChange={(checked) => field.onChange(checked ? "published" : "draft")}
                            disabled={isLoading}
                            aria-label="Publish product"
                          />
                        </div>
                      )}
                    />
                  </div>
                </section>
              )}
            </div>

            {/* Footer navigation */}
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
                    disabled={isLoading || isLoadingCategories || categories.length === 0}
                    icon={
                      isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )
                    }
                  >
                    {isLoading ? "Creating..." : "Create Product"}
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