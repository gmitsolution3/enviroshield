"use client";

import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { deleteImage } from "@/utils/deleteImage";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string;
  imagePublicId?: string;
  onChange: (url: string, public_id: string) => void;
}

export const ImageUploader = ({
  value,
  imagePublicId: imagePublicInitialId,
  onChange,
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(
    value || null,
  );
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imagePublicId, setImagePublicId] = useState(
    imagePublicInitialId || "",
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const localPreviewRef = useRef<string | null>(null);

  useEffect(() => {
    setPreview(value || null);
    setImagePublicId(imagePublicInitialId || "");
  }, [value, imagePublicInitialId]);

  useEffect(() => {
    return () => {
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
      }
    };
  }, []);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allow selecting the same file again.
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const previousLocalPreview = localPreviewRef.current;
    if (previousLocalPreview) {
      URL.revokeObjectURL(previousLocalPreview);
    }

    const localPreview = URL.createObjectURL(file);
    localPreviewRef.current = localPreview;
    setPreview(localPreview);

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setProgress(0);

    try {
      const data = await new Promise<{
        url: string;
        public_id: string;
      }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(
              Math.round((event.loaded * 100) / event.total),
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            reject(new Error("Image upload failed."));
            return;
          }

          try {
            const result = JSON.parse(xhr.responseText);

            if (!result.url || !result.public_id) {
              reject(
                new Error(
                  "Upload response is missing image information.",
                ),
              );
              return;
            }

            resolve(result);
          } catch {
            reject(
              new Error("Invalid response from the upload endpoint."),
            );
          }
        };

        xhr.onerror = () =>
          reject(new Error("Network error during upload."));
        xhr.onabort = () =>
          reject(new Error("Image upload was cancelled."));
        xhr.send(formData);
      });

      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
        localPreviewRef.current = null;
      }

      setImagePublicId(data.public_id);
      setPreview(data.url);
      onChange(data.url, data.public_id);
    } catch (error) {
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
        localPreviewRef.current = null;
      }

      setPreview(value || null);

      const message =
        error instanceof Error
          ? error.message
          : "Image upload failed.";

      toast.error(message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeImage = async () => {
    if (uploading || deleting) return;

    // No uploaded Cloudinary image to delete.
    if (!imagePublicId) {
      setPreview(null);
      onChange("", "");
      return;
    }

    setDeleting(true);

    try {
      await deleteImage(imagePublicId);

      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
        localPreviewRef.current = null;
      }

      setPreview(null);
      setImagePublicId("");
      onChange("", "");
      toast.success("Image removed successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove image.";

      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="flex w-full flex-col items-center justify-center gap-3 border-2 border-dashed p-4">
      {preview ? (
        <div className="relative h-60 w-full">
          <Image
            src={preview}
            alt="Image preview"
            fill
            unoptimized={preview.startsWith("blob:")}
            className="rounded-md object-cover"
          />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-2 top-2"
            onClick={removeImage}
            disabled={uploading || deleting}
            aria-label="Remove image"
          >
            <X size={16} />
          </Button>

          {(uploading || deleting) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md bg-black/60 px-6">
              {uploading ? (
                <>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-white">
                    {progress}% uploading
                  </p>
                </>
              ) : (
                <p className="text-xs text-white">
                  Removing image...
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-2">
          <UploadCloud className="h-8 w-8 text-muted-foreground" />

          <span className="text-sm text-muted-foreground">
            {uploading
              ? "Uploading image..."
              : "Click to upload image"}
          </span>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading || deleting}
          />
        </label>
      )}
    </Card>
  );
};