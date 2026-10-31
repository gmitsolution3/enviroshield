/**
 * Generates user avatar initials from their full name or fallback email.
 * - Trims input and splits on whitespace.
 * - Extracts first character from up to 2 words.
 * - Falls back to the first character of email, or "U" if neither is available.
 *
 * @example
 * getInitials("John Doe") => "JD"
 * getInitials("Alice") => "A"
 * getInitials(null, "user@example.com") => "U"
 * getInitials(undefined, undefined) => "U"
 */
export function getInitials(
  name?: string | null,
  email?: string | null,
): string {
  const trimmedName = name?.trim();

  if (trimmedName) {
    const initials = trimmedName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();

    if (initials) return initials;
  }

  const trimmedEmail = email?.trim();
  if (trimmedEmail) {
    const emailInitial = trimmedEmail.charAt(0).toUpperCase();
    if (emailInitial) return emailInitial;
  }

  return "U";
}

