"use client";

import { openConsentPreferences } from "@/lib/consent/consent-store";

export function CookiePreferencesButton({
  className = "transition-colors duration-200 hover:text-white underline cursor-pointer",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openConsentPreferences()}
      className={className}
    >
      Cookie Preferences
    </button>
  );
}
