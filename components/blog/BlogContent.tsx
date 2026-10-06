"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
  type JSONContent,
  type NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface BlogContentProps {
  content: JSONContent;
}

function BlogImageView({ node }: NodeViewProps) {
  const width = node.attrs.width || "100%";
  const align = node.attrs.align || "center";
  const caption = node.attrs.caption || "";

  return (
    <NodeViewWrapper
      className="blog-image-node"
      style={{
        width,
        marginLeft:
          align === "left"
            ? "0"
            : align === "right"
              ? "auto"
              : "auto",
        marginRight:
          align === "right"
            ? "0"
            : align === "left"
              ? "auto"
              : "auto",
      }}
    >
      <figure className="my-8">
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          className="block h-auto w-full rounded-[18px]"
        />

        {caption ? (
          <figcaption className="mt-3 text-center text-sm leading-6 text-ink/60">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </NodeViewWrapper>
  );
}

const BlogImage = Image.extend({
  name: "image",

  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: "100%",

        parseHTML: (element) =>
          element.getAttribute("data-width") ||
          element.style.width ||
          "100%",

        renderHTML: (attributes) => ({
          "data-width": attributes.width,
          style: `width: ${attributes.width}`,
        }),
      },

      align: {
        default: "center",

        parseHTML: (element) =>
          element.getAttribute("data-align") || "center",

        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },

      caption: {
        default: "",

        parseHTML: (element) =>
          element.getAttribute("data-caption") || "",

        renderHTML: (attributes) => ({
          "data-caption": attributes.caption,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlogImageView);
  },
});

export default function BlogContent({ content }: BlogContentProps) {
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
          "tiptap blog-content-viewer max-w-none focus:outline-none",
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
    return null;
  }

  return (
    <div
      className="
        blog-content-viewer

        [&_.ProseMirror]:max-w-none
        [&_.ProseMirror]:outline-none

        [&_h1]:mb-5
        [&_h1]:mt-10
        [&_h1]:text-4xl
        [&_h1]:font-extrabold
        [&_h1]:leading-tight
        [&_h1]:tracking-tight
        [&_h1]:text-navy
        [&_h1:first-child]:mt-0

        [&_h2]:mb-4
        [&_h2]:mt-10
        [&_h2]:text-3xl
        [&_h2]:font-extrabold
        [&_h2]:leading-tight
        [&_h2]:tracking-tight
        [&_h2]:text-navy

        [&_h3]:mb-3
        [&_h3]:mt-8
        [&_h3]:text-2xl
        [&_h3]:font-bold
        [&_h3]:leading-tight
        [&_h3]:text-navy

        [&_h4]:mb-3
        [&_h4]:mt-7
        [&_h4]:text-xl
        [&_h4]:font-bold
        [&_h4]:text-navy

        [&_p]:mb-5
        [&_p]:text-[17px]
        [&_p]:leading-[1.85]
        [&_p]:text-ink

        [&_ul]:my-6
        [&_ul]:ml-6
        [&_ul]:list-disc
        [&_ul]:space-y-2
        [&_ul]:text-[17px]
        [&_ul]:leading-7
        [&_ul]:text-ink

        [&_ol]:my-6
        [&_ol]:ml-6
        [&_ol]:list-decimal
        [&_ol]:space-y-2
        [&_ol]:text-[17px]
        [&_ol]:leading-7
        [&_ol]:text-ink

        [&_li]:pl-1

        [&_blockquote]:my-8
        [&_blockquote]:border-l-4
        [&_blockquote]:border-blue
        [&_blockquote]:bg-blue/5
        [&_blockquote]:px-6
        [&_blockquote]:py-4
        [&_blockquote]:text-[17px]
        [&_blockquote]:italic
        [&_blockquote]:leading-8
        [&_blockquote]:text-ink

        [&_a]:font-semibold
        [&_a]:text-blue
        [&_a]:underline
        [&_a]:underline-offset-4

        [&_strong]:font-bold
        [&_strong]:text-navy

        [&_em]:italic

        [&_u]:underline
        [&_u]:underline-offset-4

        [&_hr]:my-10
        [&_hr]:border-0
        [&_hr]:border-t
        [&_hr]:border-line

        [&_pre]:my-8
        [&_pre]:overflow-x-auto
        [&_pre]:rounded-xl
        [&_pre]:bg-navy
        [&_pre]:p-5
        [&_pre]:text-sm
        [&_pre]:leading-7
        [&_pre]:text-white

        [&_code]:rounded
        [&_code]:bg-[#eef4f7]
        [&_code]:px-1.5
        [&_code]:py-0.5
        [&_code]:font-mono
        [&_code]:text-sm
        [&_code]:text-navy

        [&_pre_code]:bg-transparent
        [&_pre_code]:p-0
        [&_pre_code]:text-white

        [&_table]:my-8
        [&_table]:w-full
        [&_table]:border-collapse

        [&_th]:border
        [&_th]:border-line
        [&_th]:bg-[#f5f9fb]
        [&_th]:px-4
        [&_th]:py-3
        [&_th]:text-left
        [&_th]:font-bold
        [&_th]:text-navy

        [&_td]:border
        [&_td]:border-line
        [&_td]:px-4
        [&_td]:py-3
        [&_td]:text-ink

        [&_.blog-image-node]:max-w-full
      "
    >
      <EditorContent editor={editor} />
    </div>
  );
}
