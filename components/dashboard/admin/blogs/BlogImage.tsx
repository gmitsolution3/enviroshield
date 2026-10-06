"use client";

import Image from "@tiptap/extension-image";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { useEffect, useRef, useState } from "react";

function BlogImageView({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [isResizing, setIsResizing] = useState(false);

  const width = node.attrs.width || "100%";
  const align = node.attrs.align || "center";
  const caption = node.attrs.caption || "";

  const startResize = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const image = imageRef.current;

    if (!image) return;

    const container = image.parentElement;

    if (!container) return;

    setIsResizing(true);

    const startX = event.clientX;
    const startWidth = image.getBoundingClientRect().width;
    const containerWidth =
      container.getBoundingClientRect().width;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;

      const newWidth = Math.max(
        120,
        Math.min(
          containerWidth,
          startWidth + delta,
        ),
      );

      const percentage = Math.round(
        (newWidth / containerWidth) * 100,
      );

      updateAttributes({
        width: `${percentage}%`,
      });
    };

    const handlePointerUp = () => {
      setIsResizing(false);

      document.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      document.removeEventListener(
        "pointerup",
        handlePointerUp,
      );
    };

    document.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    document.addEventListener(
      "pointerup",
      handlePointerUp,
    );
  };

  useEffect(() => {
    document.body.style.cursor = isResizing
      ? "ew-resize"
      : "";

    return () => {
      document.body.style.cursor = "";
    };
  }, [isResizing]);

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
      <div className="relative">
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          draggable={false}
          className="block h-auto w-full rounded-xl"
        />

        {selected && (
          <>
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-primary ring-offset-2" />

            <div
              className="absolute right-0 top-1/2 z-20 h-14 w-2 -translate-y-1/2 cursor-ew-resize rounded-full bg-primary shadow-sm"
              onPointerDown={startResize}
            />
          </>
        )}

        {caption && (
          <div className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
            {caption}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const BlogImage = Image.extend({
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
          element.getAttribute("data-align") ||
          "center",

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