import ClientIsland from "@/components/client-island";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteUrl } from "@/lib/site-url";
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
          <Toaster />
          <ClientIsland />
        </TooltipProvider>
      </body>
    </html>
  );
}
