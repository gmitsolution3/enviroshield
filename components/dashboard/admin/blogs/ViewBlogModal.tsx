"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  ImageIcon,
  Search,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import type { IBlog } from "@/types";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatDate } from "@/utils/formatDate";

import DashboardButton from "../../DashboardButton";
import { BlogImage } from "./BlogImage";

type ViewBlogModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  blog: IBlog | null;
};

export default function ViewBlogModal({
  isModalOpen,
  setIsModalOpen,
  blog,
}: ViewBlogModalProps) {
  if (!blog) return null;

  const isPublished = blog.status === "published";

  const content =
    blog.content &&
    typeof blog.content === "object" &&
    !Array.isArray(blog.content)
      ? blog.content
      : {
          type: "doc",
          content: [
            {
              type: "paragraph",
            },
          ],
        };

  const handleClose = () => {
    setIsModalOpen(false);
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
      <DialogContent className="max-h-[92vh] !max-w-6xl overflow-y-auto border-0 bg-[#f8fafc] p-0 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Blog Details</DialogTitle>

          <DialogDescription>
            View complete information about this Enviroshield blog.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden">
          {/* =====================================================
              HERO
          ===================================================== */}

          <section className="relative overflow-hidden bg-navy px-6 py-6 text-white sm:px-8 sm:py-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />

            <div className="relative grid gap-6 lg:grid-cols-[340px_1fr]">
              {/* Cover Image */}

              <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
                {blog.coverImage?.url ? (
                  <Image
                    src={blog.coverImage.url}
                    alt={blog.coverImage.alt || blog.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[240px] items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-white/30" />
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-5 pb-4 pt-16">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                    Cover Image
                  </p>

                  {blog.coverImage?.caption && (
                    <p className="mt-1 text-sm text-white/90">
                      {blog.coverImage.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* Hero Content */}

              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={
                        isPublished
                          ? "gap-1 border-0 bg-emerald-500 text-white hover:bg-emerald-500"
                          : "gap-1 border-0 bg-white/10 text-white hover:bg-white/15"
                      }
                    >
                      {isPublished ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}

                      {blog.status}
                    </Badge>

                    {blog.tags.length > 0 && (
                      <Badge className="gap-1 border-0 bg-white/10 text-white hover:bg-white/15">
                        <Tag className="h-3 w-3" />
                        {blog.tags.length}{" "}
                        {blog.tags.length === 1 ? "Tag" : "Tags"}
                      </Badge>
                    )}
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                    Blog Article
                  </p>

                  <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                    {blog.title}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-white/50">
                    <span className="break-all font-mono">
                      /{blog.slug}
                    </span>
                  </div>

                  {blog.excerpt && (
                    <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70 sm:text-[15px]">
                      {blog.excerpt}
                    </p>
                  )}
                </div>

                {/* Hero Metadata */}

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <HeroMeta
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={formatDate(blog.createdAt)}
                  />

                  <HeroMeta
                    icon={<Clock className="h-4 w-4" />}
                    label="Updated"
                    value={formatDate(blog.updatedAt)}
                  />

                  <HeroMeta
                    icon={<Globe className="h-4 w-4" />}
                    label="Published"
                    value={
                      blog.publishedAt
                        ? formatDate(blog.publishedAt)
                        : "Not published"
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              MAIN CONTENT
          ===================================================== */}

          <div className="space-y-6 p-5 sm:p-8">
            {/* ===================================================
                BLOG INFORMATION
            =================================================== */}

            <section>
              <SectionHeading
                eyebrow="Overview"
                title="Blog Information"
                description="Core information and publishing details for this article."
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Title"
                  value={blog.title}
                  icon={<FileText className="h-4 w-4" />}
                />

                <InfoCard
                  label="Status"
                  value={blog.status}
                  icon={
                    isPublished ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )
                  }
                  accent={isPublished ? "green" : "gray"}
                  capitalize
                />

                <InfoCard label="Slug" value={blog.slug} mono />

                <InfoCard label="Blog ID" value={blog._id} mono />

                <InfoCard
                  label="Author ID"
                  value={blog.authorId}
                  mono
                />

                <InfoCard
                  label="Published"
                  value={
                    blog.publishedAt
                      ? formatDate(blog.publishedAt)
                      : "Not published"
                  }
                  icon={<Globe className="h-4 w-4" />}
                />
              </div>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Excerpt
                </p>

                <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
                  {blog.excerpt || "No excerpt provided."}
                </p>
              </div>
            </section>

            {/* ===================================================
                AUTHOR
            =================================================== */}

            {blog.author && (
              <section>
                <SectionHeading
                  eyebrow="Author"
                  title="Author Information"
                  description="The author associated with this blog article."
                />

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue/5 text-blue">
                      {blog.author.image ? (
                        <Image
                          src={blog.author.image}
                          alt={blog.author.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-7 w-7" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-navy">
                        {blog.author.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {blog.author.email}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ===================================================
                TAGS
            =================================================== */}

            <section>
              <SectionHeading
                eyebrow="Organization"
                title="Tags"
                description="Tags associated with this article."
              />

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {blog.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="inline-flex items-center gap-2 rounded-full border border-blue/15 bg-blue/5 px-3 py-1.5 text-xs font-medium text-blue"
                      >
                        <Tag className="h-3 w-3" />

                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No tags have been added.
                  </p>
                )}
              </div>
            </section>

            {/* ===================================================
                BLOG CONTENT
            =================================================== */}

            <section>
              <SectionHeading
                eyebrow="Article"
                title="Blog Content"
                description="The complete article content from the rich text editor."
              />

              <div className="mt-5">
                <BlogContentViewer content={content} />
              </div>
            </section>

            {/* ===================================================
                SEO
            =================================================== */}

            {blog.seo && (
              <section>
                <SectionHeading
                  eyebrow="Discoverability"
                  title="SEO & Social"
                  description="Search engine and social sharing configuration for this blog."
                />

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/10 text-blue">
                        <Search className="h-4 w-4" />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-navy">
                          Search Engine Configuration
                        </h4>

                        <p className="text-xs text-slate-500">
                          Metadata used by search engines and social
                          platforms.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 md:grid-cols-2">
                    <SeoCard
                      label="Meta Title"
                      value={blog.seo.metaTitle || "Not provided"}
                    />

                    <SeoCard
                      label="OG Title"
                      value={blog.seo.ogTitle || "Not provided"}
                    />

                    <SeoCard
                      label="Meta Description"
                      value={
                        blog.seo.metaDescription || "Not provided"
                      }
                    />

                    <SeoCard
                      label="OG Description"
                      value={blog.seo.ogDescription || "Not provided"}
                    />

                    <SeoCard
                      label="Canonical URL"
                      value={blog.seo.canonicalUrl || "Not provided"}
                      link={Boolean(blog.seo.canonicalUrl)}
                    />

                    <SeoCard
                      label="OG Image"
                      value={blog.seo.ogImage || "Not provided"}
                      link={Boolean(blog.seo.ogImage)}
                    />
                  </div>

                  <div className="grid gap-4 border-t border-slate-100 bg-slate-50/50 p-5 md:grid-cols-[1fr_auto]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Keywords
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {blog.seo.keywords?.length ? (
                          blog.seo.keywords.map((keyword, index) => (
                            <span
                              key={`${keyword}-${index}`}
                              className="rounded-full border border-blue/15 bg-blue/5 px-3 py-1.5 text-xs font-medium text-blue"
                            >
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">
                            No keywords
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          blog.seo.noIndex
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {blog.seo.noIndex ? (
                          <XCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}

                        {blog.seo.noIndex
                          ? "Search indexing disabled"
                          : "Search indexing enabled"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ===================================================
                TIMELINE
            =================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Blog Timeline
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-navy">
                    Activity
                  </h3>
                </div>

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
                  <TimelineItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={formatDate(blog.createdAt)}
                  />

                  <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                  <TimelineItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Last Updated"
                    value={formatDate(blog.updatedAt)}
                  />

                  {blog.publishedAt && (
                    <>
                      <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                      <TimelineItem
                        icon={<Globe className="h-4 w-4" />}
                        label="Published"
                        value={formatDate(blog.publishedAt)}
                      />
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* ===================================================
                FOOTER
            =================================================== */}

            <div className="flex justify-end border-t border-slate-200 pt-5">
              <DashboardButton
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-10 rounded-full border-blue/30 bg-white px-6 text-sm font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/5 hover:text-blue hover:shadow-md"
              >
                Close
              </DashboardButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ===============================================================
   BLOG CONTENT VIEWER
=============================================================== */

function BlogContentViewer({
  content,
}: {
  content: Record<string, unknown>;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,

      Underline,

      Link.configure({
        openOnClick: true,
        autolink: false,
        defaultProtocol: "https",
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      BlogImage.configure({
        inline: false,
        allowBase64: false,
      }),
    ],

    content,

    editable: false,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "tiptap blog-content-viewer max-w-none focus:outline-none text-slate-700",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getJSON();

    if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <FileText className="mx-auto h-8 w-8 text-slate-300" />

        <p className="mt-3 text-sm font-medium text-slate-500">
          Loading blog content...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className="
          blog-content-viewer
          px-5 py-6
          sm:px-8 sm:py-10
          lg:px-12 lg:py-12

          [&_.ProseMirror]:max-w-none
          [&_.ProseMirror]:outline-none

          [&_h1]:mb-5
          [&_h1]:mt-8
          [&_h1]:text-3xl
          [&_h1]:font-bold
          [&_h1]:leading-tight
          [&_h1]:tracking-tight
          [&_h1]:text-navy
          [&_h1:first-child]:mt-0

          [&_h2]:mb-4
          [&_h2]:mt-8
          [&_h2]:text-2xl
          [&_h2]:font-bold
          [&_h2]:leading-tight
          [&_h2]:tracking-tight
          [&_h2]:text-navy

          [&_h3]:mb-3
          [&_h3]:mt-7
          [&_h3]:text-xl
          [&_h3]:font-semibold
          [&_h3]:leading-tight
          [&_h3]:text-navy

          [&_h4]:mb-3
          [&_h4]:mt-6
          [&_h4]:text-lg
          [&_h4]:font-semibold
          [&_h4]:text-navy

          [&_p]:mb-5
          [&_p]:text-[15px]
          [&_p]:leading-8
          [&_p]:text-slate-600
          [&_p:last-child]:mb-0

          [&_ul]:my-5
          [&_ul]:ml-6
          [&_ul]:list-disc
          [&_ul]:space-y-2
          [&_ul]:text-[15px]
          [&_ul]:leading-7
          [&_ul]:text-slate-600

          [&_ol]:my-5
          [&_ol]:ml-6
          [&_ol]:list-decimal
          [&_ol]:space-y-2
          [&_ol]:text-[15px]
          [&_ol]:leading-7
          [&_ol]:text-slate-600

          [&_li]:pl-1

          [&_blockquote]:my-6
          [&_blockquote]:border-l-4
          [&_blockquote]:border-blue
          [&_blockquote]:rounded-r-xl
          [&_blockquote]:bg-blue/5
          [&_blockquote]:px-5
          [&_blockquote]:py-4
          [&_blockquote]:text-[15px]
          [&_blockquote]:italic
          [&_blockquote]:leading-7
          [&_blockquote]:text-slate-600

          [&_a]:font-medium
          [&_a]:text-blue
          [&_a]:underline
          [&_a]:underline-offset-2
          [&_a:hover]:opacity-80

          [&_strong]:font-semibold
          [&_strong]:text-navy

          [&_em]:italic

          [&_u]:underline
          [&_u]:underline-offset-2

          [&_hr]:my-8
          [&_hr]:border-0
          [&_hr]:border-t
          [&_hr]:border-slate-200

          [&_pre]:my-6
          [&_pre]:overflow-x-auto
          [&_pre]:rounded-xl
          [&_pre]:bg-slate-950
          [&_pre]:p-5
          [&_pre]:text-sm
          [&_pre]:leading-7
          [&_pre]:text-slate-100

          [&_code]:rounded
          [&_code]:bg-slate-100
          [&_code]:px-1.5
          [&_code]:py-0.5
          [&_code]:font-mono
          [&_code]:text-[13px]
          [&_code]:text-blue

          [&_pre_code]:bg-transparent
          [&_pre_code]:p-0
          [&_pre_code]:text-slate-100

          [&_img]:my-7
          [&_img]:max-w-full
          [&_img]:rounded-xl
          [&_img]:shadow-sm

          [&_figure]:my-7

          [&_table]:my-6
          [&_table]:w-full
          [&_table]:border-collapse
          [&_table]:overflow-hidden
          [&_table]:rounded-xl

          [&_th]:border
          [&_th]:border-slate-200
          [&_th]:bg-slate-50
          [&_th]:px-4
          [&_th]:py-3
          [&_th]:text-left
          [&_th]:text-sm
          [&_th]:font-semibold
          [&_th]:text-navy

          [&_td]:border
          [&_td]:border-slate-200
          [&_td]:px-4
          [&_td]:py-3
          [&_td]:text-sm
          [&_td]:text-slate-600

          [&_mark]:rounded
          [&_mark]:bg-yellow-100
          [&_mark]:px-1
        "
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

/* ===============================================================
   HERO META
=============================================================== */

function HeroMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-white/40">
        {icon}

        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="mt-1 text-sm font-semibold text-white/90">
        {value}
      </p>
    </div>
  );
}

/* ===============================================================
   SECTION HEADING
=============================================================== */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 h-9 w-1 shrink-0 rounded-full bg-blue" />

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue">
          {eyebrow}
        </p>

        <h3 className="mt-1 text-xl font-bold tracking-tight text-navy">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ===============================================================
   INFO CARD
=============================================================== */

function InfoCard({
  label,
  value,
  icon,
  accent = "blue",
  mono = false,
  capitalize = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: "blue" | "green" | "amber" | "gray";
  mono?: boolean;
  capitalize?: boolean;
}) {
  const accentClasses = {
    blue: "bg-blue/10 text-blue",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    gray: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center gap-2">
        {icon && (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentClasses[accent]}`}
          >
            {icon}
          </div>
        )}

        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
          {label}
        </p>
      </div>

      <p
        className={`mt-3 break-words text-sm font-semibold text-navy ${
          mono ? "font-mono text-xs" : ""
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

/* ===============================================================
   SEO CARD
=============================================================== */

function SeoCard({
  label,
  value,
  link = false,
}: {
  label: string;
  value: string;
  link?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
        {label}
      </p>

      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-start gap-2 break-all text-sm font-medium leading-6 text-blue hover:underline"
        >
          <span>{value}</span>

          <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <p className="mt-2 text-sm leading-6 text-navy">{value}</p>
      )}
    </div>
  );
}

/* ===============================================================
   TIMELINE ITEM
=============================================================== */

function TimelineItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue/5 text-blue">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-navy">
          {value}
        </p>
      </div>
    </div>
  );
}
