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
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { usePatch } from "@/hooks/swr/usePatch";
import type { IBlog } from "@/types";
import { generateSlug } from "@/utils/generateSlug";

import DashboardButton from "../../DashboardButton";
import BlogEditor from "./BlogEditor";

type EditBlogModalProps = {
  blog: IBlog | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
};

const imageSchema = z.object({
  url: z.string().min(1, "Cover image is required"),
  alt: z.string().min(1, "Image alt text is required"),
  caption: z.string().optional(),
});

const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),

  keywords: z.array(z.string().min(1, "Keyword cannot be empty")),

  canonicalUrl: z.string().optional(),

  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),

  noIndex: z.boolean(),
});

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Blog title is required")
    .max(200, "Blog title must be 200 characters or less"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  excerpt: z.string().min(1, "Excerpt is required"),

  content: z
    .record(z.string(), z.unknown())
    .refine(
      (value) => Object.keys(value).length > 0,
      "Blog content is required",
    ),

  coverImage: imageSchema,

  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag is required"),

  status: z.enum(["draft", "published"]),

  seo: seoSchema,
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  title: "",
  slug: "",
  excerpt: "",

  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
  },

  coverImage: {
    url: "",
    alt: "",
    caption: "",
  },

  tags: [],

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
    description: "Blog details and cover image",
  },
  {
    number: "02",
    title: "Blog Content",
    shortTitle: "Content",
    description: "Write and edit the article",
  },
  {
    number: "03",
    title: "Tags & Publishing",
    shortTitle: "Publishing",
    description: "Organize and publish the article",
  },
  {
    number: "04",
    title: "SEO",
    shortTitle: "SEO",
    description: "Search and social sharing settings",
  },
];

const getBlogFormValues = (blog: IBlog): FormValues => ({
  title: blog.title ?? "",

  slug: blog.slug ?? "",

  excerpt: blog.excerpt ?? "",

  content:
    blog.content && typeof blog.content === "object"
      ? blog.content
      : defaultValues.content,

  coverImage: {
    url: blog.coverImage?.url ?? "",
    alt: blog.coverImage?.alt ?? "",
    caption: blog.coverImage?.caption ?? "",
  },

  tags: Array.isArray(blog.tags) ? blog.tags : [],

  status: blog.status === "published" ? "published" : "draft",

  seo: {
    metaTitle: blog.seo?.metaTitle ?? "",
    metaDescription: blog.seo?.metaDescription ?? "",

    keywords: Array.isArray(blog.seo?.keywords)
      ? blog.seo.keywords
      : [],

    canonicalUrl: blog.seo?.canonicalUrl ?? "",

    ogTitle: blog.seo?.ogTitle ?? "",

    ogDescription: blog.seo?.ogDescription ?? "",

    ogImage: blog.seo?.ogImage ?? "",

    noIndex: blog.seo?.noIndex ?? false,
  },
});

