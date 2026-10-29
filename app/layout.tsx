import GlobalToastListener from "@/components/GlobalToastListener";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fustat, Geist } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { getPublicSettings } from "@/lib/api/settings";
import { TrackingScripts } from "@/components/tracking/TrackingScripts";
import { CookieConsentBanner } from "@/components/consent/CookieConsentBanner";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  const siteName = settings.seo.siteName || "Enviroshield";
  const defaultTitle = settings.seo.defaultTitle || "Enviroshield";
  const defaultDesc =
    settings.seo.defaultDescription ||
    "Enviroshield provides waterproofing, waterproofing paint, heatproofing, epoxy and PU flooring, injection grouting, expansion joint sealing, sports flooring, polished concrete, 3D epoxy floors, floor hardener, and ETP coating in Bangladesh.";
  const defaultOgImg = settings.seo.defaultOgImage || "/images/logo.png";

  const verification: NonNullable<Metadata["verification"]> = {};
  if (settings.seo.googleVerificationToken) {
    verification.google = settings.seo.googleVerificationToken;
  }
  if (settings.seo.bingVerificationToken) {
    verification.other = {
      "msvalidate.01": settings.seo.bingVerificationToken,
    };
  }

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },

    description: defaultDesc,

    applicationName: siteName,

    verification: Object.keys(verification).length > 0 ? verification : undefined,

    robots: {
      index: settings.seo.defaultRobots?.index ?? true,
      follow: settings.seo.defaultRobots?.follow ?? true,
    },

    openGraph: {
      type: "website",
      siteName,
      title: defaultTitle,
      description: defaultDesc,
      url: siteUrl,
      images: defaultOgImg ? [{ url: defaultOgImg }] : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDesc,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();

  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable, fustat.variable)}
    >
      <body className="min-h-screen antialiased">
        <TrackingScripts settings={settings} />

        <TooltipProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": `${siteUrl}/#organization`,
                    name: "EnviroShield Pvt. Ltd.",
                    url: siteUrl,
                    logo: {
                      "@type": "ImageObject",
                      url: `${siteUrl}/images/logo.png`,
                    },
                  },
                  {
                    "@type": "WebSite",
                    "@id": `${siteUrl}/#website`,
                    url: siteUrl,
                    name: "EnviroShield",
                    publisher: {
                      "@id": `${siteUrl}/#organization`,
                    },
                  },
                ],
              }),
            }}
          />
          {children}

          <CookieConsentBanner consentSettings={settings.consent} />

          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4500}
            visibleToasts={4}
            toastOptions={{
              classNames: {
                toast:
                  "rounded-2xl border shadow-xl backdrop-blur-md !px-5 !py-4",
                title: "!font-semibold !text-sm",
                description: "!text-sm !opacity-90",
                closeButton: "!rounded-full",
              },
            }}
          />

          <Suspense fallback={null}>
            <GlobalToastListener />
          </Suspense>
        </TooltipProvider>
      </body>
    </html>
  );
}
