"use client";

import { Globe, Info, ShieldCheck } from "lucide-react";
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
import { ISeoSettings } from "@/types/admin/settings.type";

interface GeneralSeoSettingsProps {
  data: ISeoSettings;
  onChange: (data: ISeoSettings) => void;
  errors?: Record<string, string>;
}

export function GeneralSeoSettings({
  data,
  onChange,
  errors = {},
}: GeneralSeoSettingsProps) {
  const updateField = <K extends keyof ISeoSettings>(
    field: K,
    value: ISeoSettings[K],
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateRobots = (key: "index" | "follow", value: boolean) => {
    onChange({
      ...data,
      defaultRobots: {
        ...data.defaultRobots,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Site Identity & Metadata Defaults */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/10 text-blue">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Global Metadata Defaults
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Fallback titles, descriptions, and Open Graph attributes for public pages that do not define custom SEO tags.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6 py-6 sm:px-7">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-sm font-medium">
                Website Name
              </Label>
              <Input
                id="siteName"
                value={data.siteName || ""}
                onChange={(e) => updateField("siteName", e.target.value)}
                placeholder="Enviroshield"
                className="rounded-xl border-border/70"
              />
              {errors.siteName && (
                <p className="text-xs text-destructive">{errors.siteName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultTitle" className="text-sm font-medium">
                Default Title Template
              </Label>
              <Input
                id="defaultTitle"
                value={data.defaultTitle || ""}
                onChange={(e) => updateField("defaultTitle", e.target.value)}
                placeholder="Enviroshield"
                className="rounded-xl border-border/70"
              />
              {errors.defaultTitle && (
                <p className="text-xs text-destructive">{errors.defaultTitle}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultDescription" className="text-sm font-medium">
              Default Meta Description
            </Label>
            <Textarea
              id="defaultDescription"
              rows={3}
              value={data.defaultDescription || ""}
              onChange={(e) => updateField("defaultDescription", e.target.value)}
              placeholder="Enviroshield provides waterproofing, waterproofing paint, heatproofing, epoxy and PU flooring..."
              className="resize-y rounded-xl border-border/70"
            />
            {errors.defaultDescription && (
              <p className="text-xs text-destructive">
                {errors.defaultDescription}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Recommended length: 140–160 characters. Dynamic pages and dedicated landing pages will override this default.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultOgImage" className="text-sm font-medium">
              Default Social Share (Open Graph) Image URL
            </Label>
            <Input
              id="defaultOgImage"
              value={data.defaultOgImage || ""}
              onChange={(e) => updateField("defaultOgImage", e.target.value)}
              placeholder="/images/logo.png"
              className="rounded-xl border-border/70"
            />
            {errors.defaultOgImage && (
              <p className="text-xs text-destructive">{errors.defaultOgImage}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Webmaster Verification Tokens */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal/10 text-teal">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Search Engine Verification
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Domain ownership verification tokens rendered in the HTML &lt;head&gt;.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6 py-6 sm:px-7">
          <div className="rounded-xl border border-blue/20 bg-blue/5 p-4 text-xs text-blue flex items-start gap-2.5">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Saving these verification tokens publishes the corresponding meta tags on your public website. Ownership verification must still be verified within your external Google Search Console or Bing Webmaster Tools console.
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleVerificationToken" className="text-sm font-medium">
              Google Search Console Verification Token
            </Label>
            <Input
              id="googleVerificationToken"
              value={data.googleVerificationToken || ""}
              onChange={(e) =>
                updateField("googleVerificationToken", e.target.value)
              }
              placeholder="e.g. google-site-verification token or code"
              className="rounded-xl border-border/70 font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Extract the code from your Google Search Console HTML Tag method: &lt;meta name=&quot;google-site-verification&quot; content=&quot;<strong>YOUR_TOKEN</strong>&quot; /&gt;
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bingVerificationToken" className="text-sm font-medium">
              Bing Webmaster Tools Verification Token
            </Label>
            <Input
              id="bingVerificationToken"
              value={data.bingVerificationToken || ""}
              onChange={(e) =>
                updateField("bingVerificationToken", e.target.value)
              }
              placeholder="e.g. msvalidate.01 token"
              className="rounded-xl border-border/70 font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Extract the token from your Bing Webmaster meta tag: &lt;meta name=&quot;msvalidate.01&quot; content=&quot;<strong>YOUR_TOKEN</strong>&quot; /&gt;
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Crawl & Indexing Defaults */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <CardTitle className="font-display text-base font-bold tracking-tight">
            Default Crawling & Indexing Policy
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-muted-foreground">
            Baseline robots directives for public pages. Private dashboard, authentication, and cart routes will strictly preserve their private noindex policies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Allow Public Indexing (index)</p>
              <p className="text-xs text-muted-foreground">
                Permits search engines to index public website pages by default.
              </p>
            </div>
            <Switch
              checked={data.defaultRobots?.index ?? true}
              onCheckedChange={(val) => updateRobots("index", val)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <p className="text-sm font-medium">Allow Link Crawling (follow)</p>
              <p className="text-xs text-muted-foreground">
                Permits search engine crawlers to follow links on public pages by default.
              </p>
            </div>
            <Switch
              checked={data.defaultRobots?.follow ?? true}
              onCheckedChange={(val) => updateRobots("follow", val)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
