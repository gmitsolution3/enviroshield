export function getSafeRedirectUrl(
  callbackUrl?: string | null,
  fallback = "/dashboard",
): string {
  if (!callbackUrl || typeof callbackUrl !== "string") {
    return fallback;
  }

  const trimmed = callbackUrl.trim();
  if (!trimmed) {
    return fallback;
  }

  // Reject protocol-relative URLs (e.g. "//evil.com") or javascript: URIs
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return fallback;
  }

  try {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : (process.env.BETTER_AUTH_URL || "http://localhost:3000");

    const redirectUrl = new URL(trimmed, origin);
    if (redirectUrl.origin !== origin) {
      return fallback;
    }

    return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
  } catch {
    return fallback;
  }
}

