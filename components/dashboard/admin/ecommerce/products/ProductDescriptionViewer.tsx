"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { BlogImage } from "@/components/dashboard/admin/blogs/BlogImage";
import { FileText } from "lucide-react";

export function ProductDescriptionViewer({
  content,
}: {
  content: Record<string, unknown>;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension.configure({
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
        class: "tiptap product-content-viewer max-w-none focus:outline-none",
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
          Loading product description...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className="
          product-content-viewer
          px-5 py-6
          sm:px-8 sm:py-10
          lg:px-12 lg:py-12

          [&_.ProseMirror]:max-w-none
          [&_.ProseMirror]:outline-none

          [&_h1]:mb-5 [&_h1]:mt-8 [&_h1]:text-3xl
          [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-navy
          [&_h1:first-child]:mt-0

          [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl
          [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-navy

          [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-xl
          [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-navy

          [&_h4]:mb-3 [&_h4]:mt-6 [&_h4]:text-lg
          [&_h4]:font-semibold [&_h4]:text-navy

          [&_p]:mb-5 [&_p]:text-[15px] [&_p]:leading-8
          [&_p]:text-slate-600 [&_p:last-child]:mb-0

          [&_ul]:my-5 [&_ul]:ml-6 [&_ul]:list-disc
          [&_ul]:space-y-2 [&_ul]:text-[15px]
          [&_ul]:leading-7 [&_ul]:text-slate-600

          [&_ol]:my-5 [&_ol]:ml-6 [&_ol]:list-decimal
          [&_ol]:space-y-2 [&_ol]:text-[15px]
          [&_ol]:leading-7 [&_ol]:text-slate-600

          [&_li]:pl-1

          [&_blockquote]:my-6 [&_blockquote]:rounded-r-xl
          [&_blockquote]:border-l-4 [&_blockquote]:border-blue
          [&_blockquote]:bg-blue/5 [&_blockquote]:px-5
          [&_blockquote]:py-4 [&_blockquote]:italic
          [&_blockquote]:leading-7 [&_blockquote]:text-slate-600

          [&_a]:font-medium [&_a]:text-blue
          [&_a]:underline [&_a]:underline-offset-2
          [&_a:hover]:opacity-80

          [&_strong]:font-semibold [&_strong]:text-navy
          [&_em]:italic
          [&_u]:underline [&_u]:underline-offset-2

          [&_hr]:my-8 [&_hr]:border-0
          [&_hr]:border-t [&_hr]:border-slate-200

          [&_pre]:my-6 [&_pre]:overflow-x-auto
          [&_pre]:rounded-xl [&_pre]:bg-slate-950
          [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-7
          [&_pre]:text-slate-100

          [&_code]:rounded [&_code]:bg-slate-100
          [&_code]:px-1.5 [&_code]:py-0.5
          [&_code]:font-mono [&_code]:text-[13px]
          [&_code]:text-blue

          [&_pre_code]:bg-transparent
          [&_pre_code]:p-0 [&_pre_code]:text-slate-100

          [&_img]:my-7 [&_img]:max-w-full
          [&_img]:rounded-xl [&_img]:shadow-sm

          [&_figure]:my-7

          [&_table]:my-6 [&_table]:w-full
          [&_table]:border-collapse [&_table]:overflow-hidden

          [&_th]:border [&_th]:border-slate-200
          [&_th]:bg-slate-50 [&_th]:px-4 [&_th]:py-3
          [&_th]:text-left [&_th]:text-sm
          [&_th]:font-semibold [&_th]:text-navy

          [&_td]:border [&_td]:border-slate-200
          [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm
          [&_td]:text-slate-600
        "
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

