import ClientIsland from "@/components/client-island";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fustat, Geist } from "next/font/google";
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

const siteUrl = "https://enviroshieldbd.com";

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
      "Professional waterproofing, flooring, heat insulation, injection grouting, polished concrete, and protective coating solutions.",
  },

  other: {
    "fb:pages": "YOUR_FACEBOOK_PAGE_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", fustat.variable)}>
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
                    "@id": "https://enviroshieldbd.com/#organization",
                    name: "EnviroShield Pvt. Ltd.",
                    url: "https://enviroshieldbd.com",
                    logo: {
                      "@type": "ImageObject",
                      url: "https://enviroshieldbd.com/images/logo.png",
                    },
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://enviroshieldbd.com/#website",
                    url: "https://enviroshieldbd.com",
                    name: "EnviroShield",
                    publisher: {
                      "@id":
                        "https://enviroshieldbd.com/#organization",
                    },
                  },
                ],
              }),
            }}
          />
          {children}
          <Toaster />
          <ClientIsland />
        </TooltipProvider>
      </body>
    </html>
  );
}
