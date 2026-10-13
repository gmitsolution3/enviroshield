"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { JSONContent } from "@tiptap/react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

import { authClient } from "@/lib/auth-client";
import { generateSlug } from "@/utils/generateSlug";
import { toast } from "sonner";

import DashboardButton from "../../DashboardButton";
import BlogEditor from "./BlogEditor";

const imageSchema = z.object({
  url: z.string().min(1, "Cover image is required"),
  publicId: z.string().min(1, "Cover image public ID is required"),
  alt: z.string().min(1, "Cover image alt text is required"),
  caption: z.string().optional(),
});

const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string().min(1, "Keyword cannot be empty")),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  ogImagePublicId: z.string(),
  noIndex: z.boolean(),
});

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Blog title is required")
    .max(200, "Title must be 200 characters or less"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),

  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.any(),
  coverImage: imageSchema,

  tags: z
    .array(z.string().min(1))
    .min(1, "At least one tag is required"),

  status: z.enum(["draft", "published"]),
  seo: seoSchema,
});

type FormValues = z.infer<typeof formSchema>;

type CreateBlogModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccess?: () => void;
};

const emptyContent: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const defaultValues: FormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: emptyContent,

  coverImage: {
    url: "",
    publicId: "",
    alt: "",
    caption: "",
  },

  tags: [],
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

