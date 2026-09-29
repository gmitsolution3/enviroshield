export const deleteImage = async (publicId: string) => {
  await fetch("/api/delete-image", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      public_id: publicId,
    }),
  });
};
