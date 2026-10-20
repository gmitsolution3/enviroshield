const DEFAULT_TDS_HOSTS = [
  "res.cloudinary.com",
  "rd.usda.gov",
  "www.rd.usda.gov",
];

const allowedTdsHosts = new Set([
  ...DEFAULT_TDS_HOSTS,
  ...(process.env.NEXT_PUBLIC_TDS_ALLOWED_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean),
]);

/** Return an external TDS URL only when it uses HTTPS and an approved host. */
export function getTrustedTdsUrl(value?: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !allowedTdsHosts.has(url.hostname.toLowerCase())
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
