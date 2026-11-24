export interface VisitorConsent {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  decided: boolean;
}

export const CONSENT_STORAGE_KEY = "enviroshield_consent_preferences";
export const CONSENT_COOKIE_KEY = "enviroshield_consent";
export const CONSENT_EVENT_NAME = "enviroshield_consent_change";
export const OPEN_PREFERENCES_EVENT = "open_cookie_preferences";

export const defaultConsentState: VisitorConsent = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
  decided: false,
};

export function getStoredConsent(): VisitorConsent {
  if (typeof window === "undefined") {
    return defaultConsentState;
  }

  // 1. Check localStorage first
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null && parsed.decided) {
        return {
          essential: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
          timestamp: Number(parsed.timestamp) || Date.now(),
          decided: true,
        };
      }
    }
  } catch (e) {
    console.warn("Error reading localStorage consent:", e);
  }

  // 2. Fallback to document.cookie
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE_KEY}=([^;]*)`),
    );
    if (match && match[1]) {
      const parsed = JSON.parse(decodeURIComponent(match[1]));
      if (typeof parsed === "object" && parsed !== null && parsed.decided) {
        return {
          essential: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
          timestamp: Number(parsed.timestamp) || Date.now(),
          decided: true,
        };
      }
    }
  } catch (e) {
    console.warn("Error reading cookie consent:", e);
  }

  return defaultConsentState;
}

export function saveConsent(consent: {
  analytics: boolean;
  marketing: boolean;
}): VisitorConsent {
  const record: VisitorConsent = {
    essential: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    timestamp: Date.now(),
    decided: true,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
      // Set 1-year cookie for SSR and persistence across subpaths
      const maxAge = 365 * 24 * 60 * 60; // 1 year in seconds
      const cookieValue = encodeURIComponent(
        JSON.stringify({
          analytics: record.analytics,
          marketing: record.marketing,
          decided: true,
        }),
      );
      document.cookie = `${CONSENT_COOKIE_KEY}=${cookieValue}; max-age=${maxAge}; path=/; SameSite=Lax`;
    } catch (e) {
      console.warn("Error storing consent:", e);
    }

    window.dispatchEvent(
      new CustomEvent<VisitorConsent>(CONSENT_EVENT_NAME, {
        detail: record,
      }),
    );
  }

  return record;
}

export function openConsentPreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
  }
}
