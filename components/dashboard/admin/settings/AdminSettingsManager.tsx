"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { settingsApi } from "@/lib/api/settings";
import {
  ISettings,
  defaultSettingsValues,
} from "@/types/admin/settings.type";
import {
  Activity,
  AlertCircle,
  Bell,
  ChevronRight,
  Globe,
  Loader2,
  Lock,
  Megaphone,
  Monitor,
  Save,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import DashboardButton from "@/components/dashboard/DashboardButton";
import { SettingsSkeleton } from "./SettingsSkeleton";
import { AdvertisingSettings } from "./AdvertisingSettings";
import { AnalyticsSettings } from "./AnalyticsSettings";
import { GeneralSeoSettings } from "./GeneralSeoSettings";
import { PrivacyConsentSettings } from "./PrivacyConsentSettings";

interface AdminSettingsManagerProps {
  initialSettings?: ISettings;
  isAdmin: boolean;
}

type SettingsTab =
  | "seo"
  | "analytics"
  | "advertising"
  | "consent"
  | "account";

export function AdminSettingsManager({
  initialSettings,
  isAdmin,
}: AdminSettingsManagerProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    isAdmin ? "seo" : "account",
  );
  const [settings, setSettings] = useState<ISettings>(
    initialSettings || defaultSettingsValues,
  );
  const [savedSettings, setSavedSettings] = useState<ISettings>(
    initialSettings || defaultSettingsValues,
  );
  const [isLoading, setIsLoading] = useState(
    !initialSettings && isAdmin,
  );
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!initialSettings && isAdmin) {
      settingsApi
        .getAdminSettings()
        .then((data) => {
          setSettings(data);
          setSavedSettings(data);
        })
        .catch((err) => {
          console.error("Failed to load settings:", err);
          toast.error("Failed to load current settings.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialSettings, isAdmin]);

  const hasUnsavedChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // GA4 validation
    if (
      settings.analytics.ga4.enabled &&
      settings.analytics.ga4.measurementId
    ) {
      if (
        !/^G-[A-Z0-9]+$/i.test(settings.analytics.ga4.measurementId)
      ) {
        newErrors["analytics.ga4.measurementId"] =
          "Measurement ID must be in the format G-XXXXXXXXXX";
      }
    }

    // GTM validation
    if (
      settings.analytics.gtm.enabled &&
      settings.analytics.gtm.containerId
    ) {
      if (
        !/^GTM-[A-Z0-9]+$/i.test(settings.analytics.gtm.containerId)
      ) {
        newErrors["analytics.gtm.containerId"] =
          "Container ID must be in the format GTM-XXXXXXX";
      }
    }

    // Meta Pixel validation
    if (
      settings.marketing.metaPixel.enabled &&
      settings.marketing.metaPixel.pixelId
    ) {
      if (!/^\d{8,20}$/.test(settings.marketing.metaPixel.pixelId)) {
        newErrors["marketing.metaPixel.pixelId"] =
          "Meta Pixel ID must contain 8–20 digits";
      }
    }

    // Google Ads validation
    if (
      settings.marketing.googleAds.enabled &&
      settings.marketing.googleAds.conversionId
    ) {
      if (
        !/^(AW-)?[0-9]+$/i.test(
          settings.marketing.googleAds.conversionId,
        )
      ) {
        newErrors["marketing.googleAds.conversionId"] =
          "Conversion ID must be numbers or AW-XXXXXXXXX";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast.error(
        "Please correct the highlighted validation errors.",
      );
      return;
    }

    startTransition(async () => {
      try {
        const updated = await settingsApi.updateSettings(settings);
        setSettings(updated);
        setSavedSettings(updated);
        toast.success("Settings saved successfully!");
      } catch (error: unknown) {
        console.error("Save settings error:", error);
        let msg = "Failed to save settings.";
        const errObj = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        if (typeof errObj?.response?.data?.message === "string") {
          msg = errObj.response.data.message;
        } else if (typeof errObj?.message === "string") {
          msg = errObj.message;
        }
        toast.error(msg);
      }
    });
  };

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      {isAdmin && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3">
          <div
            role="tablist"
            className="flex flex-wrap items-center gap-2 rounded-2xl bg-muted/60 p-1.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "seo"}
              onClick={() => setActiveTab("seo")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "seo"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="h-4 w-4" />
              General SEO
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="h-4 w-4" />
              Analytics
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "advertising"}
              onClick={() => setActiveTab("advertising")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "advertising"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Megaphone className="h-4 w-4" />
              Advertising
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "consent"}
              onClick={() => setActiveTab("consent")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "consent"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="h-4 w-4" />
              Privacy &amp; Consent
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "account"}
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "account"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              Account
            </button>
          </div>

          {activeTab !== "account" && (
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Unsaved changes
                </span>
              )}
              <DashboardButton
                onClick={handleSave}
                disabled={isPending}
                icon={
                  isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
              >
                {isPending ? "Saving..." : "Save Settings"}
              </DashboardButton>
            </div>
          )}
        </div>
      )}

      {/* Tab Panels */}
      {isAdmin && activeTab === "seo" && (
        <GeneralSeoSettings
          data={settings.seo}
          onChange={(seo) => setSettings({ ...settings, seo })}
          errors={errors}
        />
      )}

      {isAdmin && activeTab === "analytics" && (
        <AnalyticsSettings
          data={settings.analytics}
          onChange={(analytics) =>
            setSettings({ ...settings, analytics })
          }
          errors={errors}
        />
      )}

      {isAdmin && activeTab === "advertising" && (
        <AdvertisingSettings
          data={settings.marketing}
          onChange={(marketing) =>
            setSettings({ ...settings, marketing })
          }
          errors={errors}
        />
      )}

      {isAdmin && activeTab === "consent" && (
        <PrivacyConsentSettings
          data={settings.consent}
          onChange={(consent) =>
            setSettings({ ...settings, consent })
          }
          errors={errors}
        />
      )}

      {/* Preserved Account Settings Section */}
      {(!isAdmin || activeTab === "account") && (
        <div className="space-y-6">
          {/* Preferences */}
          <Card className="rounded-2xl border-border/70 bg-background shadow-none">
            <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
                  <Monitor className="h-4 w-4" />
                </div>

                <div>
                  <CardTitle className="font-display text-base font-bold tracking-tight">
                    Preferences
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Customize how your Enviroshield experience works.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-2 sm:px-7">
              <div className="flex items-center justify-between gap-6 py-5">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Bell className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Notifications
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Notification preferences will be available here
                      in the future.
                    </p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="shrink-0 rounded-full"
                >
                  Coming soon
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-6 py-5">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Monitor className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Appearance</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Theme and appearance preferences will be
                      available here.
                    </p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="shrink-0 rounded-full"
                >
                  Coming soon
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="rounded-2xl border-border/70 bg-background shadow-none">
            <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal/[0.08] text-teal">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <CardTitle className="font-display text-base font-bold tracking-tight">
                    Security
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your password and account security.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-2 sm:px-7">
              <div className="flex items-center justify-between gap-6 py-5">
                <div>
                  <p className="text-sm font-medium">
                    Password &amp; security
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Change your password and manage your account
                    security from your profile.
                  </p>
                </div>

                <Button
                  variant="ghost"
                  className="shrink-0 rounded-full"
                >
                  <a href="/dashboard/profile">
                    Manage
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-6 py-5">
                <div>
                  <p className="text-sm font-medium">
                    Active sessions
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Session management will be available here in the
                    future.
                  </p>
                </div>

                <Badge
                  variant="secondary"
                  className="shrink-0 rounded-full"
                >
                  Coming soon
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card className="rounded-2xl border-destructive/20 bg-background shadow-none">
            <CardHeader className="border-b border-destructive/10 px-6 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/5 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </div>

                <div>
                  <CardTitle className="font-display text-base font-bold tracking-tight">
                    Danger zone
                  </CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Permanent account actions.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center sm:px-7">
              <div>
                <p className="text-sm font-medium">Delete account</p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Permanently delete your Enviroshield account and
                  associated data. This functionality is not available
                  yet.
                </p>
              </div>

              <Button
                variant="outline"
                disabled
                className="shrink-0 rounded-full border-destructive/20 text-destructive"
              >
                Delete account
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
