"use client";

import { Activity, AlertTriangle, BarChart3, HelpCircle } from "lucide-react";
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
import { IAnalyticsSettings } from "@/types/settings.type";

interface AnalyticsSettingsProps {
  data: IAnalyticsSettings;
  onChange: (data: IAnalyticsSettings) => void;
  errors?: Record<string, string>;
}

export function AnalyticsSettings({
  data,
  onChange,
  errors = {},
}: AnalyticsSettingsProps) {
  const updateGa4 = <K extends keyof IAnalyticsSettings["ga4"]>(
    field: K,
    value: IAnalyticsSettings["ga4"][K],
  ) => {
    onChange({
      ...data,
      ga4: {
        ...data.ga4,
        [field]: value,
      },
    });
  };

  const updateGtm = <K extends keyof IAnalyticsSettings["gtm"]>(
    field: K,
    value: IAnalyticsSettings["gtm"][K],
  ) => {
    onChange({
      ...data,
      gtm: {
        ...data.gtm,
        [field]: value,
      },
    });
  };

  const hasDualConfiguration = data.ga4.enabled && data.gtm.enabled;

  return (
    <div className="space-y-6">
      {/* Dual tracking warning */}
      {hasDualConfiguration && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                Dual GA4 and GTM Tracking Notice
              </p>
              <p className="text-xs leading-relaxed opacity-90">
                Both Google Analytics 4 and Google Tag Manager are currently enabled. If your GTM container already deploys a Google tag or GA4 configuration tag, leave direct GA4 disabled here to prevent duplicate page-view and event counts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Google Analytics 4 */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo/10 text-indigo">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-display text-base font-bold tracking-tight">
                  Google Analytics 4 (GA4)
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  Direct client-side GA4 gtag.js measurement.
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={data.ga4.enabled}
              onCheckedChange={(val) => updateGa4("enabled", val)}
              aria-label="Enable Google Analytics 4"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6 py-6 sm:px-7">
          <div className="space-y-2">
            <Label htmlFor="ga4MeasurementId" className="text-sm font-medium">
              GA4 Measurement ID
            </Label>
            <Input
              id="ga4MeasurementId"
              disabled={!data.ga4.enabled}
              value={data.ga4.measurementId || ""}
              onChange={(e) => updateGa4("measurementId", e.target.value.trim().toUpperCase())}
              placeholder="G-XXXXXXXXXX"
              className="rounded-xl border-border/70 font-mono text-sm max-w-md"
            />
            {errors["analytics.ga4.measurementId"] && (
              <p className="text-xs text-destructive">
                {errors["analytics.ga4.measurementId"]}
              </p>
            )}
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/80" />
              Found in Google Analytics: Admin &gt; Data Streams &gt; Web stream &gt; Measurement ID.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ga4Label" className="text-sm font-medium">
              Internal Stream Label (Optional)
            </Label>
            <Input
              id="ga4Label"
              disabled={!data.ga4.enabled}
              value={data.ga4.label || ""}
              onChange={(e) => updateGa4("label", e.target.value)}
              placeholder="Production Web Property"
              className="rounded-xl border-border/70 max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              Descriptive label for administrative reference only.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Google Tag Manager */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/10 text-blue">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-display text-base font-bold tracking-tight">
                  Google Tag Manager (GTM)
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  Centralized container for marketing, conversion, and analytics tags.
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={data.gtm.enabled}
              onCheckedChange={(val) => updateGtm("enabled", val)}
              aria-label="Enable Google Tag Manager"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6 py-6 sm:px-7">
          <div className="space-y-2">
            <Label htmlFor="gtmContainerId" className="text-sm font-medium">
              GTM Container ID
            </Label>
            <Input
              id="gtmContainerId"
              disabled={!data.gtm.enabled}
              value={data.gtm.containerId || ""}
              onChange={(e) => updateGtm("containerId", e.target.value.trim().toUpperCase())}
              placeholder="GTM-XXXXXXX"
              className="rounded-xl border-border/70 font-mono text-sm max-w-md"
            />
            {errors["analytics.gtm.containerId"] && (
              <p className="text-xs text-destructive">
                {errors["analytics.gtm.containerId"]}
              </p>
            )}
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/80" />
              Found in your Google Tag Manager dashboard header (e.g. GTM-XXXXXXX).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
