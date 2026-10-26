"use client";

import { Camera, ImagePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import DashboardButton from "@/components/dashboard/DashboardButton";
import { authClient } from "@/lib/auth-client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

interface ProfileImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage: string | null;
  onSaved: (image: string, publicId: string) => void;
}

function uploadProfileImage(file: File, onProgress: (progress: number) => void) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", "/api/profile/image");
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onload = () => {
      let response: unknown;
      try {
        response = JSON.parse(request.responseText);
      } catch {
        reject(new Error("The image upload returned an invalid response."));
        return;
      }

      if (request.status < 200 || request.status >= 300) {
        const error =
          typeof response === "object" && response !== null && "error" in response &&
          typeof response.error === "string"
            ? response.error
            : "Unable to save your profile photo. Please try again.";
        reject(new Error(error));
        return;
      }

      if (
        typeof response !== "object" || response === null ||
        !("url" in response) || typeof response.url !== "string" ||
        !("publicId" in response) || typeof response.publicId !== "string"
      ) {
        reject(new Error("The image upload returned incomplete image details."));
        return;
      }
      resolve({ url: response.url, publicId: response.publicId });
    };
    request.onerror = () => reject(new Error("A network error interrupted the image upload."));
    request.onabort = () => reject(new Error("The image upload was canceled."));

    const formData = new FormData();
    formData.append("file", file);
    request.send(formData);
  });
}

export function ProfileImageDialog({
  open,
  onOpenChange,
  currentImage,
  onSaved,
}: ProfileImageDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  function clearSelectedImage() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setSelectedFile(null);
    setSelectedPreview(null);
    setError(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  }

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("The image must be 5 MB or smaller.");
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const preview = URL.createObjectURL(file);
    previewUrlRef.current = preview;
    setSelectedFile(file);
    setSelectedPreview(preview);
    setError(null);
  }

  async function handleSave() {
    if (!selectedFile || isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      const uploaded = await uploadProfileImage(selectedFile, setProgress);
      onSaved(uploaded.url, uploaded.publicId);
      try {
        await authClient.getSession();
      } catch {
        // The saved route refresh below reloads the server-rendered session.
      }
      toast.success("Profile photo updated.");
      clearSelectedImage();
      onOpenChange(false);
      router.refresh();
    } catch (cause) {
      const message = cause instanceof Error
        ? cause.message
        : "Unable to update your profile photo. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSaving) return;
        if (!nextOpen) clearSelectedImage();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-navy">
            Change profile photo
          </DialogTitle>
          <DialogDescription>
            Choose a JPG, PNG, or WebP image up to 5 MB. Your new photo will appear across your dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="relative mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-muted">
            {selectedPreview || currentImage ? (
              <Image
                src={selectedPreview ?? currentImage!}
                alt="Profile photo preview"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <Camera className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <input
              ref={inputRef}
              id="profile-photo-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={isSaving}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => inputRef.current?.click()}
              className="min-h-11 rounded-full px-5"
            >
              <ImagePlus className="mr-2 h-4 w-4" aria-hidden="true" />
              {selectedFile ? "Choose a different photo" : "Select photo"}
            </Button>
            {selectedFile && (
              <p className="max-w-full truncate text-xs text-muted-foreground">
                {selectedFile.name} · {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>

          {isSaving && (
            <div className="space-y-2" aria-live="polite">
              <Progress value={progress} aria-label={`Upload progress: ${progress}%`} />
              <p className="text-center text-xs text-muted-foreground">
                {progress < 100 ? `Uploading photo · ${progress}%` : "Saving your profile photo..."}
              </p>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="min-h-12 rounded-full px-5"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <DashboardButton
            type="button"
            disabled={isSaving || !selectedFile}
            onClick={handleSave}
          >
            {isSaving ? "Saving photo..." : "Save photo"}
          </DashboardButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
