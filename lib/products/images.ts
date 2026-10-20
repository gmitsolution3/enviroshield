const allowedHosts = new Set([
  "res.cloudinary.com",
  "images.unsplash.com",
  "images.pexels.com",
]);

export function getProductImageUrl(value?: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password ||
      !allowedHosts.has(url.hostname.toLowerCase()) ||
      (url.protocol === "http:" && url.hostname !== "res.cloudinary.com")
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
