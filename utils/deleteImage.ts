export const deleteImage = async (
  publicId: string,
): Promise<void> => {
  if (!publicId) {
    throw new Error("Image public ID is required for deletion.");
  }

  const response = await fetch("/api/delete-image", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      public_id: publicId,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete image.");
  }
};
