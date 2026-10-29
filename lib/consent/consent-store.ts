export interface VisitorConsent {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  decided: boolean;
}

export const CONSENT_STORAGE_KEY = "enviroshield_consent_preferences";
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

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return defaultConsentState;

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
  } catch (e) {
    console.warn("Error parsing stored cookie consent:", e);
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
      // Also set a 1-year cookie for SSR awareness
      const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `enviroshield_consent=${encodeURIComponent(
        JSON.stringify({
          analytics: record.analytics,
          marketing: record.marketing,
          decided: true,
        }),
      )}; expires=${expires}; path=/; SameSite=Lax`;
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
