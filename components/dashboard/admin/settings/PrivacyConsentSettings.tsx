"use client";

import { CheckCircle2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IConsentSettings } from "@/types/settings.type";

interface PrivacyConsentSettingsProps {
  data: IConsentSettings;
  onChange: (data: IConsentSettings) => void;
  errors?: Record<string, string>;
}

export function PrivacyConsentSettings({
  data,
  onChange,
  errors = {},
}: PrivacyConsentSettingsProps) {
  const updateField = <K extends keyof IConsentSettings>(
    field: K,
    value: IConsentSettings[K],
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-display text-base font-bold tracking-tight">
                  Consent Management &amp; Cookie Banner
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  Control how tracking cookies and tags are presented and consented to by public visitors.
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={data.enabled}
              onCheckedChange={(val) => updateField("enabled", val)}
              aria-label="Enable Consent Management"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 py-6 sm:px-7">
          {/* Enforcement Toggles */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Consent Requirements</h4>

            <div className="rounded-xl border border-border/70 p-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Require Consent for Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    When enabled, Google Analytics and GTM measurement are held in denied consent mode until visitor grants consent.
                  </p>
                </div>
                <Switch
                  disabled={!data.enabled}
                  checked={data.requireAnalyticsConsent}
                  onCheckedChange={(val) =>
                    updateField("requireAnalyticsConsent", val)
                  }
                />
              </div>

              <div className="border-t border-border/60 pt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Require Consent for Advertising &amp; Marketing</p>
                  <p className="text-xs text-muted-foreground">
                    When enabled, Meta Pixel and Google Ads conversion pixels are blocked until visitor grants consent.
                  </p>
                </div>
                <Switch
                  disabled={!data.enabled}
                  checked={data.requireMarketingConsent}
                  onCheckedChange={(val) =>
                    updateField("requireMarketingConsent", val)
                  }
                />
              </div>
            </div>
          </div>

          {/* Banner Copy */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-semibold">Cookie Banner Presentation</h4>

            <div className="space-y-2">
              <Label htmlFor="bannerTitle" className="text-sm font-medium">
                Banner Headline
              </Label>
              <Input
                id="bannerTitle"
                disabled={!data.enabled}
                value={data.bannerTitle || ""}
                onChange={(e) => updateField("bannerTitle", e.target.value)}
                placeholder="Cookie & Tracking Preferences"
                className="rounded-xl border-border/70"
              />
              {errors["consent.bannerTitle"] && (
                <p className="text-xs text-destructive">
                  {errors["consent.bannerTitle"]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bannerDescription" className="text-sm font-medium">
                Banner Message Body
              </Label>
              <Textarea
                id="bannerDescription"
                disabled={!data.enabled}
                rows={3}
                value={data.bannerDescription || ""}
                onChange={(e) => updateField("bannerDescription", e.target.value)}
                placeholder="We use cookies and tracking technologies to enhance your experience..."
                className="resize-y rounded-xl border-border/70"
              />
              {errors["consent.bannerDescription"] && (
                <p className="text-xs text-destructive">
                  {errors["consent.bannerDescription"]}
                </p>
              )}
            </div>
          </div>

          {/* Features description */}
          <div className="rounded-xl border border-teal/20 bg-teal/5 p-4 space-y-2 text-xs text-teal">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Built-in Privacy &amp; Consent Features</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-muted-foreground">
              <li><strong>Accept All:</strong> Grants analytics and marketing permissions immediately.</li>
              <li><strong>Reject Non-Essential:</strong> Retains strictly essential cookies only.</li>
              <li><strong>Manage Preferences:</strong> Allows granular opt-in per category.</li>
              <li><strong>Reopen Anywhere:</strong> A &ldquo;Cookie Preferences&rdquo; action in the site footer lets visitors adjust preferences anytime.</li>
              <li><strong>Google Consent Mode v2:</strong> Automatically dispatches updated consent signals to Google tags.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
