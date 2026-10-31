"use client";

import { Info, Megaphone, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IMarketingSettings } from "@/types/settings.type";

interface AdvertisingSettingsProps {
  data: IMarketingSettings;
  onChange: (data: IMarketingSettings) => void;
  errors?: Record<string, string>;
}

export function AdvertisingSettings({
  data,
  onChange,
  errors = {},
}: AdvertisingSettingsProps) {
  const updateMetaPixel = <K extends keyof IMarketingSettings["metaPixel"]>(
    field: K,
    value: IMarketingSettings["metaPixel"][K],
  ) => {
    onChange({
      ...data,
      metaPixel: {
        ...data.metaPixel,
        [field]: value,
      },
    });
  };

  const updateGoogleAds = <K extends keyof IMarketingSettings["googleAds"]>(
    field: K,
    value: IMarketingSettings["googleAds"][K],
  ) => {
    onChange({
      ...data,
      googleAds: {
        ...data.googleAds,
        [field]: value,
      },
    });
  };

  const updateConversionLabel = (
    key: keyof IMarketingSettings["googleAds"]["conversionLabels"],
    value: string,
  ) => {
    onChange({
      ...data,
      googleAds: {
        ...data.googleAds,
        conversionLabels: {
          ...data.googleAds.conversionLabels,
          [key]: value.trim(),
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Meta Pixel */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-display text-base font-bold tracking-tight">
                  Meta Pixel (Facebook &amp; Instagram)
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  Track website visits and retarget users on Meta platforms.
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={data.metaPixel.enabled}
              onCheckedChange={(val) => updateMetaPixel("enabled", val)}
              aria-label="Enable Meta Pixel"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6 py-6 sm:px-7">
          <div className="space-y-2">
            <Label htmlFor="metaPixelId" className="text-sm font-medium">
              Meta Pixel ID
            </Label>
            <Input
              id="metaPixelId"
              disabled={!data.metaPixel.enabled}
              value={data.metaPixel.pixelId || ""}
              onChange={(e) => updateMetaPixel("pixelId", e.target.value.trim())}
              placeholder="e.g. 123456789012345"
              className="rounded-xl border-border/70 font-mono text-sm max-w-md"
            />
            {errors["marketing.metaPixel.pixelId"] && (
              <p className="text-xs text-destructive">
                {errors["marketing.metaPixel.pixelId"]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Numeric identifier located in Meta Events Manager &gt; Data Sources.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Google Ads Conversion Tracking */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Megaphone className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-display text-base font-bold tracking-tight">
                  Google Ads Conversion Tracking
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  Record conversions directly in Google Ads for high-intent actions.
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={data.googleAds.enabled}
              onCheckedChange={(val) => updateGoogleAds("enabled", val)}
              aria-label="Enable Google Ads Conversion Tracking"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 py-6 sm:px-7">
          <div className="space-y-2">
            <Label htmlFor="googleAdsConversionId" className="text-sm font-medium">
              Google Ads Conversion ID
            </Label>
            <Input
              id="googleAdsConversionId"
              disabled={!data.googleAds.enabled}
              value={data.googleAds.conversionId || ""}
              onChange={(e) => updateGoogleAds("conversionId", e.target.value.trim())}
              placeholder="AW-XXXXXXXXX or XXXXXXXXX"
              className="rounded-xl border-border/70 font-mono text-sm max-w-md"
            />
            {errors["marketing.googleAds.conversionId"] && (
              <p className="text-xs text-destructive">
                {errors["marketing.googleAds.conversionId"]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Provided in Google Ads &gt; Goals &gt; Conversions &gt; Summary &gt; Tag details.
            </p>
          </div>

          <div className="pt-2 border-t border-border/60">
            <div className="mb-4">
              <h4 className="text-sm font-semibold">Action-Specific Conversion Labels</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure labels only for the conversion actions you want reported to Google Ads. Leave empty to skip.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="labelContactForm" className="text-xs font-medium">
                  Contact Form Submission
                </Label>
                <Input
                  id="labelContactForm"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.contactForm || ""}
                  onChange={(e) => updateConversionLabel("contactForm", e.target.value)}
                  placeholder="e.g. AbC-D_efG123"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="labelConsultation" className="text-xs font-medium">
                  Service Booking / Consultation Request
                </Label>
                <Input
                  id="labelConsultation"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.consultationRequest || ""}
                  onChange={(e) => updateConversionLabel("consultationRequest", e.target.value)}
                  placeholder="e.g. BcD-E_fgH234"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="labelQuote" className="text-xs font-medium">
                  Quote Request
                </Label>
                <Input
                  id="labelQuote"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.quoteRequest || ""}
                  onChange={(e) => updateConversionLabel("quoteRequest", e.target.value)}
                  placeholder="e.g. CdE-F_ghI345"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="labelPhone" className="text-xs font-medium">
                  Phone Number Click
                </Label>
                <Input
                  id="labelPhone"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.phoneClick || ""}
                  onChange={(e) => updateConversionLabel("phoneClick", e.target.value)}
                  placeholder="e.g. DeF-G_hiJ456"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="labelEmail" className="text-xs font-medium">
                  Email Link Click
                </Label>
                <Input
                  id="labelEmail"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.emailClick || ""}
                  onChange={(e) => updateConversionLabel("emailClick", e.target.value)}
                  placeholder="e.g. EfG-H_ijK567"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="labelWhatsapp" className="text-xs font-medium">
                  WhatsApp Link Click
                </Label>
                <Input
                  id="labelWhatsapp"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.whatsappClick || ""}
                  onChange={(e) => updateConversionLabel("whatsappClick", e.target.value)}
                  placeholder="e.g. FgH-I_jkL678"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5 text-xs text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 text-muted-foreground/80 mt-0.5" />
            <span>
              Google Ads conversions will be sent using the standard format <code>gtag(&apos;event&apos;, &apos;conversion&apos;, &#123; send_to: &apos;{data.googleAds.conversionId || "AW-ID"}/LABEL&apos; &#125;)</code>. Events are dispatched only upon verified successful user actions.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
