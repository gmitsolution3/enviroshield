import GlobalToastListener from "@/components/GlobalToastListener";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fustat, Geist } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Enviroshield",
    template: "%s | Enviroshield",
  },

  description:
    "Enviroshield provides waterproofing, waterproofing paint, heatproofing, epoxy and PU flooring, injection grouting, expansion joint sealing, sports flooring, polished concrete, 3D epoxy floors, floor hardener, and ETP coating in Bangladesh.",

  applicationName: "Enviroshield",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "Enviroshield",
    title: "Enviroshield",
    description:
      "Professional waterproofing, waterproofing paint, heatproofing, epoxy and PU flooring, injection grouting, expansion joint sealing, sports flooring, polished concrete, 3D epoxy floors, floor hardener, and ETP coating.",
    url: siteUrl,
  },

  twitter: {
    card: "summary_large_image",
    title: "Enviroshield",
    description:
      "Professional waterproofing, waterproofing paint, heatproofing, epoxy and PU flooring, injection grouting, expansion joint sealing, sports flooring, polished concrete, 3D epoxy floors, floor hardener, and ETP coating in Bangladesh.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable, fustat.variable)}
    >
      <body className="min-h-screen antialiased">
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