export default function CreateBlogModal({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}: CreateBlogModalProps) {
  const { data: session } = authClient.useSession();

  const [currentStep, setCurrentStep] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  // The cover image supplies the OG image until a custom one is chosen.
  const [ogImageCustomized, setOgImageCustomized] = useState(false);

  const { mutate: postBlog, isLoading } = usePost("/blog", {
    revalidateKey: "/blog",
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
    storageKey: "enviroshield:draft:create-blog",
    watch,
    reset,
    defaultValues,
  });

  const currentTags = watch("tags") ?? [];
  const currentKeywords = watch("seo.keywords") ?? [];

  const currentMetaTitle = watch("seo.metaTitle");
  const currentOgTitle = watch("seo.ogTitle");
  const currentMetaDescription = watch("seo.metaDescription");
  const currentOgDescription = watch("seo.ogDescription");

  const editorContent = watch("content");

  const steps = [
    {
      number: "01",
      title: "Basic Information",
      shortTitle: "Basic",
      description: "Title, excerpt and cover image",
    },
    {
      number: "02",
      title: "Content",
      shortTitle: "Content",
      description: "Write the blog article",
    },
    {
      number: "03",
      title: "Tags & Status",
      shortTitle: "Publish",
      description: "Tags and publishing status",
    },
    {
      number: "04",
      title: "SEO",
      shortTitle: "SEO",
      description: "Search engine settings",
    },
  ];

  const stepFields = [
    ["title", "slug", "excerpt", "coverImage"],
    ["content"],
    ["tags", "status"],
    ["seo"],
  ] as const;

  const handleClose = () => {
    if (isLoading) return;

    // Keep the current form values in the persistent draft.
    setIsModalOpen(false);
    setCurrentStep(0);
    setTagInput("");
    setSeoKeywordInput("");
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

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (currentTags.includes(tag)) {
      setTagInput("");
      return;
    }

    setValue("tags", [...currentTags, tag], {
      shouldDirty: true,
      shouldValidate: true,
    });

    setTagInput("");
  };

  const removeTag = (index: number) => {
    setValue(
      "tags",
      currentTags.filter((_, tagIndex) => tagIndex !== index),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const addSeoKeyword = () => {
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

  const removeSeoKeyword = (index: number) => {
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

  const syncOgImageWithCover = (url: string, publicId: string) => {
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
      const authorId = session?.user.id;

      if (!authorId) {
        toast.error("Unable to determine the current user.");
        return;
      }

      const payload = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,

        coverImage: {
          url: data.coverImage.url,
          publicId: data.coverImage.publicId,
          alt: data.coverImage.alt,
          caption: data.coverImage.caption || "",
        },

        tags: data.tags,
        authorId,
        status: data.status,

        publishedAt: data.status === "published" ? new Date() : null,

        seo: {
          metaTitle: data.seo.metaTitle || "",
          metaDescription: data.seo.metaDescription || "",
          keywords: data.seo.keywords,
          ogTitle: data.seo.ogTitle || "",
          ogDescription: data.seo.ogDescription || "",
          ogImage: data.seo.ogImage || "",
          ogImagePublicId: data.seo.ogImagePublicId,
          noIndex: data.seo.noIndex,
        },
      };

      const response = await postBlog(payload);

      if (response?.success) {
        toast.success(
          response.message || "Blog created successfully.",
        );

        clearDraft();
        setIsModalOpen(false);
        setCurrentStep(0);
        setTagInput("");
        setSeoKeywordInput("");
        setOgImageCustomized(false);
        onSuccess?.();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create blog.";

      toast.error(message);
      console.error("Failed to create blog:", error);
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
              Add Blog
            </DialogTitle>

            <DialogDescription className="text-sm leading-6">
              Create a new blog article with rich content, images,
              tags, publishing and SEO settings.
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
                  <div className="absolute left-[8%] right-[8%] top-5 hidden h-px bg-border md:block" />

                  <div className="relative grid grid-cols-4 gap-2">
                    {steps.map((step, index) => {
                      const isCompleted = index < currentStep;
                      const isActive = index === currentStep;

                      return (
                        <button
                          key={step.number}
                          type="button"
                          disabled={index >= currentStep}
                          onClick={() => {
                            if (index < currentStep) {
                              setCurrentStep(index);
                            }
                          }}
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
                            {isCompleted ? "✓" : step.number}
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

              {/* STEP 1 */}
              {currentStep === 0 && (
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy">
                      Basic Information
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Configure the main information and cover image
                      for the blog.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="blog-title"
                        className="text-sm font-semibold text-navy"
                      >
                        Title
                      </Label>

                      <Input
                        id="blog-title"
                        placeholder="Why Environmental Responsibility Matters"
                        {...register("title")}
                        onChange={(event) => {
                          const title = event.target.value;

                          setValue("title", title, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });

                          setValue("slug", generateSlug(title), {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                      />

                      {errors.title && (
                        <p className="text-sm text-destructive">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="blog-slug"
                        className="text-sm font-semibold text-navy"
                      >
                        Slug
                      </Label>

                      <Input
                        id="blog-slug"
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
                      htmlFor="blog-excerpt"
                      className="text-sm font-semibold text-navy"
                    >
                      Excerpt
                    </Label>

                    <Textarea
                      id="blog-excerpt"
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
                        Upload the main image used for this blog.
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
                            imagePublicId={watch(
                              "coverImage.publicId",
                            )}
                            onChange={(url, publicId) => {
                              field.onChange(url);

                              setValue(
                                "coverImage.publicId",
                                publicId,
                                {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                },
                              );

                              syncOgImageWithCover(url, publicId);
                            }}
                          />

                          {errors.coverImage?.url && (
                            <p className="text-sm text-destructive">
                              {errors.coverImage.url.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="cover-image-alt"
                          className="text-sm font-semibold text-navy"
                        >
                          Alt Text
                        </Label>

                        <Input
                          id="cover-image-alt"
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
                          htmlFor="cover-image-caption"
                          className="text-sm font-semibold text-navy"
                        >
                          Caption
                        </Label>

                        <Input
                          id="cover-image-caption"
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
                      Write and format the full blog article using the
                      rich-text editor.
                    </p>
                  </div>

                  <div className="space-y-4 rounded-2xl border bg-muted/10 p-5">
                    <div>
                      <Label className="text-sm font-semibold text-navy">
                        Article Content
                      </Label>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Use headings, lists, links, and images to
                        structure your article.
                      </p>
                    </div>

                    <Controller
                      control={control}
                      name="content"
                      render={({ field }) => (
                        <BlogEditor
                          value={editorContent}
                          onChange={(content) =>
                            field.onChange(content)
                          }
                          disabled={isLoading}
                        />
                      )}
                    />

                    {errors.content && (
                      <p className="text-sm text-destructive">
                        Blog content is required.
                      </p>
                    )}

                    <div className="rounded-xl border bg-background p-4">
                      <p className="text-xs leading-5 text-muted-foreground">
                        <strong className="text-navy">Tip:</strong>{" "}
                        Use the image button in the editor toolbar to
                        upload images directly into the article.
                      </p>
                    </div>
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
                      Organize the article and choose whether it
                      should be published.
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="space-y-4 rounded-2xl border bg-muted/10 p-5">
                    <div>
                      <Label className="text-sm font-semibold text-navy">
                        Tags
                      </Label>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Add relevant tags to help categorize this
                        blog.
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
                        disabled={isLoading}
                      />

                      <DashboardButton
                        type="button"
                        variant="outline"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={addTag}
                        disabled={isLoading}
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
                            disabled={isLoading}
                            aria-label={`Remove tag ${tag}`}
                            className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
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

                  {/* Publishing Status */}
                  <div className="flex items-center justify-between gap-6 rounded-2xl border bg-muted/10 p-5">
                    <div>
                      <Label
                        htmlFor="blog-publish-status"
                        className="text-sm font-semibold text-navy"
                      >
                        Publish Blog
                      </Label>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Turn this on to publish the article
                        immediately. Leave it off to save it as a
                        draft.
                      </p>

                      <p className="mt-2 text-xs font-semibold text-navy">
                        {watch("status") === "published"
                          ? "Status: Published"
                          : "Status: Draft"}
                      </p>
                    </div>

                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Switch
                          id="blog-publish-status"
                          checked={field.value === "published"}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked ? "published" : "draft",
                            );
                          }}
                          disabled={isLoading}
                        />
                      )}
                    />
                  </div>

                  <div className="rounded-xl border bg-muted/20 p-4">
                    <p className="text-xs leading-5 text-muted-foreground">
                      <strong className="text-navy">
                        Publishing:
                      </strong>{" "}
                      Published articles receive the current date and
                      time as{" "}
                      <code className="rounded bg-background px-1 py-0.5">
                        publishedAt
                      </code>
                      . Drafts use{" "}
                      <code className="rounded bg-background px-1 py-0.5">
                        null
                      </code>
                      .
                    </p>
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
                      Configure search engine metadata and social
                      sharing details for your article.
                    </p>
                  </div>

                  <div className="space-y-6 rounded-2xl border bg-muted/10 p-5">
                    {/* Meta Title */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="seo-meta-title"
                        className="text-sm font-semibold text-navy"
                      >
                        Meta Title
                      </Label>

                      <Input
                        id="seo-meta-title"
                        placeholder="Enter an SEO-friendly title"
                        maxLength={60}
                        {...register("seo.metaTitle")}
                      />

                      <p className="text-xs text-muted-foreground">
                        {watch("seo.metaTitle")?.length ?? 0}/60
                        characters
                      </p>
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="seo-meta-description"
                        className="text-sm font-semibold text-navy"
                      >
                        Meta Description
                      </Label>

                      <Textarea
                        id="seo-meta-description"
                        placeholder="Write a concise summary for search engine results..."
                        className="min-h-28 resize-y"
                        maxLength={160}
                        {...register("seo.metaDescription")}
                      />

                      <p className="text-xs text-muted-foreground">
                        {watch("seo.metaDescription")?.length ?? 0}
                        /160 characters
                      </p>
                    </div>

                    {/* SEO Keywords */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-semibold text-navy">
                          SEO Keywords
                        </Label>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Add relevant keywords, one at a time.
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
                          placeholder="e.g. environmental protection"
                          disabled={isLoading}
                        />

                        <DashboardButton
                          type="button"
                          variant="outline"
                          icon={<Plus className="h-4 w-4" />}
                          onClick={addSeoKeyword}
                          disabled={isLoading}
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
                              disabled={isLoading}
                              aria-label={`Remove keyword ${keyword}`}
                              className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {errors.seo?.keywords && (
                        <p className="text-sm text-destructive">
                          {errors.seo.keywords.message}
                        </p>
                      )}
                    </div>

                    {/* Open Graph */}
                    <div className="space-y-5 rounded-xl border bg-background p-4">
                      <div>
                        <h4 className="text-sm font-bold text-navy">
                          Social Sharing
                        </h4>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          These details control how the article
                          appears when shared on social media
                          platforms that support Open Graph metadata.
                        </p>
                      </div>

                      {/* OG Title */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="seo-og-title"
                          className="text-sm font-semibold text-navy"
                        >
                          OG Title
                        </Label>

                        <Input
                          id="seo-og-title"
                          placeholder="Social sharing title"
                          {...register("seo.ogTitle")}
                        />
                      </div>

                      {/* OG Description */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="seo-og-description"
                          className="text-sm font-semibold text-navy"
                        >
                          OG Description
                        </Label>

                        <Textarea
                          id="seo-og-description"
                          placeholder="Description shown when the article is shared..."
                          className="min-h-24 resize-y"
                          {...register("seo.ogDescription")}
                        />
                      </div>

                      {/* OG Image */}
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-semibold text-navy">
                            Social Sharing Image
                          </Label>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            By default, the cover image is used.
                            Upload a different image here if you want
                            a dedicated social sharing image.
                          </p>
                        </div>

                        <Controller
                          control={control}
                          name="seo.ogImage"
                          render={({ field }) => (
                            <ImageUploader
                              value={field.value || ""}
                              imagePublicId={watch(
                                "seo.ogImagePublicId",
                              )}
                              onChange={(url, publicId) => {
                                field.onChange(url);

                                setValue(
                                  "seo.ogImagePublicId",
                                  publicId || "",
                                  {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  },
                                );

                                // Keep the cover image and OG image independent
                                // after the user explicitly changes the OG image.
                                setOgImageCustomized(true);
                              }}
                            />
                          )}
                        />

                        {watch("seo.ogImage") && (
                          <button
                            type="button"
                            onClick={() => {
                              setValue(
                                "seo.ogImage",
                                watch("coverImage.url") || "",
                                {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                },
                              );

                              setValue(
                                "seo.ogImagePublicId",
                                watch("coverImage.publicId") || "",
                                {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                },
                              );

                              setOgImageCustomized(false);
                            }}
                            disabled={isLoading}
                            className="text-xs font-semibold text-blue underline underline-offset-4 transition-colors hover:text-blue/80 disabled:opacity-50"
                          >
                            Use cover image instead
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Search Engine Indexing */}
                    <div className="flex items-center justify-between gap-6 rounded-xl border bg-background p-4">
                      <div className="pr-4">
                        <Label
                          htmlFor="seo-no-index"
                          className="text-sm font-semibold text-navy"
                        >
                          No Index
                        </Label>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Ask search engines not to index this
                          article.
                        </p>
                      </div>

                      <Controller
                        control={control}
                        name="seo.noIndex"
                        render={({ field }) => (
                          <Switch
                            id="seo-no-index"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        )}
                      />
                    </div>
                  </div>
                </section>
              )}
            </div>

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
                    {isLoading ? "Creating..." : "Create Blog"}
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