export default function EditBlogModal({
  blog,
  open,
  revalidateKey,
  onClose,
}: EditBlogModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const [tagInput, setTagInput] = useState("");

  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  const [editorContent, setEditorContent] = useState<
    Record<string, unknown>
  >(defaultValues.content);

  const { mutate: updateBlog, isLoading } = usePatch("/blog", {
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

  const currentTags = watch("tags");

  const currentKeywords = watch("seo.keywords");

  useEffect(() => {
    if (!open || !blog) return;

    const values = getBlogFormValues(blog);

    reset(values);

    setEditorContent(values.content);

    setCurrentStep(0);
    setTagInput("");
    setSeoKeywordInput("");
  }, [open, blog, reset]);

  const handleClose = () => {
    if (isLoading) return;

    onClose();

    reset(defaultValues);

    setEditorContent(defaultValues.content);

    setCurrentStep(0);
    setTagInput("");
    setSeoKeywordInput("");
  };

  const handleNextStep = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = await trigger([
          "title",
          "slug",
          "excerpt",
          "coverImage",
        ]);
        break;

      case 1:
        isValid = await trigger("content");
        break;

      case 2:
        isValid = await trigger(["tags", "status"]);
        break;

      case 3:
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

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (
      currentTags.some(
        (existingTag) =>
          existingTag.toLowerCase() === tag.toLowerCase(),
      )
    ) {
      toast.error("This tag already exists.");
      return;
    }

    setValue("tags", [...currentTags, tag], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setTagInput("");
  };

  const removeTag = (index: number) => {
    setValue(
      "tags",
      currentTags.filter((_, tagIndex) => tagIndex !== index),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const addSeoKeyword = () => {
    const keyword = seoKeywordInput.trim();

    if (!keyword) return;

    if (
      currentKeywords.some(
        (existingKeyword) =>
          existingKeyword.toLowerCase() === keyword.toLowerCase(),
      )
    ) {
      toast.error("This keyword already exists.");
      return;
    }

    setValue("seo.keywords", [...currentKeywords, keyword], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSeoKeywordInput("");
  };

  const removeSeoKeyword = (index: number) => {
    setValue(
      "seo.keywords",
      currentKeywords.filter(
        (_, keywordIndex) => keywordIndex !== index,
      ),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const onSubmit = async (values: FormValues) => {
    if (!blog) return;

    try {
      const publishedAt =
        values.status === "published"
          ? blog.status === "published" && blog.publishedAt
            ? blog.publishedAt
            : new Date()
          : null;

      await updateBlog({
        id: blog._id,

        data: {
          title: values.title,
          slug: values.slug,
          excerpt: values.excerpt,
          content: values.content,

          coverImage: {
            url: values.coverImage.url,
            alt: values.coverImage.alt,
            caption: values.coverImage.caption || "",
          },

          tags: values.tags,

          status: values.status,

          publishedAt,

          seo: {
            metaTitle: values.seo.metaTitle || "",

            metaDescription: values.seo.metaDescription || "",

            keywords: values.seo.keywords,

            canonicalUrl: values.seo.canonicalUrl || "",

            ogTitle: values.seo.ogTitle || "",

            ogDescription: values.seo.ogDescription || "",

            ogImage: values.seo.ogImage || "",

            noIndex: values.seo.noIndex,
          },
        },
      });

      toast.success("Blog updated successfully.");

      onClose();

      reset(defaultValues);

      setEditorContent(defaultValues.content);

      setCurrentStep(0);
      setTagInput("");
      setSeoKeywordInput("");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update blog.";

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
              Edit Blog
            </DialogTitle>

            <DialogDescription className="text-sm leading-6">
              Update the content, publishing, and SEO settings for{" "}
              <span className="font-semibold text-foreground">
                {blog?.title ?? "this blog"}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          {/* Step Timeline */}
          <div className="border-b bg-muted/20 px-5 py-5 sm:px-8">
            <div className="relative">
              <div className="absolute left-[7%] right-[7%] top-5 hidden h-px bg-border md:block" />

              <div className="relative grid grid-cols-4 gap-2">
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
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy">
                      Basic Information
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Update the main information customers will see
                      for this blog.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-blog-title"
                        className="text-sm font-semibold text-navy"
                      >
                        Blog Title
                      </Label>

                      <Input
                        id="edit-blog-title"
                        placeholder="Why Environmental Responsibility Matters"
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
                      />

                      {errors.title && (
                        <p className="text-sm text-destructive">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-blog-slug"
                        className="text-sm font-semibold text-navy"
                      >
                        Slug
                      </Label>

                      <Input
                        id="edit-blog-slug"
                        placeholder="why-environmental-responsibility-matters"
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
                    <Label
                      htmlFor="edit-blog-excerpt"
                      className="text-sm font-semibold text-navy"
                    >
                      Excerpt
                    </Label>

                    <Textarea
                      id="edit-blog-excerpt"
                      placeholder="Write a short summary of the blog..."
                      className="min-h-28 resize-none"
                      {...register("excerpt")}
                    />

                    {errors.excerpt && (
                      <p className="text-sm text-destructive">
                        {errors.excerpt.message}
                      </p>
                    )}
                  </div>

                  {/* Cover Image */}
                  <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
                    <div>
                      <h4 className="text-sm font-bold text-navy">
                        Cover Image
                      </h4>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Update the main image used for this blog.
                      </p>
                    </div>

                    <Controller
                      control={control}
                      name="coverImage.url"
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold">
                            Image
                          </Label>

                          <ImageUploader
                            value={field.value}
                            onChange={(url) => field.onChange(url)}
                          />
                        </div>
                      )}
                    />

                    {errors.coverImage?.url && (
                      <p className="text-sm text-destructive">
                        {errors.coverImage.url.message}
                      </p>
                    )}

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="edit-cover-image-alt"
                          className="text-sm font-semibold text-navy"
                        >
                          Alt Text
                        </Label>

                        <Input
                          id="edit-cover-image-alt"
                          placeholder="Environmental responsibility"
                          {...register("coverImage.alt")}
                        />

                        {errors.coverImage?.alt && (
                          <p className="text-sm text-destructive">
                            {errors.coverImage.alt.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="edit-cover-image-caption"
                          className="text-sm font-semibold text-navy"
                        >
                          Caption
                        </Label>

                        <Input
                          id="edit-cover-image-caption"
                          placeholder="Building a more sustainable future"
                          {...register("coverImage.caption")}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* STEP 2 */}
              {currentStep === 1 && (
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy">
                      Blog Content
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Edit the article using the same reusable rich
                      text editor used by the Create Blog modal.
                    </p>
                  </div>

                  <Controller
                    control={control}
                    name="content"
                    render={() => (
                      <BlogEditor
                        value={editorContent}
                        onChange={(content) => {
                          setEditorContent(content);

                          setValue("content", content, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        disabled={isLoading}
                      />
                    )}
                  />

                  {errors.content?.message && (
                    <p className="text-sm text-destructive">
                      {String(errors.content.message)}
                    </p>
                  )}

                  <div className="rounded-xl border bg-muted/20 p-4">
                    <p className="text-xs leading-5 text-muted-foreground">
                      <strong className="text-navy">Tip:</strong> You
                      can edit existing content, upload new images,
                      resize images, align images, add links,
                      headings, lists, code blocks, and other rich
                      content directly inside the editor.
                    </p>
                  </div>
                </section>
              )}

              {/* STEP 3 */}
              {currentStep === 2 && (
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy">
                      Tags & Publishing
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Update the article organization and publishing
                      status.
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="space-y-4 rounded-2xl border bg-muted/10 p-5">
                    <div>
                      <Label className="text-sm font-semibold text-navy">
                        Tags
                      </Label>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Add or remove tags associated with this blog.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(event) =>
                          setTagInput(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="e.g. sustainability"
                      />

                      <DashboardButton
                        type="button"
                        variant="outline"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={addTag}
                        className="h-10 shrink-0 rounded-full px-4 text-xs font-semibold"
                      >
                        Add
                      </DashboardButton>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {currentTags.map((tag, index) => (
                        <div
                          key={`${tag}-${index}`}
                          className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm"
                        >
                          <span>{tag}</span>

                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {errors.tags && (
                      <p className="text-sm text-destructive">
                        {errors.tags.message}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-navy">
                      Status
                    </Label>

                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-10 w-full">
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
                      )}
                    />

                    {errors.status && (
                      <p className="text-sm text-destructive">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* STEP 4 */}
              {currentStep === 3 && (
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy">
                      SEO Settings
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Update the metadata used by search engines and
                      social platforms.
                    </p>
                  </div>

                  <div className="space-y-5 rounded-2xl border bg-muted/10 p-5">
                    {/* Meta Title */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-seo-meta-title"
                        className="text-sm font-semibold text-navy"
                      >
                        Meta Title
                      </Label>

                      <Input
                        id="edit-seo-meta-title"
                        placeholder="Why Environmental Responsibility Matters"
                        {...register("seo.metaTitle")}
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-seo-meta-description"
                        className="text-sm font-semibold text-navy"
                      >
                        Meta Description
                      </Label>

                      <Textarea
                        id="edit-seo-meta-description"
                        placeholder="Explore the importance of environmental responsibility and sustainable practices."
                        className="min-h-28 resize-none"
                        {...register("seo.metaDescription")}
                      />
                    </div>

                    {/* Keywords */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-semibold text-navy">
                          SEO Keywords
                        </Label>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Add or remove keywords relevant to this
                          article.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Input
                          value={seoKeywordInput}
                          onChange={(event) =>
                            setSeoKeywordInput(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              addSeoKeyword();
                            }
                          }}
                          placeholder="e.g. environmental responsibility"
                        />

                        <DashboardButton
                          type="button"
                          variant="outline"
                          icon={<Plus className="h-4 w-4" />}
                          onClick={addSeoKeyword}
                          className="h-10 shrink-0 rounded-full px-4 text-xs font-semibold"
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
                              onClick={() => removeSeoKeyword(index)}
                              className="text-muted-foreground transition-colors hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Canonical URL */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-seo-canonical"
                        className="text-sm font-semibold text-navy"
                      >
                        Canonical URL
                      </Label>

                      <Input
                        id="edit-seo-canonical"
                        placeholder="https://enviroshield.com/blog/example"
                        {...register("seo.canonicalUrl")}
                      />
                    </div>

                    {/* Open Graph */}
                    <div className="space-y-5 border-t pt-5">
                      <div>
                        <h4 className="text-sm font-bold text-navy">
                          Open Graph
                        </h4>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Metadata used when the blog is shared on
                          social platforms.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="edit-og-title"
                          className="text-sm font-semibold text-navy"
                        >
                          OG Title
                        </Label>

                        <Input
                          id="edit-og-title"
                          {...register("seo.ogTitle")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="edit-og-description"
                          className="text-sm font-semibold text-navy"
                        >
                          OG Description
                        </Label>

                        <Textarea
                          id="edit-og-description"
                          className="min-h-24 resize-none"
                          {...register("seo.ogDescription")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="edit-og-image"
                          className="text-sm font-semibold text-navy"
                        >
                          OG Image URL
                        </Label>

                        <Input
                          id="edit-og-image"
                          placeholder="https://..."
                          {...register("seo.ogImage")}
                        />
                      </div>
                    </div>

                    {/* No Index */}
                    <Controller
                      control={control}
                      name="seo.noIndex"
                      render={({ field }) => (
                        <div className="flex items-center justify-between rounded-xl border bg-background p-4">
                          <div className="pr-4">
                            <Label className="font-semibold text-navy">
                              No Index
                            </Label>

                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              Prevent search engines from indexing
                              this blog.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(!field.value)
                            }
                            className={[
                              "relative h-6 w-11 rounded-full transition-colors",
                              field.value ? "bg-blue" : "bg-muted",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                                field.value ? "left-6" : "left-1",
                              ].join(" ")}
                            />
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </section>
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
                          <Check className="h-4 w-4" />
                        )
                      }
                    >
                      {isLoading ? "Updating..." : "Update Blog"}
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
