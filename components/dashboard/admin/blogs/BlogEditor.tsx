"use client";

import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import UnderlineExtension from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  CodeXml,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { BlogImage } from "./BlogImage";

type BlogEditorProps = {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  disabled?: boolean;
};

export default function BlogEditor({
  value,
  onChange,
  disabled = false,
}: BlogEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      UnderlineExtension,

      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-600 underline underline-offset-2",
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph", "blockquote"],
      }),

      /*
       * Custom Tiptap image.
       *
       * Supports:
       * - image upload
       * - image selection
       * - image resizing
       * - image alignment
       * - alt text
       */
      BlogImage.configure({
        inline: false,
        allowBase64: false,
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[360px] max-w-none px-6 py-5 focus:outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  /*
   * Sync external content.
   *
   * Important for the Update Blog modal later.
   */
  useEffect(() => {
    if (!editor || !value) return;

    const currentContent = JSON.stringify(editor.getJSON());

    const incomingContent = JSON.stringify(value);

    if (currentContent !== incomingContent) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  /*
   * Upload image.
   *
   * Uses the same /api/upload endpoint as
   * the existing ImageUploader.
   */
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !editor) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image.");
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("Image URL was not returned.");
      }

      editor
        .chain()
        .focus()
        .setImage({
          src: data.url,
          alt: file.name,
        })
        .run();
    } catch (error) {
      console.error("Blog image upload failed:", error);
    } finally {
      event.target.value = "";
    }
  };

  /*
   * Add / edit / remove link.
   */
  const handleLink = () => {
    if (!editor) return;

    const existingUrl = editor.getAttributes("link").href;

    const url = window.prompt("Enter URL", existingUrl || "https://");

    if (url === null) return;

    if (!url.trim()) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url.trim(),
      })
      .run();
  };

  /*
   * Clear formatting.
   */
  const handleClearFormatting = () => {
    if (!editor) return;

    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  /*
   * Set selected image width.
   */
  const setImageWidth = (width: string) => {
    if (!editor || !editor.isActive("image")) {
      return;
    }

    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        width,
      })
      .run();
  };

  /*
   * Set selected image alignment.
   */
  const setImageAlignment = (align: "left" | "center" | "right") => {
    if (!editor || !editor.isActive("image")) {
      return;
    }

    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        align,
      })
      .run();
  };

  /*
   * Update selected image alt text.
   */
  const handleImageAlt = () => {
    if (!editor || !editor.isActive("image")) {
      return;
    }

    const currentAlt = editor.getAttributes("image").alt || "";

    const alt = window.prompt("Image alt text", currentAlt);

    if (alt === null) return;

    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        alt: alt.trim(),
      })
      .run();
  };

  /*
   * Delete selected image.
   */
  const deleteSelectedImage = () => {
    if (!editor || !editor.isActive("image")) {
      return;
    }

    editor.chain().focus().deleteSelection().run();
  };

  if (!editor) {
    return (
      <Card className="overflow-hidden rounded-xl border">
        <div className="min-h-[430px] animate-pulse bg-muted/20" />
      </Card>
    );
  }

  const imageSelected = editor.isActive("image");

  const selectedImageAttributes = editor.getAttributes("image");

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-xl border bg-background",
        disabled && "opacity-70",
      )}
    >
      {/* =========================
          TOOLBAR
      ========================== */}

      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b bg-background/95 p-2 backdrop-blur">
        {/* =========================
            HEADINGS
        ========================== */}

        <ToolbarButton
          label="Heading 1"
          active={editor.isActive("heading", {
            level: 1,
          })}
          disabled={disabled}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", {
            level: 2,
          })}
          disabled={disabled}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Heading 3"
          active={editor.isActive("heading", {
            level: 3,
          })}
          disabled={disabled}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* =========================
            TEXT ALIGNMENT
        ========================== */}

        <ToolbarButton
          label="Align Left"
          active={editor.isActive({
            textAlign: "left",
          })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Align Center"
          active={editor.isActive({
            textAlign: "center",
          })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Align Right"
          active={editor.isActive({
            textAlign: "right",
          })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Justify"
          active={editor.isActive({
            textAlign: "justify",
          })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* =========================
            FORMATTING
        ========================== */}

        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Underline"
          active={editor.isActive("underline")}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Strikethrough"
          active={editor.isActive("strike")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        {/* Inline Code */}

        <ToolbarButton
          label="Inline Code"
          active={editor.isActive("code")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        {/* Code Block */}

        <ToolbarButton
          label="Code Block"
          active={editor.isActive("codeBlock")}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleCodeBlock().run()
          }
        >
          <CodeXml className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* =========================
            LISTS
        ========================== */}

        <ToolbarButton
          label="Bullet List"
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Numbered List"
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Blockquote"
          active={editor.isActive("blockquote")}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* =========================
            LINK
        ========================== */}

        <ToolbarButton
          label="Add Link"
          active={editor.isActive("link")}
          disabled={disabled}
          onClick={handleLink}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        {/* =========================
            IMAGE UPLOAD
        ========================== */}

        <ToolbarButton
          label="Upload Image"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleImageUpload}
          disabled={disabled}
        />

        {/* =========================
            HORIZONTAL RULE
        ========================== */}

        <ToolbarButton
          label="Horizontal Rule"
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().setHorizontalRule().run()
          }
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        {/* =========================
            CLEAR
        ========================== */}

        <ToolbarButton
          label="Clear Formatting"
          disabled={disabled}
          onClick={handleClearFormatting}
        >
          <Eraser className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* =========================
            UNDO / REDO
        ========================== */}

        <ToolbarButton
          label="Undo"
          disabled={disabled || !editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Redo"
          disabled={disabled || !editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* =========================
          IMAGE CONTROLS
      ========================== */}

      {imageSelected && !disabled && (
        <div className="border-b bg-muted/20 px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold text-muted-foreground">
              Image:
            </span>

            {/* Image Alignment */}

            <ToolbarSmallButton
              label="Left"
              active={selectedImageAttributes.align === "left"}
              onClick={() => setImageAlignment("left")}
            />

            <ToolbarSmallButton
              label="Center"
              active={
                !selectedImageAttributes.align ||
                selectedImageAttributes.align === "center"
              }
              onClick={() => setImageAlignment("center")}
            />

            <ToolbarSmallButton
              label="Right"
              active={selectedImageAttributes.align === "right"}
              onClick={() => setImageAlignment("right")}
            />

            <ToolbarDivider />

            {/* Image Width */}

            <span className="mr-1 text-xs font-semibold text-muted-foreground">
              Width:
            </span>

            {["25%", "50%", "75%", "100%"].map((width) => (
              <ToolbarSmallButton
                key={width}
                label={width}
                active={selectedImageAttributes.width === width}
                onClick={() => setImageWidth(width)}
              />
            ))}

            <ToolbarDivider />

            {/* Image Alt */}

            <ToolbarSmallButton
              label="Edit Alt"
              onClick={handleImageAlt}
            />

            {/* Delete Image */}

            <ToolbarSmallButton
              label="Delete"
              destructive
              onClick={deleteSelectedImage}
            />
          </div>
        </div>
      )}

      {/* =========================
          EDITOR AREA
      ========================== */}

      <div
        className={cn(
          "bg-background",
          disabled && "pointer-events-none",
        )}
      >
        <EditorContent editor={editor} />
      </div>

      {/* =========================
          FOOTER
      ========================== */}

      <div className="flex items-center justify-between border-t bg-muted/10 px-4 py-2">
        <p className="text-[11px] text-muted-foreground">
          Use the toolbar to format your article and upload images.
        </p>

        <p className="hidden text-[11px] text-muted-foreground sm:block">
          Markdown-style shortcuts supported
        </p>
      </div>
    </Card>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-border" />;
}

function ToolbarButton({
  children,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-8 w-8 rounded-md",
        active &&
          "bg-blue/10 text-blue hover:bg-blue/15 hover:text-blue",
      )}
    >
      {children}
    </Button>
  );
}

function ToolbarSmallButton({
  label,
  active = false,
  destructive = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-7 px-2 text-xs",
        active && "border-primary bg-primary/10 text-primary",
        destructive &&
          "border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive",
      )}
    >
      {label}
    </Button>
  );
}
