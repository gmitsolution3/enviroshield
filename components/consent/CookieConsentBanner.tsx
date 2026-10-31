"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Cookie, Settings2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CONSENT_EVENT_NAME,
  CONSENT_STORAGE_KEY,
  OPEN_PREFERENCES_EVENT,
  getStoredConsent,
  saveConsent,
} from "@/lib/consent/consent-store";
import { IConsentSettings } from "@/types/settings.type";

interface CookieConsentBannerProps {
  consentSettings: IConsentSettings;
}

const subscribeToConsent = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
};

const getConsentSnapshot = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(CONSENT_STORAGE_KEY) || "";
};

const getServerConsentSnapshot = () => "";

export function CookieConsentBanner({
  consentSettings,
}: CookieConsentBannerProps) {
  const consentRaw = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  const [showModal, setShowModal] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  // Parse consent state directly during render
  const consentState = consentRaw ? getStoredConsent() : null;
  const isDecided = Boolean(consentState?.decided);
  const showBanner = Boolean(consentSettings?.enabled && !isDecided);

  useEffect(() => {
    const handleOpenModal = () => {
      const current = getStoredConsent();
      setAnalyticsAllowed(current.analytics);
      setMarketingAllowed(current.marketing);
      setShowModal(true);
    };

    window.addEventListener(OPEN_PREFERENCES_EVENT, handleOpenModal);
    return () => {
      window.removeEventListener(OPEN_PREFERENCES_EVENT, handleOpenModal);
    };
  }, []);

  if (!consentSettings?.enabled) {
    return null;
  }

  const handleAcceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
    setShowModal(false);
  };

  const handleRejectNonEssential = () => {
    saveConsent({ analytics: false, marketing: false });
    setShowModal(false);
  };

  const handleSavePreferences = () => {
    saveConsent({
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
    });
    setShowModal(false);
  };

  return (
    <>
      {/* Floating Bottom Consent Banner */}
      {showBanner && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-border/80 bg-background/95 p-5 shadow-2xl backdrop-blur-md sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-base font-bold tracking-tight">
                  {consentSettings.bannerTitle || "Cookie & Tracking Preferences"}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {consentSettings.bannerDescription ||
                    "We use cookies and tracking technologies to optimize your experience, analyze site usage, and support marketing efforts."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectNonEssential}
                className="rounded-xl text-xs font-medium"
              >
                Reject Non-Essential
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = getStoredConsent();
                  setAnalyticsAllowed(current.analytics);
                  setMarketingAllowed(current.marketing);
                  setShowModal(true);
                }}
                className="rounded-xl text-xs font-medium gap-1.5"
              >
                <Settings2 className="h-3.5 w-3.5" />
                Customize
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="rounded-xl text-xs font-medium bg-blue text-white hover:bg-blue/90"
              >
                Accept All
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Management Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 text-blue">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <DialogTitle className="font-display text-lg font-bold">
                Consent Preferences
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs leading-relaxed pt-1 text-muted-foreground">
              Customize which cookies and tracking technologies you permit Enviroshield to use during your browsing session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Essential */}
            <div className="flex items-start justify-between gap-4 rounded-xl border border-border/70 p-4 bg-muted/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">Strictly Essential</p>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                    Always Active
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Required for core website security, authentication sessions, and shopping cart persistence. Cannot be deactivated.
                </p>
              </div>
              <Switch checked={true} disabled={true} />
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between gap-4 rounded-xl border border-border/70 p-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Analytics &amp; Performance</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Permits anonymous measurement of visitor numbers, popular services, and site performance to help us improve.
                </p>
              </div>
              <Switch
                checked={analyticsAllowed}
                onCheckedChange={setAnalyticsAllowed}
                aria-label="Toggle Analytics Consent"
              />
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between gap-4 rounded-xl border border-border/70 p-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Advertising &amp; Retargeting</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enables Meta Pixel and Google Ads conversion measurements to evaluate campaign effectiveness and deliver relevant promotions.
                </p>
              </div>
              <Switch
                checked={marketingAllowed}
                onCheckedChange={setMarketingAllowed}
                aria-label="Toggle Marketing Consent"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectNonEssential}
              className="rounded-xl text-xs font-medium w-full sm:w-auto"
            >
              Reject All Non-Essential
            </Button>
            <Button
              size="sm"
              onClick={handleSavePreferences}
              className="rounded-xl text-xs font-medium bg-blue text-white hover:bg-blue/90 w-full sm:w-auto"
            >
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
